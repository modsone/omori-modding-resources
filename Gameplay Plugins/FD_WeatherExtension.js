//=============================================================================
// ★ FD_WeatherExtension ★                                        1.0.1
//=============================================================================
/*:
 * @plugindesc v1.0.1 An extension to the Aries Weather Control plugin.
 * @author FruitDragon
 * 
 * @help
 * ★ FD_WeatherExtension ★                                        1.0.1
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
 * Sets the RGB tint of the chosen weather.
 * [weather]: leaves, snow, embers, rain, storm, shine
 * [tint]: RGB color scale value, except when chosen weather is Shine.
 *         If setting tint of Shine, use 'on' or 'off'.
 * 
 * Examples:
 * 
 * SetTint embers 255 200 0
 * SetTint rain 0 0 0
 * SetTint shine on
 * 
 * --------------------------------------------------------------------------
 * 
 * Plugin: ResetTint [weather]
 * 
 * Resets the chosen weather tint to the default from the plugin parameters.
 * [weather]: leaves, snow, embers, rain, storm, shine
 * 
 * --------------------------------------------------------------------------
 * 
 * Plugin: ClearTint [weather]
 * 
 * Turns off or clears tint for the chosen weather.
 * [weather]: leaves, snow, embers, rain, storm, shine
 * 
 * 
 * 
 * @param ---Image Lists---
 * @default
 * 
 * @param ---Tints---
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
 * @type []
 * @parent ---Tints---
 * @desc The default RGB value of the leaf tint. [0,0,0,0] means no tint.
 * @default [0,0,0,0]
 * 
 * @param SnowDefaultTint
 * @text Default Snow Tint
 * @type []
 * @parent ---Tints---
 * @desc The default RGB value of the snow tint. [0,0,0,0] means no tint.
 * @default [0,0,0,0]
 * 
 * @param EmbersDefaultTint
 * @text Default Embers Tint
 * @type []
 * @parent ---Tints---
 * @desc The default RGB value of the embers tint. [0,0,0,0] means no tint.
 * @default [255,200,0,0]
 * 
 * @param RainDefaultTint
 * @text Default Rain Tint
 * @type []
 * @parent ---Tints---
 * @desc The default RGB value of the rain tint. [0,0,0,0] means no tint.
 * @default [0,0,0,0]
 * 
 * @param StormDefaultTint
 * @text Default Storm Tint
 * @type []
 * @parent ---Tints---
 * @desc The default RGB value of the storm tint. [0,0,0,0] means no tint.
 * @default [0,0,0,0]
 * 
 * @param ShineDefaultTint
 * @text Default Shine Tint
 * @type boolean
 * @parent ---Tints---
 * @desc Whether Shine tint is on or not.
 * ON - true     OFF - false
 * @default true
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

Aries.P003_WCT.NoTint = [0,0,0,0]

Aries.P003_WCT.DefaultLeafTint = JSON.parse(FD.WeatherExtension.Param["LeafDefaultTint"]).map(Number)
Aries.P003_WCT.DefaultSnowTint = JSON.parse(FD.WeatherExtension.Param["SnowDefaultTint"]).map(Number)
Aries.P003_WCT.DefaultEmbersTint = JSON.parse(FD.WeatherExtension.Param["EmbersDefaultTint"]).map(Number)
Aries.P003_WCT.DefaultShineTint = eval(FD.WeatherExtension.Param["ShineDefaultTint"])
Aries.P003_WCT.DefaultRainTint = JSON.parse(FD.WeatherExtension.Param["RainDefaultTint"]).map(Number)
Aries.P003_WCT.DefaultStormTint = JSON.parse(FD.WeatherExtension.Param["StormDefaultTint"]).map(Number)

Aries.P003_WCT.LeafTint = Aries.P003_WCT.DefaultLeafTint
Aries.P003_WCT.SnowTint = Aries.P003_WCT.DefaultSnowTint
Aries.P003_WCT.EmbersTint = Aries.P003_WCT.DefaultEmbersTint
Aries.P003_WCT.ShineTint = Aries.P003_WCT.DefaultShineTint
Aries.P003_WCT.RainTint = Aries.P003_WCT.DefaultRainTint
Aries.P003_WCT.StormTint = Aries.P003_WCT.DefaultStormTint

// Adds the plugin commands
FD.WeatherExtension.GameInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command,args) {
    switch (command.toLowerCase()) {
        case 'setlist':
            temp = args.shift();
            if (temp === 'leaves') {
                Aries.P003_WCT.LeafImageList = args;
                Weather.prototype._createLeafBitmapList();
            }
            else if (temp === 'snow') {
                Aries.P003_WCT.SnowImageList = args;
                Weather.prototype._createSnowBitmapList();
            }
            else if (temp === 'embers') {
                Aries.P003_WCT.EmbersImageList = args;
                Weather.prototype._createHeatBitmapList();
            }
            else if (temp === 'shine') {
                Aries.P003_WCT.ShineImageList = args;
                Weather.prototype._createMysticBitmapList();
            }
            else if (temp === 'rain') {
                Aries.P003_WCT.RainImageList = args;
                Weather.prototype._createRainBitmapList();
            }
            else if (temp === 'storm') {
                Aries.P003_WCT.StormImageList = args;
                Weather.prototype._createStormBitmapList();
            }
            return;
        case 'resetlist':
            temp = args.shift();
            if (temp === 'leaves') {
                Aries.P003_WCT.LeafImageList = Aries.P003_WCT.DefaultLeafImageList;
                Weather.prototype._createLeafBitmapList();
            }
            else if (temp === 'snow') {
                Aries.P003_WCT.SnowImageList = Aries.P003_WCT.DefaultSnowImageList;
                Weather.prototype._createSnowBitmapList();
            }
            else if (temp === 'embers') {
                Aries.P003_WCT.EmbersImageList = Aries.P003_WCT.DefaultEmbersImageList;
                Weather.prototype._createHeatBitmapList();
            }
            else if (temp === 'shine') {
                Aries.P003_WCT.ShineImageList = Aries.P003_WCT.DefaultShineImageList;
                Weather.prototype._createMysticBitmapList();
            }
            else if (temp === 'rain') {
                Aries.P003_WCT.RainImageList = Aries.P003_WCT.DefaultRainImageList;
                Weather.prototype._createRainBitmapList();
            }
            else if (temp === 'storm') {
                Aries.P003_WCT.StormImageList = Aries.P003_WCT.DefaultStormImageList;
                Weather.prototype._createStormBitmapList();
            }
            return;
        case 'clearlist':
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
        case 'settint':
            temp = args.shift();
            if (temp === 'leaves') {
                Aries.P003_WCT.LeafTint = [Number(args[0]), Number(args[1]), Number(args[2]), 0]
            }
            else if (temp === 'snow') {
                Aries.P003_WCT.SnowTint = [Number(args[0]), Number(args[1]), Number(args[2]), 0]
            }
            else if (temp === 'embers') {
                Aries.P003_WCT.EmbersTint = [Number(args[0]), Number(args[1]), Number(args[2]), 0]
            }
            else if (temp === 'shine') {

                if (args[0].toLowerCase() === 'on') {
                    Aries.P003_WCT.ShineTint = true;
                }
                else if (args[0].toLowerCase() === 'off') {
                    Aries.P003_WCT.ShineTint = false;
                }

            }
            else if (temp === 'rain') {
                Aries.P003_WCT.RainTint = [Number(args[0]), Number(args[1]), Number(args[2]), 0]
            }
            else if (temp === 'storm') {
                Aries.P003_WCT.StormTint = [Number(args[0]), Number(args[1]), Number(args[2]), 0]
            }
        case 'resettint':
            temp = args.shift();
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
        case 'cleartint':
            temp = args.shift();
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
        this.setColorTone(Aries.P003_WCT.LeafTint)
    }
    else if(this._type==='embers'){
        this.scale.x=1;
        this.scale.y=1;this.anchor=new Point(0.5,0.5);
        this.blendMode=PIXI.BLEND_MODES.NORMAL;
        this.setColorTone(Aries.P003_WCT.EmbersTint)
    }
    else if(this._type ==='snow'){
        this.scale.x=1;
        this.scale.y=1
        this.anchor=new Point(0,0);
        this.blendMode=PIXI.BLEND_MODES.NORMAL;
        this.setColorTone(Aries.P003_WCT.SnowTint);
    }
    else if(this._type === 'rain') {
        this.scale.x=1;
        this.scale.y=1
        this.anchor=new Point(0,0);
        this.blendMode=PIXI.BLEND_MODES.NORMAL;
        this.setColorTone(Aries.P003_WCT.RainTint);
    }
    else {
        this.scale.x=1;
        this.scale.y=1
        this.anchor=new Point(0,0);
        this.blendMode=PIXI.BLEND_MODES.NORMAL;
        this.setColorTone(Aries.P003_WCT.StormTint);
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