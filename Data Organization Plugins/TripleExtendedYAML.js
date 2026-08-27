
/*:
 * @plugindesc v1.0 Extends the YAML Message functions
 * @author TomatoRadio
 *
 * 
 * @help
 * 
 * TripleExtendedYAML - v1.0.0
 * -----------------------------------------------------------------------------------
 * 
 * This plugin greatly extends the YAML Message function,
 * adding new parameters to messages that shortcut common needs.
 * 
 * -----------------------------------------------------------------------------------
 * 
 * Full Documentation:
 * (These are listed in the order they are handled by the code)
 * 
 * --- text - String ---
 * This is the text that is displayed when a message appears.
 * 
 * --- macro - Yaml Message / String ---
 * Assigns fallback values to parameters unassigned in the main message.
 * Can either be a full yaml call (yaml_name.macro_id) to grab from any
 * yaml, or a lone id that defaults to macros.yaml. (configurable in plugin code)
 * eg.
 * message_0:
 *    macro: aubrey
 *    faceindex: 2
 *    text: Hey guys!
 * 
 * # In macro.yaml
 * aubrey:
 *    faceset: MainCharacters_DreamWorld
 *    name: AUBREY
 * 
 * --- faceset - String ---
 * Assigns the faceset a message will use.
 * If the faceset is set to "" then it will be disabled.
 * 
 * --- faceindex - Integer ---
 * Assigns the index of the used faceset.
 * Unlike most parameters, this one is processed 
 * alongside 'faceset' in the code.
 * 
 * --- faceBackgroundColor - Color ---
 * Assigns a color to be drawn behind the face.
 * 
 * --- extraFaces - Array[Object] ---
 * Assigns extra faces to be used with Geo_RestoreGroupFaceboxes
 * or TRain_ExtraFaces.
 * Note that Extra Faces use the above three parameter names,
 * are seperately handled in code.
 * 
 * --- prefix - String ---
 * Adds the given text to the front of the 'text' value.
 * 
 * --- suffix - String ---
 * Appends the given text to the end of the 'text' value.
 * 
 * [For the upcoming plugins, VAL refers to the given value from the message.]
 * 
 * --- font - String ---
 * Prefixes \fn<VAL> to the front of the 'text' value.
 * 
 * --- name - String ---
 * Prefixes \n<VAL> to the front of the 'text' value.
 * 
 * --- battleName - String ---
 * Prefixes \>VAL: \< to the front of the 'text' value.
 * 
 * --- openExec - String ---
 * Prefixes \\exec<<VAL>> to the front of the 'text' value.
 * Requires TRain_TextEval to function.
 * 
 * --- endExec - String ---
 * Suffixes \\exec<<VAL>> to the end of the 'text' value.
 * Requires TRain_TextEval to function.
 * 
 * --- mirror - Boolean ---
 * Wraps \OMIRROR[1] + \OMIRROR[0] around the 'text' value.
 * Requires DGT_MirrorTextOrder to work.
 * 
 * --- mirror - Boolean ---
 * Wraps \OMIRROR[1] + \OMIRROR[0] around the 'text' value.
 * Requires DGT_MirrorTextOrder to work.
 * 
 * --- windowskin - String ---
 * Assigns the windowskin.
 * Requires HIME_WindowskinChange or an equivalent to work.
 * 
 * --- background - Integer ---
 * Assigns the opacity of the message box.
 * 0 - Opaque
 * 1 - Semi-Transparent
 * 2 - Clear
 * 
 * --- positionType - Integer ---
 * Assigns the position of the message box.
 * 0 - Top of Screen
 * 1 - Middle of Screen
 * 2 - Bottom of Screen
 * 
 * --- battleArrow - Boolean ---
 * Turns ON/OFF Switch #6, which controls the arrow in battle used
 * when the enemy is speaking. If undefined the switch is unchanged.
 * 
 * --- textSound - String ---
 * Assigns the text sound that is used when characters speak.
 * Supports TR_TextSoundArrays
 * 
 * --- textVolume - Number ---
 * Assigns the volume of text sounds.
 * 
 * --- textPitch - Number ---
 * Assigns the pitch of text sounds.
 * 
 * --- textPan - Number ---
 * Assigns the pan of text sounds.
 * 
 * --- textPitchVar - Number ---
 * Assigns a percent deviation of the pitch for text sounds.
 * 
 * --- textPanVar - Number ---
 * Assigns a percent deviation of the pan for text sounds.
 * 
 * --- textInterval - Number ---
 * Assigns the frequency that text sounds play.
 * 
 * --- se - AudioObject ---
 * Will play the give SE when the message begins.
 * 
 * --- me - AudioObject ---
 * Will play the give ME when the message begins.
 * 
 * --- windowShape - RectObject ---
 * Assigns the position and scale of the message window.
 * Requires TRain_WinMsgShape
 * 
 * --- popup - Object ---
 * Makes the message appear as a popup window.
 * Properties of popup:
 *   - target
 *   - time
 *   - delay
 *   - arrow
 *   - positionType
 * Requires Galv_TimedMessagePopups. See said plugin for documentation
 * of the above parameters.
 * 
 * -----------------------------------------------------------------------------------
 * 
 * For previous users of DoubleExtendedYAML, most things remain the same so here's
 * the main differences:
 * - Macros can be recursive (ie a macro can itself have a macro)
 * - Macros can call from multiple yaml files (yaml_file.macro)
 * - The SE and ME parameters are now consolodated objects (textSounds are unchanged)
 * - Former plugin parameters are configured in the plugin code now (this is to minimize
 * the likelihood of oneLoader parameter errors)
 * - The plugin no longer checks for required plugins, so be cautious of that.
 * - The plugin has been refactored to have each parameter as its own function; for
 * modders looking to add onto this plugin, see below on how.
 * 
 * -----------------------------------------------------------------------------------
 * 
 * Plugin Editing Info:
 * 
 * New YAML codes can be assigned through DataManager.addTextKey(code,func,rVar,before);
 * If you would like to add yours at the same time as the base, then you can 
 * monkeypatch DataManager.loadTExtYAML(); and append the keys at the end.
 * 
 * Now to breakdown the addTextKey function:
 * * - Optional
 * 
 * --- code ---
 * This is the name of key that will be used in yamls,
 * like faceset and positionType. These are case-sensitive.
 * 
 * --- func ---
 * This is a STRING name of the function that will be called
 * to handle your textcode. These functions are assigned to
 * Game_Message and will be explained further below.
 * 
 * --- rVar* ---
 * This handles values returned by your function.
 * Can be either "text", "data", or "kill".
 * 
 * If it's text, then the text value will be assigned to your return.
 * If it's data, then the message data (for this run not permanently)
 * will be assigned to your return.
 * 
 * If it's kill, then the message function will stop itself after your
 * function is ran. This is mainly for yamls that do something other
 * than displaying a message on the message window, like popups.
 * 
 * If left undefined the return value will be ignored.
 * --- before ---
 * This allows for key ordering.
 * 
 * If set to an existing textcode, the key will be placed before it
 * in the handling order.
 * 
 * If it doesn't exist it will simply be appended to the end of the
 * list like default.
 * 
 * ---
 * 
 * This is the format of the functions used to handle keycodes:
 * 
 * Game_Message.prototype.extYamlKeycode(value,data,text);
 * 
 * (Note that "extYamlKeycode" is whatever you assigned "func" to)
 * 
 * --- value ---
 * This is the value of the code as defined in the yaml.
 * 
 * --- data ---
 * This is the entire yaml object.
 * 
 * --- text ---
 * This is the text of the yaml.
 * 
 * -----------------------------------------------------------------------------------
 * 
 * Other notes:
 * - Macros only handle parameters at their top level,
 * so an SE can't be macro'd to change just the volume.
 * This is why textSounds are still seperate for now.
 * - The plugin comes with the Object.assignToCopy() function,
 * which behaves the same as Object.assign but makes a copy of target
 * instead of directly modifying it.
 * - Plugins of this scale are prone to bugs so please ping me with
 * any you find in the MODSPACE discord.
 * 
 * -----------------------------------------------------------------------------------
 * 
 * Changelog:
 * v1.0 - Release, see DExtYAML addressments for changes from DExtYAML.
 * 
 * -----------------------------------------------------------------------------------
 * 
 *  _____                     _       ______          _ _       
 * |_   _|                   | |      | ___ \        | (_)      
 *   | | ___  _ __ ___   __ _| |_ ___ | |_/ /__ _  __| |_  ___  
 *   | |/ _ \| '_ ` _ \ / _` | __/ _ \|    // _` |/ _` | |/ _ \ 
 *   | | (_) | | | | | | (_| | || (_) | |\ \ (_| | (_| | | (_) |
 *   \_/\___/|_| |_| |_|\__,_|\__\___/\_| \_\__,_|\__,_|_|\___/                                               
 * 
 * 
 */

//Import info
var Imported = Imported || {};
Imported.TripleExtendedYAML = true;

var TExtYAML = TExtYAML || {};


// If no YAML is given (no "." is found to be specific), then the game assumes this yaml
TExtYAML.macroYaml = "macros";

// These windowskins will be reserved on bootup.
TExtYAML.reservedWindowskins = ["Window"];

// These are the default parameters
TExtYAML.default = {
  faceindex: 0,
  //windowskin: "Window", //Disabled due to HIME_WindowskinChange not being basegame
  background: 0,
  positionType: 2,
  textSound: "[SE]-TEXT",
  textVolume: 50,
  textPitch: 100,
  textPan: 0,
  textPitchvar: 10,
  textPanvar: 10,
  textInterval: 2
};

Object.deepAssign = function(target,source,depth=0) {
  for (let key in source) {
    let sVal = source[key];
    let tVal = target[key];
    if (typeof tVal === "object" && !Array.isArray(tVal) && depth < 5) { // Objects
      Object.deepAssign(tVal,sVal,depth+1); // We cut recursion at 5 levels
    } else { // Non-objects
      target[key] = sVal;
    };
  };
  return target;
};

Object.assignToCopy = function(target,source) {
  let ret = {};
  for (let key in target) {
    ret[key] = target[key];
  };
  for (let key in source) {
    ret[key] = source[key];
  };
  return ret;
};

TExtYAML.isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
  if (!TExtYAML.isDatabaseLoaded.call(this)) return false;
  if (!TExtYAML._loadedDatabase) {
    this.loadTExtYAML();
    TExtYAML._loadedDatabase = true;
  };
  return true;
};
TExtYAML.textKeys = [];

DataManager.loadTExtYAML = function() {
  // "text" is processed before anything else
  this.addTextKey("macro","extYamlMacro","data");
  // Face stuff
  this.addTextKey("faceset","extYamlFaceset"); // "faceindex" is processed with "faceset"
  this.addTextKey("faceBackgroundColor","extYamlFaceBackgroundColor");
  this.addTextKey("extraFaces","extYamlExtraFaces");
  // Prefix-Typed
  this.addTextKey("prefix","extYamlPrefix","text");
  this.addTextKey("suffix","extYamlSuffix","text");
  this.addTextKey("font","extYamlFont","text");
  this.addTextKey("name","extYamlName","text");
  this.addTextKey("battleName","extYamlBattleName","text");
  this.addTextKey("openExec","extYamlOpenExec","text");
  this.addTextKey("endExec","extYamlEndExec","text");
  this.addTextKey("mirror","extYamlMirror","text");
  // Misc
  this.addTextKey("windowskin","extYamlWindowskin");
  this.addTextKey("background","extYamlBackground");
  this.addTextKey("positionType","extYamlPositionType");
  this.addTextKey("battleArrow","extYamlBattleArrow");
  this.addTextKey("textSound","extYamlTextSound");
  this.addTextKey("textVolume","extYamlTextVolume");
  this.addTextKey("textPitch","extYamlTextPitch");
  this.addTextKey("textPan","extYamlTextPan");
  this.addTextKey("textPitchVar","extYamlTextPitchVar");
  this.addTextKey("textPanVar","extYamlTextPanVar");
  this.addTextKey("textInterval","extYamlTextInterval");
  this.addTextKey("se","extYamlSe");
  this.addTextKey("me","extYamlMe");
  this.addTextKey("windowShape","extYamlWindowShape");
  this.addTextKey("popup","extYamlPopup","kill");
};

DataManager.addTextKey = function(key,func,rVar,before) {
  var obj = {key: key, func: func, rVar: rVar};
  if (before !== undefined) {
    let index = TExtYAML.textKeys.findIndex(function(obj) { return obj.key === before });
    if (index === -1) {
      console.warn(`Text key "${before}" not found. Adding to the end of the list.`);
    } else {
      TExtYAML.textKeys.splice(index,0,obj);
      return;
    };
  };
  TExtYAML.textKeys.push(obj);
};

Game_Message.prototype.showLanguageMessage = function(code) {
  // Base data
  var data = LanguageManager.getMessageData(code);
  var text = data.text;
  // For-Looping
  for (let obj of TExtYAML.textKeys) {
    if (data[obj.key] === undefined) continue;
    let value = data[obj.key];
    let result = this[obj.func](value,data,text);
    switch(obj.rVar) {
      case "data":data=result;break;
      case "text":text=result;break;
      case "kill":return;
    };
  };
  // Show the Message
  if (Imported && Imported.YEP_MessageCore) {
    this.addText(text);
  } else {
    this.add(text);
  };
};

Game_Message.prototype.extYamlMacro = function(value,data) {
  if (!value.includes(".")) value = "cap_sys_macros."+value;
  var macro = LanguageManager.getMessageData(value);
  while (macro.macro !== undefined) {
    let macro2 = LanguageManager.getMessageData(macro.macro);
    for (let key in macro2) {
      console.log(key);
      if (macro[key] === undefined || key === "macro") {macro[key] = macro2[key];};
    };
    if (macro2.macro === undefined) {macro.macro = undefined};
  };
  for (let key in macro) {
    if (data[key] === undefined) {data[key] = macro[key]};
  };
  data = Object.assignToCopy(TExtYAML.default,data);
  return data;
};

Game_Message.prototype.extYamlFaceset = function(faceset,data) {
  var faceindex = data.faceindex || 0;
  this.setFaceImage(faceset, faceindex);
};

Game_Message.prototype.extYamlFaceBackgroundColor = function(facebackgroundcolor,data) {
  // i'd use this.faceName() and this.faceIndex() but it's prob safer to grab from the yaml in-case edits are made to the faceset func
  var faceset = data.faceset || "";
  var faceindex = data.faceindex || 0;
  this._faceBackgroundColor = this.makeFaceBackgroundColor(facebackgroundcolor, faceset, faceindex);
};

Game_Message.prototype.extYamlExtraFaces = function(extraFaces) {
  for (var i = 0; i < extraFaces.length; i++) {
    let face = extraFaces[i];
    this.setExtraFace(i, face.faceset, face.faceindex, this.makeFaceBackgroundColor(face.faceBackgroundColor,face.faceset, face.faceindex));
  };
};

Game_Message.prototype.extYamlPrefix = function(prefix,data,text) {return prefix+text};
Game_Message.prototype.extYamlSuffix = function(suffix,data,text) {return text+suffix};
Game_Message.prototype.extYamlFont = function(font,data,text) {return `\\fn<${font}>`+text};
Game_Message.prototype.extYamlName = function(name,data,text) {return `\\n<${name}>`+text;};
Game_Message.prototype.extYamlBattleName = function(name,data,text) {return `\\>${name}: \\<`+text};
Game_Message.prototype.extYamlOpenExec = function(code,data,text) {return `\\exec<<${code}>>`+text};
Game_Message.prototype.extYamlEndExec = function(code,data,text) {return text+`\\exec<<${code}>>`};
Game_Message.prototype.extYamlMirror = function(bool,data,text) {return bool ? "\\OMIRROR[1]"+text+"\\OMIRROR[0]" : text};

Game_Message.prototype.extYamlWindowskin = function(windowskin) {
  ImageManager.loadSystem(windowskin);
  $gameSystem.setWindowskin(windowskin);
};

Game_Message.prototype.extYamlBackground = function(background) {this.setBackground(background)};
Game_Message.prototype.extYamlPositionType = function(positionType) {this.setPositionType(positionType)};
Game_Message.prototype.extYamlBattleArrow = function(bool) {$gameSwitches.setValue(6,bool);}

Game_Message.prototype.extYamlTextSound = function(val) {$gameSystem._msgSoundName = val;};
Game_Message.prototype.extYamlTextVolume = function(val) {$gameSystem._msgSoundVol = val;};
Game_Message.prototype.extYamlTextPitch = function(val) {$gameSystem._msgSoundPitch = val;};
Game_Message.prototype.extYamlTextPitchVar = function(val) {$gameSystem._msgSoundPitchVar = val;};
Game_Message.prototype.extYamlTextPan = function(val) {$gameSystem._msgSoundPan = val;};
Game_Message.prototype.extYamlTextPanVar = function(val) {$gameSystem._msgSoundPanVar = val;};
Game_Message.prototype.extYamlTextInterval = function(val) {$gameSystem._msgSoundInterval = val;};

Game_Message.prototype.extYamlSe = function(obj) {AudioManager.playSe(Object.assign({name: "", volume: 90, pitch: 100, pan: 0},obj));};
Game_Message.prototype.extYamlMe = function(obj) {AudioManager.playMe(Object.assign({name: "", volume: 90, pitch: 100, pan: 0},obj));};

Game_Message.prototype.extYamlWindowShape = function(obj) {
  $gameSystem.TR_WMS.x = obj.x !== undefined ? obj.x : null;
  $gameSystem.TR_WMS.y = obj.y !== undefined ? obj.y : null;
  $gameSystem.TR_WMS.width = obj.width !== undefined ? obj.width : null;
  $gameSystem.TR_WMS.height = obj.height !== undefined ? obj.height : null;
  $gameSystem.TR_WMS.quickNB = obj.quickNB !== undefined ? obj.quickNB : null;
};

Game_Message.prototype.extYamlPopup = function(obj,data,text) {
  var target = obj.target !== undefined ? obj.target : "0|0";
  var time = obj.time !== undefined ? obj.time : 120;
  var delay = obj.delay !== undefined ? obj.delay : 0;
  var arrow = obj.arrow !== undefined ? obj.arrow : false;
  var positionType = obj.positionType !== undefined ? obj.positionType : 0;
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
  var captionData = [data.faceset,data.faceindex,0,positionType];
  if (arrow === true) Galv.Mpup.arrows = true;
  if (arrow === false) Galv.Mpup.arrows = false;
  if (arrow === null) Galv.Mpup.arrows = PluginManager.parameters('Galv_TimedMessagePopups')['Use Arrows'].toLowerCase() == 'true' ? true : false;
  SceneManager._scene.createCaptionWindow(target,time,txtArray,captionData,delay,data.windowskin);
};

TExtYAML.loadSystemWindowImage = Scene_Boot.prototype.loadSystemWindowImage;
Scene_Boot.prototype.loadSystemWindowImage = function() {
TExtYAML.loadSystemWindowImage.call(this);
// Add reserved windowskins here.
ImageManager.reserveSystem("Window", 0, this._imageReservationId); //Even tho this is in the default I don't trust people.
  for (i=0;i<TExtYAML.reservedWindowskins.length;i++) {
   if (systemFileExists(TExtYAML.reservedWindowskins[i])) { // I also don't trust that the file they listed actually exists
      ImageManager.reserveSystem(TExtYAML.reservedWindowskins[i],0,this._imageReservationId);
   } else {
    console.error(`Reserved Window ${TExtYAML.reservedWindowskins[i]} doesn't exist.`)
   }
  }
};

//thx saffron for the code
systemFileExists = function(faceImage) {
  const fs = require('fs');
  const path = require("path");
  const base = path.dirname(process.mainModule.filename);
  if (fs.existsSync(`${base}/img/system/${faceImage}.png`) || fs.existsSync(`${base}/img/system/${faceImage}.rpgmvp`)) {
    return true;
  } else {
    return false;
  };
};