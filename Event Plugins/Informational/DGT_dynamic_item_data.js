/*:
 * @plugindesc Dynamic Item Data
 * @author Draught
 * @help
 *
 * This plugin allows you to change the display data of items, skills, weapons, 
 * and armors on the fly. Using a simple script call, you can update either 
 * the "name" or "description" field for any valid item during gameplay.
 * 
 * =============================================================================
 * How to Use
 * =============================================================================
 * Use the following script call anywhere in your events or code:
 * 
 *    DGT.changeItemData(source, id, field, data);
 * 
 * Parameters:
 *   • source: The type of data to modify ("item", "skill", "weapon", or "armor"). 
 *             Plural forms (like "items") are automatically normalized.
 *   • id: A number representing the item's ID in the corresponding data list.
 *   • field: The field to change – only "name" and "description" are supported.
 *   • data: The new text to display.
 * 
 * Example:
 *    DGT.changeItemData("item", 5, "description", "This item sucks.");
 * 
 * =============================================================================
 * Notes
 * =============================================================================
 * - The plugin stores its data in $gameSystem['_dgt_dynitem'].
 * - It automatically updates various windows (such as the help window and 
 *   shop message window) so that changes are reflected immediately.
 * - Ensure the specified item (or skill, weapon, armor) exists before calling 
 *   the function.
 * 
 *
 *
 */



window.DGT = window.DGT || {}
DGT.dynitem = {}
{
    DGT.dynitem.DataManager_setupNewGame = DataManager.setupNewGame
    DataManager.setupNewGame = function() {
        DGT.dynitem.DataManager_setupNewGame.call(this)
        $gameSystem['_dgt_dynitem'] = {
            item:{},
            skill:{},
            weapon:{},
            armor:{}
        } 
    }
    DGT.dynitem.DataManager_extractSaveContents = DataManager.extractSaveContents
    DataManager.extractSaveContents = function(contents) {
        DGT.dynitem.DataManager_extractSaveContents.call(this, contents)
        // establish default values
        $gameSystem['_dgt_dynitem'] = $gameSystem['_dgt_dynitem'] || {
            item:{},
            skill:{},
            weapon:{},
            armor:{}
        }
    }
    function isValidSource(source) {
        return Object.keys($gameSystem['_dgt_dynitem']).includes(source)
    }
    function isValidField(field) {
        if (field === 'description' || field === 'name') {return true}
        else {return false}
    }
    let dataLoc = {
        item: ()=>$dataItems,
        skill: ()=>$dataSkills,
        weapon: ()=>$dataWeapons,
        armor: ()=>$dataArmors
    }
    DGT.changeItemData = function(source, id, field, data) {
        if (source === undefined || id === undefined || field === undefined) {return}
        if (!(typeof source === 'string')) {return}
        if (!(typeof id === 'number')) {return}
        if (!(typeof field === 'string')) {return}
        source = source.toLowerCase()
        source = source.replace(/s$/i, '') // remove trailing s (weapons -> weapon, etc.)
        id = parseInt(id)
        if (!isValidSource(source)) {return}
        if (!isValidField(field)) {return}
        let baseData = dataLoc[source]()
        if (!baseData[id]) {console.error(`${id} does not exist in '${source}' list`); return}
        let savedData = $gameSystem['_dgt_dynitem']
        savedData[source][id] = savedData[source][id] || {}
        savedData[source][id][field] = data
    }
    function getItemType(item) {
        if (DataManager.isSkill(item)) {
            return 'skill';
        } else if (DataManager.isItem(item)) {
            return 'item';
        } else if (DataManager.isWeapon(item)) {
            return 'weapon';
        } else if (DataManager.isArmor(item)) {
            return 'armor';
        } else {
            return '';
        }
    };
    function getDescForItem(item) {
        if (!item) {return ''}
        let dataClass = getItemType(item)
        if (dataClass === '') {return ''}
        let savedData = $gameSystem['_dgt_dynitem']
        let id = item.id
        if (savedData[dataClass][id]) {
            return savedData[dataClass][id]['description'] || item.description
        }
        return item.description
    }
    function getNameForItem(item) {
        if (!item) {return ''}
        let dataClass = getItemType(item)
        if (dataClass === '') {return ''}
        let savedData = $gameSystem['_dgt_dynitem']
        let id = item.id
        if (savedData[dataClass][id]) {
            return savedData[dataClass][id]['name'] || item.name
        }
        return item.description
    }
    DGT.dynitem.Window_Help_setItem = Window_Help.prototype.setItem
    Window_Help.prototype.setItem = function(item) {
        let description = getDescForItem(item)
        if (window.Yanfly && Yanfly.Param && eval(Yanfly.Param.MSGDescWrap)) {
            this.setText('<WordWrap>' + description); // YEP_MessageCore Compat
        } else {
            this.setText(description)
        }
    }
    // Window_GachaGet.prototype.drawDescription = function(x, y) {
    //     if (this._item) this.drawTextEx(getDescForItem(this._item), x, y);
    // };
    // DGT.dynitem.Window_GachaBookStatus_refresh = Window_GachaBookStatus.prototype.refresh
    // Window_GachaBookStatus.prototype.refresh = function() {
    //     if (this._item && $gameSystem.isInGachaBook(this._item)) {
    //         let old = this.drawTextEx
    //         this.drawTextEx = function(t, x, y) {
    //             old.call(this, getDescForItem(this._item), x, y)
    //             this.drawTextEx = old
    //         }
    //     }
    //     DGT.dynitem.Window_GachaBookStatus_refresh.call(this)
    // }
    DGT.dynitem.Window_OmoMenuHelp_refresh = Window_OmoMenuHelp.prototype.refresh
    Window_OmoMenuHelp.prototype.refresh = function() {
        if (this._item) {
            let old = this.drawTextEx
            this.drawTextEx = function(t, x, y) {
                old.call(this, getDescForItem(this._item), x, y)
                this.drawTextEx = old
            }
        }
        DGT.dynitem.Window_OmoMenuHelp_refresh.call(this)
    }
    DGT.dynitem.WindowItemShopMessage_drawItem = WindowItemShopMessage.prototype.drawItem
    WindowItemShopMessage.prototype.drawItem = function(item) {
        if (item) {
            let old = this.convertEscapeCharacters
            this.convertEscapeCharacters = function(text) {
                let retValue = old.call(this, getDescForItem(item))
                this.convertEscapeCharacters = old
                return retValue
            }
        }
        DGT.WindowItemShopMessage_drawItem.call(this, item)
    }
    DGT.getDescForItem = getDescForItem
    DGT.getNameForItem = getNameForItem
}