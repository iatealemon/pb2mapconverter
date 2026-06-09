import type { Geometry, ParsedPB2XMLObject, Position, WorldBoundary } from "./types.js";

export const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, Math.round(val)));

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