//=============================================================================
// Stahl Plugin - State Dependency
// Stahl_StateDependency.js    VERSION 1.0.1
//=============================================================================

var Imported = Imported || {};
Imported.Stahl_StateDependency = true;

var Stahl = Stahl || {};
Stahl.StateDependency = Stahl.StateDependency || {};

//=============================================================================
 /*:
 * @plugindesc v1.0.1 Makes state requires other state to exist before being addable.
 * @author ReynStahl
 * @help
 * On States notes:
 * 
 * <StateDependency:Number>
 * Number - ID of State
 * State requires the battler to be already affected with specified state
 * 
 * <NoStateDependency:Number>
 * Number - ID of State
 * State requires the battler to be NOT be affected with specified state
 * 
 * <StateCategoryDependency:String>
 * String - Name of state category, without quotation marks
 * State requires the battler to be already affected with any state in the category
 * 
 * <NoStateCategoryDependency:String>
 * String - Name of state category, without quotation marks
 * State requires the battler to be NOT be affected with any state in the category
 * 
 * <Category: BLOCKEMOTION>
 * Blocks from adding or changing emotion
 * 
 * <Category: BLOCKNEUTRAL>
 * Blocks from removing emotion (Setting to neutral).
 * 
 * Dependencies:
 * YEP_X_StateCategories - for StateCategoryDependency
 */
//=============================================================================

var Imported = Imported || {};
Imported.Stahl_StateDependency= true;

var Stahl = Stahl || {};
Stahl.StateDependency = Stahl.StateDependency || {};

Stahl.StateDependency.Game_Battler_isStateAddable = Game_Battler.prototype.isStateAddable;
Game_Battler.prototype.isStateAddable = function(stateId) {
	let result = Stahl.StateDependency.Game_Battler_isStateAddable.call(this, stateId);
	// if result was true, check more condition (All of these narrows down)
	if (result) {
		const data = $dataStates[stateId];
		// If state is as an emotion and battler is blocking emotion, then it is not addable.
		if (data.category.contains("EMOTION") && this.isStateCategoryAffected("BLOCKEMOTION")) {
			return false;
		}
		if (data.meta.StateDependency) {
			const dep = Number(data.meta.StateDependency);
			result = result && this.isStateAffected(dep);
		};
		if (data.meta.NoStateDependency) {
			const dep = Number(data.meta.NoStateDependency);
			result = result && !this.isStateAffected(dep);
		};
		if (data.meta.StateCategoryDependency) {
			const dep = data.meta.StateCategoryDependency;
			result = result && this.isStateCategoryAffected(dep);
		};
		if (data.meta.NoStateCategoryDependency) {
			const dep = data.meta.NoStateCategoryDependency;
			result = result && !this.isStateCategoryAffected(dep);
		};
	}
	return result;
};

Stahl.StateDependency.Game_Battler_removeState = Game_Battler.prototype.removeState;
Game_Battler.prototype.removeState = function(stateId) {
	let data = $dataStates[stateId];
	// If state is as an emotion and battler is blocking neutral, do not remove it.
	if (data && data.category && data.category.contains("EMOTION") && this.isStateCategoryAffected("BLOCKNEUTRAL")) {
		return;
	}
	Stahl.StateDependency.Game_Battler_removeState.call(this, stateId);
};

Stahl.StateDependency.Game_Battler_isStateResist = Game_Battler.prototype.isStateResist;
Game_Battler.prototype.isStateResist = function(stateId) {
	let data = $dataStates[stateId];
	// If state is as an emotion and battler is blocking neutral, do not remove it.
	if (data && data.category && data.category.contains("EMOTION") && this.isStateCategoryAffected("BLOCKEMOTION")) {
		return true;
	}
	return Stahl.StateDependency.Game_Battler_isStateResist.call(this, stateId);
};

Stahl.StateDependency.Game_Battler_removeBattleStates = Game_Battler.prototype.removeBattleStates;
Game_Battler.prototype.removeBattleStates = function() {
	Stahl.StateDependency.Game_Battler_removeBattleStates.call(this);
	// Check remove again, in case there's some states that didn't get removed due to locking.
    this.states().forEach(function(state) {
        if (state && state.removeAtBattleEnd) {
			// Old remove state function - Does not obey the state dependency.
            Stahl.StateDependency.Game_Battler_removeState.call(this, state.id);
        }
    }, this);
};