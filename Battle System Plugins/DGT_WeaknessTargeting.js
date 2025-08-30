/*:
 * @plugindesc SKill Weakness Targetting
 * @author Draught
 * @help
 *
 * @help 
 * Put this text in the notes of the skill that you want to exploit emotion, 
 * with x being the % chance of the skill targeting someone the user has 
 * emotion advantage against.
 * <Target: x EXPLOIT EMOTION>
 * 
 * Example:
 * <Target: 75 EXPLOIT EMOTION>
 * This would give the skill a 75% chance of targeting someone the user 
 * has emotion advantage against.
 *
 * If x is 0, the % chance will instead be equal to the user's M.Attack stat,
 * making it possible to change the exploitation chance mid-battle.
 * Note that the % chance is only for if the skill tries to exploit emotion, 
 * skills can still randomly hit someone the user is strong against when not 
 * exploiting emotion.
 *
 *
 *
 *
 *
 *
 */

//=============================================================================

let old_Game_Action_prototype_needsSelection = Game_Action.prototype.needsSelection;
Game_Action.prototype.needsSelection = function () {
  // If Action is for everybody return false
  if (this.isForEverybody() || this.isExploitEmotion()) { return false; };
  // Return Original Function
  return _TDS_.OmoriBattleSystem.Game_Action_needsSelection.call(this);
};
//=============================================================================
// * Determine if Action can exploit emotions
//=============================================================================
Game_Action.prototype.isExploitEmotion = function () {
  // Get Item
  let item = this.item();
  // If item exist
  if (item) {
    if (item.meta.Target && item.meta.Target.match(/(\d+)[ ]EXPLOIT EMOTION/i)) {
      exploitRng = parseInt(RegExp.$1);
      return true;
    }
  };
  // Return false by default
  return false;
};

//=============================================================================
// * Make Targets
//=============================================================================
let old_Game_Action_prototype_makeTargets = Game_Action.prototype.makeTargets
Game_Action.prototype.makeTargets = function () {
  // If action is for everyone
  if (this.isForEverybody()) {
    // Initialize Target Array
    let targets = this.friendsUnit().aliveMembers().concat(this.opponentsUnit().aliveMembers());
    // Return Targets
    return this.repeatTargets(targets);
  };
  if (this.isExploitEmotion()) {
    if (this.isValid() && this.isTauntable()) {
      $gameTemp._taunt = true
      $gameTemp._tauntAction = this
    }
    foes = this.opponentsUnit().aliveMembers();
    if (this.isValid() && this.isTauntable()) {
      $gameTemp._taunt = false
    }
    $gameTemp._tauntAction = undefined
    var targets = [];
    var exploitRng2 = ((Math.random() * 99) + 1);
    if (exploitRng == 0) { exploitRng = BattleManager._subject.mat };
    console.log("exploitRng = " + exploitRng);
    console.log("exploitRng2 = " + exploitRng2);
    //Chance of exploiting emotion
    if (exploitRng2 <= exploitRng) {
      console.log("Emotion was exploited");
      if (BattleManager._subject.isEmotionAffected("happy")) {
        for (var i = 0; i < foes.length; ++i) {
          var member = foes[i];
          if (member.isStateCategoryAffected('ANGRY') || member.isStateCategoryAffected('AFRAID') || member.isStateCategoryAffected('PANIC')) targets.push(member);
        }
      } else if (BattleManager._subject.isEmotionAffected("sad")) {
        for (var i = 0; i < foes.length; ++i) {
          var member = foes[i];
          if (member.isStateCategoryAffected('HAPPY') || member.isStateCategoryAffected('AFRAID') || member.isStateCategoryAffected('PANIC')) targets.push(member);
        }
      } else if (BattleManager._subject.isEmotionAffected("angry")) {
        for (var i = 0; i < foes.length; ++i) {
          var member = foes[i];
          if (member.isStateCategoryAffected('SAD') || member.isStateCategoryAffected('AFRAID') || member.isStateCategoryAffected('PANIC')) targets.push(member);
        }
      }
    } else {
      console.log("Emotion was not exploited");
    }
    if (targets.length == 0) {
      for (var i = 0; i < foes.length; ++i) {
        var member = foes[i];
        targets.push(member);
      }
    }
    var randomMember = targets[Math.floor(Math.random() * targets.length)]
    targets = [];
    targets.push(randomMember);
    return this.repeatTargets(targets);
  };
  // Return Original Function
  return _TDS_.OmoriBattleSystem.Game_Action_makeTargets.call(this);
};