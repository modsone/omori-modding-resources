//=============================================================================
// Custom Menu Face Sizes - By TomatoRadio
// TR_CustomMenuFaceSizes.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_CustomMenuFaceSizes = true;

var TR = TR || {};
TR.CMFS = TR.CMFS || {};
TR.CMFS.version = 2.0;

/*: 
 *
 * @plugindesc Allows custom menu face sizes
 * Version 2.0
 * @author TomatoRadio
 * 
 * @help
 * Add these notetag to the actors notes
 * <MenuStatusWidth: X>
 * <MenuStatusHeight: Y>
 * Both default to 124
 * You must use <MenuStatusFaceName> for this to work.
 * 
 * These refer to the pixel dimensions of 1 frame.
 * 
 * @param width
 * @text Default Width
 * @type number
 * @min 1
 * @max 999
 * @decimals 0
 * @description The default width in pixels for a menu face.
 * @default 125
 * 
 * @param height
 * @text Default Height
 * @type number
 * @min 1
 * @max 999
 * @decimals 0
 * @description The default height in pixels for a menu face.
 * @default 125
 * 
*/

TR.CMFS.Param  = PluginManager.parameters('TR_CustomMenuFaceSizes');

TR.CMFS.width  = parseInt(TR.CMFS.Param["width"]);
TR.CMFS.height = parseInt(TR.CMFS.Param["height"]);

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
      // Change actor to the $dataActors actor
      let actor = $dataActors[this.actor.actorId()];
      // Set Face Width & Height
      if (actor.meta.MenuStatusWidth) {
        this._faceWidth = actor.meta.MenuStatusWidth
      } else {
        this._faceWidth = TR.CMFS.width || 125;
      }
      if (actor.meta.MenuStatusHeight) {
        this._faceHeight = actor.meta.MenuStatusHeight
      } else {
        this._faceHeight = TR.CMFS.height || 125;
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
