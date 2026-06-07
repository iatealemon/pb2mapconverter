import type { PB2Gun } from '#pb2Objects.js';
import { toPB3String } from './serialize.js';

// pb2Gun.CreateGun({ x: -4440, y: -150, type: 'gun_rifle' });//->Ditto->//{"operation":"create","constructor":"pb2Gun.CreateGun","id":"","x":"-4440","y":"-150","scale":"1","type":"'gun_rifle'","only_allow_for":"null","_visible":"1","_locked":"0","_disabled":"0"}

const DEFAULT_EDITOR_OBJECT = {
    "operation":"create",
    "constructor":"pb2Gun.CreateGun",
    "id":"",
    "x":"0",
    "y":"0",
    "scale":"1",
    "type":"'gun_rifle'",
    "only_allow_for":"null",
    "_visible":"1",
    "_locked":"0",
    "_disabled":"0"
};

export const serializePB2Gun = (entity: PB2Gun, pb3Teams: Record<TeamHashStr, PB3Team>): string => {
    const teamUID = pb3Teams[getTeamHash(entity.team)]?.uid ?? null
    const code = `
    pb2Gun.CreateGun(
    { 
        x: ${entity.position.x}, 
        y: ${entity.position.y}, 
        type: '${entity.model}', 
        only_allow_for: ${teamUID}, 
    });
    `;

    const editor_object = Object.assign({}, DEFAULT_EDITOR_OBJECT, {
        "x":entity.position.x.toString(),
        "y":entity.position.y.toString(),
        "type": entity.model,
        "only_allow_for": teamUID,
    });

    return toPB3String({ code: code, jsonObject: JSON.stringify(editor_object) });
};
