export const teamNames: Record<number, string> = {
    0:  'Alpha',
    1:  'Beta',
    2:  'Gamma',
    3:  'Delta',
    4:  'Zeta',
    5:  'Lambda',
    6:  'Sigma',
    7:  'Omega',
    8:  'Counter-Terrorists',
    9:  'Terrorists',
    10: 'Usurpation Forces',
    11: 'Citizen Security',
    12: 'Red Team',
    13: 'Blue Team',
    14: 'Green Team',
    15: 'White Team',
    16: 'Black Team',
    [-2]: 'Special B',
    [-3]: 'Special C',
    [-4]: 'Special D',
    [-5]: 'Special E',
    [-6]: 'Special F',
} as const;

export const PB2GunModelToPB3: Record<string, string | null> = {
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

export const PB2SkinToPB3: Record<number, number | null> = {
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