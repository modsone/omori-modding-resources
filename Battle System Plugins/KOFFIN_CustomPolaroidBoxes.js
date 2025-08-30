/*:
 * @plugindesc Lets you set custom polaroid boxes
 *
 * @author KoffinKrypt
 *
 * @help
 *
 * Put <PolaroidBox: filename>in your actor notetags>
 * File is stored in img/system folder
 *
 * ============================================================================
 * Terms of Use:
 * ============================================================================
 *
 * Free to use and modify in your projects, with credit. (stop stealing my shit)
 *
 * @version 1.0
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
// * Create Sprite
//=============================================================================
Window_OmoriBattleActorStatus.prototype.createSprites = function() {
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
  this._faceSprite.mask =  this._faceMask;
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
  this._mpBarSprite.setFrame(0, 19, 81, 12);
  layers._polaroid.addChild(this._mpBarSprite);

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