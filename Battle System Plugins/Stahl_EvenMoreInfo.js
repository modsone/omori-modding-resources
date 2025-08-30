var Imported = Imported || {};
Imported.Stahl_EvenMoreInfo = true;

var Stahl = Stahl || {};
Stahl.EvenMoreInfo = Stahl.EvenMoreInfo || {};

/*:
 * @plugindesc [v1.0.0] Extended More Info with modifiable content using JS override.
 * 
 * @author ReynStahl
 *
 * @help
 * This plugin is intended of making enemy display more extensible,
 * intended to be overriden for own mod purposes.
 * 
 * Majority of function requires overriding with JS.
 * Read the comments written with the function instead.
 * 
 * Additionally requires "mp_enemy_box_gradients.png" and "enemy_box_extended.png" in system images
 */

/**
 * Helper class for Status Display.
 * Its functions can be overrided with other plugin placed below.
 */
function StatusDisplayManager() {
  throw new Error('This is a static class');
}

/**
 * Control when to do extended boxes.
 * @returns boolean
 */
StatusDisplayManager.doOpenMore = function() {
  return Input.isPressed('shift') || Input.isPressed('up') || Input.isPressed('down');
}

/**
 * Line height of extra info lines.
 * @returns int
 */
StatusDisplayManager.extraLineHeight = function() {
  return 15;
}

/**
 * Return message of party. (ie "What will x and y do?")
 * @param {*} size Number of members
 * @returns String
 */
StatusDisplayManager.getPartySizeMessage = function(size) {
  let source = LanguageManager.languageData().text.XX_GENERAL;
  switch(size) {
    case 1:
      return source.message_104.text.format($gameParty.leader().name());
    case 2:
      return source.message_102.text.format($gameParty.leader().name(), $gameParty.members()[1].name());
    default:
      return source.message_100.text.format($gameParty.leader().name()); 
  }
}

/**
 * Returns an array of line. Intended for log message that appear pre-select actor.
 * @returns String[]
 */
StatusDisplayManager.getPartyCommandMessage = function() {
  let size = $gameParty.size();
  let promptMessage = this.getPartySizeMessage(size);

  let escapeRatio = parseInt(Math.min(100, BattleManager._escapeRatio * 100));
  let escapeMessage = "Can't escape!";
  if (BattleManager.canEscape()) {
    escapeMessage = "Escape rate: " + escapeRatio + "%";
  }
  escapeMessage = "[" + escapeMessage + "]";

  return [promptMessage, escapeMessage];
}

/**
 * Returns an array of line. Intended for log message that appear on select actor.
 * @param {*} actor Game_Actor
 * @returns String[]
 */
StatusDisplayManager.getActorActionPromptMessage = function(actor) {
  let lines = [];
  lines.push(LanguageManager.languageData().text.XX_GENERAL.message_104.text.format(actor.name()));
  lines.push(`[ATK: ${actor.atk}, DEF: ${actor.def}, SPD: ${actor.agi}, LCK: ${actor.luk}]`);
  return lines;
}

/**
 * Returns a line for the footnote on bottom left of the name.
 * Good for telling controls or other data like level.
 * @param {*} battler Game_Enemy
 * @returns String
 */
StatusDisplayManager.getFootnoteMessage = function(battler) {
  return "> SHIFT";
}

/**
 * Gets array of string to display stats. Alternate between left and right column, going up a row every 2 item.
 * @param {*} battler 
 * @returns String[]
 */
StatusDisplayManager.getSideStatLines = function(battler) {
  return [
    `ATK: ${battler.atk}`,
    `DEF: ${battler.def}`,
    `SPD: ${battler.agi}`,
    `LCK: ${battler.luk}`,
  ]
}

/**
 * Returns an array of custom line objects to display in extra info box.
 * For example createLineSimple or createLinePair.
 * @param {*} battler Game_Battler, though probably just only Game_Enemy
 * @returns Array of Custom Lines
 */
StatusDisplayManager.getExtraInfoLines = function(battler) {
  return [this.createLineSimple(battler.name() + " more info here!", "#ffff55")];
}

/**
 * A Custom Info Line. Displays simple line.
 * @param {*} text 
 * @param {*} color 
 * @returns Custom Line Object
 */
StatusDisplayManager.createLineSimple = function(text, color) {
  color = color || "#ffffff";
  return {lineType: "SIMPLE", text: text, color: color}
}

/**
 * A Custom Info Line. Displays a pair of label and text.
 * Good for trait list.
 * @param {*} label 
 * @param {*} text 
 * @param {*} labelColor 
 * @param {*} color 
 * @returns Custom Line Object
 */
StatusDisplayManager.createLinePair = function(label, text, labelColor, color) {
  labelColor = labelColor || "#ffff55";
  color = color || "#ffffff";
  return {lineType: "PAIR", label: label, text: text, labelColor: labelColor, color: color}
}

// ================================================================================================================================
// * BASE GAME FUNCTION OVERRIDE
// ================================================================================================================================
Scene_Battle.prototype.addActorActionPromptLogText = function() {
  // Get Actor
  var actor = BattleManager.actor();
  // If Actor Exists
  if (actor) {
    var lines = StatusDisplayManager.getActorActionPromptMessage(actor);
    var doInstant = true;
    for (let line of lines) {
      this.addLogCommandMessage(line, doInstant);
      doInstant = false;
    }
  };
};

Stahl.EvenMoreInfo.Scene_Battle_loadReservedBitmaps = Scene_Battle.prototype.loadReservedBitmaps
Scene_Battle.prototype.loadReservedBitmaps = function() {
  // Run Original Function
  Stahl.EvenMoreInfo.Scene_Battle_loadReservedBitmaps.call(this);
  //Reserve the new gradient for enemy MP
  ImageManager.reserveSystem('mp_enemy_box_gradients', 0, this._imageReservationId);
  ImageManager.reserveSystem('enemy_box_extended', 0, this._imageReservationId);
};

/**
 * Creates a Nine Patch Rect. Essentially divides the image into 3x3 grid that support variable width.
 * @param {*} image The Image object.
 * @param {*} c1 Column 1 - Left Split
 * @param {*} c2 Column 2 - Right Split
 * @param {*} r1 Row 1 - Top Split
 * @param {*} r2 Row 2 - Bottom Split
 * @param {*} w Output Width
 * @param {*} h Output Height
 */
Sprite_EnemyBattlerStatus.prototype.ninePatchRect = function(image, c1, c2, r1, r2, w, h) {
  w = w || this.bitmap.width
  h = h || this.bitmap.height
  c3 = image.width // Right most Edge - Col 3
  r3 = image.height // Bottom most Edge - Row 3
  wm = w - c1 - (c3-c2) // Width Mid
  hm = h - r1 - (r3-r2) // Height Mid
  
  this.bitmap.blt(image, 0,   0,   c1,     r1,     0,     0); // Top Left
  this.bitmap.blt(image, c1,  0,   c2-c1,  r1,     c1,    0, wm); // Top Mid
  this.bitmap.blt(image, c2,  0,   c3-c2,  r1,     c1+wm,  0); // Top Right
  this.bitmap.blt(image, 0,   r1,  c1,     r2-r1,  0,     r1, c1, hm); // Mid Left
  this.bitmap.blt(image, c1,  r1,  c2-c1,  r2-r1,  c1,    r1, wm, hm); // Mid Mid
  this.bitmap.blt(image, c2,  r1,  c3-c2,  r2-r1,  c1+wm,  r1, c3-c2, hm); // Mid Right
  this.bitmap.blt(image, 0,   r2,  c1,     r3-r2,  0,     r1+hm); // Bottom Left
  this.bitmap.blt(image, c1,  r2,  c2-c1,  r3-r2,  c1,    r1+hm, wm); // Bottom Mid
  this.bitmap.blt(image, c2,  r2,  c3-c2,  r3-r2,  c1+wm,  r1+hm); // Bottom Right
};

// ================ MAIN REFRESH DISPLAY ================
Sprite_EnemyBattlerStatus.prototype.minWidth = function() { return 225 };

Sprite_EnemyBattlerStatus.prototype.refreshBitmap = function(battler) {
  // If Battler Exists
  if (battler) {
    // Get Battler Name
    var name = battler.name();
    var nameWidth = this.bitmap.measureTextWidth(name, true);

    // Recreate Bitmap
    var infoLines = StatusDisplayManager.getExtraInfoLines(battler);
    var boxHeight = this._openMore ? (105 + Math.max(infoLines.length-1, 0) * StatusDisplayManager.extraLineHeight()) : 80;
    var imageFile = this._openMore ? 'enemy_box_extended' : 'enemy_box';

    this.bitmap = new Bitmap(Math.max(this.minWidth(), nameWidth + 20), boxHeight);
    
    this.bitmap.fontSize = 24;
    this.bitmap.fillAll('rgba(0, 0, 0, 0)');

    // Get Back Bitmap
    var backBitmap = ImageManager.loadSystem(imageFile);
    
    // Make Background
    if (this._openMore) 
      this.ninePatchRect(backBitmap, 7, 8, 100, 150); // If more info, expand both
    else 
      this.ninePatchRect(backBitmap, 7, 8, backBitmap.height, backBitmap.height); // Regular just expand width

    // Draw Name
    this.bitmap.drawText(name, 0, 5, this.width, 24, 'center');

    // Bottom right of black box, relative to right side
    this.bitmap.fontSize = 13;
    this.bitmap.drawText(StatusDisplayManager.getFootnoteMessage(battler), -10, 12, this.width, 24, 'right');

    // Draw Stats
    let sideText = StatusDisplayManager.getSideStatLines(battler);
    let curStatY = 83;
    let curStatGap = 25;
    this.bitmap.fontSize = 14;

    // Less item get bit larger
    if (sideText.length <= 4) {
      curStatY = 92;
      curStatGap = 30;
      this.bitmap.fontSize = 15;
    }

    for (let i = 0; i+1 < sideText.length; i += 2) {
      this.bitmap.drawText(sideText[i] || "", 8, 0, this.width, curStatY, 'left'); // Left content
      this.bitmap.drawText(sideText[i+1] || "", -8, 0, this.width, curStatY, 'right'); // Right content
      curStatY += curStatGap;
    }

    // Draw HP / MP bar
    this.drawBar('enemy_box_gradients', 'hp_icon', battler.hpRate(), `${battler.hp}/${battler.mhp}`, 40);
    this.drawBar('mp_enemy_box_gradients', 'mp_icon', battler.mpRate(), `${battler.mp}/${battler.mmp}`, 56);

    // Display more info lines
    if (this._openMore) {
      this.drawMoreInfoLines(infoLines);
    }

    // Refresh Cursor
    this.setCursorPosition(battler.battleStatusCursorPosition());
  };
};

Sprite_EnemyBattlerStatus.prototype.drawBar = function(barImage, iconImage, progress, label, yOffset) {
  var bar = ImageManager.loadSystem(barImage)
  var icon = ImageManager.loadSystem(iconImage);
  var sx = ((this.width - (bar.width + icon.width)) / 2);

  this.bitmap.blt(icon, 0, 0, icon.width, icon.height, sx, yOffset);

  sx += icon.width;
  var barHeight = bar.height / 2;
  this.bitmap.blt(bar, 0, barHeight, bar.width, barHeight, sx, yOffset + 2)
  this.bitmap.blt(bar, 0, 0, progress * bar.width, barHeight, sx, yOffset + 2)
  
  this.bitmap.fontSize = 12;
  this.bitmap.drawText(label, sx, yOffset + 5, bar.width - 3, 3, 'right');
}

Sprite_EnemyBattlerStatus.prototype.drawMoreInfoLines = function(infoLines) {
  let curY = 80
  this.bitmap.fontSize = 16;
  for (let i = 0; i < infoLines.length; i++) {
    let line = infoLines[i];
    if (line.lineType == "SIMPLE") {
      this.bitmap.textColor = line.color;
      this.bitmap.drawText(line.text, 8, curY, this.width, 12, 'left');
    } else if (line.lineType == "PAIR") {
      this.bitmap.textColor = line.labelColor;
      this.bitmap.drawText(line.label, 8, curY, this.width, 12, 'left');
      this.bitmap.textColor = line.color;
      this.bitmap.drawText(line.text, 53, curY, this.width, 12, 'left');
    } else {
      console.log("MORE INFO INVALID LINE TYPE")
    }
    curY += StatusDisplayManager.extraLineHeight();
  }
  this.bitmap.textColor = "#ffffff";
}

Scene_Battle.prototype.pushPartyMessage = function() {
  var lines = StatusDisplayManager.getPartyCommandMessage();
  var doInstant = true;
  for (let line of lines) {
    this.addLogCommandMessage(line, doInstant);
    doInstant = false;
  }
}

// This function is edited so it updates every time key is pressed, and passes on "openMore" variable to _statusSprite
Stahl.EvenMoreInfo.Sprite_Enemy_updateStatusSprite = Sprite_Enemy.prototype.updateStatusSprite;
Sprite_Enemy.prototype.updateStatusSprite = function() {
  Stahl.EvenMoreInfo.Sprite_Enemy_updateStatusSprite.call(this, ...arguments);
  if (this._enemy) {
    var selected = this._enemy.isSelected()
    var oldOpenMore = this._statusSprite._openMore
    this._statusSprite._openMore = StatusDisplayManager.doOpenMore();
    // only update when there's a change in openMore
    if (selected && this._statusSprite.visible && (oldOpenMore != this._statusSprite._openMore)) {
      console.log("openMore Update")
      this._statusSprite.refreshBitmap(this._enemy);
    }
  }
}