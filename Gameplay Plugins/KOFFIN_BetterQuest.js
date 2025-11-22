//=============================================================================
// TDS Omori Quest Menu - Auto Quest Extension
// Version: 1.0
//=============================================================================
// Add to Imported List
var Imported = Imported || {}; 
Imported.TDS_QuestMenu_Auto = true;

// Initialize Alias Object
var _TDS_AutoQuest_ = _TDS_AutoQuest_ || {}; 
_TDS_AutoQuest_.QuestMenu = _TDS_AutoQuest_.QuestMenu || {};

//=============================================================================
/*:
 * @plugindesc
 * Auto Quest Extension for OMORI Quest Menu - Adds switch-based quest management.
 *
 * @author KoffinKrypt
 *
 * @param Auto Refresh On Menu Open
 * @desc Automatically refresh quests when quest menu opens.
 * @default true
 *
 * @help
 * ============================================================================
 * * Plugin Commands
 * ============================================================================
 *
 *  Use this plugin command to manually refresh quests for some reason:
 *
 *    RefreshQuests
 *
 * ============================================================================
 * * Quest Database Setup
 * ============================================================================
 *
 * Add quests to the questDatabase array in the plugin parameters:
 * 
 * - id: Unique quest identifier
 * - name: Display name for the quest
 * - world: World number for quest filtering (1 for dream,  2 for real)
 * - unlockSwitch: Switch ID that unlocks the quest
 * - completionSwitch: Switch ID that marks quest as complete  
 * - descriptionCodes: Array of YAML message codes OR direct text for quest descriptions
 *   (first is start, second is completion)
 *
 * ============================================================================
 * * Quest Yaml Setup
 * ============================================================================
 *
 * You can make a YAML file for quests if you wish to use portraits and such.
 * it should be like this example:
 *
 *
 * catfindstart
 *    text: blah blah blah
 *
 * Assuming the yaml file is named QUESTS (you can name it whaetever) the description
 * code will be like this:
 *
 * QUESTS.catfindstart
 *
 * Otherwise you can just type the quest description straight into into if you do not 
 * need portraits. This method however, does not support texts codes, not even <br>
 * (but it does auto-wrap it i think so you dont need <br> anyways i guess)
 *
 * ============================================================================
 * * Changing the header name
 * ============================================================================
 *
 * If you want to change the "MARI'S ADVICE"  header text, it can be found in
 * System.yaml at the very end of the file.
 *
 *
 */
//=============================================================================

// Get Parameters
var parameters = PluginManager.parameters("Omori Quest Menu - Auto Quest Extension");
_TDS_AutoQuest_.QuestMenu.params = {};
_TDS_AutoQuest_.QuestMenu.params.autoRefresh = String(parameters['Auto Refresh On Menu Open'] || 'true') === 'true';

//=============================================================================
// ** Quest Database - Built into Plugin
//=============================================================================

_TDS_AutoQuest_.QuestMenu.questDatabase = [
    // Add your quests here - copy and modify these templates:
    {
        id: "FindCat",
        name: "Find the Lost Cat",
        world: 2,                   
        unlockSwitch: 1998,
        completionSwitch: 1999,
        descriptionCodes: [
            "QUESTS.catfindstart",
            "QUESTS.complete"
        ]
    },
    {
        id: "DeliverPackage", 
        name: "Deliver Important Package",
        world: 2,                    
        unlockSwitch: 2000,
        completionSwitch: 2001,
        descriptionCodes: [
            "You need to deliver the package to the town hall", // Direct text example
            "QUESTS.DeliverPackagecomplete" // YAML code example
        ]
    },
    {
        id: "ClearCave",
        name: "Clear the Monster Cave", 
        world: 1,                    
        unlockSwitch: 2002,
        completionSwitch: 2003,
        descriptionCodes: [
            "QUESTS.ClearCavestart",
            "QUESTS.ClearCavecomplete"
        ]
    }
    // Add more quests here as needed...
];

//=============================================================================
// ** Game_Party - Auto Quest Extension
//=============================================================================

// Alias original methods
_TDS_AutoQuest_.QuestMenu.Game_Party_initialize = Game_Party.prototype.initialize;

//=============================================================================
// * Object Initialization - Extended
//=============================================================================
Game_Party.prototype.initialize = function() {
    // Run Original Function
    _TDS_AutoQuest_.QuestMenu.Game_Party_initialize.call(this);
    // Ensure quest list exists
    if (!this._questList) {
        this._questList = [];
    }
    // Auto Quest Extension - Quest Stand By Message (if not already set by original)
    if (this._questStandByMessage === undefined) {
        this._questStandByMessage = null;
    }
};

//=============================================================================
// * NEW: Refresh Auto Quests - FIXED VERSION
//=============================================================================
Game_Party.prototype.refreshAutoQuests = function() {
    var database = _TDS_AutoQuest_.QuestMenu.questDatabase;
    
    database.forEach(function(questDef) {
        var unlockSwitch = questDef.unlockSwitch;
        var completionSwitch = questDef.completionSwitch;
        
        // If unlock switch is ON
        if ($gameSwitches.value(unlockSwitch)) {
            // Add quest if not already added
            if (!this.hasQuest(questDef.id, false)) {
                // Create Quest Object directly
                var quest = {
                    id: questDef.id, 
                    messageIndex: 0, 
                    world: questDef.world, 
                    complete: false
                };
                // Add Quest to Quest List
                this._questList.push(quest);
            }
            
            var currentQuest = this._questList.find(function(q) { return q.id === questDef.id; });
            
            if (currentQuest) {
                // Set completion state based on completion switch
                var isComplete = $gameSwitches.value(completionSwitch);
                this.setQuestCompleteState(questDef.id, isComplete);
                
                // Auto-set message index based on completion
                if (isComplete && questDef.descriptionCodes.length > 1) {
                    this.setQuestMessageIndex(questDef.id, questDef.descriptionCodes.length - 1);
                }
            }
        } else {
            // Remove quest if unlock switch is OFF
            this.removeQuest(questDef.id);
        }
    }, this);
};

//=============================================================================
// Get Auto Quest Definition
//=============================================================================
Game_Party.prototype.getAutoQuestDefinition = function(questId) {
    return _TDS_AutoQuest_.QuestMenu.questDatabase.find(function(q) { return q.id === questId; });
};

//=============================================================================
// Has Quest  
//=============================================================================
if (!Game_Party.prototype.hasQuest) {
    Game_Party.prototype.hasQuest = function(id, completed = true) {
        return this._questList.some(function(quest) { return quest.id === id });
    };
}

//=============================================================================
// Remove Quest 
//=============================================================================
if (!Game_Party.prototype.removeQuest) {
    Game_Party.prototype.removeQuest = function(id) {
        this._questList = this._questList.filter(function(quest) { return quest.id !== id; });
    };
}

//=============================================================================
// Set Quest Complete State 
//=============================================================================
if (!Game_Party.prototype.setQuestCompleteState) {
    Game_Party.prototype.setQuestCompleteState = function(id, state = true) {
        for (var i = 0; i < this._questList.length; i++) {
            var quest = this._questList[i];
            if (quest.id === id) { quest.complete = state; };
        };
    };
}

//=============================================================================
// Set Quest Message Index
//=============================================================================
if (!Game_Party.prototype.setQuestMessageIndex) {
    Game_Party.prototype.setQuestMessageIndex = function(id, index) {
        var quest = this._questList.find(function(q) { return q.id === id; });
        if (quest) { quest.messageIndex = index; };
    };
}

//=============================================================================
// Completed Quest List 
//=============================================================================
if (!Game_Party.prototype.completedQuestList) {
    Game_Party.prototype.completedQuestList = function(world = 0) {
        return this._questList.filter(function(quest) { return quest.complete && quest.world === world; });
    };
}

//=============================================================================
// Incomplete Quest List 
//=============================================================================
if (!Game_Party.prototype.incompleteQuestList) {
    Game_Party.prototype.incompleteQuestList = function(world = 0) {
        return this._questList.filter(function(quest) { return !quest.complete && quest.world === world; });
    };
}

//=============================================================================
// ** Game_Interpreter - Auto Quest Extension
//=============================================================================

// Alias original plugin command handler if it exists
_TDS_AutoQuest_.QuestMenu.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;

//=============================================================================
// * NEW: Manual refresh command
//=============================================================================
Game_Interpreter.prototype.refreshAutoQuests = function() {
    $gameParty.refreshAutoQuests();
};

//=============================================================================
// * Plugin Command - Extended
//=============================================================================
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    // Run original plugin command first (if it exists)
    if (_TDS_AutoQuest_.QuestMenu.Game_Interpreter_pluginCommand) {
        _TDS_AutoQuest_.QuestMenu.Game_Interpreter_pluginCommand.call(this, command, args);
    }
    
    // Handle Auto Quest commands
    if (command === 'RefreshQuests') {
        this.refreshAutoQuests();
    }
};

//=============================================================================
// ** Scene_OmoriQuest - Auto Quest Extension
//=============================================================================

// Check if original Scene_OmoriQuest exists before extending
if (typeof Scene_OmoriQuest !== 'undefined') {
    
    // Alias original create method
    _TDS_AutoQuest_.QuestMenu.Scene_OmoriQuest_create = Scene_OmoriQuest.prototype.create;
    
    //=============================================================================
    // * Create - Extended
    //=============================================================================
    Scene_OmoriQuest.prototype.create = function() {
        // Auto-refresh quests when menu opens if enabled
        if (_TDS_AutoQuest_.QuestMenu.params.autoRefresh) {
            $gameParty.refreshAutoQuests();
        }
        
        // Run original create method
        _TDS_AutoQuest_.QuestMenu.Scene_OmoriQuest_create.call(this);
    };

    // Alias original onQuestListOk method
    _TDS_AutoQuest_.QuestMenu.Scene_OmoriQuest_onQuestListOk = Scene_OmoriQuest.prototype.onQuestListOk;
    
//=============================================================================
// * [OK] Quest List - MODIFIED with error handling
//=============================================================================
Scene_OmoriQuest.prototype.onQuestListOk = function() {
  this._questListWindow.activate();
  this._messageWindow._setStandbyMessage = true;
  
  // Get Messages
  var messages = this._questListWindow.selectedQuestMessages();
  var firstMessage = messages[0];

  // Check if it looks like a YAML code (contains dot) and try to get data
  if (firstMessage && firstMessage.includes('.')) {
    try {
      // Get the actual message data from LanguageManager
      var messageData = LanguageManager.getMessageData(firstMessage);
      if (messageData && messageData.text) {
        // Set message properties from YAML data
        $gameMessage.setFaceImage(messageData.faceset || "", messageData.faceindex || 0);
        $gameMessage.setBackground(messageData.background || 0);
        $gameMessage.setPositionType(messageData.position === undefined ? 2 : messageData.position);
        
        // Add the text
        if (Imported && Imported.YEP_MessageCore) {
          $gameMessage.addText(messageData.text);
        } else {
          $gameMessage.add(messageData.text);
        }
      } else {
        // YAML code not found, use the text directly
        if (Imported && Imported.YEP_MessageCore) {
          $gameMessage.addText(firstMessage);
        } else {
          $gameMessage.add(firstMessage);
        }
      }
    } catch (e) {
      // If LanguageManager fails, use the text directly
      console.warn("LanguageManager error, using direct text:", firstMessage);
      if (Imported && Imported.YEP_MessageCore) {
        $gameMessage.addText(firstMessage);
      } else {
        $gameMessage.add(firstMessage);
      }
    }
  } else {
    // It's direct text - use it directly
    if (Imported && Imported.YEP_MessageCore) {
      $gameMessage.addText(firstMessage);
    } else {
      $gameMessage.add(firstMessage);
    }
  }

  // Clear Message List
  this._messageWindow.clearMessageList();
  for (var i = 1; i < messages.length; i++) {
    this._messageWindow.addMessage(messages[i]);
  };
  
  // Set Update Wait Cursors Flag to true
  this._updateWindowCursors = true;
  this._questListWindow.updateCustomCursorRectSprite();
  this._questTypesWindows.updateCustomCursorRectSprite();
};

}

//=============================================================================
// ** Window_OmoriQuestList - Auto Quest Extension  
//=============================================================================

// Check if original Window_OmoriQuestList exists before extending
if (typeof Window_OmoriQuestList !== 'undefined') {
    
    // Alias original methods
    _TDS_AutoQuest_.QuestMenu.Window_OmoriQuestList_selectedQuestMessages = Window_OmoriQuestList.prototype.selectedQuestMessages;
    _TDS_AutoQuest_.QuestMenu.Window_OmoriQuestList_makeCommandList = Window_OmoriQuestList.prototype.makeCommandList;
    
    //=============================================================================
    // * Get Selected Quest Messages - Extended for Auto Quests
    //=============================================================================
    Window_OmoriQuestList.prototype.selectedQuestMessages = function(index = this._index) {
        // Safety check
        if (!this._questList || !this._questList[index]) {
            return ["Quest data not found"];
        }
        
        // Get Quest
        var quest = this._questList[index];
        
        // Try to get description codes from auto quest database first
        var autoQuestDef = $gameParty.getAutoQuestDefinition(quest.id);
        
        if (autoQuestDef && autoQuestDef.descriptionCodes) {
            // Use YAML codes from auto quest database
            var messageIndex = Math.min(quest.messageIndex, autoQuestDef.descriptionCodes.length - 1);
            var yamlCode = autoQuestDef.descriptionCodes[messageIndex];
            // Return the YAML code - LanguageManager will handle the lookup
            return [yamlCode];
        }
        
        // Fall back to original method for non-auto quests
        return _TDS_AutoQuest_.QuestMenu.Window_OmoriQuestList_selectedQuestMessages.call(this, index);
    };
    
    //=============================================================================
    // * Make Command List - Extended for Auto Quests
    //=============================================================================
    Window_OmoriQuestList.prototype.makeCommandList = function() {
        // Clear any existing commands
        this.clearCommandList();
        
        // Process quests using both systems
        if (this._questList && this._questList.length > 0) {
            for (var i = 0; i < this._questList.length; i++) {
                var quest = this._questList[i];
                var autoQuestDef = $gameParty.getAutoQuestDefinition(quest.id);
                var questName;
                
                if (autoQuestDef) {
                    // Use name from auto quest database
                    questName = autoQuestDef.name;
                } else {
                    // Fall back to original method for non-auto quests
                    return _TDS_AutoQuest_.QuestMenu.Window_OmoriQuestList_makeCommandList.call(this);
                }
                
                this.addCommand(questName, 'quest', true, quest);
            }
        } else {
            // If no quests, fall back to original method
            _TDS_AutoQuest_.QuestMenu.Window_OmoriQuestList_makeCommandList.call(this);
        }
    };
    
}

//=============================================================================
// * Plugin Load Completion
//=============================================================================
console.log("TDS Omori Quest Menu - Auto Quest Extension loaded successfully");