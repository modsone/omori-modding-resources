//===============================================================================================================
// FoGsesipod - Passive Skills
// FoG_PassiveSkills.js
//===============================================================================================================

//===============================================================================================================
/*:
 * @plugindesc Allows Skills to add states to actors.
 * @author FoGsesipod - Draught
 * @help
 * 
 * add <SkillPassive:StateId> to a skills notetag, when its equipped the actor will gain the state defined in
 * StateId.
 * 
 * States that "Remove At Battle End", will not be applied in the overworld. Furthermore, these states can still
 * run out if configured to do so in rpgmaker.
 * 
 * Original Code from Draught, rewritten and fixed by FoGsesipod.
*/
//===============================================================================================================
{
    const old_DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded
    DataManager.isDatabaseLoaded = function() {
        if (!old_DataManager_isDatabaseLoaded.call(this)) {
            return false;
        };
        this.processDGTPSNotetags($dataSkills)
        return true;
    };

    DataManager.processDGTPSNotetags = function(group) {
        let note1 = /<SKILL[ ]?PASSIVE:[ ]?(\d+)>/i;
        let note2 = /<SERIOUSLY ?DON'?T ?ALLOW ?(?:USE)?>/i; // this bypasses the thing that
                                                             // allows you to queue skills
                                                             // regardless of requirements

        for (let n = 1; n < group.length; n++) {
          let obj = group[n];
          let notedata = obj.note.split(/[\r\n]+/);

          obj.skillStates = [];
          obj._reallyDoNot = false

          for (let i = 0; i < notedata.length; i++) {
            let line = notedata[i];
            if (line.match(note1)) {
              obj.skillStates.push(parseInt(RegExp.$1))
            } else if (line.match(note2)) {
              obj._reallyDoNot = true
            }
          }
        }
    };

    const old_BattleManager_setup = BattleManager.setup
    BattleManager.setup = function(troopId, canEscape, canLose) {
        old_BattleManager_setup.call(this, troopId, canEscape, canLose);
        $gameParty.battleMembers().forEach((actor) => {
            actor._equippedSkills.forEach((skillId) => {
                if (skillId != 0) {
                    $dataSkills[skillId].skillStates.forEach((stateId) => {
                        if ($dataStates[stateId].removeAtBattleEnd == true) {
                            actor.ForceAddState(stateId);
                        }
                    })
                }
            })
        })
    }

    const old_Window_SkillList_prototype_isEnabled = Window_SkillList.prototype.isEnabled
    Window_SkillList.prototype.isEnabled = function(item) {
        return old_Window_SkillList_prototype_isEnabled.call(this, item) && !item._reallyDoNot
    }

    Game_Battler.prototype.ForceAddState = function(stateId) {
        if (!this.isStateAffected(stateId)) {
            this.addNewState(stateId);
            this.refresh();
        }
        this.resetStateCounts(stateId);
        this._result.pushAddedState(stateId);
    };

    const old_Game_Actor_prototype_equipSkill = Game_Actor.prototype.equipSkill
    Game_Actor.prototype.equipSkill = function(equipIndex, skillId) {
        if (skillId) { // use truthy value instead of checking != 0, could be undefined in very specific circumstances
            $dataSkills[skillId].skillStates.forEach((stateId) => {
            if ($dataStates[stateId].removeAtBattleEnd == false) {
                this.ForceAddState(stateId);
                }
            })
        }
        return old_Game_Actor_prototype_equipSkill.call(this, equipIndex, skillId);
    }

    const old_Game_Actor_prototype_unequipSkill = Game_Actor.prototype.unequipSkill
    Game_Actor.prototype.unequipSkill = function(equipIndex, learn) {
        if (this._equippedSkills[equipIndex]) { // use truthy value instead of checking != 0, could be undefined in very specific circumstances
            $dataSkills[this._equippedSkills[equipIndex]].skillStates.forEach((stateId) => {
            if ($dataStates[stateId].removeAtBattleEnd == false) {
                this.removeState(stateId);
                }
            })
        }
        return old_Game_Actor_prototype_unequipSkill.call(this, equipIndex, learn);
    }
}