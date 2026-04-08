//=============================================================================
// TR_GlobalData - By TomatoRadio
// TR_GlobalData.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_GlobalData = true;

var TR = TR || {};
TR.GD = TR.GD || {};

/*: 
 * @plugindesc v1.0 Allows storing data in a global file that can be accessed across saves.
 * @author TomatoRadio
 * 
 * @help
 * Please read the plugin code.
 */

TR.GD.Mod = {}; // Replace Mod with your mod's prefix. This will be used by all of the functions. I advise using ctrl+h to quickly replace all instances of "Mod"
TR.GD.Mod.dataFile = "data.mod" // This is the name of the file being written to store the data. It will be in the saves folder.

/**
 * Returns the data from the global file.
 * If the global file doesn't exist, it will make the file.
 * 
 * @returns {Object} An object of all the data.
 */
TR.GD.Mod.getGlobalData = function() {
  if (DataManager.readFromFile(TR.GD.Mod.dataFile) === 0) {this.writeToGlobalData({})};
  var string = DataManager.readFromFile(TR.GD.Mod.dataFile);
  return JSON.parse(string);
};

/**
 * Writes the json object to the global data object.
 * This will entirely overwrite any prior data in the
 * file. Be careful.
 * 
 * @param {Object} data A json-object. 
 */
TR.GD.Mod.writeToGlobalData = function(data) {
  file = JSON.stringify(data);
  DataManager.writeToFile(file,TR.GD.Mod.dataFile);
};

/**
 * Writes to a property of the global data without
 * modifying the rest of the object.
 * 
 * @param {*} key The key of the property to modify.
 * @param {*} val The value to set the property to.
 */
TR.GD.Mod.setAnyData = function(key,val) {
    var data = TR.GD.Mod.getGlobalData();
    data[key] = val;
    this.writeToGlobalData(data);
};