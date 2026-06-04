/* 
    This file contains all the type definition that corresponds to a PB2 object.
    It also contains all the type definition of a derived PB3 object, like assets (surface, team), etc..
*/

import type { Geometry } from '#utils/types.js';

// ===============================================
// PB2 Objects
// ===============================================
// --- PB2 Wall ---
export interface PB2Wall {
	geometry: Geometry;
	materialIndex: number;
}

// ===============================================
// Derived PB3 Objects
// ===============================================
// --- PB3 Surface ---
export interface SurfaceInfo {
	readonly surfaceName: string;
	readonly surfaceType: 'pb2SurfaceType.TYPE_PB2PLATFORM_WALL' | 'pb2SurfaceType.TYPE_SIMPLE_WALL' | 'pb2SurfaceType.TYPE_PLATFORM_WALL';
	readonly surfaceTerrain: 'Ground' | 'Grass' | 'Sand' | 'Cliff' | 'Snow' | 'Black';
}

export interface PB3Surface extends SurfaceInfo {
	uid: string;
	count: number; // useful data to generate other data like position.
}
