import type { PointEntity } from "#pb2Objects/entity-types.js";
import { toPB3String } from "./serialize.js";

export const serializePoint = (entity: PointEntity): string => {
    const code = `${entity.uid} = new Point({ x: ${entity.position.x}, y: ${entity.position.y} });`;

    const editor_object = {
        "id":entity.uid,
        "operation":"create",
        "constructor":"new Point",
        "x":entity.position.x.toString(),
        "y":entity.position.y.toString(),
        "_visible":"1",
        "_locked":"0",
        "_disabled":"0"
    };

    return toPB3String({ code: code, jsonObject: JSON.stringify(editor_object) });
}