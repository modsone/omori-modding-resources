//=============================================================================
// ★ FD_WeatherExtension ★                                        1.1.2
//=============================================================================
/*:
 * @plugindesc v1.1.2 An extension to the Aries Weather Control plugin.
 * @author FruitDragon
 * 
 * @help
 * ★ FD_WeatherExtension ★                                        1.1.2
 * --------------------------------------------------------------------------
 * 
 * Currently overwrites part of the plugin Aries Weather Control. This plugin
 * must be placed anywhere underneath it in the plugin list.
 * 
 * Makes it possible to have more variety in weather. Examples include having
 * more than one leaf image at once or having tinted snow.
 * 
 * This plugin includes 6 plugin commands.
 * 
 * --------------------------------------------------------------------------
 * Plugin Commands
 * --------------------------------------------------------------------------
 * 
 * Plugin: SetList [weather] [filename1 filename2 filename3 ...]
 * 
 * Sets the list of images the plugin pulls from. Put as many as as you 
 * want in a single command.
 * [weather]: leaves, snow, embers, rain, storm, shine
 * 
 * --------------------------------------------------------------------------
 * 
 * Plugin: ResetList [weather]
 * 
 * Resets the chosen image list to the default from the plugin parameters.
 * [weather]: leaves, snow, embers, rain, storm, shine
 * 
 * --------------------------------------------------------------------------
 * 
 * Plugin: ClearList [weather]
 * 
 * Clears the chosen image list.
 * [weather]: leaves, snow, embers, rain, storm, shine
 * 
 * --------------------------------------------------------------------------
 * 
 * Plugin: SetTint [weather] [tint]
 * 
 * Sets the RGB tint of the chosen weather or effect.
 * [weather]: leaves, snow, embers, rain, storm, shine, screen
 * [tint]: RGB color scale value, except when chosen effect is Shine or Screen.
 *         If setting tint of Shine, use 'on' or 'off'.
 *         If setting tint of Screen, can use 'on' or 'off', or set RGB tint.
 * 
 * Examples:
 * 
 * SetTint embers 255 200 0
 * SetTint rain 0 0 0
 * SetTint shine on
 * SetTint screen off
 * SetTint screen 95 95 95
 * 
 * --------------------------------------------------------------------------
 * 
 * Plugin: ResetTint [weather]
 * 
 * Resets the chosen weather/effect tint to the default from the plugin parameters.
 * [weather]: leaves, snow, embers, rain, storm, shine, screen
 * 
 * --------------------------------------------------------------------------
 * 
 * Plugin: ClearTint [weather]
 * 
 * Turns off or clears tint for the chosen weather or effect.
 * [weather]: leaves, snow, embers, rain, storm, shine, screen
 * 
 * --------------------------------------------------------------------------
 * Changelog:
 * 
 * v1.0.0 Finished plugin!
 * 
 * v1.0.1 Minor edits, cleaned up plugin
 * 
 * v1.1.0 Added ability to control screen tint
 * 
 * v1.1.1 Fixed minor bug with screen tint on/off
 * 
 * v1.1.2 Fixed bug with plugin commands and params not working as intended
 * 
 * 
 * 
 * @param ---Image Lists---
 * @default
 * 
 * @param ---Tints---
 * @default
 * 
 * @param ---Screen Tint---
 * @default
 * 
 * @param LeafDefaultList
 * @text Default Leaf List
 * @type []
 * @parent ---Image Lists---
 * @desc A list of all the images that will be used for leaf images.
 * @default ["leaf"]
 * 
 * @param SnowDefaultList
 * @text Default Snow List
 * @type []
 * @parent ---Image Lists---
 * @desc A list of all the images that will be used for snow images.
 * @default ["snow"]
 * 
 * @param EmbersDefaultList
 * @text Default Embers List
 * @type []
 * @parent ---Image Lists---
 * @desc A list of all the images that will be used for embers images.
 * @default ["embers"]
 * 
 * @param RainDefaultList
 * @text Default Rain List
 * @type []
 * @parent ---Image Lists---
 * @desc A list of all the images that will be used for rain images.
 * @default ["rain"]
 * 
 * @param StormDefaultList
 * @text Default Storm List
 * @type []
 * @parent ---Image Lists---
 * @desc A list of all the images that will be used for storm images.
 * @default ["storm"]
 * 
 * @param ShineDefaultList
 * @text Default Shine List
 * @type []
 * @parent ---Image Lists---
 * @desc A list of all the images that will be used for shine images.
 * @default ["shine"]
 * 
 * @param LeafDefaultTint
 * @text Default Leaf Tint
 * @type struct<RGB>
 * @parent ---Tints---
 * @desc The default RGB value of the leaf tint. [0,0,0] means no tint.
 * @default {"red":"0","green":"0","blue":"0"}
 * 
 * @param SnowDefaultTint
 * @text Default Snow Tint
 * @type struct<RGB>
 * @parent ---Tints---
 * @desc The default RGB value of the snow tint. [0,0,0] means no tint.
 * @default {"red":"0","green":"0","blue":"0"}
 * 
 * @param EmbersDefaultTint
 * @text Default Embers Tint
 * @type struct<RGB>
 * @parent ---Tints---
 * @desc The default RGB value of the embers tint. [0,0,0] means no tint.
 * @default {"red":"255","green":"200","blue":"0"}
 * 
 * @param RainDefaultTint
 * @text Default Rain Tint
 * @type struct<RGB>
 * @parent ---Tints---
 * @desc The default RGB value of the rain tint. [0,0,0] means no tint.
 * @default {"red":"0","green":"0","blue":"0"}
 * 
 * @param StormDefaultTint
 * @text Default Storm Tint
 * @type struct<RGB>
 * @parent ---Tints---
 * @desc The default RGB value of the storm tint. [0,0,0] means no tint.
 * @default {"red":"0","green":"0","blue":"0"}
 * 
 * @param ShineDefaultTint
 * @text Default Shine Tint
 * @type boolean
 * @parent ---Tints---
 * @desc Whether Shine tint is on or not.
 * ON - true     OFF - false
 * @default true
 * 
 * @param ScreenTintOn
 * @text Screen Tint On
 * @type boolean
 * @parent ---Screen Tint---
 * @desc Whether the screen tint that appears at stronger weather levels is on or not.
 * ON - true     OFF - false
 * @default true
 * 
 * @param ScreenDefaultTint
 * @text Default Screen Tint
 * @type struct<RGB>
 * @parent ---Screen Tint---
 * @desc The RGB color of the tint that the screen takes on at stronger weather levels.
 * @default {"red":"95","green":"95","blue":"95"}
 */
/*~struct~RGB:
* 
* @param red
* @type number
* @min 0
* @max 255
* @desc Red value
*
* @param green
* @type number
* @min 0
* @max 255
* @desc Green value
* 
* @param blue
* @type number
* @min 0
* @max 255
* @desc Blue value
*
*/


var Imported = Imported || {};
Imported.FD_WeatherExtension = true;

var FD = FD || {};
FD.WeatherExtension = FD.WeatherExtension || {};
FD.WeatherExtension.Param = PluginManager.parameters('FD_WeatherExtension');

Aries.P003_WCT.DefaultLeafImageList =  JSON.parse(FD.WeatherExtension.Param["LeafDefaultList"])
Aries.P003_WCT.DefaultSnowImageList = JSON.parse(FD.WeatherExtension.Param["SnowDefaultList"])
Aries.P003_WCT.DefaultEmbersImageList = JSON.parse(FD.WeatherExtension.Param["EmbersDefaultList"])
Aries.P003_WCT.DefaultShineImageList = JSON.parse(FD.WeatherExtension.Param["ShineDefaultList"])
Aries.P003_WCT.DefaultRainImageList = JSON.parse(FD.WeatherExtension.Param["RainDefaultList"])
Aries.P003_WCT.DefaultStormImageList = JSON.parse(FD.WeatherExtension.Param["StormDefaultList"])

Aries.P003_WCT.LeafImageList = Aries.P003_WCT.DefaultLeafImageList;
Aries.P003_WCT.SnowImageList = Aries.P003_WCT.DefaultSnowImageList;
Aries.P003_WCT.EmbersImageList = Aries.P003_WCT.DefaultEmbersImageList;
Aries.P003_WCT.ShineImageList = Aries.P003_WCT.DefaultShineImageList;
Aries.P003_WCT.RainImageList = Aries.P003_WCT.DefaultRainImageList;
Aries.P003_WCT.StormImageList = Aries.P003_WCT.DefaultStormImageList;

Aries.P003_WCT.LeafBitmapList = []
Aries.P003_WCT.SnowBitmapList = []
Aries.P003_WCT.EmbersBitmapList = []
Aries.P003_WCT.ShineBitmapList = []
Aries.P003_WCT.RainBitmapList = []
Aries.P003_WCT.StormBitmapList = []

Aries.P003_WCT.NoTint = {}
Aries.P003_WCT.NoTint.red = 0
Aries.P003_WCT.NoTint.green = 0
Aries.P003_WCT.NoTint.blue = 0

Aries.P003_WCT.DefaultLeafTint = JSON.parse(FD.WeatherExtension.Param["LeafDefaultTint"])
Aries.P003_WCT.DefaultLeafTint.red = Number(Aries.P003_WCT.DefaultLeafTint.red)
Aries.P003_WCT.DefaultLeafTint.green = Number(Aries.P003_WCT.DefaultLeafTint.green)
Aries.P003_WCT.DefaultLeafTint.blue = Number(Aries.P003_WCT.DefaultLeafTint.blue)

Aries.P003_WCT.DefaultSnowTint = JSON.parse(FD.WeatherExtension.Param["SnowDefaultTint"])
Aries.P003_WCT.DefaultSnowTint.red = Number(Aries.P003_WCT.DefaultSnowTint.red)
Aries.P003_WCT.DefaultSnowTint.green = Number(Aries.P003_WCT.DefaultSnowTint.green)
Aries.P003_WCT.DefaultSnowTint.blue = Number(Aries.P003_WCT.DefaultSnowTint.blue)

Aries.P003_WCT.DefaultEmbersTint = JSON.parse(FD.WeatherExtension.Param["EmbersDefaultTint"])
Aries.P003_WCT.DefaultEmbersTint.red = Number(Aries.P003_WCT.DefaultEmbersTint.red)
Aries.P003_WCT.DefaultEmbersTint.green = Number(Aries.P003_WCT.DefaultEmbersTint.green)
Aries.P003_WCT.DefaultEmbersTint.blue = Number(Aries.P003_WCT.DefaultEmbersTint.blue)

Aries.P003_WCT.DefaultShineTint = eval(FD.WeatherExtension.Param["ShineDefaultTint"])

Aries.P003_WCT.DefaultRainTint = JSON.parse(FD.WeatherExtension.Param["RainDefaultTint"])
Aries.P003_WCT.DefaultRainTint.red = Number(Aries.P003_WCT.DefaultRainTint.red)
Aries.P003_WCT.DefaultRainTint.green = Number(Aries.P003_WCT.DefaultRainTint.green)
Aries.P003_WCT.DefaultRainTint.blue = Number(Aries.P003_WCT.DefaultRainTint.blue)

Aries.P003_WCT.DefaultStormTint = JSON.parse(FD.WeatherExtension.Param["StormDefaultTint"])
Aries.P003_WCT.DefaultStormTint.red = Number(Aries.P003_WCT.DefaultStormTint.red)
Aries.P003_WCT.DefaultStormTint.green = Number(Aries.P003_WCT.DefaultStormTint.green)
Aries.P003_WCT.DefaultStormTint.blue = Number(Aries.P003_WCT.DefaultStormTint.blue)

Aries.P003_WCT.DefaultScreenTint = JSON.parse(FD.WeatherExtension.Param["ScreenDefaultTint"])
Aries.P003_WCT.DefaultScreenTint.red = Number(Aries.P003_WCT.DefaultScreenTint.red)
Aries.P003_WCT.DefaultScreenTint.green = Number(Aries.P003_WCT.DefaultScreenTint.green)
Aries.P003_WCT.DefaultScreenTint.blue = Number(Aries.P003_WCT.DefaultScreenTint.blue)

Aries.P003_WCT.DefaultScreenTintOn = eval(FD.WeatherExtension.Param["ScreenTintOn"])

Aries.P003_WCT.LeafTint = Aries.P003_WCT.DefaultLeafTint
Aries.P003_WCT.SnowTint = Aries.P003_WCT.DefaultSnowTint
Aries.P003_WCT.EmbersTint = Aries.P003_WCT.DefaultEmbersTint
Aries.P003_WCT.ShineTint = Aries.P003_WCT.DefaultShineTint
Aries.P003_WCT.RainTint = Aries.P003_WCT.DefaultRainTint
Aries.P003_WCT.StormTint = Aries.P003_WCT.DefaultStormTint

Aries.P003_WCT.ScreenTint = Aries.P003_WCT.DefaultScreenTint
Aries.P003_WCT.ScreenTintOn = Aries.P003_WCT.DefaultScreenTintOn

// Adds the plugin commands
FD.WeatherExtension.GameInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command,args) {
    switch (command.toLowerCase()) {
        case 'setlist':
            Weather.prototype.handleSetList(args);
            return;
        case 'resetlist':
            Weather.prototype.handleResetList(args);
            return;
        case 'clearlist':
            Weather.prototype.handleClearList(args);
            return;
        case 'settint':
            Weather.prototype.handleSetTint(args);
            return;
        case 'resettint':
            Weather.prototype.handleResetTint(args);
            return;
        case 'cleartint':
            Weather.prototype.handleClearTint(args);
            return;
        default:
            FD.WeatherExtension.GameInterpreter_pluginCommand.call(this,command,args);
            return;
    }
};

Aries.P003_WCT.getLeafBitmap = function() {

    // if LeafBitmapList has at least 1, then pick random from there
    let leafList = Aries.P003_WCT.LeafBitmapList;
    if (leafList.length > 0) {

        return leafList[Math.randomInt(leafList.length)];

    }
    else {

        // Fallbacks to just getting default plugin leaf bitmap
        return Weather.prototype._createLeafBitmap();
    }

}

Aries.P003_WCT.getSnowBitmap = function() {

    // if SnowBitmapList has at least 1, then pick random from there
    let snowList = Aries.P003_WCT.SnowBitmapList;
    if (snowList.length > 0) {

        return snowList[Math.randomInt(snowList.length)];

    }
    else {

        // Fallbacks to just getting default plugin leaf bitmap
        return Weather.prototype._createSnowBitmap();
    }

}

Aries.P003_WCT.getEmbersBitmap = function() {

    // if EmbersBitmapList has at least 1, then pick random from there
    let embersList = Aries.P003_WCT.EmbersBitmapList;
    if (embersList.length > 0) {

        return embersList[Math.randomInt(embersList.length)];

    }
    else {

        // Fallbacks to just getting default plugin ember bitmap
        return Weather.prototype._createHeatBitmap();
    }

}

Aries.P003_WCT.getRainBitmap = function() {

    // if RainBitmapList has at least 1, then pick random from there
    let rainList = Aries.P003_WCT.RainBitmapList;
    if (rainList.length > 0) {

        return rainList[Math.randomInt(rainList.length)];

    }
    else {

        // Fallbacks to just getting default plugin rain bitmap
        return Weather.prototype._createRainBitmap()
    }

}

Aries.P003_WCT.getStormBitmap = function() {

    // if StormBitmapList has at least 1, then pick random from there
    let stormList = Aries.P003_WCT.StormBitmapList;
    if (stormList.length > 0) {

        return stormList[Math.randomInt(stormList.length)];

    }
    else {

        // Fallbacks to just getting default plugin storm bitmap
        return Weather.prototype._createStormBitmap()
    }

}

Aries.P003_WCT.getShineBitmap = function() {

    // if ShineBitmapList has at least 1, then pick random from there
    let shineList = Aries.P003_WCT.ShineBitmapList;
    if (shineList.length > 0) {

        return shineList[Math.randomInt(shineList.length)];

    }
    else {

        // Fallbacks to just getting default plugin shine bitmap
        return Weather.prototype._createMysticBitmap()
    }

}

Weather.prototype.handleSetList = function(args) {
    temp = args.shift().toLowerCase();
    if (temp === 'leaves') {
        Aries.P003_WCT.LeafImageList = args;
        this._createLeafBitmapList();
    }
    else if (temp === 'snow') {
        Aries.P003_WCT.SnowImageList = args;
        this._createSnowBitmapList();
    }
    else if (temp === 'embers') {
        Aries.P003_WCT.EmbersImageList = args;
        this._createHeatBitmapList();
    }
    else if (temp === 'shine') {
        Aries.P003_WCT.ShineImageList = args;
        this._createMysticBitmapList();
    }
    else if (temp === 'rain') {
        Aries.P003_WCT.RainImageList = args;
        this._createRainBitmapList();
    }
    else if (temp === 'storm') {
        Aries.P003_WCT.StormImageList = args;
        this._createStormBitmapList();
    }
    return;
}

Weather.prototype.handleResetList = function(args) {
    temp = args.shift().toLowerCase();
    if (temp === 'leaves') {
        Aries.P003_WCT.LeafImageList = Aries.P003_WCT.DefaultLeafImageList;
        this._createLeafBitmapList();
    }
    else if (temp === 'snow') {
        Aries.P003_WCT.SnowImageList = Aries.P003_WCT.DefaultSnowImageList;
        this._createSnowBitmapList();
    }
    else if (temp === 'embers') {
        Aries.P003_WCT.EmbersImageList = Aries.P003_WCT.DefaultEmbersImageList;
        this._createHeatBitmapList();
    }
    else if (temp === 'shine') {
        Aries.P003_WCT.ShineImageList = Aries.P003_WCT.DefaultShineImageList;
        this._createMysticBitmapList();
    }
    else if (temp === 'rain') {
        Aries.P003_WCT.RainImageList = Aries.P003_WCT.DefaultRainImageList;
        this._createRainBitmapList();
    }
    else if (temp === 'storm') {
        Aries.P003_WCT.StormImageList = Aries.P003_WCT.DefaultStormImageList;
        this._createStormBitmapList();
    }
    return;
}

Weather.prototype.handleClearList = function(args) {
    temp = args.shift();
    if (temp === 'leaves') {
        Aries.P003_WCT.LeafImageList = [];
        Aries.P003_WCT.LeafBitmapList = [];
    }
    else if (temp === 'snow') {
        Aries.P003_WCT.SnowImageList = [];
        Aries.P003_WCT.SnowBitmapList = [];
    }
    else if (temp === 'embers') {
        Aries.P003_WCT.EmbersImageList = [];
        Aries.P003_WCT.EmbersBitmapList = [];
    }
    else if (temp === 'shine') {
        Aries.P003_WCT.ShineImageList = [];
        Aries.P003_WCT.ShineBitmapList = [];
    }
    else if (temp === 'rain') {
        Aries.P003_WCT.RainImageList = [];
        Aries.P003_WCT.RainBitmapList = [];
    }
    else if (temp === 'shine') {
        Aries.P003_WCT.StormImageList = [];
        Aries.P003_WCT.StormBitmapList = [];
    }
    return;
}

Weather.prototype.handleSetTint = function(args) {
    temp = args.shift().toLowerCase();
    if (temp === 'leaves') {
        temp2 = Aries.P003_WCT.LeafTint
    }
    else if (temp === 'snow') {
        temp2 = Aries.P003_WCT.SnowTint
    }
    else if (temp === 'embers') {
        temp2 = Aries.P003_WCT.EmbersTint
    }
    else if (temp === 'shine') {

        if (args[0].toLowerCase() === 'on') {
            Aries.P003_WCT.ShineTint = true;
        }
        else if (args[0].toLowerCase() === 'off') {
            Aries.P003_WCT.ShineTint = false;
        }
        return;
    }
    else if (temp === 'screen') {

        if (args[0].toLowerCase() === 'on') {
            Aries.P003_WCT.ScreenTintOn = true;
            return;
        }
        else if (args[0].toLowerCase() === 'off') {
            Aries.P003_WCT.ScreenTintOn = false;
            return;
        }
        else {
            temp2 = Aries.P003_WCT.ScreenTint
        }

    }
    else if (temp === 'rain') {
        temp2 = Aries.P003_WCT.RainTint
    }
    else if (temp === 'storm') {
        temp2 = Aries.P003_WCT.StormTint
    }
    temp2.red = Number(args[0]) 
    temp2.green = Number(args[1])
    temp2.blue = Number(args[2])
    return;
}

Weather.prototype.handleResetTint = function(args) {
    temp = args.shift().toLowerCase();
    if (temp === 'leaves') {
        Aries.P003_WCT.LeafTint = Aries.P003_WCT.DefaultLeafTint
    }
    else if (temp === 'snow') {
        Aries.P003_WCT.SnowTint = Aries.P003_WCT.DefaultSnowTint
    }
    else if (temp === 'embers') {
        Aries.P003_WCT.EmbersTint = Aries.P003_WCT.DefaultEmbersTint
    }
    else if (temp === 'shine') {
        Aries.P003_WCT.ShineTint = Aries.P003_WCT.DefaultShineTint
    }
    else if (temp === 'rain') {
        Aries.P003_WCT.RainTint = Aries.P003_WCT.DefaultRainTint
    }
    else if (temp === 'storm') {
        Aries.P003_WCT.StormTint = Aries.P003_WCT.DefaultStormTint
    }
    else if (temp === 'screen') {
        Aries.P003_WCT.ScreenTint = Aries.P003_WCT.DefaultScreenTint
        Aries.P003_WCT.ScreenTintOn = Aries.P003_WCT.DefaultScreenTintOn
    }
    return;
}

Weather.prototype.handleClearTint = function(args) {
    temp = args.shift().toLowerCase();
    if (temp === 'leaves') {
        Aries.P003_WCT.LeafTint = Aries.P003_WCT.NoTint
    }
    else if (temp === 'snow') {
        Aries.P003_WCT.SnowTint = Aries.P003_WCT.NoTint
    }
    else if (temp === 'embers') {
        Aries.P003_WCT.EmbersTint = Aries.P003_WCT.NoTint
    }
    else if (temp === 'shine') {
        Aries.P003_WCT.ShineTint = false
    }
    else if (temp === 'rain') {
        Aries.P003_WCT.RainTint = Aries.P003_WCT.NoTint
    }
    else if (temp === 'storm') {
        Aries.P003_WCT.StormTint = Aries.P003_WCT.NoTint
    }
    else if (temp === 'screen') {
        Aries.P003_WCT.ScreenTintOn = false
    }
    return;
}

Weather.prototype._addSprite=function(){
    var sprite=new Sprite_Weather(this.viewport);
    switch(this.type){
        case 'rain':
            var life=Aries.P003_WCT.RainLife;
            var size=0.01*((100-Aries.P003_WCT.RainSizeV)+Math.randomInt(1+Aries.P003_WCT.RainSizeV*2));
            var getangle=((Aries.P003_WCT.RainAngleC-Aries.P003_WCT.RainAngleV)+Math.randomInt(1+Aries.P003_WCT.RainAngleV*2));
            var alpha=((Aries.P003_WCT.RainAlphaC-Aries.P003_WCT.RainAlphaV)+Math.randomInt(1+Aries.P003_WCT.RainAlphaV*2));
            sprite.setUp('rain',life,size,getangle,alpha);
            sprite.blendMode=PIXI.BLEND_MODES.NORMAL;
            sprite.bitmap= Aries.P003_WCT.getRainBitmap();
            break;
        case 'storm':
            var life=Aries.P003_WCT.StormLife;
            var size=0.01*((100-Aries.P003_WCT.StormSizeV)+Math.randomInt(1+Aries.P003_WCT.StormSizeV*2));
            var getangle=((Aries.P003_WCT.StormAngleC-Aries.P003_WCT.StormAngleV)+Math.randomInt(1+Aries.P003_WCT.StormAngleV*2));
            var alpha=((Aries.P003_WCT.StormAlphaC-Aries.P003_WCT.StormAlphaV)+Math.randomInt(1+Aries.P003_WCT.StormAlphaV*2));
            sprite.setUp('storm',life,size,getangle,alpha);
            sprite.blendMode=PIXI.BLEND_MODES.NORMAL;
            sprite.bitmap= Aries.P003_WCT.getStormBitmap();
            break;
        case 'snow':
            var life=Aries.P003_WCT.SnowLife;
            var size=0.01*((100-Aries.P003_WCT.SnowSizeV)+Math.randomInt(1+Aries.P003_WCT.SnowSizeV*2));
            var getangle=(-1+Math.randomInt(3))*0.267;
            var alpha=((Aries.P003_WCT.SnowAlphaC-Aries.P003_WCT.SnowAlphaV)+Math.randomInt(1+Aries.P003_WCT.SnowAlphaV*2));
            var snowspeed=1.33+Math.randomInt(2);
            sprite.setUp('snow',life,size,getangle,alpha,snowspeed);
            sprite.blendMode=PIXI.BLEND_MODES.NORMAL;
            sprite.bitmap= Aries.P003_WCT.getSnowBitmap();
            break;
        case 'leaves':
            var life=Aries.P003_WCT.LeafLife;
            var size=0.007*((100-Aries.P003_WCT.LeafSizeV)+Math.randomInt(1+Aries.P003_WCT.LeafSizeV*2));
            var getangle=Aries.P003_WCT.LeafSpeedV;
            var alpha=255;
            var snowspeed=0.83+Math.randomInt(2)
            sprite.setUp('leaves',life,size,getangle,alpha,snowspeed);
            sprite.blendMode=PIXI.BLEND_MODES.NORMAL;
            //Makes the bitmap saved locally per sprite.
            sprite.bitmap = Aries.P003_WCT.getLeafBitmap();
            break;
        case 'embers':
            var life=Aries.P003_WCT.HeatLife;
            var size=0.007*((100-Aries.P003_WCT.HeatSizeV)+Math.randomInt(1+Aries.P003_WCT.HeatSizeV*2))
            var getangle=Aries.P003_WCT.HeatSpeedV;
            var alpha=255;
            var snowspeed=0.83+Math.randomInt(2)
            sprite.setUp('embers',life,size,getangle,alpha,snowspeed);
            sprite.blendMode=PIXI.BLEND_MODES.NORMAL;
            sprite.bitmap= Aries.P003_WCT.getEmbersBitmap();
            break;
        case 'shine':
            var life=Aries.P003_WCT.MysticLife;
            var size=0.007*((100-Aries.P003_WCT.MysticSizeV)+Math.randomInt(1+Aries.P003_WCT.MysticSizeV*2));
            var getangle=12;
            var alpha=((Aries.P003_WCT.MysticAlphaC-Aries.P003_WCT.MysticAlphaV)+Math.randomInt(1+Aries.P003_WCT.MysticAlphaV*2));
            var snowspeed=0.25*(2+Math.randomInt(3));
            sprite.setUp('shine',life,size,getangle,alpha,snowspeed);
            sprite.rotation=Math.random();
            sprite.opacity=0;
            sprite.bitmap= Aries.P003_WCT.getShineBitmap();
            break
    }
    sprite.opacity=0;
    this._sprites.push(sprite);
    this.addChild(sprite)
};

Weather.prototype._createBitmaps=function(){
    this._createRainBitmapList();
    this._createStormBitmapList();
    this._createSnowBitmapList();
    //Creates the list of leaf bitmaps.
    this._createLeafBitmapList();
    this._createHeatBitmapList();
    this._createMysticBitmapList();
};

//Creates the list of leaf bitmaps.
Weather.prototype._createLeafBitmapList=function(){
    Aries.P003_WCT.LeafBitmapList = []
    for (let i = 0; i < Aries.P003_WCT.LeafImageList.length; i++) {
        Aries.P003_WCT.LeafBitmapList.push(ImageManager.loadPicture(Aries.P003_WCT.LeafImageList[i]))
    }
};

//Creates the list of snow bitmaps.
Weather.prototype._createSnowBitmapList=function(){
    Aries.P003_WCT.SnowBitmapList = []
    for (let i = 0; i < Aries.P003_WCT.SnowImageList.length; i++) {
        Aries.P003_WCT.SnowBitmapList.push(ImageManager.loadPicture(Aries.P003_WCT.SnowImageList[i]))
    }
};

//Creates the list of embers bitmaps
Weather.prototype._createHeatBitmapList=function(){
    Aries.P003_WCT.EmbersBitmapList = []
    for (let i = 0; i < Aries.P003_WCT.EmbersImageList.length; i++) {
        Aries.P003_WCT.EmbersBitmapList.push(ImageManager.loadPicture(Aries.P003_WCT.EmbersImageList[i]))
    }
};

//Creates the list of rain bitmaps
Weather.prototype._createRainBitmapList=function(){
    Aries.P003_WCT.RainBitmapList = []
    for (let i = 0; i < Aries.P003_WCT.RainImageList.length; i++) {
        Aries.P003_WCT.RainBitmapList.push(ImageManager.loadPicture(Aries.P003_WCT.RainImageList[i]))
    }
};

//Creates the list of storm bitmaps
Weather.prototype._createStormBitmapList=function(){
    Aries.P003_WCT.StormBitmapList = []
    for (let i = 0; i < Aries.P003_WCT.StormImageList.length; i++) {
        Aries.P003_WCT.StormBitmapList.push(ImageManager.loadPicture(Aries.P003_WCT.StormImageList[i]))
    }
};

//Creates the list of shine bitmaps
Weather.prototype._createMysticBitmapList=function(){
    Aries.P003_WCT.ShineBitmapList = []
    for (let i = 0; i < Aries.P003_WCT.ShineImageList.length; i++) {
        Aries.P003_WCT.ShineBitmapList.push(ImageManager.loadPicture(Aries.P003_WCT.ShineImageList[i]))
    }
};

//Original included an update bitmap line. This was removed.
Weather.prototype._updateLeafSprite=function(sprite){
    sprite.rotation+=0.025*sprite._anglev;
    sprite.ax+=2*Math.sin(0.0078*sprite._randomSeed);
    sprite.ay+=sprite._snowSpeed
};

Weather.prototype._updateSnowSprite=function(sprite){
    sprite.ax+=sprite._anglev;
    sprite.ay+=sprite._snowSpeed
};

Weather.prototype._updateHeatSprite=function(sprite){
    sprite.ax+=2*Math.sin(0.0139*sprite._randomSeed);
    sprite.ay-=sprite._snowSpeed
};

Weather.prototype._updateRainSprite=function(sprite){
    sprite.rotation=sprite._anglev*(Math.PI/180);
    var velocity=sprite.getVelocity(Aries.P003_WCT.RainSpeed);
    sprite.ax+=velocity[0];
    sprite.ay+=velocity[1]
};

Weather.prototype._updateStormSprite=function(sprite){
    sprite.rotation=sprite._anglev*(Math.PI/180);
    var velocity=sprite.getVelocity(Aries.P003_WCT.StormSpeed);
    sprite.ax+=velocity[0];sprite.ay+=velocity[1]
};

Weather.prototype._updateMysticSprite=function(sprite){
    //for some reason shine doesnt rotate i guess lol
};

Sprite_Weather.prototype.setUp=function(type,life,size,getangle,alpha,snowSpeed=0){
    this._type=type;
    this._lifetime=life+Math.randomInt(life*0.25);
    this._size=size;
    this._anglev=getangle;
    this._alpha=alpha;
    this._snowSpeed=snowSpeed
    this._randomSeed=Math.randomInt(16777216);
    if(this._type==='shine'){
        this.scale.x=0;
        this.scale.y=0;
        this.anchor=new Point(0.5,0.5);
        this.blendMode=PIXI.BLEND_MODES.ADD;
        if (Aries.P003_WCT.ShineTint) {
            this.setColorTone([Math.randomInt(2)*-255,Math.randomInt(2)*-255,Math.randomInt(2)*-255,0])
        }
    }
    else if(this._type==='leaves'){
        this.scale.x=1;
        this.scale.y=1;
        this.anchor=new Point(0.5,0.5);
        this.blendMode=PIXI.BLEND_MODES.NORMAL;
        temp2 = Aries.P003_WCT.LeafTint;
        this.setColorTone([temp2.red,temp2.green,temp2.blue,0])
    }
    else if(this._type==='embers'){
        this.scale.x=1;
        this.scale.y=1;this.anchor=new Point(0.5,0.5);
        this.blendMode=PIXI.BLEND_MODES.NORMAL;
        temp2 = Aries.P003_WCT.EmbersTint;
        this.setColorTone([temp2.red,temp2.green,temp2.blue,0])
    }
    else if(this._type ==='snow'){
        this.scale.x=1;
        this.scale.y=1
        this.anchor=new Point(0,0);
        this.blendMode=PIXI.BLEND_MODES.NORMAL;
        temp2 = Aries.P003_WCT.SnowTint;
        this.setColorTone([temp2.red,temp2.green,temp2.blue,0])
    }
    else if(this._type === 'rain') {
        this.scale.x=1;
        this.scale.y=1
        this.anchor=new Point(0,0);
        this.blendMode=PIXI.BLEND_MODES.NORMAL;
        temp2 = Aries.P003_WCT.RainTint;
        this.setColorTone([temp2.red,temp2.green,temp2.blue,0])
    }
    else {
        this.scale.x=1;
        this.scale.y=1
        this.anchor=new Point(0,0);
        this.blendMode=PIXI.BLEND_MODES.NORMAL;
        temp2 = Aries.P003_WCT.StormTint;
        this.setColorTone([temp2.red,temp2.green,temp2.blue,0])
    }
    this.setUpDone=!0
};

Sprite_Weather.prototype.update=function(){
    if(this.setUpDone===!0){
        if(this._lifetime>0){
            if(this._type==='snow'){
                this.opacity=Math.min(this.opacity+24,this._alpha);
                if (Aries.P003_WCT.SnowTint !== Aries.P003_WCT.NoTint) {
                    var newTone=this.getColorTone();
                    newTone[0]*=0.98;
                    newTone[1]*=0.95;
                    this.setColorTone(newTone);
                }
                this.scale.x=this._size;
                this.scale.y=this._size
            }
            else if(this._type==='shine'){
                this.opacity=Math.min(this.opacity+48,this._alpha);
                this.scale.x+=0.09;
                this.scale.y+=0.09
            }
            else if(this._type==='embers'){
                this.opacity=Math.min(this.opacity+32,this._alpha);
                if (Aries.P003_WCT.EmbersTint !== Aries.P003_WCT.NoTint) {
                    var newTone=this.getColorTone();
                    newTone[0]*=0.98;
                    newTone[1]*=0.95;
                    this.setColorTone(newTone);
                }
                this.scale.x=this._size;
                this.scale.y=this._size
            }
            else if (this._type === 'leaves'){
                this.opacity=Math.min(this.opacity+72,this._alpha);
                if (Aries.P003_WCT.LeafTint !== Aries.P003_WCT.NoTint) {
                    var newTone=this.getColorTone();
                    newTone[0]*=0.98;
                    newTone[1]*=0.95;
                    this.setColorTone(newTone);
                }
                this.scale.x=this._size;
                this.scale.y=this._size
            }
            else if (this._type === 'rain'){
                this.opacity=Math.min(this.opacity+72,this._alpha);
                if (Aries.P003_WCT.RainTint !== Aries.P003_WCT.NoTint) {
                    var newTone=this.getColorTone();
                    newTone[0]*=0.98;
                    newTone[1]*=0.95;
                    this.setColorTone(newTone);
                }
                this.scale.x=this._size;
                this.scale.y=this._size
            }
            else{
                this.opacity=Math.min(this.opacity+72,this._alpha);
                if (Aries.P003_WCT.StormTint !== Aries.P003_WCT.NoTint) {
                    var newTone=this.getColorTone();
                    newTone[0]*=0.98;
                    newTone[1]*=0.95;
                    this.setColorTone(newTone);
                }
                this.scale.x=this._size;
                this.scale.y=this._size
            }
            this._lifetime-=1;
            this._randomSeed-=1
        }
        else{
            if(this._type==='snow'){
                this.opacity-=16
            }
            else if(this._type==='shine'){
            this.opacity-=15;
                this.scale.x-=0.09;
                this.scale.y-=0.09
            }
            else if(this._type==='leaves'||this._type==='embers'){
                this.scale.x-=0.01;
                this.scale.y-=0.01;
                this.opacity-=8
            }
            else{
                this.opacity-=48
            }
        }
    }
};

Weather.prototype._createDimmer = function() {
    this._dimmerSprite = new ScreenSprite();
    this._dimmerSprite.setColor(Aries.P003_WCT.ScreenTint.red, Aries.P003_WCT.ScreenTint.green, Aries.P003_WCT.ScreenTint.blue);
    this.addChild(this._dimmerSprite);
};

Weather.prototype._updateDimmer = function() {
    if (Aries.P003_WCT.ScreenTintOn) {
        this._dimmerSprite.opacity = Math.floor(this.power * 6);
    }
    else {
        this._dimmerSprite.opacity = 0;
    }
};