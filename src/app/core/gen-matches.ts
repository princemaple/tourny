import {definitions} from 'types/supabase';

type Stage = definitions['stage'] & {
  groups: (definitions['group'] & {
    participants: definitions['participant'][];
  })[];
};

export function genRoundRobinMatches(s: Stage) {
  return s.groups.map(g => {
    const matches: definitions['match'][] = [];
    const [p1, ...rest] = g.participants;

    for (let _ of new Array(rest.length)) {
      const list = [p1, ...rest];

      while (list.length) {
        const left = list.shift();
        const right = list.pop();

        matches.push({
          tournament_id: s.tournament_id,
          stage_id: s.id,
          group_id: g.id,
          left: left!.id,
          right: right?.id,
          games: [{}],
        } as definitions['match']);
      }

      rest.unshift(rest.pop()!);
    }

    return matches;
  });
}
