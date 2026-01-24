//=============================================================================
// GIRLMORI IS REAL - By TomatoRadio
// TR_GIRLMORI_IS_REAL.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_GIRLMORI_IS_REAL = true;

var TR = TR || {};
TR.GIR = TR.GIR || {};
TR.GIR.version = 5.0;

/*: 
 * @plugindesc v5.0 Plugin to detect if Girlmori is present and adjust images with sunny's name to account for this.
 * @author TomatoRadio
 * 
 * @help
 * How this works is that when an image with the word 'sunny' is in it (case does not matter),
 * it will try to load the same file but with '_girl' at the end, 
 * so if it finds FA_Sunny.png, it will load FA_Sunny_girl.png
 * 
 * Images with a %() ending place _girl before the % in order to keep the functionality intact.
 * eg. FA_SUNNY_RUN_girl%(8).png
 * 
 * Images created through atlasing should add the _girl suffix in the individual images, rather than the full atlas.
 * The suffix has not been tested for full atlas images and will not be supported if it does not work.
 * They follow the same rules otherwise.
 * 
 * Suffixes will affect any image loaded by the ImageManager.loadBitmap() function, which basically means
 * every file in the img folders.
 * 
 * You can change the keyword checked (Sunny) and the suffix added (_girl)
 * with the Keyword and Suffix Plugin Parameters.
 * 
 * If you want to make pronoun changes, you can use \caseEval{ImageManager.isGirlmoriActive()?femm:masc}
 * OR \transrights{femm:masc}
 * These can be placed in macros, however due to capitalization and translators, I'd advise against it.
 * 
 * YEP_X_ExtMesPack2.js is a required plugin for \transrights{}
 * This is a default OMORI plugin though so you should be fine.
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
 * of Girlmori or your plugin params. Note that forcing girlmori on/off
 * will only impact the usage of your mod's girlmori images and
 * dialogue changes. The original files of girlmori go untouched.
 * 
 * You can check for Girlmori with ImageManager.isGirlmoriActive()
 * This will return true if:
 * - The modId 'girlmori' or 'girlmori_delta' is in $modLoader.knownMods
 * - The same modIds as above are in $modLoader.deniedMods (If DeniedActive is enabled)
 * - $gameSystem._girlmoriActive is set to true.
 * - You're in a playtest with PlaytestActive true
 * 
 * If you are using the plugin "TR_VariableBasedFacesets.js" or its V2 form,
 * please be aware that the _girl suffix is added AFTER the variable number.
 * In addition if you are using the plugin "TR_VariableBasedImages.js",
 * the _girl suffix is also added after all of those as well. If you are using
 * "TR_DynamicImages.js", then the suffix will be either applied before or after
 * based on the order in the Plugin Manager. If above DI, then it will apply first,
 * and vice versa.
 * 
 * Lastly, for mods that do not use any basegame sprites of Sunny/Omori, I'd
 * advise using FoGsesipod's DenyInjection plugin to prevent Girlmori from
 * editing the game's data files and possible causing errors.
 * 
 * @param Keyword
 * @desc The keyword to check for if an image should be suffixed. CaseInsensitive.
 * @default sunny
 * 
 * @param Suffix
 * @desc The suffix to add to images that pass the check. CaseSensitive.
 * @default _girl
 * 
 * @param PlaytestActive
 * @text Active during Playtest?
 * @type boolean
 * @on ACTIVE
 * @off INACTIVE
 * @desc If true, then the game will assume Girlmori is on during a playtest.
 * @default true
 * 
 * @param DeniedActive
 * @text Active when Denied?
 * @type boolean
 * @on ACTIVE
 * @off INACTIVE
 * @desc If true, then girlmoris denied by DenyInjection.js will count as active.
 * @default true
*/

TR.GIR.Param = PluginManager.parameters('TR_GIRLMORI_IS_REAL');

TR.GIR.Keyword = String(TR.GIR.Param["Keyword"]) || "sunny";
TR.GIR.Suffix = String(TR.GIR.Param["Suffix"]) || "_girl";
TR.GIR.PlaytestActive = eval(TR.GIR.Param["PlaytestActive"]);
TR.GIR.DeniedActive = eval(TR.GIR.Param["DeniedActive"]);


TR.GIR.loadBitmap = ImageManager.loadBitmap;
	ImageManager.loadBitmap = function(folder, filename, hue, smooth) {
    if (filename) {
	if (filename.toLowerCase().includes(TR.GIR.Keyword.toLowerCase()) && ImageManager.isGirlmoriActive()) {
		let newimage = '';
		if (filename.toLowerCase().includes("%(")) {
			newimage = `${filename.replace("%",`${TR.GIR.Suffix}%`)}`;
		} else {
			newimage = `${filename}${TR.GIR.Suffix}`
		};
			return TR.GIR.loadBitmap.call(this, folder, newimage, hue, smooth);
		} else {
			return TR.GIR.loadBitmap.call(this, folder, filename, hue, smooth);
		};
    } else {
        return TR.GIR.loadBitmap.call(this, folder, filename, hue, smooth);
    };
};

ImageManager.isGirlmoriActive = function() {
	if ($gameSystem && $gameSystem._girlmoriActive === true) {
		return true;
	} else if ($gameSystem && $gameSystem._girlmoriActive === false) {
		return false;
	} else if (TR.GIR.PlaytestActive && $gameTemp.isPlaytest()) {
		return true;
	} else if (!$gameTemp.isPlaytest()) {
		if (!!$modLoader.knownMods) {
			if ($modLoader.knownMods.has('girlmori') || $modLoader.knownMods.has('girlmori_delta')) {
				return true;
			} else if (TR.GIR.DeniedActive && $modLoader.deniedMods) {
				return ($modLoader.deniedMods.has('girlmori') || $modLoader.deniedMods.has('girlmori_delta'));
			};
		};
	};
	return false;
};

TR.GIR.convertCaseText = Window_Base.prototype.convertCaseText;
Window_Base.prototype.convertCaseText = function(text) {
  text = text.replace(/\x1bTRANSRIGHTS\{(.*?):(.*?)\}/gi, function() {
    var x = arguments[1];
    var y = arguments[2];
    var text = ImageManager.isGirlmoriActive() ? x : y;
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
		};
	};
	// Return Original Function
	return TR.GIR.pluginCommand.call(this, command, args);
};
