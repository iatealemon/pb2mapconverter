import { makeScript } from "./serialize.js";

// grenades are bullets instead of guns in pb3 and bullets can't be created via script easily, 
// so instead a point is created for each grenade position and a script puts a grenade into every grenade spawn point

export const getGrenadeSpawnPointUID = (count: number, model: string): string => {
    return `gadget_spawn_point${count}__${model}`;
}

/**
 * script that spawns grenades into points with uids matching getGrenadeSpawnPointUID(count, model). kind of a hack but it works.  
 * this sets pb2BulletDisposer.normal_time_to_live = Infinity so the grenades don't despawn. not sure if that has downsides. normal bullets seem to still despawn
 */
export const serializeSpawnGrenadesScript = (x: number, y: number): string => {
    return makeScript(x, y, 
`(() => {
    function spawnGadget(model, p) {
        let char = pb2Ragdoll.CreateRagdollComplete({ 
            x: p.x, 
            y: p.y, 
            scale: 0,
            skin: pb2SkinEditor.SpawnDefaultSkin( 1 ), 
            team: pb2Team.teams[0] !== undefined ? pb2Team.teams[0] : pb2Team.CreateTeam({ 
                ai_in_team: false, 
                title: 'default team', 
                hud_color: new pb2HighRangeColor( 0x6a94ff ), 
                recolor_nicknames_on_overhead: true, 
                friendly_fire: true, 
                friendly_damage_multiplier: 1, 
                normal_damage_to_dead_teammates: true, 
                teammates_collide: true, 
                allow_private_communication: true, 
                overheads_visibility: pb2OverheadHUD.OVERHEAD_VISIBILITY_TEAMMATES_ONLY 
            }), 
            vision: pb2Vision.VISION_SCREEN_BOX, 
            style_boost: pb2StyleBoost.SELFBOOST, 
            style_swords: pb2StyleSwords.BASIC, 
            driver_of: null, 
            sword_projectile_reflection: false, 
            hmax: 0, 
            can_be_revived: false, 
            can_breathe_in_water: false, 
            can_breathe_in_toxic_clouds: false, 
            regen_module: pb2StyleRegen.style_delayed_speedup, 
            drop_guns_on_death: pb2Character.DROP_ALWAYS, 
            drop_grenades_on_death: pb2Character.DROP_ALWAYS, 
            enforce_skin_limitations: false, 
            use_skin_properties: false, 
            player_controllable: false, 
            ai_preset: null, 
            side: 1 
        });
        
        char.owner_character.AddGrenades(model, 1);
        char.remove();
    }

    pb2BulletDisposer.normal_time_to_live = Infinity; /* stops grenade despawn */

    Object.entries(window)
    .filter(([k, v]) => k.startsWith("gadget_spawn_point"))
    .map(([k, p]) => {
        const i = k.indexOf("__") + 2;
        const model = pb2ArmsAction["ACTION_TYPE_THROW_GRENADE_" + k.slice(i)];
        if (model !== undefined) return [model, p];
        return [pb2ArmsAction.ACTION_TYPE_THROW_GRENADE_HE, p];
    })
    .forEach(([m, p]) => spawnGadget(m, p));
})();`);
}