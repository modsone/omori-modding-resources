/*:
 * @plugindesc v1.00 Change the image used for the cursor.
 * @author WHITENOISE
 *
 * 
 * @help
 * Use script call ChangeCursorImage(acs, cursor) to change the cursor image.
 * "acs" refers to the image to replace ACSArrows with.
 * "custom" refers to the image to replace cursor_menu with.
 * Use quotation marks when defining filenames. Do not include file extensions.
 * 
 * Requires YEP_X_ExtMesPack1.
 * 
 * AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
 * 
 * @param Volume Change Amount
 * @type number
 * @min 0
 * @desc Amount the volume changes with each size
 * change. Default: 30
 * @default 30
 * 
 */

  !function(){ 
    // preload default images so the game doesnt caca
    let oldboot = Scene_Boot.prototype.start
    
        Scene_Boot.prototype.start = function() {
            ImageManager.cursorImage = 'cursor_menu'
            ImageManager.ACSImage = 'ACSArrows'
            oldboot.call(this)              
        }
    }() 

 // command to change the images

  ChangeCursorImage = function(acs, cursor) {
            ImageManager.cursorImage = (cursor !== undefined) ? cursor : 'cursor_menu';
            ImageManager.ACSImage = (acs !== undefined) ? cursor : 'ACSArrows';
  
  }

// WHY DID THEY DO IT LIKE THIS?

Window_OmoWindowIndexCursor.prototype.createIndexSprite = function() {
  this._indexSprite = new Sprite(ImageManager.loadSystem(ImageManager.ACSImage))
  this._indexSprite.anchor.set(0.5, 0.5);
  this._indexSprite.setFrame(0, 0, 32, 29);
  this.addChild(this._indexSprite);
};

Sprite_EnemyBattlerStatus.prototype.createCursorSprite = function () {
    // Get Bitmap
    var bitmap = ImageManager.loadSystem(ImageManager.ACSImage);
    // Create Cursor Sprite
    this._cursorSprite = new Sprite(bitmap);
    this._cursorSprite.setFrame(0, 0, bitmap.width / 4, bitmap.height);
    this.addChild(this._cursorSprite);
    // Set Cursor Position
    this.setCursorPosition(0);
};

Sprite_ACSBubble.prototype.createArrowSprite = function () {
    this._arrowSprite = new Sprite(ImageManager.loadSystem(ImageManager.ACSImage));
    this._arrowSprite.anchor.set(0.5, 0.5);
    this.addChild(this._arrowSprite);
    this.setArrowDirection(this._arrowDirection);
};

Sprite_ACSBubble.prototype.setArrowDirection = function (direction) {
    // Arrow Direction
    this._arrowDirection = direction;
    // Get Bitmap
    var bitmap = ImageManager.loadSystem(ImageManager.ACSImage);
    // Get Width
    var width = bitmap.width / 4;
    // Reset anchor
    this._arrowSprite.anchor.set(0.5, 0.5);
    // Direction Switch
    switch (direction) {
        case 'down':
        case 2: // Down
            this._arrowSprite.setFrame(0, 0, width, bitmap.height);
            this._arrowMoveDirection = 0;
            direction = 2;
            break;
        case 'left':
        case 4: // Left
            this._arrowSprite.setFrame(2 * width, 0, width, bitmap.height);
            this._arrowMoveDirection = 1;
            direction = 4;
            break;
        case 'right':
        case 6: // Right
            this._arrowSprite.setFrame(1 * width, 0, width, bitmap.height);
            this._arrowMoveDirection = 1;
            direction = 6;
            break;
        case 'up':
        case 8: // Up
            this._arrowSprite.setFrame(3 * width, 0, width, bitmap.height);
            this._arrowMoveDirection = 0;
            direction = 8;
            break;
    };
    // Get Position
    var position = this._arrowPositions[direction];
    // If Position Exists
    if (position) {
        // Set Arrow Sprite Position
        this._arrowSprite.x = position[0];
        this._arrowSprite.y = position[1];
    };
};

Window_OmoriHitTheMark.prototype.createPointer = function() {
  // // Create Pointer Bitmap
  // var bitmap = new Bitmap(12, 6);
  // for (var i = 0; i < 6; i++) {
  //   var x = i
  //   var y = bitmap.height - i;
  //   var w = bitmap.width - (i * 2)
  //   bitmap.fillRect(x, y, w, 1, 'rgba(255, 255, 255, 1)');
  // };
  // // Create Pointer
  // this._pointer = new Sprite(bitmap);
  // this._pointer.x = 32
  // this._pointer.anchor.set(0.5, 0.5)
  // this._pointer.y = this.height - 8;
  // this._pointer.visible = false;
  // this.addChild(this._pointer);

  // Create Pointer
  this._pointer = new Sprite(ImageManager.loadSystem(ImageManager.ACSImage));
  this._pointer.setFrame(3 * 32, 0, 32, 29);
  this._pointer.x = 32
  this._pointer.anchor.set(0.5, 0.5)
  this._pointer.y = this.height + 5;
  this._pointer.visible = false;
  this.addChild(this._pointer);
};

Scene_OmoriPhotoAlbum.prototype.start = function() {
  this.startFadeIn(this.slowFadeSpeed());
  // If Interface mode is 0 (Placing)
  if (this._interfaceMode === 0) {
    this.startPlacing();
  } else {
    this.startBrowsing();
  }
};

Scene_OmoriPhotoAlbum.prototype.createViewingSprites = function() {
  // Create Viewing Picture
  this._viewingPicture = new Sprite_OmoriAlbumBigPicture();
  this.addChild(this._viewingPicture);
  // Create Viewing Picture Slide
  this._viewingPictureSlide = new Sprite_OmoriAlbumBigPicture();
  this.addChild(this._viewingPictureSlide);


  // this._bigPictureSprite = new Sprite_OmoriAlbumBigPicture();
  // this._bigPictureSprite.x = Graphics.width  / 2;
  // this._bigPictureSprite.y = Graphics.height / 2;
  // this.addChild(this._bigPictureSprite );


  // Get Pointer Bitmap
  var pointerBitmap = ImageManager.loadSystem(ImageManager.ACSImage);
  // Create Box Bitmap
  var boxBitmap = new Bitmap(45, 25);
  boxBitmap.fillAll('rgba(0, 0, 0, 1)')
  boxBitmap.fillRect(1, 1, boxBitmap.width - 2, boxBitmap.height - 2, 'rgba(255, 255, 255, 1)');
  boxBitmap.fillRect(4, 4, boxBitmap.width - 8, boxBitmap.height - 8, 'rgba(0, 0, 0, 1)');

  // // Get Pointer Bitmap
  // var pointerBitmap = ImageManager.loadSystem(ImageManager.ACSImage);
  // // Create Box Bitmap
  // var boxBitmap = new Bitmap(55, 40);
  // boxBitmap.fillAll('rgba(0, 0, 0, 1)')
  // boxBitmap.fillRect(1, 1, boxBitmap.width - 2, boxBitmap.height - 2, 'rgba(255, 255, 255, 1)');
  // boxBitmap.fillRect(4, 4, boxBitmap.width - 8, boxBitmap.height - 8, 'rgba(0, 0, 0, 1)');

  // Create Viewing Picture Left Box
  this._viewingPictureLeftBox = new Sprite(boxBitmap);
  this._viewingPictureLeftBox.x = -this._viewingPictureLeftBox.width;
  this._viewingPictureLeftBox.y = (Graphics.height - this._viewingPictureLeftBox.height - 125) / 2;
  this._viewingPictureLeftBox.opacity = 0;
  this.addChild(this._viewingPictureLeftBox);
  // Create Viewing Picture Box Pointer Sprite
  this._viewingPictureLeftBox._pointerSprite = new Sprite(pointerBitmap);
  this._viewingPictureLeftBox._pointerSprite.x = 4;
  this._viewingPictureLeftBox._pointerSprite.y = -2;
  this._viewingPictureLeftBox._pointerSprite.setFrame(2 * 32, 0, 32, 32);
  this._viewingPictureLeftBox.addChild(this._viewingPictureLeftBox._pointerSprite);

  // Create Viewing Picture Right Box
  this._viewingPictureRightBox = new Sprite(boxBitmap);
  this._viewingPictureRightBox.x = (Graphics.width - this._viewingPictureRightBox.width);
  this._viewingPictureRightBox.y = (Graphics.height - this._viewingPictureRightBox.height - 125) / 2;
  this._viewingPictureRightBox.opacity = 0;
  this.addChild(this._viewingPictureRightBox);
  // Create Viewing Picture Box Pointer Sprite
  this._viewingPictureRightBox._pointerSprite = new Sprite(pointerBitmap);
  this._viewingPictureRightBox._pointerSprite.x = 38;
  this._viewingPictureRightBox._pointerSprite.y = -2;
  this._viewingPictureRightBox._pointerSprite.scale.x = -1;
  this._viewingPictureRightBox._pointerSprite.setFrame(2 * 32, 0, 32, 32);
  this._viewingPictureRightBox.addChild(this._viewingPictureRightBox._pointerSprite);

  // Get Flip Text
  var text = LanguageManager.getPluginText('albumMenu', 'flipText');
  var flipWidth = pointerBitmap.measureTextWidth(text);
  var flipBitmap = new Bitmap(flipWidth + 80, 30);

  flipBitmap.drawInputIcon('shift', 0, 4, false);
  flipBitmap.drawText(text, 0, -5, flipBitmap.width, flipBitmap.height, 'center');
  // flipBitmap.blt(pointerBitmap, 2 * 32, 0, 32, 29, 4, 0)
  // flipBitmap.blt(pointerBitmap, 1 * 32, 0, 32, 29, flipBitmap.width - 36, 0)
  // Create Flip Picture Box
  this._flipPictureBox = new Sprite(flipBitmap)
  this._flipPictureBox.x = (Graphics.width - flipBitmap.width) / 2
  this._flipPictureBox.y = Graphics.height - 30;
  this._flipPictureBox.opacity = 0;
  this.addChild(this._flipPictureBox);
};

Sprite_OmoriPictureAlbum.prototype.createCursorSprites = function() {
  // Get Bitmap
  var bitmap = ImageManager.loadSystem(ImageManager.ACSImage);
  this._cursorSprite = new Sprite_WindowCustomCursor();
  this._cursorSprite.x = -10;
  this._cursorSprite.y = 70;
  // this._cursorSprite.setFrame(32, 0, 32, 29)
  this.addChild(this._cursorSprite);

  // Create Left Page Cursor Sprite
  this._leftPageCursorSprite = new Sprite(bitmap);
  this._leftPageCursorSprite.x = -52;
  this._leftPageCursorSprite.y = 28;
  this._leftPageCursorSprite.setFrame(64, 0, 32, 29);
  this._leftPageCursorSprite.setColorTone([0, 0, 0, 255])
  this.addChild(this._leftPageCursorSprite);

  // Create Right Page Cursor Sprite
  this._rightPageCursorSprite = new Sprite(bitmap);
  this._rightPageCursorSprite.x = 435 + 40;
  this._rightPageCursorSprite.y = this._leftPageCursorSprite.y;
  this._rightPageCursorSprite.setFrame(32, 0, 32, 29);
  this._rightPageCursorSprite.setColorTone([0, 0, 0, 255])
  this.addChild(this._rightPageCursorSprite);

  // Update Page Cursor Visibility
  this.updatePageCursorVisibility();
};

Scene_Sketchbook.prototype.createCursorSprites = function() {
  // Get Cursor Bitmap
  var bitmap = ImageManager.loadSystem(ImageManager.ACSImage);

  this._leftCursorSprite = new Sprite(bitmap);
  this._leftCursorSprite.anchor.set(0.5, 0.5);
  this._leftCursorSprite.setFrame(64, 0, 32, 29);
  this._leftCursorSprite.x = this._backWindow.x - 10;
  this._leftCursorSprite.y = this._backWindow.y + (this._backWindow.height / 2)
  this.addChild(this._leftCursorSprite);

  this._rightCursorSprite = new Sprite(bitmap);
  this._rightCursorSprite.anchor.set(0.5, 0.5);
  this._rightCursorSprite.setFrame(32, 0, 32, 29);
  this._rightCursorSprite.x = this._backWindow.x + this._backWindow.width + 10;
  this._rightCursorSprite.y = this._backWindow.y + (this._backWindow.height / 2)
  this.addChild(this._rightCursorSprite);
};

Window_Selectable.prototype.customCursorRectBitmapName = function() { return ImageManager.cursorImage; }

Sprite_WindowCustomCursor.prototype.setupBitmap = function(name) {
  // Set Bitmap
  this.bitmap = ImageManager.loadSystem(name === undefined ? ImageManager.cursorImage : name);
};

Scene_Gameover.prototype.createRetryWindows = function() {
  // Initialize Retry Windows Array
  this._retryWindows = [];
  // List of text
  let text = [LanguageManager.getMessageData("XX_SYSTEM.message_10").text, LanguageManager.getMessageData("XX_SYSTEM.message_11").text];
  // Go Through Text
  for (let i = 0; i < text.length; i++) {
    let win = new Window_Base(0, 0, 0, 0);
    win.standardPadding = function() { return 4; };
    win.initialize(0, 0, win.contents.measureTextWidth(text[i]) + win.standardPadding() * 4, 32)
    win.contents.fontSize = 26;

    win.x = Math.floor(Graphics.boxWidth / 2.6) + i * 100
    win.y = 380;
    win.drawOpacity = 0;
    win.opacity = 0;
    win.textToDraw = text[i];
    win.update = function(animPhase) {
      if (animPhase == 2) {
        if(!this.parent._retryQuestion.isTextComplete()) {return;}
        if (this.drawOpacity < 255) {
          this.contents.clear();
          this.drawOpacity += 2;
          this.opacity += 2;
          this.contents.paintOpacity = this.drawOpacity;
          win.contents.drawText(this.textToDraw, 0, -4, this.contents.width, this.contents.height, 'center');
        }
      } else if (animPhase == 4) {
        this.contents.clear();
        this.drawOpacity -= 4;
        this.opacity -= 4;
        this.contents.paintOpacity = this.drawOpacity;
        win.contents.drawText(this.textToDraw, 0, -4, this.contents.width, this.contents.height, 'center');
      }
    };
    this._retryWindows.push(win);
    this.addChild(win);
  };
  // Set Max Input
  this._inputData.max = text.length;
  // Create Retry Cursor Sprite
  this._retryCursorSprite = new Sprite_WindowCustomCursor(undefined, ImageManager.cursorImage);
  this._retryCursorSprite.opacity = 0;
  this.addChild(this._retryCursorSprite);
};

Window_Message.prototype._refreshPauseSign = function() {
  this._windowPauseSignSprite.bitmap = ImageManager.loadSystem(ImageManager.cursorImage);
  this._windowPauseSignSprite.anchor.x = 0.5;
  this._windowPauseSignSprite.anchor.y = 1;
  this._windowPauseSignSprite.alpha = 0;
  // Move Window Pause Sign Sprite
  this._windowPauseSignSprite.move(this._width - 40, this._height - 10);
};

let old_updateBackground = Window_ChoiceList.prototype.updateBackground;
Window_ChoiceList.prototype.updateBackground = function() {
  old_updateBackground.call(this);

  let newbitmap = ImageManager.loadSystem(ImageManager.cursorImage);
  newbitmap.addLoadListener(() => {
    this._customCursorRectSprite.bitmap = newbitmap
    this._customCursorRectSprite.setFrame(0, 0, newbitmap.width, newbitmap.height);
  })
  
}