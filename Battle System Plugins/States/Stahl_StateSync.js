/*:
 * @plugindesc [v1.0.0] Syncs the States
 * 
 * @author StahlReyn, Draught
 *
 * @help
 * Syncs the States
 * 
 * Plugin Command: syncsprite x y z
 * Plugin Command: syncstate x y z
 * 
 * x y z are enemy index numbers, any amount of number separated by space.
 * The first number in syncsprite is the "parent" sprite, the rest will be based on this one being alive.
 * 
 * States that can be synced by default need to have tag <StateSyncable>
 * 
 * Sprite Syncing by Draught
 */

var Imported = Imported || {};
Imported.Stahl_StateSync = true;

var Stahl = Stahl || {};
Stahl.StateSync = Stahl.StateSync || {};

Stahl.StateSync.isValidSyncState = function (id) {
    let state = $dataStates[id];
    return state && state.meta.StateSyncable;
}

Stahl.StateSync.getSprite = function (enemy) {
    let spriteset = SceneManager._scene._spriteset;
    if (spriteset && spriteset._enemySprites) {
        return SceneManager._scene._spriteset._enemySprites.find(sprite => sprite._actor === enemy);
    }
    return null;
}

Stahl.StateSync.pluginSyncSprite = function(args) {
    if (!$gameParty.inBattle()) { return; }

    let curIndex = args[0];
    let curMember = $gameTroop.members()[parseInt(curIndex)]; // Get current member to change list of "the main"
    if (!curMember) return;
    let curSprite = Stahl.StateSync.getSprite(curMember);
    if (!curSprite) return;

    for (let syncIndex in args) { // Go through list again and add all of the other to sync too.
        let syncMember = $gameTroop.members()[parseInt(syncIndex)];
        if (!syncMember) continue;
        let syncSprite = Stahl.StateSync.getSprite(syncMember);
        if (!syncSprite) continue;

        syncSprite._syncMember = curMember;
        syncSprite._syncSprite = curSprite;
        console.log("Sync Sprite:", curMember.name(), syncMember.name())
    }
}

Stahl.StateSync.Sprite_Enemy_updateSideviewFrame = Sprite_Enemy.prototype.updateSideviewFrame;
Sprite_Enemy.prototype.updateSideviewFrame = function() {
    if (this._syncMember && this._syncSprite && !this._syncMember.isStateAffected(1)) {
        this._pattern = this._syncSprite._pattern
    }
    Stahl.StateSync.Sprite_Enemy_updateSideviewFrame.call(this)
};

Stahl.StateSync.pluginSyncState = function(args) {
    if (!$gameParty.inBattle()) { return; }

    for (let curIndex in args) {
        let curMember = $gameTroop.members()[parseInt(curIndex)]; // Get current member to change list of
        if (!curMember) continue;
        for (let syncIndex in args) { // Go through list again and add all of the other to sync too.
            let syncMember = $gameTroop.members()[parseInt(syncIndex)];
            if (!syncMember) continue;
            curMember._syncStateBattlers.push(syncMember);
        }
    }
}

Stahl.StateSync.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function (command, args) {
    switch (command.toLowerCase()) {
        case 'syncstate':
            Stahl.StateSync.pluginSyncState(args);
            return;
        case 'syncsprite':
            Stahl.StateSync.pluginSyncSprite(args);
            return;
        default:
            Stahl.StateSync.Game_Interpreter_pluginCommand.call(this, command, args);
            return;
    }
}

Stahl.StateSync.Game_Battler_initMembers = Game_Battler.prototype.initMembers;
Game_Battler.prototype.initMembers = function() {
    Stahl.StateSync.Game_Battler_initMembers.call(this);
    this._syncStateBattlers = [];
    this._doneSyncState = false;
};

Stahl.StateSync.Game_Battler_addState = Game_Battler.prototype.addState;
Game_Battler.prototype.addState = function(stateId) {
    Stahl.StateSync.Game_Battler_addState.call(this, stateId);
    if (!Stahl.StateSync.isValidSyncState(stateId)) return;

    this._doneSyncState = true; // mark as done first before doing state adding to avoid infinite recursion back and forth
    this._syncStateBattlers = this._syncStateBattlers || [];
    for (let battler of this._syncStateBattlers) {
        if (battler && battler.isAlive() && !battler._doneSyncState) {
            console.log("Sync State Add:", stateId, this.name(), "to", battler.name());
            battler.addState(stateId);
        }
    }
    this._doneSyncState = false; // reset after done through the recursion
};

Stahl.StateSync.Game_Battler_removeState = Game_Battler.prototype.removeState;
Game_Battler.prototype.removeState = function(stateId) {
    Stahl.StateSync.Game_Battler_removeState.call(this, stateId);
    if (!Stahl.StateSync.isValidSyncState(stateId)) return;
    
    this._doneSyncState = true; // mark as done first before doing state adding to avoid infinite recursion back and forth
    this._syncStateBattlers = this._syncStateBattlers || [];
    for (let battler of this._syncStateBattlers) {
        if (battler && battler.isAlive() && !battler._doneSyncState) {
            console.log("Sync State Remove:", stateId, this.name(), "to", battler.name());
            battler.removeState(stateId);
        }
    }
    this._doneSyncState = false; // reset after done through the recursion
};