!function() {
  Scene_Battle.prototype.addActorActionPromptLogText = function() {
    // Get Actor
    var actor = BattleManager.actor();
    // If Actor Exists
    if (actor) {
      this.addLogCommandMessage(LanguageManager.languageData().text.XX_GENERAL.message_104.text.format(actor.name()));
      this.addLogCommandMessage("(ATK: "+actor.atk+", DEF: "+actor.def+", SPD: "+actor.agi+", LCK: "+actor.luk+")", false);
    };
  };

  let old_Scene_Battle_prototype_loadReservedBitmaps = Scene_Battle.prototype.loadReservedBitmaps
  Scene_Battle.prototype.loadReservedBitmaps = function() {
    // Run Original Function
    old_Scene_Battle_prototype_loadReservedBitmaps.call(this);
    //Reserve the new gradient for enemy MP
    ImageManager.reserveSystem('mp_enemy_box_gradients', 0, this._imageReservationId);
  };

  Sprite_EnemyBattlerStatus.prototype.refreshBitmap = function(battler) {
    // If Battler Exists
    if (battler) {
      // Get Battler Name
      var name = battler.name();

      // Get Battler State
      var EnemyEmotion = "";
      var SpecialEmotions = {119:"ANGRY", 120:"ENRAGED", 121:"FURIOUS", 122:"ECSTATIC", 123:"MANIC", 124:"SAD", 125:"DEPRESSED", 126:"MISERABLE"};
      // Get States
      var states = battler.states();
      // Go Through States
      for (var i = 0; i < states.length; i++) {
        // If State has transform emotion
        if (states[i].meta.TransformEmotion) {
          // If State is a special state
          if (Object.keys(SpecialEmotions).includes(String(states[i].id))) {
            EnemyEmotion = SpecialEmotions[states[i].id]+" ";
          } else {
            EnemyEmotion = states[i].meta.TransformEmotion.trim().toUpperCase()+" ";
          }
          break;
        }
      };

      // Recreate Bitmap
      if (EnemyEmotion != "") {
        this.bitmap = new Bitmap(this.minWidth()*2.22, 57*1.3);
      } else {
        this.bitmap = new Bitmap(this.minWidth()*1.85, 57*1.3);
      }
      
      this.bitmap.fontSize = 24;
      this.bitmap.fillAll('rgba(0, 0, 0, 0)');

      // Get Back Bitmap
      var backBitmap = ImageManager.loadSystem('enemy_box');

      // Make Background
      this.bitmap.blt(backBitmap, 0, 0, 7, backBitmap.height, 0, 0, 7, 57*1.3);
      this.bitmap.blt(backBitmap, 7, 0, 1, backBitmap.height, 7, 0, this.width - 14, 57*1.3);
      this.bitmap.blt(backBitmap, 8, 0, 7, backBitmap.height, this.width - 7, 0, 7, 57*1.3);

      // Draw Name
      this.bitmap.drawText(EnemyEmotion+name, 0, 0, this.width, 37, 'center');

      // Draw Stats
      this.bitmap.fontSize = 16;
      this.bitmap.drawText("ATK: "+battler.atk, 8, 0, this.width, 90, 'left'); //Displays the enemy's ATTACK
      this.bitmap.drawText("DEF: "+battler.def, -8, 0, this.width, 90, 'right'); //Displays the enemy's DEFENSE
      this.bitmap.drawText("SPD: "+battler.agi, 8, 0, this.width, 120, 'left'); //Displays the enemy's SPEED
      this.bitmap.drawText("LCK: "+battler.luk, -8, 0, this.width, 120, 'right'); //Displays the enemy's LUCK

      if (battler.mp == battler.mmp){
        // Draw HP bar
        var bar = ImageManager.loadSystem('enemy_box_gradients')
        var icon = ImageManager.loadSystem('hp_icon');
        var sx = (this.width - (bar.width + icon.width)) / 2
        var barHeight = bar.height / 2;
        this.bitmap.blt(icon, 0, 0, icon.width, icon.height, sx, this.height - (icon.height + 7) - 3);
        sx += icon.width;
        this.bitmap.blt(bar, 0, barHeight, bar.width, barHeight, sx, this.height - (barHeight + 9) - 3)
        this.bitmap.blt(bar, 0, 0, battler.hpRate() * bar.width, barHeight, sx, this.height - (barHeight + 9) - 3)

        // Draw HP
        this.bitmap.fontSize = 12;
        this.bitmap.drawText(`${battler.hp}/${battler.mhp}`, sx, this.height - 21, bar.width - 3, 3, 'right');
        
      } else {
        // Draw HP bar
        var bar = ImageManager.loadSystem('enemy_box_gradients')
        var icon = ImageManager.loadSystem('hp_icon');
        var sx = (this.width - (bar.width + icon.width)) / 2
        var barHeight = bar.height / 2;
        this.bitmap.blt(icon, 0, 0, icon.width, icon.height, sx, this.height - (icon.height + 7) - 11);
        sx += icon.width;
        this.bitmap.blt(bar, 0, barHeight, bar.width, barHeight, sx, this.height - (barHeight + 9) - 11)
        this.bitmap.blt(bar, 0, 0, battler.hpRate() * bar.width, barHeight, sx, this.height - (barHeight + 9) - 11)

        // Draw HP
        this.bitmap.fontSize = 12;
        this.bitmap.drawText(`${battler.hp}/${battler.mhp}`, sx, this.height - 29, bar.width - 3, 3, 'right');

        // Draw MP bar
        var mp_bar = ImageManager.loadSystem('mp_enemy_box_gradients')
        var mp_icon = ImageManager.loadSystem('mp_icon');
        var sx = (this.width - (mp_bar.width + mp_icon.width)) / 2
        var mp_barHeight = mp_bar.height / 2;
        this.bitmap.blt(mp_icon, 0, 0, mp_icon.width, mp_icon.height, sx, this.height - (mp_icon.height + 7) + 4);
        sx += mp_icon.width;
        this.bitmap.blt(mp_bar, 0, mp_barHeight, mp_bar.width, mp_barHeight, sx, this.height - (mp_barHeight + 9) + 4)
        this.bitmap.blt(mp_bar, 0, 0, battler.mpRate() * mp_bar.width, mp_barHeight, sx, this.height - (mp_barHeight + 9) + 4)

        // Draw MP
        this.bitmap.fontSize = 12;
        this.bitmap.drawText(`${battler.mp}/${battler.mmp}`, sx, this.height - 29, bar.width - 3, 33, 'right');
      }
      

      // Refresh Cursor
      this.setCursorPosition(battler.battleStatusCursorPosition());
    };
  };
 
  Scene_Battle.prototype.pushPartyMessage = function() {
    // Get Party Size
    let size = $gameParty.size();
    // Get Message Source
    let source = LanguageManager.languageData().text.XX_GENERAL;
    // Error Message
    let message = 'ERRROR!';
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
    // Add Log Command Message
    this.addLogCommandMessage(message);
    let escapeRatio = parseInt(Math.min(100,BattleManager._escapeRatio*100));
    if (BattleManager.canEscape()) {
      this.addLogCommandMessage("(Escape rate: "+escapeRatio+"%)", false);
    } else {
      this.addLogCommandMessage("(Can't escape!)", false);
    }
    
  }
}()