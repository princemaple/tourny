import {Component, Input, Output, EventEmitter} from '@angular/core';
import {CdkDragDrop} from '@angular/cdk/drag-drop';

import {startCase} from 'lodash-es';

import {definitions} from 'types/supabase';
import {GenMatches} from '../core/gen-matches';
import {SupaService} from '../supa.service';
import {Data as Tournament} from '../tournament-setup/tournament-setup.component';

type Stage = Tournament['stages'][number];

@Component({
  selector: 'tn-stage-editor',
  templateUrl: './stage-editor.component.html',
  styleUrls: ['./stage-editor.component.scss'],
})
export class StageEditorComponent {
  @Input() tournament!: Tournament;
  @Input() stage!: Stage;
  @Input() index!: number;

  @Output() change = new EventEmitter<Stage>();

  constructor(private supa: SupaService) {}

  casing = startCase;
  groupName = (n: number) => String.fromCharCode('A'.charCodeAt(0) + n);

  async addGroup(s: Stage) {
    const {data: group, error} = await this.supa.base
      .from<definitions['group']>('group')
      .insert({
        user_id: this.supa.user!.id,
        tournament_id: this.tournament!.id,
        stage_id: s.id,
        order: s.groups.length,
        name: this.groupName(s.groups.length),
        winner_count: s.default_winner_count,
      } as definitions['group'])
      .single();

    if (!error) {
      s.groups = [...s.groups!, {...group, participants: []}] as any;
    }
  }

  async fillParticipants(s: Stage) {
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

    this.change.emit(s);
  }

  async changeGroup(
    event: CdkDragDrop<
      Stage['groups'][number],
      Stage['groups'][number],
      definitions['participant']
    >,
    s: Stage,
  ) {
    await this.supa.base
      .from<definitions['group_participants']>('group_participants')
      .update({group_id: event.container.data.id})
      .match({group_id: event.previousContainer.data.id, participant_id: event.item.data.id});

    this.change.emit(s);
  }

  async clearParticipants(s: Stage) {
    await this.clearMatches(s);

    await this.supa.base
      .from<definitions['group_participants']>('group_participants')
      .delete()
      .in(
        'group_id',
        s.groups.map(g => g.id),
      );

    this.change.emit(s);
  }

  async dropGroup(s: Stage, group: Stage['groups'][number]) {
    await this.clearMatches(s);

    await this.supa.base
      .from<definitions['group_participants']>('group_participants')
      .delete()
      .eq('group_id', group.id);

    const {error} = await this.supa.base
      .from<definitions['group']>('group')
      .delete()
      .eq('id', group.id);

    if (error) {
      alert('Failed to remove the group.');
    }

    this.change.emit(s);
  }

  async genMatches(s: Stage) {
    await this.clearMatches(s);

    const matches = GenMatches.gen(s).flat();
    await this.supa.base.from<definitions['match']>('match').insert(matches);

    this.change.emit(s);
  }

  async clearMatches(s: Stage) {
    await this.supa.base.from<definitions['match']>('match').delete().match({stage_id: s.id});
  }
}
