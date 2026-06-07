import type { PB3Surface } from '#pb2Objects/surface.js';
import type { WorldBoundary } from '#utils/types.js';

import { blackColor, colorToPB2Hex, multiplyColor, pb2BlueColor, pb2GreenColor, pb2RedColor, type Color } from '#utils/color.js';
import { toPB3String } from './serialize.js';

const editorIconWidth = 50;
const editorIconHeight = 50;

// Modern TS way of defining an enum.
export const SurfaceType = {
	Wall: 1,
	Background: 2,
	Movable: 3,
} as const;

type SurfaceT = (typeof SurfaceType)[keyof typeof SurfaceType];

export const serializePB3Surface = (pb3Surface: PB3Surface, surfaceType: SurfaceT, worldBoundary: WorldBoundary) => {
	// Different types of surface (wall, background and movable) have different parameters.
	// We calculate the appropriate parameter here.

	// Only walls that are grass or sand should generate terrain (for foilage effect).
	const toGenerateTerrain = surfaceType === SurfaceType.Wall && (pb3Surface.surfaceTerrain === 'Grass' || pb3Surface.surfaceTerrain === 'Sand');

	let colorMultiplier = pb3Surface.color;
	let surfaceTerrain = pb3Surface.surfaceTerrain;

	// Handling surface terrain sentinel values representing color multipliers..
	// For walls and movables -> Black requires the color multiplier to be .. well black since there's no black material.
	// For backgrounds, there are no native red, green and blue background so we use color multiplier in conjunction with white background.
	switch (pb3Surface.surfaceTerrain) {
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

	// We calculate an appropriate coordinate to place our surface editor objects. We shall place them at the top left corner of
	// the world boundary, row by row.
	let heightPaddingMultplier = 1;

	switch (surfaceType) {
		case SurfaceType.Wall:
			heightPaddingMultplier = 3;
			break;
		case SurfaceType.Background:
			heightPaddingMultplier = 2;
			break;
		default:
			// it's movable. keep default value.
			break;
	}

	// Count is used to dynamically calculate appropriate position and name, laying it out in a nice fashion..
	const posX = worldBoundary.min.x + editorIconWidth * pb3Surface.count;
	const posY = worldBoundary.min.y - editorIconHeight * heightPaddingMultplier;

	// Both movables and walls needs to set parameter to be true. (according to PB3 that is)
	const is_for_wall = surfaceType === SurfaceType.Wall || surfaceType === SurfaceType.Movable;

	return serializeSurface(pb3Surface, toGenerateTerrain, colorMultiplier, is_for_wall, surfaceTerrain, posX, posY);
};

const serializeSurface = (
	pb3Surface: PB3Surface,
	toGenerateTerrain: boolean,
	colorMultiplier: Color,
	is_wall: boolean,
	surfaceTerrain: string,
	posX: number,
	posY: number,
) => {
	const color = `new pb2HighRangeColor( ${colorToPB2Hex(colorMultiplier)} )`;

	const code = `
        ${pb3Surface.uid} = pb2SurfaceType.CreateSurfaceType({ 
            geometry_type: ${pb3Surface.surfaceType}, 
            texture_container: pb2Texture.GetTextureByName('${pb3Surface.surfaceName}'), 
			name: '${pb3Surface.surfaceTerrain}', 
            terrain_generation: ${toGenerateTerrain}, 
			foliage_template: pb2FoliageClass.TEMPLATE_EARTH, 
			has_cliff: true, 
			has_ground: true,
            is_for_wall: ${is_wall}, 
            shader_type: pb2SurfaceType.SHADER_GAMEPLAY, 
            pixelated: false, 
            transparent: false, 
            opacity: ${pb3Surface.visible ? 1 : 0}, 
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
            impact_scale: 1, 
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
		id: pb3Surface.uid,
		geometry_type: pb3Surface.surfaceType,
		texture_container: `pb2Texture.GetTextureByName('${pb3Surface.surfaceName}')`,
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
		opacity: `${pb3Surface.visible ? 1 : 0}`,
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
