//=============================================================================
 /*:
 * @plugindesc Edits to the album plugin
 * @author FruitDragon
 * 
 * @help
 * Add <AlbumText2:yaml.messageId> to any polaroid to have it play a second
 * line of text after the first. 
 * 
 * Helpful if you want the name box to change.
 */
//=============================================================================

//=============================================================================
// * Prepare
//=============================================================================
Scene_OmoriPhotoAlbum.prototype.prepare = function(item, interfaceMode = 0, requiredAmount = 0, page = 1) {
  // Set Required Amount
  this._requiredPictures = requiredAmount;
  // Set Interface Mode
  this._interfaceMode = interfaceMode;
  // Set Starting Page
  this._startingPage = page - 1;
  // Initialize Album Data
  this._albumData = {id: item.id};
  // Set Album Data Properties
  this._albumData.maxPages = Number(item.meta.AlbumMaxPages);
  this._albumData.maxImages = Number(item.meta.AlbumMaxPictures);
  this._albumData.group = item.meta.AlbumGroup.trim();
  this._albumData.bookImageName = item.meta.AlbumBookImage.trim();
  this._albumData.bookCoverImageName = item.meta.AlbumBookCoverImage.trim();
  this._albumData.pageTextImageName = item.meta.AlbumTextPageImage.trim();
  this._albumData.backgroundName = item.meta.AlbumBackground.trim();
  this._albumData.backgroundParallax = item.meta.AlbumParallax.trim();
  this._albumData.backgroundParallaxSpeed = new Point(Number(item.meta.ParallaxSpeedX), Number(item.meta.ParallaxSpeedY));
  this._albumData.defaultBackImageName = item.meta.AlbumDefaultBackImage.trim();

  // Initialize Picture Array
  var pictures = [];
  for (var i = 0; i < this._albumData.maxPages; i++) {
    // Get Data
    var data = item.meta["AlbumPage" + (i + 1) + "Pictures"]
    // If Data Exist
    if (data) {
      // Get Ids
      var ids = data.split(',').map(function(id) { return Number(id) });
      // Join ID's to Pictures Array
      pictures = pictures.concat(ids);
    } else {
      // Add Empty List
      pictures = pictures.concat([0, 0, 0, 0, 0, 0]);
    };
  };

  // Randomize Album Picture Positions
  $gameParty.randomizeAlbumPicturePositions(this._albumData.group, pictures);

  // // For testing remove when done
  // for (var i = 0; i < pictures.length; i++) {
  //   if (i > 0) {
  //     $gameParty.addPictureToAlbum(this._albumData.group, i, pictures[i]);
  //   };
  // };


  // Set album Pictures Array
  this._albumData.pictures = pictures;
  // Initialize Album Items
  this._albumData.albumItems = [];
  // Get Items
  var items = $gameParty.items().filter(function(item) { return item.meta.AlbumGraphicsName; }, this);

  // Atlas Checks Types
  var atlasChecks = ['thumbnailName', 'graphicsName', 'backGraphicsName'];
  // Go Through Items
  for (var i = 0; i < items.length; i++) {
    // Get Item
    var item = items[i];
    // Item Data
    var data = { id: item.id, group: item.meta.AlbumGroup.trim(), graphicsName: item.meta.AlbumGraphicsName.trim(),   thumbnailName: item.meta.AlbumThumbnailName.trim(), text: item.meta.AlbumText.trim(), };
    if (item.meta.AlbumText2) {
      data.text2 = item.meta.AlbumText2.trim()
    }

    if (item.meta.AlbumPlacingMessage) { data.placingMessage = item.meta.AlbumPlacingMessage.trim(); };
    // If Item has Back Graphics name
    if (item.meta.AlbumBackGraphicsName) {
      // Set Back Graphics Name
      data.backGraphicsName = item.meta.AlbumBackGraphicsName.trim();
    } else {
      // Set it from default back image name
      data.backGraphicsName = this._albumData.defaultBackImageName;
    };
    // If Group Matches Album group add it to item list
    if (data.group === this._albumData.group) { this._albumData.albumItems.push(data); };
    // Go Through atlas checks
    for (var i2 = 0; i2 < atlasChecks.length; i2++) {
      // Get Check Name
      var checkName = atlasChecks[i2];
      // Get Bitmap Name
      var bitmapName = '%1_%2'.format(data.group, data[checkName])
      // Get Atlas Path
      var atlasPath = 'img/pictures/' + bitmapName + '.png';
      // Get Atlas Name
      var atlasName = AtlasManager.getImageAtlasName(atlasPath);
      // If Atlas name exists
      if (atlasName) { this.addRequiredAtlas(atlasName); }
    };

    // // // FOR TESTING REMOVE WHEN DONE
    // if (i > -1 && data.group === this._albumData.group) {
    //   // Add Picture to album
    //   $gameParty.addPictureToAlbum(data.group, i, data.id);
    // };
  };

  // Load Background Images
  if (this._albumData.backgroundParallax) { ImageManager.loadPicture('%1_%2'.format(this._albumData.group, this._albumData.backgroundParallax)) };
  if (this._albumData.backgroundName) { ImageManager.loadPicture('%1_%2'.format(this._albumData.group, this._albumData.backgroundName)); };


  // Go Through Max Pages
  for (var i = 0; i < this._albumData.maxPages; i++) {
    // Get Bitmap Name
    var bitmapName = '%1_%2'.format(this._albumData.group, this._albumData.pageTextImageName + (i + 1));
    // // Get Bitmap
    // var bitmap = ImageManager.reservePicture(bitmapName, 0, this._imageReservationId);
    // Get Atlas Path
    var atlasPath = 'img/pictures/' + bitmapName + '.png';
    // Get Atlas Name
    var atlasName = AtlasManager.getImageAtlasName(atlasPath);
    // If Atlas name exists
    if (atlasName) { this.addRequiredAtlas(atlasName); }
  };
  // Add Required Atlas
  this.addRequiredAtlas('PhotoAlbumCovers'); 
  // Load Input Icons
  ImageManager.loadInputIcons();
  // Reserve Bitmap
  ImageManager.reserveSystem('ACSArrows', 0, this._imageReservationId);
};

Scene_OmoriPhotoAlbum.prototype.hasComment2 = function(picture) {
  if(!picture) {return false;}
  if(!picture.text2) {return false;}
  let data = LanguageManager.getMessageData(picture.text2)
  return data.text2 !== "...";
}

//=============================================================================
// * Frame Update
//=============================================================================
Scene_OmoriPhotoAlbum.prototype.update = function() {
  // Super Call
  Scene_BaseEX.prototype.update.call(this);
  // Update Parallax Movement
  this.updateParallaxMovement();
  // Return if all input is being blocked
  if (this._blockAllInput) { return; }
  if(!!this._closedAlbumSprite.visible) {
    if(Input.isTriggered("ok") || Input.isTriggered("cancel")) {
      this._blockAllInput = true;
      this.queue('startFadeOut', 30, false)
      this.queue('wait', 30);
      this.queue(() => this.popScene());
      return Input.clear();
    }
  }


  // If Viewing Message
  if (this._viewingMessage) {
    // End Message
    if (!$gameMessage.isBusy()) { this.endMessage(); };
    return;
  } else if (this._placingMode) {
    // Update Picture Placgin
    this.updatePicturePlacing();
    return
  } else if (this._browsingMode) {
    // If Shift is triggered
    if (Input.isTriggered('shift')) {
      // Get Picture at index
      var picture = this._albumSprite.picture();
      var temp = []
      // If Picture exists
      if (picture && !!this.hasComment(picture)) {
        // Start Message
        //this.startMessage(picture.text)
        temp.push(picture.text)
        
      };
      if (picture && !!this.hasComment2(picture)) {
        //this.startMessage(picture.text2)
        temp.push(picture.text2)
      }
      temp.forEach(function(message) {
        this.queue(function() {
          // Start Message
          this.startMessage(message);
        }.bind(this))

        // Wait
        this.queue('setWaitMode', 'message');
      }, this);
      return
      
    };
    // If Cancel is triggered
    if (Input.isTriggered('cancel')) {
      // If moving return
      if (this.move.isMoving()) { return; }
      // Block all input
      this._blockAllInput = true;
      // Pop scene
      this.popScene();
      return;
    };
    // If Ok is triggered
    if (Input.isTriggered('ok')) {
      // Get Picture at index
      var picture = this._albumSprite.picture();
      // If Picture Exists
      if (picture) {
        // Start Viewing Picture
        this.startViewingPicture();
      };
      return;
    };
  } else if (this._viewingMode) {
    // Update Viewing Mode
    this.updateViewingMode();
  } else {

    // If Cancel is triggered
    if (Input.isTriggered('cancel')) {
      // If moving return
      if (this.move.isMoving()) { return; }
      // Get Album Size
      var albumSize = $gameParty.albumSize(this._albumData.group);
      if (albumSize < this._requiredPictures) { return; }

      this._albumPictureListWindow.deactivate();
      this._blockAllInput = true;
      // Start Fadeout
      this.queue('startFadeOut', 30, false)
      this.queue('wait', 30);
      this.queue('popScene');
      return;
    };
  }
};


//=============================================================================
// * Update Viewing Mode
//=============================================================================
Scene_OmoriPhotoAlbum.prototype.updateViewingMode = function() {

  /*if (this._flipShowDelay > 0) { this._flipShowDelay--; }
  if (this._flipShowDelay === 0) {
    var duration = 10;
    var obj = this._flipPictureBox
    var data = { obj: obj, properties: ['opacity'], from: {opacity: obj.opacity}, to: {opacity: 0}, durations: {opacity: duration}}
    data.easing = Object_Movement.easeInCirc;
    this.move.startMove(data);
    // Set Flip Show Delay to minus 1
    this._flipShowDelay = -1;
  };*/


  // If not moving
  if (!this.move.isMoving() && !this._viewingPicture.isFlipping()) {
    // If Shift is triggered
    if (Input.isTriggered('shift')) {
      // Get Page max and page
      var pageMax = this._albumSprite.maxPagePictures();
      var page = Math.floor(this._viewingIndex / pageMax);
      // Set Page
      this._albumSprite._page = page;
      this._albumSprite._index = this._viewingIndex % pageMax;
      // Get Picture at index
      var picture = this._albumSprite.picture();
      // If Picture exists
      // If Picture exists
      var temp = []
      if (picture && !!this.hasComment(picture)) {
        // Start Message
        //this.startMessage(picture.text)
        temp.push(picture.text)
        
      };
      if (picture && !!this.hasComment2(picture)) {
        //this.startMessage(picture.text2)
        temp.push(picture.text2)
      }
      temp.forEach(function(message) {
        this.queue(function() {
          // Start Message
          this.startMessage(message);
        }.bind(this))

        // Wait
        this.queue('setWaitMode', 'message');
      }, this);
      return
    };


    // If Left Input
    if (Input.isRepeated('left')) {
      this.showPrevViewingPicture();
      // Start Toggle Flip
      // this._viewingPicture.startToggleFlip();
      return
    };
    // If Right Input
    if (Input.isRepeated('right')) {
      // Start Toggle Flip
      this.showNextViewingPicture();
    //  this._viewingPicture.startToggleFlip();
      return
    };

    // If Left Input
    if (Input.isRepeated('up')) {
    //  this.showPrevViewingPicture();
      return
    };
    // If Right Input
    if (Input.isRepeated('down')) {
  //    this.showNextViewingPicture();
      return
    };

    // If Cancelled
    if (Input.isTriggered('cancel')) {
      // End Picture Viewing
      this.endViewingPicture();
      return;
    };
  };
};