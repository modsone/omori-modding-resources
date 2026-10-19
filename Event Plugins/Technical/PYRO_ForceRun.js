//=============================================================================
// ForceRun.js
//=============================================================================
/*:
 * @plugindesc Allows you to force running.
 * 
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
// 
//=============================================================================
let forcerun_old_id = Game_Player.prototype.isDashing;
Game_Player.prototype.isDashing = function() {
    return forcerun_old_id.call(this) || this.forceRun;
    //return true;
};

Game_Interpreter.prototype.ForceRun = function(input)
{
    $gamePlayer.forceRun = input;
}

let forcerun_oldpluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
  // Command Switch Case
  switch (command) {
  case 'ForceRun On':
    this.ForceRun(true)
    break;
  case 'ForceRun Off':
     this.ForceRun(false)
    break;
  };
  // Return Original Function
  return forcerun_oldpluginCommand.call(this, command, args);
};