import {Component, inject, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import {omit, sortBy} from 'lodash-es';
import {BehaviorSubject, combineLatest, map, of} from 'rxjs';
import {
  Interval,
  startOfDay,
  endOfDay,
  addMinutes,
  isBefore,
  isEqual,
  addDays,
  compareAsc,
  isWithinInterval,
  isAfter,
} from 'date-fns';

import {definitions} from 'types/supabase';
import {Data as Tournament} from '../tournament-setup/tournament-setup.component';
import {CdkDragSortEvent, moveItemInArray} from '@angular/cdk/drag-drop';

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

function parseTime(time: string) {
  return time.split(':').map(s => parseInt(s)) as [number, number];
}

function mergeDateTime(date: Date, time: string) {
  const [hour, minute] = parseTime(time);
  const dt = new Date(date);
  dt.setHours(hour);
  dt.setMinutes(minute);
  return dt;
}

class MatchSlotGenerator {
  #value: {start_at: Date; end_at: Date | null} | undefined = undefined;
  #gen = (function* (rule: InclusiveRule, excludedDates: Interval[]) {
    const {startOn, startAt, endAt, endOn, duration, gap, repeat, repeatDays, venues} = rule;

    const repeatEndDt = endOn ? endOfDay(endOn) : null;

    let dayStartDt: Date | null = mergeDateTime(startOn, startAt);

    do {
      if (excludedDates.some(interval => isWithinInterval(dayStartDt!, interval))) {
        dayStartDt = repeat ? addDays(dayStartDt, repeatDays) : null;
        continue;
      }
      const dayEndDt = endAt ? mergeDateTime(dayStartDt, endAt) : null;

      let matchStartDt: Date | null = dayStartDt;

      do {
        const matchEndDt: Date | null = duration ? addMinutes(matchStartDt!, duration) : dayEndDt;

        if (
          (dayEndDt ? isBefore(matchStartDt, dayEndDt) : true) &&
          (dayEndDt && matchEndDt
            ? isBefore(matchEndDt, dayEndDt) || isEqual(matchEndDt, dayEndDt)
            : true)
        ) {
          for (let venue of venues) {
            yield {start_at: matchStartDt, end_at: matchEndDt, venue, venue_id: venue.id};
          }
        } else {
          break;
        }

        matchStartDt = matchEndDt;
        if (matchStartDt && gap) {
          matchStartDt = addMinutes(matchStartDt, gap);
        }
      } while (matchStartDt);

      dayStartDt = repeat ? addDays(dayStartDt, repeatDays) : null;

      if (!dayStartDt || (repeatEndDt && isAfter(dayStartDt, repeatEndDt))) {
        break;
      }
    } while (dayStartDt);
  })(this.rule, this.excludedDates);

  constructor(private rule: InclusiveRule, private excludedDates: Interval[]) {}

  get value() {
    return this.#value || this.next();
  }

  grab() {
    const value = this.#value;
    this.#value = undefined;
    return value;
  }

  private next() {
    const {value} = this.#gen.next();
    this.#value = value || undefined;
    return this.#value;
  }
}

@Component({
    selector: 'tn-match-scheduler',
    templateUrl: './match-scheduler.component.html',
    styleUrls: ['./match-scheduler.component.scss'],
    standalone: false
})
export class MatchSchedulerComponent implements OnInit {
  ref = inject(MatDialogRef<any>);
  data: {stage: Stage; tournament: Tournament} = inject(MAT_DIALOG_DATA);

  #matches = sortBy(
    this.data.stage.matches.filter(m => m.left && m.right),
    'sequence.seq',
  );
  matches = new BehaviorSubject(this.#matches);
  defaultVenues = this.data.tournament.venues.slice(0, 1);

  rules = new BehaviorSubject<Rule[]>([]);

  scheduledMatches = combineLatest([this.matches, this.rules]).pipe(
    map(([matches, rules]) => {
      const exclusiveRules = rules.filter(r => this.isExclusive(r)) as ExclusiveRule[];
      const inclusiveRules = rules.filter(r => this.isInclusive(r)) as InclusiveRule[];

      const excludedDates = exclusiveRules.map(
        ({startOn, endOn}) => ({start: startOfDay(startOn), end: endOfDay(endOn)} as Interval),
      );
      let includedDatesGen = inclusiveRules.map(r => new MatchSlotGenerator(r, excludedDates));

      return matches.map(match => {
        includedDatesGen = includedDatesGen.filter(g => g.value);
        includedDatesGen.sort((a, b) => compareAsc(a.value!.start_at, b.value!.start_at));

        const candidate = includedDatesGen[0]?.grab();

        return {...match, ...candidate};
      });
    }),
  );

  ngOnInit() {
    let rules: string | null;
    if (
      (rules = localStorage.getItem('RECENT_SCHEDULE')) &&
      confirm('Revive the rules from last time?')
    ) {
      this.rules.next(JSON.parse(rules));
    }
  }

  addRule(f: NgForm, type: 'inclusive' | 'exclusive') {
    const rule = {...f.value, type} as Rule;
    this.rules.next([...this.rules.value, rule]);
    f.resetForm(omit(rule, ['startOn', 'endOn']));
  }

  delRule(rule: Rule) {
    this.rules.next(this.rules.value.filter(r => r !== rule));
  }

  isInclusive(r: Rule): r is InclusiveRule {
    return r.type == 'inclusive';
  }

  isExclusive(r: Rule): r is ExclusiveRule {
    return r.type == 'exclusive';
  }

  saveSchedule() {
    localStorage.setItem('RECENT_SCHEDULE', JSON.stringify(this.rules.value));
  }

  swapPosition(event: CdkDragSortEvent) {
    moveItemInArray(this.#matches, event.previousIndex, event.currentIndex);
    this.matches.next(this.#matches);
  }
}
