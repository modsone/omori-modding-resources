var Imported = Imported || {};
Imported.Stahl_HpCostIcon = true;

//-----------------------------------------------------------------------------
/*:
 * @plugindesc v1.0.1 Allow for skill to display hp cost of skill in Omori
 * 
 * @author StahlReyn
 *
 * @help
 * Note: In RPGMaker MV, put this plugin under Omori Battle System.js as it overrides a function
 * 
 * Adds display for HP cost of the skill in Omori skill display
 * 
 * This works with YEP Skill Core's HP Cost stuff, so things like <HP Cost: x> will work automatically
 * 
 * Only MP cost - Displays only MP cost
 * Only HP cost - Displays only HP cost
 * Both 0 MP and HP cost - Displays 0 MP cost
 * Both MP and HP - Displays both MP and HP cost
 */
{
  // Replace setItem funciton entirely to alter how it displays MP and HP icons.
  Window_ItemListBack.prototype.setItem = function(item) {
    // Clear Rect
    this.contents.clearRect(0, 0, this.contents.width, 28);
    // If Item
    if (DataManager.isItem(item)) {
      // Set Bitmap Font color to null
      this.contents.bitmapFontColor = null;
      // Draw Item Count
      this.contents.drawText(LanguageManager.getMessageData("XX_BLUE.Omori_Battle_System").hold.format($gameParty.battleNumItems(item)), 6, 2, 100, 20);
    };
    // If Skill
    if (DataManager.isSkill(item)) {
      // Set Bitmap Font color to null
      this.contents.bitmapFontColor = null;
      this.contents.drawText(LanguageManager.getMessageData("XX_BLUE.Omori_Battle_System").cost, 6, 2, 100, 20);

      // ======== Changes icon depending if its Mp or Hp cost ========
      let mpCost = this._actor.skillMpCost(item);
      let hpCost = this._actor.skillHpCost(item);
      if (hpCost == 0) { //only MP like normal
        this.contents.drawText(mpCost, 0, 2, 95, 20, 'right');
        this.drawMPIcon(100, 6); 
      } else { // HP Cost exist
        if (mpCost == 0) { //only HP cost
          this.contents.drawText(hpCost, 0, 2, 95, 20, 'right');
          this.drawHPIcon(100, 7);
        } else { //both MP and HP
          this.contents.drawText(mpCost, 0, 2, 95, 20, 'right');
          this.drawMPIcon(100, 6); 
          this.contents.drawText(hpCost, 50, 2, 95, 20, 'right');
          this.drawHPIcon(150, 7);
        }
      }
    };
  };

}