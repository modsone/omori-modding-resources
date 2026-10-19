var Imported = Imported || {};
Imported.Stahl_ElementDisplay = true;

var Stahl = Stahl || {};
Stahl.ElementDisplay = Stahl.ElementDisplay || {};

/*:
 * @plugindesc [v1.0.0] Displays element info.
 * 
 * @author ReynStahl
 *
 * @help
 * Gives an element display below the Enemy status.
 * The specific functionality will have to be coded in JS, 
 * the methods can be overridden below:
 * 
 * The display logic of the box is in
 * - Sprite_ElementBox.prototype.refreshBitmap
 * 
 * This box sprite itself is edited in
 * - Sprite_ElementBox.prototype.initialize
 * - In this example, the image "LTS_elebox" in system folder is used split in a grid.
 * - First Row is affinity itself, Second row is the Base display.
 * 
 * ...And generated at
 * - Sprite_EnemyBattlerStatus.prototype.initialize
 */

//=============================================================================
// ** Sprite_ElementBox
//-----------------------------------------------------------------------------
// This sprite is used to display an element status.
//=============================================================================
function Sprite_ElementBox() { this.initialize.apply(this, arguments); }
Sprite_ElementBox.prototype = Object.create(Sprite.prototype);
Sprite_ElementBox.prototype.constructor = Sprite_ElementBox;

Sprite_ElementBox.prototype.initialize = function(stateId, baseIndex) {
    Sprite.prototype.initialize.call(this);
    this._boxWidth = 30;
    this._boxHeight = 43;
    this._stateId = stateId; // Main data to track
    this._baseIndex = baseIndex;
    this.bitmap = ImageManager.loadSystem("LTS_elebox");

    this._statusSprite = new Sprite(ImageManager.loadSystem("LTS_elebox"));
    this.addChild(this._statusSprite);
    
    this.setBaseFrame(this._baseIndex);
    this.setStatusFrame(0);
};

Sprite_ElementBox.prototype.setBaseFrame = function(col) {
    var fx = col * this._boxWidth;
    // Second Row
    this.setFrame(fx, this._boxHeight, this._boxWidth, this._boxHeight);
};

Sprite_ElementBox.prototype.setStatusFrame = function(col) {
    var fx = col * this._boxWidth;
    // First Row
    this._statusSprite.setFrame(fx, 0, this._boxWidth, this._boxHeight);
};

/**
 * Updates the element box. Status display logic here.
 * @param {*} battler The battler the box is showing the data of
 */
Sprite_ElementBox.prototype.refreshBitmap = function(battler) {
    if (!battler) return;
    let stateId = this._stateId;
    // THIS METHOD COMES FROM AILMENT PLUGIN
    let affinity = battler.getAilmentAffinity(stateId);
    // Set the frame based on affinity
    switch (affinity) {
        case AilmentManager.AFF_WEAK:
            this.setStatusFrame(1);
            break;
        case AilmentManager.AFF_STRONG:
            this.setStatusFrame(2);
            break;
        case AilmentManager.AFF_IMMUNE:
            this.setStatusFrame(3);
            break;
        default:
            this.setStatusFrame(0);
    }
};

// Add Boxes to the enemy status
Stahl.ElementDisplay.Sprite_EnemyBattlerStatus_initialize = Sprite_EnemyBattlerStatus.prototype.initialize;
Sprite_EnemyBattlerStatus.prototype.initialize = function() {
    Stahl.ElementDisplay.Sprite_EnemyBattlerStatus_initialize.call(this);
    var states = [237,235,236,240,239,241,238];
    this._elementBoxes = [];
    for (let i=0; i < states.length; i++) {
        let box = new Sprite_ElementBox(states[i], i)
        this.addChild(box);
        box.x = i * 28;
        box.y = 78;
        this._elementBoxes[i] = box;
    }
};

// Send battler data to the boxes as well
Stahl.ElementDisplay.Sprite_EnemyBattlerStatus_refreshBitmap = Sprite_EnemyBattlerStatus.prototype.refreshBitmap;
Sprite_EnemyBattlerStatus.prototype.refreshBitmap = function(battler) {
    Stahl.ElementDisplay.Sprite_EnemyBattlerStatus_refreshBitmap.call(this, battler);
    this.refreshElebox(battler);
}

// May make container class later on. Can edit to have animation too.
Sprite_EnemyBattlerStatus.prototype.refreshElebox = function(battler) {
    for (let box of this._elementBoxes) {
        box.refreshBitmap(battler);
    }
}

Sprite_EnemyBattlerStatus.prototype.openElebox = function() {
    for (let box of this._elementBoxes) {
        box.visible = true;
    }
}

Sprite_EnemyBattlerStatus.prototype.closeElebox = function() {
    for (let box of this._elementBoxes) {
        box.visible = false;
    }
}

Sprite_EnemyBattlerStatus.prototype.checkDisplayElebox = function() {
    var oldOpenElebox = this._openElebox;
    this._openElebox = this.canDisplayElebox();
    var changedStatus = oldOpenElebox != this._openElebox;
    // only update when there's a change in openMore
    if (this.visible && changedStatus) {
      console.log("elebox Update")
      if (this._openElebox) {
        this.openElebox();
      } else {
        this.closeElebox();
      }
    }
}

Sprite_EnemyBattlerStatus.prototype.canDisplayElebox = function() {
    return Input.isPressed('shift') || Input.isPressed('control') || Input.isPressed('pageup') || Input.isPressed('pagedown');
}

// This function is edited so it updates every time key is pressed, and passes on "openMore" variable to _statusSprite
Stahl.ElementDisplay.Sprite_Enemy_updateStatusSprite = Sprite_Enemy.prototype.updateStatusSprite;
    Sprite_Enemy.prototype.updateStatusSprite = function() {
    Stahl.ElementDisplay.Sprite_Enemy_updateStatusSprite.call(this, ...arguments);
    if (this._enemy && this._enemy.isSelected()) {
        this._statusSprite.checkDisplayElebox();
    }
}
