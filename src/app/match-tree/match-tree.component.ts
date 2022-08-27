import {Component, OnChanges, Input, SimpleChanges} from '@angular/core';
import {groupBy} from 'lodash-es';
import {definitions} from 'types/supabase';
import {MatchNode} from '../match-node/match-node.component';

@Component({
  selector: 'tn-match-tree',
  templateUrl: './match-tree.component.html',
  styleUrls: ['./match-tree.component.scss'],
})
export class MatchTreeComponent implements OnChanges {
  @Input() matches!: definitions['match'][];

  groups!: MatchNode[][];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['matches']) {
      this.groups = Object.values(
        groupBy(changes['matches'].currentValue as MatchNode[], 'group_id'),
      ).map(group => {
        const roots = group.filter(m => !m.next_match_id);
        const lookup = new Map(roots.map(m => [m.id, m]));
        const descendents = group.filter(m => m.next_match_id);

        descendents.forEach(m => {
          const parent = lookup.get(m.next_match_id!)!;
          if (!parent.leftChild) {
            parent.leftChild = m;
          } else {
            parent.rightChild = m;
          }
          lookup.set(m.id, m);
        });

        return roots;
      });
    }
  }
}
