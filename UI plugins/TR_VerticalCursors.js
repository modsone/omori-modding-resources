//=============================================================================
// Vertical Cursors - By TomatoRadio
// TR_VerticalCursors.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_VerticalCursors = true;

var TR = TR || {};
TR.VC = TR.VC || {};
TR.VC.version = 1;

/*: 
 * @plugindesc v1.0
 * @author TomatoRadio
 * 
 * @help
 * Allows for cursors that move vertically rather than
 * horizontally. To use them, you need a cursor image,
 * which defaults to "cursor_menu_vert" and you need to
 * set your Window_Selectable to have this function:
 * isUsingCustomCursorVertRectSprite() 
 * and have it return true.
 * Otherwise it acts just a normal cursor.
 * 
*/

if (!Sprite_WindowCustomCursorVert) { //Should make it self compatible, if not, welp.

function Sprite_WindowCustomCursorVert() { this.initialize.apply(this, arguments); }
Sprite_WindowCustomCursorVert.prototype = Object.create(Sprite_WindowCustomCursor.prototype);
Sprite_WindowCustomCursorVert.prototype.constructor = Sprite_WindowCustomCursorVert;

Sprite_WindowCustomCursorVert.prototype.setupBitmap = function(name) {
  // Set Bitmap
  this.bitmap = ImageManager.loadSystem(name === undefined ? 'cursor_menu_vert' : name);
};

Sprite_WindowCustomCursorVert.prototype.updateCursorAnimation = function() {
  // Get Index
  const index = Math.floor(this._sineIndex);
  // Set Anchor Position
  this.anchor.y = this._sineYList[index];
  // Increase Sine Index
  this._sineIndex = (this._sineIndex + this._speed) % this._sineYList.length;
};

TR.VC._upatecursor = Window_Selectable.prototype.updateCursor
Window_Selectable.prototype.updateCursor = function() {
  // If Using Custom Cursor Rect Sprite
  if (this.isUsingCustomCursorVertRectSprite()) {
    // If Custom Cursor Sprites Exist
  if (this._customCursorsSprites) {
    if (this._cursorAll && this._customCursorsSprites.length <= 0) {
      // Get Current Index
      var index = this.index();
      var mainSprite = this._customCursorRectSprite
      // Get Top Row
      var topRow = this.topRow();
      var maxCols = this.maxCols();
      var pageItems = this.maxPageItems();
      // Iterate Page Items
      for (var i = 0; i < pageItems; i++) {
        var tIndex = ((topRow * maxCols)  + i);
        // If Top index is the same as main sprite index
        if (tIndex === index) { continue; }
        // Create Sprite
        var sprite = new Sprite_WindowCustomCursorVert(tIndex, this.customCursorRectBitmapName());
        // Set Sprite Angle
        sprite._angle = mainSprite._angle;
        this._customCursorRectSpriteContainer.addChild(sprite);
        // Initialize Cursor Rect Sprite
        this._customCursorsSprites[i] = sprite;
      };
    } else if (this._customCursorsSprites.length > 0) {
      // Go Through Sprites
      for (var i = 0; i < this._customCursorsSprites.length; i++) {
        // Go Through Sprites
        var sprite = this._customCursorsSprites[i];
        // If Sprite exists set visibility
        if (sprite) { this._customCursorRectSpriteContainer.removeChild(sprite); };
      };
      // Clear Array
      this._customCursorsSprites = [];
    };
  };
  // Update Custom Rect Sprite
  this.updateCustomCursorRectSprite(this._customCursorRectSprite);
  if (this._customCursorsSprites) {
    // Go Through Sprites
    for (var i = 0; i < this._customCursorsSprites.length; i++) {
      // Go Through Sprites
      var sprite = this._customCursorsSprites[i];
      // If Sprite exists set visibility
      if (sprite) { this.updateCustomCursorRectSprite(sprite, sprite._index); };
    };
  };
  return;
  } else {
    // Run Original Function
    TR.VC._upatecursor.call(this);
  };
};

Window_Selectable.prototype.isUsingCustomCursorVertRectSprite = function() { return false; };

Window_Selectable.prototype.initCustomCursorRect = function() {
  // Initialize Cursor Rect Sprite
  this._customCursorsSprites = [];
  // Create Custom Cursor Rect Sprite Container
  this._customCursorRectSpriteContainer = new Sprite();
  this.addChild(this._customCursorRectSpriteContainer);
  // Create Custom Cursor Rect Sprite
  this._customCursorRectSprite = this.isUsingCustomCursorVertRectSprite() ? new Sprite_WindowCustomCursorVert(undefined, this.customCursorRectBitmapName()) : new Sprite_WindowCustomCursor(undefined, this.customCursorRectBitmapName());
  this._customCursorRectSpriteContainer.addChild(this._customCursorRectSprite);
};

};
/*========================================================================================================
COMMENTED OUT EXAMPLE
Window_OmoTitleScreenBox.prototype.isUsingCustomCursorVertRectSprite = function() { return true; }
Window_OmoTitleScreenBox.prototype.customCursorRectBitmapName = function() { return 'cursor_menu_vert'; }
Window_OmoTitleScreenBox.prototype.customCursorRectXOffset = function() { return (this.width/2)+5; }
Window_OmoTitleScreenBox.prototype.customCursorRectYOffset = function() { return -60; }
========================================================================================================*/