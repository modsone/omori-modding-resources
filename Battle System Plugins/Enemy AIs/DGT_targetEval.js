window.DGT = window.DGT || {}
DGT.targetCondition = {}
{
  let alias = (originalStorage, baseClass, funcName, usePrototype, newFunc) => {
    if (originalStorage[baseClass] == undefined) {
      originalStorage[baseClass] = {}
    }
    if (usePrototype) {
      originalStorage[baseClass][funcName] = window[baseClass].prototype[funcName] || (() => {}) // save original function
      window[baseClass].prototype[funcName] = function(...args) {
        return newFunc.call(this, originalStorage[baseClass][funcName], ...args)
      } // override function and pass original forward
    } else {
      originalStorage[baseClass][funcName] = window[baseClass][funcName] || (() => {}) // save original function
      window[baseClass][funcName] = newFunc.bind(window[baseClass], originalStorage[baseClass][funcName]) // override function and pass original forward
    }
  }
  alias = alias.bind(null, DGT.targetCondition)

  AIManager.conditionEvalWithTarget = function(condition) {
    var action = this.action();
    var item = action.item();
    var user = this.battler();
    var s = $gameSwitches._data;
    var v = $gameVariables._data;

    var group = this.getActionGroup();
    var validTargets = [];
    for (var i = 0; i < group.length; ++i) {
      var target = group[i];
      if (!target) continue;
      try {
        if (eval(condition)) validTargets.push(target);
      } catch (e) {
        Yanfly.Util.displayError(e, condition, 'A.I. EVAL WITH TARGETS ERROR')
      }
    }
    if (validTargets.length <= 0) return false;
    this.setProperTarget(validTargets);
    return true;
  }
  alias('AIManager', 'passAIConditions', false, function(original, line) {
    if (line.match(/TARGEVAL[ ](.*)/i)) {
      var condition = String(RegExp.$1);
      return this.conditionEvalWithTarget(condition);
    }
    return original.call(this, line)
  })
}