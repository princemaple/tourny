import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

import {filter} from 'rxjs';

import {definitions} from 'types/supabase';
import {LoadingService} from '../loading.service';
import {SupaService} from '../supa.service';

export type Data = Partial<definitions['tournament']> & {
  venues: definitions['venue'][];
  stages: (definitions['stage'] & {
    groups: (definitions['group'] & {
      participants: definitions['participant'][];
    })[];
    matches: (definitions['match'] & {
      leftP: {name: string} | null;
      rightP: {name: string} | null;
    })[];
  })[];
  participants: definitions['participant'][];
};

const StageQuery = `
  *,
  groups:group(*, participants:participant(id, name)),
  matches:match(*, leftP:left(name), rightP:right(name))
`;

@Component({
  selector: 'tn-tournament-setup',
  templateUrl: './tournament-setup.component.html',
  styleUrls: ['./tournament-setup.component.scss'],
})
export class TournamentSetupComponent {
  tournament: Data | null = null;

  constructor(
    protected loading: LoadingService,
    private route: ActivatedRoute,
    private supa: SupaService,
    private dialog: MatDialog,
  ) {
    this.route.params.subscribe(({id}) => {
      if (!id) {
        return;
      }

      this.loadTournament(id);
    });
  }

  async loadTournament(id: string) {
    const {data} = await this.supa.base
      .from('tournament')
      .select(
        `
          id, name, description, start_at, end_at, meta,
          venues:venue(*),
          stages:stage(${StageQuery}),
          participants:participant(*)
        `,
      )
      .eq('id', id)
      .single();

    this.tournament = data;
  }

  async addVenue() {
    const fd = await import('../form-dialog/form-dialog.component').then(
      m => m.FormDialogComponent,
    );

    this.dialog
      .open(fd, {
        data: {
          fields: [
            {name: 'name', label: 'Name', placeholder: 'YMCA Court A'},
            {
              name: 'description',
              label: 'Description',
              type: 'textarea',
              placeholder: 'Description and/or direction to the venue',
            },
          ],
        },
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(async ({name, description}) => {
        const {data, error} = await this.supa.base
          .from('venue')
          .insert({
            name,
            description,
            user_id: this.supa.user!.id,
            tournament_id: this.tournament!.id,
          } as definitions['venue'])
          .select()
          .single();

        if (error) {
          return alert('failed to add venue...');
        }

        this.tournament!.venues = [...this.tournament!.venues!, data!];
      });
  }

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
      .pipe(filter(Boolean))
      .subscribe(async ({name}) => {
        const {data, error} = await this.supa.base
          .from('participant')
          .insert({
            name,
            user_id: this.supa.user!.id,
            tournament_id: this.tournament!.id,
          } as definitions['participant'])
          .select()
          .single();

        if (error) {
          return alert('failed to add participant...');
        }

        this.tournament!.participants = [...this.tournament!.participants!, data!];
      });
  }

  async bulkAddParticipants() {
    const fd = await import('../form-dialog/form-dialog.component').then(
      m => m.FormDialogComponent,
    );

    this.dialog
      .open(fd, {
        data: {
          fields: [
            {
              name: 'text',
              type: 'textarea',
              label: 'Participants',
              placeholder: 'Team Smith\nTeam Jones\n\n<one name per line>',
            },
          ],
        },
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(async ({text}: {text: string}) => {
        const participants = text
          .split('\n')
          .filter(Boolean)
          .map(name => ({
            name,
            user_id: this.supa.user!.id,
            tournament_id: this.tournament!.id,
          }));
        const {data, error} = await this.supa.base
          .from('participant')
          .insert(participants as definitions['participant'][])
          .select();

        if (error) {
          return alert('failed to add participants...');
        }

        this.tournament!.participants = [...this.tournament!.participants!, ...data!];
      });
  }

  async removeParticipant(p: definitions['participant']) {
    await this.supa.base
      .from('group_participants')
      .delete({count: 'exact'})
      .match({participant_id: p.id});
    await this.supa.base.from('participant').delete().eq('id', p.id);
    this.loadTournament(p.tournament_id);
  }

  async loadStage(s: definitions['stage']) {
    const loadStage = await this.supa.base.from('stage').select(StageQuery).eq('id', s.id).single();

    if (loadStage.error) {
      alert('Failed to refresh stage data!');
    } else {
      Object.assign(s, loadStage.data);
    }
  }
}
