//=============================================================================
// TDS Character Press Turn & Strafing
//=============================================================================
// Add to Imported List
var Imported = Imported || {} ; Imported.TDS_CharacterPressTurn_Strafing = true;
// Initialize Alias Object
var _TDS_ = _TDS_ || {} ; _TDS_.CharacterPressTurn_Strafing = _TDS_.CharacterPressTurn_Strafing || {};
/*:
 * @plugindesc This plugin adds the ability to turn before moving and strafing.
 *
 * @param Press Turn Delay
 * @desc How many frames while turning.
 * @default 10
 * 
 * @param Press Disable Switch ID
 * @desc Switch ID to disable turning.
 * @default 13
 * 
 * @param Strafing Key Name
 * @desc Key to enable strafing when it is holded.
 * @default control
 * 
 * @param Strafing Disable Switch ID
 * @desc Switch ID to disable strafing.
 * @default 13
 *
 * @author originally TDS (restoration by kanpeen)
 *
 * @help
 * If you set the strafing key to control and use debug through during the playtest with strafing, press tab instead.
 * 
*/
//=============================================================================
// Get Parameters
var parameters = PluginManager.parameters("Character Press Turn & Strafing");
// Initialize Parameters
_TDS_.CharacterPressTurn_Strafing.params = {};
_TDS_.CharacterPressTurn_Strafing.params.pressTurnDelay = Number(parameters['Press Turn Delay'] || 10);
_TDS_.CharacterPressTurn_Strafing.params.strafingDisableSwitchID = Number(parameters['Strafing Disable Switch ID'] || 13);
_TDS_.CharacterPressTurn_Strafing.params.pressDisableSwitchID = Number(parameters['Press Disable Switch ID'] || 13);
_TDS_.CharacterPressTurn_Strafing.params.strafingKeyName = String(parameters['Strafing Key Name'] || 'control');

// the turning function is based on GALV_StationaryTurn.js
_TDS_.CharacterPressTurn_Strafing.Game_Player_initMembers = Game_Player.prototype.initMembers;
Game_Player.prototype.initMembers = function() {
	this._turnPause = 0;
	_TDS_.CharacterPressTurn_Strafing.Game_Player_initMembers.call(this);
};

Game_Player.prototype.canDelayTurn = function() {
    return !$gameSwitches.value(_TDS_.CharacterPressTurn_Strafing.params.pressDisableSwitchID);
}

Game_Player.prototype.canStrafe = function() {
	return Input.isPressed(_TDS_.CharacterPressTurn_Strafing.params.strafingKeyName) && !$gameSwitches.value(_TDS_.CharacterPressTurn_Strafing.params.strafingDisableSwitchID);
}

_TDS_.CharacterPressTurn_Strafing.Game_Player_moveStraight = Game_Player.prototype.moveStraight;
Game_Player.prototype.moveStraight = function(d) {
    var isDifferentDirection = this.direction() !== d;
    var isDelayTurn = isDifferentDirection && this.canDelayTurn();
    var isStrafing = isDifferentDirection && this.canStrafe();
    if (isDelayTurn && !this.canStrafe() && this._stopCount > 0) {
        this._turnPause = this.isDashing() || this.isMoveRouteForcing() ? 0 : _TDS_.CharacterPressTurn_Strafing.params.pressTurnDelay;
    }
    if (this._turnPause > 0) {
        if (isStrafing) {
            this._turnPause = 0;
        } else {
            this.setDirection(d);
            this._turnPause -= 1;
        }
    } else {
        var currentDir = this.direction();
        _TDS_.CharacterPressTurn_Strafing.Game_Player_moveStraight.call(this, d);
        if (isStrafing) {
            this.setDirection(currentDir);
        }
    }
};

_TDS_.CharacterPressTurn_Strafing.Game_Player_getOnVehicle = Game_Player.prototype.getOnVehicle;
Game_Player.prototype.getOnVehicle = function() {
	this._turnPause = 0;
	_TDS_.CharacterPressTurn_Strafing.Game_Player_getOnVehicle.call(this);
};

_TDS_.CharacterPressTurn_Strafing.Game_Player_getOffVehicle = Game_Player.prototype.getOffVehicle;
Game_Player.prototype.getOffVehicle = function() {
	this._turnPause = 0;
	_TDS_.CharacterPressTurn_Strafing.Game_Player_getOffVehicle.call(this);
};

// for debugging
var KANP = KANP || {} ; KANP.CharacterPressTurn_Strafing = KANP.CharacterPressTurn_Strafing || {};
KANP.CharacterPressTurn_Strafing.Game_Player_isDebugThrough = Game_Player.prototype.isDebugThrough;
Game_Player.prototype.isDebugThrough = function() {
    if (!$gameSwitches.value(_TDS_.CharacterPressTurn_Strafing.params.strafingDisableSwitchID) && (_TDS_.CharacterPressTurn_Strafing.params.strafingKeyName === 'control')) {
        return Input.isPressed('tab') && $gameTemp.isPlaytest();
    } else {
        return KANP.CharacterPressTurn_Strafing.Game_Player_isDebugThrough.call(this);
    }
};