
/*:
 * @plugindesc v1.1 Adds extended state/category condition checks for enemy AI.
 * @author WHITENOISE (Initial Draft + Idea) & Koffin
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin adds new condition types for YEP_BattleAICore's AI Priority system:
 *
 * ============================================================================
 * NEW State Conditions
 * ============================================================================
 * Party Conditions:
 *   ANY STATE === State X       - True if any party member has state X
 *   ANY CATEGORY === Category   - True if any party member has a state from category
 *   PARTY STATE === State X     - True if all alive party members have state X
 *   PARTY CATEGORY === Category - True if all alive party members have a state from category
 *
 * Enemy Conditions:
 *   ENEMY STATE === State X       - True if any enemy has state X
 *   ENEMY CATEGORY === Category   - True if any enemy has a state from category
 *   TROOP STATE === State X       - True if all alive enemies have state X
 *   TROOP CATEGORY === Category   - True if all alive enemies have a state from category
 *
 * ============================================================================
 * Condition Examples
 * ============================================================================
 *
 * Note: PARTY & TROOP versions will check for ALL ALIVE BATTLERS on their respective
 * sides. the "Any" version check for ANYone that has that state.
 *
 * <AI Priority>
 *   // Party conditions
 *   ANY STATE === State 6: SKILL 18, target
 *   ANY CATEGORY === BUFF: SKILL 19, Highest MAT
 *   PARTY STATE === State 5: SKILL 18, target
 *   PARTY CATEGORY === DEBUFF: SKILL 19, Lowest HP%
 *   
 *   // Enemy conditions
 *   ENEMY STATE === State 10: SKILL 18, target
 *   ENEMY CATEGORY === BUFF: SKILL 19, Highest LUK
 *   TROOP STATE === State 10: SKILL 18, target
 *   TROOP CATEGORY === DEBUFF: SKILL 19, User
 * </AI Priority>
 *
 * ============================================================================
 * NEW Turn Conditions
 * ============================================================================
 *
 *   EVERY X TURNS: Skill Y, target
 *   - Activates every X battle turns (starting from turn 0)
 *   - Example: EVERY 3 TURNS: Skill 10, target (turns 3,6,9...)
 *
 *   ODD X TURNS: Skill Y, target
 *   - Activates every X battle turns (starting from turn 1)
 *   - Example: ODD 3 TURNS: Skill 10, target (turns 1,4,7...)
 *
 * Plankton's Tip: Odd turns are useful for if you want different enemies not 
 * interfere with each  other's skills by setting them up to be on odd and even 
 * turns respectively.
 *
 *
 */

var Imported = Imported || {};
Imported.YEP_BattleAICore_ExtendedConditions = true;

//=============================================================================
// AIManager - New Condition Checks
//=============================================================================

// Override the passAIConditions function to add our new conditions
Yanfly.CoreAI.AIManager_passAIConditions = AIManager.passAIConditions;
AIManager.passAIConditions = function(line) {
  // Check for our new conditions first
  // Party Conditions
  if (line.match(/ANY[ ]STATE[ ]===[ ](.*)/i)) {
    return this.conditionAnyState(String(RegExp.$1), $gameParty.members());
  }
  if (line.match(/ANY[ ]CATEGORY[ ]===[ ](.*)/i)) {
    return this.conditionAnyCategory(String(RegExp.$1), $gameParty.members());
  }
  if (line.match(/PARTY[ ]STATE[ ]===[ ](.*)/i)) {
    return this.conditionPartyState(String(RegExp.$1), $gameParty.aliveMembers());
  }
  if (line.match(/PARTY[ ]CATEGORY[ ]===[ ](.*)/i)) {
    return this.conditionPartyCategory(String(RegExp.$1), $gameParty.aliveMembers());
  }
  
  // Enemy Conditions
  if (line.match(/ENEMY[ ]STATE[ ]===[ ](.*)/i)) {
    return this.conditionAnyState(String(RegExp.$1), $gameTroop.members());
  }
  if (line.match(/ENEMY[ ]CATEGORY[ ]===[ ](.*)/i)) {
    return this.conditionAnyCategory(String(RegExp.$1), $gameTroop.members());
  }
  if (line.match(/TROOP[ ]STATE[ ]===[ ](.*)/i)) {
    return this.conditionPartyState(String(RegExp.$1), $gameTroop.aliveMembers());
  }
  if (line.match(/TROOP[ ]CATEGORY[ ]===[ ](.*)/i)) {
    return this.conditionPartyCategory(String(RegExp.$1), $gameTroop.aliveMembers());
  }
  
  // Turn Conditions
  if (line.match(/EVERY[ ](\d+)[ ]TURNS/i)) {
    return this.conditionEveryXTurns(parseInt(RegExp.$1), false);
  }
  if (line.match(/EVERY[ ](\d+)[ ]ODD[ ]TURNS/i)) {
    return this.conditionEveryXTurns(parseInt(RegExp.$1), true);
  }


  // Fall back to original conditions
  return Yanfly.CoreAI.AIManager_passAIConditions.call(this, line);
};

// Check if any member in unit has the specified state
AIManager.conditionAnyState = function(condition, unit) {
  var stateId = this.getStateIdFromCondition(condition);
  if (stateId < 0) return false;
  
  var hasState = unit.some(function(member) {
    return member && member.isStateAffected(stateId);
  });
  
  if (!hasState) return false;
  
  var group = this.getActionGroup();
  this.setProperTarget(group);
  return true;
};

// Check if any member in unit has a state from the specified category
AIManager.conditionAnyCategory = function(category, unit) {
  category = category.trim().toUpperCase();
  
  var hasCategory = unit.some(function(member) {
    if (!member) return false;
    return member.states().some(function(state) {
      return state && state.category && state.category.contains(category);
    });
  });
  
  if (!hasCategory) return false;
  
  var group = this.getActionGroup();
  this.setProperTarget(group);
  return true;
};

// Check if all members in unit have the specified state
AIManager.conditionPartyState = function(condition, unit) {
  var stateId = this.getStateIdFromCondition(condition);
  if (stateId < 0) return false;
  
  var allHaveState = unit.every(function(member) {
    return member && member.isStateAffected(stateId);
  });
  
  if (!allHaveState) return false;
  
  var group = this.getActionGroup();
  this.setProperTarget(group);
  return true;
};

// Check if all members in unit have a state from the specified category
AIManager.conditionPartyCategory = function(category, unit) {
  category = category.trim().toUpperCase();
  
  var allHaveCategory = unit.every(function(member) {
    if (!member) return false;
    return member.states().some(function(state) {
      return state && state.category && state.category.contains(category);
    });
  });
  
  if (!allHaveCategory) return false;
  
  var group = this.getActionGroup();
  this.setProperTarget(group);
  return true;
};

// Helper function to parse state ID from condition (supports both ID and name)
AIManager.getStateIdFromCondition = function(condition) {
  if (condition.match(/STATE[ ](\d+)/i)) {
    return parseInt(RegExp.$1);
  } else {
    return Yanfly.StateIdRef[condition.trim().toUpperCase()] || -1;
  }
};

AIManager.conditionEveryXTurns = function(x, offset) {
  var turnCount = Yanfly.Param.CoreAIDynTurnCnt && BattleManager._phase === "input" 
    ? $gameTroop.turnCount() + 1 
    : $gameTroop.turnCount();
  
  if (offset) turnCount++; // Add 1 for ODD version
  
  if (turnCount % x !== 0) return false;
  
  var group = this.getActionGroup();
  this.setProperTarget(group);
  return true;
};

//=============================================================================
// End of File
//=============================================================================