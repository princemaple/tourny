import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';

import {startCase} from 'lodash-es';
import {filter, tap} from 'rxjs';

import {definitions} from 'types/supabase';
import {SupaService} from '../supa.service';

type Data = Partial<
  definitions['tournament'] & {
    stages: (definitions['stage'] & {
      groups: (definitions['group'] & {
        participants: definitions['participant'][];
      })[];
    })[];
    participants: definitions['participant'][];
  }
>;

@Component({
  selector: 'tn-tournament-setup',
  templateUrl: './tournament-setup.component.html',
  styleUrls: ['./tournament-setup.component.scss'],
})
export class TournamentSetupComponent {
  tournament: Data | null = null;

  pending = false;

  constructor(private route: ActivatedRoute, private supa: SupaService, private dialog: MatDialog) {
    this.route.params.subscribe(async ({id}) => {
      if (!id) {
        return;
      }

      const {data} = await supa.base
        .from<Data>('tournament')
        .select(
          `
          id, name, description, start_at, end_at, meta,
          stages:stage(*, groups:group(*, participants:participant(name))),
          participants:participant(*)
        `,
        )
        .eq('id', id)
        .single();

      this.tournament = data;
    });
  }

  casing = startCase;
  groupName = (n: number) => String.fromCharCode('A'.charCodeAt(0) + n);

  async addParticipant() {
    const fd = await import('../form-dialog/form-dialog.component').then(
      m => m.FormDialogComponent,
    );

    this.dialog
      .open(fd, {
        data: {
          fields: [{name: 'name', label: 'Name', placeholder: 'Team Smith / Jane Doe'}],
        },
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        tap(() => {
          this.pending = true;
        }),
      )
      .subscribe(async ({name}) => {
        try {
          const {data, error} = await this.supa.base
            .from<definitions['participant']>('participant')
            .insert({
              name,
              user_id: this.supa.user!.id,
              tournament_id: this.tournament!.id,
            } as definitions['participant'])
            .single();

          if (error) {
            return alert('failed to add participant...');
          }

          this.tournament!.participants = [...this.tournament!.participants!, data!];
        } finally {
          this.pending = false;
        }
      });
  }

  async addGroup(s: Exclude<Data['stages'], undefined>[number]) {
    const {data: group, error} = await this.supa.base
      .from<definitions['group']>('group')
      .insert({
        user_id: this.supa.user!.id,
        tournament_id: this.tournament!.id,
        stage_id: s.id,
        order: s.groups.length,
        name: this.groupName(s.groups.length),
      } as definitions['group'])
      .single();

    if (!error) {
      s.groups = [...s.groups!, group] as any;
    }
  }

  fillParticipants(s: Exclude<Data['stages'], undefined>[number]) {
    const requests = this.tournament!.participants!.map(async (p, i) => {
      const g = s.groups[i % s.groups.length];
      const {error} = await this.supa.base
        .from<definitions['group_participants']>('group_participants')
        .upsert({group_id: g.id, participant_id: p.id, order: g.participants.length})
        .single();

      if (error) {
        alert(`Failed to add participant ${p.name} to Group ${g.name}!`);
      }
    });

    Promise.allSettled(requests).then(async () => {
      const {data, error} = await this.supa.base
        .from<Exclude<Data['stages'], undefined>[number]>('stage')
        .select('*, groups:group(*, participants:participant(name))')
        .eq('id', s.id)
        .single();

      if (error) {
        alert('Failed to refresh stage data!');
      } else {
        Object.assign(s, data);
      }
    });
  }
}
