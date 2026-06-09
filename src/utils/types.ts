/*
    This file houses random but useful types.
*/

export interface Position {
	x: number;
	y: number;
}

export interface WorldBoundary {
	min: Position;
	max: Position;
}

export interface XLMParseOutput {
	root: Record<string, ParsedPB2XMLObject[]>;
}

export interface ParsedPB2XMLObject {
	$: Record<string, string>;
}

export interface Geometry {
	x: number;
	y: number;
	w: number;
	h: number;
}

/**
 * -1 = left  
 * 1 = right 
 */
export type Side = -1 | 1;

export type BooleanAsString = `${boolean}`;
