/* 
    This file contains a typed representation of a parsed PB2 map.

    This is useful in a way to process and handle constraints like asset requirements,
    triggers, etc..
*/
import type { BooleanAsString, ParsedPB2XMLObject, WorldBoundary, XLMParseOutput } from '#utils/types.js';
import type { SurfaceEntity, LiquidKindEntity, TeamEntity, WallEntity, BackgroundEntity, MovableEntity, WaterEntity, LampEntity, GunEntity, CharacterEntity, SkinEntity, AIPresetEntity } from '#pb2Objects/entity-types.js';
import { getBackgroundKey, type BackgroundIdentifierStr } from '#pb2Objects/surface.js';
import { getLiquidKindKey, type LiquidIdentifierStr } from '#pb2Objects/liquid.js';

import { parseGeometry, updateWorldBoundary } from '#utils/types.js';
import { PB3StandardFooter, PB3StandardMapHeader, serializeForceRegenScript } from '#serialize/serialize.js';
import { serializeBox } from '#serialize/box.js';
import { serializeSurface, SurfaceType } from '#serialize/surface.js';
import { serializeLamp } from '#serialize/lamp.js';
import { serializeGun } from '#serialize/gun.js';
import { doubleColor, hexToColor, isValidHexCode, whiteColor, type Color } from '#utils/color.js';
import { serializeLiquidKind } from '#serialize/liquid.js';
import { createPB2BackgroundSurface, createPB2MovableSurface_isVisible, createPB2WallSurface, pb2ShadowBackgroundMaterial } from '#pb2Objects/surface-map.js';
import { serializeTeam } from '#serialize/team.js';
import { serializeSkin } from '#serialize/skin.js';
import { serializeAIPreset } from '#serialize/ai-preset.js';
import { serializeCharacter } from '#serialize/character.js';
import { PB2GunModelToPB3, PB2SkinToPB3, teamNames } from '#pb2Objects/special-values.js';

export class PB3Map {
	// ============================================================================================
	// PB2 Objects
	private walls: WallEntity[] = [];
	private backgrounds: BackgroundEntity[] = [];
	private lamps: LampEntity[] = [];
	private guns: GunEntity[] = [];
	private waters: WaterEntity[] = [];
	private movables: MovableEntity[] = [];
	private characters: CharacterEntity[] = [];

	// Derived PB3 Objects.. (assets, execute method, comments, etc..)
	private wallSurfaces: Record<number, SurfaceEntity> = {}; 							// maps every unique PB2 wall material (an id) with a created wall surface.
	private backgroundSurfaces: Record<BackgroundIdentifierStr, SurfaceEntity> = {}; 	// maps every unique PB2 background material + color mult with a created background surface.
	private liquidKinds: Record<LiquidIdentifierStr, LiquidKindEntity> = {}; 			// maps every unique PB2 water property with a created liquid kind.
	private movableSurfaces: Partial<Record<BooleanAsString, SurfaceEntity>> = {};		// maps every unique PB2 door "look" with a movable surface. (tbh there's only in/visible 
																						// but it's better to be consistent with the existing architecture.								
	private teams: Record<number, TeamEntity> = {};										// maps every unique PB2 team number property with a created team.
	private skins: Record<number, SkinEntity> = {};
	private aiPresets: Record<number, AIPresetEntity> = {};
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
				case 'gun':
					this.guns = this.parsePB2Gun(parsedPB2Objects);
					break;
				case 'water':
					this.waters = this.parsePB2Water(parsedPB2Objects);
					break;
				case 'door':
					this.movables = this.parsePB2Movable(parsedPB2Objects);
					break;
				case 'player':
				case 'enemy':
					this.characters.push(...this.parsePB2Character(parsedPB2Objects, pb2ObjectName === 'player'));
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
		globalNames.push(...Object.values(this.wallSurfaces).map(s => s.uid));
		globalNames.push(...Object.values(this.backgroundSurfaces).map(s => s.uid));
		globalNames.push(...Object.values(this.movableSurfaces).map(s => s.uid));
		globalNames.push(...Object.values(this.liquidKinds).map(s => s.uid));
		globalNames.push(...Object.values(this.teams).map(s => s.uid));
		globalNames.push(...Object.values(this.skins).map(s => s.uid));
		globalNames.push(...Object.values(this.aiPresets).map(s => s.uid));
		if (globalNames.length > 0) {
			pb3SourceCode += `var ${globalNames.join(', ')};`;
		}

		pb3SourceCode += PB3StandardMapHeader;

		// Order matters.. we first serialize "assets" like objects..
		for (const [_, wallSurface] of Object.entries(this.wallSurfaces)) {
			pb3SourceCode += serializeSurface(wallSurface, SurfaceType.Wall, this.worldBoundary);
		}

		for (const [_, backgroundSurface] of Object.entries(this.backgroundSurfaces)) {
			pb3SourceCode += serializeSurface(backgroundSurface, SurfaceType.Background, this.worldBoundary);
		}

		for (const [_, movableSurface] of Object.entries(this.movableSurfaces)) {
			pb3SourceCode += serializeSurface(movableSurface, SurfaceType.Movable, this.worldBoundary);
		}

		for (const [_, liquidKind] of Object.entries(this.liquidKinds)) {
			pb3SourceCode += serializeLiquidKind(liquidKind, this.worldBoundary);
		}

		for (const [_, team] of Object.entries(this.teams)) {
			pb3SourceCode += serializeTeam(team, this.worldBoundary);
		}

		for (const [_, skin] of Object.entries(this.skins)) {
			pb3SourceCode += serializeSkin(skin, this.worldBoundary);
		}

		for (const [_, ai] of Object.entries(this.aiPresets)) {
			pb3SourceCode += serializeAIPreset(ai, this.worldBoundary);
		}

		// We then serialize object instances..
		for (const wall of this.walls) {
			pb3SourceCode += serializeBox({kind: "wall", entity: wall});
		}

		for (const background of this.backgrounds) {
			pb3SourceCode += serializeBox({kind: "background", entity: background});
		}

		for (const movable of this.movables) {
			pb3SourceCode += serializeBox({kind: "movable", entity: movable});
		}

		for (const water of this.waters) {
			pb3SourceCode += serializeBox({kind: "water", entity: water});
		}

		for (const lamp of this.lamps) {
			pb3SourceCode += serializeLamp(lamp);
		}

		for (const gun of this.guns) {
			pb3SourceCode += serializeGun(gun);
		}

		for (const char of this.characters) {
			pb3SourceCode += serializeCharacter(char);
		}
		pb3SourceCode += serializeForceRegenScript(0, this.worldBoundary.min.y + 50);

		pb3SourceCode += PB3StandardFooter;
		return pb3SourceCode;
	};

	private getWallSurfaceForProps = (materialIndex: number): SurfaceEntity => {
		const key = materialIndex;
		let entity = this.wallSurfaces[key];
		if (entity === undefined) {
			entity = createPB2WallSurface(materialIndex, Object.keys(this.wallSurfaces).length);
			this.wallSurfaces[key] = entity;
		}
		return entity;
	}

	private getBackgroundSurfaceForProps = (materialIndex: number, colorMultiplier: Color): SurfaceEntity => {
		// We use a combination of material id and color multiplier as a unique key to an associated surface.
		const key = getBackgroundKey({materialId: materialIndex, colorMultiplier});
		let entity = this.backgroundSurfaces[key];
		if (entity === undefined) {
			entity = createPB2BackgroundSurface(materialIndex, Object.keys(this.backgroundSurfaces).length, colorMultiplier);
			this.backgroundSurfaces[key] = entity;
		}
		return entity;
	}

	private getLiquidKindForProps = (damage: number, actAsWater: boolean): LiquidKindEntity => {
		// We use a combination of damage and actAsWater as a unique key to an associated liquid.
		const key = getLiquidKindKey({damage, actAsWater});
		let entity = this.liquidKinds[key];
		if (entity === undefined) {
			const count = Object.keys(this.liquidKinds).length;
			entity = {
				uid: `liquidKind${count}`,
				count,
				damage,
				actAsWater
			};
			this.liquidKinds[key] = entity;
		}
		return entity;
	}

	private getMovableSurfaceForProps = (visible: boolean): SurfaceEntity => {
		const key = visible.toString() as BooleanAsString;
		let entity = this.movableSurfaces[key];
		if (entity === undefined) {
			entity = createPB2MovableSurface_isVisible(visible);
			this.movableSurfaces[key] = entity;
		}
		return entity;
	}

	private getTeamForProps = (teamNum: number): TeamEntity => {
		const key = teamNum;
		let entity = this.teams[key];
		if (entity === undefined) {
			const count = Object.keys(this.teams).length;
			entity = {
				uid: `team${count}`,
				name: teamNames[teamNum] ?? `Team ${teamNum}`,
				count,
			};
			this.teams[key] = entity;
		}
		return entity;
	}

	private getSkinForProps = (char: number): SkinEntity => {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const pb3Model = PB2SkinToPB3[char] ?? PB2SkinToPB3[1]!; // marine by default
		const key = pb3Model;
		let entity = this.skins[key];
		if (entity === undefined) {
			const count = Object.keys(this.skins).length;
			entity = {
				uid: `skin${count}`,
				count,
				pb2Model: char,
				pb3Model,
			}
			this.skins[key] = entity;
		}
		return entity;
	}

	private getAIPresetForProps = (): AIPresetEntity => {
		const key = 0;
		let entity = this.aiPresets[key];
		if (entity === undefined) {
			const count = Object.keys(this.aiPresets).length;
			entity = { uid: `aiPreset${count}`, count };
			this.aiPresets[key] = entity;
		}
		return entity;
	}

	// Parses a given PB2 xml object into PB2 wall.
	// When parsing PB2 walls, also keep track of world boundary and materials.
	private parsePB2Walls = (pb2Objects: ParsedPB2XMLObject[]): WallEntity[] => {
		const walls: WallEntity[] = [];

		for (const pb2Object of pb2Objects) {
			const geometry = parseGeometry(pb2Object);
			const materialIndex = Number(pb2Object.$.m ?? 0);

			walls.push({
				geometry: geometry,
				materialIndex: materialIndex,
				surfaceUID: this.getWallSurfaceForProps(materialIndex).uid,
			});

			updateWorldBoundary(this.worldBoundary, geometry);
		}

		return walls;
	};

	// Parses a given PB2 xml object into PB2 background.
	// When parsing PB2 background, also keep track of world boundary and required surface (material and color multiplier).
	private parsePB2Background = (pb2Objects: ParsedPB2XMLObject[]): BackgroundEntity[] => {
		const backgrounds: BackgroundEntity[] = [];

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

			backgrounds.push({
				geometry: geometry,
				backgroundMaterialIndex: materialIndex,
				textureXOffset: Number(pb2Object.$.u ?? 0),
				textureYOffset: Number(pb2Object.$.v ?? 0),
				drawInFront: Boolean(pb2Object.$.f ?? false),
				surfaceUID: this.getBackgroundSurfaceForProps(materialIndex, colorMultiplier).uid,
			});

			updateWorldBoundary(this.worldBoundary, geometry);
		}

		return backgrounds;
	};

	private parsePB2Lamp = (pb2Objects: ParsedPB2XMLObject[]): LampEntity[] => {
		const lamps: LampEntity[] = pb2Objects.map(({$: props}) => ({
			position: {
				x: Number(props.x ?? 0),
				y: Number(props.y ?? 0),
			},
			power: Number(props.power ?? 0),
			hasFlare: ['true', '1'].includes(props.flare ?? 'false'),
		}));
		lamps.forEach(({position}) => updateWorldBoundary(this.worldBoundary, position));
		return lamps;
	};

	private parsePB2Gun = (pb2Objects: ParsedPB2XMLObject[]): GunEntity[] => {
		const guns: GunEntity[] = [];
		for (const {$: props} of pb2Objects) {
			const teamNum = Number(props.command ?? -1);
			const isAnyTeam = teamNum === -1;
			const pb2Model = props.model ?? ''; // default = omit
			const pb3Model = PB2GunModelToPB3[pb2Model] ?? null;
			
			// skip nonexistent models
			if (pb3Model === null) continue;

			guns.push({
				position: {
					x: Number(props.x ?? 0),
					y: Number(props.y ?? 0),
				},
				pb2Model,
				pb3Model,
				team: teamNum,
				upgrade: Number(props.upg ?? 0),
				teamUID: isAnyTeam ? null : this.getTeamForProps(teamNum).uid,
			} satisfies GunEntity);
		}
		guns.forEach(({position}) => updateWorldBoundary(this.worldBoundary, position));
		return guns;
	};
	
	private parsePB2Water = (pb2Objects: ParsedPB2XMLObject[]): WaterEntity[] => {
		const waters: WaterEntity[] = [];

		for (const pb2Object of pb2Objects) {
			const geometry = parseGeometry(pb2Object);
			const damage = Number(pb2Object.$.damage ?? 0);
			const actAsWater = pb2Object.$.friction === undefined ? true : pb2Object.$.friction === 'true';

			waters.push({
				geometry: geometry,
				liquidKindUID: this.getLiquidKindForProps(damage, actAsWater).uid,
			});

			updateWorldBoundary(this.worldBoundary, geometry);
		}

		return waters;
	}

	private parsePB2Movable = (pb2Objects: ParsedPB2XMLObject[]): MovableEntity[] => {
		const movables: MovableEntity[] = [];

		for (const pb2Object of pb2Objects) {
			const geometry = parseGeometry(pb2Object);
			const visible = pb2Object.$.vis === undefined ? true : pb2Object.$.vis === 'true';
			const speed = Number(pb2Object.$.maxspeed ?? 10);

			movables.push({
				geometry: geometry,
				visible: visible,
				speed: speed,
				surfaceUID: this.getMovableSurfaceForProps(visible).uid,
			});

			updateWorldBoundary(this.worldBoundary, geometry);
		}

		return movables;
	}

	private parsePB2Character = (pb2Objects: ParsedPB2XMLObject[], isPlayer: boolean): CharacterEntity[] => {
		const entities: CharacterEntity[] = pb2Objects.map(({$: props}) => {
			const noBehaviour = Number(props.botaction ?? 0) === 4;
			return {
				position: {
					x: Number(props.x ?? 0),
					y: Number(props.y ?? 0),
				},
				velX: Number(props.tox ?? 0),
				velY: Number(props.toy ?? 0),
				hp: Number(props.hea ?? 130),
				hpMax: Number(props.hmax ?? 130),
				direction: Number(props.side) === -1 ? -1 : 1,
				isPlayer: isPlayer,
				teamUID: this.getTeamForProps(Number(props.team ?? -1)).uid,
				skinUID: this.getSkinForProps(Number(props.char ?? 1)).uid,
				aiPresetUID: noBehaviour ? null : this.getAIPresetForProps().uid,
			} satisfies CharacterEntity;
		});
		entities.forEach(({position}) => updateWorldBoundary(this.worldBoundary, position));
		return entities;
	};
}
