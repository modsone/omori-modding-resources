// Track item usage for each actor
let actorItemUsage = {};
const MAX_ITEM_USES = 12;
// If you want to increase maximum mid-game, do flat number + $gameVariables[id] and increase the variable in the game

// Reset item usage at the start of each battle
const _BattleManager_startBattle = BattleManager.startBattle;
BattleManager.startBattle = function() {
    _BattleManager_startBattle.call(this);
    actorItemUsage = {}; // Reset usage counts

    // Determine initial offset based on party size
    const partySize = $gameParty.members().length;
    let initialOffset = 0;

    switch (partySize) {
        case 4: initialOffset = 4; break;
        case 3: initialOffset = 0; break;
        case 2: initialOffset = -6; break;
        case 1: initialOffset = -13; break;
        default: initialOffset = 0; // Default case for unexpected sizes
    }

    // Apply the initial offset to each actor
    $gameParty.members().forEach(actor => {
        actorItemUsage[actor.actorId()] = initialOffset;
    });
};

// Override commandItem function to implement item usage limit
Scene_Battle.prototype.commandItem = function(category = 'consumables') {
  const activeActor = BattleManager.actor();
  
  // Ensure actor is valid and has not exceeded the usage limit
  if (!(activeActor.isStateAffected(19) || activeActor.isStateAffected(20)) && activeActor && actorItemUsage[activeActor.actorId()] < MAX_ITEM_USES) {
    // Set Item Window Category
    this._itemWindow.setCategory(category);
    // Show Item Window
    this.showItemWindow();
	this.StressBarUp();
    // Run Original Function
    _TDS_.OmoriBattleSystem.Scene_Battle_commandItem.call(this);
  } else {
    SoundManager.playBuzzer();
    this._itemWindow.deactivate(); // Disable item window for the actor
  }
};

// Track item usage on item apply
const _Game_Action_apply = Game_Action.prototype.apply;
Game_Action.prototype.apply = function(target) {
  _Game_Action_apply.call(this, target);

  // Check if the action is an item use
  if (this.isItem() && this.subject().isActor()) {
    const actorId = this.subject().actorId();

    // Increment usage count for the actor
    if (actorItemUsage[actorId] !== undefined) {
      actorItemUsage[actorId]++;
    }

    // Debugging: Log current usage count
    console.log(`Actor ${actorId} used items: ${actorItemUsage[actorId]}`);
  }
};

Window_ItemListBack.prototype.setItem = function(item) {
  // Clear Rect
  this.contents.clearRect(0, 0, this.contents.width, 28);

  // Get the active actor
  const activeActor = BattleManager.actor();

  // Check if Item is valid and an actor is active
  if (DataManager.isItem(item) && activeActor) {
    // Calculate remaining item uses for the active actor
    const actorId = activeActor.actorId();
    const remainingUses = MAX_ITEM_USES - (actorItemUsage[actorId] || 0);

    // Set Bitmap Font color to null
    this.contents.bitmapFontColor = null;

    // Draw Remaining Item Usage
    const usageText = `USES LEFT: ${remainingUses}`;
    this.contents.drawText(usageText, 6, 2, 150, 20); // Adjust width as needed

    // Draw Item Count
    const itemCountText = LanguageManager.getMessageData("XX_BLUE.Omori_Battle_System").hold.format($gameParty.battleNumItems(item));
    this.contents.drawText(itemCountText, 160, 2, 100, 20); // Adjust Y-position for spacing
  };
  if (DataManager.isSkill(item)) {
    // Set Bitmap Font color to null
    this.contents.bitmapFontColor = null;
    this.contents.drawText(LanguageManager.getMessageData("XX_BLUE.Omori_Battle_System").cost, 6, 2, 100, 20);
    this.contents.drawText(this._actor.skillMpCost(item), 0, 2, 95, 20, 'right');
    this.drawMPIcon(100, 6);
  };
};
