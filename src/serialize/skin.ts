import type { SkinEntity } from '#pb2Objects/entity-types.js';
import { toPB3String } from './serialize.js';

const DEFAULT_EDITOR_OBJECT = {
    "operation":"create",
    "constructor":"pb2SkinEditor.SpawnDefaultSkin",
    "id":"skin",
    "type":"pb2SkinEditor.SKIN_TYPE_DEFAULT",
    "frame":"2",
    "user_data_uid":"-1",
    "user_data_uid_title":"",
    "x":"0",
    "y":"0",
    "_visible":"1",
    "_locked":"0",
    "_disabled":"0"
};

export const serializeSkin = (entity: SkinEntity, x: number, y: number) => {
    const code = `${entity.uid} = pb2SkinEditor.SpawnDefaultSkin( ${entity.pb3Model} );`;

    const editor_object = {
        ...DEFAULT_EDITOR_OBJECT,
        id: entity.uid,
        frame: entity.pb3Model.toString(),
        x: x.toString(),
        y: y.toString(),
    };

    return toPB3String({ code: code, jsonObject: JSON.stringify(editor_object) });
};