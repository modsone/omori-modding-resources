//-----------------------------------------------------------------------------
/*:
 * @plugindesc Makes the options in the Title Screen vertical. Please adjust the parameters.
 * 
 * @author Pyro
 *
 * @param Options X
 * @desc This affects all options' x
 * @default 400

 * @param Y Offset
 * @desc Moves ALL options further down
 * @default 200

 * @param Separation
 * @desc Determines how distant every option is from another.
 * @default 64

 * @param Animate
 * @desc Tweens options to and from when opening the options menu.
 * @default true

 * @param Same Width
 * @desc Makes all options be the same width
 * @default true

 * @help
 *   Vertical Title Screen buttons
 * 
 *   Compatibility Notes:
 * 
 *   Place BELOW Badge Plugin
 *   Place BELOW "Omori Title Screen" Plugin
 *   Place ABOVE YamlTitleScreen if you have it
 * 
 *   If you have YamlTitleScreen:
 *   replace win.x and win.y in said plugin on line 669 + 670 with:
 * 
 *   win.x = PYRO.VertTitle.OptionsX;
 *   win.y = this.calcy(i);
 * 
 *   V 1.0.3
 * 
 *   LICENSE (MIT):
 *                            Copyright 2026 PYRO
 * 
 * Permission is hereby granted, free of charge, to any person obtaining 
 * a copy of this software and associated documentation files (the “Software”), 
 * to deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all 
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION 
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

var PYRO       = PYRO || {};
PYRO.VertTitle = {};
PYRO.VertTitle.OptionsX = Number(PluginManager.parameters('PYRO_VertTitle')["Options X"]);
PYRO.VertTitle.OffsetY = Number(PluginManager.parameters('PYRO_VertTitle')["Y Offset"]);
PYRO.VertTitle.Separation = Number(PluginManager.parameters('PYRO_VertTitle')["Separation"]);
PYRO.VertTitle.Animate = Boolean(PluginManager.parameters('PYRO_VertTitle')["Animate"]);
PYRO.VertTitle.SameWidth = PluginManager.parameters('PYRO_VertTitle')["Same Width"] == "true";


// Pulls the options down if badges arent installed for a uniform look.
var DGT = DGT || {};
if(DGT.Badges == undefined)
  PYRO.VertTitle.BadgeOffset = true;
else
  PYRO.VertTitle.BadgeOffset = false;

//=============================================================================
// * Create Title Commands
//=============================================================================
Scene_OmoriTitleScreen.prototype.createTitleCommands = function() {                       
  // Initialize Title Comands
  this._titleCommands = [];
  // Text Array
  var textList = LanguageManager.getMessageData("XX_BLUE.Omori_Title_Screen").commands
  // Go Through Text Array

  var longest = textList.sort(
    function (a, b) {
        return b.length - a.length;
    }
  )[0];

  for (var i = 0; i < textList.length; i++) {
    // Get Text
    var text = textList[i];
    // Create Window
    var win = new Window_OmoTitleScreenBox(text, longest);
    // Set Wnidow Position

    win.x = PYRO.VertTitle.OptionsX;
    win.y = this.calcy(i); //(Graphics.height - win.height) - 22

    // Select Window
    if (i === this._commandIndex) { win.select(0)}
    // Add window to title Commands
    this._titleCommands[i] = win;
    this.addChild(win)
  };
  // Set Continue text
  this._titleCommands[1].setText(textList[1], this._canContinue);

};

//=============================================================================
// * Start
//=============================================================================
Scene_OmoriTitleScreen.prototype.start = function() {
  // Super Call
  Scene_BaseEX.prototype.start.call(this);
  // Initialize Frame Animations
  this.initFrameAnimations();
  // If Instant Intro Flag is true
  if (this._instantIntro) {
    this._titleTextContainerSprite.opacity = 255;
    this._titleTextContainerSprite.y = -30;
    this._titleTextSprite.opacity = 255;
    if (this._omoriSprite) this._omoriSprite.opacity = 255;
    this._lightBulbLinesSprite.opacity = 255;
    for (var i = 0; i < this._titleCommands.length; i++) {
      var win = this._titleCommands[i];
      win.x = PYRO.VertTitle.OptionsX;
      win.y = this.calcy(i);
      win.opacity = 255;
      win.contentsOpacity = 255;
    };
    // Activate Commands
    this._commandActive = true;
	// Activate Bulb Light animation
	if (this._omoriSprite) this._frameAnimations[1].active = true;
	else this._frameAnimations[0].active = true;
    // Activate Glitch
  //  this._glitchSettings.active = this._worldType === 3;
  this._glitchSettings.active = this._worldType === 445
    return;
  };

  this.queue(function() {
    // Set Duration
    var duration = 60;
    var obj = this._titleTextContainerSprite;
    var data = { obj: obj, properties: ['opacity'], from: {opacity: obj.opacity}, to: {opacity: 255}, durations: {opacity: duration}}
    data.easing = Object_Movement.linearTween;
    this.move.startMove(data);
    if (this._omoriSprite) this._frameAnimations[1].active = true;
	else this._frameAnimations[0].active = true;
  }.bind(this))

  // Wait
  this.queue('setWaitMode', 'movement');
  // Wait
  this.queue('wait', 15);

  this.queue(function() {
    // Set Duration
    var duration = 60;
    var obj = this._titleTextSprite;
    var data = { obj: obj, properties: ['opacity'], from: {opacity: obj.opacity}, to: {opacity: 255}, durations: {opacity: duration}}
    data.easing = Object_Movement.linearTween;
    this.move.startMove(data);

    // Set Duration
    var duration = 60;
    var obj = this._lightBulbLinesSprite;
    var data = { obj: obj, properties: ['opacity'], from: {opacity: obj.opacity}, to: {opacity: 255}, durations: {opacity: duration}}
    data.easing = Object_Movement.linearTween;
    this.move.startMove(data);

  }.bind(this))

  // Wait
  this.queue('setWaitMode', 'movement');
  // Wait
  this.queue('wait', 30);

  this.queue(function() {
    // Set Duration
    var duration = 60;
    var obj = this._titleTextContainerSprite;
    var data = { obj: obj, properties: ['y'], from: {y: obj.y}, to: {y: -30}, durations: {y: duration}}
    data.easing = Object_Movement.linearTween;
    this.move.startMove(data);
  }.bind(this))

  // Wait
  this.queue('setWaitMode', 'movement');
  // Wait
  this.queue('wait', 30);
	if (this._omoriSprite) {
		this.queue(function() {
			// Set Duration
			var duration = 60;
			var obj = this._omoriSprite;
			var data = { obj: obj, properties: ['opacity'], from: {opacity: obj.opacity}, to: {opacity: 255}, durations: {opacity: duration}}
			data.easing = Object_Movement.linearTween;
			this.move.startMove(data);
		}.bind(this))

		// Wait
		this.queue('wait', 30);
	}


  for (var i = 0; i < this._titleCommands.length; i++) {
    this.queue(function(index) {
      // Set Duration
      var duration = 30;
      var obj = this._titleCommands[index];
      obj.select(-1)
      var data = { 
        obj: obj, 
        properties: ['y', 'opacity', 'contentsOpacity'], 
        from: {y: obj.y, opacity: obj.opacity, contentsOpacity: obj.contentsOpacity}, 
        to: {y: this.calcy(i), opacity: 255, contentsOpacity: 255}, 
        durations: {y: duration, opacity: duration, contentsOpacity: duration}}
      data.easing = Object_Movement.easeOutCirc;
      this.move.startMove(data);
    }.bind(this, i))
    // Wait
    this.queue('wait', 15);
  };

  this.queue(function() {
    // Activate Glitch
    this._glitchSettings.active =  this._worldType === 445
    // Activate Commands
    this._commandActive = true;
    // Update Command Window Selection
    this.updateCommandWindowSelection();
  }.bind(this, i))

};

Scene_OmoriTitleScreen.prototype.commandOptions = function() {
  this.queue(function() {
    for (var i = 0; i < this._titleCommands.length; i++) {
      // Set Duration
      var duration = 15;
      var obj = this._titleCommands[i];
      var isOverHalfway = PYRO.VertTitle.OptionsX / 320 > 0.5

      // distance between the nearest edge of the screen and options
      var dist = (640 * isOverHalfway - obj.x);

      // Gets the destination depending on the side the options are on.
      var dest = PYRO.VertTitle.OptionsX + (dist - (1 - isOverHalfway) * obj.width);
      var data = { 
          obj: obj, 
          properties: ['x', 'y', 'opacity', 'contentsOpacity'], 
          from: {x: obj.x, y: obj.y, opacity: obj.opacity, contentsOpacity: obj.contentsOpacity}, 
          to: {x: dest * PYRO.VertTitle.Animate, y: this.calcy(i), opacity: 255, contentsOpacity: 255}, 
          durations: {x: duration, y: duration, opacity: duration, contentsOpacity: duration}
      }
      data.easing = Object_Movement.easeOutCirc;
      this.move.startMove(data);
    };
    // Set Duration
    var duration = 35;
    var obj = this._optionsWindowsContainer;
    var data = { obj: obj, properties: ['y', 'opacity'], from: {y: obj.y, opacity: obj.opacity}, to: {y: 37, opacity: 255}, durations: {y: duration, opacity: duration}}
    data.easing = Object_Movement.easeOutCirc;
    this.move.startMove(data);
  }.bind(this))

  // Wait
  this.queue('setWaitMode', 'movement');

  this.queue(function() {
    // Activate Option Category Window
    this._optionCategoriesWindow.activate();
    this._controlOptionsWindow.refresh();
  }.bind(this))
};

//=============================================================================
// * On Option Category Cancel
//=============================================================================
Scene_OmoriTitleScreen.prototype.onCategoryCancel = function() {
  // Save Configuration
  ConfigManager.save();

  this.queue(function() {
    for (var i = 0; i < this._titleCommands.length; i++) {
      // Set Duration
      var duration = 15;
      var obj = this._titleCommands[i];
      var data = { 
        obj: obj, 
        properties: ['x', 'y', 'opacity', 'contentsOpacity'], 
        from: {x: obj.x, y: obj.y, opacity: obj.opacity, contentsOpacity: obj.contentsOpacity}, 
        to: {x: this.calcy(i), opacity: 255, contentsOpacity: 255}, 
        durations: {x: duration, y: duration, opacity: duration, contentsOpacity: duration}
      }
      data.easing = Object_Movement.easeOutCirc;
      this.move.startMove(data);
    };
    // Set Duration
    var duration = 25;
    var obj = this._optionsWindowsContainer;
    var data = { obj: obj, properties: ['y', 'opacity'], from: {y: obj.y, opacity: obj.opacity}, to: {y: -406, opacity: 255}, durations: {y: duration, opacity: duration}}
    data.easing = Object_Movement.easeOutCirc;
    this.move.startMove(data);
  }.bind(this))

  // Wait
  this.queue('setWaitMode', 'movement');

  this.queue(function() {
    this._commandActive = true;
  }.bind(this))
};

// INPUT
//=============================================================================
// * Update Command Input
//=============================================================================
Scene_OmoriTitleScreen.prototype.updateCommandInput = function() {
  // If Command is Active
  if (this._commandActive && !this.move.isMoving()) {
    // this._commandIndex
    if (Input.isRepeated('up')) {
      // If Command index is more than 0
      if (this._commandIndex > 0) {
        // Decrease Index
        this._commandIndex--;
        AudioManager.playSe({name: "sys_cursor1", pan: 0, pitch: 100, volume: 90});
        // Update Command Window Selection
        this.updateCommandWindowSelection();
      };
    };
    // If Input is right
    if (Input.isRepeated('down')) {
      // If Command index is less than title commands length
      if (this._commandIndex < this._titleCommands.length-1) {
        // Increase Index
        this._commandIndex++;
        AudioManager.playSe({name: "sys_cursor1", pan: 0, pitch: 100, volume: 90});
        // Update Command Window Selection
        this.updateCommandWindowSelection();
      };
    };

    // If Input Trigger ok
    if (Input.isTriggered('ok')) {

      switch (this._commandIndex) {
        case 0: // New Game
          AudioManager.playSe({name: "SE_load", pan: 0, pitch: 100, volume: 90});
          this.commandNewGame();
          this._commandActive = false;
          this._optionsActive = false;
        break;
        case 1: // Continue

          if (this._canContinue) {
            AudioManager.playSe({name: "SYS_select", pan: 0, pitch: 100, volume: 90});
            this.commandContinue();
            this._commandActive = false;
            this._optionsActive = false;
          } else {
            SoundManager.playBuzzer();
          };
        break;
        case 2: // Options
          AudioManager.playSe({name: "SYS_select", pan: 0, pitch: 100, volume: 90});
          this.commandOptions();
          this._optionsActive = true;
          this._commandActive = false;
        break;
      }
    }
  };
};

if(PYRO.VertTitle.SameWidth) {
  //=============================================================================
  // * Object Initialization
  //=============================================================================
  Window_OmoTitleScreenBox.prototype.initialize = function(text = '', longest = "") {

    // Ensures compatibility with plugins that add buttons to the titlescreen (such as Badges).
    if(!longest) {
      longest = LanguageManager.getMessageData("XX_BLUE.Omori_Title_Screen").commands[0];
    };

    // Set Set
    this._text = text;
    // Super Call
    Window_Selectable.prototype.initialize.call(this, 0, 0, 160 - 30, 30);
    // BlueMoon - Fix Title Screen Spacing:
    this.width = this.textWidth(longest) + this.standardPadding() * 6;
    this.createContents();
    // Set Opacity
    this.opacity = 0;
    this.contentsOpacity = 0;
    // Set Enabled Flag
    this._enabled = true;
    // Refresh
    this.refresh();
    // Activate
    this.activate();
  };
}

Scene_OmoriTitleScreen.prototype.calcy = function(i) {
  // 32 is sep, 48 is assumed height of a box.
  return i * PYRO.VertTitle.Separation + PYRO.VertTitle.BadgeOffset * (PYRO.VertTitle.Separation + 32) + PYRO.VertTitle.OffsetY;
}

