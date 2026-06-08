/*
    In PB3, box shapes are either
    1. Wall
    2. Background
    3. Water
    4. Movable
    5. Region

    Box shapes by themselves do not carry additional information, other than geometry. They point to their corresponding asset type
    1. Wall, Background & Movable -> Surface
    3. Water
    4. Movable
    5. Region
*/

import type { BackgroundEntity, MovableEntity, WallEntity, WaterEntity } from '#pb2Objects/entity-types.js';
import { toPB3String } from './serialize.js';

export const serializeBox = ({kind, entity}: 
    {kind: 'wall', entity: WallEntity} 
    | {kind: 'background', entity: BackgroundEntity} 
    | {kind: 'water', entity: WaterEntity} 
    | {kind: 'movable', entity: MovableEntity} 
    //| {kind: 'region', entity: RegionEntity} // todo
): string => {
    const model = kind !== 'water' ? entity.surfaceUID : null;
    const waterClass = kind === 'water' ? entity.liquidKindUID : null;
    const type = {
        'wall': 'pb2Shape.WALL',
        'background': 'pb2Shape.BACKGROUND',
        'water': 'pb2Shape.WATER',
        'movable': 'pb2Shape.MOVABLE',
    }[kind];

    const code = `
    pb2GameWorld.CreateBoxShape(
    { 
        x: ${entity.geometry.x}, 
        y: ${entity.geometry.y}, 
        w: ${entity.geometry.w}, 
        h: ${entity.geometry.h}, 
        ${model !== null ? `m: ${model}, ` : ''}
        ${waterClass !== null ? `wc: ${waterClass}, ` : ''}
        type: ${type}${kind === 'movable' ? ', hea: 0' : ''}  
    });
    `;

    const editor_object = {
        operation: 'create',
        constructor: 'pb2GameWorld.CreateBoxShape',

        x: entity.geometry.x.toString(),
        y: entity.geometry.y.toString(),
        w: entity.geometry.w.toString(),
        h: entity.geometry.h.toString(),

        m: model ?? 'null',
        wc: waterClass ?? 'null',
        type: type,
        corner: 'pb2Shape.CORNER_NONE',

        dots: 'null',
        _points_being_edited: false,

        _visible: '1',
        _locked: '0',
        _disabled: '0',
        id: '',
        ...(kind !== 'movable' && kind !== 'background' ? {} : {
            attached_to: 'null',
        }),
        ...(kind !== 'movable' ? {} : {
            hea: '0',
            ai_break_allowed: 'true',
            forward_damage: 'true',
            onDeath: 'null',
        }),
    };

    return toPB3String({ code: code, jsonObject: JSON.stringify(editor_object) });
};