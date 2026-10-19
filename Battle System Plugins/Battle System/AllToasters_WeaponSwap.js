/*:
 * @plugindesc Adds an in-battle weapon swapping mechanic to OMORI
 *
 * @author alltoasters
 * @version 1.0
 * 
 * @help When in a battle, press SHIFT to open a weapon select dialogue. 
 * You can freely swap your weapon without taking up a turn.
 * Only weapons equippable by the current actor will be displayed.
 * 
 * 
 * @param giveWeaponsInBattleTest
 * @text Give Weapons in Battle Test
 * @type boolean
 * @desc Whether to give the party all weapons in the Battle Test. Useful for debugging purposes.
 * @default true
 * 
 * @param statusWindowX
 * @text Status Window X
 * @type number
 * @desc The X position of the status window that appears when selecting a weapon.
 * @default 200
 * 
 * @param statusWindowY
 * @text Status Window Y
 * @type number
 * @desc The Y position of the status window that appears when selecting a weapon.
 * @default 170
 * 
 * @param showBindHint
 * @text Show Bind Hint
 * @type boolean
 * @desc Whether to show the SHIFT keybind weapon swap reminder on the actor command menu.
 * @default true
 * 
 * @param bindHintXOffset
 * @text Bind Hint X Offset
 * @type number
 * @desc The X offset of the SHIFT keybind weapon swap reminder, relative to the stress meter.
 * @min -640
 * @max 640
 * @default 0
 * 
 * @param bindHintYOffset
 * @text Bind Hint Y Offset
 * @type number
 * @min -480
 * @max 480
 * @desc The Y offset of the SHIFT keybind weapon swap reminder, relative to the stress meter.
 * @default -120
*/

const params = PluginManager.parameters('AllToasters_WeaponSwap');
var AllToasters = AllToasters || {};

// setup parameters
AllToasters.giveWeaponsInBattleTest = params['giveWeaponsInBattleTest'] === 'true';
AllToasters.statusWindowX = parseInt(params['statusWindowX']) || 200;
AllToasters.statusWindowY = parseInt(params['statusWindowY']) || 170;
AllToasters.showBindHint = params['showBindHint'] === 'true';
AllToasters.bindHintXOffset = parseInt(params['bindHintXOffset']) || 0;
AllToasters.bindHintYOffset = parseInt(params['bindHintYOffset']) || -120;

AllToasters.Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
Scene_Battle.prototype.createActorCommandWindow = function() {
    AllToasters.Scene_Battle_createActorCommandWindow.call(this);

    // create status window
    // renders above the energy bar by default
    AllToasters.battleEquipStatus = new Window_ATBattleEquipStatus();
    AllToasters.battleEquipStatus.x = AllToasters.statusWindowX;
    AllToasters.battleEquipStatus.y = AllToasters.statusWindowY;
    AllToasters.battleEquipStatus.openness = 0;
    this.addChild(AllToasters.battleEquipStatus);
};

AllToasters.Scene_Battle_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function() {
    AllToasters.Scene_Battle_update.call(this);
    // make sure we're currently on the actor command window, and no other sub-windows are visible
    if (Input.isTriggered('shift') && this._actorCommandWindow.active && this._actorCommandWindow.isOpen() && !this._itemWindow.active && !this._skillWindow.active) {
        SoundManager.playOk();
        this.commandItem('weapons');
        // prevent the actor command window from receiving input while the weapon menu is open
        // this gets reset automatically when the weapon menu is closed/cancelled
        this._actorCommandWindow.active = false;
    }
};

AllToasters.Scene_Battle_commandItem = Scene_Battle.prototype.commandItem;
Scene_Battle.prototype.commandItem = function(category = 'consumables') {
    var actor = BattleManager.actor();
    if (actor && category === 'weapons') {
        AllToasters.battleEquipStatus.setActor(actor);
        AllToasters.battleEquipStatus.open();
    }
    AllToasters.Scene_Battle_commandItem.call(this, category);
};

AllToasters.Window_BattleItem_makeItemList = Window_BattleItem.prototype.makeItemList;
Window_BattleItem.prototype.makeItemList = function() {
    if (this._category === 'weapons') {
        var actor = BattleManager.actor()
        var weapons = $gameParty.weapons().concat(actor ? actor.weapons() : []);
        // sort by id to maintain order during selection
        // makes the swap happen in-place instead of jumping to the bottom of the weapon list
        weapons.sort(function(a, b) { return a.id - b.id; });
        this._data = weapons.filter(function(item) { return this.includes(item); }, this);
    }
    else {
        AllToasters.Window_BattleItem_makeItemList.call(this);
    }
};

AllToasters.Scene_Battle_onItemCancel = Scene_Battle.prototype.onItemCancel;
Scene_Battle.prototype.onItemCancel = function() {
    AllToasters.Scene_Battle_onItemCancel.call(this);
    if (AllToasters.battleEquipStatus) {
        AllToasters.battleEquipStatus.close();
        AllToasters.battleEquipStatus.setTempActor(null);
    }
}

Window_BattleItem.prototype.isEnabled = function(item) {
    if (this._category === 'weapons') {
        var actor = BattleManager.actor();
        // prevent selecting a weapon the actor already has equipped
        return actor ? !actor.isEquipped(item) : false;
    }
    return $gameParty.canUse(item);
};

Window_BattleItem.prototype.includes = function(item) {
    var actor = BattleManager.actor();
    switch (this._category) {
        case 'weapons':
            return DataManager.isWeapon(item) && actor && actor.canEquip(item);
        case 'toys':
            // isToyItem already checks isItem, so we can avoid checking that twice for no reason
            return DataManager.isToyItem(item) && $gameParty.battleNumItems(item) > 0 && $gameParty.canUse(item);
        case 'snacks':
            // same thing here
            return DataManager.isConsumableItem(item) && $gameParty.battleNumItems(item) > 0 && $gameParty.canUse(item);
        default:
            return false;
    }
};

AllToasters.Scene_Battle_onItemOk = Scene_Battle.prototype.onItemOk;
Scene_Battle.prototype.onItemOk = function() {
    var item = this._itemWindow.item();
    if (DataManager.isWeapon(item)) {
        var actor = BattleManager.actor();
        if (actor && actor.canEquip(item)) {
            // slot 0 is the weapon
            actor.changeEquip(0, item);
            SoundManager.playEquip();
        }
        else {
            console.error("Attempted to select a null actor or unequippable item, this should never happen!")
            SoundManager.playBuzzer();
        }
        // refresh and reactivate the menu so the cursor stays active and the isEnabled updates
        this._itemWindow.refresh();
        this._itemWindow.activate();
        // call updateHelp to refresh the status window
        this._itemWindow.callUpdateHelp();
        // apply a short one frame "animation" to the face window so the hp/juice values update
        // without this, weapons that change max heart/juice will not update visually until the next change (like taking damage)
        var faceWindow = this._faceWindows.find(function(window) { return window.actor() === actor; });
        if (faceWindow) {
            faceWindow._hpAnim.duration = 1;
            faceWindow._mpAnim.duration = 1;
        }
    }
    else {
        AllToasters.Scene_Battle_onItemOk.call(this);
    }
};

AllToasters.Window_BattleItem_updateHelp = Window_BattleItem.prototype.updateHelp;
Window_BattleItem.prototype.updateHelp = function() {
    AllToasters.Window_BattleItem_updateHelp.call(this);
    if (this._category === 'weapons' && AllToasters.battleEquipStatus) {
        var actor = BattleManager.actor();
        if (actor) {
            // mirror functionality of base game updateHelp on status windows
            var tempActor = JsonEx.makeDeepCopy(actor);
            tempActor.forceChangeEquip(0, this.item());
            AllToasters.battleEquipStatus.setTempActor(tempActor);
        }
    }
};

// give all weapons in battle test for debugging purposes
AllToasters.Game_Party_setupBattleTestItems = Game_Party.prototype.setupBattleTestItems;
Game_Party.prototype.setupBattleTestItems = function() {
    AllToasters.Game_Party_setupBattleTestItems.call(this);
    if (AllToasters.giveWeaponsInBattleTest) {
        $dataWeapons.forEach(function(item) {
                // avoid putting duplicate weapons in the list (i.e. one an actor already has equipped)
                if (item && item.name.length > 0 && !$gameParty.members().some(function(member) { return member.isEquipped(item)})) {
                    this.gainItem(item, 1);
                }
            }, this);
    }
};


// reimplementation of Window_OmoMenuEquipStatus with the bubbles removed
// credits to TDS
function Window_ATBattleEquipStatus() { this.initialize.apply(this, arguments); }
Window_ATBattleEquipStatus.prototype = Object.create(Window_Base.prototype);
Window_ATBattleEquipStatus.prototype.constructor = Window_ATBattleEquipStatus;

Window_ATBattleEquipStatus.prototype.initialize = function() {
    Window_Base.prototype.initialize.call(this, 0, 0, this.windowWidth(), this.windowHeight());
    this._params = [0, 1, 2, 3, 6, 7, [100, 8]];
    this._actor = null;
    this._tempActor = null;
    this.refresh();
};

Window_ATBattleEquipStatus.prototype.close = function() {
    Window_Base.prototype.close.call(this);
};

Window_ATBattleEquipStatus.prototype.isUsingCustomCursorRectSprite = function() { return true; }
Window_ATBattleEquipStatus.prototype.standardOpennessType = function() { return 2; }
Window_ATBattleEquipStatus.prototype.standardPadding = function() { return 4; }
Window_ATBattleEquipStatus.prototype.windowWidth = function() { return 237; }
Window_ATBattleEquipStatus.prototype.windowHeight = function() { return 168; }

Window_ATBattleEquipStatus.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

Window_ATBattleEquipStatus.prototype.setTempActor = function(tempActor) {
    if (this._tempActor !== tempActor) {AllToasters._itemWindowVisible = false;
AllToasters._skillWindowVisible = false;
        this._tempActor = tempActor;
        this.refresh();
    }
};

Window_ATBattleEquipStatus.prototype.actorParamValue = function(actor, param) {
  if (param >= 200) {
    return actor.sparam(param - 200);
  } else if (param >= 100 && param < 200) {
    return actor.xparam(param - 100) * 100;
  } else {
    return actor.param(param);
  }
};

Window_ATBattleEquipStatus.prototype.refresh = function() {
    this.contents.clear();
    var actor = this._actor;
    if (actor) {
        var bitmap = ImageManager.loadSystem('equip_arrow');
        var stats = this._params;
        for (var i = 0; i < stats.length; i++) {
            var paramIdx = stats[i];
            var paramSub = Array.isArray(paramIdx) ? paramIdx[1] : null;
            if (paramSub) { paramIdx = paramIdx[0]; }
            var value1 = this.actorParamValue(actor, paramIdx);
            var paramName = TextManager.param(paramSub ? paramSub : paramIdx);
            if(paramName.toLowerCase() === "max hp") {paramName = "HEART";}
            if(paramName.toLowerCase() === "max mp") {paramName = "JUICE";}
            this.contents.fontSize = 20;
            this.drawText(paramName.toUpperCase() + ':', 8, -5 + i * 21, 100)    
            this.drawText(value1, 132, -5 + i * 21, 100)
            this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 173, 13 + i * 21)
            if (this._tempActor) {
                var value2 = this.actorParamValue(this._tempActor, paramIdx);
                this.resetTextColor();
                if (value1 < value2) {  this.contents.textColor = "#69ff90";}
                if (value1 > value2) {  this.contents.textColor = "#ff2b2b";}        
            } else {
                var value2 = '---';
            }
            this.drawText(value2, 132 + 56, -5 + i * 21, 100)
            this.resetTextColor();  
        }
    }
};

// not sure if this is necessary but why not
Window_ATBattleEquipStatus.prototype.update = function() {
    Window_Base.prototype.update.call(this);
};

// small hint window to show the weapon keybind over the energy bar
function Window_ATSwapHint() { this.initialize.apply(this, arguments); }
Window_ATSwapHint.prototype = Object.create(Window_Base.prototype);
Window_ATSwapHint.prototype.constructor = Window_ATSwapHint;

Window_ATSwapHint.prototype.initialize = function(x, y) {
    Window_Base.prototype.initialize.call(this, x, y, 230, 36);
    this.opacity = 0;
    this.visible = false;
    this.refresh();
};

Window_ATSwapHint.prototype.standardPadding = function() { return 0; }
Window_ATSwapHint.prototype.standardFontSize = function() { return 22; }

Window_ATSwapHint.prototype.refresh = function() {
    this.contents.clear();
    // this looks weird with a space between the shift icon and 'to', so leave as is
    this.drawTextEx('\\DII[shift]to Change Weapon', 0, 0);
};

Window_ATSwapHint.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    var window = SceneManager._scene._actorCommandWindow;
    // only show the keybind when enabled and the actor command window is active
    this.visible = !!(AllToasters.showBindHint && window && window.active && window.isOpen() && BattleManager.actor());
};

// create hint window relative to the stress bar
// keeps compatibility with mods/plugins that move the stress bar
AllToasters.Scene_Battle_createStressBar = Scene_Battle.prototype.createStressBar;
Scene_Battle.prototype.createStressBar = function() {
    AllToasters.Scene_Battle_createStressBar.call(this);
    this._swapHintWindow = new Window_ATSwapHint(this._stressBar.x + AllToasters.bindHintXOffset, this._stressBar.y + AllToasters.bindHintYOffset);
    this.addChild(this._swapHintWindow);
};