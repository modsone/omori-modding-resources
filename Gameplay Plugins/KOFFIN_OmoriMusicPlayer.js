//=============================================================================
// KOFFIN Music Player
// Version: 1.0
//=============================================================================
// Add to Imported List
var Imported = Imported || {};
Imported.KOFFIN_MusicPlayer = true;
var KOFFIN = KOFFIN || {};
KOFFIN.MusicPlayer = KOFFIN.MusicPlayer || {};

/*:
 * @plugindesc This plugin shows a music player menu where selecting a track plays its BGM,
 * can update the menu background, and offers transparent window and border options.
 * @author KoffinKrypt
 *
 * @help 
 * ---------------------------------------------------------------------------
 * Script Call:
 *   Scene_MusicPlayer.show();
 *
 * The first track ("Turn Off") will revert to the map's autoplay background music.
 * Additional tracks can be unlocked by setting the appropriate game switches.
 * 
 * In order to make changes and setup the tracklist, edit the code inside this plugin.
 *
 * Options:
 *   - Transparent Windows: Set KOFFIN.MusicPlayer.transparentWindows to true to make the header and item list window backgrounds transparent.
 *   - Transparent Window Borders: Set KOFFIN.MusicPlayer.transparentWindowBorders to true to remove the borders (only header and item list).
 *   - Background Image: Set KOFFIN.MusicPlayer.backgroundImage to the name of an image (placed in your img/pictures folder)
 *     to display it as a background behind all windows. Leave it blank ("") to show no image.
 *   - Keep Music On Close: Set KOFFIN.MusicPlayer.keepMusicOnClose to true to allow music to keep playing after closing the menu;
 *     set it to false to simulate the "Turn Off" option (reverting to the map's autoplay BGM).
 * 
 * Features:
 *   - Unlock Condition: In a track's definition, there's a "Unlock Switch" property, 
 *     which lets you assign a switch to unlock that track like this:  "unlockSwitch: 2" 
 *     this will make the track unlock when switch 2 is on. leave the unlockswitch at 0
 *     to make a track unlocked from the start.
 *   - Menu Background Change: In a track's definition, add a property "menu" with the image name.
 *     When that track is selected, the menu background will update to that image.
 *     e.g., { name: "Built to Scale", bgm: "00 BGM_BUILTTOSCALE", description: "Vex's battle theme.", menu: "MENU_2", unlockSwitch: 2001 }
 * ---------------------------------------------------------------------------
 */
/*
This is an example of what a YAML would look like for this.
soundtrack:
    header: TEXT #This is the text that will show in the header.
    headerSize: 48 #This is the fontSize of the header text.
    Title: #The order in the music player is based on yaml position, so this name doesn't matter.
      # This is the filename. It has to be a bgm. For single play songs you can give them custom looping that makes them loop silence.
      bgm: user_title
      # This is the actual OST title
      name: Title
      # These lines get quoted due to having colons in them. 
      description: "Composer: Pedro Silva\nThe title screen music."
      # This is the background picture to display for the song. If excluded it resorts to KOFFIN.MusicPlayer.backgroundImage (which you can change ingame)
      menu: white_screen 
      # This is the ID of the switch that must be active for the song to be displayed. 0 or exclusion makes it available at start.
      unlockSwitch: 122
      # These are the list of possible world values a song can appear in. World Value is variable 22 [1-DW,2-FA,3-WS,4-BS,5-FinalOmori]. 0 or exclusion makes it appear in all worlds.
      world: 0
*/

//=============================================================================
// Configurable Variables
//=============================================================================
KOFFIN.MusicPlayer.transparentWindows        = false;              // true = header & item list backgrounds are transparent.
KOFFIN.MusicPlayer.transparentWindowBorders   = false;              // true = remove borders (window frames) of header & item list.
KOFFIN.MusicPlayer.backgroundImage            = "";                 // Default background image (from img/pictures); leave "" for none.
KOFFIN.MusicPlayer.keepMusicOnClose           = true;              // true = keep music playing on close; false = simulate "Turn Off".
KOFFIN.MusicPlayer.yaml                       = "prl_sys_soundtrack"; // The YAML to obtain when getting song info.

//=============================================================================
// Define Music Tracks
//=============================================================================
var MusicPlayerTracks = [
    //{ name: "Turn Off", bgm: "default", description: "Reverts to the map's background music.", unlockSwitch: 0 },
]
if (KOFFIN.MusicPlayer.yaml) {
    var tracks = Object.values(LanguageManager.getMessageData(KOFFIN.MusicPlayer.yaml))
    for (let i = 1;i < tracks.length;i++) {
        MusicPlayerTracks.push(tracks[i])
    }
}

//=============================================================================
// Scene_MusicPlayer
//=============================================================================
function Scene_MusicPlayer() {
    this.initialize.apply(this, arguments);
}
Scene_MusicPlayer.prototype = Object.create(Scene_Base.prototype);
Scene_MusicPlayer.prototype.constructor = Scene_MusicPlayer;

Scene_MusicPlayer.show = function() {
    SceneManager.push(Scene_MusicPlayer);
};

Scene_MusicPlayer.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

Scene_MusicPlayer.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createBackground();
    this.createHeaderWindow();
    this.createItemListWindow();
    this.createHelpWindow();
};

Scene_MusicPlayer.prototype.createBackground = function() {
    // Use default background image if set.
    if (KOFFIN.MusicPlayer.backgroundImage && KOFFIN.MusicPlayer.backgroundImage !== "") {
        var bgBitmap = ImageManager.loadPicture(KOFFIN.MusicPlayer.backgroundImage);
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = bgBitmap;
        this._backgroundSprite.x = 0;
        this._backgroundSprite.y = 0;
        bgBitmap.addLoadListener(function() {
            this._backgroundSprite.scale.x = Graphics.boxWidth / bgBitmap.width;
            this._backgroundSprite.scale.y = Graphics.boxHeight / bgBitmap.height;
        }.bind(this));
        this.addChild(this._backgroundSprite);
    }
};

Scene_MusicPlayer.prototype.createHeaderWindow = function() {
    this._headerWindow = new Window_MusicPlayerHeader();
    this._headerWindow.x = 0;
    this._headerWindow.y = 0;
    this.addChild(this._headerWindow);
};

Scene_MusicPlayer.prototype.createItemListWindow = function() {
    this._itemListWindow = new Window_MusicPlayerItemList();
    this._itemListWindow.x = 0;
    this._itemListWindow.y = this._headerWindow.height;
    this._itemListWindow.setHandler('ok', this.onItemListOk.bind(this));
    this._itemListWindow.setHandler('cancel', this.popScene.bind(this));
    this.addChild(this._itemListWindow);
};

Scene_MusicPlayer.prototype.createHelpWindow = function() {
    this._helpWindow = new Window_MusicPlayerHelp();
    this._helpWindow.x = 0;
    this._helpWindow.y = 360;
    this.addChild(this._helpWindow);
    this._itemListWindow.setHelpWindow(this._helpWindow);
};

Scene_MusicPlayer.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    this._itemListWindow.refresh();
    this._itemListWindow.activate();
};

Scene_MusicPlayer.prototype.onItemListOk = function() {
    var track = this._itemListWindow.item();
    if (track) {
        // Play the selected track's BGM (or map's autoplay if "Turn Off")
        if (track.bgm === "default") {
            if ($dataMap && $dataMap.bgm && $dataMap.bgm.name) {
                AudioManager.playBgm($dataMap.bgm);
            } else {
                AudioManager.stopBgm();
            }
        } else {
            AudioManager.playBgm({ name: track.bgm, pan: 0, pitch: 100, volume: 90 });
        }
        // Update the menu background.
        if (track.menu) {
            // If a custom menu background is specified, load that image.
            var newBgBitmap = ImageManager.loadPicture(track.menu);
            newBgBitmap.addLoadListener(function() {
                if (!this._backgroundSprite) {
                    this._backgroundSprite = new Sprite();
                    this._backgroundSprite.x = 0;
                    this._backgroundSprite.y = 0;
                    this.addChildAt(this._backgroundSprite, 0);
                }
                this._backgroundSprite.bitmap = newBgBitmap;
                this._backgroundSprite.scale.x = Graphics.boxWidth / newBgBitmap.width;
                this._backgroundSprite.scale.y = Graphics.boxHeight / newBgBitmap.height;
            }.bind(this));
        } else {
            // No custom menu background specified: revert to the default background.
            if (KOFFIN.MusicPlayer.backgroundImage && KOFFIN.MusicPlayer.backgroundImage !== "") {
                var defaultBgBitmap = ImageManager.loadPicture(KOFFIN.MusicPlayer.backgroundImage);
                defaultBgBitmap.addLoadListener(function() {
                    if (!this._backgroundSprite) {
                        this._backgroundSprite = new Sprite();
                        this._backgroundSprite.x = 0;
                        this._backgroundSprite.y = 0;
                        this.addChildAt(this._backgroundSprite, 0);
                    }
                    this._backgroundSprite.bitmap = defaultBgBitmap;
                    this._backgroundSprite.scale.x = Graphics.boxWidth / defaultBgBitmap.width;
                    this._backgroundSprite.scale.y = Graphics.boxHeight / defaultBgBitmap.height;
                }.bind(this));
            } else {
                // If no default is set, clear the background.
                if (this._backgroundSprite) {
                    this._backgroundSprite.bitmap = null;
                }
            }
        }
    }
    SoundManager.playOk();
    this._itemListWindow.activate();
};


Scene_MusicPlayer.prototype.popScene = function() {
    SceneManager.pop();
};

Scene_MusicPlayer.prototype.terminate = function() {
    Scene_Base.prototype.terminate.call(this);
    if (!KOFFIN.MusicPlayer.keepMusicOnClose) {
        if ($dataMap && $dataMap.bgm && $dataMap.bgm.name) {
            AudioManager.playBgm($dataMap.bgm);
        } else {
            AudioManager.stopBgm();
        }
    }
};

//=============================================================================
// Window_MusicPlayerHeader
//=============================================================================
function Window_MusicPlayerHeader() {
    this.initialize.apply(this, arguments);
}
Window_MusicPlayerHeader.prototype = Object.create(Window_Base.prototype);
Window_MusicPlayerHeader.prototype.constructor = Window_MusicPlayerHeader;

Window_MusicPlayerHeader.prototype.initialize = function() {
    var width = Graphics.boxWidth / 2;
    var height = this.fittingHeight(1);
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this.backOpacity = KOFFIN.MusicPlayer.transparentWindows ? 0 : 255;
    this.refresh();
};

Window_MusicPlayerHeader.prototype.refresh = function() {
    this.contents.clear();
    this.contents.fontSize = LanguageManager.getMessageData(KOFFIN.MusicPlayer.yaml).headerSize
    this.drawText(LanguageManager.getMessageData(KOFFIN.MusicPlayer.yaml).header, 0, -5, this.contents.width, "center");
};

//=============================================================================
// Window_MusicPlayerItemList
//=============================================================================
function Window_MusicPlayerItemList() {
    this.initialize.apply(this, arguments);
}
Window_MusicPlayerItemList.prototype = Object.create(Window_Selectable.prototype);
Window_MusicPlayerItemList.prototype.constructor = Window_MusicPlayerItemList;

Window_MusicPlayerItemList.prototype.initialize = function() {
    var width = Graphics.boxWidth / 2;
    var height = Graphics.boxHeight * 0.60;
    Window_Selectable.prototype.initialize.call(this, 0, this.fittingHeight(1), width, height);
    this.backOpacity = KOFFIN.MusicPlayer.transparentWindows ? 0 : 255;
    this.refresh();
    this.select(0);
};

Window_MusicPlayerItemList.prototype.maxCols = function() {
    return 1;
};

Window_MusicPlayerItemList.prototype.itemHeight = function() {
    return this.lineHeight();
};

Window_MusicPlayerItemList.prototype.maxItems = function() {
    return this._data ? this._data.length : 0;
};

Window_MusicPlayerItemList.prototype.makeItemList = function() {
    var list = new Array()
    console.log(list)
    MusicPlayerTracks.forEach(function(track) {
        console.log(track)
        if (track) {
            if (!track.unlockSwitch || $gameSwitches.value(track.unlockSwitch)) { 
                if (!track.world || Number(track.world) === NaN) {
                    list.push(track); 
                } else {
                    if ($gameVariables.value(22) === track.world) { list.push(track);}
                }
            }
        }
        console.log(list)
    })
    this._data = list
};

Window_MusicPlayerItemList.prototype.item = function() {
    return this._data.length > 0 ? this._data[this.index()] : null;
};

Window_MusicPlayerItemList.prototype.refresh = function() {
    this.makeItemList();
    this.createContents();
    Window_Selectable.prototype.refresh.call(this);
};

Window_MusicPlayerItemList.prototype.drawItem = function(index) {
    var track = this._data[index];
    if (track) {
        var rect = this.itemRect(index);
        this.drawText(track.name, rect.x + 4, rect.y, rect.width - 4);
    }
};

Window_MusicPlayerItemList.prototype.updateHelp = function() {
    if (this._helpWindow) {
        var track = this.item();
        this._helpWindow.setText(track ? track.description : "");
    }
};

Window_MusicPlayerItemList.prototype.setHelpWindow = function(helpWindow) {
    this._helpWindow = helpWindow;
    this.callUpdateHelp();
};

//=============================================================================
// Window_MusicPlayerHelp
//=============================================================================
function Window_MusicPlayerHelp() {
    this.initialize.apply(this, arguments);
}
Window_MusicPlayerHelp.prototype = Object.create(Window_Base.prototype);
Window_MusicPlayerHelp.prototype.constructor = Window_MusicPlayerHelp;

Window_MusicPlayerHelp.prototype.initialize = function() {
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight / 4;
    Window_Base.prototype.initialize.call(this, Graphics.boxWidth / 2, this.fittingHeight(1), width, height);
    this.contents.fontSize = 20;
};

Window_MusicPlayerHelp.prototype.setText = function(text) {
    this.contents.clear();
    this.drawTextEx(text, 4, 0, this.contents.width - 8);
};

//=============================================================================
// Transparent Border Overrides
//=============================================================================
// If the flag is set, override the _refreshFrame method of header and item list windows.
if (KOFFIN.MusicPlayer.transparentWindowBorders) {
    Window_MusicPlayerHeader.prototype._refreshFrame = function() {};
    Window_MusicPlayerItemList.prototype._refreshFrame = function() {};
}

// Trans Rights!
