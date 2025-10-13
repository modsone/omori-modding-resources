//=============================================================================
// Ordered Skills - By TomatoRadio
// TR_OrderedSkills.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_OrderedSkills = true;

var TR = TR || {};
TR.OS = TR.OS || {};
TR.OS.version = 1.2;

/*: 
 *
 * @plugindesc Allows hardcoded ordering of the skills in an actor's skill select menu.
 * Version 1.2
 * @author TomatoRadio
 * 
 * @help
 * Read plugin code.
 * 
*/

//When making the skill list, the game will first add all of these,
//then add any skill the actor knows that isnt here at the bottom in
//ID order.
TR.OS.OrderedSkills = 
{
/*
ActorId: [SkillId,SkillId],
Examples:
22: [2,4,16,3],
29: [12,2,3,16],
*/
}

// DO NOT TOUCH THIS

Window_OmoMenuActorSkillList.prototype.makeItemList = function() {
  if (this._actor) {
    this._data = this._actor.equipableSkills().filter(function(item) {
      return this.includes(item);
    }, this);
    var temp = [];
    for (const index of this._actor.orderedSkills()) {
      this._data.forEach(function(skill) {
        if (skill.id === index) temp.push(skill);
      })
    }
    var temp2 = this._actor.equipableSkills().filter((skill) => !temp.includes(skill), this)
    for (const skill of temp2) {
      temp.push(skill);
    }
    this._data = temp
  } else {
    this._data = [];
  };
  // Push Unequip Null Data
  this._data.push(null);
};

Game_Actor.prototype.orderedSkills = function() {
  var skills = this.skills()
  var returnArray = [];
  if (TR.OS.OrderedSkills[this._actorId].orderedSkills && Array.isArray(TR.OS.OrderedSkills[this._actorId])) {
      for (const skill of TR.OS.OrderedSkills[this._actorId]) {
        if (skills.includes(skill)) returnArray.push(skill);
      }
  }
  if (skills && Array.isArray(skills)) {
    for (const skill of this.skills()) {
      if (!returnArray.includes(skill)) returnArray.push(skill);
    }
  }
  return returnArray;

}
