//=============================================================================
// FD_ItemIconRescale.js
//=============================================================================

var Imported = Imported || {};
Imported.FD_ItemIconRescale = true;

var FD = FD || {};
FD.ItemIconRescale = FD.ItemIconRescale || {};

/*: 
 * @plugindesc v1.0 Item Icon Rescale
 * @author FruitDragon
 * 
 * @help
 * Add <NoScale> to the notetags of any items that have icons on an 
 * 82x82 px sheet.
 * 
 * These icons will not have any blur due to rescaling.
 * 
 * Also this plugin requires Stahl_AltItemIcon. I don't
 * know why you'd be making new sheets that are 82x82 pixels per icon
 * otherwise.
 * 
 * 
 * 
*/


Window_OmoMenuHelp.prototype.refresh = function() {
  // Clear Contents
  this.contents.clear();
  // If Item Exists
  if (this._item) {
    this.contents.fontSize = LanguageManager.getMessageData("XX_BLUE.Window_OmoMenuHelp").refresh_contents_fontsize;
    this.drawText(this._item.name, 6, -6, 200);
    this.contents.fontSize = this.standardFontSize();
    this._iconRate = this._item.meta.NoScale ? 1 : 0.75
    // replace with drawtextex
    let loc_position = LanguageManager.getMessageData("XX_BLUE.Window_OmoMenuHelp").refresh_position;
    this.drawTextEx(this._item.description, loc_position[0], loc_position[1], 28); // CHANGE: Item descriptions text
    // Get Icon width
    var width = this._item.meta.NoScale ? 82 * this._iconRate : 106 * this._iconRate;
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

const _old_drawItemIcon = Window_Base.prototype.drawItemIcon;
Window_Base.prototype.drawItemIcon = function(item, x, y, rate = 1.0) {
    if (item.meta.ItemIconSheet) {
        let bitmap = ImageManager.loadSystem(item.meta.ItemIconSheet);
        bitmap.addLoadListener(() => {
            let index = 0;
            if (item.meta.IconIndex) {index = Number(item.meta.IconIndex);};
            let width = item.meta.NoScale ? 82 : 108;
            let height = item.meta.NoScale ? 82 : 108;
            let columns =  Math.floor(bitmap.width / width);
            let sX = (index % columns) * width;
            let sY = Math.floor(index / columns) * height;
            this.contents.blt(bitmap, sX, sY, width, height, x, y, width * rate, height * rate);
        });
    } else {
        _old_drawItemIcon.call(this, ...arguments);
    };
};