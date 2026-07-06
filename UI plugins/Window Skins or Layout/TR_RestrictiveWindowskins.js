//=============================================================================
// Restrictive Windowskins - By TomatoRadio
// TR_RestrictiveWindowskins.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_RestrictiveWindowskins = true;

var TR = TR || {};
TR.RW = TR.RW || {};
TR.RW.version = 1.1;

/*: 
 *
 * @plugindesc Restricts Windowskin changes to only a specific group of Windows.
 * Version 1.1
 * @author TomatoRadio
 * 
 * @help
 * Makes it so that only specific windows are affected
 * by the HIME_WindowskinChange plugin.
 * 
 * Also prevents some crashes related to changing windowskins
 * in Scenes without a WindowLayer (eg. Photo Album)
 * 
 * Check the code of the plugin to add your own.
 * 
*/

//This list here is every Window that appears in dialogue.
var SkinnedWindows = [Window_Message,Window_NameBox,Window_MessageFaceBox,Window_ChoiceList,Window_NumberInput,Window_EventItem];
var defaultWindowskin = "Window";

SkinnedWindows.forEach(function(win) {
  win.prototype.oldLoadWindowskin = win.prototype.loadWindowskin;
	win.prototype.loadWindowskin = function() {
		win.prototype.oldLoadWindowskin.call(this);
    if ($gameSystem && !$gameSystem.windowskin()) $gameSystem.setWindowskin(defaultWindowskin);
		this.windowskin = ImageManager.loadSystem($gameSystem.windowskin());
	};
});

TR.RW.loadWindowskin = Window_Base.prototype.loadWindowskin;
Window_Base.prototype.loadWindowskin = function() {
	TR.RW.loadWindowskin.call(this); //This is so that extra stuff like BABY_ExternalColorImage.js don't get deleted.
	this.windowskin = ImageManager.loadSystem(defaultWindowskin);
  if ($gameSystem && !$gameSystem.windowskin()) $gameSystem.setWindowskin(defaultWindowskin);
};

SceneManager.refreshWindowskins = function() {
	if (this._scene._windowLayer) {this._scene._windowLayer.refreshWindowskins();};
};