var DGT = DGT || {}
{
  Game_Interpreter.prototype.selfVar = function(id) {
    return $gameSelfVariables.value(`${this._mapId},${this._eventId},${id}`);
  }
  Game_Interpreter.prototype.setSelfVar = function (id, val) {
    $gameSelfVariables.setValue(`${this._mapId},${this._eventId},${id}`, val)
  }
  const ops = {'>=':0,'>':1,'==':2,'<':3,'<=':4,'!=':5}
  const getPageCustomConditions = function(page) {
    let conditions = {}
    for (const c of page.list) {
      if (c.code !== 108 && c.code !== 408) {break} // ensure comment code
      const comment = c.parameters[0]
      const scriptCondition = comment.match(/^condition-script:(.+)$/i)
      const svCondition = comment.match(/^condition-selfvar:(\d+)(>=|>|==|<|<=|!=)(\d+)$/i)
      if (scriptCondition) {
        conditions.script = scriptCondition[1]
        conditions.scriptValid = true
      } if (svCondition) {
        conditions.selfVariableId = svCondition[1]
        conditions.selfVariableOperator = ops[svCondition[2]]
        conditions.selfVariableValue = svCondition[3]
        conditions.selfVariableValid = true
      }
    }
    return conditions
  }
  const addConditionsToPage = function(page, conditions) {
    Object.assign(page.conditions, conditions)
  }
  const old_Game_Event_initialize = Game_Event.prototype.initialize
  Game_Event.prototype.initialize = function(mapid, eventid) {
    thisEvent = $dataMap.events[eventid]
    if (thisEvent) {
      const pages = thisEvent.pages
      for (const page of pages) {
        const conditions = getPageCustomConditions(page)
        addConditionsToPage(page, conditions)
      }
    }
    old_Game_Event_initialize.call(this, mapid, eventid)
  }
}