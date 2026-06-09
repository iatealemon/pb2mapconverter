import type { LiquidKindEntity } from '#pb2Objects/entity-types.js';
import { toPB3String } from './serialize.js';

const acidColor = '0x66ff00';
const waterColor = '0x003344';

export const serializeLiquidKind = (liquidKind: LiquidKindEntity, x: number, y: number) => {
	const opacity = liquidKind.actAsWater ? 0.6 : 0;

	const code = `
        ${liquidKind.uid} = pb2WaterClass.DeclareWaterClass({ 
            reflection: 0.8, 
            color: ${liquidKind.damage > 0 ? acidColor : waterColor}, 
            opacity: ${opacity}, 
            glow: false, 
            allow_fixed: true, 
            viscosity: 1, 
            density: 1, 
            extend_left: false, 
            extend_right: false, 
            cover_decals: false, 
            type: ${liquidKind.damage > 0 ? 'pb2WaterClass.TYPE_TOXIC' : 'pb2WaterClass.TYPE_WATER'} 
        });
    `;

	const editor_object = {
		operation: 'create',
		constructor: 'pb2WaterClass.DeclareWaterClass',
		id: liquidKind.uid,
		reflection: '0.8',
		color: liquidKind.damage > 0 ? acidColor : waterColor,
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
		type: liquidKind.damage > 0 ? 'pb2WaterClass.TYPE_TOXIC' : 'pb2WaterClass.TYPE_WATER',
		damage_scale: `${liquidKind.damage}`,
		fire_color: 'new pb2HighRangeColor( 0x723f26 )',
		x: `${x}`,
		y: `${y}`,
		_visible: '1',
		_locked: '0',
		_disabled: '0',
	};

	return toPB3String({ code: code, jsonObject: JSON.stringify(editor_object) });
};
