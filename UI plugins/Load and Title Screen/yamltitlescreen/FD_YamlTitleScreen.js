//=============================================================================
// ★ FD_YamlTitleScreen ★                                        1.0.0
//=============================================================================
/*:
 * @plugindesc v1.0.0 An easy title screen with a lot of variability.
 * @author FruitDragon
 * @version 1.0.0
 * 
 * @help
 * ★ FD_YamlTitleScreen ★                                        1.0.0
 * --------------------------------------------------------------------------
 * This plugin completely overwrites the base Omori Title Screen plugin.
 * It is compatible with Badges and other plugins that edit the button 
 * placements. This plugin does not alter those. 
 * 
 * Please make a copy of the template YAML provided! Give it a name unique to
 * your mod, like "ModName_FD_YamlTitleScreen.yaml". Write that name in the 
 * plugin parameters.
 * 
 * All images associated with background must go in the img/parallaxes folder.
 * All other images must go in img/pictures. Frames must always be arranged
 * in a row.
 * 
 * Features (listed layers from bottom to top):
 * 
 * - Color Background (opacity configurable)
 * - Scrolling Background (speed and opacity configurable)
 * - Still Picture Background (opacity configurable)
 * - Animated BG (framerate, framecount, pattern, opacity configurable)
 * - Character (size, framerate, framecount, pattern, xoffset, opacity)
 * - Glitch Character (frequency of glitch, no xoffset, others same as character)
 * - Weather (image(s), weather type, power configurable)
 * - Overlay (blend mode (defined in yaml) and opacity configurable)
 * - Title (size, framecount, framerate, pattern, positioning configurable)
 * - Particles (requires TRain_Particles.js, can configure what layer it's on)
 * - BGM (can configure pitch, pan, and volume)
 * - BGS (can configure pitch, pan, and volume)
 * 
 * Unlike EasyTitleScreen, this plugin is designed for entirely custom title
 * screens that do not need to use default OMORI assets. This means that if
 * you want the base game assets in your title screen, please download 
 * FD_EasyTitleScreen.
 * 
 * Not every value has to be defined in order to work. For example, 
 * 
 * BGM:
 *   name: user_title
 *   volume: 90
 *   pitch: 100
 *   pan: 0
 * 
 * is the exact same as 
 * 
 * BGM:
 *   name: user_title
 *   volume: 90
 * 
 * Default values are listed in the yaml. If an entire category is not defined,
 * it won't be included at all in the title screen. This makes it easy for 
 * organization purposes as well!
 * 
 * EX:
 * 
 * TitleScreen1:
 *   Title: 
 *     image: MyMod_Image
 *     width: 480
 *     height: 50
 *     framerate: 20
 *     framecount: 4
 *     yoffset: 50
 *     pattern: [0,1,2,3,2,1]
 *   BGM:
 *     name: MyMod_TitleSong
 *     volume: 50
 *  
 * This title ID will show only the Title Image and play background music
 * 
 * The script for writing your titledata to file is 
 * DataManager.forceWriteToFile(TITLE ID). In addition, you must specify a
 * variable (default is Variable 444) whose value will always be written to
 * the TITLEDATA file upon save. (Note: The plugin allows a way for you to
 * make a mod-specific TITLEDATA file. View the System in the yaml.)
 * 
 * This mod allows for infinite title screens. Give each title screen a unique
 * ID and add it to the comma-separated list in the System section of the yaml.
 * 
 * Opacity values are always on a percentage scale. Pattern values should
 * always be enclosed in square brackets []. Glitch Character defaults to 
 * Character defined values anywhere thats not specified as different.
 * 
 * For extra features, install FD_WeatherExtension (used with Weather layer) or
 * TRain_Particles.js (used with Particles layer). Both are found in the 
 * OMORI Modding Resources Github.
 * 
 * For more questions, please reach out to FruitDragon. Also please report any
 * bugs to FruitDragon. 
 * 
 * NOTE: When naming any images used with the plugin, NEVER name them any of
 * the following:
 * 
 * OMO_BS, OMO_WS, OMO_RS, OMO_BULB_BS, OMO_BULB_WS, OMO_BULB_BS_LINES,
 * OMO_BULB_WS_LINES, OMO_TITLE_BS, OMO_TITLE_WS
 * 
 * This will always overwrite your file with the base game image files.
 * 
 * 
 * --------------------------------------------------------------------------
 * FAQ
 * --------------------------------------------------------------------------
 * 
 * Q: My custom title/character/etc isn't showing up. What do I do?
 * A: There could be a few reasons for this. 
 *    1. Double check the DefaultValues to see whether you've defined all
 *       required values.
 *    2. Make sure that all values are correct.
 *    3. Make sure that the yaml is formatted and indented properly.
 * 
 * 
 * 
 * Q: What if I need more layers than what's given to me? Or I need to 
 *    rearrange them?
 * A: Adding or rearranging layers is going to require your own modification
 *    of this plugin, but it's pretty straightforward. If you aren't able to
 *    figure it out on your own, please ask in Modding Hub and someone will
 *    likely be able to answer your question.
 * 
 * 
 * 
 * Q: Does image width mean the whole image with all frames included, or
 *    the width of just one frame?
 * A: It means the width of the whole image. The plugin automatically
 *    calculates individual frame widths based on the width of the image
 *    and the number of frames. 
 * 
 * 
 * 
 * Q: How do I format my animations?
 * A: Always format them with all frames in one (1) row.
 * 
 * 
 * 
 * Q: My title screen is crashing my game and I don't know why.
 * A: Double check that you've defined all required parameters. If that still
 *    fails, please reach out to FruitDragon in Modding Hub and provide the 
 *    error message so I can pinpoint what went wrong.
 * 
 * 
 * 
 * Q: I'm trying to do a glitch between two characters of different sizes, but
 *    it's acting weird. How do I fix it?
 * A: Your best bet is to add empty space to the smaller one until the frame 
 *    dimensions of the two are the same. YTS does support it, but due to the
 *    way that updating the image is handled, it will often act kinda funky.
 *    You can circumvent that by resizing the image.
 * 
 * 
 * --------------------------------------------------------------------------
 * Changelog
 * --------------------------------------------------------------------------
 * v1.0.0
 * Initial release
 * 
 * --------------------------------------------------------------------------
 * 
 * @param titleCodeFile
 * @text Title Yaml Name  
 * @type
 * @default titles_template
 * @desc The name of the yaml that defines the photo album.
 * 
 * 
 *
 */
//=============================================================================

var Imported = Imported || {};
Imported.FD_YamlTitleScreen = true;

var FD = FD || {};
FD.YamlTitleScreen = FD.YamlTitleScreen || {};
FD.YamlTitleScreen.Param = PluginManager.parameters('FD_YamlTitleScreen');

YTS = FD.YamlTitleScreen

YTS.yaml = YTS.Param["titleCodeFile"]
YTS.System = LanguageManager.getTextData(`${YTS.yaml}`, "System")
YTS.default = YTS.System.DefaultScreenID || "0"
YTS.allIDS = YTS.System.AllIDS.split(",").map((x) => x.trim()) || ["0"]
YTS.System.TitleDataFileName = YTS.System.TitleDataFileName || "TITLEDATA"
YTS.variable = Number(YTS.System.VariableID) || 444

//=============================================================================
// * Initialize Objects
// Initial setup
//=============================================================================
//every other mod ever specific
Scene_OmoriTitleScreen.prototype.initialize = function () {

    // Set Image reservation Id
    this._imageReservationId = 'title';
    // Super Call
    Scene_BaseEX.prototype.initialize.call(this);
    // Get Atlas Bitmap
    //this._atlasBitmap = ImageManager.loadAtlas('Omori_TitleScreen');

    // World Type 0: Normal, 1: Dark space, 2: Red Space
    // Reads data of title screen images

    if (!DataManager.readFromFile(YTS.System.TitleDataFileName) || !YTS.allIDS.includes(DataManager.readFromFile(YTS.System.TitleDataFileName))) {
        DataManager.forceWriteToFile(YTS.default)
    }

    tryTitleData = DataManager.readFromFile(YTS.System.TitleDataFileName)
    this._worldType = tryTitleData;

    
    // Set Command Active Flag
    this._commandActive = false;
    // Options Active Flag
    this._optionsActive = false;
    // Set Command Index Flag
    this._commandIndex = 0;
    // Instant Intro Flag
    this._instantIntro = false;
    // Determine if can continue
    this._canContinue = false;
    // Check if Save files exist
    if (YTS.System.AlwaysContinue) {
            this._canContinue = true;
    } else {
        for (var i = 1; i < 7; i++) {
            if (StorageManager.exists(i)) {
                this._canContinue = true;
                break;
            }
        };
    }
    this._instantIntro = true;
};

Scene_OmoriTitleScreen.prototype.getWorldTypeObject = function() {
    return LanguageManager.getTextData(`${YTS.yaml}`,`${this._worldType}`)
}

Scene_OmoriTitleScreen.prototype.create = function () {
    // Super Call
    Scene_BaseEX.prototype.create.call(this);

    var World = this.getWorldTypeObject()

    this.createFilters();
    
    // all background things
    this.createColorLayer();
    this.createScrollingLayer();
    this.createStillLayer();
    this.createAnimatedLayer();
    // character
    this.createOmoriSprite();
    // effects 
    this.createWeatherLayer();
    this.createOverlayLayer();
    //title
    this.createCustomTitle();
    // this loads at the end since you can
    // put it where you want to
    this.createParticlesLayer()
    // Create Title Commands
    this.createTitleCommands();
    // Create Command Hints
    this.createCommandHints();
    // Create Version Text
    this.createVersionText();
    // Create Options Windows
    this.createOptionWindowsContainer();
    this.createHelpWindow();
    this.createGeneralOptionsWindow();
    this.createAudioOptionsWindow();
    this.createControllerOptionsWindow();
    this.createSystemOptionsWindow();
    this.createExitPromptWindow();
    this.createOptionCategoriesWindow();

    // Update world bitmaps
    this.updateWorldBitmaps();
    
    if (World.BGM) {this.playBgm()};
    if (World.BGS) {this.playBgs()};
    // this._backgroundSprite.filters = [this._glitchFilter]
};

Scene_OmoriTitleScreen.prototype.initFrameAnimations = function() {
    // Initialize Frame Animations
    this._frameAnimations = []
    if (this._lightBulbLinesSprite) this._lightBulbLinesSprite._index = 0
    var index = 0
    var World = this.getWorldTypeObject()
    if (World.Character && World.Character.image) {
        this._frameAnimations.push({sprite: this._omoriSprite, rect: new Rectangle(0, 0, this._omoriSprite._width/this._omoriSprite._framecount, this._omoriSprite._height), frames: this._omoriSprite._pattern, frameIndex: 0, delayCount:  0, delay: this._omoriSprite._framerate, active: true})
        this._omoriSprite._index = index
        index += 1
    }
    if (World.CustomTitle && World.CustomTitle.image) {
        this._frameAnimations.push({sprite: this._customTitle, rect: new Rectangle(0, 0, this._customTitle.width/this._customTitle._framecount, this._customTitle.height), frames: this._customTitle._pattern, frameIndex: 0, delayCount:  0, delay: this._customTitle._framerate, active: true})
        this._customTitle._index = index
        index += 1
    }
    if (World.AnimatedBG && World.AnimatedBG.image) {
        this._frameAnimations.push({sprite: this._animatedlayer, rect: new Rectangle(0, 0, 640, 480), frames: this._animatedlayer._pattern, frameIndex: 0, delayCount: 0, delay: this._animatedlayer._framerate, active: true})
        this._animatedlayer._index = index
        index += 1
    }
    // Update Frame animations
    this.updateFrameAnimations();
};

Scene_OmoriTitleScreen.prototype.createFilters = function() {

    var World = this.getWorldTypeObject()
    
    // Create GLitch Filter
    this._glitchFilter = new PIXI.filters.GlitchFilter();
    this._glitchFilter.fillMode = 2;
    this._glitchFilter.slices = 0;
    this._glitchFilter.seed = 0
    // Initialize Glitch Settings
    this._glitchSettings = {}
    this._glitchSettings.timer = 0
    this._glitchSettings.times = 5
    this._glitchSettings.world = this._worldType
    this._glitchSettings.timing = World.CharacterGlitch ? World.CharacterGlitch.frequency ? World.CharacterGlitch.frequency : 240 : 240
    this._glitchSettings.maxTiming = World.CharacterGlitch ? World.CharacterGlitch.frequency ? World.CharacterGlitch.frequency : 240 : 240
    this._glitchSettings.active = World.CharacterGlitch ? World.CharacterGlitch.image ? true : false : false

    
};

//=============================================================================
// * Creation of the aspects of the title screen
// Order of priority is the same as order of the functions from
// top to bottom.
//=============================================================================
Scene_OmoriTitleScreen.prototype.createColorLayer = function() {
    // Create Color Layer
    this._colorlayer = new TilingSprite();
    this._colorlayer.move(0, 0, Graphics.width, Graphics.height);
    this.addChild(this._colorlayer);

    var World = this.getWorldTypeObject()

    if (!World.ColorBG || !World.ColorBG.rgb) {
      return;
    }

    var red = World.ColorBG.rgb[0] || 0
    var green = World.ColorBG.rgb[1] || 0
    var blue = World.ColorBG.rgb[2] || 0
    var alpha = World.ColorBG.opacity ? World.ColorBG.opacity/100 : 1

    var bitmap = new Bitmap(Graphics.width, Graphics.height);
    bitmap.fillAll(`rgba(${red}, ${green}, ${blue}, ${alpha})`)
    this._colorlayer.bitmap = bitmap; 

    return;
};

Scene_OmoriTitleScreen.prototype.createScrollingLayer = function() {
    // Create Scrolling Layer
    this._scrollinglayer = new TilingSprite();
    this._scrollinglayer.move(0, 0, Graphics.width, Graphics.height);
    this.addChild(this._scrollinglayer);

    var World = this.getWorldTypeObject()
    if (!World.ScrollingBG || !World.ScrollingBG.image){
        return;
    }

    this._scrollx = World.ScrollingBG.xspeed ? World.ScrollingBG.xspeed : 0;
    this._scrolly = World.ScrollingBG.yspeed ? World.ScrollingBG.yspeed : 0;

    this._scrollinglayer.opacity = 255 * (World.ScrollingBG.opacity/100) || 255
    this._scrollinglayer.bitmap = ImageManager.loadParallax(World.ScrollingBG.image);


    return;
};

Scene_OmoriTitleScreen.prototype.createStillLayer = function() {
    // Create Still Layer
    this._stilllayer = new TilingSprite();
    this._stilllayer.move(0, 0, Graphics.width, Graphics.height);
    this.addChild(this._stilllayer);

    var World = this.getWorldTypeObject()
    if (!World.StillBG || !World.StillBG.image) {return}
    var image = World.StillBG.image

    this._stilllayer.opacity = 255 * (World.StillBG.opacity/100) || 255
    this._stilllayer.bitmap = ImageManager.loadParallax(image);


    return;
};

Scene_OmoriTitleScreen.prototype.createAnimatedLayer = function() {
    // Create Animated Layer

    var World = this.getWorldTypeObject()
    this._animatedlayer = new Sprite();
    this.addChild(this._animatedlayer);

    if (!World.AnimatedBG || !World.AnimatedBG.image){
        return;
    }


    this._animatedlayer._framerate = World.AnimatedBG.framerate || 1
    this._animatedlayer._framecount = World.AnimatedBG.framecount || 1
    this._animatedlayer._pattern = World.AnimatedBG.pattern || [0]

    this._animatedlayer.bitmap = ImageManager.loadParallax(World.AnimatedBG.image);
    this._animatedlayer.x = 0;
    this._animatedlayer.y = 0;
    this._animatedlayer.opacity = 255 * (World.AnimatedBG.opacity/100) || 255;
    this._animatedlayer.setFrame(0, 0, 0, 0);
    this._animatedlayer.visible = true

    return;
};

Scene_OmoriTitleScreen.prototype.createOmoriSprite = function() {
    // Create Omori Sprite

    var World = this.getWorldTypeObject()

    if (!World.Character || !World.Character.image){
        this._omoriSprite = new Sprite();
        this.addChild(this._omoriSprite);
        return;
    }

    this._omoriSprite = new Sprite(ImageManager.loadPicture(World.Character.image));

    // if the omori sprite doesnt exist (aka not assigned OR equal to null), it doesnt load it

    this._omoriSprite.anchor.set(0.5, 1)
    this._omoriSprite.x = Graphics.width / 2 + (Number(World.Character.xoffset) || 0);
    this._omoriSprite.y = Graphics.height;

    this._omoriSprite._width = World.Character.width || 918
    this._omoriSprite._height = World.Character.height || 351
    this._omoriSprite._pattern = World.Character.pattern || [0]
    this._omoriSprite._framecount = World.Character.framecount || 3
    this._omoriSprite._framerate = World.Character.framerate || 20
    this._omoriSprite.width = this._omoriSprite._width/this._omoriSprite._framecount
    this._omoriSprite.height = this._omoriSprite._height

    this._omoriSprite.opacity = 255 * (World.Character.opacity/100) || 255;
    this._omoriSprite.setFrame(0, 0, 0, 0);
    this._omoriSprite.filters = [this._glitchFilter];

    this._omoriSprite.visible = this._worldType !== 4;
    this._omoriSprite.filterArea = new PIXI.Rectangle(0, 0, Graphics.width, Graphics.height + Math.floor(Graphics.height / 6));
    this._omoriSprite.hasGlitched = false
    this.addChild(this._omoriSprite);

};

Scene_OmoriTitleScreen.prototype.createCustomTitle = function() {

    
    // Create custom title Sprite
    
    var World = this.getWorldTypeObject()

    if (!World.Title || !World.Title.image){
        this._customTitle = new Sprite();
        this.addChild(this._customTitle);
        return;
        
    }
    

    this._customTitle = new Sprite(ImageManager.loadPicture(World.Title.image));

    // if the omori sprite doesnt exist (aka not assigned OR equal to null), it doesnt load it

    this._customTitle.anchor.set(0.5, 0)
    this._customTitle.x = (Graphics.width / 2) + (World.Title.xoffset || 0);
    this._customTitle.y = World.Title.yoffset || 0;
    
    this._customTitle._pattern = World.Title.pattern || [0]
    this._customTitle._framecount = World.Title.framecount || 1
    this._customTitle._framerate = World.Title.framerate || 20
    
    this._customTitle.opacity = 255 * (World.Title.opacity/100) || 255;;
    this._customTitle.setFrame(0, 0, 0, 0);

    this._customTitle.visible = true;
    //this._customTitle.filterArea = new PIXI.Rectangle(0, 0, Graphics.width, Graphics.height + Math.floor(Graphics.height / 6));
    this.addChild(this._customTitle);
    
    this._customTitle.width = World.Title.width
    this._customTitle.height = World.Title.height

      
    

};

Scene_OmoriTitleScreen.prototype.createWeatherLayer = function() {
  var World = this.getWorldTypeObject()

  this._weather = new Weather();
  this.addChild(this._weather)

  if (!World.Weather || !World.Weather.type || !["leaves","rain","shine","storm","embers","snow"].contains(World.Weather.type)) {
    
    console.log("fail")
    return;
  }
  if (FD.WeatherExtension) {
    args = [`${World.Weather.type}`]
    console.log(Aries.P003_WCT.LeafImageList)
    image = World.Weather.image
    if (image) {
      list = image.split(",").map((x) => x.trim())
      args = args.concat(list)
      console.log(args)
    this._weather.handleSetList(args);
    } 
  }
  else {
    image = World.Weather.image
    if (image) {
      list = image.split(",").map((x) => x.trim())
      Aries.P003_WCT.setWeatherImage(World.Weather.type,list[0])
    }
    this._weather._createBitmaps()
  }
  this._weather.type = World.Weather.type;
  this._weather.power = World.Weather.power || 0

}

Scene_OmoriTitleScreen.prototype.createOverlayLayer = function() {
    // Create Still Layer
    this._overlaylayer = new TilingSprite();
    this._overlaylayer.move(0, 0, Graphics.width, Graphics.height);
    this.addChild(this._overlaylayer);

    var World = this.getWorldTypeObject()
    if (!World.Overlay || !World.Overlay.image) {return}
    var image = World.Overlay.image

    var temp;
    blend = String(World.Overlay.blend)
    
    if (blend.toLowerCase() == "normal"  || blend.toLowerCase() == "none"){
      temp = 0
    } else if (blend.toLowerCase() == "add" || blend.toLowerCase() == "additive" || blend.toLowerCase() == "addition" || Number(blend) == 1){
      temp = 1
    } else if (blend.toLowerCase() == "multiply" || Number(blend) == 2){
      temp = 2
    } else if (blend.toLowerCase() == "screen" || Number(blend) == 3){
      temp = 3
    } else if (blend.toLowerCase() == "overlay" || Number(blend) == 4){
      temp = 4
    } else if (blend.toLowerCase() == "hard light" || Number(blend) == 9){
      temp = 9
    } else if (blend.toLowerCase() == "normal npm" || Number(blend) == 17){
      temp = 17
    } else if (blend.toLowerCase() == "add npm" || blend.toLowerCase() == "additive npm" || blend.toLowerCase() == "addition npm" || Number(blend) == 18){
      temp = 18
    } else if (blend.toLowerCase() == "screen npm" || Number(blend) == 19){
      temp = 19
    } 
    else {
      temp = 0
      console.log("Error: Invalid blend mode! Failsafe to normal.")
    }
    
    

    this._overlaylayer.blendMode = temp

    this._overlaylayer.opacity = 255 * (World.Overlay.opacity/100) || 255
    this._overlaylayer.bitmap = ImageManager.loadPicture(image);


    return;
};

Scene_OmoriTitleScreen.prototype.createParticlesLayer = function(jsonFile) {
  if (typeof TR_pJS !== "undefined") {
    var World = this.getWorldTypeObject()

    if (!World.Particles || !World.Particles.json) {
      return;
    }

    //var follow_ratio = 0;
    var json = TR_pJS.jsons[World.Particles.json];
    var width = Graphics.width;
    var height = Graphics.height;
    var sprite_pjs = new Sprite_pJS(json, width, height);
    var base_sprite = this;
    var insert_index = World.Particles.index || this.children.length; // This is the index in the Scene.children array.
    base_sprite.addChildAt(sprite_pjs, insert_index);
  } else {
    return
  }
}

Scene_OmoriTitleScreen.prototype.playBgm = function () {
    
    var World = this.getWorldTypeObject()
    // Declares variable
    if (!World.BGM || !World.BGM.name) {
        return
    }
    var volume = World.BGM.volume ? World.BGM.volume : 100; 
    var pitch = World.BGM.pitch ? World.BGM.pitch : 100;
    var pan = World.BGM.pan ? World.BGM.pan : 0;
    
    // Looks at conditions where the title music might change and changes accordingly

    AudioManager.playBgm({name: World.BGM.name, volume: volume, pitch: pitch, pan: pan});
    

};

Scene_OmoriTitleScreen.prototype.playBgs = function () {
    
    var World = this.getWorldTypeObject()
    // Declares variable
    if (!World.BGS || !World.BGS.name) {
        return
    }
    var volume = World.BGS.volume ? World.BGS.volume : 100; 
    var pitch = World.BGS.pitch ? World.BGS.pitch : 100;
    var pan = World.BGS.pan ? World.BGS.pan : 0;
    
    // Looks at conditions where the title music might change and changes accordingly

    AudioManager.playBgs({name: World.BGS.name, volume: volume, pitch: pitch, pan: pan});
    

};

//=============================================================================
// * Functions required to run the title screen and update
// any animations found on it.
//=============================================================================
Scene_OmoriTitleScreen.prototype.start = function() {
  // Super Call
  Scene_BaseEX.prototype.start.call(this);
  // Initialize Frame Animations

  var World = this.getWorldTypeObject()


  this.initFrameAnimations();

  for (var i = 0; i < this._titleCommands.length; i++) {
    var win = this._titleCommands[i];
    win.y = (Graphics.height - win.height) - 15;
    win.opacity = 255;
    win.contentsOpacity = 255;
  };
  // Activate Commands
  this._commandActive = true;
// Activate Bulb Light animation
  // Activate Glitch
//  this._glitchSettings.active = this._worldType === 3;
  World.CharacterGlitch && World.CharacterGlitch.image ? this._glitchSettings.active = true : this._glitchSettings.active = false;
  return;
  

};

Scene_OmoriTitleScreen.prototype.update = function() {
  Scene_BaseEX.prototype.update.call(this);
  // Update Frame Animations
  this.updateFrameAnimations();
  // Update Command Input
  this.updateCommandInput();
  // Update Effects
  this.updateEffects();
  // Move Bkacground Sprite
  if (this._omoriSprite) {
    this._omoriSprite.width = this._omoriSprite._width/this._omoriSprite._framecount
  }
  console.log(this._omoriSprite.width)
  if (this._scrollinglayer) {
    this._scrollinglayer.origin.x += this._scrollx;
    this._scrollinglayer.origin.y += this._scrolly;
  }
};

Scene_OmoriTitleScreen.prototype.updateWorldBitmaps = function(world = this._worldType) {
  
  var World = this.getWorldTypeObject()

  if (!World.Character || !World.Character.image || !World.CharacterGlitch || !World.CharacterGlitch.image) {
    return;
  }

    var case1 = this._worldType
    var case2 = this.encrypt(this._worldType)

  // Set Title Bitmap
  var omoriBitmap = World.Character.image;
  // Set World
  switch (world) {
	case case1: // White space
		omoriBitmap = World.Character.image
        if (this._omoriSprite.hasGlitched) {this._omoriSprite._width = (World.Character.width || 918)};
        this._omoriSprite._height = World.Character.height || 351;
        this._omoriSprite._pattern = World.Character.pattern || [0]
        this._omoriSprite._framerate = World.Character.framerate || 20
        this._omoriSprite._framecount = World.Character.framecount || 3
        this._omoriSprite.opacity = 255 * (World.Character.opacity/100) || 255;
		break;
    case case2:// white spade
        omoriBitmap = World.CharacterGlitch.image;
        this._omoriSprite._width = (World.CharacterGlitch.width || World.Character.width || 918);
        this._omoriSprite._height = World.CharacterGlitch.height || World.Character.height || 351;
        this._omoriSprite._pattern = World.CharacterGlitch.pattern || World.Character.pattern || [0]
        this._omoriSprite._framerate = World.CharacterGlitch.framerate || World.Character.framerate || 20
        this._omoriSprite._framecount = World.CharacterGlitch.framecount || World.Character.framecount || 3
        this._omoriSprite.opacity = 255 * (World.CharacterGlitch.opacity/100) || 255;
        break;
	};

    if (this._omoriSprite) this._omoriSprite.bitmap = ImageManager.loadPicture(omoriBitmap)
    this._omoriSprite.width = this._omoriSprite._width/this._omoriSprite._framecount
    this._omoriSprite.height = this._omoriSprite._height
    if (this._omoriSprite.hasGlitched) {
        this._frameAnimations[this._omoriSprite._index].rect.width = this._omoriSprite._width/this._omoriSprite._framecount
        this._frameAnimations[this._omoriSprite._index].rect.height = this._omoriSprite._height
        this._frameAnimations[this._omoriSprite._index].frames = this._omoriSprite._pattern
        this._frameAnimations[this._omoriSprite._index].delay = this._omoriSprite._framerate

    } else {
        this._omoriSprite.hasGlitched = true
    }
  // Set Omori Sprite Width & Height

};

Scene_OmoriTitleScreen.prototype.updateEffects = function() {
  // Get Glitch Data
  var glitch = this._glitchSettings;
  var World = this.getWorldTypeObject()
  
  // If glitch is active
  if (glitch.active) {
    // Reduce Glitch Timing
    glitch.timing--;
    // If glitch timing is 0 or less
    if (glitch.timing <= 0) {
      // Reduce glitch timer
      glitch.timer--
      // If glitch timer is 0 or less
      if (glitch.timer <= 0) {
        // Reset Glitch Timer
        glitch.timer = 3;
        if (glitch.times % 2 == 0) {
          this._glitchFilter.seed = 0;
          this._glitchFilter.slices = 0
          this._glitchFilter.direction = 0
        } else {
          this._glitchFilter.seed = Math.randomInt(100);
          this._glitchFilter.slices = 10 + Math.randomInt(10)
          this._glitchFilter.direction = Math.randomInt(10) * Math.sin(Graphics.frameCount);
        };
        // Reduce Amount of times to glitch
        glitch.times--;
        // If glitch times is 0 or less
        if (glitch.times <= 0) {
          // Set Glitch world
          glitch.world = glitch.world === this.encrypt(this._worldType) ? this._worldType : this.encrypt(this._worldType);
          //console.log(glitch.world)
          // Update world bitmaps
          this.updateWorldBitmaps(glitch.world, true)
          // Reset Filter
          this._glitchFilter.seed = 0;
          this._glitchFilter.slices = 0
          this._glitchFilter.direction = 0
          // Reset Glitch Time and timing
          glitch.times = 5;
          glitch.timing = glitch.maxTiming;
        };
      };
    };
  };

return

};

Scene_OmoriTitleScreen.prototype.updateFrameAnimations = function() {
  // Go Through Animations
  if (this._frameAnimations) {
    for (var i = 0; i < this._frameAnimations.length; i++) {
      
      // Get Animation
      var anim = this._frameAnimations[i];
      // If Animation is active
      if (anim.active) {
        // If Animation Delay count is 0 or less
        if (anim.delayCount <= 0) {
          // Get Rectangle
          var rect = anim.rect;
          // Increase Current Frame
          anim.frameIndex = (anim.frameIndex + 1) % anim.frames.length;
          // Get Frame
          var frame = anim.frames[anim.frameIndex]
          // Set Animation Sprite Frame
          anim.sprite.setFrame(frame * rect.width, rect.y, rect.width, rect.height);
          // Reset Delay Count
          anim.delayCount = anim.delay;
        } else {
          // Decrease Delay Count
          anim.delayCount--
        };
      };
    };
  }
};

Scene_OmoriTitleScreen.prototype.encrypt = function(string) {
  return `${string}forfour` // thank you tomato
};

//every other mod ever specific
Scene_OmoriFile.prototype.saveGame = function() {
    // On Before Save
    $gameSystem.onBeforeSave();
    // Get Save File ID
    var saveFileid = this.savefileId();
    // Get File Window
    var fileWindow = this._fileWindows[this._saveIndex];
    // Save Game
    this._promptWindow.deactivate();
    this._promptWindow.close();
    if (this._waitingWindow) {this._waitingWindow.show(); console.log("fuck you omori")} // Show Waiting Window;
    if (DataManager.saveGame(saveFileid)) {
    SoundManager.playSave();
    StorageManager.cleanBackup(saveFileid);
    var world;
    world = $gameVariables.value(YTS.variable) || YTS.default

    DataManager.writeToFileAsync(world, `${YTS.System.TitleDataFileName}`, () => {
        this.backupSaveFile(() => {
            fileWindow.refresh();
            // Deactivate Prompt Window
            if (this._waitingWindow){this._waitingWindow.clear();}
            // Set Can select Flag to false
            this._canSelect = true;
            // Update Save Index Cursor
            this.updateSaveIndexCursor();
        })
    });
    //   console.log(world); 
    } else {
    SoundManager.playBuzzer();
    // Deactivate Prompt Window
    this._promptWindow.deactivate();
    this._promptWindow.close();
    // Set Can select Flag to false
    this._canSelect = true;
    // Update Save Index Cursor
    this.updateSaveIndexCursor();
    };
};

DataManager.forceWriteToFile = function(world = YTS.default) {
	DataManager.writeToFile(world, YTS.System.TitleDataFileName);
}