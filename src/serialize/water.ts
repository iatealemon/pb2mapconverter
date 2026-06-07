import type { LiquidIdentifierStr, PB2Water, PB3LiquidKind } from '#pb2Objects/liquid.js';
import { toPB3String } from './serialize.js';

export const serializePB2Water = (pb2Water: PB2Water, liquidKindRecord: Record<LiquidIdentifierStr, PB3LiquidKind>): string => {
	const liquidUID = liquidKindRecord[pb2Water.liquidIdentifier]?.uid ?? 'null';

	const code = `
    pb2GameWorld.CreateBoxShape( 
    { 
        x: ${pb2Water.geometry.x}, 
        y: ${pb2Water.geometry.y}, 
        w: ${pb2Water.geometry.w}, 
        h: ${pb2Water.geometry.h}, 
        wc: ${liquidUID}, 
        type: pb2Shape.WATER  
    }), 
    `;

	const editor_object = {
		operation: 'create',
		constructor: 'pb2GameWorld.CreateBoxShape',

		x: pb2Water.geometry.x.toString(),
		y: pb2Water.geometry.y.toString(),
		w: pb2Water.geometry.w.toString(),
		h: pb2Water.geometry.h.toString(),

		m: 'null',
		wc: liquidUID,
		type: 'pb2Shape.WATER',
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
