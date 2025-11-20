
  /*:
 * @plugindesc v1.00 Allows you to change window title, and saves it properly
 * @author Jimmy Fallon
 *
 * 
 * @help
 * Normally, "document.title" can be used to change the window title mid gameplay.
 * This, however, comes with the problem that the changed title won't be saved, meaning
 * you have to set it back each time after a save is loaded.
 * 
 * This plugin fixes that by allowing you to change the title and have it save at the same time.
 * This is done by using plugin command "AngryAutisticHouseWives" followed by whatever title you want
 * to write. No quotations, parantheses, or anything else. Just type in the name.
 * Additionally, you can also change the title via script command AngryAutisticHouseWives("title here").
 * This requires quotations, however.
 * Both methods work, and will change the title, and also keep the title as such for the rest of that save.
 * You can reissue the command whenever to change the title to something else.
 * 
 * If I got within 10 miles range of Samuel Calderón they could not pull me away with an industrial workforce magnet.
 */

  !function(){ 
    // If changed title exists, load it
    let old_loadgame = Scene_OmoriFile.prototype.loadGame
    
        Scene_OmoriFile.prototype.loadGame = function() {
            old_loadgame.call(this)
            if ($gameSystem._ChangedTitle) {
                document.title = $gameSystem._ChangedTitle
            }
    
                
        }
    }() 
    
    // Add new plugin command
    const oldassGame_Interpreter_prototype_pluginCommand = Game_Interpreter.prototype.pluginCommand
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
      switch (command) {
        case 'AngryAutisticHouseWives':
          return AngryAutisticHouseWives(args)
        default:
          return oldassGame_Interpreter_prototype_pluginCommand.call(this, command, args);
      };
    };
    
    
    // Function used, save changed title as a gameSystem value and then change the window title to the changed title
    AngryAutisticHouseWives = function(titlename) {
      var title = "";
      for (let i = 0; i < titlename.length; i++) {
        title += titlename[i] + " ";
      }
      $gameSystem._ChangedTitle = title
      document.title = $gameSystem._ChangedTitle
      }