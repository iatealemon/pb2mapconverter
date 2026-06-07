import type { PB2Wall, PB3Surface } from '#pb2Objects.js';
import { toPB3String } from './serialize.js';

export const serializePB2Wall = (pb2Wall: PB2Wall, materialIndexToSurface: Record<number, PB3Surface>): string => {
	const surfaceUID = materialIndexToSurface[pb2Wall.materialIndex]?.uid ?? 'null';

	const code = `
    pb2GameWorld.CreateBoxShape(
    { 
        x: ${pb2Wall.geometry.x}, 
        y: ${pb2Wall.geometry.y}, 
        w: ${pb2Wall.geometry.w}, 
        h: ${pb2Wall.geometry.h}, 
        m: ${surfaceUID}, 
        type: pb2Shape.WALL  
	});
    `;

	const editor_object = {
		operation: 'create',
		constructor: 'pb2GameWorld.CreateBoxShape',

		x: pb2Wall.geometry.x.toString(),
		y: pb2Wall.geometry.y.toString(),
		w: pb2Wall.geometry.w.toString(),
		h: pb2Wall.geometry.h.toString(),

		m: surfaceUID,
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
