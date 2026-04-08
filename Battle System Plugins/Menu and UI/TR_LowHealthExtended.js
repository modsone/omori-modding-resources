//=============================================================================
// Low HP Extended - By TomatoRadio
// TR_LowHPExtended.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_LowHPExtended = true;

var TR = TR || {};
TR.LHE = TR.LHE || {};
TR.LHE.version = 1;

/*: 
 * @plugindesc v1.0 Massive Overhaul of the Low Hp Overlay
 * @author TomatoRadio
 * 
 * @help
 * This plugin allows for much higher customization of the Low HP Overlay
 * 
 * ============== BEHAVIOR CHANGES ==============
 * The overlay is now set to pulse every time
 * the heart monitor beeps.
 * In addition the max opacity and beeping volume
 * are changed based on how damaged you are.
 * 
 * ============== FULL PARTY OVERLAY ==============
 * By default, the overlay will now use the hp of 
 * the entire party when determining its effects.
 * 
 * ============== DEATH GAME OVERS ==============
 * If you want to have the effect tied to the hp
 * of one specific actor. (usually due to their
 * death being the actual cause of a game over)
 * Then give them the notetag
 * <DeathGameOver>
 * 
 * You can also assign this property with a state
 * with the same notetag, 
 * OR if you want to cancel out the effects of 
 * <DeathGameOver> on an actor, often for a 
 * passive skill or other instance where they
 * can die without causing a game over,
 * then add a state with <AntiDeathGameOver>
 * 
 * If multiple actors qualify for having the
 * effect tied to them, the effect will pick
 * the actor with the lowest HP%
 * 
 * ============== CHANGING THE OVERLAY ==============
 * These plugin commands have been added:
 * 
 * SetLowHpOverlayImage [picture]
 * This will set the overlay image to whatever picture you chose.
 * It will be swapped in mid-fight if ran via a troop event.
 * 
 * SetLowHpOverlayMaxOpacity [number 0-255]
 * This will set the maximum opacity the overlay can be.
 * This will default to 255 if unset.
 * Note: You will very rarely see it reach 255, since you have to be dead for the max opacity to be reached.
 * 
*/

TR.LHE.pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	// Low Health Overlay
	if (command.toLowerCase() == "setlowhpoverlayimage") { 
		$gameSystem._lowHpOverlayImage = args[0];
		if ($gameParty.inBattle()) {
			SceneManager._scene._lowHpOverlay.bitmap = ImageManager.loadPicture($gameSystem._lowHpOverlayImage);
		};
		return;
	} else if (command.toLowerCase() == "setlowhpoverlaymaxopacity") {
    $gameSystem._lowHpOverlayMaxOpacity = Number(args[0]);
  };
	// Return Original Function
	return TR.LHE.pluginCommand.call(this, command, args);
};

Sprite_BattleLowHpOverlay.prototype.initialize = function() {
  // Super Call
  Sprite.prototype.initialize.call(this);
  // Set Bitmap
  this.bitmap = !!$gameSystem._lowHpOverlayImage ? ImageManager.loadPicture($gameSystem._lowHpOverlayImage) : ImageManager.loadPicture('battle_lowhealth');
  // Get Actor
  //this._actor = $gameParty.getOmori();
  // Set Opacity
  this.opacity = 102;
  // Opacity Chage Values
  this._opacityChange = 0;
  this._opacitySpeed = 5;
  this._opacitySide = 0;
  this._activeOpacity = -60;
  this._oldHp = null;
  // this._activeOpacity = 255;
  // Hidden Flag
  this._hidden = false;
  // Set Beep Counter
  this._beepCounter = 0;
  // Set Danger Rate
  this._dangerRate = 0;
  // Set HP Rate
  this._hpRate = 1;
  // Set Original BGM
  this._originalBGM = AudioManager.makeEmptyAudioObject();
  // AudioManager.saveBgm
  // this.setBlendColor([255, 0, 255, 255])
};
//=============================================================================
// * Frame Update
//=============================================================================
Sprite_BattleLowHpOverlay.prototype.update = function() {
  // Super Call
  Sprite.prototype.update.call(this);
  if (BattleManager._showLowHpOverlay == false) {
      this._hidden = true;
      this.opacity = 0;
      return;
  };


  if (BattleManager._hideLowHpOverlay) {
    if (this.opacity > 0) {
      this.opacity -= 10;
    }
    return;
  }

  // If Actor Exists
  if ($gameParty.members()) {
    var avgHp = this.getActorHp(false);
	  var avgMHp = this.getActorHp(true);
    // If Actor HP does not match old HP
    if (avgHp !== this._oldHp) {
      // Get low HP Rate (20%)
      var lowHpRate = 0.2;
      // Get HP Rate
      this._hpRate = avgHp/avgMHp;
      //console.log(this._hpRate,avgHp,avgMHp);
      var dangerMax = avgMHp * lowHpRate;
      this._dangerRate = avgHp / dangerMax;
      // Update Old HP
      this._oldHp = avgHp;
      // Set Hidden State
      this._hidden = (this._hpRate > lowHpRate);
      // Reset Opacity Speed
      this._opacitySpeed = 0;
      // If Not hidden
      if (!this._hidden) {
        // Set Opacity Speed
        this._opacitySpeed = 4 + (5 - (5 * this._dangerRate));
        // If Actor HP is 0
        if (avgHp === 0) {
          // Play Low HP Background Sound
            AudioManager.playDangerBgs({name: '[sfx]battle_flatline', volume: 0, pitch: 100 })

        } else {
          // Play Low HP Background Sound
            AudioManager.playDangerBgs({name: 'boss_something_heartbeat', volume: 40, pitch: 100 + (50 - (50 * this._dangerRate)) })
        }
      } else {
        // Fadeout Background sound
        AudioManager.fadeOutDangerBgs(1);
      };
    };
  };
  // Update Opacity Changes
  this._opacityUp = typeof this._opacityUp !== "undefined" ? this._opacityUp : true;
  if (!this._hidden) {
    // Set Opacity
    let opaMax = $gameSystem._lowHpOverlayMaxOpacity ? $gameSystem._lowHpOverlayMaxOpacity - (($gameSystem._lowHpOverlayMaxOpacity*2.5)*this._hpRate) : 255 - (637.5*this._hpRate);
    this.opacity = Math.min(opaMax,this.opacity + (this._opacitySpeed * (this._opacityUp ? 1 : -1)));
    if (this.opacity >= opaMax) {
      this._opacityUp = false;
    }
  } else {
    this.opacity = 0;
  }

  if (!this._hidden && avgHp > 0 && this._hpRate <= 0.2) {
    // Decrease Beep Counter
    this._beepCounter--;
    // If Beep Counter is 0 or less
    if (this._beepCounter <= 0) {
      this._opacityUp = true;
      AudioManager.playSe({name: '[sfx]battle_ekg_beep', volume: (100 - (250 * this._hpRate)), pitch: 100 })
      this._beepCounter = 100 - (20 - (20 * this._dangerRate));
    };
  };

};

Sprite_BattleLowHpOverlay.prototype.getActorHp = function(max = false) {
	// First we get a list of every actor with <DeathGameOver>
	var deathGOactors = $gameParty.members().filter((actor) => actor.isDeathGameOver());
	if (deathGOactors.length > 0) { //If we actually have them lol
		var actor = this.getLowestHp(deathGOactors);
		return max ? actor.mhp : actor.hp;
	} else { //If there's nobody who is DeathGameOver, then average the party's hp
    var hp = 0;
    if (max) { //we do this check first so that the if is only ran once rather than on every iteration
      for (const actor of $gameParty.members()) {
        hp += actor.mhp;
      };
    } else {
      for (const actor of $gameParty.members()) {
        hp += actor.hp;
      };
    };
    return hp;
  };
};

Sprite_BattleLowHpOverlay.prototype.getLowestHp = function(actors) {
	var lowest = actors[0];
	for (const actor of actors) {
		if (actor.hpRate() < lowest.hpRate()) {
			lowest = actor;
		};
	};
	return lowest;
};

Game_Actor.prototype.isDeathGameOver = function() {
	var data = $dataActors[this.actorId()];
	if (data.meta.DeathGameOver) {
		for (const id of this._states) {
			if ($dataStates[id].meta.AntiDeathGameOver) {
				return false;
			};
		};
		return true;
	} else {
		for (const id of this._states) {
			if ($dataStates[id].meta.DeathGameOver) {
				return true;
			};
		};
		return false;
	};
};