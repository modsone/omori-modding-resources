//=============================================================================
// State Addon for State Resist Chance - By DraconicZ
// DRZ_StateResistChance_StateEdition.js
//=============================================================================

var Imported = Imported || {};
Imported.DRZ_StateResistChance_StateEdition = true;

var DRZ = DRZ || {};
DRZ.StateResistChance_StateEdition = DRZ.StateResistChance_StateEdition || {};

//=============================================================================
 /*:
 * @plugindesc Allows states to provide resistance to specific other states.
 * @author DraconicZ
 * 
 * @help
 * Heavily based on KOFFIN_StateResistChance, and is compatible with it.
 * Allows states themselves to provide state resistances via state notetags.
 * Notetag examples:
 * <state5: 50>  # 50% resistance to state with ID 5
 * <timestop: 100> # 100% resistance to the state named "timestop"
 * 
 * How it works:
 * - Use <stateX: Y> in the state's notetags, where X is the state's ID, and Y is the resistance percentage (0-100).
 * - Alternatively, use <stateName: Y>, where stateName is the exact name of the state.
 * - Resistance is applied when a skill or item tries to inflict the state on an enemy who has the state granting resistance.
 * - Resistance ranges from 0 (always applies) to 100 (never applies).
 * 
 * Unlike the inbuilt STATUS RESIST, giving a battler the resistance-granting status
 * will not immediately remove the resisted status if they already have it.
 * 
 * Useful for providing immunity that prevents application, but does not cure
 * the status if they already have it.
 * 
 * Credit to KoffinKrypt for basically the whole plugin; I only did some head-scratching
 * and rewriting to make the system apply to status notetages instead of enemy notetags.
 */
//=============================================================================

// Helper function to parse state notetags for state resistances
function getStateResistancesFromState(resistingStateId) {
    let stateResistances = {};
    const resistingState = $dataStates[resistingStateId];
    const note = resistingState.note;
    const stateRegex = /<state(\d+):\s*(\d+)>/gi;
    const nameRegex = /<([a-zA-Z]+):\s*(\d+)>/gi;

    let match;
    // Parse state ID-based resistances
    while ((match = stateRegex.exec(note)) !== null) {
        const stateId = Number(match[1]);
        const resistance = Math.min(Math.max(Number(match[2]), 0), 100);
        stateResistances[stateId] = resistance;
    }

    // Parse state name-based resistances
    while ((match = nameRegex.exec(note)) !== null) {
        const stateName = match[1].toLowerCase();
        const resistance = Math.min(Math.max(Number(match[2]), 0), 100);
        stateResistances[stateName] = resistance;
    }

    return stateResistances;
}

// Helper function to get an battler's state resistances based on the states it has
function getGrantedStateResistances(battler) {
    let grantedStateResistances = {};

    battler._states.forEach((stateId) => {
        Object.assign(grantedStateResistances, getStateResistancesFromState(stateId))
    });

    return grantedStateResistances;
}

DRZ.StateResistChance_StateEdition.Game_Action_testApply = Game_Action.prototype.testApply;
Game_Action.prototype.testApply = function(target) {
    const item = this.item();
    const states = item.effects.filter(effect => effect.code === Game_Action.EFFECT_ADD_STATE);
    const resistances = getGrantedStateResistances(target);

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

    return DRZ.StateResistChance_StateEdition.Game_Action_testApply.call(this, target);
};

if (Game_Battler.prototype.addState) {
    DRZ.StateResistChance_StateEdition.Game_Battler_addState = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function(stateId) {
        const resistances = getGrantedStateResistances(this);
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

        DRZ.StateResistChance_StateEdition.Game_Battler_addState.call(this, stateId);
    };
}