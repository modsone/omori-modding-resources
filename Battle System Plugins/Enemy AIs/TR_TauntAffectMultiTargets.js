//=============================================================================
// Taunt Affect Multi Targets - By TomatoRadio
// TR_TauntAffectMultiTargets.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_TauntAffectMultiTargets = true;

var TR = TR || {};
TR.TAMT = TR.TAMT || {};
TR.TAMT.version = 1;

/*: 
 * @plugindesc v1.0 Taunts now affect skills that target multiple actors.
 * @author TomatoRadio
 * 
 * @help
 * Does exactly as it says on the tin.
 * 
 * Some specifications:
 * Non-Taunting actors are treated identically to dead actors.
 * Only the <Physical Taunt> notetag actually triggers this,
 * however it does apply to all attack types.
 * This shouldn't matter since OMORI taunts affect all attacks.
 * 
 * Also should be obvious, but place this BELOW YEP_Taunts in the
 * Plugin Manager. That is a basegame plugin though, so you kinda have to try
 * to put this above it.
 * 
*/

AIManager.getActionGroup = function() {
  var action = this.action();
  if (Imported.YEP_X_SelectionControl) action.setSelectionFilter(true);
  if (!action) return [];
  if (action.isForUser()) {
    var group = [this.battler()];
  } else if (action.isForDeadFriend()) {
    var group = action.friendsUnit().deadMembers();
  } else if (action.isForFriend()) {
    var group = action.friendsUnit().aliveMembers();
  } else if (action.isForOpponent()) {
    if (this.battler().aiConsiderTaunt() && !action.item().bypassTaunt) {
      $gameTemp._tauntMode = true;
      $gameTemp._tauntAction = action;
      var group = action.opponentsUnit().physicalTauntMembers().length > 0 ? action.opponentsUnit().physicalTauntMembers() : action.opponentsUnit().aliveMembers();
      $gameTemp._tauntMode = false;
      $gameTemp._tauntAction = undefined;
    } else {
      var group = action.opponentsUnit().aliveMembers();
    }
  } else {
    var group = [];
  }
  if (this._setActionGroup !== undefined) {
    group = Yanfly.Util.getCommonElements(this._setActionGroup, group);
  }
  this._setActionGroup = group;
  return this._setActionGroup;
};