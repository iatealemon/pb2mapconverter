/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* 
    This file contains a typed representation of a parsed PB2 map.

    This is useful in a way to process and handle constraints like asset requirements,
    triggers, etc..
*/
import type { PB2Wall } from '#pb2Objects.js';
import type { ParsedPB2XMLObject } from '#parse.js';

import { parsePB2Walls } from '#parse.js';
import { PB3StandardFooter, PB3StandardMapHeader } from '#serialize/serialize.js';
import { serializePB2Wall } from '#serialize/wall.js';

export class PB2Map {
    // ==============================================
    // PB2 Objects
    private walls: PB2Wall[] = [];

    // Derived PB3 Objects.. (assets, execute method, comments, etc..)
    // ==============================================

    // Constructs a valid representation of the PB2 map, given an opaque parsed XML object.
    constructor(xmlFile: any) {
        for (const [pb2ObjectName, pb2Objects] of Object.entries(xmlFile.root)) {
            // @TODO: Validation w/ zod? and more concrete type. (maybe overkill)
            const parsedPB2Objects = pb2Objects as ParsedPB2XMLObject[];

            // Using some form of function object map *may* be more elegant (need to factor in dealing with types).. but let's do this for now.
            switch (pb2ObjectName) {
                case 'box':
                    this.walls = parsePB2Walls(parsedPB2Objects);
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
        for (const wall of this.walls) {
            pb3SourceCode += serializePB2Wall(wall);
        }

        pb3SourceCode += PB3StandardFooter;
        return pb3SourceCode;
    };

    public createAssets = () => {};
}
