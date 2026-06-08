import type { LampEntity } from '#pb2Objects/entity-types.js';
import { toPB3String } from './serialize.js';

const DEFAULT_EDITOR_OBJECT = {
    "operation":"create",
    "constructor":"pb2Light.CreateLight",
    "id":"",
    "x":"0",
    "y":"0",
    "is_static":"true",
    "color":"0xffffff",
    "power":"0.3",
    "flare":"true",
    "blur":"true",
    "z":"0",
    "scale":"3",
    "attachment":"null",
    "attachment_limb_id":"0",
    "angular_range_from":"0 / 180 * Math.PI",
    "angular_range_length":"360 / 180 * Math.PI",
    "_visible":"1",
    "_locked":"0",
    "_disabled":"0"
};

export const serializeLamp = (entity: LampEntity): string => {
    const code = `
    pb2Light.CreateLight(
    { 
        x: ${entity.position.x}, 
        y: ${entity.position.y}, 
        is_static: true, 
        color: 0xffffff, 
        power: ${entity.power}, 
        flare: ${entity.hasFlare}, 
        blur: false 
    });
    `;

    const editor_object = {
        ...DEFAULT_EDITOR_OBJECT,
        x: entity.position.x.toString(),
        y: entity.position.y.toString(),
        power: entity.power.toString(),
        flare: entity.hasFlare.toString(),
    };

    return toPB3String({ code: code, jsonObject: JSON.stringify(editor_object) });
};
