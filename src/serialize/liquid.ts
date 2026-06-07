import type { PB3LiquidKind } from '#pb2Objects/liquid.js';
import type { WorldBoundary } from '#utils/types.js';
import { toPB3String } from './serialize.js';

const editorIconWidth = 50;
const editorIconHeight = 50;

const acidColor = '0x66ff00';
const waterColor = '0x003344';

export const serializePB3LiquidKind = (pb3Liquid: PB3LiquidKind, worldBoundary: WorldBoundary) => {
	// Index is used to dynamically calculate appropriate position and name, laying it out in a nice fashion..
	const posX = worldBoundary.min.x + editorIconWidth * pb3Liquid.count;

	const heightPaddingMultplier = 4;
	const posY = worldBoundary.min.y - editorIconHeight * heightPaddingMultplier;

	const opacity = pb3Liquid.actAsWater ? 0.6 : 0;

	const code = `
        ${pb3Liquid.uid} = pb2WaterClass.DeclareWaterClass({ 
            reflection: 0.8, 
            color: ${pb3Liquid.damage > 0 ? acidColor : waterColor}, 
            opacity: ${opacity}, 
            glow: false, 
            allow_fixed: true, 
            viscosity: 1, 
            density: 1, 
            extend_left: false, 
            extend_right: false, 
            cover_decals: false, 
            type: ${pb3Liquid.damage > 0 ? 'pb2WaterClass.TYPE_TOXIC' : 'pb2WaterClass.TYPE_WATER'} 
        });
    `;

	const editor_object = {
		operation: 'create',
		constructor: 'pb2WaterClass.DeclareWaterClass',
		id: pb3Liquid.uid,
		reflection: '0.8',
		color: pb3Liquid.damage > 0 ? acidColor : waterColor,
		opacity: `${opacity}`,
		glow: 'false',
		allow_fixed: 'true',
		viscosity: '1',
		density: '1',
		depth: 'undefined',
		depth_front: 'undefined',
		extend_left: 'false',
		extend_right: 'false',
		cover_decals: 'false',
		type: pb3Liquid.damage > 0 ? 'pb2WaterClass.TYPE_TOXIC' : 'pb2WaterClass.TYPE_WATER',
		damage_scale: `${pb3Liquid.damage}`,
		fire_color: 'new pb2HighRangeColor( 0x723f26 )',
		x: `${posX}`,
		y: `${posY}`,
		_visible: '1',
		_locked: '0',
		_disabled: '0',
	};

	return toPB3String({ code: code, jsonObject: JSON.stringify(editor_object) });
};
