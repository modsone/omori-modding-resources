//=============================================================================
// Fix Basic Attacks - By TomatoRadio
// TR_FixBasicAttack.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_FixBasicAttack = true;

var TR = TR || {};
TR.FBA = TR.FBA || {};
TR.FBA.version = 1;

/*: 
 *
 * @plugindesc Fixes Basic Attacks being saved to file.
 * @author TomatoRadio
 * 
 * @help
 * Normally your basic attacks get saved to your Save File,
 * this means that when you change an actor's basic attack ID
 * and load an old save, it will still use the old ID.
 * 
 * This fixes that.
 * 
*/

Game_Actor.prototype.battleCommandsList = function() {
    var dataCommandList = $dataActors[this.actorId()].meta.BattleCommandsList.clone(); 
    var actorCommandList = this._battleCommandsList || {};
    if (!Object.keys(dataCommandList).equals(Object.keys(actorCommandList)) || !Object.values(dataCommandList).equals(Object.values(actorCommandList))) {
        this._battleCommandsList = dataCommandList;
    }
    return this._battleCommandsList;
};