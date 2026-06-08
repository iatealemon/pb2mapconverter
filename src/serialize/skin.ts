import type { SkinEntity } from '#pb2Objects/entity-types.js';
import type { WorldBoundary } from '#utils/types.js';
import { toPB3String } from './serialize.js';

const editorIconWidth = 50;
const editorIconHeight = 50;

const DEFAULT_EDITOR_OBJECT = {
    "operation":"create",
    "constructor":"pb2SkinEditor.SpawnDefaultSkin",
    "id":"skin",
    "type":"pb2SkinEditor.SKIN_TYPE_DEFAULT",
    "frame":"2",
    "user_data_uid":"-1",
    "user_data_uid_title":"",
    "x":"0",
    "y":"0",
    "_visible":"1",
    "_locked":"0",
    "_disabled":"0"
};

export const serializeSkin = (entity: SkinEntity, worldBoundary: WorldBoundary) => {
    // Index is used to dynamically calculate appropriate position and name, laying it out in a nice fashion..
    const posX = worldBoundary.min.x + editorIconWidth * entity.count;

    const heightPaddingMultplier = 6;
    const posY = worldBoundary.min.y - editorIconHeight * heightPaddingMultplier;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const pb3Skin = PB2SkinToPB3[entity.model] ?? PB2SkinToPB3[1]!; // marine by default

    const code = `${entity.uid} = pb2SkinEditor.SpawnDefaultSkin( ${pb3Skin} );`;

    const editor_object = {
        ...DEFAULT_EDITOR_OBJECT,
        id: entity.uid,
        frame: pb3Skin.toString(),
        x: posX.toString(),
        y: posY.toString(),
    };

    return toPB3String({ code: code, jsonObject: JSON.stringify(editor_object) });
};

const PB2SkinToPB3: Record<number, number | null> = {
    1: 1, // Campaign Hero model
    40: 1, // Lite Hero
    41: 41, // Lite Hero 2
    42: 42, // Lite Hero 3
    43: 43, // Lite Hero 4
    44: 44, // Lite Hero 5
    45: 45, // Lite Hero 6
    46: 46, // Lite Hero 7
    47: 47, // Lite Hero 8
    48: 48, // Lite Hero 9
    83: 83, // Blue Lite Hero
    84: 84, // Red Lite Hero
    49: 49, // Heavy Hero
    3: 60, // Proxy
    61: 61, // Proxy (No helmet)
    72: 72, // Proxy (White)
    75: 75, // Blue Proxy
    76: 76, // Red Proxy
    13: 13, // Noir Lime
    73: 73, // Blue Player (Noir Lime)
    74: 74, // Red Player (Noir Lime)
    7: 7, // Civil Security Heavy
    8: 8, // Civil Security Lite
    11: 11, // Civil Security Boss
    12: 12, // Civil Security Ghost
    77: 77, // Blue Civil Security Lite
    4: 4, // Android T-01187
    9: 9, // Android SLC-56
    81: 81, // Blue Android SLC-56
    82: 82, // Red Android SLC-56
    14: 14, // Falkok
    85: 85, // Blue Falkok
    86: 86, // Red Falkok
    15: 15, // Phoenix Falkok
    16: 16, // Grub
    2: 2, // Usurpation Soldier Minor
    70: 70, // Usurpation Destroyer
    71: 71, // Usurpation Soldier Major
    79: 79, // Blue Usurpation Soldier
    80: 80, // Red Usurpation Soldier
    6: 6, // Advanced Usurpation Soldier

    /*
    no pb2 equivalent
    50 // Combined Marine
    62 // Proxy D
    63 // Proxy E
    17 // Digits
    */
};