//=============================================================================
// DEV_TEST Visibilty - By TomatoRadio
// TR_DevTestVisibility.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_DevTestVisibility = true;

var TR = TR || {};
TR.DTV = TR.DTV || {};
TR.DTV.version = 1.0;

/*: 
* @plugindesc v1 Allows you to see DEV_TEST events in game and add more.
* @author TomatoRadio
* 
* @help
* Allows you to enable a switch to show events using DEV_TEST ingame.
* Additionally, all images starting with DEV_ (case-sensitive) have this property now.
* 
 * @param DEVTestSwitch
 * @desc If the switch is on, then DEV_TEST will display ingame
 * @type switch
 * @default 0
*/

TR.DTV.Param = PluginManager.parameters('TR_DevTestVisibility');

TR.DEVTestSwitch = Number(TR.DTV.Param["DEVTestSwitch"])

Game_CharacterBase.prototype.isTransparent = function() {
    if (this.characterName().startsWith("DEV_") && !$gameSwitches.value(TR.DEVTestSwitch)) return true;
    return Archeia.Game_CharacterBase_isTransparent.call(this);;
};