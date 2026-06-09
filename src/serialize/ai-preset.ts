import type { AIPresetEntity } from '#pb2Objects/entity-types.js';
import { toPB3String } from './serialize.js';

const DEFAULT_EDITOR_OBJECT = {
    "operation":"create",
    "constructor":"Object.AIPreset",
    "id":"",
    "skill":"1",
    "behavior":"pb2AIModule.BEHAVIOR_MPBOT",
    "allow_trace_shots":"true",
    "allow_hit_reporting":"true",
    "factor_for_team_damage_paths_avoidance":"1",
    "rejection_point_for_team_damage_paths":"Infinity",
    "hunt_attacker":"true",
    "hunt_seen_threats":"true",
    "hunt_random_known_threats_range":"1000",
    "heal_teammates":"true",
    "hear_range":"600",
    "x":"0",
    "y":"0",
    "_visible":"1",
    "_locked":"0",
    "_disabled":"0",
    "sequence_behavior":"pb2AIModule.SEQUENCE_BEHAVIOR_SERIOUS"
};

export const serializeAIPreset = (entity: AIPresetEntity, x: number, y: number) => {
    // better but not good. npcs still see too far
    // these will probably be changed
    const hunt_random_known_threats_range = 200;
    const hear_range = 0;

    const code = `
        ${entity.uid} = { 
            skill: 1, 
            behavior: pb2AIModule.BEHAVIOR_MPBOT, 
            allow_trace_shots: true, 
            allow_hit_reporting: true, 
            factor_for_team_damage_paths_avoidance: 1, 
            rejection_point_for_team_damage_paths: Infinity, 
            hunt_attacker: true, 
            hunt_seen_threats: true, 
            hunt_random_known_threats_range: ${hunt_random_known_threats_range}, 
            heal_teammates: true, 
            hear_range: ${hear_range}, 
            sequence_behavior: pb2AIModule.SEQUENCE_BEHAVIOR_SERIOUS 
        };
    `;

    const editor_object = {
        ...DEFAULT_EDITOR_OBJECT,
        id: entity.uid,
        x: x.toString(),
        y: y.toString(),
        hunt_random_known_threats_range: hunt_random_known_threats_range.toString(),
        hear_range: hear_range.toString(),
    };

    return toPB3String({ code: code, jsonObject: JSON.stringify(editor_object) });
};