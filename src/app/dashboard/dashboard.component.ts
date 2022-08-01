import {Component, OnInit} from '@angular/core';

import {startCase} from 'lodash';

import {definitions} from 'types/supabase';
import {SupaService} from '../supa.service';

type Data = definitions['tournament'] & {stage: definitions['stage'][]};

@Component({
  selector: 'tn-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  tournaments: Data[] = [];

  constructor(private supa: SupaService) {}

  async ngOnInit() {
    this.tournaments = await this.supa.base
      .from<Data>('tournament')
      .select(`id, name, description, meta, result, stage (id, name, type)`)
      .then(({data}) => data ?? []);
  }

  casing = startCase;
}