/*
    This section is responsible for converting our PB2 objects into PB3 source code.

    The corrresponding PB3 source code follows this specific format
    "{ *some javascript code* }//->Ditto->//{ *some JSON for editor* }"

    We keep track of mappings between PB2 objects and these 2 (js code and JSON) here.

    Refer to ./docs/levelEditor.docs.js to see Eric's implementation of the toolbar - for mapping between the respective PB2 objects.
    (though it seems like the file is wrong!)
*/

// Standard map header that downloads Eric's basic trigger preset module and enable player assignment logic.
export const PB3StandardMapHeader = `//->Ditto->//{"operation":"define_global_vars"}
pb2GameWorld.DownloadModules( { user_data_uids_to_load: [ 183/*Eric Gurt's Basic trigger action presets*/ ], inline: true, success_callback: _pb2N } );function _pb2N(){//->Ditto->//{"id":"","operation":"create","constructor":"pb2GameWorld.DownloadModules","user_data_uids_to_load":"[ 183/*Eric Gurt's Basic trigger action presets*/ ]","execute_on_load":"true","inline":"true","success_callback":"null","error_callback":"null","x":"0","y":"0","_visible":"0","_locked":"0","_disabled":"0"}
pb2GameWorld.EnableSimplePlayerAssignmentLogic();//->Ditto->//{"x":"0","y":"0","operation":"call_method","method":"pb2GameWorld.EnableSimplePlayerAssignmentLogic","argument_values":"","keep_at_the_bottom":"0","_visible":"0","_locked":"0","_disabled":"0"}
`;

// Ends the map w/ the finalize world command.
export const PB3StandardFooter = `pb2GameWorld.FinalizeWorld();}//->Ditto->//{"x":"0","y":"0","operation":"call_method","method":"pb2GameWorld.FinalizeWorld","argument_values":"","keep_at_the_bottom":"1","_visible":"0","_locked":"0","_disabled":"0"}`;

// Removes empty spaces and new lines.. because PB3 is strict about spacing.
// Also adds '//->Ditto->//' before returning a valid source string.
export const toPB3String = ({ code, jsonObject }: { code: string; jsonObject: string }): string => {
	let finalString = code.replace(/[\r\t]|\n */g, '').replace(/ +/g, ' ');
	finalString += '//->Ditto->//';
	finalString += jsonObject.replace(/[\r\t]|\n */g, '').replace(/ +/g, ' ') + '\n';

	return finalString;
};

/** script that starts regen if the character was created with less hp than max */
export const serializeForceRegenScript = (x: number, y: number): string => {
    return makeScript(x, y, 'pb2Character.characters.filter(c=>c.hea!==c.hmax&&c.hea>0).forEach(c=>c.SubstractHealth(0));')
};

/** script that configures map settings to be closer to pb2 */
export const serializeMapConfigureScript = (x: number, y: number): string => {
    let code = '';
    code += 'pb2GunDisposer.normal_time_to_live=Infinity;';
    code += 'pb2RagdollDisposer.normal_time_to_live=Infinity;'; // todo omit if force ragdoll disappear engine mark
    code += 'pb2Bullet.friction_wall=0.5;'; // similar bullet penetration as pb2
    return makeScript(x, y, code);
};

export const makeScript = (x: number, y: number, code: string): string => {
    const editor_object = {
        "operation":"code",
        "snippet_color":"0xb1b1ff",
        "code":code,
        "x":x.toString(),
        "y":y.toString(),
        "_visible":"1",
        "_locked":"0",
        "_disabled":"0"
    };
    return `${code}//->Ditto->//${JSON.stringify(editor_object)}\n`;
    //return toPB3String({ code: code, jsonObject: JSON.stringify(editor_object) });
}