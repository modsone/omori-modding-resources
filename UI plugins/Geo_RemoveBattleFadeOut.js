//=============================================================================
// Geo's Remove Battle Fade Out
//=============================================================================

//=============================================================================
 /*:
 * @plugindesc
 * This removes the fadein RPG MAKER MV Does when starting a battle.
 *
 *@help
 * == Remove Battle Fadein/Battle Transition Images ==
 *
 * -------------------------------
 * Introduction:
 *
 * This plugin has an option to disable the battle fade-in,
 * allowing the plugin to make battle transitions through images-
 * By adding the image that was used before transitioning into a battle,
 * (Usually the image that is used as a transition for a battle) then
 * being able to move images that were displayed through the same ID
 * that was used for it through a common event. (Configurable)
 *
 * -------------------------------
 * How To Use:
 * 
 * Use the "DisableFadein" and "ImprovedBattleIntro AddPicID X"
 * (X being a picture ID) plugin commands in order for the image
 * functionality to work, then edit the common event that the plugin
 * currently uses (default is 1730) to manipulate the image(s) that was
 * inherited to the battle.
 *
 * For a complete fadeless and smooth transition, make sure to also disable the
 * fadeout at the start of battle, in which command should be "DisableFadeOut" in
 * order to disable both the fade-out at the start of battle and "DisableFadeIn"
 * as mentioned before too in order to disable battle fades completely.
 *
 * Of course, you aren't just limited to just manipulating pictures.
 * You may add sound effects, check variables for a specific transition,
 * etc.
 *
 * -------------------------------
 * Plugin Commands:
 * 
 *      DisableFadein
 *      - Disables the fadein at the start of a battle. This will also
 *        enable for images to be inherited into battle.
 *
 *      EnableFadeIn
 *      - Re-enables the fadein at the start of a battle.
 *
 *      DisableFadeOut
 *      - If needed, this will also disable the fadeout that rpg maker
 *        does before the start of battle.
 *
 *      EnableFadeOut
 *      - Re-enables the fadeout before the start of a battle.
 * 
 *      ImprovedBattleIntro AddPicID X
 *      - Replace X with a picture's ID to make the plugin inherit an
 *        image of said ID to show at the start of battle.   
 *                              !!NOTE!!
 *        After a battle's done, the list of picture IDs will be reset.
 *
 * -------------------------------
 * Script Calls:
 *
 *      beesList.battleFade.addIDToPicList(PicId)
 *      - Adds picture IDs for images to be inherited into battle.
 *        
 *      $gameVariables._disableBattleFadeIn = true/false;
 *      - Set this to "true" to disable battle fade-ins, and "false"
 *        to re-enable them.
 *
 *      BattleManager._showEncounterEffect = false/true;
 *      - Set this to "false" to disable battle fade-outs, and "true"
 *        to re-enable them.
 *                              !!NOTE!!
 *        BattleManager._showEncounterEffect is an OMORI-made variable,
 *        and is *not from this plugin*.
 *
 * @param BattleIntro Common Event ID
 * @desc ID of the common event used to manipulate the image once it's in battle.
 * @default 1730
 *
 */
//=============================================================================

var beesList = beesList || {}; beesList.battleFade = beesList.battleFade || {};

beesList.battleFade.commonEventID = Number(parameters['BattleIntro Common Event ID'] || 1730);

// *****************************
// -- BATTLE SCENE --
// *****************************

// Adding pictures to start of battle, disabling fadein
beesList.battleFade._oldstart = Scene_Battle.prototype.start
Scene_Battle.prototype.start = function() {
	if ($gameVariables._disableBattleFadeIn && beesList.battleFade.idList) {
		// If widescreen is enabled
		var widthOffsetRemove = Imported.VykosX_OmoriWidescreen ? $WidthAdjust : 0;
		var picsList = beesList.battleFade.idList;
        for (let i = 0; i < picsList.length; i++) {
            $gameScreen._pictures[picsList[i]]._index = picsList[i];
        }
		this._defaultStart();
		for (let i = 0; i < picsList.length; i++) {
            var pic = $gameScreen._pictures[picsList[i]];
            $gameScreen.showPicture(pic._index, pic._name, pic._origin, pic._x - widthOffsetRemove, pic._y, pic._scaleX, pic._scaleY, pic._opacity, pic._blendMode);
        }
		// Tint Manager;
		if(!$gameTroop.waitForEmotion() && !$gameTroop.areSummonTroops()) {this.setStartTint();}
		this._helpWindow.hide();
		$gameTemp.reserveCommonEvent(beesList.battleFade.commonEventID);
		return;	
		}
	if ($gameVariables._disableBattleFadeIn) {
		this._defaultStart();
		// Tint Manager;
		if(!$gameTroop.waitForEmotion() && !$gameTroop.areSummonTroops()) {this.setStartTint();}
		this._helpWindow.hide();
		return;	
		}
	beesList.battleFade._oldstart.call(this);		
};

// Removing pictures after battle, resetting the picture id array
beesList.battleFade._oldbattleterminate = Scene_Battle.prototype.terminate
Scene_Battle.prototype.terminate = function() {
    beesList.battleFade._oldbattleterminate.call(this);
	var picsList = beesList.battleFade.idList;
    if (picsList) {
        for (let i = 0; i < picsList.length; i++) {
            var pic = $gameScreen._pictures[picsList[i]]
            $gameScreen.erasePicture(pic._index);
        }
		beesList.battleFade.idList = undefined;
    };
};

// *****************************
// -- PLUGIN COMMANDS --
// *****************************

beesList.battleFade.oldpluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
  // Command Switch Case
  switch (command) {
  case 'DisableFadeIn':
    // Disable Battle FadeIn
    $gameVariables._disableBattleFadeIn = true;
    break;
  case 'EnableFadeIn':
    // Enable Battle FadeIn
    $gameVariables._disableBattleFadeIn = undefined;
    break;
	// Add picture IDs to list, etc
  case 'ImprovedBattleIntro':
      switch (args[0]) {
	  // Add picture IDs to list
	  case 'AddPicID':
        beesList.battleFade.addIDToPicList(Number(args[1]));
	    break;
	  };
	  break;
  case 'DisableFadeOut':
    // Disable Battle FadeIn
    BattleManager._showEncounterEffect = undefined;
    break;
  case 'EnableFadeOut':
    // Enable Battle FadeIn
    BattleManager._showEncounterEffect = true;
    break;
  };
  // Return Original Function
  return beesList.battleFade.oldpluginCommand.call(this, command, args);
};

// Add picture IDs to list
beesList.battleFade.addIDToPicList = function(id) {
	beesList.battleFade.idList = beesList.battleFade.idList || [];
	if (!beesList.battleFade.idList.contains(id)) {
		beesList.battleFade.idList.push(id);
	};
};