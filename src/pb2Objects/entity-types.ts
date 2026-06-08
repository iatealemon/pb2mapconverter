import type { Color } from '#utils/color.js';
import type { Geometry, Position, Side } from '#utils/types.js';
import type { SurfaceInfo } from './surface.js';

// ===============================================
// PB3 Objects
// ===============================================
export interface SurfaceEntity extends SurfaceInfo {
	uid: string;
	count: number; // useful data to generate other data like position.
	color: Color; // color multiplier (walls dont have color multiplier, so it would be 255, 255, 255).
	visible: boolean; // some movables are not visible.
}

export interface LiquidKindEntity {
	uid: string;
	count: number;
	damage: number;
	actAsWater: boolean;
}

export interface TeamEntity {
    uid: string;
	count: number;
    name: string;
}

export interface SkinEntity {
	uid: string;
	count: number;
	model: number;
}

export interface AIPresetEntity {
	uid: string;
	count: number;
	// is there anything that should be changed from defaults?
}

// ===============================================
// PB2/PB3 Objects
// ===============================================

export interface WallEntity {
	geometry: Geometry;
	materialIndex: number;
    surfaceUID: string; // pb3 property
}

export interface BackgroundEntity {
	geometry: Geometry;
	backgroundMaterialIndex: number;
	textureXOffset: number;
	textureYOffset: number;
	drawInFront: boolean;
	surfaceUID: string; // pb3 property
}

export interface MovableEntity {
	geometry: Geometry;
	visible: boolean;
	speed: number;
	surfaceUID: string; // pb3 property
}

export interface WaterEntity {
	geometry: Geometry;
	liquidKindUID: string; // pb3 property
}

export interface LampEntity {
    position: Position;
    power: number;
    hasFlare: boolean;
}

export interface GunEntity {
    position: Position;
    model: string;
    team: number;
    upgrade: number;
    teamUID: string | null; // pb3 property
}

export interface CharacterEntity {
	position: Position,
	velX: number;
	velY: number;
	hp: number;
	hpMax: number;
	direction: Side;
	isPlayer: boolean;
	teamUID: string; // pb3 property
	skinUID: string; // pb3 property
	aiPresetUID: string | null; // pb3 property
	//vehicle: null | "auto" | unknown; // todo
	//onDeath: null | unknown; // todo
}