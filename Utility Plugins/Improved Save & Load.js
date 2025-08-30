//=============================================================================
// TDS Message Save & Load
// Version: Good
//=============================================================================
// Add to Imported List
var Imported = Imported || {} ; Imported.TDS_OmoriSaveLoad = true;
// Initialize Alias Object
var _TDS_ = _TDS_ || {} ; _TDS_.OmoriSaveLoad = _TDS_.OmoriSaveLoad || {};
//=============================================================================
 /*:
 * @author TDS
 * @plugindesc
 * Combo Skills port from ACE.
 *
 *
 */
//=============================================================================

Game_Actor.prototype.faceSaveLoad = function() {
  var actor = this.actor();
  // When changing these the .png should not be required.
  switch (actor.id) {
    case 1: // Omori
    return "01_OMORI_BATTLE";
    case 2: // Aubrey
    return "02_AUBREY_BATTLE";
    case 3: // Kel
    return "03_KEL_BATTLE";
    case 4: // Hero
    return "04_HERO_BATTLE";
    case 8: // Omori
    return "01_FA_OMORI_BATTLE";
    case 9: // Aubrey
    return "02_FA_AUBREY_BATTLE";
    case 10: // Kel
    return "03_FA_KEL_BATTLE";
    case 11: // Hero
    return "04_FA_HERO_BATTLE";
    default:
      return "01_FA_OMORI_BATTLE"; // if ther is one?
  }
};

Game_Actor.prototype.faceSaveLoadIndex = function() {
  var actor = this.actor();
  // When changing these the .png should not be required.
  switch (actor.id) {
    case 1: // Omori
    return 0;
    case 2: // Aubrey
    return 0;
    case 3: // Kel
    return 0;
    case 4: // Hero
    return 0;
    default:
      return 0;
  }
};

var omoDelete = false;
//=============================================================================
// ** DataManager
//-----------------------------------------------------------------------------
// The static class that manages the database and game objects.
//=============================================================================
// Alias Listing
//=============================================================================
if (!_TDS_.OmoriSaveLoad.DataManager_makeSavefileInfo) {
    _TDS_.OmoriSaveLoad.DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
}

//=============================================================================
// * Make Save File Information
//=============================================================================
DataManager.makeSavefileInfo = function() {
    // Call the original function only if it exists
    var info = _TDS_.OmoriSaveLoad.DataManager_makeSavefileInfo
        ? _TDS_.OmoriSaveLoad.DataManager_makeSavefileInfo.call(this)
        : {};

    // Add custom data to the savefile info
    var actor = $gameParty.leader();
    info.actorData = {
        name: actor.name(),
        level: actor.level,
        faceName: actor.faceSaveLoad(),
        faceIndex: actor.faceSaveLoadIndex()
    };
    info.chapter = $gameVariables.value(23);
    info.location = $gameMap.displayName();
    info.saveName = $gameSystem.saveName;

    return info;
};


//=============================================================================
// ** Game_Interpreter
//-----------------------------------------------------------------------------
// The interpreter for running event commands.
//=============================================================================
// * Call Save Menu
//=============================================================================
Game_Interpreter.prototype.callSaveMenu = function(save = true, load = true) {
  // Call Save Menu
  SceneManager.push(Scene_OmoriFile);
  SceneManager._nextScene.setup(save, load);
};

//=============================================================================
// ** Scene_OmoriFile
//-----------------------------------------------------------------------------
// This scene is used to handle saving & loading.
//=============================================================================
function Scene_OmoriFile() { this.initialize.apply(this, arguments); }
Scene_OmoriFile.prototype = Object.create(Scene_Base.prototype);
Scene_OmoriFile.prototype.constructor = Scene_OmoriFile;
//=============================================================================
// * Object Initialization
//=============================================================================

Scene_OmoriFile.prototype.initialize = function() {
  const fs = require('fs');
  const path = require("path");
  const base = path.dirname(process.mainModule.filename);
  
  this._imageReservationId = 'file';
  // Super Call
  Scene_Base.prototype.initialize.call(this);
  // Save Index
  this._saveIndex = -1;
  omoDelete = false;
  // If Can Select Flag is true
  this._canSelect = false;
  // Set Load Success Flag
  this._loadSuccess = false;
  // Set Save & Load Flags
  this._canSave = true; this._canLoad = true;
  this._move = false;
  this._moveSelection = 0;


  let globalInfo = DataManager.loadGlobalInfo();
  var maxSave = globalInfo.length-1;
  if(maxSave < 6) maxSave = 6;
    
    
  if(maxSave === 44){
    maxSave--;
    while(maxSave > 6 && globalInfo[maxSave] == null){
      maxSave--;
    }
  }
  

  if (!fs.existsSync(`${base}/save/saveloadplus.json`)) {
    fs.writeFileSync(`${base}/save/saveloadplus.json`, JSON.stringify({
        rows: undefined,
        columns: undefined
    }));
  }

  this.config = JSON.parse(fs.readFileSync(`${base}/save/saveloadplus.json`, "utf-8"));


  if(this.config.columns === undefined){
    this._columns = 4;
    this.config.columns = this._columns;
  }else{
    this._columns = this.config.columns;
  }

  if(this.config.rows === undefined){
    this._rows = Math.ceil(maxSave/this._columns);
    if(this._rows < 3)this._rows = 3;
    this.config.rows = this._rows;
  }else{
    this._rows = this.config.rows;
  }
  

  maxSave = this._rows*this._columns;
  

  DataManager.maxSavefiles = function() {return maxSave};

};
//=============================================================================
// * Initialize Atlas Lists
//=============================================================================
Scene_OmoriFile.prototype.initAtlastLists = function() {
  // Super Call
  Scene_Base.prototype.initAtlastLists.call(this);
};
//=============================================================================
// * Load Reserved Bitmaps
//=============================================================================
Scene_OmoriFile.prototype.loadReservedBitmaps = function() {
  // Super Call
  Scene_Base.prototype.loadReservedBitmaps.call(this);
  // Go through face
  ImageManager.reserveFace("01_OMORI_BATTLE", 0, this._imageReservationId);
  ImageManager.reserveFace("02_AUBREY_BATTLE", 0, this._imageReservationId);
  ImageManager.reserveFace("03_KEL_BATTLE", 0, this._imageReservationId);
  ImageManager.reserveFace("04_HERO_BATTLE", 0, this._imageReservationId);
  ImageManager.reserveFace("01_FA_OMORI_BATTLE", 0, this._imageReservationId);
  ImageManager.reserveFace("02_FA_AUBREY_BATTLE", 0, this._imageReservationId);
  ImageManager.reserveFace("03_FA_KEL_BATTLE", 0, this._imageReservationId);
  ImageManager.reserveFace("04_FA_HERO_BATTLE", 0, this._imageReservationId);

  ImageManager.reserveSystem('loadscreen_backgrounds', 0, this._imageReservationId);
  ImageManager.reserveBattleback1('battleback_bookshelf', 0, this._imageReservationId);
  ImageManager.reserveParallax('!parallax_black_space', 0, this._imageReservationId);
  ImageManager.reserveParallax('Space_parallax', 0, this._imageReservationId);
  ImageManager.reserveParallax('!polaroidBG_FA_day', 0, this._imageReservationId);
  ImageManager.reserveSystem('VISION',0,this._imageReservationId);
};
//=============================================================================
// * Terminate
//=============================================================================
Scene_OmoriFile.prototype.setup = function(save, load) {
  // Set Save & Load Flags
  this._canSave = save; this._canLoad = load;
};
//=============================================================================
// * Terminate
//=============================================================================
Scene_OmoriFile.prototype.terminate = function() {
  Scene_Base.prototype.terminate.call(this);
  if (this._loadSuccess) {
    $gameSystem.onAfterLoad();
  };
};
//=============================================================================
// * Create
//=============================================================================
Scene_OmoriFile.prototype.create = function() {
  // Super Call
  Scene_Base.prototype.create.call(this);
  // Create Background
  this.createBackground();
  this.createfileWindows();
  this.createCommandWindow();
  this.createStatWindow();
  // Create Prompt Window
  this.createPromptWindow();
  this.createCommandHints();
  this.createWaitingWindow();
};

Scene_OmoriFile.prototype.createWaitingWindow = function() {
    let ww = Math.floor(Graphics.boxWidth/3);
    let wh = Window_Base.prototype.lineHeight.call(this) + 16;
    this._waitingWindow = new Window_Base(Math.ceil(Graphics.boxWidth / 2 - ww/2), Math.ceil(Graphics.boxHeight / 2 - wh/2));
    this._waitingWindow.hide();
    this.addChild(this._waitingWindow);
    const MAX_TIME = 3;
    this._waitingWindow.saveString = TextManager.message("saveWait");
    this._waitingWindow.wait = MAX_TIME;
    this._waitingWindow.refresh = function() {
        if(this.wait > 0) {return this.wait--;}
        this.saveString += ".";
        this.contents.clear();
        this.drawText(this.saveString,0,0,this.contents.width,"center");
        this.wait = MAX_TIME;
        if(this.saveString.contains("...")) {this.saveString.replace("...", "")}
    }
    this._waitingWindow.clear = function() {
        this.saveString = TextManager.message("saveWait");
        this.wait = MAX_TIME;
        this.hide();
    }
    this._waitingWindow.update = function() {
        Window_Base.prototype.update.call(this);
        if(!this.visible) {return;}
        this.refresh();
    }
}

Scene_OmoriFile.prototype.createCommandHints = function() {
  
  this._commandHints = new Sprite(new Bitmap(Math.ceil(Graphics.boxWidth / 2), 60));
  this.addChild(this._commandHints);
  this._commandHints.position.set(16,Graphics.boxHeight-this._commandHints.height-4);


  this._commandHints.bitmap.clear();
  let iconSize = 31;
  let paddingY = 4;
  this._commandHints.bitmap.drawText("HOLD", 0, paddingY, this._commandHints.bitmap.width, 16, "left");
  this._commandHints.bitmap.drawInputIcon("shift", 52, paddingY);
  this._commandHints.bitmap.drawText("TO", iconSize + 58, paddingY, this._commandHints.bitmap.width, 16, "left");
  this._commandHints.bitmap.drawText("RESIZE MENU", 0, paddingY+25, this._commandHints.bitmap.width, 16, "left");
}

//=============================================================================
// * Create Background
//=============================================================================
Scene_OmoriFile.prototype.createBackground = function() {
  // Create Background Sprite
  this._backgroundSprite = new TilingSprite();
  this._backgroundSprite.bitmap = ImageManager.loadParallax('SAVE_MENU_BG');
  this._backgroundSprite.move(0, 0, Graphics.width, Graphics.height);

  this._foregroundSprite = new TilingSprite();
  this._foregroundSprite.bitmap = ImageManager.loadParallax('SAVE_MENU_BG');
  this._foregroundSprite.alpha = .75;
  this._foregroundSprite.move(0, 0, 183, Graphics.height);

  this._overlaySprite = new TilingSprite();
  this._overlaySprite.bitmap = ImageManager.loadSystem('VISION');
  this._overlaySprite.alpha = .5;
  this._overlaySprite.move(0, 0, Graphics.width, Graphics.height);

  this.addChildAt(this._backgroundSprite,0);
  this.addChildAt(this._foregroundSprite,1);
  this.addChildAt(this._overlaySprite,2);
  // let centerWidth = 42
  // let bitmap = new Bitmap(Graphics.width, Graphics.height);
  // bitmap.fillRect(0, 0, centerWidth, bitmap.height, 'rgba(255, 0, 0, 1)');
  // bitmap.fillRect(bitmap.width - centerWidth, 0, centerWidth, bitmap.height, 'rgba(255, 0, 0, 1)');

  // this._centerSprite = new Sprite(bitmap);
  // this.addChild(this._centerSprite);
};
//=============================================================================
// * Create Command Window
//=============================================================================
Scene_OmoriFile.prototype.createCommandWindow = function() {
  // Create Command Window
  this._commandWindow = new Window_OmoriFileCommand();
  this._commandWindow.setupFile(this._canSave, this._canLoad);
  this._commandWindow.setHandler('ok', this.onCommandWindowOk.bind(this));
  this._commandWindow.setHandler('cancel', this.onCommandWindowCancel.bind(this));
  this.addChild(this._commandWindow);
};
//=============================================================================
// * Create File Windows
//=============================================================================
Scene_OmoriFile.prototype.createfileWindows = function() {
  // Initialize File Windows Array
  this._fileWindows = [];
  //this._syncWindows = [];
  let sx = 183; //this._commandWindow.x + this._commandWindow.width + 1
  // Iterate 3 times
  for (var i = 0; i < DataManager.maxSavefiles(); i++) {
    // Create Window
    var win = new Window_OmoriFileInformation(i,this._columns);
    win.x = sx + (i%this._columns * (win.width));
    win.y = 28 + Math.floor(i/this._columns)*(win.height);
    // Set Window

    this._fileWindows[i] = win;
    
    this.addChildAt(win,1);
  };
};
//=============================================================================
// * Create Prompt Window
//=============================================================================
Scene_OmoriFile.prototype.createPromptWindow = function() {
  // Create Prompt Window
  this._promptWindow = new Window_OmoriFilePrompt();
  // Set Handlers
  this._promptWindow.setHandler('ok', this.onPromptWindowOk.bind(this));
  this._promptWindow.setHandler('cancel', this.onPromptWindowCancel.bind(this));
  this._promptWindow.close();
  this._promptWindow.openness = 0;
  this._promptWindow.deactivate();
  this.addChild(this._promptWindow);
};
//=============================================================================
// * Frame Update
//=============================================================================
Scene_OmoriFile.prototype.update = function() {
  // Super Call
  Scene_Base.prototype.update.call(this);
  omoCurrentSelection = this._commandWindow.currentData().symbol;
  // Update Background
  this.updateBackground();
  // Update Select Input
  if (this._canSelect) { 
    this._commandHints.alpha = 1;
    if(Input.isPressed('shift')){
      this.onSelectInputShift();
    }
    else{
      this.updateSelectInput(); 
    }
  }else{
    this._commandHints.alpha = 0;
  };

  // if (Input.isTriggered('control')) {

  // //   this.onSavefileOk();

  //   for (var i = 0; i < this._fileWindows.length; i++) {
  //     // Set Window
  //     this._fileWindows[i].refresh();
  //   };

  // };
};
//=============================================================================
// * Get Save File ID
//=============================================================================
Scene_OmoriFile.prototype.savefileId = function() { return this._saveIndex + 1; };
//=============================================================================
// * Check if out of bounds
//=============================================================================
Scene_OmoriFile.prototype.isOutOfBoundsY = function() {
  let index = this._saveIndex;
  let win = this._fileWindows[index];

  if(win.y + win.height > Graphics.boxHeight) {return -28.4}
  
  for(var i = 0; i < this._columns; i++){
    if(index === i){
      if(win.y < 28) {return 28.4} 
    }
  }

  if(win.y < 0) {return 28.4} 
  return 0;
}

Scene_OmoriFile.prototype.isOutOfBoundsX = function() {
  let sx = 183; // this._commandWindow.x + this._commandWindow.width + 1
  let index = this._saveIndex;
  let win = this._fileWindows[index];
  
  if(win.x + win.width > Graphics.boxWidth) {return -27.5}

  for(var i = 0; i < DataManager.maxSavefiles(); i+=this._columns){
    if(index === i){
      if(win.x - sx < 0) {return 27.5} 
    }
  }
  
  if(win.x - sx < 0) {return 27.5} 

  return 0;
}
//=============================================================================
// * Update Save Index Cursor
//=============================================================================
Scene_OmoriFile.prototype.updateSaveIndexCursor = function() {
  // Go Through File Windows
  for (var i = 0; i < this._fileWindows.length; i++) { 
    // Get Window
    var win = this._fileWindows[i];
    // Set Selected STate
    if(this._saveIndex === i || this._moveSelection-1 === i){
      win.select();
      if(this._saveIndex === i){
        var id = i + 1;
        var valid = DataManager.isThisGameFile(id);
        var info = DataManager.loadSavefileInfo(id);
        this._statWindow.updateStats(valid, info, id);
        this._fileWindows[i].refresh(valid,info,id);
      }
    }
    else win.deselect();
  };
};
//=============================================================================
// * Update Background
//=============================================================================
Scene_OmoriFile.prototype.updateBackground = function() {
  var currentSelection = this._commandWindow.currentData().symbol;


  if(currentSelection === 'rename'){
    this._backgroundSprite.origin.x = 0;
    this._foregroundSprite.origin.x = 0;
    this._backgroundSprite.origin.y = 0;
    this._foregroundSprite.origin.y = 0;
    this._backgroundSprite.bitmap = ImageManager.loadBattleback1('battleback_bookshelf');
    this._foregroundSprite.bitmap = ImageManager.loadBattleback1('battleback_bookshelf');
    
    if(this._fileWindows[this._saveIndex] !== undefined && this._fileWindows[this._saveIndex] !== null){
      this._overlaySprite.origin.x = this._overlaySprite.width/2 - (this._fileWindows[this._saveIndex].x - Graphics.width/2 + this._fileWindows[this._saveIndex].width/2);
      this._overlaySprite.origin.y = this._overlaySprite.height/2 - (this._fileWindows[this._saveIndex].y - Graphics.height/2 + this._fileWindows[this._saveIndex].height/2);
    }else{
      this._overlaySprite.origin.x = this._overlaySprite.width/2  ;//+ Graphics.width/2;
      this._overlaySprite.origin.y = this._overlaySprite.height/2 ;//+ Graphics.height/2;
    }
    this._overlaySprite.alpha = .5;
    return;
  }else{
    this._overlaySprite.alpha = 0;
  }

  if(currentSelection === 'move'){
    this._backgroundSprite.bitmap = ImageManager.loadParallax('Space_parallax');
    this._foregroundSprite.bitmap = ImageManager.loadParallax('Space_parallax');
    this._backgroundSprite.origin.y = 0;
    this._foregroundSprite.origin.y = 0;
    this._backgroundSprite.origin.x += 1;
    this._foregroundSprite.origin.x += 1;
    return;
  }else{
    this._backgroundSprite.origin.x = 0;
    this._foregroundSprite.origin.x = 0;
    this._backgroundSprite.origin.y += 1;
    this._foregroundSprite.origin.y += 1;
  }

  if(currentSelection === 'cloud'){
    this._backgroundSprite.bitmap = ImageManager.loadParallax('!polaroidBG_FA_day');
    this._foregroundSprite.bitmap = ImageManager.loadParallax('!polaroidBG_FA_day');
  }else if(currentSelection === 'delete'){//this code is big poopoopeepee
    this._backgroundSprite.bitmap = ImageManager.loadParallax('!parallax_black_space');
    this._foregroundSprite.bitmap = ImageManager.loadParallax('!parallax_black_space');
  }else{
    this._backgroundSprite.bitmap = ImageManager.loadParallax('SAVE_MENU_BG');
    this._foregroundSprite.bitmap = ImageManager.loadParallax('SAVE_MENU_BG');
  }
};
//=============================================================================
// * Update Select Background
//=============================================================================
Scene_OmoriFile.prototype.updateSelectInput = function() {
  // If Ok
  if (Input.isTriggered('ok')) {
    // Call On Select Input Ok
    this.onSelectInputOk();
    return;
  };

  // If Cancel
  if (Input.isTriggered('cancel')) {
    // Play Cancel Sound
    SoundManager.playCancel();
    // On Select Input Cancel
    this.onSelectInputCancel();
    return;
  };
  
  /*if (Input.isRepeated('shift')) {
    // On Select Input Cancel
    this.onSelectInputShift();
    return;
  };*/

  // If Input Is repeated Up
  if (Input.isRepeated('left')) {
    // Play Cursor
    if(this._columns === 1) return;
    SoundManager.playCursor();
    this._saveIndex = Math.floor(this._saveIndex/this._columns)*this._columns+(this._saveIndex-1).mod(this._columns);
    if(this._saveIndex === 43)this._saveIndex = Math.floor(this._saveIndex/this._columns)*this._columns+(this._saveIndex-1).mod(this._columns);
    // Update Save Index Cursor
    this.updateSaveIndexCursor();
    return;
  };
  // If Input Is repeated Down
  if (Input.isRepeated('right')) {
    // Play Cursor
    if(this._columns === 1) return;
    SoundManager.playCursor();
    // Increase Save Index
    this._saveIndex = Math.floor(this._saveIndex/this._columns)*this._columns+(this._saveIndex+1)%this._columns;
    if(this._saveIndex === 43)this._saveIndex = Math.floor(this._saveIndex/this._columns)*this._columns+(this._saveIndex+1)%this._columns;
    // Update Save Index Cursor
    this.updateSaveIndexCursor();
    return;
  };
  if (Input.isRepeated('up')) {
    // Play Cursor
    if(this._rows === 1) return;
    SoundManager.playCursor();
    this._saveIndex = (this._saveIndex-this._columns).mod(DataManager.maxSavefiles());
    if(this._saveIndex === 43)this._saveIndex = (this._saveIndex-this._columns).mod(DataManager.maxSavefiles());
    // Update Save Index Cursor
    this.updateSaveIndexCursor();
    return;
  };
  if (Input.isRepeated('down')) {
    // Play Cursor
    if(this._rows === 1) return;
    SoundManager.playCursor();
    this._saveIndex = (this._saveIndex+this._columns)%DataManager.maxSavefiles();
    if(this._saveIndex === 43)this._saveIndex = (this._saveIndex+this._columns)%DataManager.maxSavefiles();
    // Update Save Index Cursor
    this.updateSaveIndexCursor();
    return;
  };
  this.updatePlacement();
};

Scene_OmoriFile.prototype.updatePlacement = function() {
  if(this._saveIndex < 0) {return;}
  let boundsX = this.isOutOfBoundsX();
  let boundsY = this.isOutOfBoundsY();
  if(!boundsX && !boundsY) {return;}
  for(let win of this._fileWindows) {
    win.x += boundsX;
    win.y += boundsY;
  }
}
//=============================================================================
// * On Command Window Ok
//=============================================================================
Scene_OmoriFile.prototype.onCommandWindowOk = function() {
  var currentSelection = this._commandWindow.currentData().symbol;
  if(currentSelection === 'cloud'){ //if cloud save

    try{
      window.OMORI_CLOUD_SAVE_CALLBACK();
    }catch(error){
      SoundManager.playBuzzer();
      this.onSelectInputCancel();
    }

  }else{ //if not cloud save
    // Set Can select Flag to true
    this._canSelect = true;
    // Set Save Index to 0
    let latestFile = !!this._canSave ? DataManager.lastAccessedSavefileId() : DataManager.latestSavefileId();
    let maxSavefiles = DataManager.maxSavefiles();
    this._saveIndex = (latestFile - 1) % maxSavefiles;
    // Update Save Index Cursor
    this.updateSaveIndexCursor();
  }
  
};
//=============================================================================
// * On Command Window Cancel
//=============================================================================
Scene_OmoriFile.prototype.onCommandWindowCancel = function() {
  const fs = require('fs');
  const path = require("path");
  const base = path.dirname(process.mainModule.filename);

  fs.writeFileSync(`${base}/save/saveloadplus.json`, JSON.stringify(this.config, null, 2));

  // If Previous scene is title screen
  var isTitleScreen = SceneManager.isPreviousScene(Scene_OmoriTitleScreen);
  // Pop Scene
  this.popScene();
  // If Previous scene is tile scene
  if (isTitleScreen) {
    // Prepare Title Scene
    SceneManager._nextScene.prepare(1);
  }
};
//=============================================================================
// * On Select Input Ok
//=============================================================================
Scene_OmoriFile.prototype.onSelectInputOk = function() {
  
  const fs = require('fs');
  const path = require("path");
  const base = path.dirname(process.mainModule.filename);

  fs.writeFileSync(`${base}/save/saveloadplus.json`, JSON.stringify(this.config, null, 2));
  
  // Get Index
  var currentSelection = this._commandWindow.currentData().symbol;
  // Get Save File ID
  var saveFileid = this.savefileId();

  if(saveFileid === 44){

    AudioManager.playStaticSe({"name":"SE_bs_scare"+(Math.floor(Math.random() * 8)+1),"pan":0,"pitch":100,"volume":100});
    this.onSelectInputCancel();
    //this.onCommandWindowCancel();

    return;
  }
  // If Save
  if (currentSelection === 'save') {
    // If File Exists
    if (StorageManager.exists(saveFileid)) {
      // Show Prompt Window
      this.showPromptWindow('Overwrite this file?');
      // Set Can select Flag to false
      this._canSelect = false;
    } else {
      // Save The Game
      this.saveGame();
    };
  } else if (currentSelection === 'load') {
    // If File Exists
    if (StorageManager.exists(saveFileid)) {
      // Show Prompt Window
      this.showPromptWindow('Load this file?');
      // Set Can select Flag to false
      this._canSelect = false;
    } else {
      // Play Buzzer Sound
      SoundManager.playBuzzer();
      
    };
  } else if (currentSelection === 'delete'){
    // If File Exists
    if (StorageManager.exists(saveFileid)) {
      // Show Prompt Window
      this.showPromptWindow('Delete this file?');
      // Set Can select Flag to false
      omoDelete = true;
      var valid = DataManager.isThisGameFile(saveFileid);
      var info = DataManager.loadSavefileInfo(saveFileid);
      this._fileWindows[saveFileid-1].refresh(valid, info, saveFileid);
      this._canSelect = false;
    } else {
      // Play Buzzer Sound
      SoundManager.playBuzzer();
    };
  } else if (currentSelection === 'move'){
    // If File Exists
    if(!this._move){
      var data = DataManager.loadGlobalInfo();
      if (data[saveFileid] !== undefined && data[saveFileid] !== null && Object.keys(data[saveFileid]).length !== 0) {
        SoundManager.playCursor();
        this._moveSelection = this.savefileId();
        this._move = true;
      } else {
        // Play Buzzer Sound
        SoundManager.playBuzzer();
      };
    }else{
      var data = DataManager.loadGlobalInfo();
      AudioManager.playStaticSe({"name":"GEN_Swish","pan":0,"pitch":100,"volume":90});
      if (data[saveFileid] !== undefined && data[saveFileid] !== null && Object.keys(data[saveFileid]).length !== 0) {
        this.swapGame();
      }else{
        this.moveGame();
      }
      this._move = false;
    }
    
  } else if (currentSelection === 'rename'){
    // If File Exists
    if (StorageManager.exists(saveFileid)) {
      // Show Prompt Window
      this.showPromptWindow('Can you type?');
      // Set Can select Flag  to false
      this._canSelect = false;
    } else {
      // Play Buzzer Sound
      SoundManager.playBuzzer();
    };
  } 
};





//=============================================================================
// * On Select Input Cancel
//=============================================================================
Scene_OmoriFile.prototype.onSelectInputCancel = function() {
  // Set Can select Flag to false
  this._canSelect = false;
  // Set Save Index to -1
  this._saveIndex = -1;
  omoDelete = false;
  this._moveSelection = -1;
  this._move = false;
  // Update Save Index Cursor
  this.updateSaveIndexCursor();
  // Activate Command Window
  this._commandWindow.activate();
};

//=============================================================================
// * On Select Input Shift
//=============================================================================
Scene_OmoriFile.prototype.onSelectInputShift = function() {

  if(Input.isTriggered('shift')){this._saveIndex = DataManager.maxSavefiles()-1;
    this.updateSaveIndexCursor();}

  // If Input Is repeated Up
    if (Input.isRepeated('left')) {
      if(this._columns > 1){
        this._columns--;
        this.config.columns = this._columns;
        if(this._columns === 1){
          this._fileWindows.forEach(element => {
            element.width = 382 + 54; 
            element._columns = this._columns; 
            var id = element._index + 1;
            var valid = DataManager.isThisGameFile(id);
            var info = DataManager.loadSavefileInfo(id);
            element.refresh(valid, info, id);
          });
        }
        var previousMax = DataManager.maxSavefiles();
        var maxSave = DataManager.maxSavefiles() - this._rows;
        DataManager.maxSavefiles = function() {return maxSave};

        // Play Cursor
        SoundManager.playCursor();
        this._saveIndex = maxSave-1;
      
        // Update Save Index Cursor
            
        this.refreshWindowDisplay(previousMax);
        this.updateSaveIndexCursor();
      }else{

        SoundManager.playBuzzer();
        
      }
      return;
    };

    // If Input Is repeated Down
    if (Input.isRepeated('right')) {
      this._columns++;
      this.config.columns = this._columns;
      if(this._fileWindows[0]._columns === 1){
        this._fileWindows.forEach(element => {
          element.width = 110; 
          element._columns = this._columns; 
          var id = element._index + 1;
          var valid = DataManager.isThisGameFile(id);
          var info = DataManager.loadSavefileInfo(id);
          element.refresh(valid, info, id);
        });
      }

      var previousMax = DataManager.maxSavefiles();
      var maxSave = DataManager.maxSavefiles() + this._rows;
      DataManager.maxSavefiles = function() {return maxSave};

      SoundManager.playCursor();
      this._saveIndex = maxSave-1;
      
      // Update Save Index Cursor
        
      this.refreshWindowDisplay(previousMax);
      this.updateSaveIndexCursor();
      return;
    };

    if (Input.isRepeated('up')) {
      if(this._rows > 1){
        this._rows--;
        this.config.rows = this._rows;
        var previousMax = DataManager.maxSavefiles();
        var maxSave = DataManager.maxSavefiles() - this._columns;
        DataManager.maxSavefiles = function() {return maxSave};

        // Play Cursor
        SoundManager.playCursor();
        this._saveIndex = maxSave-1; //(this._saveIndex-this._columns).mod(DataManager.maxSavefiles());
        // Update Save Index Cursor
            
        this.refreshWindowDisplay(previousMax);
        this.updateSaveIndexCursor();
      }else{

        SoundManager.playBuzzer();

      }
      return;
    };

    if (Input.isRepeated('down')) {
      this._rows++;
      this.config.rows = this._rows;
      var previousMax = DataManager.maxSavefiles();
      var maxSave = DataManager.maxSavefiles() + this._columns;
      DataManager.maxSavefiles = function() {return maxSave};

      SoundManager.playCursor();
      this._saveIndex = maxSave-1;
      
      // Update Save Index Cursor
        
      this.refreshWindowDisplay(previousMax);
      this.updateSaveIndexCursor();
      return;
    };

  // Update Save Index Cursor
  this.updatePlacement();
};

Scene_OmoriFile.prototype.refreshWindowDisplay = function(previosMax){
  let sx = 183; //this._commandWindow.x + this._commandWindow.width + 1

  var xOffset = this._fileWindows[0].x;
  var yOffset = this._fileWindows[0].y;

  


  for (var i = 0; i < DataManager.maxSavefiles(); i++) {
    // Create Window
    if(this._fileWindows[i] === undefined){
      this._fileWindows[i] = new Window_OmoriFileInformation(i, this._columns);
    }
    this._fileWindows[i].x = xOffset + (i%this._columns * (this._fileWindows[i].width));
    this._fileWindows[i].y = yOffset + Math.floor(i/this._columns)*(this._fileWindows[i].height);
  };

  if(DataManager.maxSavefiles() > previosMax){
    for(var j = previosMax; j < DataManager.maxSavefiles(); j++){
      this.addChildAt(this._fileWindows[j],1);
    }
  }else if(DataManager.maxSavefiles() < previosMax){
    for(var j = DataManager.maxSavefiles(); j < previosMax; j++){
      this.removeChild(this._fileWindows[j]);
      //delete this._fileWindows[j];
    }
  }
}

//=============================================================================
// * Show Prompt Window
//=============================================================================
Scene_OmoriFile.prototype.showPromptWindow = function(text) {
  // Set Prompt Window Text
  this._promptWindow.setPromptText(text);
  // Show Prompt Window
  this._promptWindow.open();
  this._promptWindow.select(1);
  this._promptWindow.activate();
};
//=============================================================================
// * On Prompt Window Ok
//=============================================================================
Scene_OmoriFile.prototype.onPromptWindowOk = function() {
  // Get Index
  var currentSelection = this._commandWindow.currentData().symbol;
  // If Save
  if (currentSelection === 'save') {
    // Save The Game
    this.saveGame();
    // Close Prompt Window
    this._promptWindow.close();
    this._promptWindow.deactivate();
    // Set Can select Flag to true
    this._canSelect = true;
  } else if (currentSelection === 'load') {
    // Load Game
    this.loadGame();
  }else if (currentSelection === 'delete'){
    this.deleteGame();
    omoDelete = false;
    this._promptWindow.close();
    this._promptWindow.deactivate();
    // Set Can select Flag to true
    this._canSelect = true;
  }else if (currentSelection === 'rename'){
    this.renameFile();
    // Set Can select Flag to true
    this._canSelect = true;
  }
};
//=============================================================================
// * On Prompt Window Cancel
//=============================================================================
Scene_OmoriFile.prototype.onPromptWindowCancel = function() {
  // Close Prompt Window
  this._promptWindow.close();
  this._promptWindow.deactivate();
  if(omoDelete){
    omoDelete = false;
    var id = this.savefileId();
    var valid = DataManager.isThisGameFile(id);
    var info = DataManager.loadSavefileInfo(id);
    this._fileWindows[id-1].refresh(valid, info, id);
  }
  // Set Can select Flag to true
  this._canSelect = true;
};
//=============================================================================
// * Save Game
//=============================================================================
Scene_OmoriFile.prototype.saveGame = function() {
    // On Before Save
    $gameSystem.onBeforeSave();

    // Get Save File ID
    var saveFileid = this.savefileId();

    // Get File Window
    var fileWindow = this._fileWindows[this._saveIndex];

    // Deactivate Prompt Window
    this._promptWindow.deactivate();
    this._promptWindow.close();

    // Show Waiting Window
    if (this._waitingWindow) {
        this._waitingWindow.show();
    }

    // Save Game
    if (DataManager.saveGame(saveFileid)) {
        SoundManager.playSave();
        StorageManager.cleanBackup(saveFileid);

        var world = 0; // Default world
        // Check switch values to determine world
        if ($gameSwitches.value(448) && $gameSwitches.value(447)) {
            world = 449; // Special case when both switches are on
        } else if ($gameSwitches.value(448)) {
            world = 448;
        } else if ($gameSwitches.value(447)) {
            world = 447;
        } else if ($gameSwitches.value(446)) {
            world = 446;
        } else if ($gameSwitches.value(445)) {
            world = 445;
        } else if ($gameSwitches.value(444)) {
            world = 444;
        }

        // Write world data and backup the save file
        DataManager.writeToFileAsync(world, "TITLEDATA", () => {
            this.backupSaveFile(() => {
                fileWindow.refresh();
                if (this._waitingWindow) {
                    this._waitingWindow.clear(); // Clear Waiting Window
                }
                // Update state and cursor
                this._canSelect = true;
                this.updateSaveIndexCursor();
            });
        });
    } else {
        SoundManager.playBuzzer();
        if (this._waitingWindow) {
            this._waitingWindow.clear(); // Clear Waiting Window
        }
        // Update state and cursor
        this._canSelect = true;
        this.updateSaveIndexCursor();
    }
};


Scene_OmoriFile.prototype.renameFile = function() {
  this._promptWindow.deactivate();
  this._promptWindow.close();
  // Get File Window
  var fileWindow = this._fileWindows[this._saveIndex];
  var id = this._saveIndex + 1;
  var valid = DataManager.isThisGameFile(id);
  var info = DataManager.loadGlobalInfo();
  if(info[id].saveName === null){
    info[id].saveName = prompt("What would you like to name this file?", "");
  }else{
    info[id].saveName = prompt("What would you like to name this file?", info[id].saveName);
  }
  AudioManager.playStaticSe({"name":"GEN_shine","pan":0,"pitch":100,"volume":90});
  DataManager.saveGlobalInfo(info);
  fileWindow.refresh(valid, info[id], id);
  this._statWindow.updateStats(valid, info[id], id);
  // Set Can select Flag to false
  this._canSelect = true;
};

Scene_OmoriFile.prototype.swapGame = function() {
  const fs = require('fs');
  const path = require("path");
  const base = path.dirname(process.mainModule.filename);

  var file1 = this._moveSelection;
  this._moveSelection = -1;
  var file2 = this.savefileId();
  var path1 = `${base}/save/file${file1}.rpgsave`;
  var path2 = `${base}/save/file${file2}.rpgsave`;
  var tempPath = `${base}/save/temporaryfile.rpgsave`;

  var window1 = this._fileWindows[file1-1];
  var window2 = this._fileWindows[file2-1];

  var data = DataManager.loadGlobalInfo();
    
  var tempData = data[file1];
  data[file1] = data[file2];
  data[file2] = tempData;
  
  DataManager.saveGlobalInfo(data);

  var id1 = window1._index + 1;
  var id2 = window2._index + 1;
  
  window2.refresh(true, data[id2], id2);
  window1.refresh(true, data[id1], id1);
  this.updateSaveIndexCursor();
        
  fs.rename(path1,tempPath,() => {
    fs.rename(path2,path1,() => {
      fs.rename(tempPath,path2);
    });
  });
  
}

Scene_OmoriFile.prototype.moveGame = function() {
  const fs = require('fs');
  const path = require("path");
  const base = path.dirname(process.mainModule.filename);

  var file1 = this._moveSelection;
  this._moveSelection = 0;
  var file2 = this.savefileId();
  var path1 = `${base}/save/file${file1}.rpgsave`;
  var path2 = `${base}/save/file${file2}.rpgsave`;
  var tempPath = `${base}/save/temporaryfile.rpgsave`;

  var window1 = this._fileWindows[file1-1];
  var window2 = this._fileWindows[file2-1];

  var data = DataManager.loadGlobalInfo();
  
  data[file2] = data[file1];
  data[file1] = null;

  DataManager.saveGlobalInfo(data);

  var id1 = window1._index + 1;
  var id2 = window2._index + 1;
  
  this.updateSaveIndexCursor();

  window2.refresh(true, data[id2], id2);
  window1.refresh(false, data[id1], id1);
  
  this._statWindow.updateStats(true, data[id2], id2);

  //i swap even tho theres no file cus what if there is a file tho
  //i dont wanna overwrite someones hard work
  fs.rename(path1,tempPath,() => {
    fs.rename(path2,path1,() => {
      fs.rename(tempPath,path2);
    });
  });
  
}

Scene_OmoriFile.prototype.deleteGame = function() {
  SoundManager.playActorCollapse();
  var saveFileid = this.savefileId();
  var fileWindow = this._fileWindows[this._saveIndex];
  StorageManager.remove(saveFileid);
  StorageManager.cleanBackup(saveFileid);

  let data = DataManager.loadGlobalInfo();
  data[saveFileid] = null;

  DataManager.saveGlobalInfo(data);

  var id = fileWindow._index + 1;
  var valid = DataManager.isThisGameFile(id);
  var info = DataManager.loadSavefileInfo(id);
  fileWindow.refresh(valid, info, id);
}
//=============================================================================
// * Load Game
//=============================================================================
Scene_OmoriFile.prototype.loadGame = function() {
  if (DataManager.loadGame(this.savefileId())) {

    SoundManager.playLoad();
    this.fadeOutAll();
    // Reload Map if Updated
    if ($gameSystem.versionId() !== $dataSystem.versionId) {
      $gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
      $gamePlayer.requestMapReload();
    };
    SceneManager.goto(Scene_Map);
    var info = DataManager.loadSavefileInfo(this.savefileId());
    $gameSystem.saveName = info.saveName;
    this._loadSuccess = true;
    // Close Prompt Window
    this._promptWindow.close();
    this._promptWindow.deactivate();
  } else {
    // Play Buzzer
    SoundManager.playBuzzer();
    // Close Prompt Window
    this._promptWindow.close();
    this._promptWindow.deactivate();
    // Set Can select Flag to true
    this._canSelect = true;
  };
};



//=============================================================================
// ** Window_OmoriFileInformation
//-----------------------------------------------------------------------------
// The window for showing picture items for sorting
//=============================================================================
function Window_OmoriFileInformation() { this.initialize.apply(this, arguments); };
Window_OmoriFileInformation.prototype = Object.create(Window_Base.prototype);
Window_OmoriFileInformation.prototype.constructor = Window_OmoriFileInformation;
//=============================================================================
// * Object Initialization
//=============================================================================
Window_Base.prototype.setWidth = function(x) {
  this.width = x;
};

Window_Base.prototype.setAlpha = function(x) {
  this.alpha = x;
};

Window_OmoriFileInformation.prototype.initialize = function(index, columns) {
  this._isOmoriFileWindow = true;
  // Set Index
  this._index = index;
  //this variable is only reliable for columns = 1 and columns != 1 lol
  this._columns = columns;
  // Super Call
  Window_Base.prototype.initialize.call(this, 0, 0, this.windowWidth(), this.windowHeight());
  if(this._columns !== 1){this.setWidth(110);}
  if(this._index === 43){this.setAlpha(0);}
  // Create Cursor Sprite
  this.createCursorSprite();
  // Refresh
  var id = this._index + 1;
  var valid = DataManager.isThisGameFile(id);
  var info = DataManager.loadSavefileInfo(id);
  this.refresh(valid, info, id);
  // Deselect
  this._select = false;
  this.deselect();
};
//=============================================================================
// * Settings
//=============================================================================
Window_OmoriFileInformation.prototype.standardPadding = function() { return 4}
Window_OmoriFileInformation.prototype.windowWidth = function () { 
  /*if(OmoriColumns === 1)*/return 382 + 54;
  //return 110; 
};
Window_OmoriFileInformation.prototype.windowHeight = function() { return 142; }
//=============================================================================
// * Create Cursor Sprite
//=============================================================================
//animated faces for selected save files is technically a type of cursor right lol
Window_OmoriFileInformation.prototype.createCursorSprite = function() {
  // Create Cursor Sprite
  this._cursorSprite = new Sprite_WindowCustomCursor();
  this._cursorSprite.x = 10//-32;
  this._cursorSprite.y = 20;
  this.addChild(this._cursorSprite);



  this._faceSprite = new Sprite_OmoSaveMenuFace();
  this._faceSprite.x = 2;
  this._faceSprite.y = this.contents.height - Window_Base._faceHeight + 7;
  this._faceSprite.show;
  this._faceSprite.activate;
  this._faceSprite.update();
  

  //define the background so that it can be used to cover up the drawFace in the refresh command
  let backBitmap = ImageManager.loadSystem('loadscreen_backgrounds');
  let width = 100;
  let height = 100;
  this._selectedBG = new Sprite();
  this._selectedBG.bitmap = backBitmap;
  this._selectedBG.x = 5;
  this._selectedBG.y = this.contents.height - Window_Base._faceHeight + 9;
  this._selectedBG.width = width;
  this._selectedBG.height = height;
  this._selectedBG.setFrame(-42069, -42069, width, height);


  this.addChild(this._selectedBG);
  this.addChild(this._faceSprite);
};
//=============================================================================
// * Select
//=============================================================================
Window_OmoriFileInformation.prototype.select = function() {
  this._select = true;
  this._faceSprite.visible = true;
  this._selectedBG.visible = true;
  this._cursorSprite.visible = true;
  this.contentsOpacity = 255;
};
//=============================================================================
// * Deselect
//=============================================================================
Window_OmoriFileInformation.prototype.deselect = function() {
  this._select = false;
  this._faceSprite.visible = false;
  this._selectedBG.visible = false;
  this._cursorSprite.visible = false;
  this.contentsOpacity = 100;
};
//=============================================================================
// * Refresh
//=============================================================================

//why did i change refresh to need parameters?
//because i am dumb and could not get moveGame function to work with DataManager.loadGlobalData :<
Window_OmoriFileInformation.prototype.refresh = function(valid, info, id) {
  // Clear Contents
  this.contents.clear();
  // Get Color
  var color = 'rgba(255, 255, 255, 1)';
  // Get ID
  //var id = this._index + 1;
  //var valid = DataManager.isThisGameFile(id);
  //var info = DataManager.loadSavefileInfo(id);

  // Draw Lines
  this.contents.fillRect(0, 29, this.contents.width, 3, color);

  for (var i = 0; i < 3; i++) {
    var y = 55 + (i * 25)
    this.contents.fillRect(113, y, this.contents.width - 117, 1, color);
  };


  // Draw File
  this.contents.fontSize = 30;
  if(this._columns === 1)this.contents.drawText('FILE ' + id + ':', 10 + 30, -5, 100, this.contents.fontSize);
  else{
    if(!valid || info.saveName === null || info.saveName === "" ||info.saveName === undefined)this.contents.drawText(id, 2, -5, 100, this.contents.fontSize, 'center');
    else this.contents.drawText(info.saveName, 2, -5, 98, this.contents.fontSize, 'center');
  }
  
  // If Valid
  if (valid) {
    if(this._select){
      this._faceSprite.visible = true;
      this._selectedBG.visible = true;
    }else{
      this._faceSprite.visible = false;
      this._selectedBG.visible = false;
    }
    this.contents.drawText(info.chapter, 85 + 30 + 13*Math.floor(Math.log10(id)), -5, this.contents.width, this.contents.fontSize);

    this.contents.fontSize = 28;

    let backBitmap = ImageManager.loadSystem('loadscreen_backgrounds');
    let width = 100;
    let height = 100;
    // this.contents.blt(backBitmap, 0, 0, width, height, 0, 34, width + 10, height);
    bgLocation = getBackground(info.location);
    this.contents.blt(backBitmap, width*bgLocation[0], height*bgLocation[1], width, height, 1, 33); //width*n, height*m controls background
    this._selectedBG.setFrame(width*bgLocation[0], height*bgLocation[1], width, height);
    // Get Actor
    var actor = info.actorData;
    // Draw Actor Face
    this.drawFace(actor.faceName, 0, -2, this.contents.height - Window_Base._faceHeight + 7, Window_Base._faceWidth, height - 2);
    this._faceSprite.actor = actor;
    if(omoDelete)this._faceSprite.setAnimRow(3);
    else this._faceSprite.setAnimRow(0);
    // Draw Actor Name
    this.contents.fontSize = 24;
    if(info.saveName === null || info.saveName === "" || info.saveName === undefined)this.contents.drawText(actor.name, 118, 30, 200, 24);
    else this.contents.drawText(info.saveName, 118, 30, 200, 24);
    // Draw Level
    this.contents.drawText('LEVEL:', 290 + 55, 30, 100, 24);
    this.contents.drawText(actor.level, 290 + 55, 30, 70, 24, 'right');
    // Draw Total PlayTime
    this.contents.drawText('TOTAL PLAYTIME:', 118, 55, 200, 24);
    this.contents.drawText(info.playtime, 295 + 55, 55, 100, 24);
    // Draw Location
    this.contents.drawText('LOCATION:', 118, 80, 200, 24);
    this.contents.drawText(info.location, 205, 80, 210, 24, 'right');
  }else{
    this._faceSprite.visible = false;
    this._selectedBG.visible = false;
  };

  // Draw Border
  this.contents.fillRect(102, 32, 3, 102, 'rgba(255, 255, 255, 1)')
  this.contents.fillRect(0, 29, 108, 3, 'rgba(255, 255, 255, 1)')
};




//=============================================================================
// ** Window_OmoriFileCommand
//-----------------------------------------------------------------------------
// The window for selecting a command on the menu screen.
//=============================================================================
function Window_OmoriFileCommand() { this.initialize.apply(this, arguments); }
Window_OmoriFileCommand.prototype = Object.create(Window_Command.prototype);
Window_OmoriFileCommand.prototype.constructor = Window_OmoriFileCommand;
//=============================================================================
// * Object Initialization
//=============================================================================
Window_OmoriFileCommand.prototype.initialize = function() {
  // Super Call
  Window_Command.prototype.initialize.call(this, 42, 28);
  // Setup File
  this.setupFile(true, true);
};
//=============================================================================
// * Settings
//=============================================================================
Window_OmoriFileCommand.prototype.isUsingCustomCursorRectSprite = function() { return true; };
Window_OmoriFileCommand.prototype.lineHeight = function () { return 24; };
Window_OmoriFileCommand.prototype.windowWidth = function () { return 140; };
Window_OmoriFileCommand.prototype.windowHeight = function () { return this._list.length*24+ 19; };
Window_OmoriFileCommand.prototype.standardPadding = function () { return 4; };
Window_OmoriFileCommand.prototype.numVisibleRows = function () { return 4; };
Window_OmoriFileCommand.prototype.maxCols = function () { return 1; };
Window_OmoriFileCommand.prototype.customCursorRectYOffset = function() { return 5; }
Window_OmoriFileCommand.prototype.customCursorRectTextXOffset = function() { return 40; }
//=============================================================================
// * Setup File
//=============================================================================
Window_OmoriFileCommand.prototype.setupFile = function (save, load) {
  // Set Save & Load Flags
  this._canSave = save; this._canLoad = load;
  if(!!this._canSave) {this.select(0);}
  else if(!!this._canLoad) {this.select(1)}
  // Refresh
  this.refresh();
};
//=============================================================================
// * Make Command List
//=============================================================================
Window_OmoriFileCommand.prototype.makeCommandList = function () {
  this.addCommand("SAVE", 'save', this._canSave);
  this.addCommand("LOAD", 'load', this._canLoad);
  this.addCommand("MOVE", 'move', this._canLoad);
  this.addCommand("RENAME", 'rename', this._canLoad);
  if(window.OMORI_CLOUD_SAVE !== undefined) this.addCommand("CLOUD",'cloud',window.OMORI_CLOUD_SAVE);
  
  this.addCommand("DELETE",'delete',this._canLoad);
};




//=============================================================================
// ** Window_OmoriFilePrompt
//-----------------------------------------------------------------------------
// The window for selecting a command on the menu screen.
//=============================================================================
function Window_OmoriFilePrompt() { this.initialize.apply(this, arguments); }
Window_OmoriFilePrompt.prototype = Object.create(Window_Command.prototype);
Window_OmoriFilePrompt.prototype.constructor = Window_OmoriFilePrompt;
//=============================================================================
// * Object Initialization
//=============================================================================
Window_OmoriFilePrompt.prototype.initialize = function() {
  // Super Call
  Window_Command.prototype.initialize.call(this, 0, 0);
  // Center Window
  this.x = (Graphics.width - this.width) / 2;
  this.y = (Graphics.height - this.height) / 2;
  // Create Cover Sprite
  this.createCoverSprite();
};
//=============================================================================
// * Create Background
//=============================================================================
Window_OmoriFilePrompt.prototype.createCoverSprite = function() {
  var bitmap = new Bitmap(Graphics.width, Graphics.height);
  bitmap.fillAll('rgba(0, 0, 0, 0.5)')
  this._coverSprite = new Sprite(bitmap);
  this._coverSprite.x = -this.x;
  this._coverSprite.y = -this.y;
  this.addChildAt(this._coverSprite, 0);
};
//=============================================================================
// * Openness
//=============================================================================
Object.defineProperty(Window.prototype, 'openness', {
  get: function() { return this._openness; },
  set: function(value) {
      if (this._openness !== value) {
        this._openness = value.clamp(0, 255);
        this._windowSpriteContainer.scale.y = this._openness / 255;
        this._windowSpriteContainer.y = this.height / 2 * (1 - this._openness / 255);

        if (this._coverSprite) { this._coverSprite.opacity = this._openness; };
      }
  },
  configurable: true
});
//=============================================================================
// * Settings
//=============================================================================
Window_OmoriFilePrompt.prototype.isUsingCustomCursorRectSprite = function() { return true; };
Window_OmoriFilePrompt.prototype.lineHeight = function () { return 22; };
Window_OmoriFilePrompt.prototype.windowWidth = function () { return 220; };
Window_OmoriFilePrompt.prototype.windowHeight = function () { return 70 + 20; };
Window_OmoriFilePrompt.prototype.standardPadding = function () { return 4; };
Window_OmoriFilePrompt.prototype.numVisibleRows = function () { return 2; };
Window_OmoriFilePrompt.prototype.maxCols = function () { return 1; };
Window_OmoriFilePrompt.prototype.customCursorRectXOffset = function() { return 50; }
Window_OmoriFilePrompt.prototype.customCursorRectYOffset = function() { return 33; }
Window_OmoriFilePrompt.prototype.customCursorRectTextXOffset = function() { return 80; }
Window_OmoriFilePrompt.prototype.customCursorRectTextYOffset = function() { return 28; }
//=============================================================================
// * Setup File
//=============================================================================
Window_OmoriFilePrompt.prototype.setPromptText = function (text) {
  // Set Prompt Text
  this._promptText = text;
  // Refresh Contents
  this.refresh();
};
//=============================================================================
// * Make Command List
//=============================================================================
Window_OmoriFilePrompt.prototype.makeCommandList = function () {
  this.addCommand("YES", 'ok');
  this.addCommand("NO", 'cancel');
};
//=============================================================================
// * Refresh
//=============================================================================
Window_OmoriFilePrompt.prototype.refresh = function () {
  // Super Call
  Window_Command.prototype.refresh.call(this);
  this.contents.drawText(this._promptText, 0, 0, this.contents.width, 24, 'center');
  
}




//=============================================================================
// ** Window_OmoriFileCommand
//-----------------------------------------------------------------------------
// The window for selecting a command on the menu screen.
//=============================================================================
function Window_OmoriFileStats() { this.initialize.apply(this, arguments); }
Window_OmoriFileStats.prototype = Object.create(Window_Base.prototype);
Window_OmoriFileStats.prototype.constructor = Window_OmoriFileStats;
//=============================================================================
// * Object Initialization
//=============================================================================
Window_OmoriFileStats.prototype.initialize = function() {

  Window_Base.prototype.initialize.call(this, 42, 154, this.windowWidth(), this.windowHeight());
};
//=============================================================================
// * Settings
//=============================================================================
Window_OmoriFileStats.prototype.isUsingCustomCursorRectSprite = function() { return true; };
Window_OmoriFileStats.prototype.lineHeight = function () { return 24; };
Window_OmoriFileStats.prototype.windowWidth = function () { return 140; };
Window_OmoriFileStats.prototype.windowHeight = function () { return 208; };
Window_OmoriFileStats.prototype.standardPadding = function () { return 4; };
Window_OmoriFileStats.prototype.numVisibleRows = function () { return 3; };
Window_OmoriFileStats.prototype.maxCols = function () { return 1; };
Window_OmoriFileStats.prototype.customCursorRectYOffset = function() { return 5; }
Window_OmoriFileStats.prototype.customCursorRectTextXOffset = function() { return 40; }
//=============================================================================
// * Make Command List
//=============================================================================
Window_OmoriFileStats.prototype.updateStats = function (valid, info, id) {
  this.contents.clear();
  this.contents.fontSize = 30;
  this.contents.drawText('FILE ' + id + ':', 1, 1, 130, this.contents.fontSize, 'center');
  if (valid) {
    this.contents.drawText(info.chapter, 1, 31, 130, this.contents.fontSize, 'center');
    var actor = info.actorData;
    // Draw Actor Name
    this.contents.fontSize = 24;
    // Draw Level
    this.contents.drawText('LEVEL: '+actor.level, 1, 67, 130, 24, 'center');
    // Draw Total PlayTime
    this.contents.drawText('PLAYTIME:', 1, 93, 130, 24, 'center');
    this.contents.drawText(info.playtime, 1, 117, 130, 24, 'center');
    // Draw Location
    this.contents.drawText('LOCATION:', 1, 143, 130, 24, 'center');
    this.contents.drawText(info.location, 1, 167, 130, 24, 'center');
  }
  var color = 'rgba(255, 255, 255, 1)';
  this.contents.fillRect(0, 64, this.contents.width, 3, color);
  this.contents.fillRect(8, 92, this.contents.width - 16, 1, color);
  this.contents.fillRect(8, 142, this.contents.width - 16, 1, color);
  this.contents.fillRect(8, 191, this.contents.width - 16, 1, color);
};
Scene_OmoriFile.prototype.createStatWindow = function() {
  // Create Prompt Window
  this._statWindow = new Window_OmoriFileStats();
  this._statWindow.y = this._commandWindow.height + this._commandWindow.y + 10;
  //this._statWindow.updateStats(null, null);
  // Set Handlers
  //this._statWindow.setHandler('ok', this.onPromptWindowOk.bind(this));
  //this._statWindow.setHandler('cancel', this.onPromptWindowCancel.bind(this));
  //this._statWindow.close();
  //this._statWindow.openness = 0;
  //this._statWindow.deactivate();
  this.addChild(this._statWindow);
};

//=============================================================================
// ** Sprite_OmoSaveMenuFace
//-----------------------------------------------------------------------------
// Animated Face Sprite for menus.
//=============================================================================
function Sprite_OmoSaveMenuFace() { this.initialize.apply(this, arguments);}
Sprite_OmoSaveMenuFace.prototype = Object.create(Sprite.prototype);
Sprite_OmoSaveMenuFace.prototype.constructor = Sprite_OmoSaveMenuFace;
//=============================================================================
// * Initialize Object
//=============================================================================
Sprite_OmoSaveMenuFace.prototype.initialize = function() {
  // Super Call
  Sprite.prototype.initialize.call(this);
  // Set Actor
  this._actor = null;
  // Animation Row
  this._animRow = 0;
  this._animDelay = this.defaultDelay();
  this._animFrame = 0;
  // Active Flag
  this._active = true;
  // In Menu Flag
  this._inMenu = false;
  // Set Face Width & Height
  this._faceWidth = 106;
  this._faceHeight = 102;
};
//=============================================================================
// * Update Bitmap
//=============================================================================
Sprite_OmoSaveMenuFace.prototype.updateBitmap = function() {
  // Get Actor
  var actor = this.actor
  // If Actor Exists and it has Battle Status Face Name
  if (actor) {
    faceName = actor.faceName;
    // Set Bitmap
    this.bitmap = ImageManager.loadFace(faceName);
  } else {
    this.bitmap = null;
  };
  // Update Frame
  this.updateFrame();
};



//=============================================================================
// * Actor
//=============================================================================
Object.defineProperty(Sprite_OmoSaveMenuFace.prototype, 'actor', {
  get: function() { return this._actor; },
  set: function(value) {
    // If Value is changing
    if (value !== this._actor) {
      this._actor = value;
      this.updateBitmap();
    }
  },
  configurable: true
})
//=============================================================================
// * Max Frames
//=============================================================================
Sprite_OmoSaveMenuFace.prototype.maxFrames = function() { return 3; };
//=============================================================================
// * Default Animation Delay
//=============================================================================
Sprite_OmoSaveMenuFace.prototype.defaultDelay = function() { return 12; };
//=============================================================================
// * Face Width & Height
//=============================================================================
Sprite_OmoSaveMenuFace.prototype.faceWidth = function() {  return this._faceWidth;  };
Sprite_OmoSaveMenuFace.prototype.faceHeight = function() {  return this._faceHeight; };
//=============================================================================
// * Activate & Deactivate
//=============================================================================
Sprite_OmoSaveMenuFace.prototype.activate   = function() { this._active = true; };
Sprite_OmoSaveMenuFace.prototype.deactivate = function() { this._active = false; };
//=============================================================================
// * Show & Hide
//=============================================================================
Sprite_OmoSaveMenuFace.prototype.show   = function() { this.visible = true; };
Sprite_OmoSaveMenuFace.prototype.hide = function() { this.visible = false; };
//=============================================================================
// * Update Frame
//=============================================================================
Sprite_OmoSaveMenuFace.prototype.setAnimRow = function(index) {
  // Set Animation Row
  this._animRow = index;
  // Update Frame
  this.updateFrame();
};
//=============================================================================
// * Frame Update
//=============================================================================
Sprite_OmoSaveMenuFace.prototype.update = function() {
  // Super Call
  Sprite.prototype.update.call(this);
  // If Active
  if (this._active) {
    // // If Animation Delay is more than 0
    if (this._animDelay > 0) {
      // Decrease Animation Value
      this._animDelay--;
    } else {
      // Reset Delay
      this._animDelay = this.defaultDelay();
      this._animFrame = (this._animFrame + 1) % this.maxFrames();
      // Update Frame
      this.updateFrame();
    };
  };
};
//=============================================================================
// * Update Frame
//=============================================================================
Sprite_OmoSaveMenuFace.prototype.updateFrame = function() {
  // Get Face Width & Height
  var fw = this.faceWidth(), fh = this.faceHeight();
  // Get Face X & Y
  var fx = (this._animFrame * fw);
  var fy = this._animRow * 106;
  // Set Frame
  this.setFrame(fx, fy, fw, fh);
};


function getBackground(location){
  switch(location){
    case "ORANGE OASIS":
      return [1,0];
    case "BLACK SPACE":
      return [2,0];
    case "PINWHEEL FOREST":
      return [3,0];
    case "VAST FOREST":
      return [3,1];
    case "FOREST PLAYGROUND":
      return [0,2];
      case "OTHERWORLD":
      return [2,1];
      case "JUNKYARD":
      return [1,2];
      case "LAST RESORT":
      return [0,1];
      case "DEEPER WELL":
      return [1,1];
      case "HUMPHREY":
      return [2,2];
      case "RAIN TOWN":
      return [3,2];
      case "SNOWGLOBE MOUNTAIN":
      return [0,3];
      case "FROZEN LAKE":
      return [1,3];
      case "BACKSTAGE":
      return [2,3];
      case "SPROUT MOLE VILLAGE":
      return [3,3];
      case "LOST LIBRARY":
      return [0,4];
      case "SWEETHEART'S CASTLE":
      return [1,4];
      case "PYREFLY FOREST":
      return [2,4];
      case "UNDERWATER HIGHWAY":
      return [3,4];
      case "BOSS RUSH":
      return [4,0];
      case "BASIL'S HOUSE":
      return [4,1];
      case "FARAWAY PARK":
      return [4,2];
      case "OUTSIDE":
      return [4,3];
      case "RECYCULTIST'S HQ":
      return [4,4];
      case "MOM'S ROOM":
      return [0,5];
      case "LOST FOREST":
      return [1,5];//i still need pictures of this :<
      case "NEIGHBOR'S ROOM":
      return [2,5];//i still need pictures of this :<
      case "THE ABYSS":
      return [3,5];
    default:
      return [0,0];
  }
};
