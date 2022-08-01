import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {definitions} from 'types/supabase';

import {SupaService} from '../supa.service';

@Component({
  selector: 'tn-tournament-form',
  templateUrl: './tournament-form.component.html',
  styleUrls: ['./tournament-form.component.scss'],
})
export class TournamentFormComponent {
  params = {meta: {}, stage: []} as Partial<definitions['tournament']>;

  constructor(private route: ActivatedRoute, private router: Router, private supa: SupaService) {
    this.route.params.subscribe(async ({id}) => {
      if (!id) {
        return;
      }

      const {data} = await supa.base
        .from<definitions['tournament']>('tournament')
        .select('id, name, description, start_at, end_at, meta, stage (*)')
        .eq('id', id)
        .single();

      Object.assign(this.params, data);
    });
  }

  async submit(f: NgForm) {
    const {error} = await this.supa.base
      .from<definitions['tournament']>('tournament')
      .upsert({...f.value, user_id: this.supa.user!.id, id: this.params.id});

    if (error) {
      alert('An error occurred, please try again or report the error. Thank you!');
    } else {
      this.router.navigateByUrl('dashboard');
    }
  }
}
