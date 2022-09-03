import {Component, OnChanges, Input} from '@angular/core';

import {groupBy, keyBy, mapKeys, mapValues} from 'lodash-es';

import {definitions} from 'types/supabase';
import {MatchNode} from '../match-node/match-node.component';

@Component({
  selector: 'tn-match-tree',
  templateUrl: './match-tree.component.html',
  styleUrls: ['./match-tree.component.scss'],
})
export class MatchTreeComponent implements OnChanges {
  @Input() groups!: definitions['group'][];
  @Input() matches!: MatchNode[];

  matchGroups!: Record<string, MatchNode[]>;

  ngOnChanges(): void {
    if (this.groups && this.matches) {
      const groupMap = keyBy(this.groups, 'id');

      this.matchGroups = mapKeys(
        mapValues(groupBy(this.matches, 'group_id'), group => {
          const lookup = new Map(group.map(m => [m.id, m]));
          const roots = group.filter(m => !m.next_match_id);
          const descendents = group.filter(m => m.next_match_id);

          descendents.forEach(m => {
            const parent = lookup.get(m.next_match_id!)!;
            if (!parent.leftChild) {
              parent.leftChild = m;
            } else {
              parent.rightChild = m;
            }
          });

          return roots;
        }),
        (_v, key) => groupMap[key].name,
      );
    }
  }
}
