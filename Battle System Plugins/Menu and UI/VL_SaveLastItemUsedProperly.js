//=============================================================================
 /*:
 * @plugindesc
 * This plugin makes the cursor's position be saved properly for both snacks and toys instead of only one being saved at a time.
 *
 * @author vl
 */
//=============================================================================

Game_Party.prototype.lastSnack = function () {
    return this._lastSnack.object();
};

_TDS_.OmoriBattleSystem.Scene_Battle_onItemOk = function () {
    var item = this._itemWindow.item();
    var action = BattleManager.inputtingAction();
    action.setItem(item.id);
    if (this._itemWindow._category == "toys") {
        $gameParty.setLastItem(item);
    } else {
        $gameParty._lastSnack.setObject(item);
    }
    this.onSelectAction();
};

Window_BattleItem.prototype.selectLast = function () {
    if ($gameParty._lastSnack == undefined) {
        $gameParty._lastSnack = new Game_Item();
    }
    var itemType = this._category == "toys" || $gameParty.lastSnack() == null ? $gameParty.lastItem() : $gameParty.lastSnack()
    var index = this._data.indexOf(itemType);
    this.select(index >= 0 ? index : 0);
};