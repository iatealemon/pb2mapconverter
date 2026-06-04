/**
 * Seems awfully inaccurate?
 */

pb2LevelEditor.oO = emI([
	{
		code: ``,
		editor_object: {
			operation: 'define_global_vars',
		},
	},
	{
		code: '',
		editor_object: {
			operation: 'space',
		},
	},
	{
		code: `pb2GameWorld.background_terrain_random_seed = 12; pb2GameWorld.foreground_terrain_random_seed = 23; pb2GameWorld.foreground_platform_random_seed = 34; pb2GameWorld.foliage_random_seed = 56; pb2GameWorld.wind_amplitude = -1; pb2GameWorld.wind_random_part = 0.75;`,
		editor_object: {
			operation: 'set_properties',
			object: 'pb2GameWorld',

			background_terrain_random_seed: '12',
			foreground_terrain_random_seed: '23',
			foreground_platform_random_seed: '34',
			foliage_random_seed: '56',
			foliage_shadow_multiplier: '1',
			wind_amplitude: '-1',
			wind_random_part: '0.75',

			sun_color: '0xdde7ff',
			sky_color: '0xdde7ff',
			sun_intensity: '0.025',
			sky_intensity: '0.6',

			foreground_snow: 'false',
			background_snow: 'false',
			snowing: 'false',

			raining: 'false',
			fog_intensity: '0',

			sun_shade_x: '150',
			sun_shade_y: '3000',

			terrain_enabled: 'true',
			terrain_solve_random_factor: '0.75',
			terrain_sky_ground_contrast: '0.05',
			terrain_extra_sky_ground_contrast: '0.025',
			terrain_fractal_cube_size: '4000',
			terrain_level_influence_factor: '16',
			terrain_extra_space_x: '2000',
			terrain_extra_space_y: '500',
			terrain_force_low_level_terrain: 'true',
			terrain_phys_scale: '150',
			terrain_size_z: '40',
			terrain_start_z: 'undefined',

			terrain_post_tesselation_grass_noise: '0.166',
			terrain_y_offset: '0',
			terrain_remove_floating_islands: 'true',
			terrain_uv_relax_iterations: '24',
		},
	},

	{
		code: `var surface_type_bg = pb2SurfaceType.CreateSurfaceType( { geometry_type: pb2SurfaceType.TYPE_SIMPLE_WALL, texture_container: pb2Texture .GetTextureByName('mat_grass'), name: 'Grass', terrain_generation: true, is_terrain_decal: true, is_for_wall: true, front_y: 0, back_y: 0, opacity: 1, colorTransform: new ColorTransform( 1,1,1 ), recommended_slices_per_density: 5 } );`,
		editor_object: {
			operation: 'create',
			constructor: 'pb2SurfaceType.CreateSurfaceType',
			id: 'surface_type_bg',

			geometry_type: 'pb2SurfaceType.TYPE_SIMPLE_WALL',
			texture_container: "pb2Texture.GetTextureByName('mat_grass')",
			name: "'Grass'",
			terrain_generation: 'true',
			foliage_template: 'pb2FoliageClass.TEMPLATE_EARTH',
			has_cliff: 'true',
			has_ground: 'true',

			is_for_wall: 'true',
			shader_type: 'pb2SurfaceType.SHADER_GAMEPLAY',

			front_y: 'undefined',
			back_y: 'undefined',
			pixelated: 'false',
			transparent: 'false',
			opacity: '1',

			color: 'new pb2HighRangeColor( 0xffffff )',
			color_addon: 'new pb2HighRangeColor( 0x000000 )',

			appearance: 'pb2SurfaceType.APPEARANCE_NORMAL',

			recommended_slices_per_density: '5',
			debris_material: 'pb2Entity.MATERIAL_CONCRETE',

			movable_sounds_preset: 'null',

			slice_texture_container: 'null',
			slice_color: 'new pb2HighRangeColor( 0xffffff )',
			slice_color_addon: 'new pb2HighRangeColor( 0x000000 )',
			slice_pixelated: 'false',
			slice_transparent: 'false',
			slice_appearance: 'pb2SurfaceType.APPEARANCE_NORMAL',
			slice_opacity: '1',
			slice_scale: '1',

			impact_scale: '1',
		},
	},

	{
		code: ``,
		editor_object: {
			operation: 'create',
			constructor: 'Object.MovableSoundsPreset',
			id: 'default_skin2',

			sound_start: "'s_servo_startA'",
			sound_start_pitch: '1',
			sound_start_volume: '1',

			sound_loop: "'s_servoA'",
			sound_loop_pitch: '1',
			sound_loop_volume: '1',

			sound_stop: 'null',
			sound_stop_pitch: '1',
			sound_stop_volume: '1',

			sound_damage: 'null',
			sound_damage_pitch: '1',
			sound_damage_volume: '1',

			sound_break: 'null',
			sound_break_pitch: '1',
			sound_break_volume: '1',

			sound_loop_base_speed: '10',
			sound_loop_speed_to_pitch_factor: '1',

			sound_damage_base_volume: '50',
			sound_damage_volume_scale_with_damage_factor: '1',
		},
	},

	{
		code: `var default_skin2 = pb2SkinEditor.SpawnDefaultSkin( 2 );`,
		editor_object: {
			operation: 'create',
			constructor: 'pb2SkinEditor.SpawnDefaultSkin',
			id: 'default_skin2',

			type: 'pb2SkinEditor.SKIN_TYPE_DEFAULT',

			frame: '2',

			user_data_uid: '-1',
			user_data_uid_title: '',
		},
	},
	{
		code: `var user_data_skin106 = pb2SkinEditor.SpawnUserDataSkin( 106 );`,
		editor_object: {
			operation: 'create',
			constructor: 'pb2SkinEditor.SpawnDefaultSkin',

			id: 'user_data_skin106',

			type: 'pb2SkinEditor.SKIN_TYPE_FROM_CREATION',

			frame: '2',

			user_data_uid: '-1',
			user_data_uid_title: '',
		},
	},

	{
		code: `(function InitWorld()`,
		editor_object: {
			operation: 'layer_definition',
			id: 'InitWorld',

			availability: 'global',

			arguments: '',
			is_open: true,
			close_when_possible: false,

			enabled: '1',
			max_calls: 'Infinity',

			auto_spawn: '0',
			auto_spawn_arguments: '',

			fail_call_callback: 'null',
			fail_call_callback_same_arguments: '1',

			children_properties_to_rewrite: '',
		},
	},
	{
		code: '{',
		editor_object: {
			operation: 'open_layer_bracket',
		},
	},

	{
		code: '   pb2GameWorld.CreateBoxShape( { x: -1000, y: 0, w: 1000-500, h: 400, m: null }, pb2Shape.WALL );',
		editor_object: {
			operation: 'create',
			constructor: 'pb2GameWorld.CreateBoxShape',

			x: '-1000',
			y: '0',
			w: '1000-500',
			h: '400',
			m: 'null',
			wc: 'null',
			type: 'pb2Shape.WALL',
			corner: 'pb2Shape.CORNER_NONE',

			dots: 'null',
			_points_being_edited: false,
		},
	},
	{
		code: '   var my_movable = pb2GameWorld.CreateBoxShape( { x: -1000, y: 0, w: 1000-500, h: 400, m: surface_type_wall }, pb2Shape.BACKGROUND );',
		editor_object: {
			operation: 'create',
			constructor: 'pb2GameWorld.CreateBoxShape',

			id: 'my_movable',
			x: '-1000',
			y: '0',
			w: '1000-500',
			h: '400',
			m: 'null',
			wc: 'null',
			type: 'pb2Shape.BACKGROUND',
			corner: 'pb2Shape.CORNER_NONE',

			dots: 'null',
			_points_being_edited: false,
		},
	},
	{
		code: '   var my_movable = pb2GameWorld.CreateBoxShape( { x: -1000, y: 0, w: 1000-500, h: 400, m: surface_type_wall }, pb2Shape.MOVABLE );',
		editor_object: {
			operation: 'create',
			constructor: 'pb2GameWorld.CreateBoxShape',

			id: 'my_movable',
			x: '-1000',
			y: '0',
			w: '1000-500',
			h: '400',
			m: 'null',
			wc: 'null',
			type: 'pb2Shape.MOVABLE',
			corner: 'pb2Shape.CORNER_NONE',

			hea: '0',
			ai_break_allowed: 'true',

			dots: 'null',
			_points_being_edited: false,
		},
	},
	{
		code: '   var wa_class = pb2WaterClass.DeclareWaterClass({ reflection: 0.8, color: 0x003344, opacity: 0.6, glow: false });',
		editor_object: {
			operation: 'create',
			constructor: 'pb2WaterClass.DeclareWaterClass',
			id: 'wa_class',

			reflection: '0.8',
			color: '0x003344',
			opacity: '0.6',
			glow: 'false',
			allow_fixed: 'true',
			viscosity: '1',
			density: '1',

			depth: 'undefined',
			depth_front: 'undefined',
			extend_left: 'false',
			extend_right: 'false',
			cover_decals: 'false',

			type: 'pb2WaterClass.TYPE_WATER',
			damage_scale: '1',

			fire_color: 'new pb2HighRangeColor( 0x723f26 )',
		},
	},
	{
		code: '   var wa = pb2GameWorld.CreateBoxShape({ x: 0, y: -190, w: 1000, h: 190, wc: wa_class }, pb2Shape.WATER );',
		editor_object: {
			operation: 'create',
			constructor: 'pb2GameWorld.CreateBoxShape',
			id: 'wa',

			x: '0',
			y: '-190',
			w: '1000',
			h: '190',
			m: 'null',
			wc: 'wa_class',
			type: 'pb2Shape.WATER',
			corner: 'pb2Shape.CORNER_NONE',

			dots: 'null',
			_points_being_edited: false,
		},
	},
	{
		code: '   var wa = pb2GameWorld.CreateBoxShape({ x: 0, y: -190, w: 1000, h: 190, wc: wa_class }, pb2Shape.WATER );',
		editor_object: {
			operation: 'create',
			constructor: 'pb2GameWorld.CreateBoxShape',
			id: 'wa',

			x: '0',
			y: '-190',
			w: '1000',
			h: '190',

			type: 'pb2Shape.REGION',
			corner: 'pb2Shape.CORNER_NONE',

			dots: 'null',
			_points_being_edited: false,

			increased_accuracy: 'false',

			react_to_ragdolls: 'false',
			react_to_guns: 'false',
			react_to_bullets: 'false',
			react_to_grenades: 'false',
			react_to_grappling_hooks: 'false',
			react_to_shields: 'false',
			react_to_entities: 'false',
			react_to_exact_movables: 'false',

			onEnter: 'null',
			onLeave: 'null',
			onSubstep: 'null',
		},
	},
	{
		code: '   // This is a test user-comment #2',
		editor_object: {
			operation: 'usercode',

			snippet_color: '0x444444',
			code: `   // This is a test user-comment #2`,

			x: '0',
			y: '0',
		},
	},
	{
		code: '   // This is a comment made in level-editor',
		editor_object: {
			operation: 'comment',
			comment: 'This is a comment made in level-editor',
		},
	},
	{
		code: '    var my_ai_preset = { skill: 1, behavior: pb2AIModule.BEHAVIOR_MPBOT, allow_trace_shots: true, allow_hit_reporting: true };',
		editor_object: {
			operation: 'create',
			constructor: 'Object.AIPreset',
			id: 'my_ai_preset',

			skill: '1',
			behavior: 'pb2AIModule.BEHAVIOR_MPBOT',
			allow_trace_shots: 'true',
			allow_hit_reporting: 'true',

			factor_for_team_damage_paths_avoidance: '1',
			rejection_point_for_team_damage_paths: 'Infinity',

			hunt_attacker: 'true',
			hunt_seen_threats: 'true',
			hunt_random_known_threats_range: '1000',
			heal_teammates: 'true',
			hear_range: '600',
		},
	},

	{
		code: ``,
		editor_object: {
			id: '',
			operation: 'create',
			constructor: 'pb2AIPathFindingHint.Create',

			x: '0',
			y: '0',

			a: 'null',
			b: 'null',
			enabled: 'true',
			both_ways: 'false',
			action_to_proceed: 'pb2AIModule.HINT_ACTION_USE_SWITCH',
			action_target: 'null',
		},
	},
	{
		code: "   var heroes_team = pb2Team.CreateTeam({ ai_in_team: false, title: 'Heroes', hud_color: new pb2HighRangeColor( 0x6a94ff ), friendly_fire: true, friendly_damage_multiplier: 1, normal_damage_to_dead_teammates: true, teammates_collide: true, allow_private_communication: true });",
		editor_object: {
			operation: 'create',
			constructor: 'pb2Team.CreateTeam',
			id: 'heroes_team',

			ai_in_team: 'false',
			title: "'Heroes'",
			hud_color: 'new pb2HighRangeColor( 0x6a94ff )',
			recolor_nicknames_on_overhead: 'true',
			friendly_fire: 'true',
			friendly_damage_multiplier: '1',
			normal_damage_to_dead_teammates: 'true',
			teammates_collide: 'true',
			allow_private_communication: 'true',
			overheads_visibility: 'pb2OverheadHUD.OVERHEAD_VISIBILITY_TEAMMATES_ONLY',
		},
	},

	{
		code: '    var compound_ragdoll;{let r = pb2Ragdoll.CreateRagdoll({ x: 0, y: 0, scale: 1, skin: hero_skin, team: heroes_team, vision: pb2Vision.VISION_SCREEN_BOX, style_boost: pb2StyleBoost.JETPACK, style_grappling_hook: pb2StyleGrapplingHook.STYLE_EVERYTHING, style_swords: pb2StyleSwords.BASIC });let ch=pb2Character.CreateCharacter({ ragdoll: r, hmax: 150, can_be_revived: false, regen_module: pb2StyleRegen.style_delayed_speedup });let co = pb2Controller.CreateController({ character: ch, player_controllable: false, ai_preset: null, onDeath:null });compound_ragdoll=r;}',
		editor_object: {
			operation: 'create',
			constructor: 'pb2Ragdoll.CreateRagdollComplete',
			id: 'compound_ragdoll',

			x: '0',
			y: '0',

			tox: '0',
			toy: '0',
			rotation: '0 / 180 * Math.PI',

			stability: '1',

			scale: '1',
			skin: 'default_skin2',
			team: 'heroes_team',
			vision: 'pb2Vision.VISION_SCREEN_BOX',

			style_boost: 'pb2StyleBoost.SELFBOOST',
			style_grappling_hook: 'undefined',
			style_swords: 'pb2StyleSwords.BASIC',
			driver_of: 'null',
			name: 'undefined',
			sword_projectile_reflection: 'false',

			hmax: '150',
			start_hea: 'undefined',
			hea: 'undefined',
			can_be_revived: 'false',
			can_breathe_in_water: 'false',
			can_breathe_in_toxic_clouds: 'false',
			hmax_damage_multiplier: 'undefined',

			regen_module: 'pb2StyleRegen.style_delayed_speedup',
			onDeath: 'null',
			drop_guns_on_death: 'pb2Character.DROP_ALWAYS',
			drop_grenades_on_death: 'pb2Character.DROP_WHEN_INTENDED_ONLY',
			enforce_skin_limitations: 'false',
			use_skin_properties: 'false',

			player_controllable: 'false',
			ai_preset: 'null',
		},
	},
	{
		code: "   var test_gun = pb2Gun.CreateGun({ type: 'gun_rifle', x: 0, y: 0 });",
		editor_object: {
			operation: 'create',
			constructor: 'pb2Gun.CreateGun',
			id: 'test_gun',

			x: '0',
			y: '0',
			scale: '1',
			type: "'gun_rifle'",
			only_allow_for: 'null',
		},
	},
	{
		code: "   var decoration2 = pb2Decoration.CreateDecoration({ x:0, y:0, is_static:false, source:'camera_sign2', layer:pb2Decoration.LAYER_WORLD, scaleX:5, scaleY:5, scaleZ:5, rotationZ:45 / 180 * Math.PI, rotationX:0, rotationY:0, use_offset:false, offsetX:0, offsetY:0, offsetZ:0, relative_to_mesh:null, hide_relative_to_mesh:false, inherit_effects:true, visible:true, default_visibility:true, blending:pb2Decoration.BLENDING_NORMAL, shading:pb2Decoration.SHADING_INITIAL, pixelated:false, color_mult:new pb2HighRangeColor( 0xffffff ), alpha:1, inverse_filter:[] });",
		editor_object: {
			operation: 'create',
			constructor: 'pb2Decoration.CreateDecoration',
			id: 'decoration2',

			x: '0',
			y: '0',
			z: '0',
			is_static: 'true',
			source: "'camera_sign2'",
			layer: 'pb2Decoration.LAYER_WORLD',
			scaleX: '1',
			scaleY: '1',
			scaleZ: '1',
			rotationZ: '0 / 180 * Math.PI',
			rotationX: '0',
			rotationY: '0',
			use_offset: 'false',
			offsetX: '0',
			offsetY: '0',
			offsetZ: '0',

			attachment_mode: 'pb2Decoration.ATTACHMENT_DISABLED',
			attachment_obj: 'null',
			attachment_mesh_id: '0',

			relative_to_mesh: 'null',
			hide_relative_to_mesh: 'false',
			inherit_effects: 'true',

			visible: 'true',
			default_visibility: 'true',
			inverse_filter: '[]',
			blending: 'pb2Decoration.BLENDING_NORMAL',
			shading: 'pb2Decoration.SHADING_INITIAL',
			pixelated: 'false',
			color_mult: 'new pb2HighRangeColor( 0xffffff )',
			alpha: '1',
		},
	},
	...(() => {
		var arr = [];

		{
			var type;

			type = 'pb2Entity.TYPE_CRATE';

			arr.push({
				code:
					'   var that_one_vehicle = pb2Entity.CreateEntity( { type:' +
					type +
					', team: null, x:0, y:0, style_id:1, creator_ragdoll:null, tox:0, toy:0, side:1, onDeath:null, driver_can_enter:true, driver_can_leave:true } );',
				editor_object: {
					operation: 'create',
					constructor: 'pb2Entity.CreateEntity',
					id: 'that_one_vehicle',

					x: '0',
					y: '0',
					type: type,
					team: 'null',
					creator_ragdoll: 'null',
					style_id: '1',
					tox: '0',
					toy: '0',
					side: '1',
					rotation: '0 / 180 * Math.PI',
					onDeath: 'null',
					driver_can_enter: 'true',
					driver_can_leave: 'true',
					scale: '1',
					multiply_health: '1',
				},
			});
		}

		return arr;
	})(),
	...(() => {
		var arr = [];

		{
			var type;

			type = 'true';

			arr.push({
				code: '   var lamp = pb2Light.CreateLight( { x:0, y:0, is_static: ' + type + ', color: 0xff3333, power: 1, flare: true } );',
				editor_object: {
					operation: 'create',
					constructor: 'pb2Light.CreateLight',
					id: 'lamp',

					x: '0',
					y: '0',
					is_static: type,
					color: '0xffffff',
					power: '0.3',
					flare: 'true',
					blur: 'false',

					z: '0',
					scale: '3',

					attachment: 'null',
					attachment_limb_id: '0',

					angular_range_from: '0 / 180 * Math.PI',
					angular_range_length: '360 / 180 * Math.PI',
				},
			});
		}

		return arr;
	})(),
	{
		code: '})();',
		editor_object: {
			operation: 'close_layer_bracket',
		},
	},
	{
		code: 'pb2GameWorld.FinalizeWorld();',
		editor_object: {
			operation: 'call_method',
			method: 'null',
			argument_values: '',
			keep_at_the_bottom: '0',
		},
	},
	{
		code: '',
		editor_object: {
			id: '',
			operation: 'create',
			constructor: 'pb2UsableSwitch.CreateSwitch',

			x: '0',
			y: '0',

			model_frame: '0',
			base_color: 'new pb2HighRangeColor( 0x7f7f7f )',
			glow_color: 'new pb2HighRangeColor( 0x007f00 )',
			text_color: 'new pb2HighRangeColor( 0x7f7f7f )',

			usable_glow_intensity: '1',

			attachment: 'null',

			is_usable: 'true',
			press_timeout: '0',

			onUse: 'null',

			use_sound: "'s_t_switchB'",
			use_sound_pitch: '1',
			use_sound_volume: '1',

			fail_sound: "'s_t_switch_deniedB'",
			fail_sound_pitch: '1',
			fail_sound_volume: '1',
		},
	},

	{
		code: `await InlineTimer( 30, 0, null )`,
		editor_object: {
			id: '',
			operation: 'create',
			constructor: 'pb2Timer.CreateTimer',

			inline: 'true',

			time_to_wait: '30',

			type: 'pb2Timer.TYPE_GAME_TIMESCALE',

			calls: '1',

			position_container: 'null',

			callback: 'null',
		},
	},

	{
		code: `pb2Timer.CreateTimer( cb, 30, 0, null )`,
		editor_object: {
			id: '',
			operation: 'create',
			constructor: 'pb2Timer.CreateTimer',

			inline: 'false',

			time_to_wait: '30',

			type: 'pb2Timer.TYPE_GAME_TIMESCALE',

			calls: '1',

			position_container: 'null',

			callback: 'null',
		},
	},

	{
		code: `pb2GameWorld.DownloadModules({ ... })`,
		editor_object: {
			id: '',
			operation: 'create',
			constructor: 'pb2GameWorld.DownloadModules',

			user_data_uids_to_load: '[]',
			execute_on_load: 'true',
			inline: 'true',

			success_callback: 'null',
			error_callback: 'null',
		},
	},

	{
		code: `pb2GameWorld.DownloadTextures({ ... })`,
		editor_object: {
			id: '',
			operation: 'create',
			constructor: 'pb2GameWorld.DownloadTextures',

			user_data_uids_to_load: '[]',

			skip_unused: 'true',

			inline: 'true',

			success_callback: 'null',
			error_callback: 'null',
		},
	},

	{
		code: `...({ ... })`,
		editor_object: {
			id: '',
			operation: 'create',
			constructor: 'pb2GameWorld.DownloadSounds',

			user_data_uids_to_load: '[]',

			skip_unused: 'true',

			inline: 'true',

			success_callback: 'null',
			error_callback: 'null',
		},
	},

	{
		code: ``,
		editor_object: {
			id: '',
			operation: 'create',
			constructor: 'new Point',

			x: '0',
			y: '0',
		},
	},
	{
		code: ``,
		editor_object: {
			id: '',
			operation: 'create',
			constructor: 'new Vector',

			x: '0',
			y: '0',
			dx: '50',
			dy: '50',
		},
	},
	{
		code: ``,
		editor_object: {
			id: '',
			operation: 'create',
			constructor: 'new Circle',

			x: '0',
			y: '0',
			r: '50',
		},
	},

	{
		code: '',
		editor_object: {
			id: '',
			operation: 'create',
			constructor: 'pb2Sound.PlayCustomSound',

			sound: "'s_android_hurt'",
			channel: 'null',

			loop: 'false',
			pitch: '1',
			volume: '1',
			priority: 'pb2Sound.PRIORITY_GAMEPLAY',

			attach_to_entity: 'null',

			positioned: 'true',

			rx: '0',
			ry: '0',
			rz: '0',

			x: '0',
			y: '0',
			z: '0',

			client_side_for: 'null',

			callback: 'null',
		},
	},

	{
		code: `trace( 'Let\\'s create great stuff!' );`,
		editor_object: {
			operation: 'code',

			snippet_color: '0xb1b1ff',

			code: `/*

	This is a code snippet - it is capable of incredible things 
	when used properly

	Visit community-managed manual for hints and examples:
	https://docs.google.com/document/d/1p2njQG8zrTfe-_PtWaj9o5V3WzClUJujMhi-wPMIX08/edit?usp=sharing 

*/

// Messages below will appear in browser's DevTools Console 
// (F12 key) when this code snippet will be executed
									
trace( 'Let\\'s create ' + [ 'great', 'cool', 'nice', 'amazing' ].any + ' things!' );

warn( 'This also tells the call location - follow it to see how your Map looks like under the hood' );\n`,
		},
	},

	{
		code: `let a = 0;`,
		editor_object: {
			operation: 'var',

			id: '',
			value: '0',
		},
	},
	{
		code: `a = 0;`,
		editor_object: {
			operation: 'set',

			variable: '',
			action: '=',
			value: '0',
		},
	},

	{
		code: ``,
		editor_object: {
			id: '',
			operation: 'create',
			constructor: 'pb2WindowHint.CreateWindowHint',
			inline: 'false',

			x: '0',
			y: '0',

			container: 'pb2WindowHint.CONTAINER_BOTTOM',
			type: 'pb2WindowHint.TYPE_HINT',
			color: 'null',
			text: '`Make sure to keep those quotes`',
			is_timed: 'true',
			time_to_live: 'undefined',
			attachment_ragdoll: 'null',
			visibility_allowed_for: '[]',

			options_total: '0',

			allow_custom_input: 'false',

			keep_on_screen: 'true',
			access_range: '600',

			custom_input_callback: 'null',

			universal_handler: 'null',

			callback: 'null',

			is_poll: 'false',
			time_until_poll_confirmation: '90',
		},
	},
]);
