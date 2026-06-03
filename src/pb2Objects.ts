/* 
    This file contains all the type definition that corresponds to a PB2 object, with corresponding sub types like Geometry as well. 
    It also contains all the type definition of a derived PB3 object, like assets (surface, team), etc..
*/

// ===============================================
// Shared
// ===============================================
export interface Geometry {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface UID {
    name: string;
}

// ===============================================
// PB2 Objects
// ===============================================
export interface PB2Wall {
    geometry: Geometry;
    wallMaterialIndex: number;
}

// ===============================================
// Derived PB3 Objects
// ===============================================
