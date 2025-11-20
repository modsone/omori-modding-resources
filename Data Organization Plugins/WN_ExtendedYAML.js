
/*:
 * @plugindesc v53.59 Adds increased functionality to YAML messages.
 * cppensi p ix. c p : pee pee...
 * @author WHITENOISE & Bajamaid
 *
 * 
 * @help
 * This plugin adds additional parameters for YAML messages that can be used for bonus
 * flair and such. Simply add the parameter to the same place where you would put the
 * "faceindex" and "faceset" parameters to use them. Example:
 * 
 * message_37:
 *     faceset: jerichoxkenway
 *     faceindex: 42
 *     windowskin: Window
 *     sound: talk3
 *     volume: 10
 *     pitch: 100
 *     pan: 0
 *     textsound: shovingaglassjarupmyass
 *     textvolume: 100
 *     text: this is a test message
 * 
 * Below is a list of parameters that can be used:
 * windowskin: (REQUIRES HIME_WindowSkinChange !!!) Changes the windowskin of the
 * message to the windowskin specified (use the filename of the windowskin,
 * windowskins should be placed to img/system).
 * If your windowskins are having trouble loading or showing black text, add your
 * windowskin to the reserved windowskins list in the bottom of the code of the
 * plugin file.
 * 
 * textsound: Changes the sound used for text. Uses sounds from the SE folder.
 * Use the name of the SE you want to change the sound to. Defaults to [SE]-TEXT
 * if not specified. Putting "OFF" as the text sound will disable text sounds entirely
 * for the message.
 * 
 * textvolume: Changes the volume of the text sound. Accepts values between 0-100. Defaults
 * to 100 if not specified.
 * 
 * sound: Plays a SE when the message is first played. Uses sounds from the SE folder.
 * Use the name of the SE you want to play.
 * 
 * volume: Specifies the volume of the sound played by the "sound" parameter. Takes
 * values between 0-100. Defaults to 90 if not specified.
 * 
 * pitch: Specifies the pitch of the sound played by the "sound" parameter. Takes
 * values between 1-100. Defaults to 100 if not specified.
 * 
 * pan: Specifies the panning of the sound played by the "sound" parameter. Takes
 * values between -100 to 100. Defaults to 0 (no panning) if not specified.
 * 
 * cursedwoody: Don't use this.
 */

Game_Message.prototype.showLanguageMessage = function(code) {
  // Get Message Data
  var data = LanguageManager.getMessageData(code);
  var windowskin = data.windowskin;
  var textsound = data.textsound || "[SE]-TEXT";  
  var textvolume = data.textvolume || 100;  
  var SENAME = data.sound;
  var spitch = data.pitch || 100;
  var svolume = data.volume || 90;    
  var span = data.pan || 0;
  var cursedwoody = data.cursedwoody || false;
  var faceset = data.faceset || "";
  var faceindex = data.faceindex || 0;
  var background = data.background || 0;
  var positionType = data.position === undefined ? 2 : data.position;
  // Set Message Properties
  this.setFaceImage(faceset, faceindex);
  if (windowskin) { 
    ImageManager.loadSystem(windowskin);
    $gameSystem.setWindowskin(windowskin);
      };
  if (SENAME) {
    AudioManager.playSe({
      name: SENAME,
      volume: svolume,
      pitch: spitch,
      pan: span
    });
  }
    $gameSystem._msgSoundName = textsound;
   if (textsound == "OFF") {
      $gameSystem._msgSoundEnable = true
     } else {$gameSystem._msgSoundEnable = true}
     $gameSystem._msgSoundVol = textvolume;

    if (cursedwoody == true) {
       window.open('https://drive.google.com/file/d/1zTueKotsY5sBhZW_g0KI5P1iUoxFkeLa/view?usp=sharing');
       document.title = 'SHUT UP OMORI. ILL KILL YOU.'
     }

  this.setBackground(background);
  this.setPositionType(positionType);
  this._faceBackgroundColor = this.makeFaceBackgroundColor(data.faceBackgroundColor, faceset, faceindex);
  if (Imported && Imported.YEP_MessageCore) {
    this.addText(data.text);
  } else {
    this.add(data.text);
  };
};


/*
var old_Scene_OmoriFile_prototype_loadReservedBitmaps = Scene_OmoriFile.prototype.loadReservedBitmaps;
Scene_OmoriFile.prototype.loadReservedBitmaps = function() {
ImageManager.reserveSystem("Windoweric");
ImageManager.reserveSystem("Windowtnr");
  old_Scene_OmoriFile_prototype_loadReservedBitmaps.call(this);
  // ImageManager.reserveSystem("Window", 0, this._imageReservationId);
  // Put your window images here using the function above if it doesn't load properly
};
*/

var old_Scene_Boot_prototype_loadSystemWindowImage = Scene_Boot.prototype.loadSystemWindowImage;

Scene_Boot.prototype.loadSystemWindowImage = function() {
old_Scene_Boot_prototype_loadSystemWindowImage.call(this);
// Add reserved windowskins here.
// This is going to make 30 hour load times surely (lol saffron)
ImageManager.reserveSystem("Window", 0, this._imageReservationId);
};
