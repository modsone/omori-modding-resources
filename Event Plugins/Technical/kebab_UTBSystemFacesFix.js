/*
 *
 * @plugindesc fixes for SRD_UndertaleBattleSystem in OMORI mods
 * 
 * 
 * 
 * 
 * @author KEBAB
 
 * 
*/

var kebab = kebab || {};
kebab.fixes = kebab.fixes || {};
//UNUSED EMOTIONS ARRAY
kebab.fixes.emotions = [6, 7, 8, 10, 11, 12, 14, 15, 16, 18, 20];

//FOR EMOTIONS TO UPDATE RIGHT AFTER THEY'RE INFLICTED
var oldWindowOmoriBattleActorStatusPrototypeUpdate = Window_OmoriBattleActorStatus.prototype.update;
Window_OmoriBattleActorStatus.prototype.update = function() {
    oldWindowOmoriBattleActorStatusPrototypeUpdate.call(this);
    if (!!kebab.fixes.actorHurt) {
        kebab.fixes.timer++
        if (kebab.fixes.timer>=300) {
            kebab.fixes.actorHurt=false;
            this.refresh();
        }
    } else {
        // var someoneHasEmotion = $gameParty.members().some(memb => memb._states.some(id => kebab.fixes.emotions.contains(id)))
        if (SceneManager._scene instanceof Scene_Battle && !$gameTroop.isAllDead() && !kebab.fixes.actorHurt) {
            this.refresh();
        }
    }
}

//HURT FACE FIX
var oldGameActionPrototypeExecuteDamage = Game_Action.prototype.executeDamage;
Game_Action.prototype.executeDamage = function(target, value) {
    oldGameActionPrototypeExecuteDamage.call(this, target, value);
    if (target.isActor() && value > 0) {
        kebab.fixes.actorHurt=true;
        kebab.fixes.timer = 0;
        if (SceneManager._scene instanceof Scene_Battle && SceneManager._scene._statusWindow) {
            SceneManager._scene._statusWindow.refresh();
        }
    }
}

var oldBattleManagerEndUTBAttack = BattleManager.endUTBAttack
BattleManager.endUTBAttack = function() {
    oldBattleManagerEndUTBAttack.call(this);
    kebab.fixes.actorHurt=false;
    kebab.fixes.timer = 0;
}