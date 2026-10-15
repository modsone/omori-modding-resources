//=============================================================================
// Per-Map Shift Y - By TomatoRadio
// TR_PerMapShiftY.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_PerMapShiftY = true;

var TR = TR || {};
TR.PMSY = TR.PMSY || {};
TR.PMSY.version = 1;

/*: 
 *
 * @plugindesc Adds a Notetag to change the Shift Y on maps.
 * @author TomatoRadio
 * 
 * @help
 * 
 * By default, all characters in a map will be shifted upwards 6 pixels.
 * This is to give a sense of depth against the tiles on the map.
 * 
 * This behavior can sometimes be undesirable, which is why RPG Maker
 * allows you to disable it with sprites that start with `!`.
 * 
 * However, sometimes we want to fully disable this feature, or change the
 * shift for every character on a map.
 * 
 * This plugin adds the following notetag on maps to allow that.
 * <ShiftY: #>
 * # Is the number of pixels a character will be shifted by on the map.
 * 6 is the default that RPG Maker uses, but you may configure that default
 * with the plugin parameter provided.
 * 
 * @param defaultShiftY
 * @text Default Shift Y
 * @type number
 * @desc When no notetag is given, how many pixels should characters be shifted?
 * @decimals 0
 * @default 6
 * 
*/

TR.PMSY.defaultShiftY = parseInt(PluginManager.parameters('TR_PerMapShiftY')["defaultShiftY"]);
if (typeof TR.PMSY.defaultShiftY !== "number") TR.PMSY.defaultShiftY = 6;

Game_CharacterBase.prototype.shiftY = function() {
    if ($dataMap && $dataMap.meta && $dataMap.meta.ShiftY) {
        return parseInt($dataMap.meta.ShiftY);
    } else {
        return TR.PMSY.defaultShiftY;
    };
};