//=============================================================================
// Picture Shops - By TomatoRadio
// TR_PictureShops.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_PictureShops = true;

var TR = TR || {};
TR.PS = TR.PS || {};
TR.PS.version = 1.0;

/*: 
 *
 * @plugindesc Allows pictures to be tied to shopkeepers and have frames for each message
 * Version 1.0
 * @author TomatoRadio
 * 
 * @help
 * All shopkeepers should be in img/system and each frame is the screen size. (Normally 640x480)
 * Check the template yaml to see how to set up shop text and pictures.
 * 
 * @param ShopkeepersYaml
 * @desc The yaml that stores all shopkeepers
 * 
 * @param ShopImages
 * @desc An array of every new shop file that should be reserved.
 * @type file[]
 * @dir img/system/
 * 
*/

TR.PS.Param = PluginManager.parameters('TR_PictureShops');

TR.ShopkeepersYaml = TR.PS.Param["ShopkeepersYaml"]

TR.ShopImages = JSON.parse(TR.PS.Param["ShopImages"])

Game_Interpreter.prototype.setupShop = function(name, type = 0) {
  // Clear Shop Data
  $gameTemp.clearShopData();
    // Get Data
  var data = $gameTemp._shopData;
  // Get Yaml
  var yaml = TR.ShopkeepersYaml
  // Get Default Text
  var text = LanguageManager.getMessageData(`${yaml}.itemShopMenu`).defaultText;
  // Get Shop keeper
  var shopKeeper = (LanguageManager.getMessageData(`${yaml}.itemShopMenu`).shopKeepers)[name.toLowerCase()]
  // Shop Type (0: Buy, 1: Sell)
  data.shopType = type;
  // Set Shop Name
  data.name = shopKeeper.shopName ? shopKeeper.shopName : text.shopName;
  // Show Mailbox Shop Keeper Flag
  data.showMailboxShopkeeper = false
  // Set Transaction Header
  data.transactionHeader = data.shopType === 0 ? shopKeeper.buyHeader ? shopKeeper.buyHeader : text.buyHeader : shopKeeper.sellHeader ? shopKeeper.sellHeader : text.sellHeader;
  data.texts = {};
  // // If World Index is 1 (Dream World)
  // if (worldIndex === 1) {
  // Set Texts
  data.texts.maxItemMessage = 'Prologue_WHITESPACE.message_3';
  data.texts.notEnoughMoneyMessage = 'Prologue_WHITESPACE.message_3';
  data.texts.onItemListBuyOkMessage = 'Prologue_WHITESPACE.message_3';
  data.texts.onItemListSellOkMessage = 'Prologue_WHITESPACE.message_3';
  data.texts.itemBuyingPromptMessage = 'Prologue_WHITESPACE.message_3';
  data.texts.itemSellingPromptMessage = 'Prologue_WHITESPACE.message_3';
  data.texts.itemBuyingConfirmationMessage = 'Prologue_WHITESPACE.message_3';
  data.texts.itemSellingConfirmationMessage = 'Prologue_WHITESPACE.message_3';
  data.texts.itemBuyingCancelMessage = 'Prologue_WHITESPACE.message_3';
  data.texts.itemSellingCancelMessage = 'Prologue_WHITESPACE.message_3';
  // } else {


  // };
  // Go Through List of Entries and replace messages
  for (let [key, value] of Object.entries(shopKeeper.texts)) { data.texts[key] = value};

  //TR STUFF
  data.pictureName = shopKeeper.pictureName ? shopKeeper.pictureName : ''
  if (data.pictureName === '') {
    console.log('No picture for this shopkeeper.')
  } else {
    //Indexes I fucking hate these so much oh my god
    data.indexes = {};
        //here we go
        data.indexes.buyingIndex = [0,0];
        data.indexes.sellingIndex = [0,0];
        data.indexes.maxItemIndex = [0,0];
        data.indexes.notEnoughMoneyIndex = [0,0];
        data.indexes.onItemListBuyOkIndex = [0,0];
        data.indexes.onItemListSellOkIndex = [0,0];
        data.indexes.itemBuyingPromptIndex = [0,0];
        data.indexes.itemSellingPromptIndex = [0,0];
        data.indexes.itemBuyingConfirmationIndex = [0,0];
        data.indexes.itemSellingConfirmationIndex = [0,0];
        data.indexes.itemBuyingCancelIndex = [0,0];
        data.indexes.itemSellingCancelIndex = [0,0];
    //Convert all these per Shopkeeper
    for (let [key, value] of Object.entries(shopKeeper.indexes)) { data.indexes[key] = value};
  };
};

let old_initAtlas = Scene_OmoriItemShop.prototype.initAtlastLists;
Scene_OmoriItemShop.prototype.initAtlastLists = function() {
  // Run Original Function
  old_initAtlas.call(this)
  
  //Reserve all mod files
  let images = TR.ShopImages
  for (i = 0; i < images.length; i++) {
    ImageManager.reserveSystem(images[i], 0,  this._imageReservationId)
  }
};

Scene_OmoriItemShop.prototype.create = function() {
  // Super Call
  Scene_BaseEX.prototype.create.call(this);
  // Create Background
  this.createBackground();
  // Create Shop Keeper Sprite
  this.createShopKeeperSprite();
  // Create Windows
  this.createGoldWindow();
  this.createShopHeaderWindow()
  this.createItemListWindow()
  this.createTotalWindow();
  this.createMessageWindow();



  // this._goldWindow.y += 355 + 50;
  // this._goldWindow.x -= 120;
  // this._goldWindow.x += 145
  // this._goldWindow.opacity = 0;

  this._shopKeeperSprite.x = 0;
  this._shopKeeperSprite.y = 0;
  //this.start()
};

Scene_OmoriItemShop.prototype.createShopKeeperSprite = function() {
  var data = $gameTemp._shopData
  if (data.pictureName) {
    this._shopKeeperSprite = new Sprite(ImageManager.loadSystem(data.pictureName));
    this._shopKeeperSprite.setFrame(0, 0, Graphics.wdith, Graphics.height);
    this._shopKeeperSprite.visible = data.pictureName ? true : false
    this._shopKeeperSprite.opacity = 0;
    this.addChild(this._shopKeeperSprite);
    // Set Default shop keeper face
    let defaultFace = data.shopType === 0 ? data.indexes.buyingIndex : data.indexes.sellingIndex
    this.setShopKeeperFace(defaultFace)
  }
};

Scene_OmoriItemShop.prototype.onItemListOk = function() {
  // Get Item
  var data = $gameTemp._shopData
  var item = this._itemListWindow.item();
  var price = this._itemListWindow.price();
  // Get Buying/Selling State
  var buying = $gameTemp._shopData.shopType === 0;
  var maxItems = buying ? 99 - $gameParty.numItems(item) : $gameParty.numItems(item);
  var canBuy = maxItems > 0
  var hasGold = price <= $gameParty.gold();
  // If can't buy or don't have gold
  if (buying && (!canBuy || !hasGold)) {
    // Show Max Item Message
    this.queue(function() {
      var message = '';
      var index = data.indexes.buyingIndex
      // Add Messages
      if (!canBuy) { 
        message = $gameTemp._shopData.texts.maxItemMessage;
        index = data.indexes.maxItemIndex
      }
      if (!hasGold) { 
        message = $gameTemp._shopData.texts.notEnoughMoneyMessage
        index = data.indexes.notEnoughMoneyIndex
      };
      // Add Text
      this.setShopKeeperFace(index);
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
    this.setShopKeeperFace(data.indexes.onItemListBuyOkIndex);
    $gameMessage.showLanguageMessage($gameTemp._shopData.texts.onItemListBuyOkMessage);
  } else {
    // Add Text
    this.setShopKeeperFace(data.indexes.onItemListSellOkIndex);
    $gameMessage.showLanguageMessage($gameTemp._shopData.texts.onItemListSellOkMessage);
  };
};

Scene_OmoriItemShop.prototype.onTotalWindowOk = function() {
  // Set Choice Callback Function
  var data = $gameTemp._shopData
  $gameMessage.setChoiceCallback(this.onPurchaseChoice.bind(this));
  // If Buying
  if ($gameTemp._shopData.shopType === 0) {
    // Add Text
    this.setShopKeeperFace(data.indexes.itemBuyingPromptIndex);
    $gameMessage.showLanguageMessage($gameTemp._shopData.texts.itemBuyingPromptMessage);
  } else {
    // Add Text
    this.setShopKeeperFace(data.indexes.itemSellingPromptIndex);
    $gameMessage.showLanguageMessage($gameTemp._shopData.texts.itemSellingPromptMessage);
  };
  // Get Buy Options Text
  var text = LanguageManager.getMessageData(`${TR.ShopkeepersYaml}.itemShopMenu`).buyOptions
  // Set Choice Text
  $gameMessage.setChoices([text[0], text[1]], 0, 1)
};

Scene_OmoriItemShop.prototype.onPurchaseChoice = function(n) {
  // Clear Input
  Input.clear()
  // Initialize Message
  var message;
  var index
  // If Yes
  if (n === 0) {
    var item = this._itemListWindow.item();
    var total = this._totalWindow.totalPrice();
    // If Buying
    if ($gameTemp._shopData.shopType === 0) {
      // Lose Gold
    AudioManager.playSe({name: "SYS_cha_ching", pan: 0, pitch: 100, volume: 90});
      $gameParty.loseGold(total);
      // Gain Items
      $gameParty.gainItem(item, this._totalWindow._amount);
      // Set Confirm Message
      index = $gameTemp._shopData.indexes.itemBuyingConfirmationIndex;
      message = $gameTemp._shopData.texts.itemBuyingConfirmationMessage;
    } else {
      // Gain Gold
      $gameParty.gainGold(total);
      // Gain Items
          AudioManager.playSe({name: "SYS_cha_ching", pan: 0, pitch: 100, volume: 90});
      $gameParty.loseItem(item, this._totalWindow._amount);
      // Set Confirm Message
      index = $gameTemp._shopData.indexes.itemSellingConfirmationIndex;
      message = $gameTemp._shopData.texts.itemSellingConfirmationMessage;
      // Refresh Item List Window
      this._itemListWindow.refresh();
    };
    // Refresh Gold Window
    this._goldWindow.refresh();
  } else {
    // If Buying
    if ($gameTemp._shopData.shopType === 0) {
      // Set Cancel Message
      index = $gameTemp._shopData.indexes.itemBuyingCancelIndex;
      message = $gameTemp._shopData.texts.itemBuyingCancelMessage;
    } else {
      // Set Cancel Message
      index = $gameTemp._shopData.indexes.itemSellingCancelIndex;
      message = $gameTemp._shopData.texts.itemSellingCancelMessage;
    };
  };
  // If Message Exists
  if (message) {
    // Show Max Item Message
    this.queue(function() {
      // Clear Game Message
      $gameMessage.clear();
      // Add Text
      this.setShopKeeperFace(index);
      $gameMessage.showLanguageMessage(message);
    }.bind(this))
  };

  // Wait for Message
  this.queue('startFunctionWait', this.waitForMessage.bind(this))
  this.queue(function() {
    // Clear Game Message
    $gameMessage.clear();
    // Activate List Window
    this._itemListWindow.activate();
  }.bind(this))
};

Scene_OmoriItemShop.prototype.setShopKeeperFace = function(index = [0,0]) {
  // Set Shop Keepers Face Sprite
  this._shopKeeperSprite.setFrame(index[0] * Graphics.width, index[1] * Graphics.height, Graphics.width, Graphics.height);
};