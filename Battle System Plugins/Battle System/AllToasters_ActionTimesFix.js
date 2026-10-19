//=============================================================================
 /*:
 * @plugindesc Fixes the Action Times+ trait in OMORI
 *
 * @author alltoasters
 *
 * @help
 * Put this below Omori Battle System.js and GTP_OmoriFixes.js.
 * 
 * This fix only applies to party members, enemies should function even without this plugin.
 */
//=============================================================================

BattleManager.selectNextCommand = function() {
    let indexList = this.getActorInputOrder();
    // OBS would originally override _actorIndex here, which skips to the actor
    // who is about to act instead of the actor who just acted
    // the fix is to not jump ahead and allow the base game flow to happen
    do {
        if (!this.actor() || !this.actor().selectNextCommand()) {
            this.changeActor(indexList[this._actorCommandIndex++], 'waiting');
            if (this._actorCommandIndex > indexList.length) {
                this.startTurn();
                break;
            }
        }
    } while (this.actor() && !this.actor().canInput());
};


BattleManager.selectPreviousCommand = function() {
    let indexList = this.getActorInputOrder();
    // apply the same fix to decrementing an action, OBS would force _actorIndex here too
    // OBS also decrements unconditionally instead of checking actor.selectPreviousCommand()
    // ...AND clears the current action twice
    // again, just mirror how base game does it
    do {
        if (!this.actor() || !this.actor().selectPreviousCommand()) {
            // since the current actor may have had multiple actions, go back to the previous actor
            // essentially mirrors the OBS patch but after the previousCommand check instead of before
            let prev = this._actorCommandIndex - 2;
            if (prev < 0) {
                this.changeActor(-1, 'undecided')
                this._actorCommandIndex = 0;
                return;   
            }
            this.changeActor(indexList[prev], 'undecided')
            // now we can actually decrement this
            // mirrors the unconditional decrement done by OBS
            this._actorCommandIndex--;
        }
    } while (this.actor() && !this.actor().canInput());
    this.clearInputtingAction();
};