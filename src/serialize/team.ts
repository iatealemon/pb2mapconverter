import type { TeamEntity } from '#pb2Objects/entity-types.js';
import { toPB3String } from './serialize.js';

const DEFAULT_EDITOR_OBJECT = {
    "operation":"create",
    "constructor":"pb2Team.CreateTeam",
    "id":"team",
    "ai_in_team":"false",
    "title":"'Heroes'",
    "hud_color":"new pb2HighRangeColor( 0x6a94ff )",
    "recolor_nicknames_on_overhead":"true",
    "friendly_fire":"true",
    "friendly_damage_multiplier":"1",
    "normal_damage_to_dead_teammates":"true",
    "teammates_collide":"true",
    "allow_private_communication":"true",
    "overheads_visibility":"pb2OverheadHUD.OVERHEAD_VISIBILITY_TEAMMATES_ONLY",
    "x":"0",
    "y":"0",
    "_visible":"1",
    "_locked":"0",
    "_disabled":"0"
};

export const serializeTeam = (team: TeamEntity, x: number, y: number) => {
    const teammatesCollide = team.name !== 'Alpha';

    const code = `
        ${team.uid} = pb2Team.CreateTeam({ 
            ai_in_team: true, 
            title: '${team.name}', 
            hud_color: new pb2HighRangeColor( 0x6a94ff ), 
            recolor_nicknames_on_overhead: true, 
            friendly_fire: false, 
            friendly_damage_multiplier: 1, 
            normal_damage_to_dead_teammates: true, 
            teammates_collide: ${teammatesCollide}, 
            allow_private_communication: true, 
            overheads_visibility: pb2OverheadHUD.OVERHEAD_VISIBILITY_TEAMMATES_ONLY 
        });
    `;

    const editor_object = {
        ...DEFAULT_EDITOR_OBJECT,
        id: team.uid,
        ai_in_team: "true",
        title: `'${team.name}'`,
        friendly_fire: "false",
        teammates_collide: teammatesCollide.toString(),
        x: x.toString(),
        y: y.toString(),
    };

    return toPB3String({ code: code, jsonObject: JSON.stringify(editor_object) });
};
