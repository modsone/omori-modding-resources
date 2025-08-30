/*:
 * @plugindesc 
 * Allows enemies to have resistances to specific states using notetags.
 * @author KoffinKrypt
 * 
 * @help This plugin enables you to define state resistances for enemies via notetags in the database.
 * Notetag examples:
 * <state5: 50>  # 50% resistance to state with ID 5
 * <poison: 100> # 100% resistance to the state named "poison"
 * 
 * How it works:
 * - Use <stateX: Y> in the enemy's notetags, where X is the state's ID, and Y is the resistance percentage (0-100).
 * - Alternatively, use <stateName: Y>, where stateName is the exact name of the state.
 * - Resistance is applied when a skill or item tries to inflict the state on the enemy.
 * - Resistance ranges from 0 (always applies) to 100 (never applies).
 * 
 * Terms of Use:
 * Credit is appreciated (stop stealing my shit)
 */

(function() {

    // Helper function to parse enemy notetags for state resistances
    function getStateResistances(enemy) {
        if (!enemy._stateResistances) {
            enemy._stateResistances = {};
            const note = enemy.note;
            const stateRegex = /<state(\d+):\s*(\d+)>/gi;
            const nameRegex = /<([a-zA-Z]+):\s*(\d+)>/gi;

            let match;
            // Parse state ID-based resistances
            while ((match = stateRegex.exec(note)) !== null) {
                const stateId = Number(match[1]);
                const resistance = Math.min(Math.max(Number(match[2]), 0), 100);
                enemy._stateResistances[stateId] = resistance;
            }

            // Parse state name-based resistances
            while ((match = nameRegex.exec(note)) !== null) {
                const stateName = match[1].toLowerCase();
                const resistance = Math.min(Math.max(Number(match[2]), 0), 100);
                enemy._stateResistances[stateName] = resistance;
            }
        }
        return enemy._stateResistances;
    }

    // Override Game_Action's testApply to account for state resistance
    const _Game_Action_testApply = Game_Action.prototype.testApply;
    Game_Action.prototype.testApply = function(target) {
        if (target.isEnemy()) {
            const item = this.item();
            const states = item.effects.filter(effect => effect.code === Game_Action.EFFECT_ADD_STATE);
            const resistances = getStateResistances(target.enemy());

            for (const effect of states) {
                const stateId = effect.dataId;
                const state = $dataStates[stateId];

                // Check resistance by ID
                if (resistances[stateId] !== undefined) {
                    const resistChance = resistances[stateId];
                    if (Math.random() * 100 < resistChance) {
                        return false; // State resisted
                    }
                }

                // Check resistance by name
                if (resistances[state.name.toLowerCase()] !== undefined) {
                    const resistChance = resistances[state.name.toLowerCase()];
                    if (Math.random() * 100 < resistChance) {
                        return false; // State resisted
                    }
                }
            }
        }

        return _Game_Action_testApply.call(this, target);
    };

    // Hook into Yanfly's Action Sequences for state resistance handling
    if (Game_Battler.prototype.addState) {
        const _Game_Battler_addState = Game_Battler.prototype.addState;
        Game_Battler.prototype.addState = function(stateId) {
            if (this.isEnemy()) {
                const resistances = getStateResistances(this.enemy());
                const state = $dataStates[stateId];

                // Check resistance by ID
                if (resistances[stateId] !== undefined) {
                    const resistChance = resistances[stateId];
                    if (Math.random() * 100 < resistChance) {
                        return; // State resisted
                    }
                }

                // Check resistance by name
                if (resistances[state.name.toLowerCase()] !== undefined) {
                    const resistChance = resistances[state.name.toLowerCase()];
                    if (Math.random() * 100 < resistChance) {
                        return; // State resisted
                    }
                }
            }

            _Game_Battler_addState.call(this, stateId);
        };
    }

})();
