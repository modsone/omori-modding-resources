 /*:
 * @plugindesc Implements custom keybinds for mods.
 * @author Geo
 * @help
 * Check out the "example_custombinds.yaml" provided with this plugin for instructions.
 */

var beesList = beesList || {};
beesList.customKeys = beesList.customKeys || {};

beesList.customKeys.keys = [];

beesList.customKeys.languageDataKeysName = Object.keys(LanguageManager.languageData().text).find(key => key.contains("_custombinds"));
beesList.customKeys.languageDataKeys = LanguageManager.languageData().text[beesList.customKeys.languageDataKeysName];

for (const [key, value] of Object.entries(beesList.customKeys.languageDataKeys)) {
	let keySettings = {name: key, menuName: value.menuName, key: value.key, gKey: value.gamepadKey};
	beesList.customKeys.keys.push(keySettings);
};

beesList.customKeys.keyMapper = {
      9: 'tab',       // tab
      90: 'ok',       // enter
      16: 'shift',    // shift
      17: 'control',  // control
      65: 'tag',      // A
      88: 'escape',   // X
      37: 'left',     // left arrow
      38: 'up',       // up arrow
      39: 'right',    // right arrow
      40: 'down',     // down arrow
      81: 'pageup',   // Q
      87: 'pagedown', // W
      120: 'debug'    // F9
};
beesList.customKeys.keys.forEach((k) => {
  if (beesList.customKeys.keyMapper[k.key]) {
	return;
  };
  beesList.customKeys.keyMapper[k.key] = k.name;
});

beesList.customKeys.gamepadMapper = {
    0: 'ok',        // A
    1: 'escape',    // B
    2: 'shift',     // X
    3: 'tag',      // Y
    4: 'pageup',    // LB
    5: 'pagedown',  // RB

    //6: 'SIX6',
    //7: 'SEVEN7',
    8: 'tab',
    //9: 'NINE9',
    //10: 'TEN10',
    //11: 'ELEVEN11',

    12: 'up',       // D-pad up
    13: 'down',     // D-pad down
    14: 'left',     // D-pad left
    15: 'right',    // D-pad right
    //16: 'SIXTEEN16',
};
beesList.customKeys.keys.forEach((k) => {
    if (Input.gamepadMapper[k.gKey]) {
      return;
    };
    Input.gamepadMapper[k.gKey] = k.name;
});

//--------------------------------------
// ConfigManager + Keybinding stuff
//--------------------------------------

beesList.customKeys.setDefaultKeyboardKeyMap = ConfigManager.setDefaultKeyboardKeyMap;
ConfigManager.setDefaultKeyboardKeyMap = function() {
  beesList.customKeys.setDefaultKeyboardKeyMap.call(this);
  Input.keyMapper = beesList.customKeys.keyMapper;
};

beesList.customKeys.setDefaultGamepadKeyMap = ConfigManager.setDefaultGamepadKeyMap;
ConfigManager.setDefaultGamepadKeyMap = function() {
  beesList.customKeys.setDefaultGamepadKeyMap.call(this);
  Input.gamepadMapper = beesList.customKeys.gamepadMapper;
};

// ----- Undefined keybind fix -----

Window_OmoMenuOptionsControls.prototype.makeOptionsList = function() {
  // Backup Options List
  let old_options;
  if(!!this._optionsList) {old_options = this._optionsList.slice();}
  // Initialize Options List
  this._optionsList = [];
  // Get KeyMappers
  var keyMapper = Object.entries(Input.keyMapper);
  var gamepadMapper = Object.entries(Input.gamepadMapper);
  // Get Source Text
  var text = LanguageManager.getPluginText('optionsMenu', 'controls');
  // Get Input Names
  var inputNames = Object.keys(text.inputNames);
  // Add any custom keys
  beesList.customKeys.keys.forEach((k) => {
    if (!inputNames.includes(k.name)) {
      inputNames.push(k.name);
      text.inputNames[k.name] = k.menuName;
    };
  });
  var directionInputs = [12, 13, 14, 15];
  // Go through input Names
  for (var i = 0; i < inputNames.length; i++) {
    // Get Input
    var input = inputNames[i];
    // Get Column
    var column = (i % 2);
    // Get Key
	var key = keyMapper.find(function(arr) { return arr[1] === input });
    key = key ? Number(key[0]) : -1;	
    // Add Options to List
	if (key >= 0) {
      this._optionsList.push({header: text.inputNames[input], name: String(LanguageManager.getInputName('keyboard', key)).toUpperCase(), key: key, map: input, keyboard: true })
	} else {
	  this._optionsList.push({header: text.inputNames[input], name: "UNBOUND", key: key, map: input, keyboard: true, unbound: true })
	};
    // Get Key
	var key = gamepadMapper.find(function(arr) { return arr[1] === input });
    key = key ? Number(key[0]) : -1;
    // Add Options to List
	if (key >= 0) {
      this._optionsList.push({header: text.inputNames[input], name:  String(LanguageManager.getInputName('gamepad', key)).toUpperCase(), key: key, map: input, gamepad: true, direction: directionInputs.contains(key) })
	} else {
	  this._optionsList.push({header: text.inputNames[input], name: "UNBOUND", key: key, map: input, gamepad: true, direction: directionInputs.contains(key), unbound: true })
	};
  };
  this._optionsList.push({header: '', name: text.resetAll, resetKeyboard: true})
  this._optionsList.push({header: '', name: text.resetAll, resetGamepad: true})
};

Window_OmoMenuOptionsControls.prototype.drawItem = function(index) {
  // Get Item Rect
  var rect = this.itemRect(index);
  // Get Row
  var row = index % this.maxCols();
  // Get Data
  var data = this._optionsList[index];
  // If Row is 0
  if (row === 0) {
    // this.contents.drawInputIcon('', rect.x - 140, rect.y + 7);
    // Draw Header
    this.contents.drawText(data.header, rect.x - 140, rect.y, rect.width, rect.height);
  };
  // If Data Exists
  if (data) {
    rect.x += 50;
    // If Reset
    if (data.resetKeyboard || data.resetGamepad) {
      // Draw Header
      this.contents.drawText(data.name, rect.x, rect.y, rect.width, rect.height);
    };
	  // If key is unbound
	if (data.unbound) {
      this.contents.drawText(data.name, rect.x + 6, rect.y, rect.width, rect.height);		
	}
    if (data.keyboard && !data.unbound) {
      rect.x += 35;
      this.contents.drawKeyIcon(data.key, rect.x , rect.y + 7, "keyboardBlack24");
    }
    if (data.gamepad && !data.unbound) {
      rect.x += 25;
      this.contents.drawKeyIcon(data.key, rect.x, rect.y + 7, 'gamepadBlack24', data.direction ? 1 : 0);
    };
   // console.log(data)
  };
};

// ----- -----

var oldconfigManager_applyData = ConfigManager.applyData;
ConfigManager.applyData = function(config) {
  oldconfigManager_applyData.call(this, config);
  if (Input.keyMapper) {
    ConfigManager.checkInexistentKeys();
    // console.log(Input.keyMapper);
    beesList.customKeys.keys.forEach((k) => {
        for (i in Input.keyMapper) {
            if (Input.keyMapper[i] === k.name) {
                var exists = true;
            };
        };
        for (i in Input.gamepadMapper) {
            if (Input.gamepadMapper[i] === k.name) {
                var gExists = true;
            };
        };
        if (!exists && !Input.keyMapper[k.key]) {
            Input.keyMapper[k.key] = k.name;
        };
        if (!gExists && !Input.gamepadMapper[k.gKey]) {
             Input.gamepadMapper[k.gKey] = k.name;
        };
        exists = null;
        gExists = null;
    });
  };
};

ConfigManager.checkInexistentKeys = function() {
  var keyMapper = beesList.customKeys.keyMapper;
  var gamepadMapper = beesList.customKeys.gamepadMapper;
  for (k in Input.keyMapper) {
    if (!Object.values(keyMapper).includes(Input.keyMapper[k])) {
        delete Input.keyMapper[k]; 
    };
  };
  for (g in Input.gamepadMapper) {
    if (!Object.values(gamepadMapper).includes(Input.gamepadMapper[g])) {
        delete Input.gamepadMapper[g]; 
    };
  };
};