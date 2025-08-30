//===============================================================================================================
// FoGsesipod - Force Load First
// Force_Load_First.js
//===============================================================================================================

//===============================================================================================================
/*:
 * Loads the specified plugin first, before any other mods.
 * Meant to be loaded via Oneloader asyncExec in the mod.json, DO NOT add
 * this as a plugin in Rpgmaker.
 * 
 * Example mod.json line:
 * "asyncExec": [
 *   {"file": "asyncExec/Force_Load_First.js", "runat": "pre_plugin_injection"},
 * ],
 * 
 * Replace "plugin_name" on lines 28 and 29 with the name of your plugin (case sensitive).
*/
//===============================================================================================================
{
    if (typeof PluginManager !== "undefined") {
        (function() {
            alert("Force Load First will not function properly as a RPGMaker MV Plugin.\nPlease remove Force_Load_First.js from the Plugin Manager in your playtest, as Force Load First needs to be ran via Oneloader's asyncExec - in the mod.json.");
        })();
    }
    else {
        const NewSet = Array.from($modLoader.pluginLocks);
        NewSet.splice(NewSet.indexOf("plugin_name"), 1);
        NewSet.unshift("plugin_name");
        
        $modLoader.pluginLocks = new Set(NewSet);
    }
}