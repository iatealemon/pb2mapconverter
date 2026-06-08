import type { GunEntity } from '#pb2Objects/entity-types.js';
import { toPB3String } from './serialize.js';

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

export const serializeGun = (entity: GunEntity): string => {
    const code = `
    pb2Gun.CreateGun(
    { 
        x: ${entity.position.x}, 
        y: ${entity.position.y}, 
        type: '${entity.model}', 
        only_allow_for: ${entity.teamUID} 
    });
    `;

    const editor_object = {
        ...DEFAULT_EDITOR_OBJECT,
        x: entity.position.x.toString(),
        y: entity.position.y.toString(),
        type: entity.model,
        only_allow_for: entity.teamUID,
    };

    return toPB3String({ code: code, jsonObject: JSON.stringify(editor_object) });
};
