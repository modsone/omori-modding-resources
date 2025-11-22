/*:
 * @plugindesc v1.2 Adjusts state durations and rates based on enemy notetags <StateDuration: X%> and <StateRates: X%>. 
 * @author KoffinKrypt
 *
 * @param Affected States
 * @type state[]
 * @desc List of state IDs whose durations and rates can be modified by the plugin.
 * @default []
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * This plugin modifies the duration and rates of specific states based on an
 * enemy's notetags:
 *
 * - <StateDuration: X%>: Adjusts state duration by X%.
 * - <StateRates: X%>: Adjusts the effects of a state by X%.
 *
 * Examples:
 * - <StateDuration: 50%>: Halves the duration of affected states.
 * - <StateRates: 200%>: Doubles the effects of affected states.
 *
 * ============================================================================
 * Plugin Parameters
 * ============================================================================
 * - Affected States: Select the state IDs to be affected by the plugin.
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 * Credit is appreciated (don't steal this).
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * Version 1.2:
 * - Fixed <StateRates: X%> to adjust proportionally around 100%.
 * Version 1.1:
 * - Added support for <StateRates: X%>.
 * Version 1.0:
 * - Initial release!
 */

var Imported = Imported || {};
Imported.KOFFIN_StateDurationMultiplier = true;

var Koffin = Koffin || {};
Koffin.SDM = Koffin.SDM || {};
Koffin.SDM.version = 1.2;

//=============================================================================
// Parameter Variables
//=============================================================================
Koffin.Parameters = PluginManager.parameters('KOFFIN_StateDurationMultiplier');
Koffin.Param = Koffin.Param || {};

Koffin.Param.AffectedStates = JSON.parse(Koffin.Parameters['Affected States'] || '[]').map(Number);

//=============================================================================
// DataManager
//=============================================================================
DataManager.KOFFIN_SDM_processEnemyNotetag = function(group) {
    const durationRegex = /<StateDuration:\s*(\d+)%>/i;
    const ratesRegex = /<StateRates:\s*(\d+)%>/i;
    for (let i = 1; i < group.length; i++) {
        const obj = group[i];
        obj.stateDurationMultiplier = 1.0; // Default duration multiplier
        obj.stateRateMultiplier = 1.0; // Default rate multiplier
        if (!obj.note) continue;

        const durationMatch = obj.note.match(durationRegex);
        if (durationMatch) {
            obj.stateDurationMultiplier = parseFloat(durationMatch[1]) / 100;
        }

        const ratesMatch = obj.note.match(ratesRegex);
        if (ratesMatch) {
            obj.stateRateMultiplier = parseFloat(ratesMatch[1]) / 100;
        }
    }
};

const KOFFIN_SDM_DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
    if (!KOFFIN_SDM_DataManager_isDatabaseLoaded.call(this)) return false;

    if (!DataManager._koffinSDMNotetagsLoaded) {
        this.KOFFIN_SDM_processEnemyNotetag($dataEnemies);
        DataManager._koffinSDMNotetagsLoaded = true;
    }

    return true;
};

//=============================================================================
// Game_Battler
//=============================================================================
const KOFFIN_SDM_Game_Battler_addState = Game_Battler.prototype.addState;
Game_Battler.prototype.addState = function(stateId) {
    KOFFIN_SDM_Game_Battler_addState.call(this, stateId);

    if (this.isEnemy()) {
        const enemy = $dataEnemies[this._enemyId];
        const durationMultiplier = enemy.stateDurationMultiplier || 1.0;
        const rateMultiplier = enemy.stateRateMultiplier || 1.0;

        // Adjust state duration
        if (Koffin.Param.AffectedStates.includes(stateId) && durationMultiplier !== 1.0) {
            const currentDuration = this._stateTurns[stateId] || 0;
            const newDuration = Math.max(1, Math.ceil(currentDuration * durationMultiplier));
            this._stateTurns[stateId] = newDuration;

            console.log(
                `[KOFFIN_SDM]: State ID ${stateId} duration adjusted: ${currentDuration} -> ${newDuration}`
            );
        }

        // Adjust state rates proportionally around 100%
        if (Koffin.Param.AffectedStates.includes(stateId) && rateMultiplier !== 1.0) {
            const state = $dataStates[stateId];
            if (state) {
                this.applyStateRateMultiplier(state, rateMultiplier);
            }
        }
    }
};

// Adjust state rate traits proportionally
Game_Battler.prototype.applyStateRateMultiplier = function(state, multiplier) {
    const rateProperties = ['traits']; // Handles all traits

    for (const property of rateProperties) {
        if (state[property]) {
            state[property] = state[property].map(trait => {
                if (trait && 'value' in trait) {
                    if (this.isExParameter(trait.code)) {
                        // Handle EX-parameters additively
                        trait.value *= multiplier;
                        console.log(
                            `[KOFFIN_SDM]: Adjusted EX-parameter (${trait.code}) value to ${trait.value}`
                        );
                    } else {
                        // Handle regular parameters proportionally
                        if (trait.value > 1) {
                            trait.value = 1 + ((trait.value - 1) * multiplier);
                        } else if (trait.value < 1) {
                            trait.value = 1 - ((1 - trait.value) * multiplier);
                        }
                        console.log(
                            `[KOFFIN_SDM]: Adjusted regular parameter (${trait.code}) value to ${trait.value}`
                        );
                    }
                }
                return trait;
            });
        }
    }
};

// Check if the trait code corresponds to an EX-parameter
Game_Battler.prototype.isExParameter = function(traitCode) {
    // RPG Maker MV's EX-parameters range from 0 to 9
    return traitCode === Game_BattlerBase.TRAIT_XPARAM;
};