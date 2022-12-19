import {Component, inject} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import {omit} from 'lodash-es';
import {BehaviorSubject} from 'rxjs';

import {definitions} from 'types/supabase';
import {Data as Tournament} from '../tournament-setup/tournament-setup.component';

type Stage = Tournament['stages'][number];

type InclusiveRule = {
  type: 'inclusive';
  venues: definitions['venue'][];
  startOn: Date;
  endOn: Date;
  startAt: any;
  endAt: any;
  duration: number;
  gap: number;
  repeat: boolean;
  repeatDays: number;
};

type ExclusiveRule = {
  type: 'exclusive';
  startOn: Date;
  endOn: Date;
};

type Rule = InclusiveRule | ExclusiveRule;

@Component({
  selector: 'tn-match-scheduler',
  templateUrl: './match-scheduler.component.html',
  styleUrls: ['./match-scheduler.component.scss'],
})
export class MatchSchedulerComponent {
  ref = inject(MatDialogRef<any>);
  data: {stage: Stage; tournament: Tournament} = inject(MAT_DIALOG_DATA);

  matches = this.data.stage.matches.filter(m => m.left && m.right);
  defaultVenues = this.data.tournament.venues.slice(0, 1);

  rules = new BehaviorSubject<Rule[]>([]);

  addRule(f: NgForm, type: 'inclusive' | 'exclusive') {
    const rule = {...f.value, type} as Rule;
    this.rules.next([...this.rules.value, rule]);
    f.resetForm(omit(rule, ['startOn', 'endOn']));
  }

  delRule(rule: Rule) {
    this.rules.next(this.rules.value.filter(r => r !== rule));
  }

  applySchedule() {}

  isInclusive(r: Rule): r is InclusiveRule {
    return r.type == 'inclusive';
  }

  isExclusive(r: Rule): r is ExclusiveRule {
    return r.type == 'exclusive';
  }
}
