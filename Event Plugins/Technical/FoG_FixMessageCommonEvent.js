//===============================================================================================================
// FoGsesipod - FixMessageCommonEvent
// FixMessageCommonEvent.js
//===============================================================================================================

//===============================================================================================================
/*:
 * @plugindesc Fixes the \com[] message command from erasing the rest of the commmands in common events
 * @author FoGsesipod
 * @help
 * Unfortunately Game_Interpreter doesn't have context for if its commands are 
 * running in an event or in a common event. So you need to use this script 
 * to tell the code if your message is ran inside a common event or not, just
 * place a Script Block as show in the example right above the \com Message
 * in Common Events:
 * ◆Script：FoG._CommonEventContext = true;
 * 
 * The code will automatically disable it also.
 * 
 * If you are using a bunch of \com Messages in Common Events use this command
 * instead, as it will not be set to false automatically. (Meaning you will
 * need to remember to set it to false)
 * ◆Script：FoG._ForceCommonEventContext = true;
*/
//===============================================================================================================

var FoG = FoG || {};
FoG._CommonEventContext = false;
FoG._ForceCommonEventContext = false;
FoG._CurrenList = [];
FoG._CurrentIndex = [];

const Old_Game_Interpreter_prototype_setup = Game_Interpreter.prototype.setup
Game_Interpreter.prototype.setup = function(list, eventId) {
    Old_Game_Interpreter_prototype_setup.call(this, list, eventId);
    FoG._CurrenList[this._eventId] = list;
    if (FoG._ArcheiaFix) {
        FoG._ArcheiaFix = false;
        this._waitMode = 'message';
    }
};

const Old_Game_Interpreter_prototype_currentCommand = Game_Interpreter.prototype.currentCommand
Game_Interpreter.prototype.currentCommand = function() {
    FoG._CurrentIndex[this._eventId] = this._index;
    return Old_Game_Interpreter_prototype_currentCommand.call(this)
};

Game_Map.prototype.setupCommonEvent = function (commonId) {
    var commonEvent = $dataCommonEvents[commonId];
    if (commonEvent) {
        var eventId = this._interpreter.isOnCurrentMap() ? this._interpreter._eventId : 0;
        FoG._SavedList = FoG._CurrenList[eventId].slice(FoG._CurrentIndex[eventId] + 1);;
        FoG._RunningEventId = eventId;
        this._interpreter.setupChild(commonEvent.list, eventId);
        FoG._ArcheiaFix = true;
    }
};

const Old_Game_Interpreter_prototype_terminate = Game_Interpreter.prototype.terminate
Game_Interpreter.prototype.terminate = function() {
    Old_Game_Interpreter_prototype_terminate.call(this);
    if (FoG._ArcheiaFix && FoG._RunningEventId == this._eventId && (FoG._CommonEventContext || FoG._ForceCommonEventContext)) {
        FoG._CommonEventContext = false;
        this.setup(FoG._SavedList, this._eventId);
    }
};