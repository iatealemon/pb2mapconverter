/* 
    This file contains all the type definition that relates to PB3's liquid
    1. PB2 liquid object
    2. PB3 liquid kind.

    In PB2, waters themselves carry information like acid damage and act as water.
    In PB3, these informations are seperated into Liquid Kinds, containing these information.

    Therefore, for each unique combination of acid damage and actAsWater boolean, we need to create a liquid kind for it.
*/

import type { Geometry } from '#utils/types.js';

// ===============================================
// PB2 Objects
// ===============================================
export interface PB2Water {
	geometry: Geometry;
	liquidIdentifier: LiquidIdentifierStr; // obtain it's corresponding PB3 liquid kind.
}

// ===============================================
// Derived PB3 Objects
// ===============================================
export interface PB3LiquidKind {
	uid: string;
	count: number;
	damage: number;
	actAsWater: boolean;
}

// For each unique combination of acid damage + whether it acts as a water, we need to create a liquid kind for it.
export interface LiquidIdentifier {
	damage: number;
	actAsWater: boolean;
}

export type LiquidIdentifierStr = `dmg:${number}_water:${boolean}`;

export const getLiquidKindKey = (id: LiquidIdentifier): LiquidIdentifierStr => {
	return `dmg:${id.damage}_water:${id.actAsWater}`;
};
