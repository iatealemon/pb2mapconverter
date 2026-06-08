import type { GunEntity } from '#pb2Objects/entity-types.js';
import { toPB3String } from './serialize.js';

// todo upgrade levels

const DEFAULT_EDITOR_OBJECT = {
    "operation":"create",
    "constructor":"pb2Gun.CreateGun",
    "id":"",
    "x":"0",
    "y":"0",
    "scale":"1",
    "type":"'gun_rifle'",
    "only_allow_for":"null",
    "_visible":"1",
    "_locked":"0",
    "_disabled":"0"
};

export const serializeGun = (entity: GunEntity): string => {
    const pb3Model = PB2GunModelToPB3[entity.model] ?? null;
    if (pb3Model === null) return ""; // todo log error

    const code = `
    pb2Gun.CreateGun(
    { 
        x: ${entity.position.x}, 
        y: ${entity.position.y}, 
        type: '${pb3Model}'${entity.teamUID !== null ? `, only_allow_for: ${entity.teamUID} ` : ""} 
    });
    `;

    const editor_object = {
        ...DEFAULT_EDITOR_OBJECT,
        x: entity.position.x.toString(),
        y: entity.position.y.toString(),
        type: `'${pb3Model}'`,
        only_allow_for: entity.teamUID ?? 'null',
    };

    return toPB3String({ code: code, jsonObject: JSON.stringify(editor_object) });
};

const PB2GunModelToPB3: Record<string, string | null> = {
    'gun_rifle': 'gun_rifle',
    'gun_rifle_b': null,
    'gun_pistol': 'gun_pistol',
    'gun_pistol_b': null,
    'gun_pistol2': 'gun_pistol2',
    'gun_vehgun': 'gun_vehgun',
    'gun_gl': 'gun_gl',
    'gun_rl': 'gun_rl',
    'gun_railgun': 'gun_railgun',
    'gun_railgun2': 'gun_railgun2',
    'gun_shotgun': 'gun_shotgun',
    'gun_shotgun_b': null,
    'gun_apistol': 'gun_apistol',
    'gun_arifle': 'gun_arifle',
    'gun_arifle2': 'gun_arifle2',
    'gun_vehcannon': 'gun_vehcannon',
    'gun_defibrillator': 'gun_defibrillator',
    'gun_bfg': 'gun_bng', // only gun that has a new name
    'gun_raygun': 'gun_raygun',
    'gun_rayrifle': 'gun_rayrifle',
    'gun_vehminigun': 'gun_vehminigun',
    'gun_vehminigl': null,
    'gun_real_shotgun': 'gun_real_shotgun',
    'gun_real_rifle': 'gun_real_rifle',
    'gun_oicw': 'gun_oicw',
    'gun_plasmagun': 'gun_plasmagun',
    'gun_minigun': 'gun_minigun',
    'gun_vgun': 'gun_vgun',
    'gun_sniper': 'gun_sniper',
    'gun_fttp_vehgun': 'gun_fttp_vehgun',
    'lazyrain_heal_pistol': 'gun_farheal', // not exactly the same
    'item_grenade': null,
    'item_port': null,
    'item_shield': null,
    'gun_sp_sh': null,
    'gun_glock': null,
    'gun_m4a1': null,
    'gun_pixel_rifle': null,
    'gun_pixel_rl': null,
    'darkstar_1_assault_rifle': null,
    'darkstar_1_gauss_rifle': null,
    'darkstar_1_minigun': null,
    'darkstar_1_phanx_rifle': null,
    'darkstar_1_usniper': null,
    'lostmydollar_av135': null,
    'lostmydollar_needle': null,
    'lostmydollar_qccv50': null,
    'lostmydollar_rmk36': null,
    'lostmydollar_rpg': null,
    'lazyrain_alien_laser_rifle': null,
    'lazyrain_alien_laser_rifle2': null,
    'lazyrain_cannon': null,
    'lazyrain_cannon2': null,
    'moonhawk_phantom': null,
    'moonhawk_phantom2': null,
    'moonhawk_smg': null,
    'ditzy_energy_rifle': null,
    'roxxar_marksman_rifle': null,
    'roxxar_pistol': null,
    'roxxar_rifle': null,
    'roxxar_shotgun': null,
    'moonhawk_crossfire': null,
    'lazyrain_psi_cutter': null,
    'mrjaksnes_android_sniper': null,
    'incompetence_cr30': null,
    'darkstar_1_cs_ragequit': null,
    'thetoppestkek_shotgun_nxs25': null,
    'incompetence_archetype_27xx': null,
    'phsc_aug': null,
    'moonhawk_railgun': null,
    'moonhawk_railgun2': null,
    'incompetence_glhf': null,
    'incompetence_glhf2': null,
    'lazyrain_gravy_rl': null,
    'lazyrain_gravy_rl2': null,
    'darkstar_1_owo_rl': null,
    'phsc_plasma_shotgun': null,
    'phsc_android_shotgun': null,
    'ditzy_cs_ik': null,
    'ditzy_cs_ik2': null,
    'phsc_ph01': null,
    'phsc_ph01b': null,
    'darkstar_1_railgun': null,
    'darkstar_1_railgun2': null,
    'darkstar_1_alien_rail_sg': null,
    'darkstar_1_nade_c9': null,
    'darkstar_1_nade_c9b': null,
    'darkstar_1_rl': null,
    'darkstar_1_bison': null,
    'darkstar_1_auto_sg': null,
    'ditzy_focus_beam': null,
    'boom5_revolver': null,
    'thetoppestkek_scavenger_sg': null,
    'lazyrain_acid_gl': null,
    'lazyrain_plasma_smg': null,
    'lazyrain_plasma_smg2': null,
    'roxxar_android_railgun': null,
    'gun_invisgun': null,
    'gun_sharkgun': null,
    'gun_rl0': null
    /*
    no pb2 equivalent
    'gun_anti_rifle'
    'gun_trouble'
    'gun_shaft'
    'gun_rl2'
    'gun_apistol2'
    'gun_disintegrator'
    'gun_explosiveminigun'
    'gun_firebug'
    'gun_drainlight'
    'gun_sniper2'
    'gun_eratrigger'
    'gun_repairgun'
    'gun_dodge'
    'gun_nailgun'
    'gun_freezer'
    'gun_pistol3'
    'gun_flappygun'
    'gun_flame'
    'gun_rl3'
    'gun_bng2'
    'gun_chrono'
    'gun_vehcannon2'
    'gun_scout_drone'
    'gun_harasser_drone'
    'gun_cs_vehgun'
    'gun_drain_sniper_rifle'
    */
};