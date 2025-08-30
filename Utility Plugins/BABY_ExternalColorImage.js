
/*:
 * @plugindesc v1.00 Changes colors to be drawn from a seperate "Colors.png"
 * @author Babyjak
 *
 * 
 * @help
 * Mostly intended for mods that use alot of colors or have alot of different windowskins.
 * Instead of drawing from the Window.png colors, it will draw from another file called Colors.png
 * Works the same way, do \c[NUM] where NUM is the id of the color, starting from 0.
 * Should be compatible with everything else, if it isn't.. uh.. fuck
 */


// override base loadwindowskin function


if (Imported.TH_WindowskinChange == 1) {
    //do this if HIME_windowskinchange exists since every mod ever uses that
    Window_Base.prototype.loadWindowskin = function() {
      this.windowskin = ImageManager.loadSystem($gameSystem.windowskin());
      this.colorBox = ImageManager.loadSystem('Colors');    
    };
  } else {
    Window_Base.prototype.loadWindowskin = function() {
      this.windowskin = ImageManager.loadSystem('Window'); 
      this.colorBox = ImageManager.loadSystem('Colors');    
    };
  }
  

  // override base textcolor function
  Window_Base.prototype.textColor = function(n) {
    var px = (n % 24) * 12 + 6;
    var py = Math.floor(n / 24) * 12 + 6;
    return this.colorBox.getPixel(px, py);
  };
