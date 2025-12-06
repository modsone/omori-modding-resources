//=============================================================================
// Restrict Battle Commands - By TomatoRadio
// TR_RestrictBattleCommands.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_RestrictBattleCommands = true;

var TR = TR || {};
TR.RBC = TR.RBC || {};
TR.RBC.version = 1;

/*: 
 * @plugindesc v1.0 Restricts commands in battle with states.
 * @author TomatoRadio
 * 
 * @help
 * Allows you to restrict use of menu commands in battle with added states.
 * 
 * In a state, add the notetags
 * <RestrictAttacks> blocks the Attack command
 * <RestrictSkills> blocks the Skills command
 * <RestrictsSnacks> blocks the Snacks command
 * <RestrictToys> blocks the Toys command
 * 
 * In addition there's a option for restricted commands to be reduced to 50% opacity.
 * 
 * @param opacity
 * @text Reduced Opacity?
 * @type boolean
 * @desc If TRUE, then restricted commands with have 50% opacity
 * @on TRUE
 * @off FALSE
 * @default false
 * 
*/

TR.RBC.Param = PluginManager.parameters('TR_RestrictBattleCommands');

TR.RBC.opacity = eval(TR.RBC.Param["opacity"]);

Window_ActorCommand.prototype.addActorCustomCommand = function(obj) {  
  // Get Actor
  var actor = this._actor;
  // Object type case
  switch (obj.type.toLowerCase()) {
    case 'attack':    this.addAttackCommand() ;break;
    case 'skilllist': this.addSkillCommands() ;break;    
    case 'defend':    this.addGuardCommand()  ;break;
    case 'items':     this.addItemCommand()   ;break;
    case 'skilltypelist': 
      var stypeId = obj.id;
      var presetName = _TDS_.BattleCommandsList.params.sTypeNames[stypeId];
      // If Stype Names is not ''
      if (presetName && presetName !== '') {
        var name = presetName;
      } else {
        var name = $dataSystem.skillTypes[stypeId];
      }
      this.addCommand(name, 'skill', true, stypeId);    
      break;
    case 'skill': 
      // Get Skill
      var skill = $dataSkills[obj.id];
      // If Skill command can be shown
      if (actor.canShowItemBattleCommand(skill)) {
        // Get Skill Name
        var name = (skill.meta.CommandName || skill.name).trim();
        // Add Command
        this.addCommand(name, 'actionSkill', actor.canUse(skill) && !actor.isSkillSealed("Attacks"), skill.id);        
      }
      break;
    case 'item':
      // Get Skill
      var item = $dataItems[obj.id];
      // If Item command can be shown
      if (actor.canShowItemBattleCommand(item)) { 
        // Get Item Name
        var name = (item.meta.CommandName || item.name).trim();        
        // Add Command
        this.addCommand(name, 'actionItem', actor.canUse(item), item.id);
      }
      break;
    default:
      this.addCommand('ERROR', 'ERROR', false);
      break;
  }
};

Window_ActorCommand.prototype.addSkillCommands = function() {
    var skillTypes = this._actor.addedSkillTypes();
    skillTypes.sort(function(a, b){return a-b});
    skillTypes.forEach(function(stypeId) {
        var name = $dataSystem.skillTypes[stypeId];
        this.addCommand(name, 'skill', !this._actor.isSkillSealed("Skills"), stypeId);
    }, this);
};

Window_ActorCommand.prototype.addGuardCommand = function() {
    this.addCommand(TextManager.guard, 'guard', !this._actor.isSkillSealed("Snacks"));
};

Window_ActorCommand.prototype.addItemCommand = function() {
    this.addCommand(TextManager.item, 'item', !this._actor.isSkillSealed("Toys"));
};

Game_Battler.prototype.isSkillSealed = function(type) {
	for (const id of this._states) {
		let state = $dataStates[id];
		if (state && state.meta && state.meta[`Restrict${type}`]) {
			return true;
		};
  	};
  return false;
};

const old_addActorCustomCommand = Window_ActorCommand.prototype.addActorCustomCommand;
Window_ActorCommand.prototype.addActorCustomCommand = function(obj) {  
  	old_addActorCustomCommand.call(this,obj);
  	if (TR.RBC.opacity) {
		let thingy = this._list[this._list.length-1];
		if (!thingy.enabled) {
			this._commandSprites[this._list.length-1].alpha = 0.5;
		};
	};
};

Window_PartyCommand.prototype.createCommandSprites = function() {
  // Set Command Name
  let commandName = 'party_command';
  let commandsSize = 2;
  // Set Command
  switch ($gameVariables.value(22)) {
    case 1: commandName = 'PartyCommands_DreamWorld' ;break;
    case 2: commandName = 'PartyCommands_Faraway' ;break;
//   case 3: commandName = 'party_command' ;break;
    case 3: commandName = 'PartyCommands_BlackSpace' ;break;
    case 4: commandName = 'PartyCommands_BlackSpace' ;break;
    case 5: commandName = 'PartyCommands_FinalBattle'; commandsSize = 1 ;break;
  };
  // Hard code it to for simplicty sake
  //if (BattleManager._battleRetried && $gameTroop._troopId == 891) {
  if ($gameVariables.value(1220) >= 5  && $gameTroop._troopId == 891) {
    commandName = 'PartyCommands_FinalBattle';
    commandsSize = 1;
  }

  // Initialize Command Sprites Array
  this._commandSprites = [];
  // Get Bitmap
  let bitmap = ImageManager.loadSystem(commandName);
  bitmap.addLoadListener(() => {
    if (commandsSize > 1) {
      let height = bitmap.height / commandsSize;
      for (var i = 0; i < commandsSize; i++) {
        var sprite = new Sprite(bitmap);
        sprite.setFrame(0, i * height, 360, height);
        sprite.y = i * (height + 3);
  
  
        this._commandSprites[i] = sprite;
        this._commandSprites[i].alpha = this._list[i].enabled || !TR.RBC.opacity ? 1 : 0.5;
        this.addChildToBack(sprite)
      };
    } else {
      let sprite = new Sprite(bitmap);
      sprite.setFrame(0, 0, 360, bitmap.height);
      sprite.y = 0;
      this._commandSprites[i] = sprite;
      this.addChildToBack(sprite)
    };
  })

};