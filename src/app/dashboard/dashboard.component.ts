import {Component, OnInit} from '@angular/core';

import {startCase} from 'lodash-es';

import {definitions} from 'types/supabase';
import {SupaService} from '../supa.service';

type Data = Partial<definitions['tournament']> & {stage: definitions['stage'][]};

@Component({
    selector: 'tn-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: false
})
export class DashboardComponent implements OnInit {
  tournaments: Data[] = [];

  constructor(private supa: SupaService) {}

  async ngOnInit() {
    this.tournaments = await this.supa.base
      .from('tournament')
      .select(`id, name, description, start_at, end_at, meta, stage (*)`)
      .eq('user_id', this.supa.user!.id)
      .then(({data}) => data ?? []);
  }

  casing = startCase;
}
