//=============================================================================
// Check Mod Data - By TomatoRadio
// TR_CheckModData.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_CheckModData = true;

var TR = TR || {};
TR.CMD = TR.CMD || {};
TR.CMD.version = 1;

/*: 
 * @plugindesc v1.0 Allows for easy checking of mods.
 * @author TomatoRadio
 * 
 * @help
 * Read plugin code for documentation.
 * 
*/

function ModCheck() {
  throw new Error("This is a static class.");
};

/**
 * Returns true if OneLoader is present
 * @returns {boolean}
 */
ModCheck.oneLoader = function() {
  return (typeof $modLoader !== "undefined");
};

/**
 * The value to return for checks made while
 * OneLoader is not present
 * @returns {*}
 */
ModCheck.noOneLoaderValue = function(type) {
  switch (type) {
    case "boolean": return true;
    case "number": return 0;
    default: return false;
  };
};

/**
 * Returns OneLoader's version number
 * @returns {number}
 */
ModCheck.oneLoaderVersion = function() {
  if (!ModCheck.oneLoader) return ModCheck.noOneLoaderValue("number");
  return Number($modLoader.knownMods.get("oneloader").version);
};

/**
 * Returns true if the user has played the mod before.
 * It does this by checking if it exists in the mods.json file.
 * Accepts both single modIds and arrays of them.
 * If an array, returns true if any of the mods exist.
 * @returns {boolean}
 */
ModCheck.playedMod = function(modId) {
  if (!ModCheck.oneLoader) return ModCheck.noOneLoaderValue("boolean");
  if (typeof modId === "string") modId = [modId]; //Converts solo mod ids into arrays
  for (let id of Object.keys($modLoader.config)) {if (modId.includes(id)) return true;};
  return false;
};

/**
 * Returns true if the mod is currently loaded.
 * Arrays are accepted.
 * There is a second arguement to also check for mods
 * that got denied by DenyInjection.js
 * @returns {boolean}
 */
ModCheck.modActive = function(modId,denied=false) {
  if (!ModCheck.oneLoader) return ModCheck.noOneLoaderValue("boolean");
  if (typeof modId === "string") modId = [modId]; //Converts solo mod ids into arrays
  for (let id of Object.keys($modLoader.knownMods)) {if (modId.includes(id)) return true;};
  if (denied && $modLoader.deniedMods) {for (let id of $modLoader.deniedMods) { if (modId.includes(id)) return true;};}
  return false;
};

/**
 * Returns the modId that has priority.
 * 1 for the first modId listed, 2 for the second, 0 if none.
 * A third param exists to check for delta preference.
 * If excluded or false, it checks the conflict resolution instead.
 * @returns {number}
 */
ModCheck.priority = function(mod1,mod2,delta=false) {
  if (!ModCheck.oneLoader) return ModCheck.noOneLoaderValue("number");
  var pair = Array.from(mod1,mod2);pair.sort();
  if (delta) {
    var key = pair.join("\u0000\u0001\u0000");
    return $modLoader.config._deltaPreferences[key] || 0;
  } else {
    var key = pair.join("\u0000");
    return $modLoader.config._conflictResolutions[key] || 0;
  };
};

/**
 * Returns true if oneLoader is in Test Mode.
 * Not having OneLoader will NOT use ModCheck.noOneLoaderValue()
 * and rather return false.
 * @returns {boolean}
 */
ModCheck.isInTestMode = function() {
  if (!ModCheck.oneLoader) return false;
  return $modLoader.isInTestMode;
};