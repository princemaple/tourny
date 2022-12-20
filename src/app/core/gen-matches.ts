import {chunk} from 'lodash-es';
import {definitions} from 'types/supabase';

type Stage = definitions['stage'] & {
  groups: (definitions['group'] & {
    participants: definitions['participant'][];
  })[];
};

function genN(n: number) {
  return new Array(n).fill({});
}

export function genRoundRobinMatches(s: Stage) {
  return s.groups.map(g => {
    const matches: definitions['match'][] = [];
    const odd = g.participants.length % 2;
    let [p1, ...rest] = g.participants;

    for (let round of new Array(odd ? g.participants.length : rest.length)
      .fill(0)
      .map((_, i) => i + 1)) {
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
          games: genN(s.default_best_of),
          sequence: {round, seq: matches.length + 1},
          best_of: s.default_best_of,
        } as definitions['match']);
      }

      if (odd) {
        rest.push(p1);
        p1 = rest.shift()!;
      } else {
        rest.unshift(rest.pop()!);
      }
    }

    return matches;
  });
}

export function genEliminationMatches(s: Stage) {
  return s.groups.map(g => {
    const matches: definitions['match'][] = [];
    let count = g.participants.length - (g.participants.length % 2 ? 0 : 1);
    let index = -1;

    while (count > 0) {
      matches.push({
        id: crypto.randomUUID(),
        tournament_id: s.tournament_id,
        stage_id: s.id,
        group_id: g.id,
        games: genN(s.default_best_of),
        sequence: {seq: index + 2, round: 0},
        best_of: s.default_best_of,
        next_match_id: matches[Math.floor(index / 2)]?.id,
      } as definitions['match']);

      count -= 1;
      index += 1;
    }

    const participants = chunk(g.participants, 2);
    matches.slice(-participants.length).forEach((m, i) => {
      const [l, r] = participants[i];
      m.left = l.id;
      m.right = r?.id;
    });

    return matches;
  });
}

export const GenMatches = {
  map: {
    round_robin: genRoundRobinMatches,
    elimination: genEliminationMatches,
    upper_lower: () => [],
  },

  gen(s: Stage) {
    return this.map[s.type](s);
  },
};
