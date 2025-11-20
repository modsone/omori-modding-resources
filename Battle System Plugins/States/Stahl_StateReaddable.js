/*:
 * @plugindesc [v1.0.0] Allows state to be readded on same turn
 * 
 * @author StahlReyn
 *
 * @help
 * Makes isStateAddable not consider isStateRemoved,
 * Allowing for state to be readded on same turn
 * 
 * Dependencies: If exist, Put this below YEP_X_StateCategories
 */

var Stahl = Stahl || {};
Stahl.StateReaddable = Stahl.StateReaddable || {};

Stahl.StateReaddable.Game_Battler_isStateAddable = Game_Battler.prototype.isStateAddable;
Game_Battler.prototype.isStateAddable = function(stateId) {
	let result = Stahl.StateReaddable.Game_Battler_isStateAddable.call(this, stateId);
	var state = $dataStates[stateId];
	if (!state) return false;
	if (this.isPassiveStateAffected(stateId)) return false;

	// if result was false, and COULD be due to is State removed, check again without one.
	if (!result && this._result.isStateRemoved(stateId)) {
		return (
			// Alive or Bypass Death removal
			(this.isAlive() || (state.category && state.category.contains('BYPASS DEATH REMOVAL')))
			&& !this.isStateResist(stateId) 
			&& !this.isStateRestrict(stateId)
		);
	}

	return Stahl.StateReaddable.Game_Battler_isStateAddable.call(this, stateId);
};