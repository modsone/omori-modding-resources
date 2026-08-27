/*:
 * @plugindesc Self Switch Event Targeting
 * @author PYRO
 *
 *
 * @help
 * ============================================================
 * PYRO_MVSelfSwitchEvent - Self Switch Event Targeting
 * ============================================================
 * 
 * -- Overview --
 * This plugin allows you to target which event's Self Switch is changed with the respective OneMakerMV mod. 
 * 
*/
// Control Self Switch
// Added new PARAM, 2. 
// Which is equals to a character ID on the map.
Game_Interpreter.prototype.command123 = function() {
    if (this._eventId > 0 && this._params[2] > 0) {
        var key = [this._mapId, this._params[2], this._params[0]];
        $gameSelfSwitches.setValue(key, this._params[1] === 0);
    } else if(this._params[2] == 0 || this._params.length == 2)
    {
        var key = [this._mapId, this._eventId, this._params[0]];
        $gameSelfSwitches.setValue(key, this._params[1] === 0);
    }
    return true;
};