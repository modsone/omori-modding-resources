//=============================================================================
// Hit Rate & Evasion Merge - By TomatoRadio
// TR_HitEvaMerge.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_HitEvaMerge = true;

var TR = TR || {};
TR.HEM = TR.HEM || {};
TR.HEM.version = 1.0;

/*: 
 *
 * @plugindesc Version 1.0 Changes Hit Rate and Evasion calculations.
 * @author TomatoRadio
 * 
 * @help
 * Changes the way Hit Rate and Evasion are calculated.
 * 
 * In base rpgmaker, Hit Rate and Evasion are calculated seperately,
 * meaning a 1000 Hit Rate can miss to a 5 Evasion.
 * 
 * In this version, Only one check is done, where the target's Evasion
 * is subtracted from the user's Hit Rate.
 * 
*/

//This code does some fancy shit so that result.missed and result.evaded check for if Evasion was the deciding factor.
Game_Action.prototype.itemHit = function(target) {
    if (this.isPhysical()) {
        return this.sillyHitRate(this.subject(),target);
    } else {
        return this.item().successRate * 0.01;
    };
};

Game_Action.prototype.itemEva = function(target) {
    if (this.isPhysical()) {
        return this._evade !== undefined ? this._evade : 0;
    } else if (this.isMagical()) {
        return 0;
    } else {
        return 0;
    };
};

Game_Action.prototype.sillyHitRate = function(user, target) {
  var rate = Math.random();
  if (this.item().successRate * 0.01 * user.hit <= rate) { //Miss w/o EVA assist
    this._evade = 0;
    return 0;
  } else if (this.item().successRate * 0.01 * (user.hit - target.eva) <= rate) { //Miss w/ EVA assist
    this._evade = 1;
    return 1;
  } else { //Hit regardless
    this._evade = 0;
    return 1;
  };
};