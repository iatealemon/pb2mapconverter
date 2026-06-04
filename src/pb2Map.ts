/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* 
    This file contains a typed representation of a parsed PB2 map.

    This is useful in a way to process and handle constraints like asset requirements,
    triggers, etc..
*/
import type { PB2Wall, PB3Surface } from '#pb2Objects.js';
import type { ParsedPB2XMLObject, WorldBoundary } from '#utils/types.js';

import { parseGeometry, updateWorldBoundary } from '#utils/types.js';
import { PB3StandardFooter, PB3StandardMapHeader } from '#serialize/serialize.js';
import { serializePB2Wall } from '#serialize/wall.js';
import { createPB2WallSurface } from '#utils/surface.js';
import { serializePB3Surface } from '#serialize/surface.js';

export class PB2Map {
	// ============================================================================================
	// PB2 Objects
	private walls: PB2Wall[] = [];

	// Derived PB3 Objects.. (assets, execute method, comments, etc..)
	private wallSurfaces: Record<number, PB3Surface> = {}; // maps every unique PB2 wall material (an id) with a created wall surface.
	private backgroundSurfaces: Record<number, PB3Surface> = {}; // maps every unique PB2 background material (an id) with a created background surface.

	// Metadata
	private worldBoundary: WorldBoundary = { min: { x: Infinity, y: Infinity }, max: { x: -Infinity, y: -Infinity } };

	// ============================================================================================

	// Constructs a valid representation of the PB2 map, given an opaque parsed XML object.
	constructor(xmlFile: any) {
		for (const [pb2ObjectName, pb2Objects] of Object.entries(xmlFile.root)) {
			// @TODO: Validation w/ zod? and more concrete type. (maybe overkill)
			const parsedPB2Objects = pb2Objects as ParsedPB2XMLObject[];

			// Using some form of function object map *may* be more elegant (need to factor in dealing with types).. but let's do this for now.
			switch (pb2ObjectName) {
				case 'box':
					this.walls = this.parsePB2Walls(parsedPB2Objects, this.worldBoundary);
					break;
				default:
					console.warn(`Encountered unknown / unsupported xml tag of ${pb2ObjectName}`);
			}
		}
	}

	// Serializes the current PB2 map intp PB3 source code.
	public serializeToPB3SourceCode = (): string => {
		let pb3SourceCode: string = PB3StandardMapHeader;

		// Order matters..
		for (const [_, wallSurface] of Object.entries(this.wallSurfaces)) {
			pb3SourceCode += serializePB3Surface(wallSurface, true, this.worldBoundary);
		}

		for (const wall of this.walls) {
			pb3SourceCode += serializePB2Wall(wall, this.wallSurfaces);
		}

		pb3SourceCode += PB3StandardFooter;
		return pb3SourceCode;
	};

	// Parses a given PB2 xml object into PB2 wall.
	// When parsing PB2 walls, also keep track of world boundary and materials.
	private parsePB2Walls = (pb2Objects: ParsedPB2XMLObject[], worldBoundary: WorldBoundary): PB2Wall[] => {
		const walls: PB2Wall[] = [];

		let surfaceCount = 0;

		for (const pb2Object of pb2Objects) {
			const geometry = parseGeometry(pb2Object);
			const materialIndex = Number(pb2Object.$.m ?? 0);

			walls.push({
				geometry: geometry,
				materialIndex: materialIndex,
			});

			updateWorldBoundary(worldBoundary, geometry);

			// has this material id been created?
			if (!(materialIndex in this.wallSurfaces)) {
				this.wallSurfaces[materialIndex] = createPB2WallSurface(materialIndex, surfaceCount);
				++surfaceCount;
			}
		}

		return walls;
	};
}
