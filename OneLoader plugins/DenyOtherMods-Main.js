//===============================================================================================================
// FoGsesipod - Deny Other Mods - Main
// DenyOtherMods-Main.js
//===============================================================================================================

//===============================================================================================================
/*:
 * Close the game when mods other then "approved" ones are loaded.
 * Meant to be loaded via Oneloader asyncExec in the mod.json, DO NOT add
 * this as a plugin in Rpgmaker.
 * 
 * Example mod.json line:
 * "asyncExec": [
 *   {"file": "asyncExec/DenyOtherMods-Main.js", "runat": "pre_stage_2"},
 *   {"file": "asyncExec/DenyOtherMods-Execute.js", "runat": "pre_window_onload"}
 * ],
 * 
 * Set the name of your mod by modifying ModName on line 33 then change the
 * array of AllowedMods on line 34 to add a mod that can be used with your mod.
 * 
 * Here is a list of mods that should almost never interfere with your projects:
 * ["oneloader", "saveloadplus", "modsavefiles", "console", "runinbackground", "controlleruioverhaul", "WindowsScalingFix", "enablemouse", "refreshglobalsavedata", "dragndrop", "enabledbg"];
 * Make sure to exclude mods that you integrated into your mod!
*/
//===============================================================================================================
{
    if (typeof PluginManager !== "undefined") {
        (function() {
            alert("Deny Other Mods will not function properly as a RPGMaker MV Plugin.\nPlease remove DenyOtherMods-Main.js and DenyOtherMods-Execute.js from the Plugin Manager in your playtest, as Deny Other Mods needs to be ran via Oneloader's asyncExec - in the mod.json.");
        })();
    }
    else {
        const ModName = "YOUR MOD NAME HERE";
        var AllowedMods = ["oneloader", "saveloadplus", "modsavefiles"];

        var TotalNames = window.TotalNames ? window.TotalNames += ` & ${ModName}` : ModName;
        var NotAllowedMods = window.NotAllowedMods ? window.NotAllowedMods += `\n${ModName}: ` : `${ModName}: `;
        var CloseGame = window.CloseGame || false;

        for (const key of params.knownMods.keys()) {
            AllowedMods.push(ModName);
            if (!AllowedMods.includes(key)) {
                CloseGame = true;
                NotAllowedMods += `${key} `;
            };
        };
        if (CloseGame) {
            window.CloseGame = CloseGame;
            window.NotAllowedMods = NotAllowedMods;
            window.TotalNames = TotalNames;
        }
    };
}