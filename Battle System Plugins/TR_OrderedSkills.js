//=============================================================================
// Ordered Skills - By TomatoRadio
// TR_OrderedSkills.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_OrderedSkills = true;

var TR = TR || {};
TR.OS = TR.OS || {};
TR.OS.version = 1.0;

/*: 
 *
 * @plugindesc Allows hardcoded ordering of the skills in an actor's skill select menu.
 * Version 1.0
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

Window_OmoMenuActorSkillEquip.prototype.skillAtIndex = function(index) {
  // Get Index
  if (index === undefined) { index = this.index(); };  
  // Get Actor At Index
  var actor = this.actor();
  // If Actor Exists
  if (actor) {
    // Return Actor Equips slotted at index
    return actor.orderedSkills()[index];
  };
  // Return null
  return null;
};

Game_Actor.prototype.orderedSkills = function() {
  var skills = this.skills()
  var returnArray = [];
  if (this.orderedSkills) {
      for (const skill of TR.OS.OrderedSkills[this._actorId]) {
        if (skills.includes(skill)) returnArray.push(skill);
      }
  } else {
    for (const skill of this.skills()) {
      if (!returnArray.includes(skill)) returnArray.push(skill);
    }
  }
  return returnArray;
}