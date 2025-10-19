// Script calls are required to use the injected items. The name will be the name of the database item without the "[I]".

// KNOWN SCRIPT CALLS:
// battler.addState(Injector_Ids.state["STATE"]), battler.removeState(Injector_Ids.state["STATE"]): Adds and removes a state
// battler.startAnimation(Injector_Ids.animation["ANIMATION"]): Plays a battle animation
// $gameParty.gainItem(Injector_Ids.item["ITEM"], 1): Gives an item
// $gameTemp.reserveCommonEvent(Injector_Ids.event["COMMON EVENT"]): Runs a common event
// Enemies require a new plugin.

var Mod_Character = Mod_Character || {};
var Injector_Ids = Injector_Ids || {};

DataManager.injectSkillJson = function() {
    const fs = require('fs');
    const path = require("path");
    const base = path.dirname(process.mainModule.filename);
    if (fs.existsSync(`${base}/injector/Skills.json`)) {
        let skill_json = JSON.parse(fs.readFileSync(`${base}/injector/Skills.json`, 'utf8'));
        for (var i = 1; i < skill_json.length; i++) {
            if (skill_json[i].name.includes("[I]")) {
                let name = skill_json[i].name.replace("[I] ", "");
                DataManager.injectSkill(name, skill_json[i], 0);
            }
        }
    }
};

DataManager.injectCommonEventJson = function() {
    const fs = require('fs');
    const path = require("path");
    const base = path.dirname(process.mainModule.filename);
    if (fs.existsSync(`${base}/injector/CommonEvents.json`)) {
        let event_json = JSON.parse(fs.readFileSync(`${base}/injector/CommonEvents.json`, 'utf8'));
        for (var i = 1; i < event_json.length; i++) {
            if (event_json[i].name.includes("[I]")) {
                let name = event_json[i].name.replace("[I] ", "");
                DataManager.injectCommonEvent(name, event_json[i], 0);
            }
        }
    }
};

DataManager.injectJson = function(filename, data, idname) {
    const fs = require('fs');
    const path = require("path");
    const base = path.dirname(process.mainModule.filename);
    if (fs.existsSync(`${base}/injector/${filename}.json`)) {
        let event_json = JSON.parse(fs.readFileSync(`${base}/injector/${filename}.json`, 'utf8'));
        for (var i = 1; i < event_json.length; i++) {
            if (event_json[i].name.includes("[I]")) {
                let name = event_json[i].name.replace("[I] ", "");
                DataManager.injectGeneric(name, data, event_json[i], idname);
            }
        }
    }
};


Mod_Character.extend = function (mainArray, otherArray) {
  otherArray.forEach(function (i) {
    mainArray.push(i);
  }, this);
};

/**
 * Dictionary of ids. Instantiate as 0, actual number is set on database load.
 * In other note tags you can then get ids like Injector_Ids.skill["Lucille Heal"]
 */
Injector_Ids.skill = {
};

Injector_Ids.event = {
};

Injector_Ids.enemy = {
};

Injector_Ids.troop = {
};

Injector_Ids.state = {
};

Injector_Ids.animation = {
};

Injector_Ids.item = {
};

Mod_Character.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function () {
  if (!Mod_Character.DataManager_isDatabaseLoaded.call(this)) return false;
  //this.injectLucilleData();
    this.injectJson("CommonEvents", $dataCommonEvents, Injector_Ids.event);
  this.injectJson("Skills", $dataSkills, Injector_Ids.skill);
  this.injectJson("Troops", $dataTroops, Injector_Ids.troop);
  this.injectJson("States", $dataStates, Injector_Ids.state);
  this.injectJson("Enemies", $dataEnemies, Injector_Ids.enemy);
  this.injectJson("Animations", $dataAnimations, Injector_Ids.animation);
  this.injectJson("Items", $dataItems, Injector_Ids.item);
  return true;
};

/**
 * Injects a skill into data skill.
 * @param {*} name The name of the skill associated.
 * @param {*} data The entire JSON-like data of the actual skill. It's ID will be replaced.
 * @param {*} offset The offset from end length of skill list.
 */
DataManager.injectSkill = function (name, data, offset = 0) {
    let skillId = $dataSkills.length + offset;
    Injector_Ids.skill[name] = skillId;
    data.id = skillId;
    $dataSkills.push(data);
    this.extractMetadata($dataSkills[skillId]);
};

DataManager.injectGeneric = function (name, type, data, idname) {
    let eventId = type.length;
    idname[name] = eventId;
    data.id = eventId;
    if (type === $dataEnemies) {
        data.name = data.name.replace("[I] ", "");
        data.note = data.note.replace(/<TransformBaseID: (\d+)>/gm, "<TransformBaseID: " + eventId + ">")
    }
    type.push(data);
    if (data.note !== undefined) {
      this.extractMetadata(type[eventId]);
    }
};

DataManager.injectCommonEvent = function (name, data, offset = 0) {
    let eventId = $dataCommonEvents.length + offset;
    Injector_Ids.event[name] = eventId;
    data.id = eventId;
    $dataCommonEvents.push(data);
};

DataManager.injectLucilleTroopData = function () {
  var base_troop = injectedTroop;
  var troop = $dataTroops[1];
  Mod_Character.extend(troop.pages, base_troop.pages);
};

