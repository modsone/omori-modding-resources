/*:
 * @plugindesc v03.31.09 Adds increased functionality to YAML messages.
 * cppensi p ix. c p : pee pee...
 * @author WHITENOISE & Bajamaid & TomatoRadio
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
 * Below is a list of parameters that can be used, both from basegame and this plugin:
 * 
 * =========== BASEGAME ===========
 * 
 * text: string ~ Bla bla bla
 * It's where the text goes.
 * 
 * faceset: string ~ DW_AUBREY_DIALOGUE
 * Same as before. It's the name of the sheet of faces that get used in the message. Stored in img/faces
 * 
 * faceindex: integer OR array ~ 16 OR [1,5]
 * This is the indivdual face in the above faceset being used.
 * A new feature is being able to use an Array.
 * This works like a standard grid, where the first value is the X axis and the second is the Y, going left and down respectively, both starting at 0.
 * The exact math is this: (((y * 4) - 4) + (x - 1))
 * 
 * background: integer ~ 0
 * This is the 'opaqueness' of the text box. 0 is fully Opaque, 1 is dimmed, and 2 is transparent.
 * 
 * facebackgroundcolor: hex OR rgba ~ #000000 OR rgba(0,0,0,1)
 * This is an unused feature from basegame, so I have no idea if it still works. 
 * But theoretically it would color the window behind the character face. If you input anything other than a color than it just reverts to nothing.
 * 
 * positionType: integer ~ 2
 * This is the alignment of the text box on either the screen, or if part of a GalvCaption, on the targeted event (If it's actually targeted to an event).
 * 0 is Top/Above, 1 is Middle/OnTopOf, 2 is Bottom/Below(This one is base)
 * 
 * =========== SOUNDS ===========
 * 
 * textsound: string ~ [SE]-Text
 * Sets the Text sound to the given string. Must be an SE in audio/se
 * 
 * textvolume: integer ~ 90
 * Sets the volume of said text sound.
 * 
 * textpitch: integer ~ 100
 * Sets the base pitch of said text sound.
 * 
 * textpitchvar: integer ~ 10
 * Sets the variance of the above pitch. This basically means it will randomly add or subtract this much from the base pitch.
 * 
 * textpan: integer ~ 0
 * Sets the base pan of the text sound. ie. Directional audio.
 * 
 * textpanvar: integer ~ 10
 * Sets the variance of the above pan.
 * 
 * sound: string ~ SE_Meow
 * Plays the sound at the start of the message. Must be an SE in audio/se
 * 
 * svolume: integer ~ 90
 * Sets the volume of said sound.
 * 
 * spitch: integer ~ 100
 * Sets the pitch of said sound.
 * 
 * span: integer ~ 0
 * Sets the pan of the sound.
 * 
 * msound: string ~ event_bride_absolute_evil
 * Plays the sound at the start of the message. Must be an ME in audio/me
 * 
 * mvolume: integer ~ 90
 * Sets the volume of said sound.
 * 
 * mpitch: integer ~ 100
 * Sets the pitch of said sound.
 * 
 * mpan: integer ~ 0
 * Sets the pan of the sound.
 * 
 * =========== TYPE ===========
 * 
 * type: string ~ window
 * This is used by the plugin to know what your message is for. There can be 3 values.
 * window - These are standard messages that display in the Overworld.
 * battle - These are messages that appear in battle textboxes.
 * caption (popup is also accepted) - These are messages for the GALV_TimedMessagePopups plugin, which I refer to as GalvCaptions due to the code.
 * 
 * =========== NAME ===========
 * 
 * name: string ~ LUCILLE
 * This will automatically convert the name listed into whatever format is used by the message type.
 * window - `\n<NAME>`
 * battle - `\>NAME: \<`
 * caption - `NAME: `
 * 
 * =========== PREFIX ===========
 * 
 * prefix: string ~ \oc[0]
 * This will add the listed text at the front of the main message.
 * It does not add a space automatically.
 * Best used with Macros.
 * 
 * =========== FONT ===========
 * 
 * name: string ~ NotoSans-Regular
 * This will set the rest of the message to that font. Identical to \fn<fontName>
 * 
 * =========== SHOW MONEY ===========
 * 
 * showmoney: boolean ~ true
 * This will display your money in the top right. Same as \$
 * 
 * =========== ARROWS =============
 * 
 * arrows: boolean ~ true
 * If set to true or false, will enable or disable the arrow on the battle textboxes.
 * Only works with the type set to 'battle'
 * If excluded this doesn't affect the switch at all.
 * 
 * =========== MACROS =============
 * 
 * macro: string ~ SMO2
 * If added, will apply the parameters set in the macro message from
 * your defined yaml.
 * Example Macro:
 * MAKOTO:
 *    faceset: Makoto_Everywhere
 *    name: MAKOTO
 *    windowskin: Window_Makoto
 *    textsound: dialogue_makoto_new
 * 
 * Then in a message like this:
 * MakotoDoesntUnderstandTheInternet:
 *    macro: MAKOTO
 *    faceindex: 6
 *    text: W-what is \"flickergooning?\"
 * 
 * If a parameter is defined in both the message and macro,
 * the message will take priority.
 * 
 * =========== CURSED WOODY ===========
 * 
 * cursedwoody: boolean ~ false
 * Don't use this.
 * 
 * =========== WINDOWSKINS : REQUIRES HIME_WindowSkinChange ===========
 * 
 * windowskin: string ~ Window_FemboyKenway
 * Sets the windowskin to the listed image. Must be in img/system. Reccomended that all Windowskins be placed in the reservedwindowskins Parameter
 *
 * =========== EXTRA FACES : REQUIRES Geo_RestoredGroupFaceboxes OR TRain_ExtraFaces ===========
 * 
 * extraFaces: object
 * Read the documentation of these plugins.
 * 
 * =========== MIRRORED TEXT : REQUIRES DGT_MirrorTextOrder ===========
 * 
 * mirror: boolean ~ true
 * If true, the text will be printed right-to-left.
 * 
 * =========== EXEC : REQUIRES TRain_TextEval ===========
 * 
 * openexec: js ~ console.log('ASS');
 * Runs the listed Javascript when the message begins.
 * 
 * endexec: js ~ SceneManager.terminate();
 * Runs the listed Javascript when the message is done drawing.
 * 
 * =========== MESSAGE WINDOW SHAPE : REQUIRES TRain_WinMsgShape ===========
 * 
 * windowx: integer OR null ~ 256
 * Sets the X position of the message window. null uses basegame.
 * 
 * windowy: integer OR null ~ 480
 * Sets the Y position of the message window. null uses basegame.
 * 
 * windowwidth: integer OR null ~ 143
 * Sets the width of the message window. null uses basegame.
 * 
 * windowheight: integer OR null ~ 42
 * Sets the height of the message window. null uses basegame.
 * 
 * NOTE: null here refers to null as a string. so "null", not null.
 * Using null will cause the game to skip it.
 * 
 * windowquickname: boolean ~ true
 * If true, the Namebox will open at its final position rather than moving in from the left side of the screen.
 * 
 * =========== GALVCAPTIONS : REQUIRES GALV_TimedMessagePopups ===========
 * AS A REMINDER THESE MUST ALL HAVE THE TYPE BE 'caption' OR 'popup'
 * 
 * target: fuck
 * This is where the popup will appear. Can be any of the following.
 * 0 - This Event (May break if other plugin commands are being ran while the message is up.)
 * -1 - Player
 * -2,-3,-4,etc. - Followers
 * 1,2,3,4,etc. - Event by ID
 * a1,a2,a3,etc. - Actor by ID
 * v1,v2,v3,etc. - Returns the value of the Variable by ID and uses that
 * x|y - Screen Coords
 * 
 * time: integer ~ 60
 * How long (in frames) the message will stay on screen.
 * 
 * delay: integer ~ 10
 * How long (in frames) between the command's execution and the actual display of the caption.
 * 
 * arrows: boolean ~ true
 * If the target is not the screen, then show an arrow pointing to the target.
 * These can be finicky at time.
 * 
 * Extra Notes about Captions:
 * - Windowskins work.
 * - Facesets work.
 * - Text is displayed instantly.
 * - PositionType matters for events and players.
 * - Use the script Galv.mpup.clear(); to remove all captions on-screen.
 * - The game uses drawText() rather than drawTextEx() for those who know which textcodes are attached to which.
 * 
 * Other Notes:
 * - Theoretically Geo's Restored Group Facesets should work
 * - The console will spit an error at you on boot about Window_GalvCaption not being defined. It doesn't actually cause any problems and can be ignored.
 * - All of the lines in haiku were made by TomatoRadio, so if you get pissy about something in there yell at her.
 * - Yes I know the plugin parameters look like shit but I don't care enough to change them and if you can't understand them you wouldn't get anything from changing them.
 * 
 * @param macroyaml
 * @text Macro Yaml
 * @desc The name of the yaml that contains all Macros
 * @default macro
 * 
 * @param bannedscenes
 * @text Banned Scenes
 * @desc The name of every scene that bans the changing of windowskins. Basically just add the scenes that crash the game.
 * @type []
 * @default ["Scene_OmoriPhotoAlbum","Scene_OmoriItemShop"]
 * 
 * @param reservedwindowskins
 * @text Reserved Windowskins
 * @desc The name of every reserved windowskin to preload.
 * @type []
 * @default ["Window"]
 * 
 * @param windowskin
 * @text Default Windowskin
 * @desc The name of the default windowskin to load when nothing is defined in the yaml.
 * @default Window
 * 
 * @param textsound
 * @text Default Text Sound
 * @desc The name of the default Text Sound to load when nothing is defined in the yaml.
 * @default [SE]-Text
 * 
 * @param textvolume
 * @text Default Text Volume
 * @desc The default Text Volume to load when nothing is defined in the yaml.
 * @default 100
 * 
 * @param textpitch
 * @text Default Text Pitch
 * @desc The default Text Pitch to load when nothing is defined in the yaml.
 * @default 100
 * 
 * @param textpitchvar
 * @text Default Text Pitch Variance
 * @desc The default Text Pitch Variance to load when nothing is defined in the yaml.
 * @default 10
 * 
 * @param textpan
 * @text Default Text Pan
 * @desc The default Text Pan to load when nothing is defined in the yaml.
 * @default 0
 * 
 * @param textpanvar
 * @text Default Text Pan Variance
 * @desc The default Text Pan Variance to load when nothing is defined in the yaml.
 * @default 10
 * 
 * @param textinterval
 * @text Default Text Sound Interval
 * @desc The default Text Sound Interval to load when nothing is defined in the yaml.
 * @default 2
 * 
 * @param svolume
 * @text Default SE Volume
 * @desc The default SE Volume to load when nothing is defined in the yaml.
 * @default 90
 * 
 * @param spitch
 * @text Default SE Pitch
 * @desc The default SE Pitch to load when nothing is defined in the yaml.
 * @default 100
 * 
 * @param span
 * @text Default SE Pan
 * @desc The default SE Pan to load when nothing is defined in the yaml.
 * @default 0
 * 
 * @param mvolume
 * @text Default ME Volume
 * @desc The default ME Volume to load when nothing is defined in the yaml.
 * @default 90
 * 
 * @param mpitch
 * @text Default ME Pitch
 * @desc The default ME Pitch to load when nothing is defined in the yaml.
 * @default 100
 * 
 * @param mpan
 * @text Default ME Pan
 * @desc The default ME Pan to load when nothing is defined in the yaml.
 * @default 0
 * 
 * @param mvolume
 * @text Default ME Volume
 * @desc The default ME Volume to load when nothing is defined in the yaml.
 * @default 90
 * 
 * @param background
 * @text Default Background Opacity
 * @desc The default Background Opacity to load when nothing is defined in the yaml.
 * @default 0
 * 
 * @param facebackgroundcolor
 * @text Default Face Background Color
 * @desc The default Face Background Color to load when nothing is defined in the yaml.
 * @default none
 * 
 * @param windowx
 * @text Default Window X Position
 * @desc The default Window X Position to load when nothing is defined in the yaml. Use null to use basegame.
 * @default null
 * 
 * @param windowy
 * @text Default Window Y Position
 * @desc The default Window Y Position to load when nothing is defined in the yaml. Use null to use basegame.
 * @default null
 * 
 * @param windowwidth
 * @text Default Window Width
 * @desc The default Window Width to load when nothing is defined in the yaml. Use null to use basegame.
 * @default null
 * 
 * @param windowheight
 * @text Default Window Height
 * @desc The default Window Height to load when nothing is defined in the yaml. Use null to use basegame.
 * @default null
 * 
 * @param windowquickname
 * @text Default Window Quick NameBox
 * @desc The default NameBox behavior to load when nothing is defined in the yaml.
 * @type boolean
 * @on QUICK
 * @off STANDARD
 * @default false
 * 
 * @param mirror
 * @text Default Mirror Text Order
 * @desc The default Text Order to load when nothing is defined in the yaml.
 * @type boolean
 * @on MIRRORED
 * @off STANDARD
 * @default false
 * 
 * @param positionType
 * @text Default Position Type
 * @desc The default Window Position Type to load when nothing is defined in the yaml.
 * @default 2
 * 
 * @param positionTypeCaption
 * @text Default Position Type (Caption)
 * @desc The default Window Position Type for Captions to load when nothing is defined in the yaml.
 * @default 0
 * 
 * @param target
 * @text Default Caption Target
 * @desc The default Caption Target to load when nothing is defined in the yaml.
 * @default 0
 * 
 * @param time
 * @text Default Caption Time
 * @desc The default Caption Time to load when nothing is defined in the yaml.
 * @default 60
 * 
 * @param delay
 * @text Default Caption Delay
 * @desc The default Caption Delay to load when nothing is defined in the yaml.
 * @default 0
 * 
 * @param arrows
 * @text Default Caption Arrows
 * @desc The default Caption Arrows to load when nothing is defined in the yaml.
 * @type boolean
 * @on ARROWS
 * @off NO ARROWS
 * @default false
 * 
 */

//Import info
var Imported = Imported || {};
Imported.DoubleExtendedYAML = true;

(function() {

// Defining shit
var WN = WN || {};
var TR = TR || {};
WN.DExtYAML = WN.DExtYAML || {};

// Params
WN.DExtYAML.Param = PluginManager.parameters('DoubleExtendedYAML');

// Macros
WN.DExtYAML.marcoyaml = WN.DExtYAML.Param["macroyaml"]

// BannedScenes
WN.DExtYAML.bannedScenes = JSON.parse(WN.DExtYAML.Param["bannedscenes"])

// Windowskins
WN.DExtYAML.reservedwindowskins = JSON.parse(WN.DExtYAML.Param["reservedwindowskins"])
WN.DExtYAML.windowskin = WN.DExtYAML.Param["windowskin"]

// Text Sounds
WN.DExtYAML.textsound = WN.DExtYAML.Param["textsound"]
WN.DExtYAML.textvolume = Number(WN.DExtYAML.Param["textvolume"])
WN.DExtYAML.textpitch = Number(WN.DExtYAML.Param["textpitch"])
WN.DExtYAML.textpitchvar = Number(WN.DExtYAML.Param["textpitchvar"])
WN.DExtYAML.textpan = Number(WN.DExtYAML.Param["textpan"])
WN.DExtYAML.textpanvar = Number(WN.DExtYAML.Param["textpanvar"])
WN.DExtYAML.textinterval = Number(WN.DExtYAML.Param["textinterval"])

// SE
WN.DExtYAML.svolume = Number(WN.DExtYAML.Param["svolume"])
WN.DExtYAML.spitch = Number(WN.DExtYAML.Param["spitch"])
WN.DExtYAML.span = Number(WN.DExtYAML.Param["span"])

// ME
WN.DExtYAML.mvolume = Number(WN.DExtYAML.Param["mvolume"])
WN.DExtYAML.mpitch = Number(WN.DExtYAML.Param["mpitch"])
WN.DExtYAML.mpan = Number(WN.DExtYAML.Param["mpan"])

// Background
WN.DExtYAML.background = Number(WN.DExtYAML.Param["background"])
WN.DExtYAML.facebackgroundcolor = WN.DExtYAML.Param["facebackgroundcolor"]

// TRain Msg Shapes
WN.DExtYAML.windowx = WN.DExtYAML.Param["windowx"]
WN.DExtYAML.windowy = WN.DExtYAML.Param["windowy"]
WN.DExtYAML.windowwidth = WN.DExtYAML.Param["windowwidth"]
WN.DExtYAML.windowheight = WN.DExtYAML.Param["windowheight"]
WN.DExtYAML.windowquickname = eval(WN.DExtYAML.Param["windowquickname"])

// Mirror
WN.DExtYAML.mirror = eval(WN.DExtYAML.Param["mirror"])

// Position Types
WN.DExtYAML.positionType = Number(WN.DExtYAML.Param["positionType"])
WN.DExtYAML.positionTypeCaption = Number(WN.DExtYAML.Param["positionTypeCaption"])

// GalvCaptions
WN.DExtYAML.target = Number(WN.DExtYAML.Param["target"])
WN.DExtYAML.time = Number(WN.DExtYAML.Param["time"])
WN.DExtYAML.delay = Number(WN.DExtYAML.Param["delay"])
WN.DExtYAML.arrows = eval(WN.DExtYAML.Param["arrows"])

if (!TR.NullCoal) {

/**
 * Returns the first item of the Array to not be
 * nullish (null or undefined).
 * @param {Array} operators An array of the operators.
 * @param {*} fallback The item to be returned if the entire Array is nullish. Defaults to null.
 * @return {*} The first item in the array to not be null or undefined.
 */
TR.NullCoal = function(operators, fallback = null) {
	for (const thing of operators) {
		if (thing !== undefined && thing !== null) {
			return thing;
		}
	}
	return fallback;
}

}

Game_Message.prototype.showLanguageMessage = function(code) {
  // CHECK FOR ALL PLUGINS SUPPORTED
  var HimeWindowSkin = !!TH && !!TH.WindowskinChange;
  var TRainEval = !!TR_TEval;
  var TRainMsgShape = !!TR_WMS;
  var DGTMirror = Imported.DGTMirrorText;
  var GalvCaptions = Imported.Galv_MessageCaptions;

  // ALL THE DATA FILES
  var data = LanguageManager.getMessageData(code);
  var macro = data.macro ? LanguageManager.getMessageData(`${WN.DExtYAML.marcoyaml}.${data.macro}`) : {}
  var base = WN.DExtYAML
  
  // GENERAL INFO
  var text = TR.NullCoal([data.text,macro.text],"");
  var type = TR.NullCoal([data.type,macro.type],"window");
  
  // WINDOWSKIN
  var windowskin = TR.NullCoal([data.windowskin,macro.windowskin,base.windowskin],"Window");
  if (HimeWindowSkin && windowskin && type != 'caption' && type != 'popup' && !WN.DExtYAML.bannedScenes.includes(SceneManager._scene.constructor.name)) {
    ImageManager.loadSystem(windowskin);
    $gameSystem.setWindowskin(windowskin);
  };

  // PREFIX
  var prefix = TR.NullCoal([data.prefix,macro.prefix],"");

  // TEXT SOUNDS
  var textsound = TR.NullCoal([data.textsound,macro.textsound,base.textsound],"[SE]-TEXT");  
  var textvolume = Number(TR.NullCoal([data.textvolume,macro.textvolume,base.textvolume],90));
  var textpitch = Number(TR.NullCoal([data.textpitch,macro.textpitch,base.textpitch],100));
  var textpitchvar = Number(TR.NullCoal([data.textpitchvar,macro.textpitchvar,base.textpitchvar],10));
  var textpan = Number(TR.NullCoal([data.textpan,macro.textpan,base.textpan],0));
  var textpanvar = Number(TR.NullCoal([data.textpanvar,macro.textpanvar,base.textpanvar],0));
  var textinterval = Number(TR.NullCoal([data.textinterval,macro.textinterval,base.textinterval],2));

  $gameSystem._msgSoundName = textsound;
  if (textsound == "OFF") {
    $gameSystem._msgSoundEnable = false
  } else {
    $gameSystem._msgSoundEnable = true
  }
  $gameSystem._msgSoundVol = textvolume;
  $gameSystem._msgSoundPitch = textpitch;
  $gameSystem._msgSoundPitchVar = textpitchvar;
  $gameSystem._msgSoundPan = textpan;
  $gameSystem._msgSoundPanVar = textpanvar;
  $gameSystem._msgSoundInterval = textinterval;
  
  // MESSAGE SE
  var SENAME = TR.NullCoal([data.sound,macro.sound],false);
  var spitch = TR.NullCoal([data.pitch,macro.pitch,base.spitch],100);
  var svolume = TR.NullCoal([data.volume,macro.volume,base.svolume],90);  
  var span = TR.NullCoal([data.pan,macro.pan,base.span],0);
  if (SENAME && SENAME !== 'STOP') {
    AudioManager.playSe({
      name: SENAME,
      volume: svolume,
      pitch: spitch,
      pan: span
    });
  } else if (SENAME == 'STOP') {
    AudioManager.stopSe()
  }

  // MESSAGE ME
  var MENAME = TR.NullCoal([data.msound,macro.msound],false);
  var mpitch = TR.NullCoal([data.mpitch,macro.mpitch,base.mpitch],100);
  var mvolume = TR.NullCoal([data.mvolume,macro.mvolume,base.mvolume],90);  
  var mpan = TR.NullCoal([data.mpan,macro.mpan,base.mpan],0);
  if (MENAME && MENAME !== 'STOP') {
    AudioManager.playMe({
      name: MENAME,
      volume: mvolume,
      pitch: mpitch,
      pan: mpan
    });
  } else if (MENAME == 'STOP') {
    AudioManager.stopMe()
  }
  
  // CURSED WOODY
  var cursedwoody = TR.NullCoal([data.cursedwoody,macro.cursedwoody],false);
  if (cursedwoody == true) {
       window.nw.Shell.openExternal('https://drive.google.com/file/d/1zTueKotsY5sBhZW_g0KI5P1iUoxFkeLa/view?usp=sharing');
       document.title = 'SHUT UP OMORI. ILL KILL YOU.'
     }

  // FACESETS
  var faceset = TR.NullCoal([data.faceset,macro.faceset],'');
  var faceindex = TR.NullCoal([data.faceindex,macro.faceindex],0);
  if (Array.isArray(faceindex)) { // Check for coordinate indexes
    let x = faceindex[0]
    let y = faceindex[1]
    faceindex = (((y * 4) - 4) + (x - 1))
  }
  this.setFaceImage(faceset, faceindex);
  
  // BACKGROUND
  var background = TR.NullCoal([data.background,macro.background,base.background],0);
  this.setBackground(background);

  // FACE BACKGROUND COLOR (I THINK THIS IS BROKEN BUT IDK)
  var facebackgroundcolor = TR.NullCoal([data.facebackgroundcolor,macro.facebackgroundcolor,base.facebackgroundcolor],"rgba(0,0,0,0)");
  this._faceBackgroundColor = this.makeFaceBackgroundColor(facebackgroundcolor, faceset, faceindex);

  // EXTRA FACES
  var extraFaces = TR.NullCoal([data.extraFaces,macro.extraFaces],false);
  // If Data has Extra Faces
  if (extraFaces) {
    // Go Through Extra Fraces
    for (var i = 0; i < extraFaces.length; i++) {
      // Get Face Data
      var face = extraFaces[i];
      // Set Extra Face
      this.setExtraFace(i, face.faceset, face.faceindex, this.makeFaceBackgroundColor(face.faceBackgroundColor,face.faceset, face.faceindex));
    };
  };

  // FONT
  var font = TR.NullCoal([data.font,macro.font],false) ? `\\fn<${TR.NullCoal([data.font,macro.font],false)}>` : "";

  // TROPHIC RAIN EXEC FUNCTIONS
  if (TRainEval) {
  var openexec = `\\EXEC<<${TR.NullCoal([data.openexec,macro.openexec],";")}>>`;
  var endexec = `\\EXEC<<${TR.NullCoal([data.endexec,macro.endexec],";")}>>`;
  } else {
  var openexec = ''
  var endexec = ''
  }

  // TROPHIC RAIN MSG SHAPE
  // These don't use TR.NullCoal due to null ("broken script refe-" *gets transformed into a birthing pregnant hyena*) nonsense
  var windowx = data.windowx !== undefined ? String(data.windowx) === 'null' ? null : Number(data.windowx) : macro.windowx !== undefined ? String(macro.windowx) === 'null' ? null : Number(macro.windowx) : String(WN.DExtYAML.windowx) === 'null' ? null : Number(WN.DExtYAML.windowx);
  var windowy = data.windowy !== undefined ? String(data.windowy) === 'null' ? null : Number(data.windowy) : macro.windowy !== undefined ? String(macro.windowy) === 'null' ? null : Number(macro.windowy) : String(WN.DExtYAML.windowy) === 'null' ? null : Number(WN.DExtYAML.windowy);
  var windowwidth = data.windowwidth !== undefined ? String(data.windowwidth) === 'null' ? null : Number(data.windowwidth) : macro.windowwidth !== undefined ? String(macro.windowwidth) === 'null' ? null : Number(macro.windowwidth) : String(WN.DExtYAML.windowwidth) === 'null' ? null : Number(WN.DExtYAML.windowwidth);
  var windowheight = data.windowheight !== undefined ? String(data.windowheight) === 'null' ? null : Number(data.windowheight) : macro.windowheight !== undefined ? String(macro.windowheight) === 'null' ? null : Number(macro.windowheight) : String(WN.DExtYAML.windowheight) === 'null' ? null : Number(WN.DExtYAML.windowheight);
  var windowquickname = data.windowquickname || macro.windowquickname || WN.DExtYAML.windowquickname;
  if (TRainMsgShape) {
    $gameSystem.TR_WMS.x = windowx;
    $gameSystem.TR_WMS.y = windowy;
    $gameSystem.TR_WMS.width = windowwidth;
    $gameSystem.TR_WMS.height = windowheight;
    $gameSystem.TR_WMS.quickNB = windowquickname;
  };

  // DRAUGHT MIRROR TEXT
  var mirror = TR.NullCoal([data.mirror,macro.mirror,base.mirror],false);
  if (mirror && DGTMirror) {
    mirror = [`\\OMIRROR[1]`,`\\OMIRROR[0]`]
  } else {
    mirror = ['','']
  }
  
  // SHOW MONEY
  var showmoney = TR.NullCoal([data.showmoney,macro.showmoney],false) ? "\\$" : ''

  // POPUPS
  var target = TR.NullCoal([data.target,macro.target,base.target],"0|0");
  var time = TR.NullCoal([data.time,macro.time,base.time],120);
  var delay = TR.NullCoal([data.delay,macro.delay,base.delay],0);
  var arrows
  if (type == 'battle') {
    arrows = TR.NullCoal([data.arrows,macro.arrows],false);
  } else {
    arrows = TR.NullCoal([data.arrows,macro.arrows,base.arrows],null);
  }

  // NAMES
  var name = TR.NullCoal([data.name,macro.name],"unDefined") === "unDefined" ? "" : 'TBD';
  if (name == 'TBD') {
    switch (type) {
      case 'window':
        name = `\\n<${TR.NullCoal([data.name,macro.name],"LUCILLE")}>`
        break;
      case 'battle':
        name = `\\>${TR.NullCoal([data.name,macro.name],"SMO2")}: \\<`
        break;
      case 'popup':
        name = `${TR.NullCoal([data.name,macro.name],"NATHAN")}: `
        break;
      case 'caption':
        name = `${TR.NullCoal([data.name,macro.name],"EXORI")}: `
        break;
    }
  }

  // POSITION TYPE
  var positionType = TR.NullCoal([data.positionType,macro.positionType],"TBD")
  if (positionType == 'TBD') {
    positionType = ((type == "popup") || (type == "caption")) ? WN.DExtYAML.positionTypeCaption : WN.DExtYAML.positionType
  }

  // POPUPS AGAIN LMAO
  if (((type == "popup") || (type == "caption")) && GalvCaptions) {
      if (target.toString().includes('|')) { //XY Location
        var xy = target.split('|')
        target = [Number(xy[0]),Number(xy[1])];
      } else if (target.toString().includes('a')) { // Actor
        var actorIndex = $gameActors.actor(Number(o[0].replace("a",""))).index();
		    if (actorIndex < 0) return;
		    target = -(actorIndex + 1);
      } else if (target.toString().includes('v')) { // Variable
        target = $gameVariables.value(Number(target.replace('v','')))
      } else {
        target = Number(target)
      }
    var txtArray = text.split('<br>')
    var captionData = [faceset,faceindex,0,2]
    if (arrows === true) Galv.Mpup.arrows = true;
    if (arrows === false) Galv.Mpup.arrows = false;
    if (arrows === null) Galv.Mpup.arrows = PluginManager.parameters('Galv_TimedMessagePopups')['Use Arrows'].toLowerCase() == 'true' ? true : false;;
    SceneManager._scene.createCaptionWindow(target,time,txtArray,captionData,delay,windowskin);
    return;
  } else if ((type == "popup") || (type == "caption") && !GalvCaptions) {
    console.warn(`Idiot Alert: Someone set the type of this message, ${code}, to be ${type} even tho they didn't install GalvCaptions. What? Do you need a link? Here: https://galvs-scripts.com/2016/03/23/mv-timed-message-popups/`)
  }
  //Arrows for battle
  if (type == 'battle' && arrows !== null && arrows !== undefined) {
    $gameSwitches.setValue(6,arrows);
  } 
  // COMPLETED MESSAGE
  var message = `${mirror[0]}${openexec}${showmoney}${font}${prefix}${name}${text}${endexec}${mirror[1]}`
  if (Imported && Imported.YEP_MessageCore) {
    this.addText(message);
  } else {
    this.add(message);
  };
};

var old_Scene_Boot_prototype_loadSystemWindowImage = Scene_Boot.prototype.loadSystemWindowImage;

Scene_Boot.prototype.loadSystemWindowImage = function() {
old_Scene_Boot_prototype_loadSystemWindowImage.call(this);
// Add reserved windowskins here.
ImageManager.reserveSystem("Window", 0, this._imageReservationId); //Even tho this is in the default I don't trust people.
  for (i=0;i<WN.DExtYAML.reservedwindowskins.length;i++) {
   if (systemFileExists(WN.DExtYAML.reservedwindowskins[i])) { // I also don't trust that the file they listed actually exists
      ImageManager.reserveSystem(WN.DExtYAML.reservedwindowskins[i],0,this._imageReservationId);
   } else {
    console.warn(`Idiot Alert: ${WN.DExtYAML.reservedwindowskins[i]} doesn't exist, yet SOMEONE tried putting it in the reservation list in DoubleExtenedYAML`)
   }
  }
};

//thx saffron for the code
systemFileExists = function(faceImage) {
  const fs = require('fs');
  const path = require("path");
  const base = path.dirname(process.mainModule.filename);
  //I'm too lazy to change the var name from faceImage to systemFile
  if (fs.existsSync(`${base}/img/system/${faceImage}.png`) || fs.existsSync(`${base}/img/system/${faceImage}.rpgmvp`)) {
    return true;
  } else {
    return false;
  };
};

//This is so that This Event in GalvCaptions works correctly.
WN.DExtYAML.pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
  if (!$gameParty.inBattle() && Imported.Galv_MessageCaptions) { //In battle the Interpreter is the Game_Troop which doesn't have an event ID
    Galv.Mpup.thisEvent = this._eventId;
  }
    // Return Original Function
  return WN.DExtYAML.pluginCommand.call(this, command, args);
};


})();
