/* 
    This file contains a typed representation of a parsed PB2 map.

    This is useful in a way to process and handle constraints like asset requirements,
    triggers, etc..
*/
import type { BooleanAsString, ParsedPB2XMLObject, WorldBoundary, XLMParseOutput } from '#utils/types.js';
import { getBackgroundKey, type BackgroundIdentifierStr, type PB2Background, type PB2Movable, type PB2Wall, type PB3Surface, type PB2Lamp, type PB2Gun } from '#pb2Objects/surface.js';
import { getLiquidKindKey, type LiquidIdentifierStr, type PB2Water, type PB3LiquidKind } from '#pb2Objects/liquid.js';

import { parseGeometry, updateWorldBoundary } from '#utils/types.js';
import { PB3StandardFooter, PB3StandardMapHeader } from '#serialize/serialize.js';
import { serializePB2Wall } from '#serialize/wall.js';
import { serializePB3Surface, SurfaceType } from '#serialize/surface.js';
import { serializePB2Background } from '#serialize/background.js';
import { serializePB2Lamp } from '#serialize/lamp.js';
import { serializePB2Gun } from '#serialize/gun.js';
import { doubleColor, hexToColor, isValidHexCode, whiteColor, type Color } from '#utils/color.js';
import { serializePB3LiquidKind } from '#serialize/liquid.js';
import { serializePB2Water } from '#serialize/water.js';
import { createPB2BackgroundSurface, createPB2MovableSurface_isVisible, createPB2WallSurface, pb2ShadowBackgroundMaterial } from '#pb2Objects/surface-map.js';
import { serializePB2Movable } from '#serialize/movable.js';

export class PB2Map {
	// ============================================================================================
	// PB2 Objects
	private walls: PB2Wall[] = [];
	private backgrounds: PB2Background[] = [];
	private lamps: PB2Lamp[] = [];
	private guns: PB2Gun[] = [];
	private waters: PB2Water[] = [];
	private movables: PB2Movable[] = [];

	// Derived PB3 Objects.. (assets, execute method, comments, etc..)
	private wallSurfaces: Record<number, PB3Surface> = {}; 							// maps every unique PB2 wall material (an id) with a created wall surface.
	private backgroundSurfaces: Record<BackgroundIdentifierStr, PB3Surface> = {}; 	// maps every unique PB2 background material + color mult with a created background surface.
	private liquidKinds: Record<LiquidIdentifierStr, PB3LiquidKind> = {}; 			// maps every unique PB2 water property with a created liquid kind.
	private movableSurfaces: Partial<Record<BooleanAsString, PB3Surface>> = {};		// maps every unique PB2 door "look" with a movable surface. (tbh there's only in/visible 
																					// but it's better to be consistent with the existing architecture.								
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
				/*case 'gun':
					this.guns = this.parsePB2Gun(parsedPB2Objects);
					break;*/
				case 'water':
					this.waters = this.parsePB2Water(parsedPB2Objects);
					break;
				case 'door':
					this.movables = this.parsePB2Movable(parsedPB2Objects);
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

		// Order matters.. we first serialize "assets" like objects..
		for (const [_, wallSurface] of Object.entries(this.wallSurfaces)) {
			pb3SourceCode += serializePB3Surface(wallSurface, SurfaceType.Wall, this.worldBoundary);
		}

		for (const [_, backgroundSurface] of Object.entries(this.backgroundSurfaces)) {
			pb3SourceCode += serializePB3Surface(backgroundSurface, SurfaceType.Background, this.worldBoundary);
		}

		for (const [_, movableSurface] of Object.entries(this.movableSurfaces)) {
			pb3SourceCode += serializePB3Surface(movableSurface, SurfaceType.Movable, this.worldBoundary);
		}

		for (const [_, liquidKind] of Object.entries(this.liquidKinds)) {
			pb3SourceCode += serializePB3LiquidKind(liquidKind, this.worldBoundary);
		}

		// We then serialize object instances..
		for (const wall of this.walls) {
			pb3SourceCode += serializePB2Wall(wall, this.wallSurfaces);
		}

		for (const background of this.backgrounds) {
			pb3SourceCode += serializePB2Background(background, this.backgroundSurfaces);
		}

		for (const lamp of this.lamps) {
			pb3SourceCode += serializePB2Lamp(lamp);
		}

		for (const gun of this.guns) {
			pb3SourceCode += serializePB2Gun(gun, {});
		}
		
		for (const movable of this.movables) {
			pb3SourceCode += serializePB2Movable(movable, this.movableSurfaces);
		}

		for (const water of this.waters) {
			pb3SourceCode += serializePB2Water(water, this.liquidKinds);
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

			let colorMultiplier: Color = whiteColor;

			// We attempt to parse PB2's color multiplier.
			if (isValidHexCode(pb2Object.$.c)) {
				// We actually need to double the parsed color multiplier. This is because in PB2, the color multiplier
				// actually ranges in the interval of [0, 2]. 
				// This means that in PB2, #FFFFFF actually multiplies the respective color component by a factor of 2, 
				// resulting in a brighter look. 

				// This is also where a limitation of the conversion happens. Because PB3 doesnt support >1 color multiplier factor,
				// we can never imitate color multipliers greater than #808080 in PB2.
				const parsedColorMultiplier = hexToColor(pb2Object.$.c);
				colorMultiplier = doubleColor(parsedColorMultiplier);
			}

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

			// has this specific kind of surface been created?
			if (!(backgroundIdentifierStr in this.backgroundSurfaces)) {
				this.backgroundSurfaces[backgroundIdentifierStr] = createPB2BackgroundSurface(materialIndex, surfaceCount, colorMultiplier);
				++surfaceCount;
			}
		}

		return backgrounds;
	};

	private parsePB2Lamp = (pb2Objects: ParsedPB2XMLObject[]): PB2Lamp[] => {
		const lamps: PB2Lamp[] = pb2Objects.map(({$: props}) => ({
			position: {
				x: Number(props.x ?? 0),
				y: Number(props.y ?? 0),
			},
			power: Number(props.power ?? 0),
			hasFlare: ["true", "1"].includes(props.flare ?? "false"),
		}));
		lamps.forEach(({position}) => updateWorldBoundary(this.worldBoundary, position));
		return lamps;
	};

	private parsePB2Gun = (pb2Objects: ParsedPB2XMLObject[]): PB2Gun[] => {
		const guns: PB2Gun[] = pb2Objects.map(({$: props}) => ({
			position: {
				x: Number(props.x ?? 0),
				y: Number(props.y ?? 0),
			},
			model: props.model ?? "gun_rifle", // todo check what's the default
			team: Number(props.command ?? -1),
			upgrade: Number(props.upg ?? 0),
		}));
		guns.forEach(({position}) => updateWorldBoundary(this.worldBoundary, position));
		return guns;
	};
	
	private parsePB2Water = (pb2Objects: ParsedPB2XMLObject[]): PB2Water[] => {
		const waters: PB2Water[] = [];

		let liquidCount = 0;

		for (const pb2Object of pb2Objects) {
			const geometry = parseGeometry(pb2Object);
			const damage = Number(pb2Object.$.damage ?? 0);
			const actAsWater = pb2Object.$.friction === undefined ? true : pb2Object.$.friction === 'true';

			// We use a combination of damage and actAsWater as a unique key to an associated liquid.
			const liquidIdentifierStr = getLiquidKindKey({ damage: damage, actAsWater: actAsWater });

			waters.push({
				geometry: geometry,
				liquidIdentifier: liquidIdentifierStr
			});

			updateWorldBoundary(this.worldBoundary, geometry);

			// has this specific type of liquid kind been created?
			if (!(liquidIdentifierStr in this.liquidKinds)) {
				this.liquidKinds[liquidIdentifierStr] = {
					uid: `liquidKind${liquidCount}`,
					count: liquidCount,
					damage: damage,
					actAsWater: actAsWater
				};

				++liquidCount;
			}
		}

		return waters;
	}

	private parsePB2Movable = (pb2Objects: ParsedPB2XMLObject[]): PB2Movable[] => {
		const movables: PB2Movable[] = [];

		for (const pb2Object of pb2Objects) {
			const geometry = parseGeometry(pb2Object);
			const visible = pb2Object.$.vis === undefined ? true : pb2Object.$.vis === 'true';
			const speed = Number(pb2Object.$.maxspeed ?? 10);

			movables.push({
				geometry: geometry,
				visible: visible,
				speed: speed
			});

			updateWorldBoundary(this.worldBoundary, geometry);

			// has this specific type of movable surface been created?
			if (!(`${visible}` in this.movableSurfaces)) {
				this.movableSurfaces[`${visible}`] = createPB2MovableSurface_isVisible(visible);
			}
		}

		return movables;
	}
}
