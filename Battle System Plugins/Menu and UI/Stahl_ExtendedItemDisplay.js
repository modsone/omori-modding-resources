var Imported = Imported || {};
Imported.Stahl_ExtendedItemDisplay = true;

var Stahl = Stahl || {};
Stahl.ExtendedItemDisplay = Stahl.ExtendedItemDisplay || {};

/*:
 * @plugindesc [v1.2.3] Adds Color, Count, Max quantities to Items and extends shops.
 * 
 * @author ReynStahl
 *
 * @help
 * Features:
 * - Armors and Charms Color change in shop.
 * - Special / passive skills gets color.
 * - Displays quantity for duplicate armors and weapons.
 * - Fixes shop not obeying item YEP item limit. This is from YEP Core Engine with tag <Max Item: x>
 * - Shop reduces opacity when full capacity.
 * - Shop can "loop" buy amount when at limit. (Ex: Press left at 1 loops back to max item)
 * 1.1.0
 * - Overridable ItemDisplayManager functions as helper static class.
 * - Set custom shop width. Using ItemDisplayManager.setShopWidth(num) before calling shop. Null defaults to 250.
 * 1.1.1
 * - Displays Type of Item for Armor and Weapons in shop.
 * 1.1.2
 * - More type of Item display + Show max limit
 * - Updates if item is enabled on purchase. Also doesn't limit selling.
 * 1.2.0
 * - ItemDisplayManager.setShopkeeperSpriteSimple(filename, x, y) to set shopkeeper image. Enter null to default mailbox.
 *   This will also automatically add image to reserve.
 * - Shop sprite can also be set directly if more options are needed. Using mailbox as example:
 * 
 * ItemDisplayManager._reserveShopImages = ['mailbox'];
 * ItemDisplayManager._shopkeeperSprite = {
 *   filename: 'mailbox',
 *   position: {x: -50, y: 30},
 *   frame: {x: 0, y: 0, width: 251, height: 344},
 *   hasFace: true,
 *   facePosition: {x: 50, y: 65},
 *   faceFrame: {x: 251, y: 28, width: 79, height: 28},
 * };
 * 
 * - Face frames will automatically go down by using it's height, stacking frames vertically
 * 1.2.1
 * - <ListIndex:x> note tag works on equipments now. Sets the intended item index to x. Lower number means higher up.
 * 1.2.2
 * - Changed getting Item, Weapon, Armor type name into a function. Allows to override easier (like getting YAML).
 * 1.2.3
 * - Changed getting Skill for skill equip list into function "getItemFromIndex". Allows for override (like skill replacement).
 * 
 * Dependencies:
 * - Put BELOW Omori Shops, Menus, and Windows related plugins
 */

/**
 * Helper class for Item Display.
 * Its functions can be overrided with other plugin placed below.
 */
function ItemDisplayManager() {
  throw new Error('This is a static class');
}


ItemDisplayManager.COLORID = {
  "NORMAL": 0,
  "IMPORTANT": 4,
  "CHARM": 13
}

ItemDisplayManager.COLORLIST = {
  "NORMAL": 'rgba(255, 255, 255, 1)',
  "NORMAL_DISABLED": 'rgba(140, 140, 140, 1)',
  "PASSIVE": 'rgba(140, 255, 140, 1)',
  "PASSIVE_DISABLED": 'rgba(50, 140, 50, 1)',
  "SPECIAL": 'rgb(255, 200, 0)',
  "SPECIAL_DISABLED": 'rgb(106, 58, 0)',
  "ENERGY": 'rgba(0, 247, 255, 1)',
  "ENERGY_DISABLED": 'rgba(0, 106, 101, 1)'
}

/**
 * Whether item is considered passive.
 * By default checks if Occasion is NEVER and is a skill.
 * @param {*} item UsableItem
 * @returns boolean
 */
ItemDisplayManager.isPassive = function(item) {
  return item && item.occasion == 3 && DataManager.isSkill(item);
}

/**
 * Whether item is considered special.
 * By default check fo <SpecialColor> meta tag.
 * @param {*} item UsableItem
 * @returns boolean
 */
ItemDisplayManager.isSpecial = function(item) {
  return item && item.meta.SpecialColor;
}

/**
 * Whether item is considered special.
 * By default check fo <SpecialColor> meta tag.
 * @param {*} item UsableItem
 * @returns boolean
 */
ItemDisplayManager.isEnergy = function(item) {
  return item && item.meta.EnergyCost;
}

/**
 * Gets the color String based off item.
 * @param {*} item UsableItem
 * @param {*} disabled boolean, when true gives disabled variant (Default: faded out color)
 * @returns String Color, like 'rgba(255, 255, 255, 1)'
 */
ItemDisplayManager.getColor = function(item, disabled = false) {
  if (this.isSpecial(item)) {
    return disabled ? this.COLORLIST["SPECIAL_DISABLED"] : this.COLORLIST["SPECIAL"]
  } else if (this.isPassive(item)) {
    return disabled ? this.COLORLIST["PASSIVE_DISABLED"] : this.COLORLIST["PASSIVE"]
  } else if (this.isEnergy(item)) {
    return disabled ? this.COLORLIST["ENERGY_DISABLED"] : this.COLORLIST["ENERGY"]
  }
  return disabled ? this.COLORLIST["NORMAL_DISABLED"] : this.COLORLIST["NORMAL"]
}

/**
 * Gets the color ID based off item.
 * @param {*} item UsableItem
 * @returns int, Color ID from Windows Skin
 */
ItemDisplayManager.getColorId = function(item) {
  if (!item) {
    return this.COLORID["NORMAL"];
  } if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
    return this.COLORID["CHARM"];
  } else if (DataManager.isItem(item) && item.itypeId === 2) {
    return this.COLORID["IMPORTANT"];
  }
  return this.COLORID["NORMAL"];
}

/**
 * Gets weapon type display name from type.
 * Can be WEAPON, CHARM, TOY, SNACKS, IMPORTANT.
 * Ideally, this can be replaced to hook to a YAML file.
 * @param {*} type 
 * @returns 
 */
ItemDisplayManager.getItemTypeName = function(type) {
  const data = {
    "weapon": "WEAPON",
    "armor": "CHARM",
    "toy": "TOY",
    "consumable": "SNACK",
    "key": "IMPORTANT"
  }
  return data[type] || "";
}

/**
 * Gets weapon type display name from id.
 * Ideally, this can be replaced to hook to a YAML file.
 * @param {*} id 
 * @returns 
 */
ItemDisplayManager.getWeaponTypeName = function(id) {
  const data = {
    1: "OMORI",
    2: "AUBREY",
    3: "KEL",
    4: "HERO"
  }
  return data[id] || "";
}

/**
 * Gets armor type display name from id.
 * Ideally, this can be replaced to hook to a YAML file.
 * @param {*} id 
 * @returns 
 */
ItemDisplayManager.getArmorTypeName = function(id) {
  const data = {
    1: "ANY",
    2: "KEL"
  }
  return data[id] || "";
}

/**
 * Gets item type text shown in shop.
 * Override this for own display sytem (Or just return empty string to disable).
 * @param {*} item BaseItem
 * @returns String
 */
ItemDisplayManager.getShopItemTypeText = function(item) {
  let ownCount = $gameParty.numItems(item);
  let maxCount = item.maxItem || 99;
  let extraInfo = "";

  if (DataManager.isWeapon(item)) {
    extraInfo = this.getItemTypeName("weapon") + ": " + this.getWeaponTypeName(item.wtypeId);
  } else if (DataManager.isArmor(item)) {
    extraInfo = this.getItemTypeName("armor") + ": " + this.getArmorTypeName(item.atypeId);
  } else if (DataManager.isToyItem(item)) {
    extraInfo = this.getItemTypeName("toy");
  } else if (DataManager.isConsumableItem(item)) {
    extraInfo = this.getItemTypeName("consumable");
  } else if (DataManager.isItem(item) && item.itypeId === 2) {
    extraInfo = this.getItemTypeName("key");
  }

  if (extraInfo != "") {
    return `(${extraInfo}) (${ownCount}/${maxCount})`;
  }
  return `(${ownCount}/${maxCount})`;
}

ItemDisplayManager.getShopItemTypeTextFontSize = function() {
  return 20;
}

/**
 * Gets the shop width. Default grabs from ItemDisplayManager._customShopWidth or 250.
 * @returns 
 */
ItemDisplayManager.getShopWidth = function() {
  return this._customShopWidth || 250;
}

/**
 * Sets the shop width that will override. Uses _customShopWidth variables by default.
 * @returns 
 */
ItemDisplayManager.setShopWidth = function(num) {
  this._customShopWidth = num;
}

/**
 * Shop width that will be used to override.
 */
ItemDisplayManager._customShopWidth = null;

/**
 * Sets up a simple shopkeeper sprite without face or subframes.
 * null filename will set to default mailbox.
 * 
 * The images still needed to be reserved in Scene_OmoriItemShop.prototype.initAtlastLists
 * by calling ImageManager.reserveSystem() at some point
 * @param {*} _filename Filename of image in system
 * @param {*} _x Position x
 * @param {*} _y Position y
 * @returns 
 */
ItemDisplayManager.setShopkeeperSpriteSimple = function(_filename, _x, _y) {
  if (!_filename) {
    this._shopkeeperSprite = null;
    return;
  }
  this._reserveShopImages = [_filename]; // Set file for reserve automatically.
  this._shopkeeperSprite = {
    filename: _filename,
    position: {x: _x, y: _y},
    frame: null,
    hasFace: false,
    facePosition: null,
    faceFrame: null,
  };
}

/**
 * Gets shopkeeper sprite data. Defaults to mailbox.
 * @returns 
 */
ItemDisplayManager.getShopkeeperSprite = function() {
  return ItemDisplayManager._shopkeeperSprite || ItemDisplayManager._defaultShopkeeperSprite;
}

ItemDisplayManager._shopkeeperSprite = null;

ItemDisplayManager._defaultShopkeeperSprite = {
  filename: 'mailbox',
  position: {x: -50, y: 30},
  frame: {x: 0, y: 0, width: 251, height: 344},
  hasFace: true,
  facePosition: {x: 50, y: 65},
  faceFrame: {x: 251, y: 28, width: 79, height: 28},
};

/**
 * List of filename to reserve shopkeeper images.
 * This variable can be overridden at start, if preferred to do it with plugin.
 */
ItemDisplayManager._reserveShopImages = [];

//=============================================================================
// * Shop List Color
//=============================================================================

// Check whether item has space. Enabled here just means to do full opacity
Window_OmoriShopItemList.prototype.isEnabled = function(item) {
  // If Buying, disable when full
  if ($gameTemp._shopData.shopType === 0) {
    return item && ($gameParty.numItems(item) < (item.maxItem || 99));
  }
  return item;
};

Stahl.ExtendedItemDisplay.OmoriShopItemList_drawItem = Window_OmoriShopItemList.prototype.drawItem;
Window_OmoriShopItemList.prototype.drawItem = function(index) {
  //get data
  var data = this._data[index];
  var item = data.item;

  //set text color
  this.changeTextColor(this.textColor(ItemDisplayManager.getColorId(item)));
  Stahl.ExtendedItemDisplay.OmoriShopItemList_drawItem.call(this, index)
  this.changeTextColor(this.textColor(ItemDisplayManager.getColorId(null))); //Turn back to default
};

// Also fixes shop not obeying item YEP item limit
Scene_OmoriItemShop.prototype.onItemListOk = function() {
  // Get Item
  var item = this._itemListWindow.item();
  var price = this._itemListWindow.price();
  // Get Buying/Selling State
  var buying = $gameTemp._shopData.shopType === 0;
  var maxItems = buying ? (item.maxItem || 99) - $gameParty.numItems(item) : $gameParty.numItems(item); // CHANGED TO CONSIDER MAX ITEM
  var canBuy = maxItems > 0
  var hasGold = price <= $gameParty.gold();
  // If can't buy or don't have gold
  if (buying && (!canBuy || !hasGold)) {
    // Show Max Item Message
    this.queue(function() {
      var message = '';
      // Add Messages
      if (!canBuy) { message = $gameTemp._shopData.texts.maxItemMessage}
      if (!hasGold) { message = $gameTemp._shopData.texts.notEnoughMoneyMessage};
      // Add Text
      $gameMessage.showLanguageMessage(message);
    }.bind(this))
    // Wait for Message
    this.queue('startFunctionWait', this.waitForMessage.bind(this))
    // Reactivate Item List Window
    this.queue(function() {
      this._itemListWindow.activate();
    }.bind(this))
    return;
  };

  // Activate Total Window
  this._totalWindow.open();
  this._totalWindow.setPrice(price, maxItems);
  this._totalWindow.activate();
  // If Buying
  if (buying) {
    // Add Text
    $gameMessage.showLanguageMessage($gameTemp._shopData.texts.onItemListBuyOkMessage);
  } else {
    // Add Text
    $gameMessage.showLanguageMessage($gameTemp._shopData.texts.onItemListSellOkMessage);
  };
};

//=============================================================================
// * Force reload list on purchase as well, to update enabled items
//=============================================================================
Stahl.ExtendedItemDisplay.Scene_OmoriItemShop_onPurchaseChoice = Scene_OmoriItemShop.prototype.onPurchaseChoice;
Scene_OmoriItemShop.prototype.onPurchaseChoice = function(n) {
  Stahl.ExtendedItemDisplay.Scene_OmoriItemShop_onPurchaseChoice.call(this, n);
  this._itemListWindow.contents.clear();
  this._itemListWindow.refresh();
}

//=============================================================================
// * Update Amount Input, Changed to allow looping
//=============================================================================
Stahl.ExtendedItemDisplay.Window_OmoriShopTotal_updateAmountInput = Window_OmoriShopTotal.prototype.updateAmountInput;
Window_OmoriShopTotal.prototype.updateAmountInput = function() {
  if (this.active && !$gameMessage.hasText()) {
    var gold = $gameParty.gold();
    var maxPrice = $gameTemp._shopData.shopType === 0 ? Math.min(Math.floor(gold / this._price), this._maxAmount) : this._maxAmount;

    if (this._amount <= 1 && (Input.isRepeated('left') || Input.isRepeated('down'))) {
      AudioManager.playSe({name: "sys_cursor1", pan: 0, pitch: 100, volume: 90});
      this._amount = maxPrice; // Loop back to max
      this.drawShoppingValues();
      this.updateArrowVisibility();
      return;
    };

    if (this._amount >= maxPrice && (Input.isRepeated('right') || Input.isRepeated('up'))) {
      AudioManager.playSe({name: "sys_cursor1", pan: 0, pitch: 100, volume: 90});
      this._amount = 1; // Loop back to min
      this.drawShoppingValues();
      this.updateArrowVisibility();
      return;
    };
  };

  Stahl.ExtendedItemDisplay.Window_OmoriShopTotal_updateAmountInput.call(this);
};

//=============================================================================
// * Object Initialization, added variable width
//=============================================================================
Window_OmoriShopItemList.prototype.initialize = function(x, y, width, height) {
  Window_ItemList.prototype.initialize.call(this, 0, 0, ItemDisplayManager.getShopWidth(), 290 - 37);

  this.refresh()
  this.openness = 0;
  this.select(0);
  this.activate();
};

Window_OmoriShopHeader.prototype.initialize = function() {
  Window_Base.prototype.initialize.call(this, 0, 0, ItemDisplayManager.getShopWidth(), 45);
  this.openness = 0;
  this.refresh();
};

//=============================================================================
// * Display Item Type / Equip
//=============================================================================
WindowItemShopMessage.prototype.drawItem = function(item) {
  // If Item exists
  if (item) {
    // Get Item Text
    var itemText = item.description;
    // Set Item Draw Flag to true
    this._drawingItemText = true;
    // Initialize Text State
    this._textState = {};
    this._textState.index = 0;
    this._textState.text = this.convertEscapeCharacters(itemText);
    this.newPage(this._textState);
    this._textState.x = 110;
    this._textState.y = 24;
    // Set Flags
    this._showFast = true;
    this._pauseSkip = true;
    this._wordWrap = true;
    // Unpause
    this.pause = false;
    // Set Sound count to max (Prevents sound from playing)
    this._soundCount = 99;
    // Update Message
    this.updateMessage();
    // Draw Item Icon
    this.drawItemIcon(item, 0, -5, 1)
    // Draw Item Name
    this.contents.drawText(item.name, 108, 0, this.contents.width - 108, 24) // Bump up slightly right to align
    // Draw Owned amount
    let oldFontSize = this.contents.fontSize;
    this.contents.fontSize = ItemDisplayManager.getShopItemTypeTextFontSize();
    this.contents.drawText(ItemDisplayManager.getShopItemTypeText(item), 0, 0, this.contents.width-10, 24, 'right')
    this.contents.fontSize = oldFontSize;
    // Set Item Draw Flag to false
    this._drawingItemText = false;
  };
};

//=============================================================================
// * Shop Sprites
//=============================================================================

Stahl.ExtendedItemDisplay.Scene_OmoriItemShop_initAtlastLists = Scene_OmoriItemShop.prototype.initAtlastLists;
Scene_OmoriItemShop.prototype.initAtlastLists = function() {
  Stahl.ExtendedItemDisplay.Scene_OmoriItemShop_initAtlastLists.call(this);
  for (const filename of ItemDisplayManager._reserveShopImages) {
    ImageManager.reserveSystem(filename, 0, this._imageReservationId);
  }
};

Scene_OmoriItemShop.prototype.createShopKeeperSprite = function() {
  const spriteData = ItemDisplayManager.getShopkeeperSprite();
  const filename = spriteData.filename;
  const frame = spriteData.frame;
  const facePosition = spriteData.facePosition;

  this._shopKeeperSprite = new Sprite(ImageManager.loadSystem(filename));
  if (frame) {
    this._shopKeeperSprite.setFrame(frame.x, frame.y, frame.width, frame.height);
  }

  this._shopKeeperSprite.visible = $gameTemp._shopData.showMailboxShopkeeper;
  this._shopKeeperSprite.opacity = 0;
  this.addChild(this._shopKeeperSprite);

  // Create shop Keepers Face Sprite
  if (spriteData.hasFace) {
    this._shopKeepersFaceSprite = new Sprite(ImageManager.loadSystem('mailbox'))
    this._shopKeepersFaceSprite.x = facePosition ? facePosition.x : 50;
    this._shopKeepersFaceSprite.y = facePosition ? facePosition.y : 65;
    this._shopKeeperSprite.addChild(this._shopKeepersFaceSprite);

    // Set Default shop keeper face
    this.setShopKeeperFace(0)
  }
};

Stahl.ExtendedItemDisplay.Scene_OmoriItemShop_create = Scene_OmoriItemShop.prototype.create;
Scene_OmoriItemShop.prototype.create = function() {
  Stahl.ExtendedItemDisplay.Scene_OmoriItemShop_create.call(this);

  const spriteData = ItemDisplayManager.getShopkeeperSprite();
  if (spriteData && spriteData.position) {
    this._shopKeeperSprite.x = (this._messageWindow.x + this._messageWindow.width) - this._shopKeeperSprite.width;
    this._shopKeeperSprite.y = this._messageWindow.y - this._shopKeeperSprite.height;

    this._shopKeeperSprite.x += spriteData.position.x;
    this._shopKeeperSprite.y += spriteData.position.y;
  }
};

Scene_OmoriItemShop.prototype.setShopKeeperFace = function(index = 0) {
  const spriteData = ItemDisplayManager.getShopkeeperSprite();
  const frame = spriteData.faceFrame;
  if (this._shopKeepersFaceSprite && frame) {
    this._shopKeepersFaceSprite.setFrame(frame.x, index * frame.y, frame.width, frame.height);
  }
};

//=============================================================================
// * Item Colors
//=============================================================================

//=============================================================================
// * Skill List Battle Color
//=============================================================================

Stahl.ExtendedItemDisplay.Window_BattleSkill_drawItem = Window_BattleSkill.prototype.drawItem;
Window_BattleSkill.prototype.drawItem = function(index) {
  var item = this._data[index];
  this.contents.fontSize = 24;
  if (item) {
    this.contents.textColor = ItemDisplayManager.getColor(item, false)
  };
  Stahl.ExtendedItemDisplay.Window_BattleSkill_drawItem.call(this, index)
  this.contents.textColor = ItemDisplayManager.getColor(null, false); // RESET COLOR
};

//=============================================================================
// * Skill List Color
//=============================================================================
Window_OmoMenuActorSkillEquip.prototype.drawItem = function(index) {
  // Get Rect
  var rect = this.itemRect(index);
  // Get Skill at index
  var skill = this.skillAtIndex(index);
  // Determine if enabled
  var enabled = this.isCurrentItemEnabled(index);

  // If Enabled
  if (enabled) {
    this.changePaintOpacity(true);
    this.contents.textColor = ItemDisplayManager.getColor(skill, false) 
  } else {
    this.changePaintOpacity(false);   
    this.contents.textColor = ItemDisplayManager.getColor(skill, true) 
  };

  // Get Text
  var text = skill ? skill.name : '------------'
  this.contents.fontSize = 24;  
  // Draw Text
  this.contents.drawText(text, rect.x, rect.y + 5, rect.width, rect.height);
  this.changePaintOpacity(true);    

  this.contents.textColor = ItemDisplayManager.getColor(null, false); // RESET COLOR
};

//=============================================================================
// * Skill Equipped List Color
//=============================================================================
Window_OmoMenuActorSkillList.prototype.drawItem = function(index) {
  // Get Rect
  var rect = this.itemRectForText(index);
  // Get Item
  var item = this.getItemFromIndex(index);
  // Determine if enabled
  var enabled = this.isCurrentItemEnabled(index);
  // Set Item Text
  var text = item ? item.name : '------------'
  // Set Font Size
  this.contents.fontSize = 24;  
  // Draw Text
  this.contents.textColor = ItemDisplayManager.getColor(item, false) // SET COLOR
  this.contents.drawText(text, rect.x, rect.y, rect.width, rect.height);
  this.contents.textColor = ItemDisplayManager.getColor(null, false); // RESET COLOR
};

// New function for getting item from index.
// Allows other function to override like skill replacements.
Window_OmoMenuActorSkillList.prototype.getItemFromIndex = function(index) {
  return this._data[index];
};

//=============================================================================
// * Equipment List Color
//=============================================================================
Window_OmoMenuActorEquip.prototype.drawItem = function(index) {
  // Get Rect
  var rect = this.itemRect(index);
  // Get Equipment at index
  var equip = this.equipmentAtIndex(index);
  // Get Text
  var text = equip ? equip.name : '------------'
  // Determine if enabled
  var enabled = this.isCurrentItemEnabled(index);
  if (enabled) {
    this.changePaintOpacity(true);
    this.contents.textColor = ItemDisplayManager.getColor(equip, false);
  } else {
    this.changePaintOpacity(false);    
    this.contents.textColor = ItemDisplayManager.getColor(equip, true);
  };
  // Set Font Size
  this.contents.fontSize = 24;    
  // Draw Text
  this.contents.drawText(text, rect.x, rect.y + 5, rect.width, rect.height);
  this.changePaintOpacity(true) 
  this.contents.textColor = ItemDisplayManager.getColor(null, false); // RESET COLOR
};

//=============================================================================
// * Equipment Equipped Color
//=============================================================================
Window_OmoMenuActorEquipItem.prototype.drawItem = function(index) {
  // Get Rect
  var rect = this.itemRectForText(index);
  // Get Item
  var item = this._data[index]
  // Set Item Text
  var text = item ? item.name : '------------'
  // Set Font Size
  this.contents.fontSize = 24;  
  // Draw Text
  this.contents.textColor = ItemDisplayManager.getColor(item, false); // SET COLOR
  this.contents.drawText(text, rect.x, rect.y, rect.width, rect.height);
  this.contents.textColor = ItemDisplayManager.getColor(null, false); // RESET COLOR
};

//=============================================================================
// * Item Description
//=============================================================================
Window_OmoMenuHelp.prototype.refresh = function() {
  // Clear Contents
  this.contents.clear();
  // If Item Exists
  if (this._item) {
    this.contents.textColor = ItemDisplayManager.getColor(this._item, false); // SET COLOR
    this.contents.fontSize = LanguageManager.getMessageData("XX_BLUE.Window_OmoMenuHelp").refresh_contents_fontsize;
    this.drawText(this._item.name, 6, -6, 200);
    this.contents.textColor = ItemDisplayManager.getColor(null, false); // RESET COLOR
    this.contents.fontSize = this.standardFontSize();
    let loc_position = LanguageManager.getMessageData("XX_BLUE.Window_OmoMenuHelp").refresh_position;
    // Replace with drawTextEx
    this.drawTextEx(this._item.description, loc_position[0], loc_position[1], 28); // CHANGE: Item descriptions text
    // Get Icon width
    var width = 106 * this._iconRate;
    // Draw Item Icon
    this.drawItemIcon(this._item, this.contents.width - width, 0, this._iconRate);
    // Get Icon Name
    var iconName = this._item.meta.IconName;
    // If Icon Name Exists
    if (iconName) {
      // Get Bitmap
      // var bitmap = ImageManager.loadSystem('/items/' + iconName.trim());
      var bitmap = ImageManager.loadSystem(iconName.trim());
      // Create Icon Bitmap
      bitmap.addLoadListener(() => {
        var icon = new Bitmap(bitmap.width * this._iconRate, bitmap.height * this._iconRate);
        icon.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, icon.width, icon.height);
        var padding = this.standardPadding()
        var x = this.contents.width - icon.width;
        var y = this.contents.height - icon.height;
        this.contents.blt(icon, 0, 0, icon.width, icon.height, x, y)
      })
    }
    // Display Quantity Text
    this.drawQuantity();
  };
};

// Display Quantity Text
Window_OmoMenuHelp.prototype.drawQuantity = function() {
  // If Item Exists
  if (this._item) {
    //initialize stuff
    var quantity = 0;
    var text = '';
    if (DataManager.isWeapon(this._item)) {
      quantity = $gameParty.numItems($dataWeapons[this._item.id]);
    } else if (DataManager.isArmor(this._item)) {
      quantity = $gameParty.numItems($dataArmors[this._item.id]);
    }
    
    // Only show when more than 1 items
    if (quantity > 1) {
      text = 'x' + quantity;
    }
    this.contents.fontSize = 24;
    this.drawText(text, 252, 66, 200, 'right');
  }
}

//=============================================================================
// * Item List Order
//=============================================================================
Window_OmoMenuActorEquipItem.prototype.makeItemList = function() {
  // Run Original Function
  Window_ItemList.prototype.makeItemList.call(this);
  // Sort list
  this._data.sort(function(a, b) {
    if (!a) return 1; // move the "empty" item down last of the list
    if (!b) return -1;
    var indexA = a.meta.ListIndex === undefined ? a.id : Number(a.meta.ListIndex);
    var indexB = b.meta.ListIndex === undefined ? b.id : Number(b.meta.ListIndex);
    return indexA - indexB;
  });
};