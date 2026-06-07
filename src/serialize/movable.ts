import type { PB2Movable, PB3Surface } from '#pb2Objects/surface.js';
import type { BooleanAsString } from '#utils/types.js';
import { toPB3String } from './serialize.js';

export const serializePB2Movable = (pb2Movable: PB2Movable, surfaceRecord: Partial<Record<BooleanAsString, PB3Surface>>): string => {
	const surfaceUID = surfaceRecord[`${pb2Movable.visible}`]?.uid ?? 'null';

	const code = `
    pb2GameWorld.CreateBoxShape( 
    { 
        x: ${pb2Movable.geometry.x}, 
        y: ${pb2Movable.geometry.y}, 
        w: ${pb2Movable.geometry.w}, 
        h: ${pb2Movable.geometry.h}, 
        m: ${surfaceUID},
        type: pb2Shape.MOVABLE,
        hea: 0
    }), 
    `;

	const editor_object = {
		operation: 'create',
		constructor: 'pb2GameWorld.CreateBoxShape',
		id: '',

		x: pb2Movable.geometry.x.toString(),
		y: pb2Movable.geometry.y.toString(),
		w: pb2Movable.geometry.w.toString(),
		h: pb2Movable.geometry.h.toString(),

		m: surfaceUID,
		wc: 'null',
		type: 'pb2Shape.MOVABLE',
		corner: 'pb2Shape.CORNER_NONE',
		hea: '0',
		ai_break_allowed: 'true',
		dots: 'null',
		_points_being_edited: false,
		_visible: '1',
		_locked: '0',
		_disabled: '0',
		attached_to: 'null',
		forward_damage: 'true',
		onDeath: 'null',
	};

	return toPB3String({ code: code, jsonObject: JSON.stringify(editor_object) });
};
