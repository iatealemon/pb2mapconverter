import type { PB2Wall } from '#pb2Objects.js';
import { toPB3String } from './serialize.js';

export const serializePB2Wall = (pb2Wall: PB2Wall): string => {
    const code = `
    pb2GameWorld.CreateBoxShape( 
    { 
        x: ${pb2Wall.geometry.x}, 
        y: ${pb2Wall.geometry.y}, 
        w: ${pb2Wall.geometry.w}, 
        h: ${pb2Wall.geometry.h}, 
        m: null,
        type: pb2Shape.WALL  
    }, 
    `;

    const editor_object = {
        operation: 'create',
        constructor: 'pb2GameWorld.CreateBoxShape',

        x: pb2Wall.geometry.x.toString(),
        y: pb2Wall.geometry.y.toString(),
        w: pb2Wall.geometry.w.toString(),
        h: pb2Wall.geometry.h.toString(),

        m: 'null',
        wc: 'null',
        type: 'pb2Shape.WALL',
        corner: 'pb2Shape.CORNER_NONE',

        dots: 'null',
        _points_being_edited: false,

        _visible: '1',
        _locked: '0',
        _disabled: '0',
        id: '',
    };

    return toPB3String({ code: code, jsonObject: JSON.stringify(editor_object) });
};
