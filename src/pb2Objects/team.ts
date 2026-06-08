import type { TeamEntity } from './entity-types.js';

export const teamNames: Record<number, string> = {
    0:  'Alpha',
    1:  'Beta',
    2:  'Gamma',
    3:  'Delta',
    4:  'Zeta',
    5:  'Lambda',
    6:  'Sigma',
    7:  'Omega',
    8:  'Counter-Terrorists',
    9:  'Terrorists',
    10: 'Usurpation Forces',
    11: 'Citizen Security',
    12: 'Red Team',
    13: 'Blue Team',
    14: 'Green Team',
    15: 'White Team',
    16: 'Black Team',
    [-2]: 'Special B',
    [-3]: 'Special C',
    [-4]: 'Special D',
    [-5]: 'Special E',
    [-6]: 'Special F',
} as const;

export const createTeam = (teamNum: number, count: number): TeamEntity => {
    return {
        uid: `team${count}`,
        name: teamNames[teamNum] ?? `Team ${teamNum}`,
        count,
    };
}