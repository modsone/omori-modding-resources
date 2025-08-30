/*:
 * @plugindesc Custom Action Sequences Extension v1.0
 * @author KoffinKrypt
 * @help
 *
 * This plugin extends your battle engine by adding a suite of customizable
 * features for action sequences. It lets you:
 *
 * ► Apply custom buffs and debuffs on core stats (ATK, DEF, SPD, HIT RATE) 
 *   using a tiered state system. You can adjust the amount with commands like 
 *   "add atk buff +1", "add atk buff +2", or "add atk buff +3". It also supports 
 *   setting a stat to its maximum ("max") or minimum ("min") level. 
 *   Dynamic messages are displayed based on the tier applied (e.g., "rose", 
 *   "rose sharply", "rose greatly", "can't go higher", "fell", "fell sharply", 
 *   "fell greatly", or "can't go lower").
 *
 * ► Use an emotion system with four categories – Happy, Sad, Angry, 
 *   and Afraid – each with three tiers.
 *   Commands like "add happy", "add ecstatic", or "add manic" apply the 
 *   corresponding emotion state.
 *   A random emotion command is also available, and if the target already has 
 *   an emotion, the effect upgrades to the next tier (up to tier 3).
 *
 * ► Add common ailment states such as Poison, Burn, Crying, Paralysis, 
 *  and Confusion with commands like "add poison: target". 
 *  Removal commands allow you to clear ailments, emotions, buffs, or debuffs.
 *
 * ► Insert custom text messages into the battle log with the "add text:" command. 
 *   This function processes template expressions so that writing:
 *
 *       add text: user.name hits target.name
 *
 *   is automatically transformed into:
 *
 *       `${user.name()} hits ${target.name()}`
 *
 *   and splits the text as needed to fit the log window.
 *
 * ► Define your own custom effects (such as a bleeding debuff) via a configuration object. 
 *   For example,
 *   add a "BLEEDING" effect with multiple tiers and custom messages 
 *   (e.g., "is bleeding", "is bleeding profusely", "is bleeding a lot"). Then use:
 *
 *       add bleeding: target
 *
 *   to apply the effect.
 *
 * ► Automatically insert a brief (5-frame) wait after most messages 
 *   (buffs, emotions, ailments, removals)
 *   to control the flow of battle log text.
 *
 * Use this plugin to create highly dynamic and visually engaging battle action sequences 
 * with full control over state-based effects, custom messages, and additional visual feedback.
 *
 * You must edit the code inside this plugin for your own modifictations (such as changing
 * or removing the ailment list for example).
 *
 */


(function() {

  //===========================================================================
  // Process Action Sequence Overrides
  //===========================================================================

  var _BattleManager_processActionSequence = BattleManager.processActionSequence;
  BattleManager.processActionSequence = function(actionName, actionArgs) {
    
    // Standard buff/debuff commands for stats.
    if (actionName.match(/^ADD[ ](ATK|DEF|SPD)[ ](BUFF|DEBUFF)/i)) {
      var stat = RegExp.$1.toUpperCase();
      var type = RegExp.$2.toUpperCase();
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
    
    // Emotion commands.
    if (actionName.match(/^ADD[ ](HAPPY|ECSTATIC|MANIC|SAD|DEPRESSED|MISERABLE|ANGRY|ENRAGED|FURIOUS|AFRAID|PANIC|STRESSED[ ]?OUT)/i)) {
      var emotion = RegExp.$1.toUpperCase();
      return this.applyCustomEmotion(actionArgs[0], emotion);
    }
    if (actionName.match(/^ADD[ ]RANDOM[ ]EMOTION/i)) {
      return this.applyRandomEmotion(actionArgs[0]);
    }
    
    // Ailment commands.
    if (actionName.match(/^ADD[ ](POISON|BURN|CRYING|PARALYSIS|CONFUSION)/i)) {
      var ailment = RegExp.$1.toUpperCase();
      return this.applyAilment(actionArgs[0], ailment);
    }
    
    // Removal commands.
    if (actionName.match(/^REMOVE[ ](EMOTIONS|BUFFS|DEBUFFS|AILMENTS)/i)) {
      var type = RegExp.$1.toUpperCase();
      if (type === "EMOTIONS") return this.removeCustomEmotions(actionArgs[0]);
      else if (type === "BUFFS") return this.removeCustomBuffs(actionArgs[0]);
      else if (type === "DEBUFFS") return this.removeCustomDebuffs(actionArgs[0]);
      else if (type === "AILMENTS") return this.removeAilments(actionArgs[0]);
    }
    
    // Custom add text command (no extra wait added).
    if (actionName.match(/^ADD[ ]TEXT/i)) {
      var text = actionArgs.join(" ");
      return this.actionAddText(text);
    }
    
    // NEW: Custom effect commands (for user-defined buffs/debuffs).
    // If the command is "ADD [EFFECT]" and that effect is defined in customEffects,
    // then process it.
    if (actionName.match(/^ADD[ ]([A-Z]+)/i)) {
      var potentialEffect = RegExp.$1.toUpperCase();
      if (BattleManager.customEffects && BattleManager.customEffects[potentialEffect]) {
        var magnitude = 1;
        if (actionName.match(/([+\-]\d+)/)) {
          magnitude = parseInt(RegExp.$1);
        }
        return this.applyCustomEffect(actionArgs[0], potentialEffect, magnitude);
      }
    }
    
    // Otherwise, fallback.
    return _BattleManager_processActionSequence.call(this, actionName, actionArgs);
  };

  //===========================================================================
  // Standard Custom Buff System (for ATK, DEF, SPD, HIT RATE)
  //===========================================================================

  BattleManager.applyCustomBuff = function(targetSpecifier, stat, magnitude) {
    var targets = this.makeActionTargets(targetSpecifier);
    if (!targets.length) return false;
    
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
        default:
          return;
      }

      var stateToAdd, actionText = "";
      
      if (typeof magnitude === "number") {
        if (magnitude > 0) {
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
            buffStates.forEach(function(stateId) {
              if (target.isStateAffected(stateId)) target.removeState(stateId);
            });
            stateToAdd = buffStates[newTier - 1];
            actionText = (newTier === 1 ? target.name() + "'s " + stat + " rose!" :
                          newTier === 2 ? target.name() + "'s " + stat + " rose sharply!" :
                          target.name() + "'s " + stat + " rose greatly!");
          }
        } else {
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
            actionText = (newTier === 1 ? target.name() + "'s " + stat + " fell!" :
                          newTier === 2 ? target.name() + "'s " + stat + " fell sharply!" :
                          target.name() + "'s " + stat + " fell greatly!");
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

  BattleManager.emotionStates = {
    "HAPPY": [6, 7, 8],
    "SAD": [10, 11, 12],
    "ANGRY": [14, 15, 16],
    "AFRAID": [18, 19, 20]
  };

  BattleManager.applyCustomEmotion = function(targetSpecifier, emotionName) {
    var targets = this.makeActionTargets(targetSpecifier);
    if (!targets.length) return false;
    var base, desiredTier;
    switch(emotionName) {
      case "HAPPY":
        base = "HAPPY"; desiredTier = 1; break;
      case "ECSTATIC":
        base = "HAPPY"; desiredTier = 2; break;
      case "MANIC":
        base = "HAPPY"; desiredTier = 3; break;
      case "SAD":
        base = "SAD"; desiredTier = 1; break;
      case "DEPRESSED":
        base = "SAD"; desiredTier = 2; break;
      case "MISERABLE":
        base = "SAD"; desiredTier = 3; break;
      case "ANGRY":
        base = "ANGRY"; desiredTier = 1; break;
      case "ENRAGED":
        base = "ANGRY"; desiredTier = 2; break;
      case "FURIOUS":
        base = "ANGRY"; desiredTier = 3; break;
      case "AFRAID":
        base = "AFRAID"; desiredTier = 1; break;
      case "PANIC":
        base = "AFRAID"; desiredTier = 2; break;
      case "STRESSED":
      case "STRESSED OUT":
        base = "AFRAID"; desiredTier = 3; break;
      default:
        return false;
    }
    targets.forEach(function(target) {
      var states = BattleManager.emotionStates[base];
      states.forEach(function(stateId) {
        if (target.isStateAffected(stateId)) target.removeState(stateId);
      });
      var stateToAdd = states[desiredTier - 1];
      if (BattleManager.emotionResisted(target, stateToAdd)) {
        if (desiredTier > 1) stateToAdd = states[desiredTier - 2];
      }
      target.addState(stateToAdd, 100);
      var emotionText = target.name() + " feels " +
        (base === "HAPPY" ? (desiredTier === 1 ? "HAPPY" : desiredTier === 2 ? "ECSTATIC" : "MANIC") :
         base === "SAD" ? (desiredTier === 1 ? "SAD" : desiredTier === 2 ? "DEPRESSED" : "MISERABLE") :
         base === "ANGRY" ? (desiredTier === 1 ? "ANGRY" : desiredTier === 2 ? "ENRAGED" : "FURIOUS") :
         (desiredTier === 1 ? "AFRAID" : desiredTier === 2 ? "PANIC" : "STRESSED OUT"));
      SceneManager._scene._logWindow.push("addText", emotionText + "!");
      SceneManager._scene._logWindow.push("wait", 5);
    }, this);
    return true;
  };

  BattleManager.emotionResisted = function(target, stateId) {
    return false;
  };

  BattleManager.applyRandomEmotion = function(targetSpecifier) {
    var bases = ["HAPPY", "SAD", "ANGRY", "AFRAID"];
    var randomBase = bases[Math.floor(Math.random() * bases.length)];
    var desiredTier = 1;
    var targets = this.makeActionTargets(targetSpecifier);
    if (!targets.length) return false;
    targets.forEach(function(target) {
      var states = BattleManager.emotionStates[randomBase];
      for (var i = states.length - 1; i >= 0; i--) {
        if (target.isStateAffected(states[i])) {
          desiredTier = Math.min(i + 2, 3);
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
      var emotionText = target.name() + " feels " +
        (randomBase === "HAPPY" ? (desiredTier === 1 ? "HAPPY" : desiredTier === 2 ? "ECSTATIC" : "MANIC") :
         randomBase === "SAD" ? (desiredTier === 1 ? "SAD" : desiredTier === 2 ? "DEPRESSED" : "MISERABLE") :
         randomBase === "ANGRY" ? (desiredTier === 1 ? "ANGRY" : desiredTier === 2 ? "ENRAGED" : "FURIOUS") :
         (desiredTier === 1 ? "AFRAID" : desiredTier === 2 ? "PANIC" : "STRESSED OUT"));
      SceneManager._scene._logWindow.push("addText", emotionText + "!");
      SceneManager._scene._logWindow.push("wait", 5);
    }, this);
    return true;
  };

  //===========================================================================
  // Ailment System
  //===========================================================================

  BattleManager.ailmentStates = {
    "POISON": 270,
    "BURN": 271,
    "CRYING": 272,
    "PARALYSIS": 273,
    "CONFUSION": 274
  };

  BattleManager.applyAilment = function(targetSpecifier, ailmentName) {
    var targets = this.makeActionTargets(targetSpecifier);
    if (!targets.length) return false;
    var stateId = BattleManager.ailmentStates[ailmentName];
    if (!stateId) return false;
    targets.forEach(function(target) {
      target.addState(stateId, 100);
      SceneManager._scene._logWindow.push("addText", target.name() + " is afflicted with " + ailmentName.toLowerCase() + "!");
      SceneManager._scene._logWindow.push("wait", 5);
    }, this);
    return true;
  };

  //===========================================================================
  // Removal Functions for Emotions, Buffs, Debuffs, and Ailments
  //===========================================================================

  BattleManager.removeCustomEmotions = function(targetSpecifier) {
    var targets = this.makeActionTargets(targetSpecifier);
    if (!targets.length) return false;
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
    if (!targets.length) return false;
    var buffStates = [89,90,91,95,96,97,101,102,103];
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
    if (!targets.length) return false;
    var debuffStates = [92,93,94,98,99,100,104,105,106];
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
    if (!targets.length) return false;
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
  // CUSTOM EFFECT SYSTEM (For user-defined buffs/debuffs)
  //===========================================================================

  // Define your custom effects here.
  // Each effect should have:
  //   type: "buff" or "debuff"
  //   states: an array of state IDs for tiers 1..n
  //   text: an array of messages corresponding to each tier.
  BattleManager.customEffects = {
    "TEMPLATE": {
      type: "debuff",
      states: [1, 2, 3], // example state IDs for debuff tiers
      text: ["is hurting", "is dyieng", "is fucking dead"]
    }
	 "TEMPLATE2": {
      type: "buff",
      states: [1, 2, 3], // example state IDs for buff tiers
      text: ["is pretty good", "is freaking awesome", "is FUCKING BASED!!!!"]
    }
    // Add more custom effects here as needed.
  };

  BattleManager.applyCustomEffect = function(targetSpecifier, effectName, magnitude) {
    effectName = effectName.toUpperCase();
    var effect = BattleManager.customEffects[effectName];
    if (!effect) return false;
    var targets = this.makeActionTargets(targetSpecifier);
    if (!targets.length) return false;
    
    targets.forEach(function(target) {
      var states = effect.states;
      var texts = effect.text;
      var currentTier = 0;
      for (var i = 0; i < states.length; i++) {
        if (target.isStateAffected(states[i])) { currentTier = i + 1; break; }
      }
      var newTier;
      if (typeof magnitude === "number") {
        newTier = currentTier + magnitude;
        if (newTier > states.length) {
          var msg = (effect.type === "buff") ?
            target.name() + "'s " + effectName + " can't go higher!" :
            target.name() + "'s " + effectName + " can't go lower!";
          SceneManager._scene._logWindow.push("addText", msg);
          SceneManager._scene._logWindow.push("wait", 5);
          return;
        }
      } else {
        newTier = currentTier + 1;
        if (newTier > states.length) {
          var msg = (effect.type === "buff") ?
            target.name() + "'s " + effectName + " can't go higher!" :
            target.name() + "'s " + effectName + " can't go lower!";
          SceneManager._scene._logWindow.push("addText", msg);
          SceneManager._scene._logWindow.push("wait", 5);
          return;
        }
      }
      // Remove existing effect states.
      states.forEach(function(stateId) {
        if (target.isStateAffected(stateId)) target.removeState(stateId);
      });
      var stateToAdd = states[newTier - 1];
      target.addState(stateToAdd, 100);
      var message = texts[newTier - 1];
      SceneManager._scene._logWindow.push("addText", target.name() + " " + message);
      SceneManager._scene._logWindow.push("wait", 5);
    }, this);
    return true;
  };

  //===========================================================================
  // Custom Add Text Function (No extra wait added here)
  //===========================================================================

  // This function replaces occurrences of "user.name" and "target.name" in the text
  // with template expressions, then evaluates the result.
  BattleManager.actionAddText = function(text) {
    text = text.replace(/\buser\.name\b/g, "${user.name()}");
    text = text.replace(/\btarget\.name\b/g, "${target.name()}");

    var logWindow = SceneManager._scene._logWindow;
    var user = this._subject;
    var target = (this._targets && this._targets.length) ? this._targets[0] : this._subject;
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
