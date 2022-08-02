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
      groups: definitions['group'][];
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
          stages:stage(*, groups:group(*)),
          participants:participant(*)
        `,
        )
        .eq('id', id)
        .single();

      this.tournament = data;
    });
  }

  casing = startCase;

  async addParticipant() {
    const fd = await import('../form-dialog/form-dialog.component').then(
      m => m.FormDialogComponent,
    );

    this.dialog
      .open(fd, {
        data: {
          submitText: 'Save',
          cancelText: 'Cancel',
          fields: [{name: 'name', label: 'Name', placeholder: 'Jane Doe'}],
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
}
