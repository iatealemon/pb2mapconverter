import type { PB3Surface } from '#pb2Objects.js';
import type { WorldBoundary } from '#utils/types.js';
import { toPB3String } from './serialize.js';

const editorIconWidth = 50;
const editorIconHeight = 50;

export const serializePB3Surface = (pb3Surface: PB3Surface, is_wall: boolean, worldBoundary: WorldBoundary) => {
	// I only want walls that are grass to generate terrain.
	const toGenerateTerrain = is_wall && (pb3Surface.surfaceTerrain === 'Grass' || pb3Surface.surfaceTerrain === 'Sand');

	// Black is a special sentinel surface I created as a substitute to change color multiplier .. to black.
	const color = pb3Surface.surfaceTerrain === 'Black' ? 'new pb2HighRangeColor( 0x000000 )' : 'new pb2HighRangeColor( 0xffffff )';

	// Revert sentinel value back to an appropriate default value, 'Ground'
	const surfaceTerrain = pb3Surface.surfaceTerrain === 'Black' ? 'Ground' : pb3Surface.surfaceTerrain;

	// Index is used to dynamically calculate appropriate position and name, laying it out in a nice fashion..
	const posX = worldBoundary.min.x + editorIconWidth * pb3Surface.count;
	const posY = worldBoundary.min.y - editorIconHeight * 3;

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
            opacity: 1, 
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
		opacity: '1',
		color: 'new pb2HighRangeColor( 0xffffff )',
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
