//=============================================================================
// Restrictive Windowskins - By TomatoRadio
// TR_RestrictiveWindowskins.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_RestrictiveWindowskins = true;

var TR = TR || {};
TR.RW = TR.RW || {};
TR.RW.version = 1.0;

/*: 
 *
 * @plugindesc Restricts Windowskin changes to only a specific group of Windows.
 * Version 1.0
 * @author TomatoRadio
 * 
 * @help
 * Makes it so that only specific windows are affected
 * by the HIME_WindowskinChange plugin.
 * 
 * Check the code of the plugin to add your own.
 * 
*/

//This list here is every Window that appears in dialogue.
var SkinnedWindows = [Window_Message,Window_NameBox,Window_MessageFaceBox,Window_ChoiceList,Window_NumberInput,Window_EventItem];
var defaultWindowskin = "Window";

TR.RW.loadWindowskin = Window_Base.prototype.loadWindowskin;
Window_Base.prototype.loadWindowskin = function() {
	TR.RW.loadWindowskin.call(this); //This is so that extra stuff like BABY_ExternalColorImage.js don't get deleted.
	this.windowskin = ImageManager.loadSystem(defaultWindowskin);
};

SkinnedWindows.forEach(function(win) {
	win.prototype.loadWindowskin = function() {
		Window_Base.prototype.loadWindowskin.call(this);
		var wskin = $gameSystem.windowskin() || defaultWindowskin;
		this.windowskin = ImageManager.loadSystem(wskin);
	};
});