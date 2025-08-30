//=============================================================================
// GIRLMORI IS REAL - By TomatoRadio
// TR_GIRLMORI_IS_REAL.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_GIRLMORI_IS_REAL = true;

var TR = TR || {};
TR.GIR = TR.GIR || {};
TR.GIR.version = 3.0;

/*: 
 * @plugindesc v3.0 Plugin to detect if Girlmori is present and adjust images with sunny's name to account for this.
 * @author TomatoRadio
 * 
 * @help
 * How this works is that when an image with the word 'sunny' is in it (case does not matter),
 * it will try to load the same file but with '_girl' at the end, 
 * so if it finds FA_Sunny.png, it will load FA_Sunny_girl.png
 * 
 * It does this for all img/ subfolders.
 * 
 * If you want to make pronoun changes, you can use \caseEval{e?a:b}
 * OR \girlmori{femm:masc}
 * These can be placed in macros.
 * 
 * Examples of both in the same message:
 * \caseEval{ImageManager.isGirlmoriActive()?She:He} is really the just quietest \girlmori{girl:boy} I've ever met...
 * 
 * You can force enable/disable Girlmori with this plugin command.
 * ForceGirlmori [boolean]
 * true/on : Forces Girlmori On
 * false/off : Forces Girlmori Off
 * reset/default : Returns to actual activity of Girlmori
 * 
 * You can also set this with the script:
 * $gameSystem._girlmoriActive = true : Forces Girlmori On
 * $gameSystem._girlmoriActive = false : Forces Girlmori Off
 * $gameSystem._girlmoriActive = undefined : Returns to actual activity of Girlmori
 * 
 * If Girlmori is being forced, it will ignore the actual status
 * of Girlmori or your plugin params. Note that forcing girlmori off will
 * not revert the files from Girlmori itself, only the mod using this plugin.
 * 
 * You can check for Girlmori with ImageManager.isGirlmoriActive()
 * This will return true if:
 * - The modId 'girlmori' or 'girlmori_delta' is in $modLoader.knownMods
 * - The same modIds as above are in $modLoader.deniedMods (If DeniedActive is enabled)
 * - $gameSystem._girlmoriActive is set to true.
 * - You're in a playtest with PlaytestActive true
 * 
 * YEP_X_ExtMesPack2.js is a required plugin for \girlmori{}
 * This is a default OMORI plugin though so you should be fine.
 * 
 * @param PlaytestActive
 * @text Active during Playtest?
 * @type boolean
 * @desc If true, then the game will assume Girlmori is on during a playtest.
 * @default true
 * 
 * @param DeniedActive
 * @text Active when Denied?
 * @type boolean
 * @desc If true, then girlmoris denied by DenyInjection.js will count as active.
 * @default true
*/

TR.GIR.Param = PluginManager.parameters('TR_GIRLMORI_IS_REAL');

TR.PlaytestActive = eval(TR.GIR.Param["PlaytestActive"]);
TR.DeniedActive = eval(TR.GIR.Param["DeniedActive"]);

	TR.GIR.loadBitmap = ImageManager.loadBitmap;
	ImageManager.loadBitmap = function(folder, filename, hue, smooth) {
    if (filename) {
	if (filename.toLowerCase().includes("sunny") && ImageManager.isGirlmoriActive()) {
		let newimage = ''
		if (filename.toLowerCase().includes("%(")) {
			newimage = `${filename.replace("%","_girl%")}`
		} else {
			newimage = `${filename}_girl`
		}
			//console.log(newimage);
			var path = folder + encodeURIComponent(newimage) + '.png';
			var bitmap = this.loadNormalBitmap(path, hue || 0);
			bitmap.smooth = smooth;
			return bitmap;
		} else {
			return TR.GIR.loadBitmap.call(this, folder, filename, hue, smooth);
		};
    } else {
        return TR.GIR.loadBitmap.call(this, folder, filename, hue, smooth);
    }
};

ImageManager.isGirlmoriActive = function() {
	if ($gameSystem && $gameSystem._girlmoriActive === true) {
		return true;
	} else if ($gameSystem && $gameSystem._girlmoriActive === false) {
		return false;
	} else if (TR.PlaytestActive && $gameTemp.isPlaytest()) {
		return true;
	} else if (!$gameTemp.isPlaytest()) {
		if ($modLoader.knownMods.has('girlmori') || $modLoader.knownMods.has('girlmori_delta') || ($modLoader.deniedMods.has('girlmori') && TR.GIR.DeniedActive) || ($modLoader.deniedMods.has('girlmori_delta') && TR.GIR.DeniedActive)) {
			return true
		} else {
			return false;
		};
	};
	return false;
};

TR.GIR.convertCaseText = Window_Base.prototype.convertCaseText
Window_Base.prototype.convertCaseText = function(text) {
  text = text.replace(/\x1bGIRLMORI\{(.*?):(.*?)\}/gi, function() {
    var x = arguments[1];
    var y = arguments[2];
    var text = ImageManager ? x : y;
    return text;
  }.bind(this));

  return TR.GIR.convertCaseText.call(this,text);
  
};

TR.GIR.pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	if (command.toLowerCase() === 'forcegirlmori'){
		switch (args[1].toLowerCase()) {
			case 'true':
			case 'on':
				$gameSystem._girlmoriActive = true;
				return;
			case 'false':
			case 'off':
				$gameSystem._girlmoriActive = false;
				return;
			case 'reset':
			case 'default':
				$gameSystem._girlmoriActive = undefined;
				return;
		}
	}
	// Return Original Function
	return TR.GIR.pluginCommand.call(this, command, args);
};