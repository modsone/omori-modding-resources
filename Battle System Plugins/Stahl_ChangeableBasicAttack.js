/*:
 * @plugindesc [v1.0.0] Makes Basic Attack Skill Id changeable with equips
 * 
 * @author StahlReyn
 *
 * @help
 * Makes Basic Attack Skill Id changeable with equips
 * 
 * In Equipments Notetag (Armors and Weapons)
 * <SetBasicAttack:id>
 * id is number, no space from colon
 * Will pick the first ID with this tag if multiple equip edits
 */

var Stahl = Stahl || {};
Stahl.ChangeableBasicAttack = Stahl.ChangeableBasicAttack || {};

Scene_Battle.prototype.commandActorCommandAction = function() { 
    var symbol = this._actorCommandWindow.currentSymbol();  
    var id = this._actorCommandWindow.currentExt();
    var action = BattleManager.inputtingAction();

    var actor = BattleManager.actor();
    id = actor.getBasicAttackOverride() || id;

    if (symbol === 'actionSkill') { action.setSkill(id); }
    if (symbol === 'actionItem')  { action.setItem(id); }
    this.onSelectAction();
}

Game_Actor.prototype.getBasicAttackOverride = function() {
    var equips = this.equips();
    for (let equip of equips) {
        if (equip && equip.meta.SetBasicAttack) {
            return Number(equip.meta.SetBasicAttack);
        }
    }
    return null;
}