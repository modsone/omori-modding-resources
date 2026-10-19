//=============================================================================
// KOFFIN_BattleAICore_CombinedPatches.js
//=============================================================================
/*:
 * @plugindesc v1.0 Combines multiple Battle AI Core patches into one.
 * Includes: Target Eval, Extended Conditions, Target Rate Fix, Emotion Addon
 * @author KoffinKrypt, Draughtnyan (TARGEVAL)
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin combines four patches for YEP_BattleAICore into a single file
 * to prevent conflicts between them.
 *
 * Included Patches:
 * 1. DGT_targetEval - Adds TARGEVAL condition for target-specific eval (target.)
 * 2. KOFFIN_ExtraBattleAIConditions - Extended state & turn conditions
 * 3. KOFFIN_TargetRateFix - Makes target rates (tgr) work with random targeting
 * 4. KOFFIN_BattleAICore_EmotionAddon - OMORI emotion system support
 *
 * ============================================================================
 * New Conditions
 * ============================================================================
 *
 * TARGEVAL code - Evaluate code with access to 'target' variable
 *
 * ANY STATE === State X - True if any party member has state X
 * ANY CATEGORY === Category - True if any party member has state from category
 * PARTY STATE === State X - True if all alive party members have state X
 * PARTY CATEGORY === Category - True if all alive party members have state from category
 * ENEMY STATE === State X - True if any enemy has state X
 * ENEMY CATEGORY === Category - True if any enemy has state from category
 * TROOP STATE === State X - True if all alive enemies have state X
 * TROOP CATEGORY === Category - True if all alive enemies have state from category
 *
 * EVERY X TURNS: Skill Y - Activates every X battle turns
 * ODD X TURNS: Skill Y - Activates every X battle turns (starting from turn 1)
 *
 * EMOTION X case - Match target's emotion (HAPPY, SAD, ANGRY, AFRAID, ANY)
 * USER EMOTION X case - Match user's emotion tier
 *
 * ============================================================================
 * New Targeting Options
 * ============================================================================
 *
 * Highest/Lowest HAP - Happiness tier targeting
 * Highest/Lowest SAD - Sadness tier targeting
 * Highest/Lowest ANG - Anger tier targeting
 * Highest/Lowest FEA - Fear tier targeting
 * Highest/Lowest EMO - Any emotion tier targeting
 *
 * ============================================================================
 * Note: Target Rate Fix makes random targeting respect each battler's tgr value
 * If the battler has no tgr set, it's treated as if it has the default amount(100)
 * ============================================================================
 */

var Imported = Imported || {};
Imported.YEP_BattleAICore_CombinedPatches = true;
Imported.YEP_BattleAICore_ExtendedConditions = true;

//=============================================================================
// Setup Storage
//=============================================================================

window.DGT = window.DGT || {};
DGT.targetCondition = DGT.targetCondition || {};

//=============================================================================
// Helper Functions
//=============================================================================

// Storage for original functions
var _KOFFIN_Combined_Original = {};

//=============================================================================
// 1. TARGET RATE FIX (Highest priority - executes last in target selection)
//=============================================================================

AIManager.setRandomTarget = function(group) {
    if (group.length <= 0) return;
    
    var totalWeight = 0;
    var weights = [];
    
    for (var i = 0; i < group.length; ++i) {
        var target = group[i];
        var weight = target.tgr || 1.0;
        weights.push(weight);
        totalWeight += weight;
    }
    
    var randomValue = Math.random() * totalWeight;
    var weightSum = 0;
    
    for (var i = 0; i < group.length; ++i) {
        weightSum += weights[i];
        if (randomValue <= weightSum) {
            this.action().setTarget(group[i].index());
            return;
        }
    }
    
    this.action().setTarget(group[0].index());
};

//=============================================================================
// 2. TARGET EVALUATION (from DGT_targetEval)
//=============================================================================

AIManager.conditionEvalWithTarget = function(condition) {
    var action = this.action();
    var item = action.item();
    var user = this.battler();
    var s = $gameSwitches._data;
    var v = $gameVariables._data;

    var group = this.getActionGroup();
    var validTargets = [];
    for (var i = 0; i < group.length; ++i) {
        var target = group[i];
        if (!target) continue;
        try {
            if (eval(condition)) validTargets.push(target);
        } catch (e) {
            Yanfly.Util.displayError(e, condition, 'A.I. EVAL WITH TARGETS ERROR');
        }
    }
    if (validTargets.length <= 0) return false;
    this.setProperTarget(validTargets);
    return true;
};

//=============================================================================
// 3. EMOTION ADDON - Emotion Helper Functions
//=============================================================================

AIManager.getStateId = function(string) {
    string = string.toUpperCase();
    switch (string) {
        case 'HAP': return [6, 7, 8];
        case 'SAD': return [10, 11, 12];
        case 'ANG': return [14, 15, 16];
        case 'FEA': return [18, 19, 20];
        case 'EMO': return [6, 7, 8, 10, 11, 12, 14, 15, 16, 18, 19, 20];
        default: return [];
    }
};

AIManager.getEmotionTier = function(target, stateIds) {
    let maxTier = 0;
    for (let i = 0; i < stateIds.length; i++) {
        if (target.isStateAffected(stateIds[i])) {
            maxTier = Math.max(maxTier, i + 1);
        }
    }
    return maxTier;
};

AIManager.setHighestEmotionTarget = function(group, stateIds) {
    var maintarget = group[Math.floor(Math.random() * group.length)];
    var highestTier = 0;

    for (var i = 0; i < group.length; ++i) {
        var target = group[i];
        for (var tier = 0; tier < stateIds.length; ++tier) {
            if (target.isStateAffected(stateIds[tier]) && tier + 1 > highestTier) {
                maintarget = target;
                highestTier = tier + 1;
            }
        }
    }
    this.action().setTarget(maintarget.index());
};

AIManager.setLowestEmotionTarget = function(group, stateIds) {
    var maintarget = group[Math.floor(Math.random() * group.length)];
    var lowestTier = Infinity;

    for (var i = 0; i < group.length; ++i) {
        var target = group[i];
        for (var tier = 0; tier < stateIds.length; ++tier) {
            if (target.isStateAffected(stateIds[tier]) && tier + 1 < lowestTier) {
                maintarget = target;
                lowestTier = tier + 1;
            }
        }
    }
    this.action().setTarget(maintarget.index());
};

//=============================================================================
// 4. EMOTION ADDON - Extended setProperTarget with Emotion Targeting
//=============================================================================

_KOFFIN_Combined_Original.setProperTarget = AIManager.setProperTarget;
AIManager.setProperTarget = function(group) {
    this.setActionGroup(group);
    var action = this.action();
    var randomTarget = group[Math.floor(Math.random() * group.length)];
    if (!randomTarget) return action.setTarget(0);
    if (group.length <= 0) return action.setTarget(randomTarget.index());
    var line = this._aiTarget.toUpperCase();
    
    if (line.match(/FIRST/i)) {
        action.setTarget(0);
    } else if (line.match(/USER/i)) {
        action.setTarget(action.subject().index());
    } else if (line.match(/HIGHEST[ ](HAP|SAD|ANG|FEA|EMO)/i)) {
        var emotion = this.getStateId(String(RegExp.$1));
        return this.setHighestEmotionTarget(group, emotion);
    } else if (line.match(/LOWEST[ ](HAP|SAD|ANG|FEA|EMO)/i)) {
        var emotion = this.getStateId(String(RegExp.$1));
        return this.setLowestEmotionTarget(group, emotion);
    } else if (line.match(/HIGHEST[ ](.*)/i)) {
        var param = this.getParamId(String(RegExp.$1));
        if (param < 0) return action.setTarget(randomTarget.index());
        if (param === 8) return this.setHighestHpFlatTarget(group);
        if (param === 9) return this.setHighestMpFlatTarget(group);
        if (param === 10) return this.setHighestHpRateTarget(group);
        if (param === 11) return this.setHighestMpRateTarget(group);
        if (param === 12) return this.setHighestLevelTarget(group);
        if (param === 13) return this.setHighestMaxTpTarget(group);
        if (param === 14) return this.setHighestTpTarget(group);
        if (param > 15) return action.setTarget(randomTarget.index());
        this.setHighestParamTarget(group, param);
    } else if (line.match(/LOWEST[ ](.*)/i)) {
        var param = this.getParamId(String(RegExp.$1));
        if (param < 0) return action.setTarget(randomTarget.index());
        if (param === 8) return this.setLowestHpFlatTarget(group);
        if (param === 9) return this.setLowestMpFlatTarget(group);
        if (param === 10) return this.setLowestHpRateTarget(group);
        if (param === 11) return this.setLowestMpRateTarget(group);
        if (param === 12) return this.setLowestLevelTarget(group);
        if (param === 13) return this.setLowestMaxTpTarget(group);
        if (param === 14) return this.setLowestTpTarget(group);
        if (param > 15) return action.setTarget(randomTarget.index());
        this.setLowestParamTarget(group, param);
    } else {
        this.setRandomTarget(group);
    }
};

//=============================================================================
// 5. EMOTION ADDON - Emotion Conditions (Emotion & User Emotion)
//=============================================================================

AIManager.conditionEmotion = function(emotion) {
    var emotionStates = {
        SAD: [10, 11, 12],
        HAPPY: [6, 7, 8],
        ANGRY: [14, 15, 16],
        AFRAID: [18, 19, 20],
        ANY: []
    };

    var statesToCheck = emotionStates[emotion] || [];
    if (emotion === "ANY") {
        statesToCheck = [].concat(...Object.values(emotionStates));
    }

    if (statesToCheck.length === 0) return false;

    var group = this.getActionGroup();
    var validTargets = [];

    for (var i = 0; i < group.length; ++i) {
        var target = group[i];
        if (!target) continue;
        if (statesToCheck.some(stateId => target.hasState(stateId))) {
            validTargets.push(target);
        }
    }

    if (validTargets.length <= 0) return false;
    this.setProperTarget(validTargets);
    return true;
};

AIManager.conditionUserEmotion = function(emotionState) {
    var user = this.battler();
    var emotionIds = null;

    switch (emotionState.toUpperCase()) {
        case 'HAPPY': emotionIds = [6, 197]; break;
        case 'ECSTATIC': emotionIds = [7, 122]; break;
        case 'MANIC': emotionIds = [8, 123]; break;
        case 'SAD': emotionIds = [10, 124]; break;
        case 'DEPRESSED': emotionIds = [11, 125]; break;
        case 'MISERABLE': emotionIds = [12, 126]; break;
        case 'ANGRY': emotionIds = [14, 119]; break;
        case 'ENRAGED': emotionIds = [15, 120]; break;
        case 'FURIOUS': emotionIds = [16, 121]; break;
        default: return false;
    }

    // Check if user has ANY of the emotion states 
    var hasEmotion = false;
    for (var i = 0; i < emotionIds.length; i++) {
        if (user.isStateAffected(emotionIds[i])) {
            hasEmotion = true;
            break;
        }
    }

    if (!hasEmotion) return false;

    // If user has the emotion, pass the FULL action group
    var group = this.getActionGroup();
    this.setProperTarget(group);
    return true;
};
//=============================================================================
// 6. EXTRA CONDITIONS - State & Category Helpers
//=============================================================================

AIManager.getStateIdFromCondition = function(condition) {
    if (condition.match(/STATE[ ](\d+)/i)) {
        return parseInt(RegExp.$1);
    } else {
        return Yanfly.StateIdRef[condition.trim().toUpperCase()] || -1;
    }
};

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

AIManager.conditionEveryXTurns = function(x, offset) {
    var turnCount = Yanfly.Param.CoreAIDynTurnCnt && BattleManager._phase === "input" 
        ? $gameTroop.turnCount() + 1 
        : $gameTroop.turnCount();
    
    if (offset) turnCount++;
    
    if (turnCount % x !== 0) return false;
    
    var group = this.getActionGroup();
    this.setProperTarget(group);
    return true;
};

//=============================================================================
// 7. COMBINED passAIConditions (Merges all condition types)
//=============================================================================

_KOFFIN_Combined_Original.passAIConditions = AIManager.passAIConditions;
AIManager.passAIConditions = function(line) {
	// EMOTION CONDITIONS (from EmotionAddon)
	if (line.match(/USER[ ]+EMOTION[ ]+(.*)/i)) {
    var emotionState = String(RegExp.$1);
    return this.conditionUserEmotion(emotionState);
    }

    if (line.match(/EMOTION[ ](SAD|HAPPY|ANGRY|AFRAID|ANY)/i)) {
        var emotion = String(RegExp.$1).toUpperCase();
        return this.conditionEmotion(emotion);
    }
    // EXTENDED CONDITIONS (from ExtraBattleAIConditions)
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
    if (line.match(/EVERY[ ](\d+)[ ]TURNS/i)) {
        return this.conditionEveryXTurns(parseInt(RegExp.$1), false);
    }
    if (line.match(/EVERY[ ](\d+)[ ]ODD[ ]TURNS/i)) {
        return this.conditionEveryXTurns(parseInt(RegExp.$1), true);
    }
    
    // TARGET EVAL CONDITION (from DGT_targetEval)
    if (line.match(/TARGEVAL[ ](.*)/i)) {
        var condition = String(RegExp.$1);
        return this.conditionEvalWithTarget(condition);
    }
    
    // ALWAYS
    if (line.match(/ALWAYS/i)) {
        return this.conditionAlways();
    }
    // ELEMENT
    if (line.match(/ELEMENT[ ](.*)/i)) {
        return this.conditionElement();
    }
    // EVAL
    if (line.match(/EVAL[ ](.*)/i)) {
        var condition = String(RegExp.$1);
        return this.conditionEval(condition);
    }
    // GROUP ALIVE MEMBERS EVAL
    if (line.match(/(.*)[ ]ALIVE[ ]MEMBERS[ ](.*)/i)) {
        var members = String(RegExp.$1);
        var condition = String(RegExp.$2);
        return this.conditionGroupAlive(members, condition);
    }
    // GROUP DEAD MEMBERS EVAL
    if (line.match(/(.*)[ ]DEAD[ ]MEMBERS[ ](.*)/i)) {
        var members = String(RegExp.$1);
        var condition = String(RegExp.$2);
        return this.conditionGroupDead(members, condition);
    }
    // USER PARAM EVAL
    if (line.match(/USER[ ](.*)[ ]PARAM[ ](.*)/i)) {
        var paramId = this.getParamId(String(RegExp.$1));
        var condition = String(RegExp.$2);
        return this.conditionUserParamEval(paramId, condition);
    }
    // PARAM EVAL
    if (line.match(/(.*)[ ]PARAM[ ](.*)/i)) {
        var paramId = this.getParamId(String(RegExp.$1));
        var condition = String(RegExp.$2);
        return this.conditionParamEval(paramId, condition);
    }
    // PARTY LEVEL
    if (line.match(/(.*)[ ]PARTY[ ]LEVEL[ ](.*)/i)) {
        var type = String(RegExp.$1);
        var condition = String(RegExp.$2);
        return this.conditionPartyLevel(type, condition);
    }
    // RANDOM x%
    if (line.match(/RANDOM[ ](\d+)([%％])/i)) {
        return this.conditionRandom(parseFloat(RegExp.$1 * 0.01));
    }
    // STATE === X
    if (line.match(/STATE[ ]===[ ](.*)/i)) {
        return this.conditionStateHas(String(RegExp.$1));
    }
    // STATE !== X
    if (line.match(/STATE[ ]!==[ ](.*)/i)) {
        return this.conditionStateNot(String(RegExp.$1));
    }
    // SWITCH X case
    if (line.match(/SWITCH[ ](\d+)[ ](.*)/i)) {
        var switchId = parseInt(RegExp.$1);
        var value = String(RegExp.$2);
        return this.conditionSwitch(switchId, value);
    }
    // TURN EVAL
    if (line.match(/TURN[ ](.*)/i)) {
        return this.conditionTurnCount(String(RegExp.$1));
    }
    // VARIABLE X eval
    if (line.match(/VARIABLE[ ](\d+)[ ](.*)/i)) {
        var variableId = parseInt(RegExp.$1);
        var condition = String(RegExp.$2);
        return this.conditionVariable(variableId, condition);
    }
    
    return false;
};

//=============================================================================
// End of File
//=============================================================================