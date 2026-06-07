import type { BackgroundIdentifierStr, PB2Background, PB3Surface } from '#pb2Objects.js';
import { toPB3String } from './serialize.js';

export const serializePB2Background = (pb2Background: PB2Background, materialIndexToSurface: Record<BackgroundIdentifierStr, PB3Surface>): string => {
	const surfaceUID = materialIndexToSurface[pb2Background.surfaceKey]?.uid ?? 'null';

	const code = `
    pb2GameWorld.CreateBoxShape(
    { 
        x: ${pb2Background.geometry.x}, 
        y: ${pb2Background.geometry.y}, 
        w: ${pb2Background.geometry.w}, 
        h: ${pb2Background.geometry.h}, 
        m: ${surfaceUID}, 
        type: pb2Shape.BACKGROUND  
    });
    `;

	const editor_object = {
		operation: 'create',
		constructor: 'pb2GameWorld.CreateBoxShape',

		x: pb2Background.geometry.x.toString(),
		y: pb2Background.geometry.y.toString(),
		w: pb2Background.geometry.w.toString(),
		h: pb2Background.geometry.h.toString(),

		m: surfaceUID,
		wc: 'null',
		type: 'pb2Shape.BACKGROUND',
		corner: 'pb2Shape.CORNER_NONE',

		dots: 'null',
		_points_being_edited: false,

		_visible: '1',
		_locked: '0',
		_disabled: '0',
		id: '',
		attached_to: 'null',
	};

	return toPB3String({ code: code, jsonObject: JSON.stringify(editor_object) });
};
