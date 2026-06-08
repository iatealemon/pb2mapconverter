/* 
    This file contains all the type definition that relates to the PB3 Surface.

    1. Walls
    2. Backgrounds

    In PB2, walls and backgrounds themselves carry information like material and color multiplier.
    In PB3, these informations are seperated into Surfaces, containing material and color multiplier.

    Therefore, for each unique combination of background material + color multiplier, we need to create a surface for it.
*/

import type { Color } from '#utils/color.js';

export type ValidSurfaceTerrain = 'Ground' | 'Grass' | 'Sand' | 'Cliff' | 'Snow' | 'Black' | 'Red' | 'Green' | 'Blue';

export interface SurfaceInfo {
	readonly surfaceName: string;

	readonly surfaceType:
		| 'pb2SurfaceType.TYPE_PB2PLATFORM_WALL'
		| 'pb2SurfaceType.TYPE_SIMPLE_WALL'
		| 'pb2SurfaceType.TYPE_PLATFORM_WALL'
		| 'pb2SurfaceType.TYPE_SIMPLE_BACKGROUND';

	readonly surfaceTerrain: ValidSurfaceTerrain;
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
