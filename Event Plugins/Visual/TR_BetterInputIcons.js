//=============================================================================
// Better Input Icons - By TomatoRadio
// TR_BetterInputIcons.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_BetterInputIcons = true;

var TR = TR || {};
TR.BII = TR.BII || {};

/*: 
 * @plugindesc v1.0 Allows for loading Input Icons as pictures and other images.
 * @author LaupigRadio
 * 
 * @help
 * 
 * This plugin allows for images to be replaced with the Input Icons,
 * which allows them to be used as a pictures, events, etc.
 * 
 * To do this, create a dummy image named 'DII_input',
 * with input being replaced with the key in question.
 * 
 * When this image is loaded, it will be replaced with the appropriate
 * Input Icon for the user.
 * 
 * In addition, adding '_pressed' at the end allows using the pressed down
 * versions of all icons.
 * 
 * Some examples:
 * 'DII_ok' - Returns the Z key for keyboard players, and the A button for controller players
 * 'DII_pageup' - Returns the LB button for controller players, and the Q key for keyboard players
 * 'DII_tag_pressed' - Returns the pressed down A key for keyboard players, and the pressed down Y button for controller players.
 * 
 * Also as a bonus feature, the \DII[] text code has been fixed to not eat up other text codes following it.
 * This means you can have more than one \DII in a message without errors.
 * 
*/

TR.BII.loadBitmap = ImageManager.loadBitmap;
ImageManager.loadBitmap = function(folder, filename, hue, smooth) {
	if (filename) {
    if (filename.toLowerCase().startsWith("dii_")) {
      const alt = filename.toLowerCase().endsWith("_pressed");
      const key = filename.toLowerCase().replace("dii_","").replace("_pressed","");
      if (Object.keyOf(Input.keyMapper,key)||Object.keyOf(Input.gamepadMapper,key)) {
        return Bitmap.loadInputIcon(key,alt);
      };
    };
	};
	return TR.BII.loadBitmap.call(this, folder, filename, hue, smooth);
};

Bitmap.loadInputIcon = function(key,alt=false) {
  var icons = !ConfigManager.gamepadTips ? 'keyboardBlack24' : "gamepadBlack24";
  var input = !ConfigManager.gamepadTips ? Input.keyMapper : Input.gamepadMapper;
  var data = LanguageManager.languageData().text.System.InputIcons[icons];
  var source = ImageManager.loadSystem('Input/' + data.source);
  // Get Rects
  var rects = data.rects[Object.keyOf(input,key)];
  let rectsFound = !!rects;
  // If Rects Don't Exist set it to empty
  if (rects === undefined) { rects = {
    "up": {x:0,y:0,width:24,height:24},
    "down": {x:24,y:0,width:24,height:24}
  }}
  // Get Rect
  var rect = alt ? rects.up : rects.down;
  var bitmap = new Bitmap(rect.width,rect.height);
  // Determine key type;
  let rectX = rect.x;
  if(!!rectsFound) {
    if(icons === "gamepadBlack24") {
      rectX -= bitmap.determineVendorRect();
    };
  };
  // Transfer Rect to self
  bitmap.bltImage(source, rectX, rect.y, rect.width, rect.height, 0, 0);
  return bitmap;
};

TR.BII.processEscapeCharacter = Window_Base.prototype.processEscapeCharacter;
Window_Base.prototype.processEscapeCharacter = function(code, textState) {
  if (code.toUpperCase() === 'DII'){ // Draw Input Icon
    // Get Match
    var match = /^\[(.+?)\]/.exec(textState.text.slice(textState.index));
    // Increase Text State Index
    textState.index += match[0].length;
    // Process Draw Input Icon
    this.processDrawInputIcon(match[1], textState)
    // console.log(code)
  } else {
    TR.BII.processEscapeCharacter.call(this,code,textState);
  };
};

Object.keyOf = function(obj,value) {
  for (const key in obj) {
    if (obj[key] === value) {
      return key;
    };
  };
  return null;
};