/*:
 * @plugindesc v1.0.1 Adds more Damage pop up types
 *
 * @author StahlReyn, vl (Reflection system)
 *
 * @help
 * Stuff _damageBitmap
 *
 * - Makes attacks that only deal juice damage and healing show if they're moving or
 *   dull and some things required for absorb/null/reflect popups
 * - Added reflection to work with Omori, for emotion specifically.
 *   Neutral reflection element check is added in YIN_OmoriFixes
 */

var Imported = Imported || {};
Imported.Stahl_DamagePopups = true;

var Stahl = Stahl || {};
Stahl.DamagePopups = Stahl.DamagePopups || {};

class StahlPopUp {
  static getLanguageData() {
    return LanguageManager.getTextData("XX_REVERIE", "PopUp");
  }

  static getResultText(value, result) {
    const lang = this.getLanguageData();
    if (result.isHit()) {
      if (value == 0) {
        return lang.actionNothing;
      } else if (!!result.elementStrong) {
        return value > 0 ? lang.attackStrong : lang.healStrong;
      } else if (!!result.elementWeak) {
        return value > 0 ? lang.attackWeak : lang.healWeak;
      }
    } else {
      return lang.actionMiss;
    }
  }

  static playSoundCritical() {
    AudioManager.playSe({
      name: "BA_CRITICAL_HIT",
      volume: 250,
      pitch: 100,
      pan: 0,
    });
  }

  static playSoundStrong() {
    AudioManager.playSe({
      name: "se_impact_double",
      volume: 150,
      pitch: 100,
      pan: 0,
    });
  }

  static playSoundWeak() {
    AudioManager.playSe({
      name: "se_impact_soft",
      volume: 150,
      pitch: 100,
      pan: 0,
    });
  }

  static playSoundNull() {
    AudioManager.playSe({
      name: "BA_miss",
      volume: 150,
      pitch: 60,
      pan: 0,
    });
  }

  static playSoundReflect() {
    AudioManager.playSe({
      name: "BA_protect",
      volume: 150,
      pitch: 120,
      pan: 0,
    });
  }

  static playSoundAbsorb() {
    AudioManager.playSe({
      name: "BA_calm_down",
      volume: 150,
      pitch: 120,
      pan: 0,
    });
  }
}

Stahl.DamagePopups.Sprite_Damage_initialize =
  Sprite_Damage.prototype.initialize;
Sprite_Damage.prototype.initialize = function () {
  Stahl.DamagePopups.Sprite_Damage_initialize.call(this);
  this._criticalBitmap = ImageManager.loadSystem("dmg_critical");
  this._nullBitmap = ImageManager.loadSystem("dmg_elementNull");
  this._absorbBitmap = ImageManager.loadSystem("dmg_elementAbsorb");
  this._reflectBitmap = ImageManager.loadSystem("dmg_elementReflect");
  this._strongBitmap = ImageManager.loadSystem("dmg_elementStrong");
  this._weakBitmap = ImageManager.loadSystem("dmg_elementWeak");
};

Stahl.DamagePopups.Sprite_Damage_createDigits =
  Sprite_Damage.prototype.createDigits;
Sprite_Damage.prototype.createDigits = function (baseRow, value) {
  Stahl.DamagePopups.Sprite_Damage_createDigits.call(this, baseRow, value);
  var result = this._result;
  var string = Math.abs(value).toString();
  var w = this.digitWidth();

  if (result.elementReflect) {
    var reflectSprite = this.createReflectSprite();
    reflectSprite.x = this.digitWidth() - 16;
  } if (result.elementNull) {
    let sprite = this.createNullSprite();
    sprite.x = (string.length / 2) * (w - 8);
  } else if (result.elementAbsorb) {
    let sprite = this.createAbsorbSprite();
    sprite.x = (string.length / 2) * (w - 8);
  } else if (result.critical) {
    let sprite = this.createCriticalSprite();
    sprite.x = (string.length / 2) * (w - 8);
  } else if (result.elementStrong) {
    let sprite = this.createStrongSprite();
    sprite.x = (string.length / 2) * (w - 8);
    sprite.y += 5;
  } else if (result.elementWeak) {
    let sprite = this.createWeakSprite();
    sprite.x = (string.length / 2) * (w - 8);
    sprite.y += 5;
  }
};

Stahl.DamagePopups.Sprite_Damage_setup = Sprite_Damage.prototype.setup;
Sprite_Damage.prototype.setup = function (target) {
  Stahl.DamagePopups.Sprite_Damage_setup.call(this, target);
  var result = target.result();
  if (!result.critical) {
    if (result.elementStrong) {
      this.setupStrongEffect();
    } else if (result.elementWeak) {
      this.setupWeakEffect();
    }
  }
};

// Subtle but longer fade for moving and dull effect
Sprite_Damage.prototype.setupStrongEffect = function() {
  this._flashColor = [200, 0, 0, 120];
  this._flashDuration = 90;
};

Sprite_Damage.prototype.setupWeakEffect = function() {
  this._flashColor = [90, 90, 90, 140];
  this._flashDuration = 120;
};

// ================================================================
// * New Sprite Types
// ================================================================
Sprite_Damage.prototype.createCriticalSprite = function () {
  var sprite = new Sprite();
  sprite.bitmap = this._criticalBitmap;
  sprite.anchor.set(0.45, 1);
  sprite.y = -45;
  sprite.opacity = 0;
  this.addChild(sprite);
  return sprite;
};

Sprite_Damage.prototype.createNullSprite = function () {
  var sprite = new Sprite();
  sprite.bitmap = this._nullBitmap;
  sprite.anchor.set(0.45, 1);
  sprite.y = -45;
  sprite.opacity = 0;
  this.addChild(sprite);
  return sprite;
};

Sprite_Damage.prototype.createAbsorbSprite = function () {
  var sprite = new Sprite();
  sprite.bitmap = this._absorbBitmap;
  sprite.anchor.set(0.45, 1);
  sprite.y = -45;
  sprite.opacity = 0;
  this.addChild(sprite);
  return sprite;
};

Sprite_Damage.prototype.createReflectSprite = function () {
  var sprite = new Sprite();
  sprite.bitmap = this._reflectBitmap;
  sprite.anchor.set(0.45, 1);
  sprite.y = -45;
  sprite.opacity = 0;
  this.addChild(sprite);
  return sprite;
};

Sprite_Damage.prototype.createStrongSprite = function () {
  var sprite = new Sprite();
  sprite.bitmap = this._strongBitmap;
  sprite.anchor.set(0.45, 1);
  sprite.y = -45;
  sprite.opacity = 0;
  this.addChild(sprite);
  return sprite;
};

Sprite_Damage.prototype.createWeakSprite = function () {
  var sprite = new Sprite();
  sprite.bitmap = this._weakBitmap;
  sprite.anchor.set(0.45, 1);
  sprite.y = -45;
  sprite.opacity = 0;
  this.addChild(sprite);
  return sprite;
};

// ================================================================
// * Reflection System
// ================================================================

Stahl.DamagePopups.Game_Action_makeDamageValue =
  Game_Action.prototype.makeDamageValue;
Game_Action.prototype.makeDamageValue = function (target, critical) {
  // Calculate element before make damage value
  const elementRate = this.calcElementRate(target);
  let result = target.result();
  result.elementStrong = Math.abs(elementRate) > 1; // Changed to absolute value, these are for display absorb.
  result.elementWeak = Math.abs(elementRate) < 1;
  result.elementNull = elementRate == 0;
  result.elementAbsorb = elementRate < 0;
  result.elementReflect = !!this._reflectionTarget;

  // Do actual calculation
  return Stahl.DamagePopups.Game_Action_makeDamageValue.call(this, target, critical);
};

// Make result keep track of reflect. Use TDS one as it overrides that.
Stahl.DamagePopups.Game_Action_apply =
  _TDS_.OmoriBattleSystem.Game_Action_apply || Game_Action.prototype.apply;
Game_Action.prototype.apply = function (target) {
  Stahl.DamagePopups.Game_Action_apply.call(this, target);
  let result = target.result();
  if (result.isHit()) {
    // YIN Omori Fixes play effective sound
    this.playDamageSound(result);

    // Scanned Enemy (not used in original game)
    if (target.isEnemy()) {
      let item = this.item();
      if (item && item.meta.ScanEnemy && target.canScan()) {
        $gameParty.addScannedEnemy(target.enemyId());
      }
    }

    // YIN Omori Fixes stress Energy
    this.checkEnergy(target);
  }
};

Game_Action.prototype.playDamageSound = function(result) {
  // ORDER MATTERS
  if (result.elementReflect) {
    StahlPopUp.playSoundReflect();
  } else if (result.elementAbsorb) {
    StahlPopUp.playSoundAbsorb();
  } else if (result.elementNull) {
    StahlPopUp.playSoundNull();
  } else if (!!result.critical) {
    StahlPopUp.playSoundCritical();
  } else if (result.elementStrong) {
    StahlPopUp.playSoundStrong();
  } else if (result.elementWeak) {
    StahlPopUp.playSoundWeak();
  } else if (result.hpDamage > 0) {
    SoundManager.playEnemyDamage();
  }
}

Game_Action.prototype.checkEnergy = function(target) {
  this.checkEnergyNew(target);
  // this.checkEnergyOriginal(target);
}

Game_Action.prototype.checkEnergyOriginal = function(target) {
  if (!target.isEnemy() && result.hpDamage > 0) {
    $gameParty.stressEnergyCount++;
  }
}

Game_Action.prototype.checkEnergyNew = function(target) {
  let result = target.result();
  // Against enemy like usual, against actor is reversed.
  let mult = target.isEnemy() ? 1 : -1;

  if (result.hpDamage != 0) {
    if (result.elementReflect) {
      // Reflect check first, inversed again as reflect means hitting yourself.
      $gameParty.stressEnergyCount += 1 * mult;
    } else if (result.elementAbsorb) {
      // Absorb check first
      $gameParty.stressEnergyCount -= 1 * mult;
    } else if (result.elementNull) {
      // Null. Does nothing
    } else if (!!result.critical || result.elementStrong) {
      // Critical or Strong
      $gameParty.stressEnergyCount += 1 * mult;
    }
  }
}

Stahl.DamagePopups.Game_ActionResult_clear = Game_ActionResult.prototype.clear;
Game_ActionResult.prototype.clear = function () {
  Stahl.DamagePopups.Game_ActionResult_clear.call(this);
  this.elementStrong = false;
  this.elementWeak = false;
  this.elementNull = false;
  this.elementAbsorb = false;
  this.elementReflect = false;
};

BattleManager.invokeEmoReflection = function (subject, target) {
  const lang = StahlPopUp.getLanguageData();
  const text = lang.attackReflect.format(subject.name(), target.name()) || "";
  this._action._reflectionTarget = target;
  this._action.apply(subject);
  BattleManager.addTextSplit(text);
  //target.startDamagePopup();
  this._logWindow.displayActionResults(target, subject);
};

/**
 * If this battler is reflecting the attacker
 * @param {*} attacker
 * @returns 
 */
Game_Battler.prototype.isElementReflect = function (attacker) {
  // Checking for each of the reflection states
  if (attacker.isStateCategoryAffected("HAPPY"))
    return this.isStateCategoryAffected("REFLECT_HAPPY");
  if (attacker.isStateCategoryAffected("SAD"))
    return this.isStateCategoryAffected("REFLECT_SAD");
  if (attacker.isStateCategoryAffected("ANGRY"))
    return this.isStateCategoryAffected("REFLECT_ANGRY");
  if (attacker.isStateCategoryAffected("AFRAID"))
    return this.isStateCategoryAffected("REFLECT_AFRAID");
  return this.isStateCategoryAffected("REFLECT_NEUTRAL");
};

BattleManager.invokeAction = function (subject, target) {
  if (!Yanfly.Param.BECOptSpeed) this._logWindow.push("pushBaseLine");
  var normal = true;
  const action = this._action.item(); // Getting the attack's element ID
  this._action._reflectionTarget = null; // Reset reflection target every hit
  if (
    action.damage.type != 0 &&
    target.isElementReflect(subject)
  ) {
    this.invokeEmoReflection(subject, target);
  } else if (Math.random() < this._action.itemMrf(target)) {
    this.invokeMagicReflection(subject, target);
  } else if (Math.random() < this._action.itemCnt(target)) {
    this.invokeCounterAttack(subject, target);
  } else {
    this.invokeNormalAction(subject, target);
  }
  if (subject) subject.setLastTarget(target);
  if (!Yanfly.Param.BECOptSpeed) this._logWindow.push("popBaseLine");
};

// ================================================================
// * Advantage Moving Heals and Absorb Heals
// These functions below are modified to take in target AND subject
// ================================================================

_TDS_.CustomBattleActionText.Window_BattleLog_displayActionResults = function (
  subject,
  target
) {
  if (target.result().used) {
    this.push("pushBaseLine");
    this.displayCritical(target);
    this.push("popupDamage", target);
    this.push("popupDamage", subject);
    this.displayDamage(target, subject);
    this.displayAffectedStatus(target);
    this.displayFailure(target);
    this.push("waitForNewLine");
    this.push("popBaseLine");
  }
};

// Try to use one before CBAT uses.
Stahl.DamagePopups.Window_BattleLog_displayHpDamage =
  _old_window_battleLog_displayHpDamage ||
  Window_BattleLog.prototype.displayHpDamage;
Window_BattleLog.prototype.displayHpDamage = function (target, subject) {
  let result = target.result();
  let text = StahlPopUp.getResultText(result.hpDamage, result).format(
    subject.name(),
    target.name()
  );
  this.push("addText", text);
  this.push("waitForNewLine");
  return Stahl.DamagePopups.Window_BattleLog_displayHpDamage.call(this, target);
};

Stahl.DamagePopups.Window_BattleLog_displayMpDamage =
  Window_BattleLog.prototype.displayMpDamage;
Window_BattleLog.prototype.displayMpDamage = function (target, subject) {
  let result = target.result();
  let text = StahlPopUp.getResultText(result.mpDamage, result).format(
    subject.name(),
    target.name()
  );
  this.push("addText", text);
  this.push("waitForNewLine");
  return Stahl.DamagePopups.Window_BattleLog_displayMpDamage.call(this, target);
};

Window_BattleLog.prototype.displayDamage = function (target, subject) {
  this.displayHpDamage(target, subject);
  this.displayMpDamage(target, subject);
  this.displayTpDamage(target);
};
