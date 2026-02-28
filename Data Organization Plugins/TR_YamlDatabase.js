//=============================================================================
// YAML Database - By TomatoRadio
// TR_YamlDatabase.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_YamlDatabase = true;

var TR = TR || {};
TR.YD = TR.YD || {};
TR.YD.version = 1.1;

/*: 
 *
 * @plugindesc Allows storing Database text as a YAML file.
 * Version 1.1
 * @author TomatoRadio (With help from Bajamaid)
 * 
 * @help
 * See example YAML for how to set this up.
 * 
 * @param DatabaseYaml
 * @text Database YAML
 * @desc The YAML file that the Database is in.
 * 
*/

TR.YD.Param = PluginManager.parameters('TR_YamlDatabase');

TR.YD.DatabaseYaml = String(TR.YD.Param["DatabaseYaml"]).trim();

TR.YD.isDatabaseLoaded = DataManager.isDatabaseLoaded
DataManager.isDatabaseLoaded = function() {
  if (!TR.YD.isDatabaseLoaded.call(this)) return false;
  this.applyYamlText(TR.YD.DatabaseYaml);
  return true;
};

DataManager.applyYamlText = function(yamlFile) {
  data = LanguageManager.getMessageData(`${yamlFile}.database`);
  for (const tab in data) {
    let json;
    switch (tab) {
      case "actors": json = $dataActors; break;
      case "classes": json = $dataClasses; break;
      case "skills": json = $dataSkills; break;
      case "items": json = $dataItems; break;
      case "weapons": json = $dataWeapons; break;
      case "armors": json = $dataArmors; break;
      case "enemies": json = $dataEnemies; break;
      case "troops": json = $dataTroops; break;
      case "states": json = $dataStates; break;
      case "animations": json = $dataAnimations; break;
      case "tilesets": json = $dataTilesets; break;
      case "commonEvents": json = $dataCommonEvents; break;
      case "system": json = $dataSystem; break;
      case "mapInfos": json = $dataMapInfos; break;
    }
    let injector = data[tab];
    for (const id in injector) {
      let base = json[id]
      let mod  = injector[id]
      for (const prop in mod) {
        base[prop] = mod[prop]
      }
    }
  }
}