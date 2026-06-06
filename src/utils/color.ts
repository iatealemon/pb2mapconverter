import { clamp } from './math.js';

export interface Color {
	red: number; // [0-255]
	green: number; // [0-255]
	blue: number; // [0-255]
}

export const blackColor = {
	red: 0,
	green: 0,
	blue: 0,
};

export const whiteColor = {
	red: 255,
	green: 255,
	blue: 255,
};

export const pb2RedColor = {
	red: 228,
	green: 1,
	blue: 0,
};

export const pb2GreenColor = {
	red: 115,
	green: 228,
	blue: 141,
};

export const pb2BlueColor = {
	red: 83,
	green: 177,
	blue: 227,
};

// converts Color to `0xXXXXXX` format, used for serialization.
export function colorToPB2Hex(color: Color): string {
	const r = clamp(color.red, 0, 255).toString(16).padStart(2, '0');
	const g = clamp(color.green, 0, 255).toString(16).padStart(2, '0');
	const b = clamp(color.blue, 0, 255).toString(16).padStart(2, '0');

	return `0x${r}${g}${b}`;
}

// assumes that hex is a valid hex representation.
export const hexToColor = (hex: string): Color => {
	// 1. Remove the '#' character
	const hexCode = hex.replace('#', '');

	// 2. Extract and convert channels to base-10 integers
	return {
		red: parseInt(hexCode.substring(0, 2), 16),
		green: parseInt(hexCode.substring(4, 6), 16),
		blue: parseInt(hexCode.substring(2, 4), 16),
	};
};

export const doubleColor = (color: Color) => {
	return {
		red: clamp(color.red * 2, 0, 255),
		green: clamp(color.green * 2, 0, 255),
		blue: clamp(color.blue * 2, 0, 255),
	};
};

export const multiplyColor = (colorA: Color, colorB: Color) => {
	// We need to normalize them first for proper blending.
	// Blend channel formula: (A / 255) * (B / 255) * 255 -> (A * B) / 255
	const blendChannel = (a: number, b: number): number => {
		return clamp((a * b) / 255, 0, 255);
	};

	return {
		red: blendChannel(colorA.red, colorB.red),
		green: blendChannel(colorA.green, colorB.green),
		blue: blendChannel(colorA.blue, colorB.blue),
	};
};

export const isValidHexCode = (hexCode: string | undefined): hexCode is string => {
	if (hexCode === undefined) {
		return false;
	}

	const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
	return hexColorRegex.test(hexCode);
};
