//=============================================================================
// Custom Menu Face Sizes - By TomatoRadio
// TR_CustomMenuFaceSizes.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_CustomMenuFaceSizes = true;

var TR = TR || {};
TR.CMFS = TR.CMFS || {};
TR.CMFS.version = 1.0;

/*: 
 *
 * @plugindesc Allows custom menu face sizes
 * Version 1.0
 * @author TomatoRadio
 * 
 * @help
 * Add these notetag to the actors notes
 * <MenuStatusWidth: X>
 * <MenuStatusHeight: Y>
 * Both default to 124
 * You must use <MenuStatusFaceName> for this to work.
 * 
*/

Sprite_OmoMenuStatusFace.prototype.updateBitmap = function() {
  // Get Actor
  var actor = this.actor
  // If Actor Exists and it has Battle Status Face Name
  if (actor) {
    // Face Name
    let faceName
    if (this._inMenu) {
      // Get Face Name
      faceName = actor.menuStatusFaceName();
      // Set Face Width & Height
      if (actor.meta.MenuStatusWidth) {
        this._faceWidth = actor.meta.MenuStatusWidth
      } else {
        this._faceWidth = 124;
      }
      if (actor.meta.MenuStatusHeight) {
        this._faceHeight = actor.meta.MenuStatusHeight
      } else {
        this._faceHeight = 124;
      }
    };
    // Set Default Face Name
    if (!faceName) {
      faceName = actor.battleStatusFaceName();
      // Set Face Width & Height
      this._faceWidth = 106;
      this._faceHeight = 106;
    };
    // Set Bitmap
    this.bitmap = ImageManager.loadFace(faceName);
  } else {
    this.bitmap = null;
  };
  // Update Frame
  this.updateFrame();
};