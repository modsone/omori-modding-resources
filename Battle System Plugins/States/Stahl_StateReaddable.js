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

Game_Battler.prototype.isStateAddable = function(stateId) {
	var state = $dataStates[stateId];
	if (!state) return false;
	if (this.isAlive() || (state.category && state.category.contains('BYPASS DEATH REMOVAL'))) {
		return (!this.isStateResist(stateId) && !this.isStateRestrict(stateId));
	}
	return false;
};