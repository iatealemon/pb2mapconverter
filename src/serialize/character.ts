import type { CharacterEntity } from '#pb2Objects/entity-types.js';
import { toPB3String } from './serialize.js';

const DEFAULT_EDITOR_OBJECT = {
    "operation":"create",
    "constructor":"pb2Ragdoll.CreateRagdollComplete",
    "id":"",
    "x":"0",
    "y":"0",
    "tox":"0",
    "toy":"0",
    "rotation":"0 / 180 * Math.PI",
    "stability":"1",
    "scale":"1",
    "skin":"default_skin2",
    "team":"heroes_team",
    "vision":"pb2Vision.VISION_SCREEN_BOX",
    "style_boost":"pb2StyleBoost.SELFBOOST",
    "style_grappling_hook":"undefined",
    "style_swords":"pb2StyleSwords.BASIC",
    "driver_of":"null",
    "name":"undefined",
    "sword_projectile_reflection":"false",
    "hmax":"150",
    "start_hea":"undefined",
    "hea":"undefined",
    "can_be_revived":"false",
    "can_breathe_in_water":"false",
    "can_breathe_in_toxic_clouds":"false",
    "hmax_damage_multiplier":"undefined",
    "regen_module":"pb2StyleRegen.style_delayed_speedup",
    "onDeath":"null",
    "drop_guns_on_death":"pb2Character.DROP_ALWAYS",
    "drop_grenades_on_death":"pb2Character.DROP_WHEN_INTENDED_ONLY",
    "enforce_skin_limitations":"false",
    "use_skin_properties":"false",
    "player_controllable":"false",
    "ai_preset":"null",
    "_visible":"1",
    "_locked":"0",
    "_disabled":"0",
    "side":"1"
};

export const serializeCharacter = (entity: CharacterEntity): string => {
    const vision = 'pb2Vision.VISION_DIRECTED_TRACE';

    const code = `
    pb2Ragdoll.CreateRagdollComplete(
    { 
        x: ${entity.position.x}, 
        y: ${entity.position.y}, 
        ${entity.velX !== 0 ? `tox: ${entity.velX}, ` : ''}
        ${entity.velY !== 0 ? `toy: ${entity.velY}, ` : ''}
        skin: ${entity.skinUID}, 
        team: ${entity.teamUID}, 
        vision: ${vision}, 
        style_boost: pb2StyleBoost.SELFBOOST, 
        style_swords: pb2StyleSwords.BASIC, 
        driver_of: null, 
        sword_projectile_reflection: true, 
        hmax: ${entity.hpMax}, 
        ${entity.hp !== entity.hpMax ? `hea: ${entity.hp}, ` : ''}
        can_be_revived: true, 
        can_breathe_in_water: true, 
        can_breathe_in_toxic_clouds: false, 
        hmax_damage_multiplier: 0, 
        regen_module: pb2StyleRegen.style_delayed_speedup, 
        drop_guns_on_death: pb2Character.DROP_ALWAYS, 
        drop_grenades_on_death: pb2Character.DROP_WHEN_INTENDED_ONLY, 
        enforce_skin_limitations: false, 
        use_skin_properties: false, 
        player_controllable: ${entity.isPlayer}, 
        ai_preset: ${entity.aiPresetUID}, 
        side: ${entity.direction} 
    });
    `;
    
    const editor_object = {
        ...DEFAULT_EDITOR_OBJECT,
        x: entity.position.x.toString(),
        y: entity.position.y.toString(),
        tox: entity.velX.toString(),
        toy: entity.velY.toString(),
        skin: entity.skinUID,
        team: entity.teamUID,
        vision: vision,
        sword_projectile_reflection: 'true',
        hmax: entity.hpMax.toString(),
        hea: entity.hp !== entity.hpMax ? entity.hp.toString() : 'undefined',
        can_be_revived: 'true',
        can_breathe_in_water: 'true',
        hmax_damage_multiplier: '0',
        player_controllable: entity.isPlayer.toString(),
        ai_preset: entity.aiPresetUID ?? "null",
        side: entity.direction.toString(),
    };

    return toPB3String({ code: code, jsonObject: JSON.stringify(editor_object) })
};