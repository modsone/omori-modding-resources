var Imported = Imported || {};
Imported.Stahl_DeathCE = true;

//-----------------------------------------------------------------------------
/*:
 * @plugindesc Adds note tag for calling common events on death
 * 
 * @author StahlReyn
 *
 * @help
 * <PreDeathSkill:Number>
 * Number - ID of Skill
 * Skill casted before death
 * 
 * <DeathCE:Number>
 * Number - ID of the common event
 * This is played on when battler dies
 * 
 * <PreDeathCE:Number>
 * Number - ID of the common event
 * This is played right before the battler dies, good for force actions.
 * 
 * Other variables are also saved before the commmon event is called:
 * $gameTemp.deathCE_Battler -- the battler before DeathCE
 * $gameTemp.preDeathCE_Battler -- the battler before PreDeathCE
 * 
 * Dependencies:
 * YEP_BattleEngineCore - queueForceAction to support multiple 
 * enemies dying at same time for pre death skill
 */
{
  	const old_Game_Enemy_die = Game_Enemy.prototype.die;
 	Game_Enemy.prototype.die = function() {
    	$gameTemp.deathCE_Battler = this;
    	if (this.enemy().meta.DeathCE) {
    	  $gameTemp.reserveCommonEvent(Number(this.enemy().meta.DeathCE));
    	}
    	old_Game_Enemy_die.call(this);
	};

	const old_Game_Battler_refresh = Game_Battler.prototype.refresh;
	Game_Battler.prototype.refresh = function() {
		if (!this._hasPreDied && this.hp <= 0) {
			$gameTemp.preDeathCE_Battler = this;
			if (this.isEnemy()) {
				if (this.enemy().meta.PreDeathSkill){
					console.log("ran refresh predeathskill");
					//this.forceAction(Number(this.enemy().meta.PreDeathSkill), -2);
					//BattleManager.forceAction(this);
					BattleManager.queueForceAction(this, Number(this.enemy().meta.PreDeathSkill))
					this.removeState(3);
				}
				if (this.enemy().meta.PreDeathCE){
					console.log("ran refresh CE");
					$gameTemp.reserveCommonEvent(Number(this.enemy().meta.PreDeathCE));
				}
			}
			this._hasPreDied = true;
		} 
		old_Game_Battler_refresh.call(this);
	};
}