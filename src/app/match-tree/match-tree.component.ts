import {formatDate} from '@angular/common';
import {Component, OnChanges, Input} from '@angular/core';

import {groupBy, keyBy, mapKeys, mapValues, orderBy} from 'lodash-es';

import {definitions} from 'types/supabase';
import {MatchNode} from '../match-node/match-node.component';
import {makeTable} from '../utils/table';

@Component({
  selector: 'tn-match-tree',
  templateUrl: './match-tree.component.html',
  styleUrls: ['./match-tree.component.scss'],
  host: {class: 'block relative'},
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

  private matchData() {
    return orderBy(this.matches, ['sequence.round', 'sequence.seq']).map(m => [
      (m.sequence as {seq: number}).seq,
      (m.sequence as {round: number}).round,
      m.venue?.name,
      m.start_at ? formatDate(m.start_at, 'yyyy-MM-dd', 'en-AU') : '',
      m.start_at ? formatDate(m.start_at, 'HH:mm', 'en-AU') : '',
      m.leftP?.name,
      m.rightP?.name,
    ]);
  }

  copy() {
    const table = makeTable(this.matchData(), '# Round Venue Date Time P1 P2'.split(' '));
    navigator.clipboard.writeText(table);
  }

  download() {
    const anchor = document.createElement('a');
    anchor.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' +
        encodeURIComponent(
          this.matchData()
            .map(line => line.join(','))
            .join('\n'),
        ),
    );
    anchor.setAttribute('download', `${new Date().valueOf()}.csv`);
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
}
