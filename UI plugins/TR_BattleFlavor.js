//=============================================================================
// Battle Flavor - By TomatoRadio
// TR_BattleFlavor.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_BattleFlavor = true;

var TR = TR || {};
TR.BF = TR.BF || {};
TR.BF.version = 1.0;
//"haha it says boyfriend-" NOBODY FUCKING CARES

/*: 
 *
 * @plugindesc Allows all Unicode characters.
 * Version 1.0
 * @author TomatoRadio
 * 
 * @help
 * Adds a new plugin command to replace the "What will [ACTOR] and friends do?" message
 * with anything you want.
 * 
 * Plugin Commands:
 * 
 * BattleFlavor YAML.MESSAGE
 * BattleFlavor YAML MESSAGE
 * 
 * Both of these set the battle message to the yaml message (specifically the text property)
 * 
 * 
 * BattleFlavor reset
 * 
 * This resets the battle message back to the original
 * 
 * JavaScript:
 * You can set the flavor with this script:
 * 
 * Game_Interpreter.bmfMessageFlavor(yaml,message);
 * (Game_Interpreter is 'this' in a script command)
 * 
 * Game_Interpreter.bmfMessageFlavor("reset");
 * 
 * You can check the text with this script
 * $gameSystem._battleFlavor
*/

let old_plugincommandbattleflavor = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    // Command Switch Case
    switch (command.toLowerCase()) {
    case 'battleflavor':
    // Show Language Message
    this.bmfMessageFlavor(args[0], args[1]);
    return;
    };
    // Return Original Function
    return old_plugincommandbattleflavor.call(this, command, args);
};

Game_Interpreter.prototype.bmfMessageFlavor = function(filename, message) {
    if (filename.toLowerCase() === 'reset') {
        $gameSystem._battleFlavor = ''
        return;
    }
    if (!message) { //If no second arg assume a yaml.msg format
        message = filename.split('.')[1]
        filename = filename.split('.')[0]
    }
    let yaml = `${filename}.${message}`
    let text = LanguageManager.getMessageData(yaml).text; 
    $gameSystem._battleFlavor = text;
    return;
}

Scene_Battle.prototype.pushPartyMessage = function() {
  if (!$gameSystem._battleFlavor || $gameSystem._battleFlavor === '') {
    // Get Party Size
    let size = $gameParty.size();
    // Get Message Source
    let source = LanguageManager.languageData().text.XX_GENERAL;
    // Error Message
    var message = 'ERRROR!';
    switch(size) {
      case 1:
        message = source.message_104.text.format($gameParty.leader().name());
        break;
      case 2:
        message = source.message_102.text.format($gameParty.leader().name(), $gameParty.members()[1].name());
        break;     
      default:
        message = source.message_100.text.format($gameParty.leader().name());
        break;          
    }
  } else {
    var message = $gameSystem._battleFlavor
  }
    // Add Log Command Message
    this.addLogCommandMessage(message);
  }