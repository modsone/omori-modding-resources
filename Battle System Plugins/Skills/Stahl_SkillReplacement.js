/*:
 * @plugindesc [v1.1.0] Makes Skills be replacable when having certain equips
 * 
 * @author StahlReyn
 *
 * @help
 * In Equipments Notetag (Armors and Weapons)
 * <REPLACE SKILL: x, y>
 * x is id of skill being replaced
 * y is id of skill to replace to
 * 
 * Can have multiple tags.
 * 
 * Dependency: Place BELOW Stahl_ExtendedItemDisplay for skill to show up in equip list.
 */

var Imported = Imported || {};
Imported.Stahl_SkillReplacement = true;

var Stahl = Stahl || {};
Stahl.SkillReplacement = Stahl.SkillReplacement || {};

// ================================================================
// * Data Manager
// ================================================================
Stahl.SkillReplacement.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
if (!Stahl.SkillReplacement.DataManager_isDatabaseLoaded.call(this)) return false;
if (!Stahl._loaded_SkillReplacement) {
    this.processSkillReplacementNotetags1($dataArmors);
    this.processSkillReplacementNotetags1($dataWeapons);
    Stahl._loaded_SkillReplacement = true;
}
return true;
};

DataManager.processSkillReplacementNotetags1 = function(group) {
    $dataStateBuffs = $dataStateBuffs || [];
    for (var n = 1; n < group.length; n++) {
        var obj = group[n];
        var notedata = obj.note.split(/[\r\n]+/);

        obj.skillReplacements = {};

        for (var i = 0; i < notedata.length; i++) {
            var line = notedata[i];
            if (line.match(/<REPLACE SKILL: (\d+), (\d+)>/i)) {
                obj.skillReplacements[parseInt(RegExp.$1)] = parseInt(RegExp.$2);
            }
        }
    }
};

// ================================================================
// * Functionality
// ================================================================

// This does NOT change actual skill equipped in battler's data as a variable,
// this only replace call for "final" skill list when actually used
Stahl.SkillReplacement.Game_Actor_skills = Game_Actor.prototype.skills;
Game_Actor.prototype.skills = function () {
  // Get List
  var list = Stahl.SkillReplacement.Game_Actor_skills.call(this);
  // Check Replacements
  for (let i = 0; i < list.length; i++) {
    const skill = list[i];
    if (!skill) continue;
    const oldSkillId = skill.id;
    const newSkillId = this.getSkillReplacementId(oldSkillId);
    if (oldSkillId != newSkillId) {
      // console.log("Replaced skill", oldSkillId, "to", newSkillId);
      list[i] = $dataSkills[newSkillId];
    }
  }
  return list;
};

// Gets replacing skill id, return same if not found any.
Game_Actor.prototype.getSkillReplacementId = function (id) {
  let equips = this.equips();
  for (const equipItem of equips) {
    if (equipItem && equipItem.skillReplacements[id]) {
      return equipItem.skillReplacements[id];
    }
  }
  return id;
}

// Requires Stahl_ExtendedItemDisplay to show in equip list.
Window_OmoMenuActorSkillList.prototype.getItemFromIndex = function(index) {
  let actor = this._actor;
  let oldSkill = this._data[index];
  if (!oldSkill) return oldSkill;
  return $dataSkills[actor.getSkillReplacementId(oldSkill.id)]; // Index is same as old skill id
};

// This replaces so the Help Window also gets the "replaced" skill.
// This does NOT change actual skill equipped, just only towards visual menu.
Window_OmoMenuActorSkillList.prototype.updateHelp = function() {
  let actor = this._actor;
  let oldSkill = this.item();
  if (oldSkill) {
    this.setHelpWindowItem($dataSkills[actor.getSkillReplacementId(oldSkill.id)]);
  } else {
    this.setHelpWindowItem(oldSkill); // basically null
  }
};