//=============================================================================
// Stahl Plugin - State Tiering
// Stahl_StateTiering.js    VERSION 1.1.3
//=============================================================================

var Imported = Imported || {};
Imported.Stahl_StateTiering = true;

var Stahl = Stahl || {};
Stahl.StateTiering = Stahl.StateTiering || {};

//=============================================================================
 /*:
 * @plugindesc v1.1.2 Gives handy functions related to emotions and buffs
 * @author ReynStahl
 * 
 * @help
 * When using parse text, there will be a delay to display text, so ideally put it after emotion
 * so there is no delay before it executes the functions, like animations.
 * 
 * ================ NOTES ================
 * "type" here refers to entire category of states. For example HAPPY type would mean HAPPY, ECSTATIC, and MANIC.
 * HAPPY being HAPPY tier 1, ECSTATIC being HAPPY tier 2, and MANIC being HAPPY tier 3.
 * 
 *=============================================================================
 *                        NOTE TAGS - SET UP
 *=============================================================================
 *
 * ================ STATE NOTES (EMOTION) ================
 * <EMOTION TYPE: type, tier>
 * Specify what type of emotion, and what tier it is. Both parameter required.
 * Ex 1: HAPPY state; <EMOTION TYPE: HAPPY, 1>
 * Ex 2: ECSTATIC state; <EMOTION TYPE: HAPPY, 2>
 * 
 * <EMOTION STRONG: type>
 * Specify what type of emotion this emotion is strong against. Can be added multiple times.
 * Ex: HAPPY is strong against ANGRY; in HAPPY state input <EMOTION STRONG: ANGRY>
 * 
 * <EMOTION WEAK: type>
 * Specify what type of emotion this emotion is weak against. Can be added multiple times.
 * Ex: HAPPY is weak against SAD; in HAPPY state input <EMOTION WEAK: SAD>
 * 
 * <EMOTION STRONG ALL>
 * Specify emotion as strong to all emotions, including itself.
 * Ex: No example in base game
 * 
 * <EMOTION WEAK ALL>
 * Specify emotion as weak to all emotions, including itself.
 * Ex: AFRAID emotion is weak to all other emotion.
 * 
 * <EMOTION EXCLUDE FROM RANDOM>
 * Excludes emotion from addRandomEmotion() functions and it's variants.
 * Ex: Excluding AFRAID as it contains more special use case.
 * 
 * <EMOTION NO EFFECT TEXT: text>
 * This specifies the word (x) used for "target can't get x!". Similar to parseNoEffectEmotion() function.
 * If not specified, it will default to "target cannot be more stateName!"
 * Ex: HAPPY state; "target can't get HAPPIER!"; <EMOTION NO EFFECT TEXT: HAPPIER>
 * Ex: AFRAID state; "target cannot be more AFRAID!"; No note tag.
 * 
 * <EMOTION SUPPLEMENTARY BUFF: type>
 * <EMOTION SUP BUFF: type>
 * List of buff for buff that supports the emotion's strength. 
 * Used in more advanced add state functions. Can be added multiple times.
 * Ex: ANGRY supports ATTACK buff; <EMOTION SUPPLEMENTARY BUFF: ATTACK>
 * 
 * <EMOTION COMPLEMENTARY BUFF: type>
 * <EMOTION COM BUFF: type>
 * List of buff for buff that supports the emotion's weakness. 
 * Used in more advanced add state functions. Can be added multiple times.
 * Ex: ANGRY wants DEFENSE buff to cover; <EMOTION SUPPLEMENTARY BUFF: DEFENSE>
 * 
 * <EMOTION COPY TRAIT: stateId, tag>
 * Copies all the emotion traits of the stateId, and assign a unique tag (if provided)
 * Ex: SPACE EX ANGRY (state 119), is ANGRY state (state 14) 
 * 	but for SPACE EX-BOYFRIEND; <EMOTION COPY TRAIT: 14, SBF> (assuming SBF as tag)
 * Ex: SPACE EX ENRAGED (state 120), is ANGRY state (state 15) 
 * 	but for SPACE EX-BOYFRIEND; <EMOTION COPY TRAIT: 15, SBF> (assuming SBF as tag)
 * 
 * ================ STATE NOTES (STATEBUFF) ================
 * <STATE BUFF TYPE: type, +tier>
 * <STATE BUFF TYPE: type, -tier>
 * Specify what type of buff, and what tier it is. Both parameter required.
 * Ex 1: ATTACK UP 1 state; <EMOTION TYPE: ATTACK, +1>
 * Ex 2: DEFENSE UP 2 state; <EMOTION TYPE: DEFENSE, +2>
 * Ex 3: SPEED DOWN 3 state; <EMOTION TYPE: SPEED, -3>
 * 
 * NOTE: THIS IS ALSO USED AS MAIN NAME WHEN DISPLAYED IN 
 * PARSE TEXT AND REFERRING OTHER BUFF IN NOTES
 * 
 * <STATE BUFF ALT NAME: text>
 * These are alternate acceptable names when inputted into adding state type functions. 
 * For compatibility purposes. Can be added multiple times.
 * 
 * ================ ACTOR / ENEMIES / STATE NOTES ================
 * <EMOTION IMMUNE: type>
 * This is to specify when the battler is immune to an emotion. 
 * Used in parseEmotion text to display "target cannot feel x".
 * Ex: OMORI is immune to afraid; 
 * to display "OMORI cannot feel AFRAID"; <EMOTION IMMUNE: AFRAID>
 * 
 * <EMOTION IMMUNE ALL>
 * Same as EMOTION IMMUNE but with all emotion applied
 * Ex: SOMETHING enemies cannot be inflicted emotions
 * 
 * <EMOTION SUSCEPTIBILITY: int>
 * <EMOTION SUSCEPT: int>
 * Changes the tiering when used through addStateTier and it's variant.
 * Ex: Actor has emotionSuscept of 1; 
 * when given SAD (tier 1) => gets DEPRESSED (tier 2)
 * 
 * ================ ACTOR / ENEMIES NOTES ================
 * <EMOTION USE TAG: text>
 * Uses a set of emotion with a tag instead of the main ones. Used for boss states.
 * Ex: SPACE EX-BOYFRIEND have unique set of ANGRY states; 
 * <EMOTION USE TAG: SBF> (assuming SBF as tag)
 * 
 * 
 *=============================================================================
 *                        YEP ACTION SEQUENCE MODIFICATION 
 *=============================================================================
 * 
 *=============================================================================
 * ANIMATION HPHEAL: (target)
 * ANIMATION MPHEAL: (target)
 * ANIMATION BUFF: (target)
 * ANIMATION DEBUFF: (target)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Plays the animation of the specified type, already accounting
 * Whether the target is an actor or enemy
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: animation buff: target
 *=============================================================================
 *
 *=============================================================================
 * ADD EMOTION type tier: target, (show)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Adds emotion to a target with a type and tier
 * Adding in "show" also displays text in battle log
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: add emotion angry 1: target
 * 				add emotion sad 2: user, show
 *=============================================================================
 *
 *=============================================================================
 * ADD STATEBUFF type tier: target, (show)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Adds state buff to a target with a type and tier
 * Adding in "show" also displays text in battle log
 * NOT TO BE CONFUSED WITH RPGMV INNATE "BUFF" WHICH CHANGE STAT, 
 * AND ALSO EXISTS IN YEP; THIS IS FOR STATES WHICH IS USED IN OMORI.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Usage Example: add statebuff atk 1: target
 * 				add statebuff def -2: user, show
 *=============================================================================
 *
 *=============================================================================
 *                        YEP AI TARGETING ADDITIONS
 *=============================================================================
 * Some targeting options are also added on top of YEP, for example
 * 
 *              Random 50%: Skill 210, Highesttier atk
 * 
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 	Highesttier <type>		Selects target with highest buff of specified type
 * 	Lowesttier <type>		Selects target with lowest buff of specified type
 * 	Highestemo <type>		Selects target with highest emotion of specified type
 * 	Lowestemo <type>		Selects target with lowest emotion of specified type
 * 	Emostrong 		Selects target that user have emotion advantage against
 * 	Emoweak 		Selects target that user have emotion disadvantage against
 *=============================================================================
 * @param ---General---
 * @default
 * 
 * @param CombineBuffs
 * @text Combine Buffs and Debuffs
 * @parent ---General---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Combine buff and debuffs, not to be separate added states. [NO IS EXPERIMENTAL]
 * NO - false     YES - true
 * @default true
 * 
 * @param ReaddState
 * @text Readd Maxed States
 * @parent ---General---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Readd the state even when it is the maximum. [Text may not properly tell the limit]
 * NO - false     YES - true
 * @default false
 * 
 * @param BuffAdjective
 * @text Buff Adjective
 * @parent ---General---
 * @type struct<BuffAdjectiveStructure>[]
 * @desc Text adjective to display when parsing different amount of buffs tier change. (i.e. PLAYER's STAT rose ADJECTIVE)
 * @default ["{\"tierChange\":\"1\",\"adjective\":\"\"}","{\"tierChange\":\"2\",\"adjective\":\"moderately\"}","{\"tierChange\":\"3\",\"adjective\":\"greatly\"}","{\"tierChange\":\"4\",\"adjective\":\"sharply\"}","{\"tierChange\":\"5\",\"adjective\":\"significantly\"}","{\"tierChange\":\"6\",\"adjective\":\"exceedingly\"}"]
 * 
 * @param UseMaximumBuffText
 * @text Use Maximum Buff Text
 * @parent ---General---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Gives different text displaying "maximized/minimized" when giving large tier change buff.
 * NO - false     YES - true
 * @default true
 */
/*~struct~BuffAdjectiveStructure:
 *
 * @param tierChange
 * @text Tier Change
 * @type number
 * @desc Amount of tier changed associated with adjective.
 * @default 1
 * 
 * @param adjective
 * @text Adjective
 * @type text
 * @desc Adjective to be added.
 * @default adjectively!
 */
//=============================================================================

//=============================================================================
// Parameter Variables
//=============================================================================

Stahl.Parameters = PluginManager.parameters('Stahl_StateTiering');
Stahl.Param = Stahl.Param || {};
Stahl.Parsed = Stahl.Parsed || {};

Stahl.Param.CombineBuffs = eval(Stahl.Parameters['CombineBuffs']);
Stahl.Param.ReaddState = eval(Stahl.Parameters['ReaddState']);
Stahl.Param.BuffAdjective = JSON.parse(Stahl.Parameters['BuffAdjective']);
Stahl.Param.UseMaximumBuffText = eval(Stahl.Parameters['UseMaximumBuffText']);

Stahl.Parsed.BuffAdjective = PluginManager.parseObject(Stahl.Param.BuffAdjective);

//=============================================================================

var $dataEmotions = null;
var $dataStateBuffs = null;

// ================================ DATA MANAGER ================================ //
{
	Stahl.StateTiering.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
	DataManager.isDatabaseLoaded = function() {
	if (!Stahl.StateTiering.DataManager_isDatabaseLoaded.call(this)) return false;
	if (!Stahl._loaded_StateTiering) {
		this.processEmotionNotetags1($dataStates);
		this.processStateBuffNotetags1($dataStates); //named StateBuffs to avoid confusion with base RPGMV buff

		this.processExtraEmotionNotetags1($dataStates);
		this.processExtraEmotionNotetags1($dataActors);
		this.processExtraEmotionNotetags1($dataEnemies);

		this.processBattlerEmotionNotetags1($dataActors);
		this.processBattlerEmotionNotetags1($dataEnemies);

		this.processEmotionNotetags2($dataStates);
		Stahl._loaded_StateTiering = true;
	}
	return true;
	};

	DataManager.processEmotionNotetags1 = function(group) {
		$dataEmotions = $dataEmotions || [];
		for (var n = 1; n < group.length; n++) {
			var obj = group[n];
			var notedata = obj.note.split(/[\r\n]+/);

			for (var i = 0; i < notedata.length; i++) {
				var line = notedata[i];

				if (line.match(/<EMOTION TYPE: (.*), (\d+)>/i)) {
					obj.isEmotion = true;
					obj.emotionName = obj.name;
					obj.emotionType = String(RegExp.$1).toUpperCase();
					obj.emotionTier = parseInt(RegExp.$2);
				}

				if (line.match(/<EMOTION STRONG: (.*)>/i)) {
					obj.emotionStrong = obj.emotionStrong || [];
					obj.emotionStrong.push(String(RegExp.$1).toUpperCase());
				}

				if (line.match(/<EMOTION WEAK: (.*)>/i)) {
					obj.emotionWeak = obj.emotionWeak || [];
					obj.emotionWeak.push(String(RegExp.$1).toUpperCase());
				}
				
				if (line.match(/<EMOTION STRONG ALL>/i)) {
					obj.emotionStrongAll = true;
				}

				if (line.match(/<EMOTION WEAK ALL>/i)) {
					obj.emotionWeakAll = true;
				}

				if (line.match(/<EMOTION EXCLUDE FROM RANDOM>/i)) {
					obj.emotionExcludeFromRandom = true;
				}

				if (line.match(/<EMOTION NO EFFECT TEXT: (.*)>/i)) {
					obj.emotionNoEffectText = String(RegExp.$1).toUpperCase();
				}

				if (line.match(/<EMOTION SUP(?:PLEMENTARY)? BUFF: (.*)>/i)) {
					obj.emotionSupBuff = obj.emotionSupBuff || [];
					obj.emotionSupBuff.push(String(RegExp.$1).toUpperCase());
				}

				if (line.match(/<EMOTION COM(?:PLEMENTARY)? BUFF: (.*)>/i)) {
					obj.emotionComBuff = obj.emotionComBuff || [];
					obj.emotionComBuff.push(String(RegExp.$1).toUpperCase());
				}
			}

			if (obj.isEmotion) {
				$dataEmotions.push(obj);
			}
		}
	};

	DataManager.processEmotionNotetags2 = function(group) {
		$dataEmotions = $dataEmotions || [];
		for (var n = 1; n < group.length; n++) {
			var obj = group[n];
			var notedata = obj.note.split(/[\r\n]+/);

			for (var i = 0; i < notedata.length; i++) {
				var line = notedata[i];

				//EMOTION COPY TRAIT: ID, TAG
				if (line.match(/<EMOTION COPY TRAIT: (\d+)(?:, (.+))?>/i)) {
					let stateId = parseInt(RegExp.$1);
					let state = $dataStates[stateId];

					obj.isEmotion 					= true;
					obj.emotionName 				= state.emotionName;
					obj.emotionType 				= state.emotionType;
					obj.emotionTier 				= state.emotionTier;
					obj.emotionStrong 				= state.emotionStrong;
					obj.emotionWeak 				= state.emotionWeak;
					obj.emotionStrongAll 			= state.emotionStrongAll;
					obj.emotionWeakAll 				= state.emotionWeakAll;
					obj.emotionExcludeFromRandom	= state.emotionExcludeFromRandom;
					obj.emotionNoEffectText 		= state.emotionNoEffectText;
					obj.emotionSupBuff 				= state.emotionSupBuff;
					obj.emotionComBuff 				= state.emotionComBuff;

					if (RegExp.$2) obj.emotionTag = String(RegExp.$2).toUpperCase();
				}
			}

			if (obj.emotionTag) {
				$dataEmotions.push(obj);
			}
		}
	};

	DataManager.processStateBuffNotetags1 = function(group) {
		$dataStateBuffs = $dataStateBuffs || [];
		for (var n = 1; n < group.length; n++) {
			var obj = group[n];
			var notedata = obj.note.split(/[\r\n]+/);

			for (var i = 0; i < notedata.length; i++) {
				var line = notedata[i];

				if (line.match(/<STATE ?BUFF TYPE: (.*), ([\+\-]\d+)>/i)) {
					obj.isStateBuff = true;
					obj.stateBuffType = String(RegExp.$1).toUpperCase();
					obj.stateBuffTier = parseInt(RegExp.$2);
				}

				if (line.match(/<STATE ?BUFF ALT NAME: (.*)>/i)) {
					obj.stateBuffAltName = obj.stateBuffAltName || [];
					obj.stateBuffAltName.push(String(RegExp.$1).toUpperCase());
				}
			}

			if (obj.isStateBuff) {
				$dataStateBuffs.push(obj);
			}
		}
	};

	// in States, Enemies, and Actors
	DataManager.processExtraEmotionNotetags1 = function(group) {
		for (var n = 1; n < group.length; n++) {
			var obj = group[n];
			var notedata = obj.note.split(/[\r\n]+/);

			obj.emotionImmune = [];

			for (var i = 0; i < notedata.length; i++) {
				var line = notedata[i];

				if (line.match(/<EMOTION IMMUNE: (.*)>/i)) {
					obj.emotionImmune.push(String(RegExp.$1).toUpperCase());
				}

				if (line.match(/<EMOTION IMMUNE ALL>/i)) {
					obj.emotionImmuneAll = true;
				}

				if (line.match(/<EMOTION SUSCEPT(?:IBILITY)?: ([\+\-]\d+)>/i)) {
					obj.emotionSuscept = parseInt(RegExp.$1);
				}
			}
		}
	};

	DataManager.processBattlerEmotionNotetags1 = function(group) {
		for (var n = 1; n < group.length; n++) {
			var obj = group[n];
			var notedata = obj.note.split(/[\r\n]+/);

			obj.emotionImmune = [];

			for (var i = 0; i < notedata.length; i++) {
				var line = notedata[i];

				if (line.match(/<EMOTION USE TAG: (.*)>/i)) {
					obj.emotionTagUse = String(RegExp.$1).toUpperCase();
				}
			}
		}
	};

	DataManager.isEmotion = function(item) {
		return item && $dataEmotions.contains(item);
	};

	DataManager.getEmotion = function(type, tier = 1, tag = false) {
		if (!Number.isInteger(tier)) {
			console.log("getEmotion tier is not an integer value!")
			return null;
		}
		var findFunc = (state) => state.emotionType === type && state.emotionTier === tier;
		if (tag) findFunc = state => state.emotionType === type && state.emotionTier === tier && state.emotionTag === tag;
		return $dataEmotions.find(findFunc) || null;
	}

	DataManager.getEmotionList = function(type) {
		return $dataEmotions.filter((state) => state.emotionType === type) || [];
	}

	DataManager.isStateBuff = function(item) {
		return item && $dataStateBuffs.contains(item);
	};

	DataManager.getStateBuff = function(type, tier) {
		return $dataStateBuffs.find(state => state.stateBuffType === type && state.stateBuffTier === tier) || null;
	}

	DataManager.isEmotionFromType = function(type) {
		return $dataEmotions.some(state => state.emotionType === type);
	}

	DataManager.isStateBuffFromType = function(type) {
		return $dataStateBuffs.some(state => state.stateBuffType === type);
	}

	DataManager.getMainEmotionTypeList = function() {
		return ["HAPPY", "SAD", "ANGRY"];
	}

	DataManager.getEmotionTypeList = function() {
		let result = [];
		for (let state of $dataEmotions) {
			if (!result.includes(state.emotionType)) {
				result.push(state.emotionType);
			}
		}
		return result;
	}

	DataManager.getEmotionsWithType = function(type) {
		return $dataEmotions.filter(state => state.emotionType === type)
	}

	DataManager.getMainStateBuffTypeList = function() {
		return ["ATTACK", "DEFENSE", "SPEED"];
	}

	DataManager.getStateBuffTypeList = function() {
		let result = [];
		for (let state of $dataStateBuffs) {
			if (!result.includes(state.stateBuffType)) {
				result.push(state.stateBuffType);
			}
		}
		return result;
	}

	DataManager.getMainStateBuffName = function(input) {
		input = input.toUpperCase();
		for (let state of $dataStateBuffs) {
			for (let altName of state.stateBuffAltName) {
				if (altName === input) {
					return state.stateBuffType;
				}
			}
		}
		return input;
	}

	DataManager.getMainStateTypeName = function(input) {
		input = input.toUpperCase();
		const isStateBuff = DataManager.isStateBuffFromType(input);
		if (isStateBuff) return DataManager.getMainStateBuffName(input);
		return input;
	}

	DataManager.getStateBuffAdjective = function(tier) {
		for (let key in Stahl.Parsed.BuffAdjective) {
			const a = Stahl.Parsed.BuffAdjective[key];
			if (a.tierChange == tier) {
				return a.adjective;
			}
		}
	};

	// No longer parameter ID because this is for Omori only anyways and causes bloat
	Game_Battler.prototype.hpHealAnim = function() {
		if (this.isActor()) this.startAnimation(212);
		else this.startAnimation(216);
	};
	
	Game_Battler.prototype.mpHealAnim = function() {
		if (this.isActor()) this.startAnimation(213);
		else this.startAnimation(217);
	};
	
	Game_Battler.prototype.buffAnim = function() {
		if (this.isActor()) this.startAnimation(214);
		else this.startAnimation(218);
	};
	
	Game_Battler.prototype.debuffAnim = function() {
		if (this.isActor()) this.startAnimation(215);
		else this.startAnimation(219);
	};
}

// ================================ BATTLE MANAGER ================================ //
if (BattleManager.addTextsplit == undefined) {
	BattleManager.addTextSplit = function(text) {
		const maxTextLength = 388;
		let lastIndex = text.lastIndexOf(" ");
		if (SceneManager._scene._logWindow._backBitmap.measureTextWidth(text, true) < maxTextLength || lastIndex < 0) {
			SceneManager._scene._logWindow.push("addText", text, 16)
			//break;
		} else {
			let textBeginning = text.slice(0, lastIndex)
			let textEnding = text.slice(lastIndex + 1)
			for (var i = text.length; i > 0; i--) {
				if (text.charAt(i) != " ") { continue }
				if (SceneManager._scene._logWindow._backBitmap.measureTextWidth(textBeginning, true) > maxTextLength) {
					textBeginning = text.slice(0, i)
					textEnding = text.slice(textBeginning.length + 1)
				}
			}
			SceneManager._scene._logWindow.push("addText", textBeginning, 16)
			SceneManager._scene._logWindow.push("addText", textEnding, 16)
		}
	}
}

// ================================ BASIC STATE GETTERS ================================ //
{
	// Get emotion, gets only first as there can only be single emotion concurrent
	Game_Battler.prototype.emotionState = function() {
		return this.states().find(state => state.isEmotion) || null;
	};

	// Get buff, specify type as multiple type can exist
	Game_Battler.prototype.stateBuff = function(type) {
		type = DataManager.getMainStateBuffName(type);
		return this.states().find(state => state.isStateBuff && state.stateBuffType === type) || null;
	};

	// Get list of buff that battler has
	Game_Battler.prototype.stateBuffList = function() {
		return this.states().filter(state => state.isStateBuff);
	};

	Game_Battler.prototype.emotionStateType = function() {
		const curEmo = this.emotionState();
		return curEmo ? curEmo.emotionType : "NEUTRAL";
	};

	Game_Battler.prototype.emotionStateTier = function(type) {
		const curEmo = this.emotionState();
		if (!curEmo) return 0; // Emotion check. If none or invalid then 0.
		if (type) { // Specified, only get tier of that emotion. If not then 0.
			type = type.toUpperCase()
			return curEmo.emotionType === type ? curEmo.emotionTier : 0;
		} else { // No type specified, assume any emotion tier.
			return curEmo.emotionTier;
		}
	};

	Game_Unit.prototype.emotionStateTier = function(type) {
		let sum = 0;
		for (member of this.members()) {
			sum += member.emotionStateTier(type);
		}
		return sum;
	};

	Game_Unit.prototype.emotionStateTierAverage = function(type) {
		return this.emotionStateTier(type) / this.aliveMembers().length;
	};

	Game_Battler.prototype.stateBuffTier = function(type) {
		const curState = this.stateBuff(type);
		return curState ? curState.stateBuffTier : 0;
	};

	Game_Unit.prototype.stateBuffTier = function(type) {
		let sum = 0;
		for (member of this.members()) {
			sum += member.stateBuffTier(type);
		}
		return sum;
	};

	// OLD: returns the "tier" of the state.
	Game_Battler.prototype.stateTypeTier = function(type) {
		const isEmotion = DataManager.isEmotionFromType(type);
		return isEmotion ? this.emotionStateTier(type) : this.stateBuffTier(type)
	};

	//returns the tier of emotion relative to type. Inclufing disadvantageous emotion as negative. 
	//Ex: Check for happy, but is angry. Being opposite on intention, output as if -1 happy tier.
	//If the input is "neutral", All higher emotions are lower negative tier.
	Game_Battler.prototype.emotionStateTierCombined = function(type) {
		type = type.toUpperCase();
		const curEmo = this.emotionState();
		if (!curEmo) return 0;
		if (type === curEmo.emotionType) {
			return curEmo.emotionTier;
		} else if (curEmo.emotionWeak.includes(type) || type === "NEUTRAL") {
			return -curEmo.emotionTier;
		}
		return 0;
	};

	Game_Battler.prototype.isEmotionStrongAgainst = function(type) {
		const curEmo = this.emotionState();
		return curEmo.emotionStrong && curEmo.emotionStrong.includes(type);
	};

	Game_Battler.prototype.isEmotionWeakAgainst = function(type) {
		const curEmo = this.emotionState();
		return curEmo.emotionWeak && curEmo.emotionWeak.includes(type);
	};

	Game_Battler.prototype.isEmotionStrongAgainstTarget = function(target) {
		return this.isEmotionStrongAgainst(target.emotionState());
	};

	Game_Battler.prototype.isEmotionWeakAgainstTarget = function(target) {
		return this.isEmotionWeakAgainst(target.emotionState());
	};
	
	Game_Battler.prototype.getEmotionSuscept = function() {
		const battlerData = this.isActor() ? this.actor() : this.enemy();
		var battlerAcc = battlerData.emotionSuscept || 0;
		var stateAcc = this.states().reduce((acc, state) => acc + (state.emotionSuscept || 0), 0);
		return battlerAcc + stateAcc;
	};
}

// ================================ BASE GAME OMORI FIXES FUNCTIONS ================================ //
{
	Game_Battler.prototype.isEmotionAddable = function(type) {
		type = type.toUpperCase();
		const emoStateList = DataManager.getEmotionsWithType(type);

		return emoStateList.some(state => this.isStateAddable(state.id))
	}
}

// ================================ HIGHEST/LOWEST BUFF TIERS ================================ //
{
	// Returns the HIGHEST buff tier
	Game_Battler.prototype.highestStateBuff = function() {
		return this.stateBuffList().reduce((prev, current) => ((prev == null ? -Infinity : prev.stateBuffTier) > current.stateBuffTier) ? prev: current, 0);
	};

	// Returns the LOWEST buff tier
	Game_Battler.prototype.lowestStateBuff = function() {
		return this.stateBuffList().reduce((prev, current) => ((prev == null ? Infinity : prev.stateBuffTier) < current.stateBuffTier) ? prev : current, 0);
	};

	// ================================================================
	// HIGHEST/LOWEST BUFF TIERS GAME UNITS
	// ================================================================
	Game_Battler.prototype.highestBuffType = function() {
		let stateList = DataManager.getStateBuffTypeList();
		let state = this.highestStateBuff();
		return state ? state.stateBuffType : stateList[Math.randomInt(stateList.length)]
	};

	Game_Battler.prototype.lowestBuffType = function() {
		let stateList = DataManager.getStateBuffTypeList();
		let state = this.lowestStateBuff();
		return state ? state.stateBuffType : stateList[Math.randomInt(stateList.length)]
	};

	// ================================================================
	// HIGHEST/LOWEST BUFF TIERS GAME UNITS
	// ================================================================

	// Gets the STATE of the HIGHEST buff in a unit
	Game_Unit.prototype.highestStateBuff = function(type) {
		let comparer = (prev, current) => ((prev == null ? -Infinity : prev.highestStateBuff().stateBuffTier) > current.highestStateBuff().stateBuffTier) ? prev : current;
		if (type) {
			type = DataManager.getMainStateBuffName(type);
			comparer = (prev, current) => ((prev == null ? -Infinity : (prev.stateBuff(type) ? prev.stateBuff(type).stateBuffTier : 0)) > (current.stateBuff(type) ? current.stateBuff(type).stateBuffTier : 0)) ? prev : current;
		}
		return this.members().reduce(comparer, null);
	};

	// Gets the TIER of the HIGHEST buff in a unit
	Game_Unit.prototype.highestBuffTier = function(type) {
		if (type) {
			return this.highestStateBuff(type).stateBuffTier(type);
		} else {
			return this.highestStateBuff().highestStateBuff().stateBuffTier != undefined ? this.highestStateBuff().highestStateBuff().stateBuffTier : 0
		}
	};

	// Gets the STATE of the LOWEST buff in a unit
	Game_Unit.prototype.lowestStateBuff = function(type) {
		let comparer = (prev, current) => ((prev == null ? Infinity : prev.highestStateBuff().stateBuffTier) < current.lowestStateBuff().stateBuffTier) ? prev : current;
		if (type) {
			type = DataManager.getMainStateBuffName(type);
			comparer = (prev, current) => ((prev == null ? Infinity : (prev.stateBuff(type) ? prev.stateBuff(type).stateBuffTier : 0)) < (current.stateBuff(type) ? current.stateBuff(type).stateBuffTier : 0)) ? prev : current;
		}
		return this.members().reduce(comparer, null);
	};

	// Gets the TIER of the LOWEST buff in a unit
	Game_Unit.prototype.lowestBuffTier = function(type) {
		return this.lowestStateBuff(type).stateBuffTier;
	};

	Game_Battler.prototype.averageBuffTier = function() {
		let sum = 0
		let stateList = DataManager.getStateBuffTypeList()
		for (let i = 0; i < stateList.length; i++) {
			sum += this.stateTypeTier(stateList[i])
		}
		return sum / stateList.length;
	};

	// Returns ONLY buff tiers sum, good for clean buff check
	Game_Battler.prototype.totalBuffTier = function() {
		let sum = 0
		let stateList = DataManager.getStateBuffTypeList()
		for (let i = 0; i < stateList.length; i++) {
			sum += Math.max(0, this.stateTypeTier(stateList[i]))
		}
		return sum;
	};

	// Returns ONLY debuff tiers sum, good for clean debuff check
	Game_Battler.prototype.totalDebuffTier = function() {
		let sum = 0
		let stateList = DataManager.getStateBuffTypeList()
		for (let i = 0; i < stateList.length; i++) {
			sum += Math.min(0, this.stateTypeTier(stateList[i]))
		}
		return sum;
	};

    // Returns the average tier of every buff if used with no argument 
	Game_Unit.prototype.averageBuffTier = function(type) {
		let sum = 0
		let members = this.members()
		for (let i = 0; i < members.length; i++) {
			sum += type == undefined ? members[i].averageBuffTier() : members[i].stateTypeTier(type)
		}
		return sum / members.length;
	};

	// POLYMORPHISM !!!!
	Game_Unit.prototype.totalBuffTier = function() {
		let sum = 0;
		this.members().forEach(function (member) {
			sum += member.totalBuffTier();
		})
		return sum;
	};

	Game_Unit.prototype.totalDebuffTier = function() {
		let sum = 0;
		this.members().forEach(function (member) {
			sum += member.totalDebuffTier();
		})
		return sum;
	};

	Game_Unit.prototype.totalBuffTierAverage = function() {
		return this.totalBuffTier() / this.members().length;
	};

	Game_Unit.prototype.totalDebuffTierAverage = function() {
		return this.totalDebuffTier() / this.members().length;
	};

	// ================================ EMOTION UNITS ================================
	Game_Unit.prototype.emotionVariance = function() {
		let emoList = []
		this.members().forEach(function (member) {
			let item = member.emotionStateType();
			if (emoList.indexOf(item) === -1) {
				emoList.push(item);
			}
		})
		return emoList.length;
	};
}

// ================================ BASIC ADDING STATES ================================ //
{
	//For old plugin compatibility purposes, combining both buffs and emotions
	Game_Battler.prototype.addStateTier = function(type, tier = 1, parseText = false) {
		type = DataManager.getMainStateBuffName(type); //if it's not state buff it will just ignore
		const isEmotion = DataManager.isEmotionFromType(type);

		if (isEmotion) {
			tier += this.getEmotionSuscept() * (tier > 0 ? 1 : -1); // Make number more extreme, further from 0
			tier = Math.max(tier, 0)
		}
		if (tier === 0) return; // 0 tier input, do nothing.

		const curState = isEmotion ? this.emotionState() : this.stateBuff(type);
		const curTier = isEmotion ? this.emotionStateTier(type) : this.stateBuffTier(type);

		let tierAmount = this.canAddStateTier(type, tier);
		let noChange = (tierAmount === 0) ? true : false;
		let noStateFinal = (curState && curTier + tierAmount === 0) //No state
		let finalState = this.getCustomTieredState(type, curTier + tierAmount); //type and final tier
			
		// If there's state and is changed, remove
		if (curState && !noChange) this.removeState(curState.id);

		// Then add new state, if there's one
		if (!noStateFinal && finalState) {
			this._noStateMessage = undefined; //set to undefined before so it works with multiple additions
			this._bypassRemoveRestriction = true;
			this.addState(finalState.id);
		} else if (Stahl.Param.ReaddState && noChange) { // If specified readd, add back in regardless
			this.addState(curState.id);
		}

		console.log(this.name(), "got StateTier", type, tier, "| ", curState ? curState.name : "NO STATE", "=>", finalState ? finalState.name : "NO STATE");

		if (parseText) {
			if (isEmotion) {
				if (noChange) this._noEffectMessage = true;
				this.parseEmotionText(type, noChange);
			} else {
				if (noChange) this._noStateMessage = true;
				this.parseBuffText(type, tier);
			}
		}
	}

	// Returns amount of tier available to add.
	Game_Battler.prototype.canAddStateTier = function(type, tier) {
		const isEmotion = DataManager.isEmotionFromType(type);
		const curTier = isEmotion ? this.emotionStateTier(type) : this.stateBuffTier(type);
		let resistCheck = tier || 3; // Start check here. Defaults to 3

		if (!Number.isInteger(resistCheck)) {
			console.log("canAddStateTier tier is not an integer value!")
			return 0;
		}

		// Loop through each tier checking if it resists, finding nearest possible state tier available.
		while (true) {
			let testState = this.getCustomTieredState(type, curTier + resistCheck); //get state to test
			if (resistCheck === 0) break; // if check goes to 0 then no state can be changed; break loop
			if (curTier + resistCheck === 0) break; // A 0 tier result means no state as final, which always is allowed
			if (testState && !this.isStateResist(testState.id)) break;// if state exists & doesn't resist, then works
			resistCheck += resistCheck > 0 ? -1 : 1; // if all fails, check next; "lesser" tiered state, closer to tier 0
		}
		return resistCheck;
	}

	// Returns amount of tier available to add as if from tier 0
	Game_Battler.prototype.canAddStateTierCount = function(type, tier) {
		const curTier = 0;
		let resistCheck = tier || 3; // Start check here. Defaults to 3
		if (!Number.isInteger(resistCheck)) {
			console.log("canAddStateTier tier is not an integer value!")
			return 0;
		}

		// Loop through each tier checking if it resists, finding nearest possible state tier available.
		while (true) {
			let testState = this.getCustomTieredState(type, curTier + resistCheck); //get state to test
			if (resistCheck === 0) break; // if check goes to 0 then no state can be changed; break loop
			if (curTier + resistCheck === 0) break; // A 0 tier result means no state as final, which always is allowed
			if (testState && !this.isStateResist(testState.id)) break;// if state exists & doesn't resist, then works
			resistCheck += resistCheck > 0 ? -1 : 1; // if all fails, check next; "lesser" tiered state, closer to tier 0
		}
		return resistCheck;
	}

	// For getting emotion OR State, also accounting for emotion tags.
	Game_Battler.prototype.getCustomTieredState = function(type, tier) {
		if (tier === 0) return null
		const isEmotion = DataManager.isEmotionFromType(type);
		const battlerData = this.isActor() ? this.actor() : this.enemy();
		var customTag = battlerData.emotionTagUse || null;
		return isEmotion ? DataManager.getEmotion(type, tier, customTag) : DataManager.getStateBuff(type, tier);
	}

	// TEXT PARSING
	//Does the text for emotion change on battle log, enter what to display manually
	Game_Battler.prototype.isEmotionImmune = function(type) {
		const battlerData = this.isActor() ? this.actor() : this.enemy();
		return battlerData.emotionImmuneAll || (battlerData.emotionImmune && battlerData.emotionImmune.includes(type)) //battler's innate immunity, either from immune all or specified
		|| this.states().some((state) => state.emotionImmuneAll || (state.emotionImmune && state.emotionImmune.includes(type))); //states that add immunity, either from immune all or specified
	}

	Game_Battler.prototype.parseEmotionText = function(type, forceNoEffect = false) {
		const tname = this.name();
		const curState = this.emotionState();
		let text = "";

		if (this.isEmotionImmune(type)) {
			text = `${tname} cannot be ${type}!`;
		} else if (this._noEffectMessage || forceNoEffect) {
			if (curState === null) { return }
			let em = curState.emotionNoEffectText;
			if (em)
				text = `${tname} can't get ${em}`;
			else
				text = `${tname} cannot be more ${curState.emotionName}!`;
		} else {
			text = tname + (this.isActor() ? curState.message1 : curState.message2);
		}

		BattleManager.addTextSplit(text);
	};

	//Does the text for buff change on battle log, enter what to display manually
	Game_Battler.prototype.parseBuffText = function(type, tier = 1) {
		if (tier == 0) return; //if tier 0 then it's nothing lol

		type = DataManager.getMainStateBuffName(type);
		const tname = this.name();
		const stat = type;

		let text = "";
		let adj = DataManager.getStateBuffAdjective(Math.abs(tier));

		if (!this._noStateMessage) {
			if (Stahl.Param.UseMaximumBuffText && Math.abs(tier) >= 6) {
				let hl = tier > 0 ? "maximized!" : "minimized!";
				text = `${tname}'s ${stat} was ${hl}`;
			} else {
				let hl = tier > 0 ? "rose" : "fell";
				if (adj.length > 0) {
					text = `${tname}'s ${stat} ${hl} ${adj}`;
				} else {
					text = `${tname}'s ${stat} ${hl}`
				}
				text = text + (tier > 0 ? "!" : ".")
			}
		} else if (this._debuffImmune && tier < 0) {
			text = `${tname}'s ${stat} cannot be lowered!`;
		} else if (this._buffImmune && tier > 0) {
			text = `${tname}'s ${stat} cannot be raised!`;
		} else {
			let hl = tier > 0 ? "higher!" : "lower!";
			text = `${tname}'s ${stat} can't go any ${hl}`;
		}

		BattleManager.addTextSplit(text);
	};
}

// =============================================================================================== //
//                                      YEP AI TARGETING
// =============================================================================================== //
{
    Stahl.StateTiering.AIManager_setProperTarget = AIManager.setProperTarget;
    AIManager.setProperTarget = function(group) {
        this.setActionGroup(group);
        var line = this._aiTarget.toUpperCase();

        if (line.match(/HIGHESTTIER (.*)/i)) {
            var type = DataManager.getMainStateTypeName(String(RegExp.$1));
            return this.setHighestTierTarget(group, type);
        } else if (line.match(/LOWESTTIER (.*)/i)) {
            var type = DataManager.getMainStateTypeName(String(RegExp.$1));
            return this.setLowestTierTarget(group, type);
        } else if (line.match(/HIGHESTEMO (.*)/i)) {
            var type = DataManager.getMainStateTypeName(String(RegExp.$1));
            return this.setHighestEmotionTarget(group, type);
        } else if (line.match(/LOWESTEMO (.*)/i)) {
            var type = DataManager.getMainStateTypeName(String(RegExp.$1));
            return this.setLowestEmotionTarget(group, type);
        } else if (line.match(/EMOSTRONG/i)) {
            return this.setEmotionStrongAgainstTarget(group);
        } else if (line.match(/EMOWEAK/i)) {
            return this.setEmotionWeakAgainstTarget(group);
        };

        return Stahl.StateTiering.AIManager_setProperTarget.call(this, group);
    }

	AIManager.setHighestTierTarget = function (group, type) {
		console.log("group: " + group)
        var maintarget = group[Math.randomInt(group.length)];
		for (var i = 0; i < group.length; ++i) {
			var target = group[i];
			if (target.stateTypeTier(type) > maintarget.stateTypeTier(type)) maintarget = target;
		}
        this.action().setTarget(maintarget.index())
		console.log("HIGHEST TIER TARGET:", type, "| got", maintarget.name());
	};

    AIManager.setLowestTierTarget = function(group, type) {
        var maintarget = group[Math.randomInt(group.length)];
		for (var i = 0; i < group.length; ++i) {
			var target = group[i];
			if (target.stateTypeTier(type) < maintarget.stateTypeTier(type)) maintarget = target;
		}
        this.action().setTarget(maintarget.index())
		console.log("LOWEST TIER TARGET:", type, "| got", maintarget.name());
    };

    AIManager.setHighestEmotionTarget = function(group, type) {
        var maintarget = group[Math.randomInt(group.length)];
		for (var i = 0; i < group.length; ++i) {
			var target = group[i];
			if (target.emotionStateTierCombined(type) > maintarget.emotionStateTierCombined(type)) maintarget = target;
		}
        this.action().setTarget(maintarget.index())
		console.log("HIGHEST EMOTION TARGET:", type, "| got", maintarget.name());
    };

    AIManager.setLowestEmotionTarget = function(group, type) {
        var maintarget = group[Math.randomInt(group.length)];
		for (var i = 0; i < group.length; ++i) {
			var target = group[i];
			if (target.emotionStateTierCombined(type) < maintarget.emotionStateTierCombined(type)) maintarget = target;
		}
        this.action().setTarget(maintarget.index())
		console.log("LOWEST EMOTION TARGET:", type, "| got", maintarget.name());
    };

    AIManager.setEmotionStrongAgainstTarget = function(group) {
		var subject = this.action().subject;
		var subjectEmo = subject.emotionState();
		if (subjectEmo) {
			group = group.filter(target => subjectEmo.emotionStrong.includes(target.emotionStateType()));
		}

		var maintarget = group[Math.randomInt(group.length)];
		this.action().setTarget(maintarget.index());
		console.log("EMOTION STRONG AGAINST TARGET: subject Emo", subjectEmo ? subjectEmo.name : "NO STATE", "| got", maintarget.name());
    };

	AIManager.setEmotionWeakAgainstTarget = function(group) {
		var subject = this.action().subject;
		var subjectEmo = subject.emotionState();
		if (subjectEmo) {
			group = group.filter(target => subjectEmo.emotionWeak.includes(target.emotionStateType()));
		}

		var maintarget = group[Math.randomInt(group.length)];
		this.action().setTarget(maintarget.index());
		console.log("EMOTION WEAK AGAINST TARGET: subject Emo", subjectEmo ? subjectEmo.name : "NO STATE", "| got", maintarget.name());
    };
}

// =============================================================================================== //
//                                      YEP AI CONDITION
// =============================================================================================== //
{
	Stahl.StateTiering.AIManager_passAIConditions = AIManager.passAIConditions;
	AIManager.passAIConditions = function(line) {
		// EMOTION STRONG
		if (line.match(/EMOTION STRONG/i)) {
			return this.conditionEmotionStrong();
		}
		// EMOTION STRONG
		if (line.match(/EMOTION WEAK/i)) {
			return this.conditionEmotionWeak();
		}

		return Stahl.StateTiering.AIManager_passAIConditions.call(this, line);
	}

	AIManager.conditionEmotionStrong = function() {
		var user = this.battler();

		var group = this.getActionGroup();
		var validTargets = [];
		for (var i = 0; i < group.length; ++i) {
		  var target = group[i];
		  if (!target) continue;
		  if (user.isEmotionStrongAgainstTarget(target)) validTargets.push(target);
		}
		if (validTargets.length <= 0) return false;
		this.setProperTarget(validTargets);
		return true;
	};

	AIManager.conditionEmotionWeak = function() {
		var user = this.battler();

		var group = this.getActionGroup();
		var validTargets = [];
		for (var i = 0; i < group.length; ++i) {
		  var target = group[i];
		  if (!target) continue;
		  if (user.isEmotionWeakAgainstTarget(target)) validTargets.push(target);
		}
		if (validTargets.length <= 0) return false;
		this.setProperTarget(validTargets);
		return true;
	};
}
// =============================================================================================== //
//                                   YEP ACTION SEQUENCE
// =============================================================================================== //
{
	Stahl.StateTiering.BattleManager_processActionSequence = BattleManager.processActionSequence;
	BattleManager.processActionSequence = function(actionName, actionArgs) {

		// ADD EMOTION TYPE TIER
		if (actionName.match(/ADD EMOTION (\w+) (\d+)/i)) {
			return this.actionAddEmotion(actionName, actionArgs);
		}

		// ADD STATE BUFF TYPE TIER
		if (actionName.match(/ADD STATE ?BUFF (\w+) ([\+\-]?\d+)/i)) {
			return this.actionAddStateBuff(actionName, actionArgs);
		}

		// ANIMATION HP HEAL
		if (actionName.match(/ANIMATION HPHEAL/i)) {
			return this.actionAnimationHpHeal(actionArgs);
		}

		// ANIMATION MP HEAL
		if (actionName.match(/ANIMATION MPHEAL/i)) {
			return this.actionAnimationMpHeal(actionArgs);
		}

		// ANIMATION BUFF
		if (actionName.match(/ANIMATION BUFF/i)) {
			return this.actionAnimationBuff(actionArgs);
		}

		// ANIMATION DEBUFF
		if (actionName.match(/ANIMATION DEBUFF/i)) {
			return this.actionAnimationDebuff(actionArgs);
		}

		return Stahl.StateTiering.BattleManager_processActionSequence.call(this, actionName, actionArgs);
	};

	// Adds Emotion: ADD EMOTION type tier: target, show
	BattleManager.actionAddEmotion = function(actionName, actionArgs) {
		// Argument 0: Target
		var targets = this.makeActionTargets(actionArgs[0]);
		if (targets.length < 1) return false;

		// Argument 1: Show (optional)
		var show = actionArgs[1] && actionArgs[1].toUpperCase() === 'SHOW'

		if (actionName.match(/ADD EMOTION (\w+) ((?:\+|\-)?\d+)/i)) {
			var type = RegExp.$1;
			var tier = Number(RegExp.$2);
			if (type.toUpperCase() == "SAME") {
				targets.forEach(target => target.addSupplementaryEmotion(type, tier, show), this);
			} else {
				targets.forEach(target => target.addEmotion(type, tier, show), this);
			}
		}
		
		return true;
	};

	// Adds buffs: ADD STATEBUFF type tier: target, show
	BattleManager.actionAddStateBuff = function(actionName, actionArgs) {
		// Argument 0: Target
		var targets = this.makeActionTargets(actionArgs[0]);
		if (targets.length < 1) return false;

		// Argument 1: Show (optional)
		var show = actionArgs[1] && actionArgs[1].toUpperCase() === 'SHOW'

		if (actionName.match(/ADD STATE ?BUFF (\w+) ([\+\-]?\d+)/i)) {
			var type = RegExp.$1;
			var tier = Number(RegExp.$2);
			targets.forEach(target => target.addStateBuff(type, tier, show), this);
		}
		
		return true;
	};

	// Plays an Animation, Accounting for Actor or Enemy
	BattleManager.bothSideAnimation = function(targets, actorAnim, enemyAnim) {
		var targetEnemies = [];
		var targetActors = [];

		targets.forEach((target) => {
			if (target.isActor()) {
				targetActors.push(target);
			} else {
				targetEnemies.push(target);
			};
		});

		if (targetActors.length > 0)
			this._logWindow.showNormalAnimation(targetActors, actorAnim, false);
		if (targetEnemies.length > 0)
			this._logWindow.showNormalAnimation(targetEnemies, enemyAnim, false);
	};

	// Plays HP HEAL Animation; Accounting for Actor or Enemy
	BattleManager.actionAnimationHpHeal = function(actionArgs) {
		var targets = this.makeActionTargets(actionArgs[0]);
		if (targets.length < 1) return false;

		this.bothSideAnimation(targets, 212, 216);
		return true;
	};

	// Plays MP HEAL Animation; Accounting for Actor or Enemy
	BattleManager.actionAnimationMpHeal = function(actionArgs) {
		var targets = this.makeActionTargets(actionArgs[0]);
		if (targets.length < 1) return false;

		this.bothSideAnimation(targets, 213, 217);
		return true;
	};

	// Plays BUFF Animation; Accounting for Actor or Enemy
	BattleManager.actionAnimationBuff = function(actionArgs) {
		var targets = this.makeActionTargets(actionArgs[0]);
		if (targets.length < 1) return false;

		this.bothSideAnimation(targets, 214, 218);
		return true;
	};

	// Plays DEBUFF Animation; Accounting for Actor or Enemy
	BattleManager.actionAnimationDebuff = function(actionArgs) {
		var targets = this.makeActionTargets(actionArgs[0]);
		if (targets.length < 1) return false;

		this.bothSideAnimation(targets, 215, 219);
		return true;
	};
}

// ================================================================================
//          ADVANCED SECTION - THIS IS MORE EXPERIMENTAL AND LESS MAINTAINED
// ================================================================================

{
	// ================================ RANDOM ADDITION ================================ //
	DataManager.getRandomEmotion = function(exceptionEmotion) {
		let arr = DataManager.getEmotionTypeList().filter(a => !a.emotionExcludeFromRandom);
		if (exceptionEmotion) { //exclude an emotion
			arr.filter(a => a !== exceptionEmotion);
		}
		return arr[Math.randomInt(arr.length)];
	}

	DataManager.getRandomMainEmotion = function(exceptionEmotion) {
		let arr = DataManager.getMainEmotionTypeList().filter(a => !a.emotionExcludeFromRandom);
		if (exceptionEmotion) { //exclude an emotion
			arr.filter(a => a !== exceptionEmotion);
		}
		return arr[Math.randomInt(arr.length)];
	}

	//Adds random main emotion
	Game_Battler.prototype.addRandomMainEmotion = function(tier = 1, excludeCurrent = false, parseText = false) {
		let exclude = excludeCurrent ? this.emotionStateType() : undefined;
		let type = DataManager.getRandomMainEmotion(exclude);
		this.addEmotion(type, tier, parseText);
	};

	//Adds random emotion
	Game_Battler.prototype.addRandomEmotion = function(tier = 1, excludeCurrent = false, parseText = false) {
		let exclude = excludeCurrent ? this.emotionStateType() : undefined;
		let type = DataManager.getRandomEmotion(exclude);
		this.addEmotion(type, tier, parseText);
	};

	//Adds random buffs
	Game_Battler.prototype.addRandomBuff = function(tier = 1, parseText = false) {
		let arr = DataManager.getStateBuffTypeList();
		let type = arr[Math.randomInt(arr.length)];
		this.addStateBuff(type, tier, parseText);
	};

	//Adds random tier of the type. Specifying min and max
	Game_Battler.prototype.addRandomTier = function(type, minTier = 1, maxTier = 1, parseText = false) {
		var tier = Math.floor(Math.random() * (maxTier - minTier + 1) + minTier);
		this.addStateTier(type, tier, parseText);
	};

	// ================================ STATE BASED ADDITION ================================ //

	//Adds emotion on current emotion
	Game_Battler.prototype.addSupplementaryEmotion = function(tier = 1, parseText = false) {
		const curEmo = this.emotionState();
		if (curEmo) this.addEmotion(curEmo.emotionType, tier, parseText);
	};

	//Adds buff on current emotion's strength
	Game_Battler.prototype.addSupplementaryBuff = function(tier = 1, parseText = false) {
		const curEmo = this.emotionState();
		if (!curEmo) return;
		let arr = curEmo.emotionSupBuff;
		if (!arr || arr == []) return;
		let type = arr[Math.randomInt(arr.length)];
		this.addStateBuff(type, tier, parseText);
	};

	//Adds buff on current emotion's weakness
	Game_Battler.prototype.addComplimentaryBuff = function(tier = 1, parseText = false) {
		const curEmo = this.emotionState();
		if (!curEmo) return;
		let arr = curEmo.emotionComBuff;
		if (!arr || arr == []) return;
		let type = arr[Math.randomInt(arr.length)];
		this.addStateBuff(type, tier, parseText);
	};

	//Add emotion to the battler that is strong against the target. (Find target disadvantage. Target is sad then give happy, etc.)
	Game_Battler.prototype.addEmotionStrongAgainst = function(target, tier = 1, parseText = false) {
		const targetEmo = target.emotionState();
		if (!targetEmo) return;
		let arr = targetEmo.emotionWeak;
		if (!arr || arr == []) return;
		let type = arr[Math.randomInt(arr.length)];
		this.addEmotion(type, tier, parseText);
	};

	Game_Battler.prototype.addAdvantageEmotion = function(target, tier = 1, parseText = false) {
		this.addEmotionStrongAgainst(...arguments);
	};

	//Add emotion to the battler that is weak against the target. (Find target advantage. Target is sad then give angry, etc.)
	Game_Battler.prototype.addEmotionWeakAgainst = function(target, tier = 1, parseText = false) {
		const targetEmo = target.emotionState();
		if (!targetEmo) return;
		let arr = targetEmo.emotionStrong;
		if (!arr || arr == []) return;
		let type = arr[Math.randomInt(arr.length)];
		this.addEmotion(type, tier, parseText);
	};

	Game_Battler.prototype.addDisadvantageEmotion = function(target, tier = 1, parseText = false) {
		this.addEmotionWeakAgainst(...arguments);
	};

	//Adds buff type that is highest
	Game_Battler.prototype.addHighestBuff = function(tier = 1, parseText = false) {
		var type = this.highestBuffType();
		if (type) this.addStateBuff(type, tier, parseText);
	};

	//Adds buff type that is lowest
	Game_Battler.prototype.addLowestBuff = function(tier = 1, parseText = false) {
		var type = this.lowestBuffType();
		if (type) this.addStateBuff(type, tier, parseText);
	};

	// ================================ TIER BASED CHANCE BOOLEAN ================================ //

	//Random chance based on state tier
	Game_Battler.prototype.chanceStateTier = function(type, baseRate, incrementRate) {
		let tier = this.stateTypeTier(type);
		let rate = baseRate + (tier * incrementRate);
		let roll = Math.random() < rate
		console.log("stateRate", rate, "type", type, "roll", roll);
		return roll;
	}

	//Random chance based on emotion tier, combining disadvantageous emotion as negative tier
	Game_Battler.prototype.chanceEmotionTier = function(type, baseRate, incrementRate) {
		let tier = this.emotionStateTierCombined(type);
		let rate = baseRate + (tier * incrementRate);
		let roll = Math.random() < rate
		console.log("emoRate", rate, "type", type, "roll", roll);
		return roll;
	}
}

// ================================================================================
//                         OLD FUNCTION COMPATIBILITY
// ================================================================================
{
	Game_Battler.prototype.addEmotion = function(type, tier = 1, parseText = false) {
		this.addStateTier(type, tier, parseText);
	}

	Game_Battler.prototype.addStateBuff = function(type, tier = 1, parseText = false) {
		this.addStateTier(type, tier, parseText);
	}
	
	Game_Battler.prototype.highestBuffTier = function() {
		return this.highestStateBuff();
	};

	Game_Battler.prototype.lowestBuffTier = function() {
		return this.lowestStateBuff();
	}
		
	Game_Unit.prototype.highestBuffType = function() {
		return this.highestStateBuff();
	};

	Game_Unit.prototype.lowestBuffType = function() {
		return this.lowestStateBuff();
	};

	Game_Unit.prototype.highestBuffTier = function() {
		return this.highestStateBuff();
	};

	Game_Unit.prototype.lowestBuffTier = function() {
		return this.lowestStateBuff();
	};

	// No longer parameter ID because this is for Omori only anyways and causes bloat
	Game_Battler.prototype.hpHealAnim = function() {
		if (this.isActor()) this.startAnimation(212);
		else this.startAnimation(216);
	};
	
	Game_Battler.prototype.mpHealAnim = function() {
		if (this.isActor()) this.startAnimation(213);
		else this.startAnimation(217);
	};
	
	Game_Battler.prototype.buffAnim = function() {
		if (this.isActor()) this.startAnimation(214);
		else this.startAnimation(218);
	};
	
	Game_Battler.prototype.debuffAnim = function() {
		if (this.isActor()) this.startAnimation(215);
		else this.startAnimation(219);
	};
}