/* 
    This file contains all the type definition that corresponds to a PB2 object.
    It also contains all the type definition of a derived PB3 object, like assets (surface, team), etc..
*/

import type { Color } from '#utils/color.js';
import type { Geometry } from '#utils/types.js';

// ===============================================
// PB2 Objects
// ===============================================
// --- PB2 Wall ---
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
// --- PB3 Surface ---
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

// --- PB3 Surface (for backgrounds) ---

// For each unique combination of background material + color multiplier, we need to create a surface for it.
// We first define a custom type that carries the information of both - then a custom serialize function such that
// We can use it as a key for our Record type.
export interface BackgroundIdentifier {
	materialId: number;
	colorMultiplier: Color;
}

export type BackgroundIdentifierStr = `mat:${number}_r:${string}_g:${string}_b:${string}`;

export const getBackgroundKey = (id: BackgroundIdentifier): BackgroundIdentifierStr => {
	return `mat:${id.materialId}_r:${id.colorMultiplier.red}_g:${id.colorMultiplier.green}_b:${id.colorMultiplier.blue}`;
};
