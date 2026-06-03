/* eslint-disable @typescript-eslint/no-explicit-any */
/* 
    This file contains all implementation of parsing an opaque javascript object
    given by xml2js into the respective typed PB2 objects.
*/

import type { PB2Wall, Geometry } from '#pb2Objects.js';

export interface ParsedPB2XMLObject {
    $: Record<string, string>;
}

export const parsePB2Walls = (pb2Objects: ParsedPB2XMLObject[]): PB2Wall[] => {
    const walls: PB2Wall[] = [];

    for (const pb2Object of pb2Objects) {
        walls.push({
            geometry: parseGeometry(pb2Object),
            wallMaterialIndex: Number(pb2Object.$.m ?? 0),
        });
    }

    return walls;
};

const parseGeometry = (pb2Object: ParsedPB2XMLObject): Geometry => {
    return {
        x: Number(pb2Object.$.x ?? 0),
        y: Number(pb2Object.$.y ?? 0),
        w: Number(pb2Object.$.w ?? 0),
        h: Number(pb2Object.$.h ?? 0),
    };
};
