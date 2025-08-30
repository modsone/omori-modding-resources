//===============================================================================================================
// FoGsesipod - Force Load First
// Force_Load_First.js
//===============================================================================================================

//===============================================================================================================
/*:
 * Loads the specified plugin last, after any other mods.
 * Meant to be loaded via Oneloader asyncExec in the mod.json, DO NOT add
 * this as a plugin in Rpgmaker.
 * 
 * Example mod.json line:
 * "asyncExec": [
 *   {"file": "asyncExec/Force_Load_Last.js", "runat": "pre_game_start"},
 * ],
 * 
 * Replace "plugin_name" on lines 27 and 28 with the name of your plugin (case sensitive).
*/
//===============================================================================================================
{
    if (typeof PluginManager !== "undefined") {
        (function() {
            alert("Force Load Last will not function properly as a RPGMaker MV Plugin.\nPlease remove Force_Load_Last.js from the Plugin Manager in your playtest, as Force Load Last needs to be ran via Oneloader's asyncExec - in the mod.json.");
        })();
    }
    else {
        $modLoader.pluginLocks.delete("plugin_name");
        $modLoader.pluginLocks.add("plugin_name");
    }
};