/*:
 * @plugindesc v1.0.0 Refactor to allow easier editing of command UI and stress bar.
 * @author ReynStahl
 *
 * @help
 * Command UI and Stress bar refactoring.
 * This is mostly a JS refactor.
 */

var Imported = Imported || {};
Imported.Stahl_MoreSkillDisplay = true;

var Stahl = Stahl || {};
Stahl.MoreSkillDisplay = Stahl.MoreSkillDisplay || {};

class CommandDisplayData {
  constructor() {
    this.battleCommandName = "BattleCommands_DreamWorld";
    this.battleCommandCustomCursorXOffset = 12;
    this.battleCommandCommandMaxCols = 2;
    this.battleCommandSize = 4;
    this.partyCommandName = "PartyCommands_DreamWorld";
    this.partyCommandSize = 2;
    this.doEscapeBlockEffect = false;
    this.ekgName = "energy_stress_ekg_line";
    this.stressBarCenterIndex = false;
    this.stressBarDisplay = false;
  }
}

class StahlUIHelper {
  static showStressBar() {
    // return ![2, 4, 5, 6].contains($gameVariables.value(22));
    return !$gameSwitches.value(41);
  }

  static getCommandDisplayData() {
    let data = new CommandDisplayData();
    let world = $gameVariables.value(22);
    switch (world) {
      case 1:
      case 4: // REVERIE: Changed value 4 to Dreamworld
        data.ekgName = "energy_dw_line";
        data.battleCommandCommandMaxCols = 2;
        data.stressBarCenterIndex = true;
        break;
      case 2:
        data.battleCommandName = "BattleCommands_Faraway";
        data.partyCommandName = "PartyCommands_Faraway";
        break;
      case 3:
      case 5:
        data.battleCommandName = "BattleCommands_BlackSpace";
        data.battleCommandCustomCursorXOffset = 90;
        data.battleCommandCommandMaxCols = 1;
        data.partyCommandName = "PartyCommands_BlackSpace";
        break;
    }

    if (world == 3 || world == 4) {
      data.battleCommandSize = 2;
      data.stressBarCenterIndex = true;
    }

    data.stressBarDisplay = ![2, 5, 6].contains(world);

    if (world == 5) {
      data.doEscapeBlockEffect = true;
    }
    // Final Battle Hardcode (base game)
    if ($gameVariables.value(1220) >= 5 && $gameTroop._troopId == 891) {
      data.partyCommandName = "PartyCommands_FinalBattle";
      data.partyCommandSize = 1;
    }
    return data;
  }

  static maxItemRows() {
    return 4;
  }

  static extraItemHeight() {
    return Math.max(StahlUIHelper.maxItemRows() - 2, 0) * 25;
  }
}

//=============================================================================
// * CHANGE WORLD CONDITION TO USE SAME FUNCTION
//=============================================================================
Scene_Battle.prototype.createStressBar = function () {
  let commandDisplayData = StahlUIHelper.getCommandDisplayData();
  // Create Stress Bar
  this._stressBar = new Sprite_StressBar();
  this._stressBar.x = 140;
  this._stressBar.y = Graphics.height - 56;
  this._stressBar.visible =
    commandDisplayData.stressBarDisplay && StahlUIHelper.showStressBar(); // Made into own function
  this._stressBar.offsetY = 0;
  // The max Y, meaning lowest point (pos Y is down); This may change when hiding it.
  this._stressBar.maxY = Graphics.height - 56;
  this.addChildAt(this._stressBar, 2);
};

Stahl.MoreSkillDisplay.Scene_Battle_updateWindowPositions =
  Scene_Battle.prototype.updateWindowPositions;
Scene_Battle.prototype.updateWindowPositions = function () {
  Stahl.MoreSkillDisplay.Scene_Battle_updateWindowPositions.call(this);
  if (this._stressBar) {
    // Pick the one thats higher up (lower y)
    this._stressBar.y = this.getStressBarY() + this._stressBar.offsetY;
  }
};

Scene_Battle.prototype.getStressBarY = function () {
  return Math.min(
    this._stressBar.maxY,
    this._itemWindow.y - 85,
    this._skillWindow.y - 85,
    this._actorCommandWindow.y - 56,
    this._partyCommandWindow.y - 56
  );
}

Sprite_StressBar.prototype.refreshEKGBitmap = function (index = this._ekgRow) {
  let commandDisplayData = StahlUIHelper.getCommandDisplayData();
  // Get Bitmap
  var bitmap = ImageManager.loadSystem(commandDisplayData.ekgName);
  // Clear & Transfer Bitmap
  this._ekgLineBitmap.clear();
  this._ekgLineBitmap.blt(bitmap, 0, index * 28, bitmap.width, 28, 0, 0);
  // If Pending EKG Row is valid
  if (this._pendingEKGRow >= 0) {
    this._ekgLineNewBitmap.clear();
    this._ekgLineNewBitmap.blt(
      bitmap,
      0,
      this._pendingEKGRow * 28,
      bitmap.width,
      28,
      0,
      0
    );
  }
};

Sprite_StressBar.prototype.updateBackgroundImage = function () {
  let commandDisplayData = StahlUIHelper.getCommandDisplayData();
  // Get Background Name
  let backgroundName = "StressBar_DreamWorld";
  // Set Index to 0
  let index = 0;
  // Set Default Rows
  let rows = 5;
  // Get Stress
  let stress = $gameParty.stressEnergyCount;

  if (
    $gameParty.actorIsAffectedByState(1, 20) ||
    $gameParty.actorIsAffectedByState(8, 20)
  ) {
    stress = 10;
  }

  if (commandDisplayData.stressBarCenterIndex) {
    index = Math.min(Math.max(Math.floor(stress / 2), 0), 4);
  }

  // Get Bitmap
  let bitmap = ImageManager.loadSystem(backgroundName);
  // Get Height
  let height = bitmap.height / rows;
  // Set Background Bitmap
  this._background.bitmap = bitmap;
  // Set Background Frame
  bitmap.addLoadListener(() =>
    this._background.setFrame(0, index * height, bitmap.width, height)
  );
};

Window_ActorCommand.prototype.makeCommandList = function () {
  // Run Original Function
  _TDS_.OmoriBattleSystem.Window_ActorCommand_makeCommandList.call(this);
  // If world index is 3
  let commandDisplayData = StahlUIHelper.getCommandDisplayData();
  // Remove all commands past the second one
  this._list.splice(commandDisplayData.battleCommandSize, 99);
};

Window_ActorCommand.prototype.createCommandSprites = function () {
  let commandDisplayData = StahlUIHelper.getCommandDisplayData();
  // Set Command Name
  let commandName = commandDisplayData.battleCommandName;
  // Set Default Custom cursor X Offset
  this._customCursorXOffset =
    commandDisplayData.battleCommandCustomCursorXOffset;
  // Set Default Max Columns
  this._commandMaxCols = commandDisplayData.battleCommandCommandMaxCols;
  // Initialize Command Sprites Array
  this._commandSprites = [];
  // Get Bitmap
  var bitmap = ImageManager.loadSystem(commandName);
  var sw = bitmap.width / this._commandMaxCols;
  var sh = bitmap.height / 2;

  for (var i = 0; i < 4; i++) {
    // Create Command Sprite
    let sprite = new Sprite(bitmap);
    // Get Item Rectangle
    let rect = this.itemRect(i);

    let sx = (i % this._commandMaxCols) * sw;
    let sy = Math.floor(i / this._commandMaxCols) * sh;
    sprite.setFrame(sx, sy, sw, sh, 0, 0);
    //  sprite.x = rect.x - ((i % 2) * 2);
    sprite.x = rect.x;
    sprite.y = rect.y;
    this._commandSprites[i] = sprite;
    this.addChildToBack(sprite);
  }
};

Window_PartyCommand.prototype.createCommandSprites = function () {
  let commandDisplayData = StahlUIHelper.getCommandDisplayData();
  // Set Command Name
  let commandName = commandDisplayData.partyCommandName;
  let commandsSize = commandDisplayData.partyCommandSize;

  // Initialize Command Sprites Array
  this._commandSprites = [];
  // Get Bitmap
  let bitmap = ImageManager.loadSystem(commandName);
  bitmap.addLoadListener(() => {
    if (commandsSize > 1) {
      let height = bitmap.height / commandsSize;
      for (var i = 0; i < commandsSize; i++) {
        var sprite = new Sprite(bitmap);
        sprite.setFrame(0, i * height, 360, height);
        sprite.y = i * (height + 3);

        this._commandSprites[i] = sprite;
        this.addChildToBack(sprite);
      }
    } else {
      let sprite = new Sprite(bitmap);
      sprite.setFrame(0, 0, 360, bitmap.height);
      sprite.y = 0;
      this._commandSprites[i] = sprite;
      this.addChildToBack(sprite);
    }
  });
};

Window_PartyCommand.prototype.processOk = function () {
  let commandDisplayData = StahlUIHelper.getCommandDisplayData();
  // Get Current Command symbol
  let symbol = this.currentSymbol();
  // If escape command and world is 4 or 5
  if (symbol === "escape" && commandDisplayData.doEscapeBlockEffect) {
    // If Escape Block Container has no children
    if (this._escapeBlockContainer.children.length === 0) {
      // Start Escape Block Effect
      this.startEscapeBlockEffect();
    }
    return;
  }
  // Remove Children
  this._escapeBlockContainer.removeChildren();
  // Run Original Function
  Window_Command.prototype.processOk.call(this);
};

//=============================================================================
// * BATTLE SKILL / ITEM PAGE ITEM COUNT
//=============================================================================
Window_BattleSkill.prototype.maxPageRows = function () {
  return StahlUIHelper.maxItemRows();
};
Window_BattleItem.prototype.maxPageRows = function () {
  return StahlUIHelper.maxItemRows();
};

Window_BattleItem.prototype.initialize = function (x, y, width, height) {
  this._arrowBitmap = new Bitmap(50, 50);
  this._arrowBitmap.fillAll("rgba(255, 0, 0, 1)");
  // Super Call
  Window_ItemList.prototype.initialize.call(
    this,
    x,
    y + 30,
    width,
    height - 10 // Now uses height, was 90
  );
  // Create Back Window
  this._backWindow = new Window_ItemListBack(width, height);
  this.addChildToBack(this._backWindow);
  this.opacity = 0;
  this.hide();
};

Window_BattleSkill.prototype.initialize = function (x, y, width, height) {
  // Super Call
  Window_SkillList.prototype.initialize.call(
    this,
    x,
    y + 30,
    width,
    height - 10 // Now uses height, was 90
  );
  // Create Back Window
  this._backWindow = new Window_ItemListBack(width, height);
  this.addChildToBack(this._backWindow);
  this.opacity = 0;
  this.hide();
};

Scene_Battle.prototype.createSkillWindow = function () {
  var wy = this._helpWindow.y + this._helpWindow.height;
  var wh = this._statusWindow.y - wy;
  this._skillWindow = new Window_BattleSkill(
    140,
    Graphics.height + 30,
    360,
    100 + StahlUIHelper.extraItemHeight() // taller, was 100
  );
  this._skillWindow.setHelpWindow(this._helpWindow);
  this._skillWindow.setHandler("ok", this.onSkillOk.bind(this));
  this._skillWindow.setHandler("cancel", this.onSkillCancel.bind(this));
  this.addWindow(this._skillWindow);
};

Scene_Battle.prototype.showSkillWindow = function () {
  var duration = 15;
  var obj = this._skillWindow;
  var data = {
    obj: obj,
    properties: ["y"],
    from: { y: obj.y },
    to: { y: Graphics.height - 65 - StahlUIHelper.extraItemHeight() }, // was -65
    durations: { y: duration },
    easing: Object_Movement.easeOutCirc,
  };
  this.move.startMove(data);
};

Scene_Battle.prototype.createItemWindow = function () {
  this._itemWindow = new Window_BattleItem(
    140,
    Graphics.height + 30,
    360,
    100 + StahlUIHelper.extraItemHeight() // was 100 height
  );
  this._itemWindow.setHelpWindow(this._helpWindow);
  this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
  this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
  this.addWindow(this._itemWindow);
};

Scene_Battle.prototype.showItemWindow = function () {
  var duration = 15;
  var obj = this._itemWindow;
  var data = {
    obj: obj,
    properties: ["y"],
    from: { y: obj.y },
    to: { y: Graphics.height - 65 - StahlUIHelper.extraItemHeight() }, // was -65
    durations: { y: duration },
    easing: Object_Movement.easeOutCirc,
  };
  this.move.startMove(data);
};

Scene_Battle.prototype.showPartyCommand = function () {
  // REMOVED ENERGY
  var duration = 15;
  var obj = this._partyCommandWindow;
  var data = {
    obj: obj,
    properties: ["y"],
    from: { y: obj.y },
    to: { y: Graphics.height - 92 },
    durations: { y: duration },
    easing: Object_Movement.easeOutCirc,
  };
  this.move.startMove(data);

  obj = this._actorCommandWindow;
  data = {
    obj: obj,
    properties: ["y"],
    from: { y: obj.y },
    to: { y: Graphics.height - 92 },
    durations: { y: duration },
    easing: Object_Movement.easeOutCirc,
  };
  this.move.startMove(data);
};

Scene_Battle.prototype.hidePartyCommand = function () {
  // REMOVED ENERGY
  var duration = 15;
  var obj = this._partyCommandWindow;
  var data = {
    obj: obj,
    properties: ["y"],
    from: { y: obj.y },
    to: { y: Graphics.height },
    durations: { y: duration },
    easing: Object_Movement.easeInCirc,
  };
  this.move.startMove(data);

  obj = this._actorCommandWindow;
  data = {
    obj: obj,
    properties: ["y"],
    from: { y: obj.y },
    to: { y: Graphics.height },
    durations: { y: duration },
    easing: Object_Movement.easeInCirc,
  };
  this.move.startMove(data);
};
