//=============================================================================
// MoveMessage.js
//=============================================================================
/*:
 * @plugindesc Allows you to move during a message if a particular script is called.
 * 
 *  The effects of this plugin are per session. If a player restarts the game, the effect is lost. 
 *  I believe loading another save will carry it over, so maybe change $gameTemp to anything else if you don't want that to happen
 * 
 * @author Pyro
 *
 * @help
 *
 *
 * TERMS OF USE
 * Whatever.
 *
 */

//=============================================================================
// * FIXES console /maptp
//=============================================================================
let old_canMove = Game_Player.prototype.canMove;
Game_Player.prototype.canMove = function()
{
    if ($gameMessage.isBusy() && !$gameTemp.CanMoveDuringMessage) {
        return false;
    }
    if($gameMap.isEventRunning() && !$gameTemp.CanMoveDuringMessage){
      return false;
    }
    if (this.isMoveRouteForcing() || this.areFollowersGathering()) {
        return false;
    }
    if (this._vehicleGettingOn || this._vehicleGettingOff) {
        return false;
    }
    if (this.isInVehicle() && !this.vehicle().canMove()) {
        return false;
    }
    return true;

}

Game_Interpreter.prototype.AllowMove = function()
{
    $gameTemp.CanMoveDuringMessage = true;
}

Game_Interpreter.prototype.DisallowMove = function()
{
    $gameTemp.CanMoveDuringMessage = false;
}

let oldpluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
  // Command Switch Case
  switch (command) {
  case 'AllowMove':
    $gameTemp.CanMoveDuringMessage = true;
    break;
  case 'DisallowMove':
    $gameTemp.CanMoveDuringMessage = false;
    break;
  };
  // Return Original Function
  return oldpluginCommand.call(this, command, args);
};