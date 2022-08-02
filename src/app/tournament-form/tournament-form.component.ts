import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {definitions} from 'types/supabase';
import {ModelArrayComponent} from '../model-array/model-array.component';

import {SupaService} from '../supa.service';

type Data = Partial<definitions['tournament'] & {stage: definitions['stage'][]}>;

@Component({
  selector: 'tn-tournament-form',
  templateUrl: './tournament-form.component.html',
  styleUrls: ['./tournament-form.component.scss'],
})
export class TournamentFormComponent {
  params = {meta: {}, stage: [this.newStage()]} as Data;

  constructor(private route: ActivatedRoute, private router: Router, private supa: SupaService) {
    this.route.params.subscribe(async ({id}) => {
      if (!id) {
        return;
      }

      const {data} = await supa.base
        .from<Data>('tournament')
        .select('id, name, description, start_at, end_at, meta, stage (*)')
        .eq('id', id)
        .single();

      Object.assign(this.params, data);
    });
  }

  async submit(f: NgForm) {
    const {stage, ...fields} = f.value;
    const {error, data} = await this.supa.base
      .from<definitions['tournament']>('tournament')
      .upsert({...fields, user_id: this.supa.user!.id, id: this.params.id})
      .single();

    if (error) {
      alert('An error occurred, please try again or report the error. Thank you!');
    } else {
      for (let s of stage as definitions['stage'][]) {
        await this.supa.base
          .from<definitions['stage']>('stage')
          .upsert({...s, tournament_id: data!.id});
      }
      this.router.navigateByUrl('dashboard');
    }
  }

  newStage(array?: ModelArrayComponent<any>): Partial<definitions['stage']> {
    return {
      name: '',
      type: 'round_robin',
      user_id: this.supa.user!.id,
      order: array ? array.items.value.length : 0,
    };
  }
}
