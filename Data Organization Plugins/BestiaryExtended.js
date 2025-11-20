/*:
 * @plugindesc [v1.0.2] Gives the Bestiary more features.
 *
 * @author Stahl, Pyro, vl
 *
 * @help
 * Allows bestiary to be controlled in more ways:
 * - Control whether to do Foes Filed achievement (overrideable function).
 * - What file to get data from (overrideable function).
 * - Multiple page support.
 * - Eval conditionals.
 * - Locked page text.
 * - TextEx macro support. (Note: Text no longer squish to fit the width of the box)
 * - Backwards compatible with base game bestiary format.
 * 
 * Controls:
 * - By default, Holding shift will skip to next entry directly.
 * 
 * Dependencies: Put this BELOW base game Bestiary.js
 * 
 * ==== EXAMPLE FORMAT ====
 * 1516:
 *   name: FOREST BUNNY
 *   background: {name: 'battleback_rv_platform', x: 0, y: 0}
 *   position: {x: 160, y: 425}
 *   character: {name: 'ENEMY_BUNNIES', index: 0}
 *   listIndex: 0
 * 
 *   # Optional, custom Condition will override the original condition of if enemy defeated before
 *   evalCondition: 1 == 1
 * 
 *   # Optional, changes the locked text (original: ------------------------------)
 *   lockedText: LOCKED ENTRY!
 * 
 *   # This is optional, forces enemy to use that id for sprite
 *   forceTransformId: 1516
 * 
 *   # Bestiary can have own pages, each with own condition and locked text as well
 *   pages:
 *     1:
 *       text: |
 *         THIS IS PAGE 1
 *         More Lines!
 *   
 *         - YOU
 *     2:
 *       evalCondition: 1 == 0
 *       lockedText: LOCKED!!! DO THINGS!!!
 *       text: |
 *         THIS IS PAGE 2
 *         More Lines!
 *         
 *         - YOU
 * 
 * 
 * 
 * TERMS OF USE
 * Licensed under the WTFPL license
 *
 */

/**
 * Helper class for bestiary extended.
 * It's functions can be overrided with other plugin placed below.
 */
function BestiaryManager() {
  throw new Error('This is a static class');
}

/**
 * Whether to do "FOES FILED!" steam achievement when all enemies are logged.
 * @returns boolean
 */
BestiaryManager.doFoesFiledAchievement = function() {
  return false;
}

/**
 * The main information data
 * @returns String
 */
BestiaryManager.getInformationData = function() {
  return LanguageManager.getTextData('Bestiary', 'Information');
}

/**
 * The top title when the entries is locked. Original says 'FOE FACTS!'
 * @returns String
 */
BestiaryManager.getEmptyEnemyName = function() {
  return LanguageManager.getTextData('Bestiary', 'EmptyEnemyName');
}

/**
 * Input the lines from and the bestiary, and allow to return modification of it.
 * @returns Array of Strings
 */
BestiaryManager.modifyLines = function(lines, bestiary) {
  return lines;
}

/**
 * Gets the line height of the main information text.
 * @returns int : line height
 */
BestiaryManager.getLineHeight = function() {
  return 20;
}

/**
 * Adds a string to the start of all lines. Useful for setting macro for drawTextEx, like font size and color.
 * @returns String
 */
BestiaryManager.modifyLineEach = function(line, bestiary) {
  return "\\fs[22]" + line;
}

BestiaryManager.skipPagesControl = function() {
  return Input.isPressed('shift');
}

//=============================================================================
// * Extra conditional to avoid accidentally triggering achivement on enemy defeat.
//=============================================================================
Game_Party.prototype.addDefeatedEnemy = function(id) {
  // Of Defeated Enemies array does not contain ID
  if (!this._defeatedEnemies.contains(id)) {
    // Add ID to defeated enemies array
    this._defeatedEnemies.push(id);
  };
  // Extra conditional to avoid accidentally triggering achivement.
  if (BestiaryManager.doFoesFiledAchievement()) {
    let allEnemies = Object.keys(BestiaryManager.getInformationData()).map(Number);
    if(allEnemies.every(enemyId => this._defeatedEnemies.contains(enemyId))) {
      $gameSystem.unlockAchievement("FOES_FILED"); // Unlock complete bestiary achievement;
    }
  }
};

//=============================================================================
// * Changing where data is grabbed
//=============================================================================
Scene_OmoriBestiary.prototype.onListChangeUpdate = function() {
  var enemyId =  this._enemyListWindow.enemyId();  // Get Enemy ID
  var enemySprite = this._enemyWindow._enemySprite;  // Get Enemy Sprite
  // If the enemy ID is more than 0 / exists
  if (enemyId > 0) {
    this._enemyWindow.clearOpacity();
    enemySprite.removeChildren();
    var data = BestiaryManager.getInformationData()[enemyId];   // Get Data
    this._enemy.transform(data.forceTransformId || enemyId);     // If enemy ID has changed transform, MOVED AFTER DATA
    var background = data.background;    // Get Background Data
    this._enemyNameWindow.drawName(this._enemyListWindow.enemyName(data));    // Draw Name
    enemySprite.setHome(data.position.x, data.position.y)   // Set Home Position
    enemySprite.visible = true;    // Set Enemy Sprite to visible
    enemySprite.startMotion("other");  // Start Enemy Sprite Motion
    enemySprite.update();    // Update Enemy Sprite
    this._enemyWindow.setBackground(background.name, background.x, background.y)  // Set Background
  } else {
    enemySprite.setHome(-Graphics.width, -Graphics.height)    // Make Enemy Sprite invisible
    this._enemyNameWindow.drawName(BestiaryManager.getEmptyEnemyName())    // Draw Name
    this._enemyWindow.setBackground(null);    // Set Background
  };
};

Scene_OmoriBestiary.prototype.onEnemyListOk = function() {
  var enemyId =  this._enemyListWindow.enemyId();  // Get Enemy ID
  var data = BestiaryManager.getInformationData()[enemyId];  // Get Data
  this._enemyTextWindow.visible = true;  // Make Enemy Text Window Visible

  var lines = "";
  // Tracks recent locked page. Can be useful for other plugin to see if most recent page was locked
  this.recentLockedPage = false;
  // If there's custom more pages, use new one
  if (data.pages) {
    lines = this.getLinesPaged(data);
  } else {
    lines = this.getLinesOriginal(data);
  }

  lines = BestiaryManager.modifyLines(lines, this);

  // Draw Lines
  this._enemyTextWindow.drawLines(lines);
  var character = this._enemyTextWindow._enemyCharacter;  // Get Character
  let sprite = this._enemyTextWindow._characterSprite;
  // If Character Data Exists
  if (data.character) {
    character.setImage(data.character.name, data.character.index);    // Set Character Image
  } else {
    character.setImage('', 0);    // Set Character Image to nothing
  };
  // Update Sprite
  sprite.update()
  this._enemyTextWindow.updateCharacter();  // Update Character
  this._enemyTextWindow._characterSprite.update();
  this._enemyNameWindow.drawName(this._enemyListWindow.enemyName(data));
  this._enemyNameWindow.drawPageNum(this.pageNumber, this.getMaxPage())
};


//=============================================================================
// * Getting line data, refactored to own function for organization
//=============================================================================

Scene_OmoriBestiary.prototype.getLinesOriginal = function(data) {
  var lines = data.text.split(/[\r\n]/g);  // Get Lines
  var conditionalText = data.conditionalText;  // Get Conditional Text
  // If Conditional Text Exists
  if (conditionalText) {
    // Go through conditional text
    for (var i = 0; i < conditionalText.length; i++) {
      var textData = conditionalText[i];      // Get text Data
      if (textData.switchIds.every(function(id) { return $gameSwitches.value(id); })){      // Check if all switches are active
        var lineIndex = textData.line === null ? lines.length : textData.line;        // Get Line Index
        var extraLines = textData.text.split(/[\r\n]/g);        // Get Extra Lines
        lines.splice(lineIndex, 0, ...extraLines)        // Add extra lines to main lines array
      };
    };
  }
  return lines;
}

Scene_OmoriBestiary.prototype.getLinesPaged = function(data) {
  var page = data.pages[this.pageNumber];
  if (page) {
    // if no condition OR there is condition and it passes
    if (!page.evalCondition || eval(page.evalCondition)) {
      this.recentLockedPage = false;
      return page.text.split(/[\r\n]/g);
    } else {
      this.recentLockedPage = true;
      return page.lockedText ? page.lockedText.split(/[\r\n]/g) : ['------------------------------'];
    }
  }
  return null;
}

Scene_OmoriBestiary.prototype.getMaxPage = function() {
  var enemyId = this._enemyListWindow.enemyId();  // Get Enemy ID
  var data = BestiaryManager.getInformationData()[enemyId];  // Get Data
  if (!data.pages) {
    return 1;
  }
  var count = 1;
  // loop until hits invalid page
  while (data.pages[count]) { count++; }
  return count - 1;
}

//=============================================================================
// * Changing where data is grabbed
//=============================================================================

Window_OmoBestiaryEnemyList.prototype.initialize = function() {
  // Get Entries for Sorted Bestiary list
  this._sortedBestiaryList = Object.entries(BestiaryManager.getInformationData());
  // Sort list
  this._sortedBestiaryList.sort(function(a, b) {
    var indexA = a[1].listIndex === undefined ? Number(a[0]) : a[1].listIndex
    var indexB = b[1].listIndex === undefined ? Number(b[0]) : b[1].listIndex
    return indexA - indexB
  });
  // Super Call
  Window_Command.prototype.initialize.call(this, 0, 0);
};

Window_OmoBestiaryEnemyList.prototype.makeCommandList = function() {
  var list = $gameParty._defeatedEnemies;  // Get List
  // Go Through List of Entries
  for (let [id, obj] of this._sortedBestiaryList) {
    var index = Number(id);    // Get Index
    // If Condition exist, use eval condition. Else, use original Defeated Enemy list contains id
    if (obj.evalCondition ? eval(obj.evalCondition) : list.contains(index)) {
      this.addCommand(this.enemyName(obj), 'ok', true, index)      // Add Command
    } else {
      this.addCommand(obj.lockedText || '------------------------------', 'nothing', false, 0)      // Add Empty Command
    };
  };
};

//=============================================================================
// * Draw Information - Changes to drawTextEx to add colors and other styles
//=============================================================================
Window_OmoBestiaryEnemyText.prototype.drawLines = function(lines) {
  this.contents.clear();  // Clear Contents
  for (var i = 0; i < lines.length; i++) {  // Go Through Lines 
    this.drawTextEx(BestiaryManager.modifyLineEach(lines[i], this), 0, -10 + (i * BestiaryManager.getLineHeight()));    // Draw Line
  };
};

Window_OmoBestiaryEnemyName.prototype.drawName = function(name) {
  this.contents.clear()
  this.drawTextEx(name, 15, -5);
};

Window_OmoBestiaryEnemyName.prototype.drawPageNum = function(pageNumber, pageMax) {
  if (pageMax > 1) { // Only draws if there is more than 1 page.
    this.drawTextEx(`\\fs[20](${pageNumber}/${pageMax})`, this.contents.width - 38, 8);
  }
};

Window_OmoBestiaryEnemyList.prototype.drawItem = function(index) {
  var rect = this.itemRectForText(index);
  var align = this.itemTextAlign();
  this.resetTextColor();
  this.changePaintOpacity(true);
  this.drawTextEx(this.commandName(index), rect.x, rect.y);
};

Window_OmoBestiaryEnemyText.prototype.drawInformation = function(information) {
  this.contents.clear();
  var lines = information.split(/[\r\n]/g);
  for (var i = 0; i < lines.length; i++) {
    this.drawTextEx(lines[i], 0, -10 + (i * 24));
  };
};

//=============================================================================
// * ADDED PAGE NUMBERS
//=============================================================================

Scene_OmoriBestiary.prototype.start = function() {
  // Super Call
  Scene_BaseEX.prototype.start.call(this);
  // Set page number
  this.pageNumber = 1;
  // Start Fade in
  this.startFadeIn(this.slowFadeSpeed(), false);
};

Scene_OmoriBestiary.prototype.update = function() {
  // Super Call
  Scene_BaseEX.prototype.update.call(this);

  // If Enemy Text Window is visible
  if (this._enemyTextWindow.visible) {
    var skipPages = BestiaryManager.skipPagesControl(); // Go to next entry regardless of current page, like base game
    if (Input.isTriggered('cancel')) {
      this.pageNumber = 1;
      SoundManager.playCancel();
      this._enemyListWindow._onCursorChangeFunct = undefined;
      this._enemyListWindow.activate();
      this._enemyTextWindow.visible = false;
      this._enemyListWindow._onCursorChangeFunct = this.onListChangeUpdate.bind(this);
      return;
    }
    if (Input.isTriggered('left')) {
      this.pageNumber--;
      if (skipPages || this.pageNumber < 1) {
        this._enemyListWindow.selectPreviousEnemy();
        this.onListChangeUpdate();
        this.pageNumber = skipPages ? 1 : this.getMaxPage();
      }
      AudioManager.playSe({name: "SE_turn_page", pan: 0, pitch: 100, volume: 90});
      this.onEnemyListOk();
    };
    if (Input.isTriggered('right')) {
      this.pageNumber++;
      if (skipPages || this.pageNumber > this.getMaxPage()) {
        this._enemyListWindow.selectNextEnemy();
        this.onListChangeUpdate();
        this.pageNumber = 1;
      }
      AudioManager.playSe({name: "SE_turn_page", pan: 0, pitch: 100, volume: 90});
      this.onEnemyListOk();
    };
  };
};