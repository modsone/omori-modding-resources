/*:
 * @plugindesc Customize your actor’s battle box and menu sprite using notetags.
 * @author KoffinKrypt
 *
 * @help
 * ==============================================================================
 *  CUSTOM POLAROID BOXES & MENUS
 * ==============================================================================
 * This plugin allows you to personalize your actors’ visuals both in battle 
 * and in the main menu using notetags.
 *
 * ------------------------------------------------------------------------------
 * FEATURES:
 * ------------------------------------------------------------------------------
 * • Battle Box Customization:
 *   – Add the notetag <PolaroidBox: filename> to an actor’s note field.
 *   – The plugin loads the image (from the /img/system/ folder) as the actor’s 
 *     battle box.
 *   – If no notetag is provided, it defaults to “player_box”.
 *
 * • Menu Sprite Customization:
 *   – Use the notetag <TagMenu: filename> to assign a custom menu background or 
 *     frame.
 *   – The specified image (from the /img/system/ folder) will replace the 
 *     default menu sprite.
 *   – If ABSENT, it falls back to “newtagmenud”.
 *
 * ------------------------------------------------------------------------------
 * HOW TO USE:
 * ------------------------------------------------------------------------------
 * 1. Place your custom images in the /img/system/ folder.
 * 2. Open the actor’s database entry and add one or both of the following 
 *    notetags:
 *      <PolaroidBox: your_battlebox_image>
 *      <TagMenu: your_menu_image>
 * 3. Include this plugin in your project.
 *
 * ------------------------------------------------------------------------------
 * Terms of Use
 * ------------------------------------------------------------------------------
 * Credit me you dummy
 *
 *
 */


//=============================================================================
// * Get Actor Polaroid Box Name
//=============================================================================
Game_Actor.prototype.polaroidBoxName = function() {
    // If Polaroid Box Name Exists, return it
    if (this._polaroidBoxName) { return this._polaroidBoxName; };
    // Get Name from Notetag
    var name = this.actor().meta.PolaroidBox;
    // Return Trimmed Name
    if (name) { return name.trim(); }
    return '';
};

//=============================================================================
// ** Sprite_OmoPolaroidBox
//-----------------------------------------------------------------------------
// Sprite for polaroid boxes.
//=============================================================================
function Sprite_OmoPolaroidBox() {
    this.initialize.apply(this, arguments);
}

Sprite_OmoPolaroidBox.prototype = Object.create(Sprite.prototype);
Sprite_OmoPolaroidBox.prototype.constructor = Sprite_OmoPolaroidBox;

//=============================================================================
// * Initialize Object
//=============================================================================
Sprite_OmoPolaroidBox.prototype.initialize = function() {
    // Super Call
    Sprite.prototype.initialize.call(this);
    // Set Actor
    this._actor = null;
};

//=============================================================================
// * Update Bitmap
//=============================================================================
Sprite_OmoPolaroidBox.prototype.updateBitmap = function() {
    // Get Actor
    var actor = this._actor;
    // If Actor Exists
    if (actor) {
        // Get Polaroid Box Name
        var boxName = actor.polaroidBoxName();
        // Load Bitmap
        if (boxName) {
            this.bitmap = ImageManager.loadSystem(boxName);
        } else {
            this.bitmap = ImageManager.loadSystem('player_box');
        }
    }
};

//=============================================================================
// * Actor
//=============================================================================
Object.defineProperty(Sprite_OmoPolaroidBox.prototype, 'actor', {
    get: function() { return this._actor; },
    set: function(value) {
        // If Value is changing
        if (value !== this._actor) {
            this._actor = value;
            this.updateBitmap();
        }
    },
    configurable: true
});

//=============================================================================
// * Initialize Object
//=============================================================================
Window_OmoriBattleActorStatus.prototype.initialize = function (index, layers, x, y) {
    // Set Home Position
    this._homePosition = new Point(x, y);
    // Set Display Layers Object
    this._displayLayers = layers
    // Set Actor Index
    this._actorIndex = index;
    // Animation Values
    this._hpAnim = { current: -2, target: 0, old: -1, duration: 0 };
    this._mpAnim = { current: -2, target: 0, old: -1, duration: 0 };
    this._tpAnim = { current: -2, target: 0, old: -1, duration: 0 };
    // Selected Flag
    this._selected = false;
    this._overlayOpacity = 0;
    this._overlayAngle = 0;
    // ACS Bubble Opacity Duration
    this._acsBubbleOpacityDuration = 0;
    this._acsBubbleOpacity = 0;
    // Overlay Animation
    this._overlayAnim = { side: 0, delay: 15 }
    // Initialize Damage Sprites Array
    this._damageSprites = [];
    this._removeDamageSprites = [];
    this._popupCount = 0;
    // Super Call
    Window_Base.prototype.initialize.call(this, 14, 100, this.windowWidth(), this.windowHeight());
    this.opacity = 0;
    // Create Sprites
    this.createSprites();
    // Draw Contents
    this.refresh();
};

//=============================================================================
// * Create Sprite
//=============================================================================
Window_OmoriBattleActorStatus.prototype.createSprites = function () {
    // Get Layers
    var layers = this._displayLayers;
    // Get Position
    var pos = this._homePosition;

    // Create status Back Sprite
    this._statusBackSprite = new Sprite();
    this._statusBackSprite.bitmap = ImageManager.loadSystem('faceset_states')
    this._statusBackSprite.x = pos.x + 7;
    this._statusBackSprite.y = pos.y + 17;
    this.setStatusBack(0, false);
    layers._statusBack.addChild(this._statusBackSprite);

    // Create Face Sprite
    this._faceSprite = new Sprite_OmoMenuStatusFace();
    this._faceSprite.x = pos.x + (this.width - 106) / 2;
    this._faceSprite.y = pos.y + 15
    layers._face.addChild(this._faceSprite);
    // Set Actor
    this._faceSprite.actor = this.actor();

    // Face Mask
    this._faceMask = new Sprite(new Bitmap(this.width - 14, 92))
    this._faceMask.x = 7;
    this._faceMask.y = 25;
    this._faceMask.bitmap.fillAll('rgba(255, 255, 255, 1)')
    this._faceSprite.mask = this._faceMask;
    this.addChild(this._faceMask);


  // // Face Mask
  // this._faceMask = new PIXI.Graphics();
  // this._faceMask.beginFill(0xFFF);
  // // this._faceMask.drawRect(7, 25, this.width - 14, 92);
  // this._faceMask.endFill();
  // // this._faceSprite.mask = this._faceMask
  // this.addChild(this._faceMask)

  // Create Polaroid Sprite
  this._polaroidSprite = new Sprite_OmoPolaroidBox();
  this._polaroidSprite.x = pos.x; 
  this._polaroidSprite.y = pos.y; 
  layers._polaroid.addChild(this._polaroidSprite);
  // Set Actor
  this._polaroidSprite.actor = this.actor();

    // Create HP Bar
    this._hpBarSprite = new Sprite(ImageManager.loadSystem('bar_gradients'));
    this._hpBarSprite.x = pos.x + 28
    this._hpBarSprite.y = pos.y + 127;
    this._hpBarSprite.setFrame(0, 0, 81, 12);
    layers._polaroid.addChild(this._hpBarSprite);

    // Create HP Bar
    this._mpBarSprite = new Sprite(ImageManager.loadSystem('bar_gradients'));
    this._mpBarSprite.x = pos.x + 28
    this._mpBarSprite.y = pos.y + 146;
    this._mpBarSprite.setFrame(0, 19, 39, 12);
    layers._polaroid.addChild(this._mpBarSprite);

    // Create TP Bar
    this._tpBarSprite = new Sprite(ImageManager.loadSystem('bar_gradients'));
    this._tpBarSprite.x = pos.x + 28
    this._tpBarSprite.y = pos.y + 146;
    this._tpBarSprite.setFrame(39, 19, 39, 12);
    layers._polaroid.addChild(this._tpBarSprite);

    // Create State Sprite
    this._stateSprite = new Sprite(ImageManager.loadSystem('statelist'));
    this._stateSprite.anchor.set(0.5, 0.5);
    this._stateSprite.x = pos.x + this.width / 2;
    this._stateSprite.y = pos.y + 14;
    this._stateSprite.setFrame(0, 0 * 24, 134, 24)
    layers._polaroid.addChild(this._stateSprite);

    // Create Selected Overlay
    this._selectedOverlay = new Sprite(ImageManager.loadSystem('target_selected'))
    this._selectedOverlay.x = pos.x + -12
    this._selectedOverlay.y = pos.y + -3
    this._selectedOverlay.opacity = 0;
    layers._polaroid.addChild(this._selectedOverlay);

    // Create Status Particle Emitters
    this.createStatusParticleEmitters();

    // Create ACS Bubble Sprites
    this.createACSBubbleSprites();

    layers._polaroid.addChild(this._windowContentsSprite)
    this._windowContentsSprite.x = pos.x;
    this._windowContentsSprite.y = pos.y;

    // Create Damage Container
    this._damageContainer = new Sprite();
    layers._polaroid.addChild(this._damageContainer);
};

//=============================================================================
// * Draw MP
//=============================================================================
Window_OmoriBattleActorStatus.prototype.drawMP = function (mp, maxMP) {
    this.contents.fontSize = 12
    var y = 131;
    this.contents.clearRect(0, y + 10, (this.width * 0.5) + 5, 24);
    var maxText = ' ' + maxMP
    var width = this.textWidth(maxText) + 11;
    this.drawText(mp, -39, y, this.width - width, 'right');
    this.drawText(maxText, -39, y, this.width - 10, 'right');
    this.drawText('/', -39, y + 1, this.width - width + 5, 'right');
    this.resetFontSettings()
};

//=============================================================================
// * Draw TP
//=============================================================================
Window_OmoriBattleActorStatus.prototype.drawTP = function (tp) {
    this.contents.fontSize = 12
    var y = 131;
    this.contents.clearRect(67, y + 10, (this.width * 0.5) + 5, 24);
    var maxText = ' ' + 100
    var width = this.textWidth(maxText) + 11;
    this.drawText(tp, 0, y, this.width - width, 'right');
    this.drawText(maxText, 0, y, this.width - 10, 'right');
    this.drawText('/', 0, y + 1, this.width - width + 5, 'right');
    this.resetFontSettings()
};

//=============================================================================
// * Update Positions
//=============================================================================
Window_OmoriBattleActorStatus.prototype.updatePositions = function () {


    this._statusBackSprite.x = this.x + 7;
    this._statusBackSprite.y = this.y + 17;

    this._faceSprite.x = this.x + (this.width - 106) / 2;
    this._faceSprite.y = this.y + 15

    this._polaroidSprite.x = this.x;
    this._polaroidSprite.y = this.y;

    this._hpBarSprite.x = this.x + 28
    this._hpBarSprite.y = this.y + 127;

    this._mpBarSprite.x = this.x + 28
    this._mpBarSprite.y = this.y + 146;

    this._tpBarSprite.x = this.x + 70
    this._tpBarSprite.y = this.y + 146;

    this._stateSprite.x = this.x + this.width / 2;
    this._stateSprite.y = this.y + 14;

    this._selectedOverlay.x = this.x + -12
    this._selectedOverlay.y = this.y + -3

    this._windowContentsSprite.x = this.x;
    this._windowContentsSprite.y = this.y;

    // Go Through Layer List
    for (var i = 0; i < this._statusParticleEmitters.length; i++) {
        // Create Particle Emitter
        var sprite = this._statusParticleEmitters[i]
        sprite.x = this.x + this.width / 2;
        sprite.y = this.y + 120;
    };
};

Window_OmoriBattleActorStatus.prototype.updateBars = function () {
    // Get Actor
    var actor = this.actor();

    // If Actor Exists
    if (actor) {
        // Get Animation
        var anim = this._hpAnim
        if (actor.hp !== anim.old) {
            anim.target = actor.hp;
            anim.old = actor.hp
            anim.duration = Math.abs(anim.current - anim.target).clamp(0, 30);;
        };
        anim = this._mpAnim
        if (actor.mp !== anim.old) {
            anim.target = actor.mp;
            anim.old = actor.mp
            anim.duration = Math.abs(anim.current - anim.target).clamp(0, 30);;
        };
        anim = this._tpAnim
        if (actor.tp !== anim.old) {
            anim.target = actor.tp;
            anim.old = actor.tp
            anim.duration = Math.abs(anim.current - anim.target).clamp(0, 30);;
        };
    };

    // If HP Animation Duration is more than 0
    if (this._hpAnim.duration > 0) {
        var anim = this._hpAnim;
        anim.current = (anim.current * (anim.duration - 1) + anim.target) / anim.duration;
        anim.duration--;
        this.drawHP(Math.round(anim.current), actor.mhp)
        var width = (anim.current / actor.mhp) * 81;
        this._hpBarSprite._frame.width = width;
        this._hpBarSprite._refresh();
    }
    // If MP Animation Duration is more than 0
    if (this._mpAnim.duration > 0) {
        var anim = this._mpAnim;
        anim.current = (anim.current * (anim.duration - 1) + anim.target) / anim.duration;
        anim.duration--;
        this.drawMP(Math.round(anim.current), actor.mmp)
        var width = (anim.current / actor.mmp) * 39;
        this._mpBarSprite._frame.width = width;
        this._mpBarSprite._refresh();
    };
    // If TP Animation Duration is more than 0
    if (this._tpAnim.duration > 0) {
        var anim = this._tpAnim;
        anim.current = (anim.current * (anim.duration - 1) + anim.target) / anim.duration;
        anim.duration--;
        this.drawTP(Math.round(anim.current))
        var width = (anim.current / 100) * 39;
        this._tpBarSprite._frame.width = width;
        this._tpBarSprite._refresh();
    };
};

//=============================================================================
// * Get Actor Polaroid Box Name
//=============================================================================
Game_Actor.prototype.tagMenuName = function() {
    // If Polaroid Box Name Exists, return it
    if (this._tagMenuName) { return this._tagMenuName; };
    // Get Name from Notetag
    var name = this.actor().meta.TagMenu;
    // Return Trimmed Name
    if (name) { return name.trim(); }
    return '';
};

//=============================================================================
// ** Sprite_OmoTagMenu
//-----------------------------------------------------------------------------
// Sprite for polaroid boxes.
//=============================================================================
function Sprite_OmoTagMenu() {
    this.initialize.apply(this, arguments);
}

Sprite_OmoTagMenu.prototype = Object.create(Sprite.prototype);
Sprite_OmoTagMenu.prototype.constructor = Sprite_OmoTagMenu;

//=============================================================================
// * Initialize Object
//=============================================================================
Sprite_OmoTagMenu.prototype.initialize = function() {
    // Super Call
    Sprite.prototype.initialize.call(this);
    // Set Actor
    this._actor = null;
};

//=============================================================================
// * Update Bitmap
//=============================================================================
Sprite_OmoTagMenu.prototype.updateBitmap = function() {
    // Get Actor
    var actor = this._actor;
    // If Actor Exists
    if (actor) {
        // Get Polaroid Box Name
        var tagName = actor.tagMenuName();
        // Load Bitmap
        if (tagName) {
            this.bitmap = ImageManager.loadSystem(tagName);
        } else {
            this.bitmap = ImageManager.loadSystem('newtagmenud');
        }
    }
};

//=============================================================================
// * Actor
//=============================================================================
Object.defineProperty(Sprite_OmoTagMenu.prototype, 'actor', {
    get: function() { return this._actor; },
    set: function(value) {
        // If Value is changing
        if (value !== this._actor) {
            this._actor = value;
            this.updateBitmap();
        }
    },
    configurable: true
});

//=============================================================================
// * Create Back Sprite
//=============================================================================
Window_OmoMainMenuActorStatus.prototype.createBackSprite = function() {
  // Create Back Sprite
  this._backSprite = new Sprite_OmoTagMenu();
  this._backSprite.setFrame(0, 0, this.windowWidth(), 109);
  this.addChildToBack(this._backSprite);
  this._backSprite.actor = this.actor();
};