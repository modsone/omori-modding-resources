/*:
 * @plugindesc Custom Action Sequences Extension v1.1
 * @author KoffinKrypt
 *
 * @param EmotionImmunityState
 * @text Emotion Immunity State ID
 * @desc The state ID that prevents an actor or enemy from receiving emotion effects.
 * @type number
 * @default 0
 *
 * @help
 * =============================================================================
 * Overview
 * =============================================================================
 * This plugin enhances your battle engine by providing a powerful and highly
 * customizable action sequence system. It lets you manipulate state-based
 * effects with a tiered buff/debuff system, manage character emotions and ailments,
 * and insert custom text messages that dynamically display actor names and more.
 *
 * =============================================================================
 * Features
 * =============================================================================
 * ► Tiered Buffs & Debuffs
 *   • Apply buffs or debuffs on core stats: ATK, DEF, SPD, and HIT RATE  
 *   • Use commands like:
 *         add atk buff +1      → raises ATK by one tier  
 *         add atk buff -2      → lowers ATK sharply (two tiers)  
 *         add atk buff +3      → raises ATK greatly (three tiers)  
 *         add atk buff max     → sets ATK to its maximum tier  
 *         add atk debuff min     → sets ATK to its minimum tier  
 *   • If the stat is already at its maximum/minimum, an appropriate message is 
 *     displayed.
 *
 * ► Emotion System
 *   • Supports four emotion categories – Happy, Sad, Angry, and Afraid – each 
 *     with three tiers.
 *   • Use commands like:
 *         add happy            → applies Happy (Tier 1)
 *         add ecstatic         → applies Happy at Tier 2
 *         add manic            → applies Happy at Tier 3
 *         (Similarly for sad, depressed, miserable; angry, enraged, furious; 
 *          afraid, panic, stressed out)
 *   • Use "add random emotion" to apply a random emotion. You can optionally 
 *     append a level addition:
 *         add random emotion      → applies a random emotion at base tier
 *         add random emotion 1    → upgrades by 1 level (Tier 2)
 *         add random emotion 2    → upgrades by 2 levels (Tier 3)
 *   • If the target already has an emotion from that category, the effect upgrades;
 *     if the target resists, it falls back to a lower tier.
 *
 * ► Ailments
 *   • Easily add common ailments such as Poison, Burn, Crying, Paralysis, 
 *     and Confusion.
 *   • Example commands:
 *         add poison: target
 *         add burn: target
 *         add crying: target
 *         add paralysis: target
 *         add confusion: target
 *
 * ► Custom Effects
 *   • Define your own effects (for example, a "BLEEDING" debuff) via a 
 *     configuration object within the plugin code.  
 *   • Once defined, use:
 *         add bleeding: target
 *     to apply the custom effect with tier upgrades and custom messages (e.g.,
 *         "is bleeding", "is bleeding profusely", "is bleeding a lot").
 *
 * ► Custom Text Messages
 *   • Insert dynamic text into the battle log with:
 *         add text: user.name hits target.name
 *   • The plugin automatically converts plain text (e.g. “user.name”) into a 
 *   template expression (e.g. `${user.name()}`) so the actual names are inserted.
 *   • Long text is automatically split to fit within the battle log.
 *
 * ► Removal Commands 
 *   • Clear specific effects with removal commands:
 *         remove emotions       → removes all emotion states
 *         remove buffs          → removes all buffs (ATK, DEF, SPD, HIT RATE)
 *         remove debuffs        → removes all debuffs (ATK, DEF, SPD, HIT RATE)
 *         remove ailments       → removes all ailments
 *
 * ► Flow Control*
 *   • For most messages (buffs, emotions, ailments, removals), a brief (5-frame)
 *     wait is automatically inserted after displaying text to improve the flow
 *     of battle log messages.
 *
 * =============================================================================
 * Instructions
 * =============================================================================
 * 1. Place this plugin below YEP_X_ActSeqPack1.js (preferably at the bottom)
 *    in the plugin manager.
 * 2. Customize the configuration section inside the code if you wish to add new
 *    effects, change state IDs, or modify text messages.
 * 3. Use the above commands in your skill/item notetags or action sequence lists.
 *
 * =============================================================================
 * Emotion Immunity
 * =============================================================================
 * This update adds an Emotion Immunity State. Any actor or enemy with this
 * state cannot receive emotions** from action sequence commands.
 *
 * How to Use:
 * - Set the Emotion Immunity State ID in the plugin parameters.
 * - If a target has this state, commands like `add happy` or `add random emotion`
 *   will fail, and a message will appear in the battle log.
 *
 * You must edit the code inside this plugin for your own modifictations 
 * (such as changing or removing the ailment list for example).
 *
 */

(function() {

  var parameters = PluginManager.parameters('KOFFIN_ActionSequenceAddon');
  var EmotionImmunityState = Number(parameters["EmotionImmunityState"]);
  // Extend BattleManager to intercept new commands.
  var _BattleManager_processActionSequence = BattleManager.processActionSequence;
  BattleManager.processActionSequence = function(actionName, actionArgs) {
    
    // Custom buff/debuff commands for our stats.
    if (actionName.match(/^ADD[ ](ATK|DEF|SPD|HIT[ ]?RATE)[ ](BUFF|DEBUFF)/i)) {
      var stat = RegExp.$1.toUpperCase();
      var type = RegExp.$2.toUpperCase(); // BUFF or DEBUFF
      // Determine magnitude: can be a number (e.g., +1, -2, +3) or the keywords "MAX" or "MIN"
      var magnitude;
      if (actionName.match(/([+\-]\d+)/)) {
        magnitude = parseInt(RegExp.$1);
      } else if (actionName.match(/MAX/i)) {
        magnitude = "max";
      } else if (actionName.match(/MIN/i)) {
        magnitude = "min";
      } else {
        magnitude = (type === "BUFF" ? 1 : -1);
      }
      return this.applyCustomBuff(actionArgs[0], stat, magnitude);
    }
    
    // Custom emotion commands.
    if (actionName.match(/^ADD[ ](HAPPY|ECSTATIC|MANIC|SAD|DEPRESSED|MISERABLE|ANGRY|ENRAGED|FURIOUS|AFRAID|PANIC|STRESSED[ ]?OUT)/i)) {
      var emotion = RegExp.$1.toUpperCase();
      return this.applyCustomEmotion(actionArgs[0], emotion);
    }
    if (actionName.match(/^ADD[ ]RANDOM[ ]EMOTION(?:\s+([+\-]?\d+))?/i)) {
      var tierAddition = 0;
      if (RegExp.$1) {
        tierAddition = parseInt(RegExp.$1);
      }
      return this.applyRandomEmotion(actionArgs[0], tierAddition);
    }
    
    // Custom ailment commands.
    if (actionName.match(/^ADD[ ](POISON|BURN|CRYING|PARALYSIS|CONFUSION)/i)) {
      var ailment = RegExp.$1.toUpperCase();
      return this.applyAilment(actionArgs[0], ailment);
    }
    
    // Removal commands for custom systems.
    if (actionName.match(/^REMOVE[ ](EMOTIONS|BUFFS|DEBUFFS|AILMENTS)/i)) {
      var type = RegExp.$1.toUpperCase();
      if (type === "EMOTIONS") return this.removeCustomEmotions(actionArgs[0]);
      else if (type === "BUFFS") return this.removeCustomBuffs(actionArgs[0]);
      else if (type === "DEBUFFS") return this.removeCustomDebuffs(actionArgs[0]);
      else if (type === "AILMENTS") return this.removeAilments(actionArgs[0]);
    }
    
    // Custom add text command (this one does NOT add a wait).
    if (actionName.match(/^ADD[ ]TEXT/i)) {
      var text = actionArgs.join(" ");
      return this.actionAddText(text);
    }
    
    // Otherwise, fall back to the original method.
    return _BattleManager_processActionSequence.call(this, actionName, actionArgs);
  };

  //===========================================================================
  // Custom Buff System Using States
  //===========================================================================
  // For each stat, we define the buff and debuff state IDs.
  // ATK:  Buffs: [89, 90, 91]   Debuffs: [92, 93, 94]
  // DEF:  Buffs: [95, 96, 97]   Debuffs: [98, 99, 100]
  // SPD:  Buffs: [101, 102, 103] Debuffs: [104, 105, 106]
  // HIT RATE: Buffs: [107, 108, 109] Debuffs: [110, 111, 112]
  BattleManager.applyCustomBuff = function(targetSpecifier, stat, magnitude) {
    var targets = this.makeActionTargets(targetSpecifier);
    if (targets.length < 1) return false;
    
    targets.forEach(function(target) {
      var buffStates, debuffStates;
      switch(stat) {
        case "ATK":
          buffStates = [89, 90, 91];
          debuffStates = [92, 93, 94];
          break;
        case "DEF":
          buffStates = [95, 96, 97];
          debuffStates = [98, 99, 100];
          break;
        case "SPD":
          buffStates = [101, 102, 103];
          debuffStates = [104, 105, 106];
          break;
        case "HIT RATE":
        case "HITRATE":
          buffStates = [107, 108, 109];
          debuffStates = [110, 111, 112];
          break;
        default:
          return;
      }

      var stateToAdd, actionText = "";
      
      if (typeof magnitude === "number") {
        if (magnitude > 0) {
          // Determine current buff tier.
          var currentTier = 0;
          for (var i = 0; i < buffStates.length; i++) {
            if (target.isStateAffected(buffStates[i])) { currentTier = i + 1; break; }
          }
          var newTier = currentTier + magnitude;
          if (newTier > 3) {
            SceneManager._scene._logWindow.push("addText", target.name() + "'s " + stat + " can't go higher!");
            SceneManager._scene._logWindow.push("wait", 5);
            return;
          } else {
            // Remove current buff states.
            buffStates.forEach(function(stateId) {
              if (target.isStateAffected(stateId)) target.removeState(stateId);
            });
            stateToAdd = buffStates[newTier - 1];
            if (newTier === 1) actionText = target.name() + "'s " + stat + " rose!";
            else if (newTier === 2) actionText = target.name() + "'s " + stat + " rose sharply!";
            else if (newTier === 3) actionText = target.name() + "'s " + stat + " rose greatly!";
          }
        } else {
          // Negative magnitude for debuffs.
          var currentTier = 0;
          for (var i = 0; i < debuffStates.length; i++) {
            if (target.isStateAffected(debuffStates[i])) { currentTier = i + 1; break; }
          }
          var newTier = currentTier + Math.abs(magnitude);
          if (newTier > 3) {
            SceneManager._scene._logWindow.push("addText", target.name() + "'s " + stat + " can't go lower!");
            SceneManager._scene._logWindow.push("wait", 5);
            return;
          } else {
            debuffStates.forEach(function(stateId) {
              if (target.isStateAffected(stateId)) target.removeState(stateId);
            });
            stateToAdd = debuffStates[newTier - 1];
            if (newTier === 1) actionText = target.name() + "'s " + stat + " fell!";
            else if (newTier === 2) actionText = target.name() + "'s " + stat + " fell sharply!";
            else if (newTier === 3) actionText = target.name() + "'s " + stat + " fell greatly!";
          }
        }
      } else if (magnitude === "max") {
        buffStates.forEach(function(stateId) {
          if (target.isStateAffected(stateId)) target.removeState(stateId);
        });
        stateToAdd = buffStates[2];
        actionText = target.name() + "'s " + stat + " was maximized!";
      } else if (magnitude === "min") {
        debuffStates.forEach(function(stateId) {
          if (target.isStateAffected(stateId)) target.removeState(stateId);
        });
        stateToAdd = debuffStates[2];
        actionText = target.name() + "'s " + stat + " was minimized!";
      }
      
      target.addState(stateToAdd, 100);
      SceneManager._scene._logWindow.push("addText", actionText);
      SceneManager._scene._logWindow.push("wait", 5);
    }, this);
    return true;
  };

  //===========================================================================
  // Custom Emotion System
  //===========================================================================
  // Define emotion tiers.
  // HAPPY: Tier1 = HAPPY (6), Tier2 = ECSTATIC (7), Tier3 = MANIC (8)
  // SAD: Tier1 = SAD (10), Tier2 = DEPRESSED (11), Tier3 = MISERABLE (12)
  // ANGRY: Tier1 = ANGRY (14), Tier2 = ENRAGED (15), Tier3 = FURIOUS (16)
  // AFRAID: Tier1 = AFRAID (18), Tier2 = PANIC (19), Tier3 = STRESSED OUT (20)
  BattleManager.emotionStates = {
    "HAPPY": [6, 7, 8],
    "SAD": [10, 11, 12],
    "ANGRY": [14, 15, 16],
    "AFRAID": [18, 19, 20]
  };

  // Apply a specific emotion.
  BattleManager.applyCustomEmotion = function(targetSpecifier, emotionName) {
    var targets = this.makeActionTargets(targetSpecifier);
    if (!targets.length) return false;
    
    targets.forEach(function(target) {
      if (EmotionImmunityState > 0 && target.isStateAffected(EmotionImmunityState)) {
        SceneManager._scene._logWindow.push("addText", target.name() + " is unaffected by emotions!");
        SceneManager._scene._logWindow.push("wait", 5);
        return;
      }

      var base, desiredTier;
      switch(emotionName) {
        case "HAPPY": base = "HAPPY"; desiredTier = 1; break;
        case "ECSTATIC": base = "HAPPY"; desiredTier = 2; break;
        case "MANIC": base = "HAPPY"; desiredTier = 3; break;
        case "SAD": base = "SAD"; desiredTier = 1; break;
        case "DEPRESSED": base = "SAD"; desiredTier = 2; break;
        case "MISERABLE": base = "SAD"; desiredTier = 3; break;
        case "ANGRY": base = "ANGRY"; desiredTier = 1; break;
        case "ENRAGED": base = "ANGRY"; desiredTier = 2; break;
        case "FURIOUS": base = "ANGRY"; desiredTier = 3; break;
        case "AFRAID": base = "AFRAID"; desiredTier = 1; break;
        case "PANIC": base = "AFRAID"; desiredTier = 2; break;
        case "STRESSED": case "STRESSED OUT": base = "AFRAID"; desiredTier = 3; break;
        default: return false;
      }

      var states = BattleManager.emotionStates[base];
      states.forEach(function(stateId) {
        if (target.isStateAffected(stateId)) target.removeState(stateId);
      });

      var stateToAdd = states[desiredTier - 1];
      if (BattleManager.emotionResisted(target, stateToAdd)) {
        if (desiredTier > 1) stateToAdd = states[desiredTier - 2];
      }

      target.addState(stateToAdd, 100);
      SceneManager._scene._logWindow.push("addText", target.name() + " feels " + emotionName.toLowerCase() + "!");
      SceneManager._scene._logWindow.push("wait", 5);
    });

    return true;
  };

  // Stub for emotion resistance checking (override as needed).
  BattleManager.emotionResisted = function(target, stateId) {
    // By default, no emotion is resisted.
    return false;
  };

// And update the applyRandomEmotion function:
  BattleManager.applyRandomEmotion = function(targetSpecifier, tierAddition) {
    var bases = ["HAPPY", "SAD", "ANGRY", "AFRAID"];
    var randomBase = bases[Math.floor(Math.random() * bases.length)];
    var desiredTier = Math.min(1 + tierAddition, 3);
    var targets = this.makeActionTargets(targetSpecifier);
    if (!targets.length) return false;

    targets.forEach(function(target) {
      if (EmotionImmunityState > 0 && target.isStateAffected(EmotionImmunityState)) {
        SceneManager._scene._logWindow.push("addText", target.name() + " is unaffected by emotions!");
        SceneManager._scene._logWindow.push("wait", 5);
        return;
      }

      var states = BattleManager.emotionStates[randomBase];
      for (var i = states.length - 1; i >= 0; i--) {
        if (target.isStateAffected(states[i])) {
          desiredTier = Math.min(i + 1 + tierAddition, 3);
          break;
        }
      }

      states.forEach(function(stateId) {
        if (target.isStateAffected(stateId)) target.removeState(stateId);
      });

      var stateToAdd = states[desiredTier - 1];
      if (BattleManager.emotionResisted(target, stateToAdd)) {
        if (desiredTier > 1) stateToAdd = states[desiredTier - 2];
      }

      target.addState(stateToAdd, 100);
      SceneManager._scene._logWindow.push("addText", target.name() + " feels " +
        (randomBase === "HAPPY" ? (desiredTier === 1 ? "HAPPY" : desiredTier === 2 ? "ECSTATIC" : "MANIC") :
         randomBase === "SAD" ? (desiredTier === 1 ? "SAD" : desiredTier === 2 ? "DEPRESSED" : "MISERABLE") :
         randomBase === "ANGRY" ? (desiredTier === 1 ? "ANGRY" : desiredTier === 2 ? "ENRAGED" : "FURIOUS") :
         (desiredTier === 1 ? "AFRAID" : desiredTier === 2 ? "PANIC" : "STRESSED OUT")) + "!");
      SceneManager._scene._logWindow.push("wait", 5);
    });

    return true;
  };

  //===========================================================================
  // Ailment System
  //===========================================================================
  // Define ailments so it's easy to add more later.
  BattleManager.ailmentStates = {
    "POISON": 270,
    "BURN": 271,
    "CRYING": 272,
    "PARALYSIS": 273,
    "CONFUSION": 274
  };

  // Apply an ailment (e.g., "ADD POISON: target").
  BattleManager.applyAilment = function(targetSpecifier, ailmentName) {
    var targets = this.makeActionTargets(targetSpecifier);
    if (targets.length < 1) return false;
    var stateId = BattleManager.ailmentStates[ailmentName];
    if (!stateId) return false;
    targets.forEach(function(target) {
      target.addState(stateId, 100);
      SceneManager._scene._logWindow.push("wait", 5);
    }, this);
    return true;
  };

  //===========================================================================
  // Removal Functions for Emotions, Buffs, Debuffs, and Ailments
  //===========================================================================

  BattleManager.removeCustomEmotions = function(targetSpecifier) {
    var targets = this.makeActionTargets(targetSpecifier);
    if (targets.length < 1) return false;
    // All emotion states: HAPPY (6,7,8), SAD (10,11,12), ANGRY (14,15,16), AFRAID (18,19,20)
    var emotionStates = [6,7,8,10,11,12,14,15,16,18,19,20];
    targets.forEach(function(target) {
      emotionStates.forEach(function(stateId) {
        if (target.isStateAffected(stateId)) target.removeState(stateId);
      });
      SceneManager._scene._logWindow.push("addText", target.name() + "'s EMOTIONS were removed!");
      SceneManager._scene._logWindow.push("wait", 5);
    }, this);
    return true;
  };

  BattleManager.removeCustomBuffs = function(targetSpecifier) {
    var targets = this.makeActionTargets(targetSpecifier);
    if (targets.length < 1) return false;
    // Buff states: ATK: [89,90,91], DEF: [95,96,97], SPD: [101,102,103], HIT RATE: [107,108,109]
    var buffStates = [89,90,91,95,96,97,101,102,103,107,108,109];
    targets.forEach(function(target) {
      buffStates.forEach(function(stateId) {
        if (target.isStateAffected(stateId)) target.removeState(stateId);
      });
      SceneManager._scene._logWindow.push("addText", target.name() + "'s BUFFS were removed!");
      SceneManager._scene._logWindow.push("wait", 5);
    }, this);
    return true;
  };

  BattleManager.removeCustomDebuffs = function(targetSpecifier) {
    var targets = this.makeActionTargets(targetSpecifier);
    if (targets.length < 1) return false;
    // Debuff states: ATK: [92,93,94], DEF: [98,99,100], SPD: [104,105,106], HIT RATE: [110,111,112]
    var debuffStates = [92,93,94,98,99,100,104,105,106,110,111,112];
    targets.forEach(function(target) {
      debuffStates.forEach(function(stateId) {
        if (target.isStateAffected(stateId)) target.removeState(stateId);
      });
      SceneManager._scene._logWindow.push("addText", target.name() + "'s DEBUFFS were removed!");
      SceneManager._scene._logWindow.push("wait", 5);
    }, this);
    return true;
  };

  BattleManager.removeAilments = function(targetSpecifier) {
    var targets = this.makeActionTargets(targetSpecifier);
    if (targets.length < 1) return false;
    // Remove all ailments defined in our ailmentStates.
    var ailmentArray = Object.values(BattleManager.ailmentStates);
    targets.forEach(function(target) {
      ailmentArray.forEach(function(stateId) {
        if (target.isStateAffected(stateId)) target.removeState(stateId);
      });
      SceneManager._scene._logWindow.push("addText", target.name() + "'s AILMENTS were removed!");
      SceneManager._scene._logWindow.push("wait", 5);
    }, this);
    return true;
  };

  //===========================================================================
  // Custom Add Text Function (No extra wait here)
  //===========================================================================
  // This function processes the text for template expressions.
  // It replaces "user.name" with "${user.name()}" and "target.name" with "${target.name()}"
  // then evaluates the resulting template literal.
  BattleManager.actionAddText = function(text) {
    // Replace plain 'user.name' and 'target.name' with template syntax.
    text = text.replace(/\buser\.name\b/g, "${user.name()}");
    text = text.replace(/\btarget\.name\b/g, "${target.name()}");

    var logWindow = SceneManager._scene._logWindow;
    var user = this._subject;
    var target = (this._targets && this._targets.length > 0) ? this._targets[0] : this._subject;
    var evaluatedText;
    try {
      evaluatedText = Function("user", "target", "return `" + text + "`;")(user, target);
    } catch (e) {
      evaluatedText = text;
    }
    var maxWidth = logWindow.contents.width;
    var words = evaluatedText.split(" ");
    var currentLine = "";
    var lines = [];
    words.forEach(function(word) {
      var testLine = currentLine + (currentLine ? " " : "") + word;
      if (logWindow.contents.measureTextWidth(testLine) > maxWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);
    lines.forEach(function(line) {
      logWindow.push("addText", line);
    });
    return true;
  };

})();
