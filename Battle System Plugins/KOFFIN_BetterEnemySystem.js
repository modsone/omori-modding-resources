/*:
 * @plugindesc (v1.1) Simplifies OMORI enemy setup by automating emotion-based systems.
 * 
 * @author KoffinKrypt
 *
 * @param Extra States Index 3
 * @desc Comma-separated list of additional state IDs for index 3. (Original: Sad)
 * @default 124
 *
 * @param Extra States Index 4
 * @desc Comma-separated list of additional state IDs for index 4. (Original: Angry)
 * @default 119
 *
 * @param Extra States Index 5
 * @desc Comma-separated list of additional state IDs for index 5. (Original: Happy)
 * @default 197
 *
 * @param Custom Motion 6 States
 * @desc Comma-separated list of state IDs for custom motion index 6. (Original: Tier 2 Emotions)
 * @default 120,122,125
 *
 * @param Custom Motion 7 States
 * @desc Comma-separated list of state IDs for custom motion index 7. (Original: Tier 3 Emotions)
 * @default 121,123,126
 *
 * @param Custom Motion 8 States
 * @desc Comma-separated list of state IDs for custom motion index 8.
 * @default 
 *
 * @param Custom Motion 9 States
 * @desc Comma-separated list of state IDs for custom motion index 9.
 * @default 
 *
 * @param Custom Motion 10 States
 * @desc Comma-separated list of state IDs for custom motion index 10.
 * @default 
 *
 * @param More Gold States
 * @desc A comma-separated list of state IDs that give 50% more gold.
 * @default 6,7,8
 *
 * @param More Exp States
 * @desc A comma-separated list of state IDs that give 50% more exp.
 * @default 14,15,16
 *
 * @param Less Reward States
 * @desc A comma-separated list of state IDs that give 25% less gold and exp.
 * @default 10,11,12
 *
 * @param Disable Reward Modifier
 * @desc Set to true to disable all reward modifications. (true/false)
 * @default false
 *
 * @help
 * -----------------------------------------------------------------------------
 * Description
 * -----------------------------------------------------------------------------
 * This plugin overrides the sideview battler motion functionality from both
 * YEP_X_AnimatedSVEnemies and YED_SideviewBattler. For any enemy that does not
 * include any <Sideview Battler Motion> notetag, the following defaults will be
 * used:
 *
 *   Index 0: Default (loop)
 *   Index 1: Damage
 *   Index 2: Dead
 *   Index 3: Automatically used when enemy has states 
 *   10, 11, 12, 124, (loop)
 *   Index 4: Automatically used when enemy has states
 *   14, 15, 16, 119, (loop)
 *   Index 5: Automatically used when enemy has states 
 *   6, 7, 8, 119, 197, (loop)
 *   Index 6: Automatically used when enemy has states
 *   120, 122, 125 (loop)
 *   Index 7: Automatically used when enemy has states 
 *   121, 123, 126 (loop)
 *   Indexes 6-10: Custom motions – state IDs can be defined 
 *   via the plugin parameters.
 *
 * NOTE: If an enemy DOES have any <Sideview Battler Motion> notetag, its motions
 * will not be overridden.
 *
 * -----------------------------------------------------------------------------
 * Instructions
 * -----------------------------------------------------------------------------
 * 1. Place this plugin below YEP_X_AnimatedSVEnemies and YED_SideviewBattler.
 * 2. Configure the custom motion parameters as desired.
 * 3. Enemies without any <Sideview Battler Motion> notetag will automatically use
 *    these defaults.
 *
 * ============================================================================
 * This plugin also allows enemy rewards to change based on EMOTION too, 
 * like in vanilla OMORI
 * 
 *  Enemies with the <NoDropChance> notetag are unaffected.
 *
 * ============================================================================
 *  How It Works:
 * ============================================================================
 * 1. Define which states modify rewards in the Plugin Parameters:
 *    - "More Gold States" → +50% Gold
 *    - "More Exp States"  → +50% EXP
 *    - "Less Reward States" → -25% Gold & EXP
 * (You can just leave the default values if you're aren't adding more emotions)
 * 2. When a state is applied or removed, the enemy's EXP and Gold adjust.
 *
 * ============================================================================
 *  Notetag:
 * ============================================================================
 * If you add the following notetag to an enemy's Notes, it will ignore changes:
 *
 * <NoDropChance>
 * → This enemy will always drop its default EXP and Gold values.
 *
 * ============================================================================
 * Multiple AI patterns
 * ============================================================================
 *
 * This plugin also allows enemies to use different
 * AI Priority lists when they have specific EMOTIONS.
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * Enemy Notetags:
 *   <AI Priority HAPPY>
 *    condition: SKILL x, target
 *   </AI Priority HAPPY>
 *
 *   <AI Priority SAD>
 *    condition: SKILL x, target
 *   </AI Priority SAD>
 *
 *   <AI Priority ANGRY>
 *    condition: SKILL x, target
 *   </AI Priority ANGRY>
 *
 * These AI Priority lists will be used if the enemy has any of the following
 * states:
 * - HAPPY: States 6, 8, 9, 197, 122, 124
 * - SAD: States 10, 11, 12, 124, 125, 126
 * - ANGRY: States 14, 15, 16, 119, 120, 121
 *
 * You can also setup your own AI list using state categories!
 * For example, if a state has the category called CHARGE, you can make an AI
 * priority list like this:
 *
 *   <AI Priority CHARGE>
 *    condition: SKILL x, target
 *   </AI Priority CHARGE>
 *
 * ============================================================================
 * Changing AI patterns through priority lists
 * ============================================================================
 *
 * This plugin also adds a feaure where you can change your AI pattern in
 * the middle of a priority list. The "CHANGE AI" command will be used where you
 * would normally put a skill, and can be affected by all the conditions 
 * a skill can in the priority list.
 *
 * Here's an example:
 *
 * <AI Priority HAPPY>
 * Random 40%: AI ANGRY
 * Random 40%: AI DEFAULT
 * Always: AI HAPPY
 * </AI Priority HAPPY>
 *
 * Using "AI" followed by a emotion/state category will make it use the AI field
 * with that emotion/state if it is present.
 * "AI DEFAULT" will make it use the regular AI Priority (NEUTRAL/NO STATES)
 * 
 *
 *
 *
 */

(function() {
    "use strict";
    
    // Retrieve plugin parameters for custom motions (indexes 6 to 10)
    var parameters = PluginManager.parameters('KOFFIN_BetterEnemySystem');
	function parseStateList(param) {
        return (param || "").split(",").map(id => Number(id.trim())).filter(n => !isNaN(n) && n > 0);
    }

    var extraStates3 = parseStateList(parameters["Extra States Index 3"]);
    var extraStates4 = parseStateList(parameters["Extra States Index 4"]);
    var extraStates5 = parseStateList(parameters["Extra States Index 5"]);

    var customMotionStates = {};
    for (var i = 6; i <= 10; i++) {
        var param = parameters["Custom Motion " + i + " States"] || "";
        // Parse the comma-separated state IDs into an array of numbers.
        customMotionStates[i] = param.split(",").map(function(id) {
            return Number(id.trim());
        }).filter(function(n) { return !isNaN(n) && n > 0; });
    }
    
//=============================================================================
// * Refresh Emotion State Transform
//=============================================================================
Game_Enemy.prototype.refreshEmotionStateTransform = function() {
  // If Not Dead and not already transforming
  if (!this.isDead() && !this._isStateTransforming) {
    // Get current emotion
    var emotion = this.getStateEmotion();
    // If the enemy does not have any <Sideview Battler Motion> notetag, force "normal"
    if (!this.enemy().note.match(/<Sideview Battler Motion>/i)) {
      emotion = 'normal';
    }
    // Get base Id from meta tag
    var baseId = this.enemy().meta.TransformBaseID;
    // Use baseId if defined; otherwise use the enemy's own id
    baseId = baseId ? Number(baseId) : this._enemyId;
    // Initialize transformId with the enemy's default id
    var transformId = this._enemyId;
    
    // Switch Case Emotion to determine transformId
    switch (emotion) {
      case 'normal': 
        transformId = baseId;
        break;
      case 'happy': 
        transformId = baseId + 1;
        break;
      case 'sad': 
        transformId = baseId + 2;
        break;
      case 'angry': 
        transformId = baseId + 3;
        break;
    }
    
    // If transformId has changed from the enemy's default
    if (transformId !== this._enemyId) {
      this._isStateTransforming = true;
      // Optional flash effect for a specific enemy name
      if(this.name() === "SPACE EX-HUSBAND") {
        $gameScreen.setFlashWait(60);
        $gameScreen.startFlash([255,255,255,255], 130);
      }
      this.transform(transformId);
      this._isStateTransforming = false;
    }
  }
};

    function getEnemyFrames(enemy) {
        var match = enemy.note.match(/<Sideview Battler Frames:\s*(\d+)>/i);
        return match ? Number(match[1]) : 3; // Default to 3 frames if not specified
    }

    function getEnemySpeed(enemy) {
        var match = enemy.note.match(/<Sideview Battler Speed:\s*(\d+)>/i);
        return match ? Number(match[1]) : 12; // Default to speed 12 if not specified
    }

function createDefaultMotionsForEnemy(enemy) {
    var frames = getEnemyFrames(enemy);
    var speed = getEnemySpeed(enemy);

    var motions = {};
    motions["default"] = { name: "default", index: 0, loop: true, frames, speed };
    motions["damage"] = { name: "damage", index: 1, loop: false, frames, speed };
    motions["dead"] = { name: "dead", index: 2, loop: false, frames, speed };

    motions["stateGroup1"] = {
        name: "stateGroup1",
        index: 3,
        loop: true,
        frames,
        speed,
        states: [10, 11, 12].concat(extraStates3)
    };

    motions["stateGroup2"] = {
        name: "stateGroup2",
        index: 4,
        loop: true,
        frames,
        speed,
        states: [14, 15, 16].concat(extraStates4)
    };

    motions["stateGroup3"] = {
        name: "stateGroup3",
        index: 5,
        loop: true,
        frames,
        speed,
        states: [6, 7, 8].concat(extraStates5)
    };

    // **Create custom motions properly**
    for (var i = 6; i <= 10; i++) {
        if (customMotionStates[i] && customMotionStates[i].length > 0) {
            motions["custom" + i] = {
                name: "custom" + i,
                index: i,
                loop: true,
                frames,
                speed,
                states: customMotionStates[i]
            };
        }
    }

    return motions;
}

    
    // Override YED_SideviewBattler's notetag processing to assign default motions when none are defined.
    var _YED_ProcessNotetags = YED.SideviewBattler.Utils.processNotetags;
    YED.SideviewBattler.Utils.processNotetags = function() {
        _YED_ProcessNotetags.call(this);
        
        if ($dataEnemies) {
            for (var i = 1; i < $dataEnemies.length; i++) {
                var enemy = $dataEnemies[i];
                if (enemy && enemy._sideviewBattler) {
                    // Only override if the enemy does NOT have any <Sideview Battler Motion> notetag.
                    if (!enemy.note.match(/<Sideview Battler Motion>/i)) {
                        enemy._sideviewBattler.motions = createDefaultMotionsForEnemy(enemy);
                    }
                }
            }
        }
    };
    
    // Optionally override the function that retrieves the current sideview motion.
    // This will choose a motion based on the enemy's current states (checking custom motions first).
    var _Game_Battler_getSideviewMotion = Game_Battler.prototype.getSideviewMotion;
    Game_Battler.prototype.getSideviewMotion = function(motionName) {
        if (!this.isSideviewBattler()) {
            return _Game_Battler_getSideviewMotion.call(this, motionName);
        }
        
        var motions = this.getSideviewMotions();
        // If a specific motion was requested and exists, return it.
        if (motionName && motions[motionName]) {
            return motions[motionName];
        }
        
        // Retrieve current states for this battler.
        var states = this.states();
        
        // Check custom motions (indexes 6-10) first.
        for (var idx = 6; idx <= 10; idx++) {
            var customMotion = motions["custom" + idx];
            if (customMotion && customMotion.states) {
                for (var j = 0; j < states.length; j++) {
                    if (customMotion.states.contains(states[j].id)) {
                        return customMotion;
                    }
                }
            }
        }
        // Then check the default state groups (indexes 3, 4, 5).
        var stateGroups = ["stateGroup1", "stateGroup2", "stateGroup3"];
        for (var k = 0; k < stateGroups.length; k++) {
            var groupMotion = motions[stateGroups[k]];
            if (groupMotion && groupMotion.states) {
                for (var j = 0; j < states.length; j++) {
                    if (groupMotion.states.contains(states[j].id)) {
                        return groupMotion;
                    }
                }
            }
        }
        
        // Fallback: return the default motion.
        return motions["default"] || _Game_Battler_getSideviewMotion.call(this, motionName);
    };
    
    // Also override Sprite_Actor's startSideviewMotion to use our motion if available.
    var _Sprite_Actor_startSideviewMotion = Sprite_Actor.prototype.startSideviewMotion;
    Sprite_Actor.prototype.startSideviewMotion = function(motionType) {
        if (this._actor && this._actor.isSideviewBattler()) {
            var motion = this._actor.getSideviewMotion(motionType);
            if (motion) {
                this._motionName = motion.name;
                this._motionCount = 0;
                this._pattern = 0;
                return;
            }
        }
        _Sprite_Actor_startSideviewMotion.call(this, motionType);
    };
    
    console.log("OverrideSideviewBattlerMotion plugin loaded.");
    // ==============================
    // DELAYED REWARD MODIFIER LOGIC
    // ==============================

    setTimeout(function() {
        console.log("Applying Reward Modifier logic...");

        var rewardParams = PluginManager.parameters('KOFFIN_BetterEnemySystem');
        var moreGoldStates = String(rewardParams['More Gold States']).split(',').map(Number);
        var moreExpStates = String(rewardParams['More Exp States']).split(',').map(Number);
        var lessRewardStates = String(rewardParams['Less Reward States']).split(',').map(Number);
        var disableRewards = (typeof rewardParams['Disable Reward Modifier'] !== 'undefined' &&
                              String(rewardParams['Disable Reward Modifier']).toLowerCase() === "true");

        function hasNoDropChance(enemy) {
            return /<NoDropChance>/i.test(enemy.enemy().note);
        }

    // Store original exp and gold values for enemies
    Game_Enemy.prototype.initRewardValues = function() {
        this._originalExp = this.enemy().exp;
        this._originalGold = this.enemy().gold;
        this._currentExp = this._originalExp;
        this._currentGold = this._originalGold;
    };

    var _Game_Enemy_setup = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        _Game_Enemy_setup.call(this, enemyId, x, y);
        this.initRewardValues();
    };

    // Extend addState safely
    var _Game_Battler_addState = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function(stateId) {
        var wasAlive = this.isAlive();

        if (_Game_Battler_addState) {
            _Game_Battler_addState.call(this, stateId);
        } else {
            Game_BattlerBase.prototype.addState.call(this, stateId);  // Fallback
        }

        if (wasAlive && this instanceof Game_Enemy) {
            this.updateRewardModifiers();
        }
    };

    // Extend removeState safely
    var _Game_Battler_removeState = Game_Battler.prototype.removeState;
    Game_Battler.prototype.removeState = function(stateId) {
        var wasAlive = this.isAlive();

        if (_Game_Battler_removeState) {
            _Game_Battler_removeState.call(this, stateId);
        } else {
            Game_BattlerBase.prototype.removeState.call(this, stateId);  // Fallback
        }

        if (wasAlive && this instanceof Game_Enemy) {
            this.updateRewardModifiers();
        }
    };

    // Calculate new EXP and Gold values based on current states
    Game_Enemy.prototype.updateRewardModifiers = function() {
        if (disableRewards || hasNoDropChance(this)) {
            return; // Prevents changes if rewards are disabled
        }

        // NEW: Prevent changes if the enemy is dead
        if (this.isStateAffected(1)) {
            console.log(`${this.name()} is dead. Keeping final rewards: Gold = ${this._currentGold}, EXP = ${this._currentExp}`);
            return;
        }

        var multiplierGold = 1;
        var multiplierExp = 1;

        for (var i = 0; i < moreGoldStates.length; i++) {
            if (this.isStateAffected(moreGoldStates[i])) {
                multiplierGold *= 1.5;
                break;
            }
        }

        for (var i = 0; i < moreExpStates.length; i++) {
            if (this.isStateAffected(moreExpStates[i])) {
                multiplierExp *= 1.5;
                break;
            }
        }

        for (var i = 0; i < lessRewardStates.length; i++) {
            if (this.isStateAffected(lessRewardStates[i])) {
                multiplierGold *= 0.75;
                multiplierExp *= 0.75;
                break;
            }
        }

        this._currentGold = Math.floor(this._originalGold * multiplierGold);
        this._currentExp = Math.floor(this._originalExp * multiplierExp);

        console.log(`${this.name()} updated rewards: Gold = ${this._currentGold}, EXP = ${this._currentExp}`);
    };

    // Return modified values in troop calculations
    Game_Troop.prototype.expTotal = function() {
        return this.deadMembers().reduce(function(r, enemy) {
            return r + enemy._currentExp;
        }, 0);
    };

    Game_Troop.prototype.goldTotal = function() {
        return this.deadMembers().reduce(function(r, enemy) {
            return r + enemy._currentGold;
        }, 0);
    };

        console.log("Reward Modifier logic applied successfully.");
    }, 1);

    // ==============================
    // EXTRA AI LOGIC
    // ==============================

    setTimeout(function() {
  // Define the emotion arrays (using uppercase for the category names as YEP_X_StateCategories does)
  const AI_PRIORITY_TAGS = {
    "HAPPY": [6, 8, 9, 197, 122, 124],
    "SAD":   [10, 11, 12, 124, 125, 126],
    "ANGRY": [14, 15, 16, 119, 120, 121]
  };

  // Patch states once the database is loaded
  const _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
  DataManager.isDatabaseLoaded = function() {
    if (!_DataManager_isDatabaseLoaded.call(this)) return false;
    
    // Only patch once
    if (!$dataStates._emotionPatched) {
      for (let i = 1; i < $dataStates.length; i++) {
        let state = $dataStates[i];
        if (!state) continue;
        // Loop through each emotion category
        for (const emotion in AI_PRIORITY_TAGS) {
          // If the state id is in the list for this emotion and doesn't already include the category:
          if (AI_PRIORITY_TAGS[emotion].includes(state.id)) {
            if (!state.category.contains(emotion.toUpperCase())) {
              state.category.push(emotion.toUpperCase());
            }
          }
        }
      }
      $dataStates._emotionPatched = true;
    }
    return true;
  };

    DataManager.processAIPriorityNotetags = function(group) {
        const noteRegex = /<AI PRIORITY (.+)>/i;
        const endRegex = /<\/AI PRIORITY (.+)>/i;
        for (let enemy of group) {
            if (!enemy) continue;
            enemy.aiPriorityTags = {};
            let currentTag = null;
            enemy.note.split(/\r?\n/).forEach(line => {
                if (noteRegex.test(line)) {
                    currentTag = line.match(noteRegex)[1].toUpperCase();
                    enemy.aiPriorityTags[currentTag] = [];
                } else if (endRegex.test(line)) {
                    currentTag = null;
                } else if (currentTag) {
                    enemy.aiPriorityTags[currentTag].push(line);
                }
            });
        }
    };

    Game_Enemy.prototype.getActiveAIPriority = function() {
        if (!this.enemy().aiPatternDefault) {
            this.enemy().aiPatternDefault = Array.from(this.enemy().aiPattern);
        }
        for (const key of Object.keys(this.enemy().aiPriorityTags)) {
            if (this.isStateCategoryAffected(key) && this.enemy().aiPriorityTags[key]) {
                // Custom String Tag, assume YEP State Category
                console.log(this.name(), "Got AI (State Category):", key);
                return this.enemy().aiPriorityTags[key];
            }
        }
        for (const [tag, states] of Object.entries(AI_PRIORITY_TAGS)) {
            if (states.some(stateId => this.isStateAffected(stateId)) && this.enemy().aiPriorityTags[tag]) {
                // Default Emotion Tag names
                console.log(this.name(), "Got AI (Emotion Default):", tag);
                return this.enemy().aiPriorityTags[tag];
            }
        }
        return this.enemy().aiPattern; // Default AI Priority
    };

    Game_Enemy.prototype.getSpecificAI = function(tag) {
        if (!tag || tag == "DEFAULT") {
            return this.enemy().aiPatternDefault;
        }
        return this.enemy().aiPriorityTags[tag];
    }

    // Overrides entirely to support changing AI mid-loop
    Game_Enemy.prototype.setAIPattern = function() {
        Game_Battler.prototype.setAIPattern.call(this);
        this.enemy().aiPattern = this.getActiveAIPriority();
        if (this.numActions() <= 0) return;
        AIManager.setBattler(this);
        for (var i = 0; i < this.enemy().aiPattern.length; ++i) {
            if (Math.random() > this.aiLevel()) continue;
            var line = this.enemy().aiPattern[i];

            // Changes AI if found the line, then continue back to iterate at first line
            if (line.match(/[ ]*(.*):[ ](?:AI) (.*)/i)) {
                let condition = String(RegExp.$1);
                let aiTag = String(RegExp.$2).toUpperCase();
                // Placeholder Values to avoid breaking, 
                // passAllAIConditions requires it but you shouldn't be throwing targets in anyways
                AIManager._aiSkillId = 1;
                AIManager._aiTarget = 'RANDOM';
                AIManager.action().setSkill(AIManager._aiSkillId);

                if (AIManager.passAllAIConditions(condition)) {
                    let newPattern = this.getSpecificAI(aiTag);
                    if (newPattern) {
                        console.log("> CHANGE AI TO:", aiTag)
                        this.enemy().aiPattern = newPattern;
                        i = 0; // Reset index to 0 to start again from first line
                        continue;
                    } else {
                        console.log("> CHANGE AI INVALID; SKIPPING:", aiTag)
                    }
                }
            }
            if (AIManager.isDecidedActionAI(line)) {
				this.doCustomDecideAction();
				return;
            }
	    }  
        Yanfly.CoreAI.Game_Enemy_makeActions.call(this);
    };
	
	Game_Enemy.prototype.doCustomDecidedActionAI = function() {
		//Empty Function, Allows other mod to change this function after decision
	};

    console.log("Alternate AI logic applied successfully.");
    }, 2);

})();
