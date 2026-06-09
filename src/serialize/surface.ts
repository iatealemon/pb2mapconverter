import type { SurfaceEntity } from '#pb2Objects/entity-types.js';

import { blackColor, colorToPB2Hex, multiplyColor, pb2BlueColor, pb2GreenColor, pb2RedColor, type Color } from '#utils/color.js';
import { toPB3String } from './serialize.js';

// Modern TS way of defining an enum.
export const SurfaceType = {
	Wall: 1,
	Background: 2,
	Movable: 3,
} as const;

type SurfaceT = (typeof SurfaceType)[keyof typeof SurfaceType];

export const serializeSurface = (surface: SurfaceEntity, surfaceType: SurfaceT, x: number, y: number) => {
	// Different types of surface (wall, background and movable) have different parameters.
	// We calculate the appropriate parameter here.

	// Only walls that are grass or sand should generate terrain (for foilage effect).
	const toGenerateTerrain = surfaceType === SurfaceType.Wall && (surface.surfaceTerrain === 'Grass' || surface.surfaceTerrain === 'Sand');

	let colorMultiplier = surface.color;
	let surfaceTerrain = surface.surfaceTerrain;

	// Handling surface terrain sentinel values representing color multipliers..
	// For walls and movables -> Black requires the color multiplier to be .. well black since there's no black material.
	// For backgrounds, there are no native red, green and blue background so we use color multiplier in conjunction with white background.
	switch (surface.surfaceTerrain) {
		case 'Black': // from a special kind of wall called Black
			colorMultiplier = blackColor; // multiplying anything with black is just black.
			surfaceTerrain = 'Ground';
			break;
		case 'Red':
			colorMultiplier = multiplyColor(pb2RedColor, colorMultiplier);
			surfaceTerrain = 'Ground';
			break;
		case 'Green':
			colorMultiplier = multiplyColor(pb2GreenColor, colorMultiplier);
			surfaceTerrain = 'Ground';
			break;
		case 'Blue':
			colorMultiplier = multiplyColor(pb2BlueColor, colorMultiplier);
			surfaceTerrain = 'Ground';
			break;
	}

	// Both movables and walls needs to set parameter to be true. (according to PB3 that is)
	const is_for_wall = surfaceType === SurfaceType.Wall || surfaceType === SurfaceType.Movable;

	return _serializeSurface(surface, toGenerateTerrain, colorMultiplier, is_for_wall, surfaceTerrain, x, y);
};

const _serializeSurface = (
	surface: SurfaceEntity,
	toGenerateTerrain: boolean,
	colorMultiplier: Color,
	is_wall: boolean,
	surfaceTerrain: string,
	posX: number,
	posY: number,
) => {
	const color = `new pb2HighRangeColor( ${colorToPB2Hex(colorMultiplier)} )`;

	// for avoiding ditto mismatch
	const includeName = toGenerateTerrain;
	const includeFoliageTemplate = toGenerateTerrain && surfaceTerrain === 'Grass';
	const includeHasCliff = toGenerateTerrain && (surfaceTerrain === 'Ground' || surfaceTerrain === 'Grass' || surfaceTerrain === 'Sand' || surfaceTerrain === 'Cliff');
	const includeHasGround = toGenerateTerrain && (surfaceTerrain === 'Grass' || surfaceTerrain === 'Sand' || surfaceTerrain === 'Cliff');
	const includeImpactScale = is_wall;

	const code = `
        ${surface.uid} = pb2SurfaceType.CreateSurfaceType({ 
            geometry_type: ${surface.surfaceType}, 
            texture_container: pb2Texture.GetTextureByName('${surface.surfaceName}'), 
			${includeName ? `name: '${surface.surfaceTerrain}', ` : ''}
            terrain_generation: ${toGenerateTerrain}, 
			${includeFoliageTemplate ? 'foliage_template: pb2FoliageClass.TEMPLATE_EARTH, ' : ''}
			${includeHasCliff ? 'has_cliff: true, ' : ''}
			${includeHasGround ? 'has_ground: true, ' : ''}
            is_for_wall: ${is_wall}, 
            shader_type: pb2SurfaceType.SHADER_GAMEPLAY, 
            pixelated: false, 
            transparent: false, 
            opacity: ${surface.visible ? 1 : 0}, 
            color: ${color}, 
            color_addon: new pb2HighRangeColor( 0x000000 ), 
            appearance: pb2SurfaceType.APPEARANCE_NORMAL, 
            recommended_slices_per_density: 5, 
            debris_material: pb2Entity.MATERIAL_CONCRETE, 
            movable_sounds_preset: null, 
            slice_texture_container: null, 
            slice_color: new pb2HighRangeColor( 0xffffff ), 
            slice_color_addon: new pb2HighRangeColor( 0x000000 ), 
            slice_pixelated: false, 
            slice_transparent: false, 
            slice_appearance: pb2SurfaceType.APPEARANCE_NORMAL, 
            slice_opacity: 1, 
            slice_scale: 1, 
            ${includeImpactScale ? 'impact_scale: 1, ' : ''}
            uv_x: 0, 
            uv_y: 0, 
            uv_z: 0, 
            uv_sx: 1, 
            uv_sy: 1, 
            uv_sz: 1 
        });
    `;

	const editor_object = {
		operation: 'create',
		constructor: 'pb2SurfaceType.CreateSurfaceType',
		id: surface.uid,
		geometry_type: surface.surfaceType,
		texture_container: `pb2Texture.GetTextureByName('${surface.surfaceName}')`,
		name: `'${surfaceTerrain}'`,
		terrain_generation: `${toGenerateTerrain}`,
		foliage_template: 'pb2FoliageClass.TEMPLATE_EARTH',
		has_cliff: 'true',
		has_ground: 'true',
		is_for_wall: `${is_wall}`,
		shader_type: 'pb2SurfaceType.SHADER_GAMEPLAY',
		front_y: 'undefined',
		back_y: 'undefined',
		pixelated: 'false',
		transparent: 'false',
		opacity: `${surface.visible ? 1 : 0}`,
		color: color,
		color_addon: 'new pb2HighRangeColor( 0x000000 )',
		appearance: 'pb2SurfaceType.APPEARANCE_NORMAL',
		recommended_slices_per_density: '5',
		debris_material: 'pb2Entity.MATERIAL_CONCRETE',
		movable_sounds_preset: 'null',
		slice_texture_container: 'null',
		slice_color: 'new pb2HighRangeColor( 0xffffff )',
		slice_color_addon: 'new pb2HighRangeColor( 0x000000 )',
		slice_pixelated: 'false',
		slice_transparent: 'false',
		slice_appearance: 'pb2SurfaceType.APPEARANCE_NORMAL',
		slice_opacity: '1',
		slice_scale: '1',
		impact_scale: '1',
		x: `${posX}`,
		y: `${posY}`,
		_visible: '1',
		_locked: '0',
		_disabled: '0',
		uv_x: '0',
		uv_y: '0',
		uv_z: '0',
		uv_sx: '1',
		uv_sy: '1',
		uv_sz: '1',
	};

	return toPB3String({ code: code, jsonObject: JSON.stringify(editor_object) });
};
