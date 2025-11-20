 /*:
 * @plugindesc v1.0.0 Adds Remove State Category to YEP Action sequence
 * @author ReynStahl
 * 
 * @help
 * Dependencies: Put BELOW YEP StateCategory AND YEP ActionSequence
 * 
 * REMOVE STATE CATEGORY ALL TEXT: target, show
 */
var Stahl = Stahl || {};
Stahl.SCAS = Stahl.SCAS || {};

Stahl.SCAS.BattleManager_processActionSequence = BattleManager.processActionSequence;
BattleManager.processActionSequence = function(actionName, actionArgs) {
    if (actionName.match(/(?:REMOVE_STATE_CATEGORY_ALL|REMOVE STATE CATEGORY ALL)[ ](\w+)/i)) {
      return this.actionRemoveStateCategory(actionName, actionArgs);
    }

    return Stahl.SCAS.BattleManager_processActionSequence.call(this, actionName, actionArgs);
};

BattleManager.actionRemoveStateCategory = function(actionName, actionArgs) {
    var targets = this.makeActionTargets(actionArgs[0]);
    if (targets.length < 1) return false;
    var show = false;
    for (var i = 0; i < actionArgs.length; ++i) {
        var actionArg = actionArgs[i];
        if (actionArg.toUpperCase() === 'SHOW') show = true;
    }
    if (actionName.match(/(?:REMOVE_STATE_CATEGORY_ALL|REMOVE STATE CATEGORY ALL)[ ](\w+)/i)) {
        var stateCat = RegExp.$1;
        targets.forEach(function(target) {
            target.removeStateCategoryAll(stateCat);
            if (show) this._logWindow.displayActionResults(this._subject, target);
        }, this);
    }
    return true;
};