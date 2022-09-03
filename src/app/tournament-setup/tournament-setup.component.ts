import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {CdkDragDrop} from '@angular/cdk/drag-drop';

import {maxBy, startCase} from 'lodash-es';
import {filter} from 'rxjs';

import {definitions} from 'types/supabase';
import {genMatches} from '../core/gen-matches';
import {LoadingService} from '../loading.service';
import {SupaService} from '../supa.service';

type Data = definitions['tournament'] & {
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

  casing = startCase;
  groupName = (n: number) => String.fromCharCode('A'.charCodeAt(0) + n);

  async loadTournament(id: string) {
    const {data} = await this.supa.base
      .from<Data>('tournament')
      .select(
        `
          id, name, description, start_at, end_at, meta,
          stages:stage(${StageQuery}),
          participants:participant(*)
        `,
      )
      .eq('id', id)
      .single();

    this.tournament = data;
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
          .from<definitions['participant']>('participant')
          .insert(participants as definitions['participant'][]);

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
      s.groups = [...s.groups!, {...group, participants: []}] as any;
    }
  }

  async fillParticipants(s: Data['stages'][number]) {
    const groupParticipants = this.tournament!.participants!.map((p, i) => {
      const g = s.groups[i % s.groups.length];
      return {group_id: g.id, participant_id: p.id, order: Math.floor(i / s.groups.length)};
    });

    const insertGroupParticipants = await this.supa.base
      .from<definitions['group_participants']>('group_participants')
      .upsert(groupParticipants);

    if (insertGroupParticipants.error) {
      return alert(`Failed to fill participants into groups!`);
    }

    this.loadStage(s);
  }

  async loadStage(s: definitions['stage']) {
    const loadStage = await this.supa.base
      .from<Exclude<Data['stages'], undefined>[number]>('stage')
      .select(StageQuery)
      .eq('id', s.id)
      .single();

    if (loadStage.error) {
      alert('Failed to refresh stage data!');
    } else {
      Object.assign(s, loadStage.data);
    }
  }

  async changeGroup(
    event: CdkDragDrop<
      Data['stages'][number]['groups'][number],
      Data['stages'][number]['groups'][number],
      definitions['participant']
    >,
    s: definitions['stage'],
  ) {
    await this.supa.base
      .from<definitions['group_participants']>('group_participants')
      .update({group_id: event.container.data.id})
      .match({group_id: event.previousContainer.data.id, participant_id: event.item.data.id});

    this.loadStage(s);
  }

  async clearParticipants(s: Data['stages'][number]) {
    await this.clearMatches(s);

    await this.supa.base
      .from<definitions['group_participants']>('group_participants')
      .delete()
      .in(
        'group_id',
        s.groups.map(g => g.id),
      );

    this.loadStage(s);
  }

  async dropGroup(s: Data['stages'][number]) {
    const {error} = await this.supa.base
      .from<definitions['group']>('group')
      .delete()
      .eq('id', maxBy(s.groups, 'order')!.id);

    if (error) {
      alert('Failed to remove the group at the and. Does it still have participants in it?');
    }

    this.loadStage(s);
  }

  async genMatches(s: Data['stages'][number]) {
    await this.clearMatches(s);

    const matches = genMatches.gen(s).flat();
    await this.supa.base.from<definitions['match']>('match').insert(matches);

    this.loadStage(s);
  }

  async clearMatches(s: Data['stages'][number]) {
    await this.supa.base.from<definitions['match']>('match').delete().match({stage_id: s.id});
  }
}
