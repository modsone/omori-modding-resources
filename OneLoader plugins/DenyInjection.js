//===============================================================================================================
// FoGsesipod - Deny Injection
// DenyInjection.js
//===============================================================================================================

//===============================================================================================================
/*:
 * Remove specified mods from being injected into the game. The purpose is so
 * you can detect mods being installed for features, without these mods causing
 * conflicts with yours.
 * Meant to be loaded via Oneloader asyncExec in the mod.json, DO NOT add
 * this as a plugin in Rpgmaker.
 * 
 * Example mod.json line:
 * "asyncExec": [
 *   {"file": "asyncExec/DenyInjection.js", "runat": "pre_stage_2"}
 * ],
 * 
 * Since this also removes the mod from $modLoader.knownMods, you can use
 * $modLoader.deniedMods to check if a denied mod is installed.
 * 
 * Modify the id's in the DenyIds array on line 32, Mod Ids are case sensitive.
*/
//===============================================================================================================
{
    if (typeof PluginManager !== "undefined") {
        (function() {
            alert("Deny Injection will not function properly as a RPGMaker MV Plugin.\nPlease remove DenyInjection.js from the Plugin Manager in your playtest, as Deny Injection needs to be ran via Oneloader's asyncExec - in the mod.json.");
        })();
    }
    else {
        const DenyIds = ["MODID's HERE"];
        $modLoader.deniedMods = $modLoader.deniedMods || [];

        for (const id of DenyIds) {
            if (params.knownMods.has(id)) {
                $modLoader.deniedMods.push(id);
                params.knownMods.delete(id);
            };
        };
    };
};