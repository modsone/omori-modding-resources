/*:
 * @plugindesc More Equipabble Skills
 * @author RPH
 *
 * @param Default Skill Amount
 * @type number
 * @min 4
 * @max 20
 * @desc This is the default number of skills equippable.
 * @default 4
 * @help
 * Patch plugin
 * 
 * NOT SELF COMPATIBLE, MAKE SURE YOU EITHER USE THE SAME NAME AS IN THE REPO 
 * OR HAVE SOME 
 * OTHER WAY OF DETECTING COMPATIBILITY
 *
 * if you want to raise the skill limit for a given actor, run a script command with 
 * this.set_override(<actor id>, <number>), for instance this.set_override(1, 6); 
 * to give OMORI 6 skill slots.
 *
 *
 */


{
	RPH.Parameters = PluginManager.parameters('RPH_More_Than_4_Skills');
    RPH.Param = RPH.Param || {};
    RPH.Param.SkillAmount = Number(RPH.Parameters['Default Skill Amount']);
	
    // Make it scrollable
    Window_BattleSkill.prototype.maxPageRows = function() { return 2;}

    // Unfuck the arrow
    let old_refresh_arrows = Window_BattleSkill.prototype._refreshArrows;
    Window_BattleSkill.prototype._refreshArrows = function() {
        old_refresh_arrows.call(this);
        this._downArrowSprite.y = 58;
    }

    let old_skill_equip_initialize = Window_OmoMenuActorSkillEquip.prototype.initialize;
    Window_OmoMenuActorSkillEquip.prototype.initialize = function() {
        this.allowedMax = RPH.Param.SkillAmount;
        old_skill_equip_initialize.call(this);
    }

    Window_OmoMenuActorSkillEquip.prototype.maxItems = function() {  return this.allowedMax; }
    Window_OmoMenuActorSkillEquip.prototype.maxPageRows = function() {  return 4; }

    let old_set_actor_index = Window_OmoMenuActorSkillEquip.prototype.setActorIndex;
    Window_OmoMenuActorSkillEquip.prototype.setActorIndex = function(index) {
        this.allowedMax = RPH.Param.SkillAmount;
        if ($gameParty.members()[index]) {
          if ($gameScreen._SC_OVERRIDES_) {
            if ($gameScreen._SC_OVERRIDES_[$gameParty.members()[index]._actorId]) {
              this.allowedMax = $gameScreen._SC_OVERRIDES_[$gameParty.members()[index]._actorId];
            }
          }
        }
        old_set_actor_index.call(this, ...arguments);
    }

    // Inject controlls
    Game_Interpreter.prototype.set_override = function(actor, amount) {
        if (!$gameScreen._SC_OVERRIDES_) {
            $gameScreen._SC_OVERRIDES_ = {};
        }

        $gameScreen._SC_OVERRIDES_[actor] = amount;
        
        for (let i = 0; i < amount; i++) {
          if (!$gameActors._data[actor]._equippedSkills[i]) {
            $gameActors._data[actor]._equippedSkills[i] = 0;
          }
        }
    }
}
