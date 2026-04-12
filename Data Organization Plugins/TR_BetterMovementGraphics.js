//=============================================================================
// Better Movement Graphics - By TomatoRadio
// TR_BetterMovementGraphics.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_BetterMovementGraphics = true;

var TR = TR || {};
TR.BMG = TR.BMG || {};

/*: 
 * @plugindesc v1.0 Adds Swimming as a proper anim type + notetag features.
 * @author TomatoRadio
 * 
 * @help
 * Normally, to use Swimming sprites you need to refresh the movement graphics,
 * but with this plugin, you can define the sprites in the 'swimming' key.
 * $gameActors.actor(1).setMovementGraphicData('swimming', {name: 'DW_OMORI', index: 3});
 * When Switch 1608 (Swimming?) is active, these will be used, otherwise reverting to walking.
 * 
 * Additionally, the ability to set movement graphics via a notetag group has been added.
 * <GraphicsData>
 * idle: DW_OMORI, 0
 * walking: DW_OMORI, 0
 * climbing: DW_OMORI, 1
 * swimming: DW_OMORI, 3
 * running: $DW_OMORI_RUN%(8), 0
 * </GraphicsData>
 * With this added to the Actor's notetags, running this script:
 * $gameActors.actor(1).setGraphicsDataByNotetag();
 * will set OMORI to these movement graphics.
 * This is useful for setting up movement graphics for mods with many actors that don't change images much throughout the game.
 * 
*/


Game_CharacterBase.prototype.updateMovementGraphics = function() {
  // If Normal
  if (this.canUpdateMovementGraphics()) {
    // Get Actor
    var actor = this.movementGraphicsSource();
    // If Actor Exists
    if (actor) {
      // Get Graphics
      var graphics = actor._characterMovementGraphics;
      // Get Character Graphic Name
      var characterName = this.characterName();
      // Get character index
      var characterIndex = this.characterIndex();     
      // [PLUGIN EDIT] If Swimming 
      if ($gameSwitches.value(1608)) {
        if (graphics.swimming) {
          if ((characterName !== graphics.swimming.name || characterIndex !== graphics.swimming.index)) {
            let bitmap = ImageManager.loadCharacter(graphics.swimming.name);
            if(!bitmap.isReady()) {return;}
            this.setImage(graphics.swimming.name, graphics.swimming.index);
          };
        } else {
          if (graphics.walking && (characterName !== graphics.walking.name || characterIndex !== graphics.walking.index)) {
            let bitmap = ImageManager.loadCharacter(graphics.walking.name);
            if(!bitmap.isReady()) {return;}
            this.setImage(graphics.walking.name, graphics.walking.index);
          };      
        }
      } else
      // If Moving
      if (this.isMoving()) {
        // If Climbing
        if (this.isClimbing()) {
          if (graphics.climbing && (characterName !== graphics.climbing.name || characterIndex !== graphics.climbing.index)) { 
            let bitmap = ImageManager.loadCharacter(graphics.climbing.name);
            if(!bitmap.isReady()) {return;}
            this.setImage(graphics.climbing.name, graphics.climbing.index); 
          }
        } else {
          if (this.shouldUseRunningGraphics()) {        
            if (graphics.running && (characterName !== graphics.running.name || characterIndex !== graphics.running.index)) { 
              let bitmap = ImageManager.loadCharacter(graphics.running.name);
              if(!bitmap.isReady()) {return;}
              this.setImage(graphics.running.name, graphics.running.index); 
            }
          } else {
            if (graphics.walking && (characterName !== graphics.walking.name || characterIndex !== graphics.walking.index)) { 
              let bitmap = ImageManager.loadCharacter(graphics.walking.name);
              if(!bitmap.isReady()) {return;}
              this.setImage(graphics.walking.name, graphics.walking.index); 
            }
          };          
        };
      } else {
        // If Climbing
        if (this.isClimbing()) {
          if (graphics.climbing && (characterName !== graphics.climbing.name || characterIndex !== graphics.climbing.index)) { 
            let bitmap = ImageManager.loadCharacter(graphics.climbing.name);
            if(!bitmap.isReady()) {return;}
            this.setImage(graphics.climbing.name, graphics.climbing.index); 
          }          
        } else {
          if (graphics.idle && this._stopCount > 0 && (characterName !== graphics.idle.name || characterIndex !== graphics.idle.index)) { 
            let bitmap = ImageManager.loadCharacter(graphics.idle.name);
            if(!bitmap.isReady()) {return;}
            this.setImage(graphics.idle.name, graphics.idle.index); 
          }
        }        
      }
    }
  };
  // Update Toast
  this.updateToast();
};

// Frankensteined code from KOFFIN_PartySelect
Game_Actor.prototype.getGraphicsNoteData = function() {
  const actorData = $dataActors[this._actorId];
  if (!actorData.note) return null;
  var reBlock = new RegExp('<GraphicsData>([\\s\\S]*?)<\\/GraphicsData>', 'i');
  var m = actorData.note.match(reBlock);
  if (!m) return null;
  var content = m[1];
  var lines = content.split(/[\r\n]+/).map(function(s){ return s.trim(); }).filter(function(s){ return s.length>0; });
  var out = {};
  lines.forEach(function(line){
    var colon = line.indexOf(':');
    if (colon > -1) {
      var key = line.substring(0,colon).trim();
      var val = line.substring(colon+1).split(',').map(s=>s.trim());
      out[key] = {name:val[0],index:parseInt(val[1])};
    };
  });
  return out;
};

Game_Actor.prototype.setGraphicsDataByNotetag = function() {
  const graphics = this.getGraphicsNoteData();
  if (graphics) { 
    this._characterMovementGraphics = graphics;
  };
};

Game_Follower.prototype.updateMovementGraphics = Game_CharacterBase.prototype.updateMovementGraphics;