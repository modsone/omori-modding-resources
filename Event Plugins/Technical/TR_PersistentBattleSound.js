//=============================================================================
// Persistent Battle Sound - By TomatoRadio
// TR_PersistentBattleSound.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_PersistentBattleSound = true;

var TR = TR || {};
TR.PBS = TR.PBS || {};
TR.PBS.version = 1.0;

/*: 
 *
 * @plugindesc Allows for map sounds to persist into a battle instead of being stopped.
 * Version 1.0
 * @author TomatoRadio
 * 
 * @help
 * In base RPGMaker, all sounds will be cut when a battle starts (with the exception of BGM if it's the same as what would've been the Battle BGM)
 * This plugin changes that and assigns a switch to turn on or off "Persistence" (ie. continuing to play when a battle begins) for each sound type.
 * So if the switch for BGS is on, it will continue to play in battle.
 * 
 * @param BGMswitch
 * @text BGM Switch
 * @type switch
 * @desc The ID of the Switch to Enable or Disable persistence for BGM.
 * @default 1
 * 
 * @param BGSswitch
 * @text BGS Switch
 * @type switch
 * @desc The ID of the Switch to Enable or Disable persistence for BGS.
 * @default 1
 * 
 * @param MEswitch
 * @text ME Switch
 * @type switch
 * @desc The ID of the Switch to Enable or Disable persistence for ME.
 * @default 1
 * 
 * @param SEswitch
 * @text SE Switch
 * @type switch
 * @desc The ID of the Switch to Enable or Disable persistence for SE.
 * @default 1
 * 
*/
TR.PBS.Param = PluginManager.parameters('TR_PersistentBattleSound');

TR.BGMswitch = parseInt(TR.PBS.Param["BGMswitch"])
TR.BGSswitch = parseInt(TR.PBS.Param["BGSswitch"])
TR.MEswitch = parseInt(TR.PBS.Param["MEswitch"])
TR.SEswitch = parseInt(TR.PBS.Param["SEswitch"])

Scene_Map.prototype.stopAudioOnBattleStart = function() {
    if (!AudioManager.isCurrentBgm($gameSystem.battleBgm()) && !$gameSwitches.value(TR.BGMswitch)) {
        AudioManager.stopBgm();
    }
    if (!$gameSwitches.value(TR.BGSswitch)) {
        AudioManager.stopBgs();
    }
    if (!$gameSwitches.value(TR.MEswitch)) {
        AudioManager.stopMe();
    }
    if (!$gameSwitches.value(TR.SEswitch)) {
        AudioManager.stopSe();
    }
};

BattleManager.playBattleBgm = function() {
    if (!$gameSwitches.value(TR.BGMswitch)) {
        AudioManager.playBgm($gameSystem.battleBgm());
    }
    if (!$gameSwitches.value(TR.BGSswitch)) {
        AudioManager.stopBgs();
    }
};