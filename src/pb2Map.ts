/* 
    This file contains a typed representation of a parsed PB2 map.

    This is useful in a way to process and handle constraints like asset requirements,
    triggers, etc..
*/
import type { ParsedPB2XMLObject, WorldBoundary, XLMParseOutput } from '#utils/types.js';
import type { PB2Wall, PB2Background, PB3Surface, BackgroundIdentifierStr, PB2Lamp } from '#pb2Objects.js';

import { getBackgroundKey } from '#pb2Objects.js';
import { halfHexColor, isValidHexCode, parseGeometry, updateWorldBoundary } from '#utils/types.js';
import { PB3StandardFooter, PB3StandardMapHeader } from '#serialize/serialize.js';
import { serializePB2Wall } from '#serialize/wall.js';
import { createPB2BackgroundSurface, createPB2WallSurface, pb2ShadowBackgroundMaterial } from '#utils/surface.js';
import { serializePB3Surface, SurfaceType } from '#serialize/surface.js';
import { serializePB2Background } from '#serialize/background.js';
import { serializePB2Lamp } from '#serialize/lamp.js';

export class PB2Map {
	// ============================================================================================
	// PB2 Objects
	private walls: PB2Wall[] = [];
	private backgrounds: PB2Background[] = [];
	private lamps: PB2Lamp[] = [];

	// Derived PB3 Objects.. (assets, execute method, comments, etc..)
	private wallSurfaces: Record<number, PB3Surface> = {}; 							// maps every unique PB2 wall material (an id) with a created wall surface.
	private backgroundSurfaces: Record<BackgroundIdentifierStr, PB3Surface> = {}; 	// maps every unique PB2 background material + color mult with a created background surface.
																	
	// Metadata
	private worldBoundary: WorldBoundary = { min: { x: Infinity, y: Infinity }, max: { x: -Infinity, y: -Infinity } };

	// ============================================================================================

	// Constructs a valid representation of the PB2 map, given an opaque parsed XML object.
	constructor(xmlFile: XLMParseOutput) {
		for (const [pb2ObjectName, pb2Objects] of Object.entries(xmlFile.root)) {
			// @TODO: Validation w/ zod? and more concrete type. (maybe overkill)
			const parsedPB2Objects = pb2Objects;

			// Using some form of function object map *may* be more elegant (need to factor in dealing with types).. but let's do this for now.
			switch (pb2ObjectName) {
				case 'box':
					this.walls = this.parsePB2Walls(parsedPB2Objects);
					break;
				case 'bg':
					this.backgrounds = this.parsePB2Background(parsedPB2Objects);
					break;
				case 'lamp':
					this.lamps = this.parsePB2Lamp(parsedPB2Objects);
					break;
				default:
					console.warn(`Encountered unknown / unsupported xml tag of ${pb2ObjectName}`);
			}
		}
	}

	// Serializes the current PB2 map intp PB3 source code.
	public serializeToPB3SourceCode = (): string => {
		let pb3SourceCode = '';

		// global vars declaration
		const globalNames: string[] = [];
		const allSurfaces = Object.values(this.wallSurfaces).concat(Object.values(this.backgroundSurfaces));
		globalNames.push(...allSurfaces.map(s => s.uid));
		if (globalNames.length > 0) {
			pb3SourceCode += `var ${globalNames.join(', ')};`;
		}

		pb3SourceCode += PB3StandardMapHeader;

		// Order matters..
		for (const [_, wallSurface] of Object.entries(this.wallSurfaces)) {
			pb3SourceCode += serializePB3Surface(wallSurface, SurfaceType.Wall, this.worldBoundary);
		}

		for (const [_, backgroundSurface] of Object.entries(this.backgroundSurfaces)) {
			pb3SourceCode += serializePB3Surface(backgroundSurface, SurfaceType.Background, this.worldBoundary);
		}

		for (const wall of this.walls) {
			pb3SourceCode += serializePB2Wall(wall, this.wallSurfaces);
		}

		for (const background of this.backgrounds) {
			pb3SourceCode += serializePB2Background(background, this.backgroundSurfaces);
		}

		for (const lamp of this.lamps) {
			pb3SourceCode += serializePB2Lamp(lamp);
		}

		pb3SourceCode += PB3StandardFooter;
		return pb3SourceCode;
	};

	// Parses a given PB2 xml object into PB2 wall.
	// When parsing PB2 walls, also keep track of world boundary and materials.
	private parsePB2Walls = (pb2Objects: ParsedPB2XMLObject[]): PB2Wall[] => {
		const walls: PB2Wall[] = [];

		let surfaceCount = 0;

		for (const pb2Object of pb2Objects) {
			const geometry = parseGeometry(pb2Object);
			const materialIndex = Number(pb2Object.$.m ?? 0);

			walls.push({
				geometry: geometry,
				materialIndex: materialIndex,
			});

			updateWorldBoundary(this.worldBoundary, geometry);

			// has this material id been created?
			if (!(materialIndex in this.wallSurfaces)) {
				this.wallSurfaces[materialIndex] = createPB2WallSurface(materialIndex, surfaceCount);
				++surfaceCount;
			}
		}

		return walls;
	};

	// Parses a given PB2 xml object into PB2 background.
	// When parsing PB2 background, also keep track of world boundary and required surface (material and color multiplier).
	private parsePB2Background = (pb2Objects: ParsedPB2XMLObject[]): PB2Background[] => {
		const backgrounds: PB2Background[] = [];

		let surfaceCount = 0;

		for (const pb2Object of pb2Objects) {
			const geometry = parseGeometry(pb2Object);
			const materialIndex = Number(pb2Object.$.m ?? 0);

			// PB2 had a -1 shadow material type for their shadow map.
			// We don't support this background in PB3.
			if (materialIndex === pb2ShadowBackgroundMaterial) {
				continue;
			}

			const colorMultiplier = pb2Object.$.c && isValidHexCode(pb2Object.$.c) ? halfHexColor(pb2Object.$.c) : "#FFFFFF";

			// We use a combination of material id and color multiplier as a unique key to an associated surface.
			const backgroundIdentifierStr = getBackgroundKey({ materialId: materialIndex, colorMultiplier: colorMultiplier });

			backgrounds.push({
				geometry: geometry,
				backgroundMaterialIndex: materialIndex,
				textureXOffset: Number(pb2Object.$.u ?? 0),
				textureYOffset: Number(pb2Object.$.v ?? 0),
				drawInFront: Boolean(pb2Object.$.f ?? false),
				surfaceKey: backgroundIdentifierStr
			});

			updateWorldBoundary(this.worldBoundary, geometry);

			// has this unique combination of material id and color multiplier found?
			if (!(backgroundIdentifierStr in this.backgroundSurfaces)) {
				this.backgroundSurfaces[backgroundIdentifierStr] = createPB2BackgroundSurface(materialIndex, surfaceCount);
				++surfaceCount;
			}
		}

		return backgrounds;
	};

	private parsePB2Lamp = (pb2Objects: ParsedPB2XMLObject[]): PB2Lamp[] => {
		const lamps = pb2Objects.map(({$: props}) => ({
			position: {
				x: Number(props.x ?? 0),
				y: Number(props.y ?? 0),
			},
			power: Number(props.power ?? 0),
			hasFlare: ["true", "1"].includes(props.flare ?? "false"),
		}));
		lamps.forEach(lamp => updateWorldBoundary(this.worldBoundary, lamp.position));
		return lamps;
	};
}
