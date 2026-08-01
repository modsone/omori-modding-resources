//=============================================================================
// Item Obtain Effect - By TomatoRadio
// TR_ItemObtainEffect.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_ItemObtainEffect = true;

var TR = TR || {};
TR.IOE = TR.IOE || {};

/*:
 * @plugindesc v1.0 YEP-Style effect when an item is obtained.
 *
 * @author TomatoRadio
 *
 * @help
 * 
 * Requires YEP_SkillCore
 * Place this BELOW YEP_SkillCore
 *
 * Appears in the notes of an Item, Armor, or Weapon.
 *
 *   <Item Obtain Effect>
 *    your js code here
 *   </Item Obtain Effect>
 */

TR.IOE.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
    if (!TR.IOE.DataManager_isDatabaseLoaded.call(this)) return false;
    if (!TR.IOE._loadedIOE) {
        DataManager.processIOENotetags($dataItems);
        DataManager.processIOENotetags($dataWeapons);
        DataManager.processIOENotetags($dataArmors);
        TR.IOE._loadedIOE = true;
    };
    return true;
};

DataManager.processIOENotetags = function(data) {
    var note = /<Item Obtain Effect>([\s\S]*?)<\/Item Obtain Effect>/i
    for (let obj of data) {
        if (!obj) {continue}
        obj._itemObtainEffect = '';
        if (obj.note && obj.note.match(note)) {
            let match = obj.note.match(note)
            obj._itemObtainEffect = match ? match[1].trim() : '';
        };
    };
};

TR.IOE.gainItem = Game_Party.prototype.gainItem;
Game_Party.prototype.gainItem = function(item,amount) {
    TR.IOE.gainItem.call(this,item,amount);
    if (item && item._itemObtainEffect) {
        var item = item;
        var s = $gameSwitches._data;
        var v = $gameVariables._data;
        try {
            for (let TRINDEX = 0; TRINDEX < amount; TRINDEX++) {eval(item._itemObtainEffect);};
        } catch (e) {
            Yanfly.Util.displayError(e, item._itemObtainEffect, 'ITEM OBTAIN EFFECT ERROR');
        };
    };
};