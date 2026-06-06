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

export interface ParsedPB2XMLObject {
	$: Record<string, string>;
}

export interface Geometry {
	x: number;
	y: number;
	w: number;
	h: number;
}

// Adjusts the given world boundary if a given point lies outside the boundary. (mutates but i like returning for clarity)
export const updateWorldBoundary = (worldBoundary: WorldBoundary, point: Position): WorldBoundary => {
	worldBoundary.min.x = Math.min(worldBoundary.min.x, point.x);
	worldBoundary.min.y = Math.min(worldBoundary.min.y, point.y);
	worldBoundary.max.x = Math.max(worldBoundary.max.x, point.x);
	worldBoundary.max.y = Math.max(worldBoundary.max.y, point.y);

	return worldBoundary;
};

export const parseGeometry = (pb2Object: ParsedPB2XMLObject): Geometry => {
	return {
		x: Number(pb2Object.$.x ?? 0),
		y: Number(pb2Object.$.y ?? 0),
		w: Number(pb2Object.$.w ?? 0),
		h: Number(pb2Object.$.h ?? 0),
	};
};

export const isValidHexCode = (hexCode: string) => {
	const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
	return hexColorRegex.test(hexCode);
};

// because PB2 hex color multiplier is actually a multiplier from [0-2],
// we need to half it as PB3's color multiplier is from [0-1].
export function halfHexColor(hex: string): string {
	// 1. Remove the '#' character
	const cleanHex = hex.replace('#', '');

	// 2. Extract and convert channels to base-10 integers
	const rInt = parseInt(cleanHex.substring(0, 2), 16);
	const gInt = parseInt(cleanHex.substring(2, 4), 16);
	const bInt = parseInt(cleanHex.substring(4, 6), 16);

	// 3. Half the values (using Math.floor to ensure whole integers)
	const halfR = Math.floor(rInt / 2);
	const halfG = Math.floor(gInt / 2);
	const halfB = Math.floor(bInt / 2);

	// 4. Convert back to hex strings, padded to 2 characters
	// toString(16) changes it to hex, padStart(2, '0') adds a leading zero if needed
	const rHex = halfR.toString(16).padStart(2, '0');
	const gHex = halfG.toString(16).padStart(2, '0');
	const bHex = halfB.toString(16).padStart(2, '0');

	// 5. Combine and return upper-case or lower-case hex string
	return `#${rHex}${gHex}${bHex}`.toUpperCase();
}
