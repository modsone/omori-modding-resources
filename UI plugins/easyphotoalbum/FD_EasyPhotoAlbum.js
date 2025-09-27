//=============================================================================
// ★ FD_EasyPhotoAlbum ★                                        1.0.0
//=============================================================================
/*:
 * @plugindesc v1.0.0 A plugin for easier and more customizable Photo Album.
 * @author FruitDragon
 * 
 * @help
 * ★ FD_EasyPhotoAlbum ★                                        1.0.0
 * --------------------------------------------------------------------------
 * 
 * Overwites the Omori Photo Album.js plugin. This plugin must be placed 
 * anywhere underneath it in the plugin list.
 * 
 * This plugin will not affect any albums set up with the base game method.
 * They will remain untouched.
 * 
 * For a guide on how to use the plugin, please read album_template.yaml. You 
 * can use this yaml to set your own up, or make a copy. Both work.
 * 
 * Put the name of the yaml that your albums will be defined in over in the 
 * albumCodeFile plugin parameter.
 * 
 * Ex: album_template
 * 
 * If you encounter any bugs or have a request for more features, please let 
 * FruitDragon on the modding hub know. Thanks for using the plugin!
 * 
 * --------------------------------------------------------------------------
 * Changelog:
 * 
 * v1.0.0 Finished plugin!
 * 
 * --------------------------------------------------------------------------
 * 
 * @param albumCodeFile
 * @type
 * @default album_template
 * @desc The name of the yaml that defines the photo album.
 * 
 */

var Imported = Imported || {};
Imported.FD_EasyPhotoAlbum = true;

var FD = FD || {};
FD.EasyPhotoAlbum = FD.EasyPhotoAlbum || {};
FD.EasyPhotoAlbum.Param = PluginManager.parameters('FD_EasyPhotoAlbum');


EPA = FD.EasyPhotoAlbum

EPA.yaml = EPA.Param["albumCodeFile"]
EPA.placingMode = false
EPA.currentID = 0


// $gameParty.gainItem(item, amount);

FD.EasyPhotoAlbum.GameInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function (command, args) {
    if (command.toLowerCase() != "photoalbum") {
        FD.EasyPhotoAlbum.GameInterpreter_pluginCommand.call(this, command, args);
			return;
    }
    temp = args.shift();
	switch (temp.toLowerCase()) {
        case 'view':
            // PhotoAlbum modify 889
            // PhotoAlbum view 889 
            this.viewAlbum(args);
            return;
        case 'modify':
            this.modifyAlbum(args);
            return;
		default:
			FD.EasyPhotoAlbum.GameInterpreter_pluginCommand.call(this, command, args);
			return;
	}
};


Scene_OmoriPhotoAlbum.prototype.preloadImages = function() {
  if (this._albumData.EPA) {
    ImageManager.reservePicture(this._albumData.bookImageName)
    ImageManager.reservePicture(this._albumData.bookCoverImageName)
    for (var i = 0; i < this._albumData.maxPages; i++) {
      ImageManager.reservePicture(`${this._albumData.pageTextImageName}${i+1}`)
    }
  }
}


Game_Interpreter.prototype.viewAlbum = function(args) {
    id = Number(args.shift());
    this.callAlbumMenu(id, 1);
}

Game_Interpreter.prototype.modifyAlbum = function(args) {
    id = Number(args.shift());
    this.callAlbumMenu(id, 0);
}



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

    if (item.meta.Album) {this._albumData.EPA = true} else {this._albumData.EPA = false}
    album = this._albumData

    //loads the information from the yaml
    EPA.itemData = album.EPA ? LanguageManager.getTextData(`${EPA.yaml}`, item.meta.Album) : {}

    album.group = this._albumData.EPA ? item.meta.Album.trim() : item.meta.AlbumGroup.trim();
    groupID = (`${EPA.yaml}.${this._albumData.group}`)

    album.maxPages = album.EPA ? Number(EPA.itemData.maxPages) : Number(item.meta.AlbumMaxPages);
    album.maxImages = album.EPA ? Number(EPA.itemData.maxPictures) : Number(item.meta.AlbumMaxPictures);
    album.bookImageName = album.EPA ? EPA.itemData.bookImage : item.meta.AlbumBookImage.trim();
    album.bookCoverImageName = album.EPA ? EPA.itemData.bookCoverImage : item.meta.AlbumBookCoverImage.trim();
    album.pageTextImageName = album.EPA ? EPA.itemData.textPageImage : item.meta.AlbumTextPageImage.trim();
    album.backgroundName = album.EPA ? EPA.itemData.albumBackground : item.meta.AlbumBackground.trim();
    album.backgroundParallax = album.EPA ? EPA.itemData.albumParallax.image : item.meta.AlbumParallax.trim();
    album.backgroundParallaxSpeed = album.EPA ? new Point(Number(EPA.itemData.albumParallax.speedX), Number(EPA.itemData.albumParallax.speedY)) : new Point(Number(item.meta.ParallaxSpeedX), Number(item.meta.ParallaxSpeedY));
    album.defaultBackImageName = album.EPA ? EPA.itemData.defaultBackImage || "Dreamworld_AlbumPictureBack": item.meta.AlbumDefaultBackImage.trim();
    album.lockEmptyPages = album.EPA ? EPA.itemData.lockEmptyPages || false : false

    this.preloadImages()
    // Initialize Picture Array
    var pictures = [];
    for (var i = 0; i < this._albumData.maxPages; i++) {
        // Get Data
        var data = album.EPA ? EPA.itemData.pages[i+1] : item.meta["AlbumPage" + (i + 1) + "Pictures"]
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



    // Set album Pictures Array
    this._albumData.pictures = pictures;
    // Initialize Album Items
    this._albumData.albumItems = [];
    // Get Items
    //var items = $gameParty.items().filter(function(item) { return item.meta.AlbumGraphicsName; }, this);
    // gets all items currently in inventory that have tags that are only specific to polaroids
    var items = $gameParty.items().filter(function(item) { return item.meta.Polaroid || item.meta.AlbumGraphicsName; }, this);
    
    // Atlas Checks Types
    var atlasChecks = ['thumbnailName', 'graphicsName', 'backGraphicsName'];
    // Go Through Items
    for (var i = 0; i < items.length; i++) {
        // Get Item
        var data = {}
        //EPA.photoData = {}
        var item = items[i];
        data.id = item.id
        data.EPA = item.meta.Polaroid ? true : false
        data.group = data.EPA ? item.meta.Polaroid.trim() : item.meta.AlbumGroup.trim();

        if (data.group != album.group) {
            //console.log(`Polaroid ID '${data.group}' not matching with album ID '${album.group}'`)
        } 
        else {
            EPA.photoData = data.EPA ? EPA.itemData[data.id] : {};
            
            data.thumbnailName = data.EPA ? EPA.photoData.thumbnail : item.meta.AlbumThumbnailName.trim();
            data.graphicsName = data.EPA ? EPA.photoData.image : item.meta.AlbumGraphicsName.trim();
            data.text = data.EPA ? EPA.photoData.text : item.meta.AlbumText.trim();
            if (data.text && data.text.contains(",")) {
                data.textlist = data.text.split(',');
            };

            if (EPA.photoData.wait) {
                data.wait = Number(EPA.itemData[data.id].wait)
            };

            if (EPA.photoData.placingMessage || item.meta.AlbumPlacingMessage) { 
                data.placingMessage = data.EPA ? EPA.photoData.placingMessage : item.meta.AlbumPlacingMessage.trim(); 
            };

            if (EPA.photoData.backImage || item.meta.AlbumBackGraphicsName) {
                // Set Back Graphics Name
                data.backGraphicsName = data.EPA ? EPA.photoData.backImage : item.meta.AlbumBackGraphicsName.trim();
            } else {
                // Set it from default back image name
                data.backGraphicsName = this._albumData.defaultBackImageName;
            };
        }

        // If Group Matches Album group add it to item list
        if (data.group === this._albumData.group) { this._albumData.albumItems.push(data); };
        // Go Through atlas checks
        for (var i2 = 0; i2 < atlasChecks.length; i2++) {
            // Get Check Name
            var checkName = atlasChecks[i2];
            // Get Bitmap Name
            var bitmapName = album.EPA ? `${data[checkName]}` : '%1_%2'.format(data.group, data[checkName])
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
    if (this._albumData.backgroundParallax) { 
        album.EPA ? ImageManager.loadPicture(album.backgroundParallax) : ImageManager.loadPicture('%1_%2'.format(this._albumData.group, this._albumData.backgroundParallax)) 
    };
    if (this._albumData.backgroundName) { 
        album.EPA ? ImageManager.loadPicture(album.backgroundName) : ImageManager.loadPicture('%1_%2'.format(this._albumData.group, this._albumData.backgroundName)); 
    };


    // Go Through Max Pages
    for (var i = 0; i < this._albumData.maxPages; i++) {
        // Get Bitmap Name
        var bitmapName = album.EPA ? `${album.pageTextImageName}${i+1}` : '%1_%2'.format(this._albumData.group, this._albumData.pageTextImageName + (i + 1));
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
      //console.log(picture)
      var temp = []
      // If Picture exists
      if (picture && !!this.hasComment(picture)) {
        // Start Message
        //this.startMessage(picture.text)
        if (picture.textlist) {
            for (var i = 0; i < picture.textlist.length; i++) {
                temp.push(picture.textlist[i].trim())
            }
        } else {
            temp.push(picture.text.trim())
        }
        
      };
      
      //EPA.viewingMessage = true
      counter = 1

      this._blockAllInput = true
      temp.forEach(function(message) {
        
        this.queue(function() {
          // Start Message
          this.startMessage(message);
        }.bind(this))
        
        // Wait
        this.queue('setWaitMode', 'message');
        if (picture.wait && counter < temp.length) {
            this.queue('wait', picture.wait);
        }
        counter++
      }, this);
      this.queue(function() {
        this._blockAllInput = false;

        console.log("done viewing")
      }.bind(this))
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

Sprite_OmoriPictureAlbum.prototype.picture = function(index = this._index, page = this._page) {
  // Get Page Index
  var pageIndex = (page * this.maxPagePictures()) + index;
  // Get Item ID
  var itemId = $gameParty.getAlbumPictureAtIndex(this._albumData.group, pageIndex);
  // If Item ID exists
  if (itemId) {
    // Find Item Data in Array
    return this._albumData.albumItems.find(function(item) { return item.id === itemId; })
  };
  // Return Null
  return null;
};

Scene_OmoriPhotoAlbum.prototype.hasComment = function(picture) {
  if(!picture) {return false;}
  if(!picture.text) {return false;}
  bool = true
  if (picture.textlist) {
    for (var i = 0; i < picture.textlist.length; i++) {
        data = LanguageManager.getMessageData(picture.textlist[i].trim());
        bool = data.text !== "..."
    }
  } else {
    data = LanguageManager.getMessageData(picture.text)
    bool = data.text !== "..."
  }
  
  return bool
}

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
      // Get Picture at index
      var pageMax = this._albumSprite.maxPagePictures();
      var page = Math.floor(this._viewingIndex / pageMax);
      // Set Page
      this._albumSprite._page = page;
      this._albumSprite._index = this._viewingIndex % pageMax;

      var picture = this._albumSprite.picture();
      //console.log(picture)
      var temp = []
      // If Picture exists
      if (picture && !!this.hasComment(picture)) {
        // Start Message
        //this.startMessage(picture.text)
        if (picture.textlist) {
            for (var i = 0; i < picture.textlist.length; i++) {
                temp.push(picture.textlist[i].trim())
            }
        } else {
            temp.push(picture.text.trim())
        }
        
      };
      
      //EPA.viewingMessage = true
      counter = 1

      this._blockAllInput = true
      temp.forEach(function(message) {
        
        this.queue(function() {
          // Start Message
          this.startMessage(message);
        }.bind(this))
        
        // Wait
        this.queue('setWaitMode', 'message');
        if (picture.wait && counter < temp.length) {
            this.queue('wait', picture.wait);
        }
        counter++
      }, this);
      this.queue(function() {
        this._blockAllInput = false;

        console.log("done viewing")
      }.bind(this))
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



Scene_OmoriPhotoAlbum.prototype.createBackground = function() {
  // Create Background Parallax
  this._backgroundParallax = new TilingSprite();
  this._backgroundParallax.move(0, 0, Graphics.width, Graphics.height);
  this.addChild(this._backgroundParallax)
  if (this._albumData.backgroundParallax) { 
    let bitmap = this._albumData.EPA ? ImageManager.loadPicture(this._albumData.backgroundParallax) : ImageManager.loadPicture('%1_%2'.format(this._albumData.group, this._albumData.backgroundParallax));
    
    bitmap.addLoadListener(() => this._backgroundParallax.bitmap = bitmap) 
  };
  // Create Background Sprite
  this._backgroundSprite = new Sprite();
  this.addChild(this._backgroundSprite);
  if (this._albumData.backgroundName) { 
    let bitmap = this._albumData.EPA ? ImageManager.loadPicture(this._albumData.backgroundName) : ImageManager.loadPicture('%1_%2'.format(this._albumData.group, this._albumData.backgroundName));
    bitmap.addLoadListener(() => this._backgroundSprite.bitmap =  bitmap);
  };
  
};

//=============================================================================
// * Create Picture Album
//=============================================================================
Scene_OmoriPhotoAlbum.prototype.createPictureAlbum = function() {
  // Create Album Sprite
  this._albumSprite = new Sprite_OmoriPictureAlbum(this._albumData, this._startingPage);
  this._albumSprite.x = (Graphics.width - 453) / 2;
  this._albumSprite.y = ((Graphics.height - 320) / 2) - 65;
  this._albumSprite.deactivate();
  this.addChild(this._albumSprite);
  // Create Closed Album Sprite
  this._closedAlbumSprite = this._albumData.EPA ? new Sprite(ImageManager.loadPicture(this._albumData.bookCoverImageName)) : new Sprite(ImageManager.loadPicture('%1_%2'.format(this._albumData.group, this._albumData.bookCoverImageName)))
  this._closedAlbumSprite.anchor.set(0.5, 0.5)
  this._closedAlbumSprite.x = Graphics.width / 2;
  this._closedAlbumSprite.y = Graphics.height / 2;
  this._closedAlbumSprite.visible = false;
  this.addChild(this._closedAlbumSprite);
};

//=============================================================================
// * Update Cursor Input
//=============================================================================
Sprite_OmoriPictureAlbum.prototype.updateCursorInput = function() {
  // Return if nto active
  if (!this._active || this.move.isMoving()) { return; }
  // If Input Page Up is repeated
  if (Input.isRepeated('pageup')) {
    // Turn Page Right
    var oldPage = this._page;
    var page = (this._page - 1).clamp(0, this.maxPages());
    if(oldPage !== page) {this.hidePictureBorder();}
    this.turnPageRight();
    return;
  };
  // If Input Page Down is repeated
  if (Input.isRepeated('pagedown')) {
    // Turn Page Left
    var oldPage = this._page;
    var page = (this._page - 1).clamp(0, this.maxPages());
    if(oldPage !== page) {this.hidePictureBorder();}
    this.turnPageLeft();

    return;
  };
  // If Input Down is repeated
  if (Input.isRepeated('down')) {
    // If Index is 2 or 5
    if (this._index === 2 || this._index >= 5) { return; }
      // Get Page Index
      var pageIndex = (this._page * this.maxPagePictures()) + this._index;
      // If Less Than Max Images
      if (pageIndex < this._albumData.maxImages) {
        // Play cursor
        SoundManager.playCursor();
        // Increase Index
        this._index++;
        // Update Cursor Position
        this.updateCursorPosition();
      };
    return;
  };

  // If Input Up is repeated
  if (Input.isRepeated('up')) {
    // If Index is 0 or 3
    if (this._index === 0 || this._index === 3) { return; }
    // Play Cursor Sound
    SoundManager.playCursor();

    // Decrease Index
    this._index--;

    // Update Cursor Position
    this.updateCursorPosition();
    return;
  };

  // If Input Right is repeated
  if (Input.isRepeated('right')) {
    // Get Page Index
    var pageIndex = (this._page * this.maxPagePictures()) + this._index;
    // If Index is 4
    if (this._index === 4) {
      // Turn Page Left
      this.turnPageLeft();
      return;
    };
    // If Index is less than 3
    if (this._index < 3) {
      // If Less Than Max Images
      if (pageIndex + 3 <= this._albumData.maxImages) {
        // Increase Index
        this._index += 3;
      };
    } else {
      // If Less Than Max Images
      if (this._albumData.maxImages > 4) {
        // Set index to 4
        this._index = 4;
      };
    };
    // Play Cursor Sound
    SoundManager.playCursor();          
    // Update Cursor Position
    this.updateCursorPosition();
    return;
  };

  // If Input Left is repeated
  if (Input.isRepeated('left')) {
    if ([0, 2].contains(this._index)) {
      // Turn Page Right
      this.turnPageRight();
      return;
    };
    // Decrease Index
    this._index -= this._index === 1 ? 1 : 3;
    // Play Cursor Sound
    SoundManager.playCursor();      
    
    // Update Cursor Position
    this.updateCursorPosition();
    return;
  };
};


//=============================================================================
// * Make Page Bitmap
//=============================================================================
Sprite_OmoriPictureAlbum.prototype.makePageBitmap = function(side) {
  // Create Bitmap
  var bitmap = new Bitmap(this._pageSprite.width, this._pageSprite.height)
  // Get Contents
  var contents = this._contentsSprite.bitmap;
  // Get Page Bitmap
  var pageBitmap = this._backgroundSprite.bitmap;
  // Get Starting X
  var sx = bitmap.width * side;
  // If Side is 0
  if (side === 0) {
    bitmap.blt(pageBitmap, sx + 2, 2, bitmap.width - 2, bitmap.height - 4, 2, 2);
  } else {
    bitmap.blt(pageBitmap, sx, 2, bitmap.width - 2, bitmap.height - 4, 0, 2);
  };
  // Transfer Contents to bitmap
  bitmap.blt(contents, sx, 0, bitmap.width, bitmap.height, 0, 0);
  // Return Bitmap
  return bitmap;
};

//=============================================================================
// * Update Picture Border Visibility
//=============================================================================
Sprite_OmoriPictureAlbum.prototype.updatePictureBorderVisibility = function() {
  // Get Picture
  var picture = this._placingPicture;

  if (picture) {
    // Get Max Page Pictures
    var maxPagePics = this.maxPagePictures();
    var startIndex = this._page * maxPagePics
    // Hide Border Flag
    var hideBorder = true;
    // Iterate to Max Page Pictures
    for (var i = 0; i < maxPagePics; i++) {
      // Get Picture ID at position
      var positionId = this._albumData.pictures[startIndex + i];
      // If Position ID matches the picture ID
      if (positionId === picture.id) {
        // Show Picture Border
        this.showPictureBorder(i);
        // Hide Border
        hideBorder = false;
        break;
      };
    };
    // Hide Picture Border
    if (hideBorder) { this.hidePictureBorder(); };
  } else {
    // Hide Picture Border
    this.hidePictureBorder();
  }
};

//=============================================================================
// * Show Viewing Picture
//=============================================================================
Scene_OmoriPhotoAlbum.prototype.startViewingPicture = function() {
  // Set Duration
  var duration = 25;
  // Get Picture at index
  var picture = this._albumSprite.picture();
  // Set viewing mode to true
  this._viewingMode = true;
  // Set Browsing mode to false
  this._browsingMode = false;
  // Set Viewing Index
  this._viewingIndex = (this._albumSprite._page * this._albumSprite.maxPagePictures()) + this._albumSprite._index;
  // Set Flip Delay Count
  this._flipShowDelay = -1;

  // Setup Viewing Picture Bitmaps
  this._viewingPicture._facing = 0;
  this._viewingPicture.setupBitmaps(
    picture.EPA ? ImageManager.loadPicture(picture.graphicsName) : ImageManager.loadPicture('%1_%2'.format(this._albumData.group, picture.graphicsName)), 
    picture.EPA ? ImageManager.loadPicture(picture.backGraphicsName) : ImageManager.loadPicture('%1_%2'.format(this._albumData.group, picture.backGraphicsName))
    );
  this._viewingPicture.x = (Graphics.width / 2)
  this._viewingPicture.y = Graphics.height + (this._viewingPicture.height / 2);
  // Deactivate album
  this._albumSprite.deactivate();

  var obj = this._viewingPicture;
  var data = { obj: obj, properties: ['x', 'y', 'opacity'], from: {x: obj.x, y: obj.y, opacity: obj.opacity}, to: {x: Graphics.width / 2, y: Graphics.height / 2, opacity: 255}, durations: {x: duration, y: duration, opacity: duration}}
  data.easing = Object_Movement.easeOutCirc;
  this.move.startMove(data);

  duration = 15;
  var obj = this._albumSprite;
  // var data = { obj: obj, properties: ['opacity'], from: {opacity: obj.opacity}, to: {opacity: 0}, durations: {opacity: duration}}
  var data = { obj: obj, properties: ['y', 'opacity'], from: {y: obj.y, opacity: obj.opacity}, to: {y: Graphics.height , opacity: 0}, durations: {y: duration, opacity: duration}}
  data.easing = Object_Movement.easeInCirc;
  this.move.startMove(data);

  duration = 25;
  var obj = this._legendWindow;
  var data = { obj: obj, properties: ['y', 'opacity', 'contentsOpacity'], from: {y: obj.y, opacity: obj.opacity, contentsOpacity: obj.contentsOpacity}, to: {y: -obj.height, opacity: 0, contentsOpacity: 0}, durations: {y: duration, opacity: duration, contentsOpacity: duration}}
  data.easing = Object_Movement.easeOutCirc;
  this.move.startMove(data);

  if(!!this.hasComment(picture)) {
    duration = 25;
    var obj = this._flipPictureBox
    var data = { obj: obj, properties: ['opacity'], from: {opacity: obj.opacity}, to: {opacity: 255}, durations: {opacity: duration}}
    data.easing = Object_Movement.easeInCirc;
    this.move.startMove(data);
  }




  if (this.previousViewingPictureExists()) {
    var obj = this._viewingPictureLeftBox;
    var data = { obj: obj, properties: ['x', 'opacity'], from: {x: obj.x, opacity: obj.opacity}, to: {x: 80, opacity: 255}, durations: {x: duration, opacity: duration}};
    data.easing = Object_Movement.easeOutCirc;
    this.move.startMove(data);
  };


  if (this.nextViewingPictureExists()) {
    var obj = this._viewingPictureRightBox;
    var data = { obj: obj, properties: ['x', 'opacity'], from: {x: obj.x, opacity: obj.opacity}, to: {x: (Graphics.width - obj.width) - 80, opacity: 255}, durations: {x: duration, opacity: duration}};
    data.easing = Object_Movement.easeOutCirc;
    this.move.startMove(data);
  };
};

//=============================================================================
// * Show Next Picture
//=============================================================================
Scene_OmoriPhotoAlbum.prototype.showNextViewingPicture = function(duration) {
  // Get Next Picture
  var nextPicture;
  // Get Max Per Page
  var maxPerPage = this._albumSprite.maxPagePictures();



  // Go Through Pictures
  for (var i = this._viewingIndex + 1; i <= this._albumData.maxImages; i++) {
    // Get Page Index
    var pageIndex = i % maxPerPage;
    // Get Page
    var page = Math.floor(i / maxPerPage);
    // Get Picture
    var picture = this._albumSprite.picture(pageIndex, page);
    // If Picture
    if (picture) {
      // Set Next Picture
      nextPicture = picture;
      // Set Viewing Index
      this._viewingIndex = i;
      break
    };
  };

  console.log(picture)

  if (this.nextViewingPictureExists()) {
    // Set Duration
    var duration = 15;
    var obj = this._viewingPictureRightBox;

    var data = { obj: obj, properties: ['x', 'opacity'], from: {x: obj.x, opacity: obj.opacity}, to: {x: (Graphics.width - obj.width) - 80, opacity: 255}, durations: {x: duration, opacity: duration}};
    data.easing = Object_Movement.easeOutCirc;
    this.move.startMove(data);
  } else {
    // Set Duration
    var duration = 15;
    var obj = this._viewingPictureRightBox;
    var data = { obj: obj, properties: ['x', 'opacity'], from: {x: obj.x, opacity: obj.opacity}, to: {x: (Graphics.width + obj.width), opacity: 0}, durations: {x: duration, opacity: duration}};
    data.easing = Object_Movement.easeOutCirc;
    this.move.startMove(data);
  };

  if (this.previousViewingPictureExists()) {
    // Set Duration
    var duration = 15;

    var obj = this._viewingPictureLeftBox;
    var data = { obj: obj, properties: ['x', 'opacity'], from: {x: obj.x, opacity: obj.opacity}, to: {x: 80, opacity: 255}, durations: {x: duration, opacity: duration}};
    data.easing = Object_Movement.easeOutCirc;
    this.move.startMove(data);
  } else {
    // Set Duration
    var duration = 15;
    var obj = this._viewingPictureLeftBox;
    var data = { obj: obj, properties: ['x', 'opacity'], from: {x: obj.x, opacity: obj.opacity}, to: {x: -obj.width, opacity: 0}, durations: {x: duration, opacity: duration}};
    data.easing = Object_Movement.easeOutCirc;
    this.move.startMove(data);
  };




  // If Next Picture Exists
  if (nextPicture) {
    // Set Duration
    AudioManager.playSe({name: "SE_turn_page", pan: 0, pitch: 100, volume: 90});
    var duration = 25;
    var obj = this._viewingPicture;
    var data = { obj: obj, properties: ['x', 'opacity'], from: {x: obj.x, opacity: obj.opacity}, to: {x: Graphics.width / 2, opacity: 0}, durations: {x: duration, opacity: duration}}
    data.easing = Object_Movement.easeInCirc;
    this.move.startMove(data);

    // Reset Sliding Picture
    this._viewingPictureSlide.x = Graphics.width + (this._viewingPicture.width / 2);
    this._viewingPictureSlide.y = Graphics.height / 2
    // this._viewingPictureSlide.bitmap = ImageManager.loadPicture('%1_%2'.format(this._albumData.group, nextPicture.graphicsName));
    this._viewingPictureSlide.setupBitmaps(
        nextPicture.EPA ? ImageManager.loadPicture (nextPicture.graphicsName) : ImageManager.loadPicture('%1_%2'.format(this._albumData.group, nextPicture.graphicsName)), 
        nextPicture.EPA ? ImageManager.loadPicture (nextPicture.backGraphicsName) : ImageManager.loadPicture('%1_%2'.format(this._albumData.group, nextPicture.backGraphicsName))
    );

    this.updateShiftToRead(nextPicture);

    var obj = this._viewingPictureSlide;
    var data = { obj: obj, properties: ['x', 'opacity'], from: {x: obj.x, opacity: obj.opacity}, to: {x: Graphics.width / 2, opacity: 255}, durations: {x: duration, opacity: duration}}
    data.easing = Object_Movement.easeOutCirc;
    data.onFinish = this.onPictureShowFinish.bind(this);
    this.move.startMove(data);
  };
};

//=============================================================================
// * Show Prev Picture
//=============================================================================
Scene_OmoriPhotoAlbum.prototype.showPrevViewingPicture = function(duration) {
  // Get Prev Picture
  var prevPicture;
  // Get Max Per Page
  var maxPerPage = this._albumSprite.maxPagePictures();


  // Go Through Pictures
  for (var i = this._viewingIndex - 1; i >= 0; i--) {
    // Get Page Index
    var pageIndex = i % maxPerPage;
    // Get Page
    var page = Math.floor(i / maxPerPage);
    // Get Picture
    var picture = this._albumSprite.picture(pageIndex, page);
    // If Picture
    if (picture) {
      // Set Prev Picture
      prevPicture = picture;
      // Set Viewing Index
      this._viewingIndex = i;
      break
    };
  };

  console.log(picture)

  if (this.nextViewingPictureExists()) {
    // Set Duration
    var duration = 15;
    var obj = this._viewingPictureRightBox;
    var data = { obj: obj, properties: ['x', 'opacity'], from: {x: obj.x, opacity: obj.opacity}, to: {x: (Graphics.width - obj.width) - 80, opacity: 255}, durations: {x: duration, opacity: duration}};
    data.easing = Object_Movement.easeOutCirc;
    this.move.startMove(data);
  } else {
    // Set Duration
    var duration = 15;
    var obj = this._viewingPictureRightBox;
    var data = { obj: obj, properties: ['x', 'opacity'], from: {x: obj.x, opacity: obj.opacity}, to: {x: (Graphics.width + obj.width), opacity: 0}, durations: {x: duration, opacity: duration}};
    data.easing = Object_Movement.easeOutCirc;
    this.move.startMove(data);
  };

  if (this.previousViewingPictureExists()) {
    // Set Duration
    var duration = 15;
    var obj = this._viewingPictureLeftBox;
    var data = { obj: obj, properties: ['x', 'opacity'], from: {x: obj.x, opacity: obj.opacity}, to: {x: 80, opacity: 255}, durations: {x: duration, opacity: duration}};
    data.easing = Object_Movement.easeOutCirc;
    this.move.startMove(data);
  } else {
    // Set Duration
    var duration = 15;
    var obj = this._viewingPictureLeftBox;
    var data = { obj: obj, properties: ['x', 'opacity'], from: {x: obj.x, opacity: obj.opacity}, to: {x: -obj.width, opacity: 0}, durations: {x: duration, opacity: duration}};
    data.easing = Object_Movement.easeOutCirc;
    this.move.startMove(data);
  };

  // If Previous Picture Exists
  if (prevPicture) {

    // Set Duration
    AudioManager.playSe({name: "SE_turn_page", pan: 0, pitch: 100, volume: 90});
    var duration = 25;
    var obj = this._viewingPicture;
    var data = { obj: obj, properties: ['x', 'opacity'], from: {x: obj.x, opacity: obj.opacity}, to: {x: Graphics.width / 2, opacity: 0}, durations: {x: duration, opacity: duration}}
    data.easing = Object_Movement.easeInCirc;
    this.move.startMove(data);

    // Reset Sliding Picture
    this._viewingPictureSlide.x = -(Graphics.width + (this._viewingPicture.width / 2));
    this._viewingPictureSlide.y = Graphics.height / 2

    this.updateShiftToRead(prevPicture);
    // this._viewingPictureSlide.bitmap = ImageManager.loadPicture('%1_%2'.format(this._albumData.group, prevPicture.graphicsName));

    this._viewingPictureSlide.setupBitmaps(
        prevPicture.EPA ? ImageManager.loadPicture (prevPicture.graphicsName) : ImageManager.loadPicture('%1_%2'.format(this._albumData.group, prevPicture.graphicsName)), 
        prevPicture.EPA ? ImageManager.loadPicture (prevPicture.graphicsName) : ImageManager.loadPicture('%1_%2'.format(this._albumData.group, prevPicture.backGraphicsName))
    );

    var obj = this._viewingPictureSlide;
    var data = { obj: obj, properties: ['x', 'opacity'], from: {x: obj.x, opacity: obj.opacity}, to: {x: Graphics.width / 2, opacity: 255}, durations: {x: duration, opacity: duration}}
    data.easing = Object_Movement.easeOutCirc;
    data.onFinish = this.onPictureShowFinish.bind(this);
    this.move.startMove(data);
  };
};

Sprite_OmoriAlbumPictureCursor.prototype.setPictureData = function(picture) {
  // Set Picture Data
  this._picture = picture;
  // If Picture Exists
  if (this._picture) {
    // Set Picture Bitmap
    this.setPictureBitmap(
        picture.EPA ? ImageManager.loadPicture(picture.thumbnailName) : ImageManager.loadPicture('%1_%2'.format(this._albumData.group, picture.thumbnailName))
        //ImageManager.loadPicture("Test_DW_POLAROID_01")
      )
  } else {
    // Set Picture Bitmap
    this.setPictureBitmap(null);
  }
};

Sprite_OmoriPictureAlbum.prototype.createBackgroundSprite = function() {
  // Get Filename
  var filename = this._albumData.EPA ? this._albumData.bookImageName : '%1_%2'.format(this._albumData.group, this._albumData.bookImageName);
  // Create Background Sprite
  this._backgroundSprite = new Sprite(ImageManager.loadPicture(filename));
  this.addChild(this._backgroundSprite);
};

Sprite_OmoriPictureAlbum.prototype.checkValidFlip = function(side, page = this._page) {
  var startRange = 0;
  var endRange = 0;

  var pagePics = this.maxPagePictures() / 2;
  switch (side) {
    case 0: // Left
      startRange = 0; endRange = pagePics;
      break;
    case 1: // Right
      startRange = pagePics; endRange = pagePics * 2;
      break;
    case 2: // All
      startRange = 0; endRange = pagePics * 2;
      break;
  };

  var numOnPage = 0
  // Go Through Ranges
  for (var i = startRange; i < endRange; i++) {
    // If Past max index
    if ((page * this.maxPagePictures()) + i > this._albumData.maxImages) { break; };
    // Get Data
    var data = this.picture(i, page);
    // Get Data
    if (data) {
      numOnPage+=1
      // Get Filename
    } 
  };
  var valid = false
  if ((numOnPage > 0 || EPA.placingMode)) {
    valid = true
  }
  if (!this._albumData.lockEmptyPages) {
    valid = true
  }
  return valid
}

Game_Interpreter.prototype.callAlbumMenu = function(itemId, interfaceMode = 1) {
  SceneManager.push(Scene_OmoriPhotoAlbum);
  SceneManager.prepareNextScene($dataItems[itemId], interfaceMode);
  if (interfaceMode === 1) {
    EPA.placingMode = false
  } else {
    EPA.placingMode = true
  }
};

//=============================================================================
// * Refresh Page
//=============================================================================
Sprite_OmoriPictureAlbum.prototype.refreshPage = function(side, page = this._page) {
  // Set Ranges and Page Pics
  var startRange = 0;
  var endRange = 0;
  var pagePics = this.maxPagePictures() / 2;
  // Get contents
  var contents = this._contentsSprite.bitmap;
  var halfWidth = contents.width / 2;
  // Get Filename
  var filename = this._albumData.EPA ? `${this._albumData.pageTextImageName}${page+1}` : '%1_%2'.format(this._albumData.group, this._albumData.pageTextImageName + (page + 1));
  // Get Text Bitmap
  var textBitmap = ImageManager.loadPicture(filename);

  // Set Paint Opacity
  contents.paintOpacity = 179;
  // Switch Side Case
  switch (side) {
    case 0: // Left
      startRange = 0; endRange = pagePics;
      contents.clearRect(0, 0, halfWidth, contents.height)
      contents.blt(textBitmap, 0, 0, halfWidth, contents.height, 0, 0)
      break;
    case 1: // Right
      startRange = pagePics; endRange = pagePics * 2;
      contents.clearRect(halfWidth, 0, halfWidth, contents.height)
      contents.blt(textBitmap, halfWidth, 0, halfWidth, contents.height, halfWidth, 0)
      break;
    case 2: // All
      startRange = 0; endRange = pagePics * 2;
      // Clear Bitmap
      contents.clear();
      contents.blt(textBitmap, 0, 0, textBitmap.width, contents.height, 0, 0)
      break;
  };
  // Set Paint Opacity
  contents.paintOpacity = 255;
  // Positions
  var positions = this._picturePositions;

  var numOnPage = 0
  // Go Through Ranges
  for (var i = startRange; i < endRange; i++) {
    // If Past max index
    if ((page * this.maxPagePictures()) + i > this._albumData.maxImages) { break; };
    // Get Data
    var data = this.picture(i, page);
    // Get Position
    var pos = positions[i];
    // Get X & Y Coordinates
    var x = pos[0], y = pos[1]
    // Get Data
    if (data) {
      
      numOnPage+=1
      // Get Filename
      var filename = data.EPA ? data.thumbnailName : '%1_%2'.format(this._albumData.group, data.thumbnailName);
      // Get Bitmap
      var bitmap = ImageManager.loadPicture(filename);
      //var bitmap = ImageManager.loadPicture("Test_DW_POLAROID_01");
      this._contentsSprite.bitmap.blt(bitmap, 0, 0, bitmap.width, bitmap.height, pos[0], pos[1]);
    } else {
      // this._contentsSprite.bitmap.fillRect(pos[0], pos[1], 86, 101, 'rgba(200, 200, 200, 1)')
    }
  };
};

//=============================================================================
// * Draw Item
//=============================================================================
Window_OmoriPictureList.prototype.drawItem = function(index) {
  // Get Rect
  var rect = this.itemRect(index);
  // Get Data
  var data = this._data[index];
  // Get Filename
  var filename = data.EPA ? data.thumbnailName : '%1_%2'.format(this._albumData.group, data.thumbnailName);
  // Get Bitmap
  var bitmap = ImageManager.loadPicture(filename);
  // Get Width & Height
  var width = bitmap.width, height = bitmap.height;
  // Get X & Y
  var x = rect.x + (rect.width - width) / 2;
  var y = rect.y + (rect.height - height) / 2;
  // Transfer Bitmap to contents
  this.contents.blt(bitmap, 0, 0, width, height, x, y);
};


//=============================================================================
// * Turn Page Right
//=============================================================================
Sprite_OmoriPictureAlbum.prototype.turnPageRight = function() {
  // Get Old Page
  var oldPage = this._page;
  // Set Page
  
  var numPagesLeft = (this._page).clamp(0, this.maxPages())
  var page = oldPage
  var pageValid = false
  for (var i = 1; i < numPagesLeft + 1; i++) {
    page = (page - 1).clamp(0, this.maxPages())
    pageValid = this.checkValidFlip(0, page)
    if (pageValid) {
      this._page = page
      break
    }
  }
  //this._page = (this._page - 1).clamp(0, this.maxPages());

  // Update Cursor Page Visibility
  this.updatePageCursorVisibility();
  var valid = this.checkValidFlip(0)
  // If Old page is not the same as new page
  if (oldPage !== this._page && valid) {
    // Get Bitmaps
    var leftBitmap = this.makePageBitmap(0);
    var rightBitmap = this.makePageBitmap(1);
    // Update Picture Side Graphics
    this.refreshPage(0);
    AudioManager.playSe({name: "SE_turn_page", pan: 0, pitch: 100, volume: 90});
    // Set Page Sprite Anchor
    this._pageSprite.anchor.x = 0;
    // Make Page Bitmap
    this._pageSprite.bitmap = leftBitmap
    // Set Page Sprite scale
    this._pageSprite.anchor.x = 1;
    // Set Cover Page Bitmap
    this._coverPageSprite.bitmap = rightBitmap;
    this._coverPageSprite.anchor.x = 0;

    // Update Picture Side Graphics
    this.refreshPage(2);

    var duration = 20;
    var obj = this._pageSprite;
    var data = { obj: obj, properties: ['scaleX'], from: {scaleX: obj.scaleX}, to: {scaleX: 0}, durations: {scaleX: duration}}
    data.easing = Object_Movement.easeOutCirc;
    this.move.startMove(data);

    data.onFinish = function() {
      var duration = 15;
      var obj = this._pageSprite;
      // Make Page Bitmap
      this._pageSprite.bitmap = this.makePageBitmap(1);
      obj.anchor.x = 0;
      var data = { obj: obj, properties: ['scaleX'], from: {scaleX: obj.scaleX}, to: {scaleX: 1.0}, durations: {scaleX: duration}}
      data.easing = Object_Movement.easeOutCirc;
      this.move.startMove(data);
      // Update Picture Border Visibility
      this.updatePictureBorderVisibility();

      // Run Original Function
      data.onFinish = function() {
        // Set Page Sprite Bitmap to null
        this._pageSprite.bitmap = null;
        this._coverPageSprite.bitmap = null;
      }.bind(this);
    }.bind(this);
  };
};

//=============================================================================
// * Turn Page Left
//=============================================================================
Sprite_OmoriPictureAlbum.prototype.turnPageLeft = function() {
  // Get Old Page
  var oldPage = this._page;

  var numPagesLeft = (this.maxPages() - (this._page)).clamp(0, this.maxPages())
  var page = oldPage
  var pageValid = false
  for (var i = 1; i < numPagesLeft + 1; i++) {
    page = (page + 1).clamp(0, this.maxPages())
    pageValid = this.checkValidFlip(2, page)
    if (pageValid) {
      this._page = page
      break
    }
  }

  // Set Page
  //this._page = (this._page + 1).clamp(0, this.maxPages());

  // Get Page Index
  var pageIndex = (this._page * this.maxPagePictures()) + this._index;
  if (pageIndex > this._albumData.maxImages) {
    this._index -=  pageIndex % this._albumData.maxImages;
    this.updateCursorPosition();
  };
  // Update Picture Border Visibility
  this.updatePictureBorderVisibility();


  // If Old page is not the same as new page
  
  var valid = this.checkValidFlip(2)
  // If Old page is not the same as new page
  if (oldPage !== this._page && valid) {
    // Get Bitmaps
    var leftBitmap = this.makePageBitmap(0);
    var rightBitmap = this.makePageBitmap(1);
    // Set Page Sprite Anchor

    AudioManager.playSe({name: "SE_turn_page", pan: 0, pitch: 100, volume: 90});
    this._pageSprite.anchor.x = 0;
    // Make Page Bitmap
    this._pageSprite.bitmap = rightBitmap
    // Set Page Sprite scale
    this._pageSprite.scale.x = 1;
    // Update Cursor Page Visibility
    this.updatePageCursorVisibility();

    // Set Cover Page Bitmap
    this._coverPageSprite.bitmap = leftBitmap;
    this._coverPageSprite.anchor.x = 1;
    // Update Picture Side Graphics
    this.refreshPage(2);

    var duration = 20;
    var obj = this._pageSprite;
    var data = { obj: obj, properties: ['scaleX'], from: {scaleX: obj.scaleX}, to: {scaleX: 0}, durations: {scaleX: duration}}
    data.easing = Object_Movement.easeOutCirc;
    this.move.startMove(data);

    data.onFinish = function() {
      var duration = 15;
      var obj = this._pageSprite;
      // Make Page Bitmap
      this._pageSprite.bitmap = this.makePageBitmap(0);
      obj.anchor.x = 1;
      var data = { obj: obj, properties: ['scaleX'], from: {scaleX: obj.scaleX}, to: {scaleX: 1.0}, durations: {scaleX: duration}}
      data.easing = Object_Movement.easeOutCirc;
      this.move.startMove(data);
      // Run Original Function
      data.onFinish = function() {
        // Set Page Sprite Bitmap to null
        this._pageSprite.bitmap = null;
        this._coverPageSprite.bitmap = null;
      }.bind(this);
    }.bind(this);
  };
};

