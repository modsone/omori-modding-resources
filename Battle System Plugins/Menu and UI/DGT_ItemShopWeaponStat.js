(()=>{
/**
 * Adds a stat window to the item shop that compares the stats of weapons and armor
 * to the currently equipped weapon/armor of a selected character.
 * 
 * @license
 * Copyright (c) 2025 Draught (discord \@yuuto_ichika).
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const ItemShopWindowStat = (window.DGT || {}).ItemShopWindowStat || {};
const DGT = window.DGT || {};
window.DGT = DGT;
DGT.ItemShopWindowStat = ItemShopWindowStat;

class Window_OmoMenuEquipActorSelector extends Window_Base {
    constructor(...args) {super(...args)}
    initialize(width) {
        this._thisWindowWidth = width || 237;
        super.initialize(0, -this.windowHeight(), this.windowWidth(), this.windowHeight())
        this.setActorList([]);
        this._index = 0;
        this.openness = 0;
        this.initArrows()
    }
    setActorList(actorList) {
        this._actorList = actorList;
        this.refresh();
    }
    setIndex(index) {
        this._index = index;
        this.refresh();
    }
    initArrows() {
        let bitmap = ImageManager.loadSystem('equip_arrow')
        bitmap.addLoadListener(() => {
            this.createArrows(bitmap)
        })
    }
    createArrows(bitmap) {

        this._leftArrowSprite = new Sprite(bitmap);

        this._leftArrowSprite.visible = false;
        this._leftArrowSprite.x = 20
        this._leftArrowSprite.y = Math.ceil((this.height / 2) - bitmap.height / 2);
        this._leftArrowSprite.scale.x = -1;
        this.addChild(this._leftArrowSprite);

        this._rightArrowSprite = new Sprite(bitmap);

        this._rightArrowSprite.visible = false;
        this._rightArrowSprite.x = (this.width - bitmap.width) - 20;
        this._rightArrowSprite.y = Math.ceil((this.height / 2) - bitmap.height / 2);
        
        this.addChild(this._rightArrowSprite);

    }
    updateArrows() {
        if (!this._leftArrowSprite || !this._rightArrowSprite) { return; }
        let shouldDrawLeft = this._index > 0;
        let shouldDrawRight = this._index < this._actorList.length - 1;
        this._leftArrowSprite.visible = shouldDrawLeft;
        this._rightArrowSprite.visible = shouldDrawRight;
    }
    refresh() {
        this.contents.clear();
        if (this._actorList.length === 0) { return; }
        let actorName = this._actorList[this._index].name();
        this.drawText(actorName, 0, -10, this.width - this.standardPadding() * 2, 'center');
        this.updateArrows()
    }
    isUsingCustomCursorRectSprite() { return true; }
    standardOpennessType() { return 2; }
    standardPadding() { return 4; }
    windowWidth() { return this._thisWindowWidth; }
    windowHeight() { return 32; }

}
class Window_ShopItemShopStatus extends Window_OmoMenuEquipStatus {
    constructor() { super() }
    initialize() {
        super.initialize()
        this.createActorSelector()

        this._actorList = [];
        this._item = null;
        this._index = 0;
    }
    setItem(item) {
        if (item === this._item) { return; }
        this._item = item;
        this._actorList = $gameParty.members().filter(actor => actor.canEquip(item));
        this.setIndex(0);
        this._actorSelector.setActorList(this._actorList);
    }
    setIndex(index) {
        this._index = index;
        this._actorSelector.setIndex(index);
        this.refresh();
    }
    refresh() {

        ImageManager.loadSystem('equip_arrow') // screw this game

        if (!this._item) {this.close(); return}
        if (this._actorList.length === 0) {this.close(); return}
        

        this._actor = this._actorList[this._index];
        this._tempActor = JsonEx.makeDeepCopy(this._actor);
        let slotid = DataManager.isWeapon(this._item) ? 0 : 1;
        this._tempActor.forceChangeEquip(slotid, this._item);
        this.open();
        super.refresh();
    }
    update() {
        super.update()
        if (!this.isOpen()) { return; }
        if (Input.isTriggered('left') && !(this._index === 0)) {
            AudioManager.playSe({name: "sys_cursor1", pan: 0, pitch: 110, volume: 90});
            this.setIndex(this._index - 1);
          };
          if (Input.isTriggered('right') && !(this._index === this._actorList.length - 1)) {;
            AudioManager.playSe({name: "sys_cursor1", pan: 0, pitch: 110, volume: 90});
            this.setIndex(this._index + 1);
          };
    }
    open() {
        this._actorSelector?this._actorSelector.open():0;
        super.open();
    }
    close() {
        this._actorSelector?this._actorSelector.close():0;
        super.close();
    }
    createActorSelector() {
        this._actorSelector = new Window_OmoMenuEquipActorSelector(this.windowWidth());
        this.addChild(this._actorSelector);
    }
    setActor() {
        //nothing
    }
    setTempActor() {
        //nothing
    }

    createBubbleSprites() {
        super.createBubbleSprites()
        this._bubbleSprites.forEach(sprite => { sprite.visible = false })
    }

}

_Window_OmoriShopItemList_callUpdateHelp = Window_OmoriShopItemList.prototype.callUpdateHelp
Window_OmoriShopItemList.prototype.callUpdateHelp = function () {
    // Super Call
    _Window_OmoriShopItemList_callUpdateHelp.call(this);

    if (!this._data) { this._statWindow?this._statWindow.close():0; return }
    let item = this.item();
    this._statWindow?this._statWindow.setItem(item):0;

};
_Window_OmoriShopItemList_close = Window_OmoriShopItemList.prototype.close
Window_OmoriShopItemList.prototype.close = function () {
    // Super Call
    _Window_OmoriShopItemList_close.call(this);
    this._statWindow?this._statWindow.close():0;
}
_Window_OmoriShopItemList_initialize = Window_OmoriShopItemList.prototype.initialize
Window_OmoriShopItemList.prototype.initialize = function (...args) {
    _Window_OmoriShopItemList_initialize.call(this, ...args);
    this._statWindow = new Window_ShopItemShopStatus();
    this._statWindow.x = (371 + 237) - this._statWindow.windowWidth();
    this._statWindow.y = (127 + 168) - this._statWindow.windowHeight();
    this.addChild(this._statWindow);
}
_Window_OmoriItemShop_update = Scene_OmoriItemShop.prototype.update
Scene_OmoriItemShop.prototype.update = function () {
    // Super Call
    _Window_OmoriItemShop_update.call(this);
    if (!this._itemListWindow.isOpen()) { return; }
    if (this._totalWindow.isOpen()) { 
        if (this._itemListWindow._statWindow.isOpen()) {
            this._itemListWindow._statWindow.close();
        }
    } else {
        if (this._itemListWindow._statWindow.isClosed()) {
            this._itemListWindow._statWindow.refresh();
        }
    }
};
// Scene_OmoriItemShop = class extends Scene_OmoriItemShop {
//     constructor() { super() }
//     create() {
//         super.create()
//         this.createStatWindow()
//     }
//     createStatWindow() {
//         this._statWindow = new Window_ShopItemShopStatus();
//         this.addChild(this._statWindow);
//         this._statWindow.setActor($gameParty.members()[0]);
//         this._statWindow.open();
//     }
// }
})()