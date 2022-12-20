import {Component, Input, OnInit} from '@angular/core';
import {definitions} from 'types/supabase';

export type MatchNode = definitions['match'] & {
  leftP: {name: string} | null;
  leftChild: MatchNode;
  rightP: {name: string} | null;
  rightChild: MatchNode;
  venue: {name: string} | null;
};

@Component({
  selector: 'tn-match-node',
  templateUrl: './match-node.component.html',
  styleUrls: ['./match-node.component.scss'],
  host: {
    '[class.child]': '!!match.next_match_id',
  },
})
export class MatchNodeComponent implements OnInit {
  @Input() match!: MatchNode;

  constructor() {}

  ngOnInit(): void {}
}
