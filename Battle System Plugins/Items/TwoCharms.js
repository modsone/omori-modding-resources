//=============================================================================
// TwoCharms.js
//=============================================================================
/*:
 * @plugindesc v1.0 modified VL_TwoCharmSlots
 * @author Gaia
 *
 * @help Modified version of VL's plugin, VL_TwoCharmSlots DEPENDENT on HIME_EquipSlotsCore.
 * Add <equip slot: WEAPON> and two <equip slot: CHARM>s to your Actor's notetags.
 * Then, you should be all set!
 * Alternatively, you could manually create a second CHARM equipment type yourself and add that (for example, if you wanted a CHARM to take up two slots).
 * But that's the easier way :) 
 *
 * This plugin only modifies OMORI's UI to see and use both CHARM slots.
 * BIG thanks to VL for the OG and to TomatoRadio for helping me figure out the UI movement.
 *
 * Spacing may be off for some of the UI portions.
 *
 */

// VL's plugin, expands the Equip box & adds the text. HIME's plugin is what then makes the extra slot useable.
Window_OmoMenuActorEquip.prototype.refresh = function () {
    // Run Original Function
    Window_Selectable.prototype.refresh.call(this);
    // Reset Font Settings
    this.resetFontSettings();
    // Draw Headers
    this.contents.fontSize = 20;
    this.changePaintOpacity(true)
    this.contents.fillRect(4, 28, this.width - 8, 2, 'rgba(255, 255, 255, 1)');
    this.contents.fillRect(4, 65, this.width - 8, 2, 'rgba(255, 255, 255, 1)');
    this.contents.fillRect(4, 90, this.width - 8, 2, 'rgba(255, 255, 255, 1)');
    this.contents.fillRect(4, 126, this.width - 8, 2, 'rgba(255, 255, 255, 1)');
    this.contents.fillRect(4, 152, this.width - 8, 2, 'rgba(255, 255, 255, 1)');
    this.drawText(LanguageManager.getPluginText('equipMenu', 'weapon'), 0, -4, this.width, 'center');
    this.drawText(LanguageManager.getPluginText('equipMenu', 'charm'), 0, 58, this.width, 'center');
    this.drawText(LanguageManager.getPluginText('equipMenu', 'charm'), 0, 119, this.width, 'center');
};

// Game_Actor.prototype.equipSlots = function () {
//    var slots = this.currentClass().equipSlots.slice();
//     slots[0] = 2;
//     return slots;
// };

Window_OmoMenuActorEquip.prototype.windowHeight = function() { return 192; }
Window_OmoMenuActorEquip.prototype.maxItems = function() { return 3; }

Window_OmoMenuActorEquip.prototype.slotIdAtIndex = function(index) {
  // Get Index
  if (index === undefined) { index = this.index(); }; 
  // Return Slot Id
  return [0, 1, 2][index];
};

// So that the Actor box doesn't overlap with the Equip box
Scene_OmoMenuEquip.prototype.showActorEquipWindow = function(index) { 
  // For Refreshing the cursor
  //this._actorEquipWindow.activate();
  this._actorEquipWindow.select(0);
  this._actorEquipWindow.update();
  this._actorEquipWindow.deactivate();

  // On Equip Cursor Change Function
  this._actorEquipWindow._onEquipCursorChange = this.onEquipCursorChange.bind(this);
  // Set Function Index list index
  this.setFunctionListIndex(0);
  // Set Actor Equip Window Index
  this._actorEquipWindow.setActorIndex(index);  
  // Deactivate & selected Status Window
  this._statusWindow.deactivate()  
  this._statusWindow.deselect();

  // Hide All Actors Except The selected one
  this.queue(function() {   
    var windows = this._statusWindow._statusWindows;
    for (var i2 = 0; i2 < windows.length; i2++) {
     this.hideActorStatus(i2);
    };    
    // Show Actor
    this.showActorStatus(index, 10);
    this._statusWindow._statusWindows[index].animateFace(true);

  }.bind(this))  
  this.queue('setWaitMode', 'movement');

  // Get Equipment
  var equip = this._actorEquipWindow.equipmentAtIndex();  
  // Set Duration
  var duration = 15;

  if (index > 0) {
    // Move Actor Window to the First position
    this.queue(function() {   
      // Get Object
      var obj = this._statusWindow._statusWindows[index];
      // Create Movement Data
      var data = { 
        obj: obj,
        properties: ['x', 'y', 'contentsOpacity'], 
        from: {x: obj.x, y: obj.y, contentsOpacity: obj.contentsOpacity},
        to: {x: 10, y: -obj.height, contentsOpacity: 255},
        durations: {x: duration, y: duration, contentsOpacity: duration},
        easing: Object_Movement.easeOutCirc
      };
      this.move.startMove(data);
    }.bind(this))
    this.queue('setWaitMode', 'movement');
  };

  // Move Actor Window up to show equip window
  this.queue(function() {   
    // Get Object
    var obj = this._statusWindow._statusWindows[index];
    // Create Movement Data
    var data = { obj: obj, properties: ['y'], from: {y: obj.y}, to: {y: -300}, durations: {y: duration}, easing: Object_Movement.easeInCirc };
    // Start Move    
    this.move.startMove(data);
    // Get Object
    var obj = this._actorEquipWindow
    // Create Movement Data
    var data = { obj: obj, properties: ['y'], from: {y: obj.y}, to: {y: Graphics.height - this._actorEquipWindow.height}, durations: {y: duration}, easing: Object_Movement.easeInCirc };
    // Start Move    
    this.move.startMove(data);
  }.bind(this))
  this.queue('setWaitMode', 'movement');


  // If Equipment Exists Show help window
  if (equip) { this.queue('showHelpWindow', 15); };
  this.queue('setWaitMode', 'movement');

  // Show Help window
  this.queue(function() {   
    this._actorEquipWindow.activate();
    this._actorEquipStatus.open();
  }.bind(this))

  // Clear Function List Index 
  this.clearFunctionListIndex();
};

// BUBBLES
Window_OmoMenuEquipStatus.prototype.createBubbleSprites = function() {
  // Bubble Sprites Array
  this._bubbleSprites = [];
  // Bubble Positions
  var positions = [[9, -40, 90], [13, -20, 60]]
  // Go Through Positions
  for (var i = 0; i < positions.length; i++) {
    // Get Position
    var pos = positions[i];
    // Create Sprite
    var sprite = new Sprite(this.makeBubbleBitmap(pos[0]))
    sprite.anchor.set(0.5, 0.5);
    sprite.scale.set(0, 0);
    // Set Sprite coordinates
    sprite.x = pos[1]; sprite.y = pos[2];
    sprite._originY = sprite.y
    // Add Sprite to Bubble Sprites
    this._bubbleSprites[i] = sprite;
    this.addChild(sprite);
  }  
};