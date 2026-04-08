//=============================================================================
 /*:
 * @plugindesc
 * This plugin will show JUICE, HEART, and ENERGY costs outside of skill descriptions.
 *
 * @author Rawberry
 * @help
 * JUICE, HEART, and ENERGY icons will require an edit to IconSet.png.
 * The index of the icons can be changed in the CustomCosts class.
 * 
 * You can use the skill notetag <CustomCostText: text> to change the cost tezt to a custom string.
 * 
 * 
 */
//=============================================================================



class CustomCosts {

    static JuiceIcon() {
        return 9;
    }

    static HeartIcon() {
        return 10;
    }

    static EnergyIcon() {
        return 11;
    }

}


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
    let costText = "";
    if (this._actor.skillMpCost(item) > 0) {
      costText += this._actor.skillMpCost(item) + `\\I[${CustomCosts.JuiceIcon()}]`;
    };
    if (this._actor.skillHpCost(item) > 0) {
      costText += this._actor.skillHpCost(item) + `\\I[${CustomCosts.HeartIcon()}]`;
    };
    if (item.meta.EnergyCost !== undefined) {
      costText += item.meta.EnergyCost + `\\I[${CustomCosts.EnergyIcon()}]`;
    };
    if (item.meta.CustomCostText !== undefined) {
        costText += " " + String(item.meta.CustomCostText);
    }
    if (costText === "") {
      costText += "FREE";
    };

    this.drawTextEx(LanguageManager.getMessageData("XX_BLUE.Omori_Battle_System").cost + " " + costText, 6, -2, 20);
  };
};

Window_OmoMenuHelp.prototype.refresh = function() {
  // Clear Contents
  this.contents.clear();
  // If Item Exists
  if (this._item) {
    this.contents.fontSize = LanguageManager.getMessageData("XX_BLUE.Window_OmoMenuHelp").refresh_contents_fontsize;
    this.drawText(this._item.name, 6, -6, 200);
    this.contents.fontSize = this.standardFontSize();
    // replace with drawtextex
    let loc_position = LanguageManager.getMessageData("XX_BLUE.Window_OmoMenuHelp").refresh_position;
    this.drawTextEx(this._item.description, loc_position[0], loc_position[1], 28); // CHANGE: Item descriptions text
    if (!$gameParty.inBattle() && !(this._item.mpCost == undefined)) {
      let costText = "";
      if (this._item.mpCost !== 0) {
        costText += this._item.mpCost + `\\I[${CustomCosts.JuiceIcon()}]`;
      } else if (this._item.mpCostPer) {
        costText += (this._item.mpCostPer * 100) + `%\\I[${CustomCosts.JuiceIcon()}]`;
      };
      if (this._item.hpCost !== 0) {
        costText += this._item.hpCost + `\\I[${CustomCosts.HeartIcon()}]`;
      } else if (this._item.hpCostPer) {
        costText += (this._item.hpCostPer * 100) + `%\\I[${CustomCosts.HeartIcon()}]`;
      };
      if (this._item.meta.EnergyCost !== undefined) {
        costText += this._item.meta.EnergyCost + `\\I[${CustomCosts.EnergyIcon()}]`;
      };
        if (this._item.meta.CustomCostText !== undefined) {
            costText += " " + String(this._item.meta.CustomCostText);
        };
      if (costText === "") {
        costText += "FREE";
      };
      this.drawTextEx(this._item.description + "\nCost: " + costText, loc_position[0], loc_position[1], 28);
    }
    // Get Icon width
    var width = 106 * this._iconRate;
    // Draw Item Icon
    this.drawItemIcon(this._item, this.contents.width - width, 0, this._iconRate);
    // Get Icon Name
    var iconName = this._item.meta.IconName;
    // If Icon Name Exists
    if (iconName) {
      // Get Bitmap
      // var bitmap = ImageManager.loadSystem('/items/' + iconName.trim());
      var bitmap = ImageManager.loadSystem(iconName.trim());
      // Create Icon Bitmap
      bitmap.addLoadListener(() => {
        var icon = new Bitmap(bitmap.width * this._iconRate, bitmap.height * this._iconRate);
        icon.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, icon.width, icon.height);
        var padding = this.standardPadding()
        var x = this.contents.width - icon.width;
        var y = this.contents.height - icon.height;
        this.contents.blt(icon, 0, 0, icon.width, icon.height, x, y)
      })
    }
  };
};