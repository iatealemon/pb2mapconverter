/* 
    This file contains all the type definition that relates to the PB3 Surface.

    1. Walls
    2. Backgrounds

    In PB2, walls and backgrounds themselves carry information like material and color multiplier.
    In PB3, these informations are seperated into Surfaces, containing material and color multiplier.

    Therefore, for each unique combination of background material + color multiplier, we need to create a surface for it.
*/

import { whiteColor, type Color } from '#utils/color.js';
import type { Geometry } from '#utils/types.js';

// ===============================================
// PB2 Objects
// ===============================================
export interface PB2Wall {
	geometry: Geometry;
	materialIndex: number;
}

// --- PB2 Background ---
export interface PB2Background {
	geometry: Geometry;
	backgroundMaterialIndex: number;
	textureXOffset: number;
	textureYOffset: number;
	drawInFront: boolean;

	// used to identify it's associated background surface.
	surfaceKey: BackgroundIdentifierStr;
}

// ===============================================
// Derived PB3 Objects
// ===============================================
export interface SurfaceInfo {
	readonly surfaceName: string;

	readonly surfaceType:
		| 'pb2SurfaceType.TYPE_PB2PLATFORM_WALL'
		| 'pb2SurfaceType.TYPE_SIMPLE_WALL'
		| 'pb2SurfaceType.TYPE_PLATFORM_WALL'
		| 'pb2SurfaceType.TYPE_SIMPLE_BACKGROUND';

	readonly surfaceTerrain: 'Ground' | 'Grass' | 'Sand' | 'Cliff' | 'Snow' | 'Black' | 'Red' | 'Green' | 'Blue';
}

export interface PB3Surface extends SurfaceInfo {
	uid: string;
	count: number; // useful data to generate other data like position.
	color: Color; // color multiplier (walls dont have color multiplier, so it would be 255, 255, 255).
}

// For each unique combination of background material + color multiplier, we need to create a surface for it.
// We first define a custom type that carries the information of both - then a custom serialize function such that
// This is used as a key for our Record type.
export interface BackgroundIdentifier {
	materialId: number;
	colorMultiplier: Color;
}

export type BackgroundIdentifierStr = `mat:${number}_r:${string}_g:${string}_b:${string}`;

export const getBackgroundKey = (id: BackgroundIdentifier): BackgroundIdentifierStr => {
	return `mat:${id.materialId}_r:${id.colorMultiplier.red}_g:${id.colorMultiplier.green}_b:${id.colorMultiplier.blue}`;
};

// ===============================================
// Mapping PB2's property to PB3..
// ===============================================

const pb2WallMaterialToSurfaceInfo: Record<number, SurfaceInfo> = {
	0: { surfaceName: 'pb2platform_texture', surfaceType: 'pb2SurfaceType.TYPE_PB2PLATFORM_WALL', surfaceTerrain: 'Ground' }, // Concrete
	1: { surfaceName: 'mat_grass', surfaceType: 'pb2SurfaceType.TYPE_SIMPLE_WALL', surfaceTerrain: 'Grass' }, // Grass
	2: { surfaceName: 'mat_sand', surfaceType: 'pb2SurfaceType.TYPE_SIMPLE_WALL', surfaceTerrain: 'Sand' }, // Sand
	3: { surfaceName: 'rock_slice', surfaceType: 'pb2SurfaceType.TYPE_PB2PLATFORM_WALL', surfaceTerrain: 'Ground' }, // Brown concrete
	4: { surfaceName: 'mat_plate1_bg', surfaceType: 'pb2SurfaceType.TYPE_PB2PLATFORM_WALL', surfaceTerrain: 'Ground' }, // Dark plate
	5: { surfaceName: 'mat_grass', surfaceType: 'pb2SurfaceType.TYPE_SIMPLE_WALL', surfaceTerrain: 'Grass' }, // Dry grass
	6: { surfaceName: 'mat_grass', surfaceType: 'pb2SurfaceType.TYPE_SIMPLE_WALL', surfaceTerrain: 'Grass' }, // Dark grass
	7: { surfaceName: 'mat_plate1_bg', surfaceType: 'pb2SurfaceType.TYPE_PB2PLATFORM_WALL', surfaceTerrain: 'Ground' }, // Clean dark plate
	8: { surfaceName: 'mat_plate2_bg', surfaceType: 'pb2SurfaceType.TYPE_PB2PLATFORM_WALL', surfaceTerrain: 'Ground' }, // Bright plate
	9: { surfaceName: 'mat_plate2_bg', surfaceType: 'pb2SurfaceType.TYPE_PB2PLATFORM_WALL', surfaceTerrain: 'Ground' }, // Clean bright plate
	10: { surfaceName: 'platform_texture_usurpation', surfaceType: 'pb2SurfaceType.TYPE_PLATFORM_WALL', surfaceTerrain: 'Ground' }, // Usurpation plate
	11: { surfaceName: 'pb2platform_texture', surfaceType: 'pb2SurfaceType.TYPE_PB2PLATFORM_WALL', surfaceTerrain: 'Ground' }, // Stripes (There is no equivalent)
	12: { surfaceName: 'mat_plate3_bg', surfaceType: 'pb2SurfaceType.TYPE_PB2PLATFORM_WALL', surfaceTerrain: 'Ground' }, // Asphalt
	13: { surfaceName: 'mat_panel_tile', surfaceType: 'pb2SurfaceType.TYPE_PB2PLATFORM_WALL', surfaceTerrain: 'Ground' }, // White concrete
	14: { surfaceName: 'mat_panel_tile', surfaceType: 'pb2SurfaceType.TYPE_PB2PLATFORM_WALL', surfaceTerrain: 'Ground' }, // PB:FTTP-like concrete
	15: { surfaceName: 'mat_sand', surfaceType: 'pb2SurfaceType.TYPE_SIMPLE_WALL', surfaceTerrain: 'Sand' }, // Wet sand
	16: { surfaceName: 'mat_sand', surfaceType: 'pb2SurfaceType.TYPE_SIMPLE_WALL', surfaceTerrain: 'Sand' }, // Mud
	17: { surfaceName: 'platform_texture_usurpation', surfaceType: 'pb2SurfaceType.TYPE_PLATFORM_WALL', surfaceTerrain: 'Ground' }, // Usurpation tiles
	18: { surfaceName: 'pb2platform_texture', surfaceType: 'pb2SurfaceType.TYPE_PB2PLATFORM_WALL', surfaceTerrain: 'Ground' }, // Stone bricks
	19: { surfaceName: 'pb2platform_texture', surfaceType: 'pb2SurfaceType.TYPE_PB2PLATFORM_WALL', surfaceTerrain: 'Ground' }, // Woods
	20: { surfaceName: 'metal_slice', surfaceType: 'pb2SurfaceType.TYPE_PB2PLATFORM_WALL', surfaceTerrain: 'Ground' }, // Rocks
	[-1]: { surfaceName: 'metal_slice', surfaceType: 'pb2SurfaceType.TYPE_PB2PLATFORM_WALL', surfaceTerrain: 'Black' }, // Black
} as const;

const pb2BackgroundMaterialToSurfaceInfo: Record<number, SurfaceInfo> = {
	0: { surfaceName: 'mat_panel_tile', surfaceType: 'pb2SurfaceType.TYPE_SIMPLE_BACKGROUND', surfaceTerrain: 'Ground' }, // Basic
	1: { surfaceName: 'ground_tile', surfaceType: 'pb2SurfaceType.TYPE_SIMPLE_BACKGROUND', surfaceTerrain: 'Ground' }, // Ground
	2: { surfaceName: 'mat_panel2_tile', surfaceType: 'pb2SurfaceType.TYPE_SIMPLE_BACKGROUND', surfaceTerrain: 'Ground' }, // Usurpation
	3: { surfaceName: 'mat_white', surfaceType: 'pb2SurfaceType.TYPE_SIMPLE_BACKGROUND', surfaceTerrain: 'Ground' }, // White
	4: { surfaceName: 'mat_slider_tile', surfaceType: 'pb2SurfaceType.TYPE_SIMPLE_BACKGROUND', surfaceTerrain: 'Ground' }, // Elevator Path
	5: { surfaceName: 'mat_panel3_tile', surfaceType: 'pb2SurfaceType.TYPE_SIMPLE_BACKGROUND', surfaceTerrain: 'Ground' }, // Impure Canal
	6: { surfaceName: 'mat_white', surfaceType: 'pb2SurfaceType.TYPE_SIMPLE_BACKGROUND', surfaceTerrain: 'Red' }, // Red
	7: { surfaceName: 'mat_white', surfaceType: 'pb2SurfaceType.TYPE_SIMPLE_BACKGROUND', surfaceTerrain: 'Green' }, // Green
	8: { surfaceName: 'mat_white', surfaceType: 'pb2SurfaceType.TYPE_SIMPLE_BACKGROUND', surfaceTerrain: 'Blue' }, // Blue
	9: { surfaceName: 'mat_panel4_tile', surfaceType: 'pb2SurfaceType.TYPE_SIMPLE_BACKGROUND', surfaceTerrain: 'Ground' }, // Damned
	10: { surfaceName: 'mat_plate1_bg', surfaceType: 'pb2SurfaceType.TYPE_SIMPLE_BACKGROUND', surfaceTerrain: 'Ground' }, // Panel Default
	11: { surfaceName: 'mat_plate2_bg', surfaceType: 'pb2SurfaceType.TYPE_SIMPLE_BACKGROUND', surfaceTerrain: 'Ground' }, // Panel Bright
	12: { surfaceName: 'mat_plate3_bg', surfaceType: 'pb2SurfaceType.TYPE_SIMPLE_BACKGROUND', surfaceTerrain: 'Ground' }, // Panel Dark
	13: { surfaceName: 'mat_panel8_tile', surfaceType: 'pb2SurfaceType.TYPE_SIMPLE_BACKGROUND', surfaceTerrain: 'Ground' }, // Rocks
	14: { surfaceName: 'platform_texture_dark', surfaceType: 'pb2SurfaceType.TYPE_PLATFORM_WALL', surfaceTerrain: 'Ground' }, // Pixel Wall (No equivalent)
	15: { surfaceName: 'platform_texture_dark', surfaceType: 'pb2SurfaceType.TYPE_PLATFORM_WALL', surfaceTerrain: 'Ground' }, // Pixel Background (No equivalent)
	16: { surfaceName: 'platform_texture_dark', surfaceType: 'pb2SurfaceType.TYPE_PLATFORM_WALL', surfaceTerrain: 'Ground' }, // Pixel Open Door (No equivalent)
} as const;

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const defaultWallSurfaceInfo = pb2WallMaterialToSurfaceInfo[0]!;

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const defaultBackgroundSurfaceInfo = pb2BackgroundMaterialToSurfaceInfo[0]!;

export const pb2ShadowBackgroundMaterial = -1;

export const createPB2WallSurface = (materialIndex: number, count: number): PB3Surface => {
	const wallSurfaceInfo = pb2WallMaterialToSurfaceInfo[materialIndex] ?? defaultWallSurfaceInfo;

	return {
		...wallSurfaceInfo,
		uid: `wallSurface${count}`,
		count: count,
		color: whiteColor,
	};
};

export const createPB2BackgroundSurface = (materialIndex: number, count: number, color: Color): PB3Surface => {
	const backgroundSurfaceInfo = pb2BackgroundMaterialToSurfaceInfo[materialIndex] ?? defaultBackgroundSurfaceInfo;

	return {
		...backgroundSurfaceInfo,
		uid: `backgroundSurface${count}`,
		count: count,
		color: color,
	};
};
