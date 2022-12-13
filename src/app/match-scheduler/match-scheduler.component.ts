import {Component, inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import {Data as Tournament} from '../tournament-setup/tournament-setup.component';

type Stage = Tournament['stages'][number];

@Component({
  selector: 'tn-match-scheduler',
  templateUrl: './match-scheduler.component.html',
  styleUrls: ['./match-scheduler.component.scss'],
})
export class MatchSchedulerComponent {
  ref = inject(MatDialogRef<any>);
  data: {stage: Stage; tournament: Tournament} = inject(MAT_DIALOG_DATA);
  defaultVenues = this.data.tournament.venues.slice(0, 1);

  applySchedule() {}
}
