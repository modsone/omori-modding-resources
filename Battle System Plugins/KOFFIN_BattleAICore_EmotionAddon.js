//=============================================================================
 /*:
 * @plugindesc v1.0 This plugin adds extra functionality to Yanfly's
 * battle A.I. plugin regarding OMORI's EMOTION mechanic.
 * @author KoffinKrypt
 *
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * It can get very tedious to do gimmicky bosses for OMORI that make use of 
 * emotions since the default AI plugin doesn't support those, as base game simply
 * uses the regular state conditions which by itself are very impractical as they
 * check each state of emotion individually, while eval codes help, they can make
 * your condition table unecessary long and convoluted, this Add-On serves as
 * extension to yanfly's plugin that adds new conditions an cases for OMORI's
 * EMOTION mechanic.
 *
 * ============================================================================
 * Conditions
 * ============================================================================
 *
 * The following is the what you can format your conditions for the enemy
 * to choose the right skill based on EMOTION.
 *
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 * EMOTION X case
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * This allows you to match the Emotion of the target.
 * Valid targets will be those with the matching emotion requirement.
 * Supported emotions are HAPPY, ANGRY, SAD, AFRAID and ANY(any emotion)
 * If your mod has custom emotions, they will have to be programmed in
 * into the plugin.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Example:   Emotion SAD: SKILL 211, Lowest HP%
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 *
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 * USER EMOTION X case
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * This allows you to match the Emotion tier of the target.
 * unlike the previous condition, this checks a specific tier of emotion,
 * not the overall emotion category itself. This is intended for bosses/enemies
 * that use more than the first tier of EMOTION.
 * Note: AFRAID is not supported since it blocks skills anyway you doofus
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Example:   User Emotion MISERABLE: Skill 10, Lowest HP%
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 *
 * ============================================================================
 * Targeting
 * ============================================================================
 *
 * The following list are the supported emotion targettings:
 *
 * ----------------------------------------------------------------------------
 *      Highest HAP       Selects highest HAPPINESS tier valid target.
 *      Highest SAD       Selects highest SADNESS tier valid target.
 *      Highest ANG       Selects highest ANGER tier valid target.
 *      Highest FEA       Selects highest AFRAID tier valid target.
 *      Highest EMO       Selects highest EMOTION tier valid target.
 *      Lowest HAP        Selects lowest HAPPINESS tier valid target.
 *      Lowest SAD        Selects lowest SADNESS tier valid target.
 *      Lowest ANG        Selects lowest ANGER tier valid target.
 *      Lowest FEA        Selects lowest AFRAID tier valid target.
 *      Lowest EMO        Selects lowest EMOTION tier valid target.
 * ----------------------------------------------------------------------------
 *
 */
 // ----------------------------------------------------------------------------

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
      var index = group.indexOf();
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


AIManager.getStateId = function(string) {
    string = string.toUpperCase();
    switch (string) {
        case 'HAP': return [6, 7, 8];    // Happy -> Ecstatic -> Manic
        case 'SAD': return [10, 11, 12]; // Sad -> Depressed -> Miserable
        case 'ANG': return [14, 15, 16]; // Angry -> Furious -> Enraged
        case 'FEA': return [18, 19, 20]; // Afraid -> Panic -> Stressed Out
        case 'EMO': return [6, 7, 8, 10, 11, 12, 14, 15, 16, 18, 19, 20]; // All emotions
        default: return [];
    }
};

AIManager.getEmotionTier = function(target, stateIds) {
    let maxTier = 0;

    // State tiers: index in the array determines the tier
    for (let i = 0; i < stateIds.length; i++) {
        if (target.isStateAffected(stateIds[i])) {
            maxTier = Math.max(maxTier, i + 1); // Tier starts at 1
        }
    }

    return maxTier;
};


AIManager.setHighestEmotionTarget = function(group, stateIds) {
    var maintarget = group[Math.floor(Math.random() * group.length)];
    var highestTier = 0; // Default tier is 0 if no emotion is found

    for (var i = 0; i < group.length; ++i) {
        var target = group[i];
        for (var tier = 0; tier < stateIds.length; ++tier) {
            if (target.isStateAffected(stateIds[tier]) && tier + 1 > highestTier) {
                maintarget = target;
                highestTier = tier + 1; // Tier starts at 1
            }
        }
    }

    this.action().setTarget(maintarget.index());
};

AIManager.setLowestEmotionTarget = function(group, stateIds) {
    var maintarget = group[Math.floor(Math.random() * group.length)];
    var lowestTier = Infinity; // Default tier is very high to find the lowest

    for (var i = 0; i < group.length; ++i) {
        var target = group[i];
        for (var tier = 0; tier < stateIds.length; ++tier) {
            if (target.isStateAffected(stateIds[tier]) && tier + 1 < lowestTier) {
                maintarget = target;
                lowestTier = tier + 1; // Tier starts at 1
            }
        }
    }

    this.action().setTarget(maintarget.index());
};


AIManager.passAIConditions = function(line) {
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
	// EMOTION
    if (line.match(/EMOTION[ ](SAD|HAPPY|ANGRY|AFRAID|ANY)/i)) {
      var emotion = String(RegExp.$1).toUpperCase();
      return this.conditionEmotion(emotion);
    }
	// USER EMOTION
	if (line.match(/USER[ ]EMOTION[ ](.*)/i)) {
      var emotionState = String(RegExp.$1);
      return this.conditionUserEmotion(emotionState);
    }
    // SWITCH X case
    if (line.match(/SWITCH[ ](\d+)[ ](.*)/i)) {
      var switchId = parseInt(RegExp.$1);
      var value = String(RegExp.$2)
      return this.conditionSwitch(switchId, value);
    }
    // TURN EVAL
    if (line.match(/TURN[ ](.*)/i)) {
      return this.conditionTurnCount(String(RegExp.$1));
    }
    // VARIABLE X eval
    if (line.match(/VARIABLE[ ](\d+)[ ](.*)/i)) {
      var variableId = parseInt(RegExp.$1);
      var condition = String(RegExp.$2)
      return this.conditionVariable(variableId, condition);
    }
    return false;
};

AIManager.conditionEmotion = function(emotion) {
    var emotionStates = {
        SAD: [10, 11, 12], // Replace with the actual state IDs for "SAD"
        HAPPY: [6, 7, 8], // Replace with the actual state IDs for "HAPPY"
        ANGRY: [14, 15, 16], // Replace with the actual state IDs for "ANGRY"
        AFRAID: [18, 19, 20], // Replace with the actual state IDs for "AFRAID"
        ANY: [] // Placeholder for any emotion states, modify as needed
    };

    // Collect states for the given emotion
    var statesToCheck = emotionStates[emotion] || [];
    if (emotion === "ANY") {
        statesToCheck = [].concat(...Object.values(emotionStates));
    }

    // Validate states exist
    if (statesToCheck.length === 0) return false;

    var group = this.getActionGroup();
    var validTargets = [];

    // Check each target in the action group
    for (var i = 0; i < group.length; ++i) {
        var target = group[i];
        if (!target) continue;

        // Check if the target has any of the emotion states
        if (statesToCheck.some(stateId => target.hasState(stateId))) {
            validTargets.push(target);
        }
    }

    // If no valid targets, return false
    if (validTargets.length <= 0) return false;

    // Set the valid targets for this condition
    this.setProperTarget(validTargets);
    return true;
};

AIManager.conditionUserEmotion = function(emotionState) {
    var action = this.action();
    var user = this.battler();
    var emotionId;

    // Match the emotionState with its corresponding state ID
    switch (emotionState.toUpperCase()) {
        case 'HAPPY': emotionId = [6, 197]; break; // Replace 1 with the actual state ID for SAD
        case 'ECSTATIC': emotionId = [7, 122]; break; // Replace 2 with the actual state ID for HAPPY
        case 'MANIC': emotionId = [8, 123]; break; // Replace 3 with the actual state ID for ANGRY
        case 'SAD': emotionId = [10, 124]; break; // Replace 4 with the actual state ID for AFRAID
        case 'DEPRESSED': emotionId = [11, 125]; break; // Replace 7 with the actual state ID for ECSTATIC
        case 'MISERABLE': emotionId = [12, 126]; break; // Replace 1 with the actual state ID for SAD
        case 'ANGRY': emotionId = [14, 119]; break; // Replace 2 with the actual state ID for HAPPY
        case 'ENRAGED': emotionId = [15, 120]; break; // Replace 3 with the actual state ID for ANGRY
        case 'FURIOUS': emotionId = [16, 121]; break; // Replace 4 with the actual state ID for AFRAID
        default: return false; // Invalid emotion
    }

    // Check if the user has the specified state (emotion)
    if (!user.hasState(emotionId)) return false;

    var group = this.getActionGroup();
    this.setProperTarget(group);
    return true;
};
