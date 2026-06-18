//=============================================================================
// KOFFIN_StateDropRateModifier.js
//=============================================================================
/*:
 * @plugindesc (v1.0) Allows states to modify enemy drop rates from default rates or YEP_ExtraEnemyDrops.
 * @author KoffinKrypt
 *
 * @help
 * ============================================================================
 * Description
 * ============================================================================
 * This plugin adds notetags to states that can increase or decrease the drop
 * rates of items from YEP_ExtraEnemyDrops when an enemy dies with that state.
 * 
 * The drop rate modification is applied based on the enemy's states at the
 * moment of death (before rewards are calculated).
 *
 * ============================================================================
 * State Notetags
 * ============================================================================
 *
 * <DropRate: x%>
 * Multiplies the drop rate of all items from this enemy by x%.
 * Example: <DropRate: 200%> will double drop rates (50% becomes 100%)
 *          <DropRate: 50%> will halve drop rates (50% becomes 25%)
 *
 * <DropRateItem: id, x%>
 * Multiplies the drop rate for a specific item ID by x%.
 * Example: <DropRateItem: 5, 200%> - Doubles drop rate for item ID 5
 *
 * <DropRateWeapon: id, x%>
 * Multiplies the drop rate for a specific weapon ID by x%.
 * Example: <DropRateWeapon: 2, 150%> - 1.5x drop rate for weapon ID 2
 *
 * <DropRateArmor: id, x%>
 * Multiplies the drop rate for a specific armor ID by x%.
 * Example: <DropRateArmor: 3, 75%> - 0.75x drop rate for armor ID 3
 *
 * ============================================================================
 * Enemy Notetags (Optional)
 * ============================================================================
 *
 * <DisableDropRateModifiers>
 * Prevents any drop rate modifiers from affecting this enemy's drops.
 *
 * ============================================================================
 * Console Logging
 * ============================================================================
 *
 * When an enemy dies and has drop rate modifiers, the console will log:
 *
 * [DropRate] Enemy Name
 * [DropRate] Drops:
 * [DropRate]   Tofu (Item 1): 50% -> 100%
 * [DropRate]   Beach Ball (Weapon 2): 30% -> 60%
 * [DropRate]   Bracelet (Armor 3): 25% -> 12.5%
 *
 * ============================================================================
 * Plugin Compatibility
 * ============================================================================
 *
 * Place this plugin:
 * at the of the plugin list, but also
 * - Below YEP_ExtraEnemyDrops.js
 * - Below KOFFIN_BetterEnemySystem.js (if using it, which you should)
 *
 * ============================================================================
 */
 
(function() {
    "use strict";
    
    //=========================================================================
    // Parameter Variables
    //=========================================================================
    
    var parameters = PluginManager.parameters('KOFFIN_StateDropRateModifier');
    
    //=========================================================================
    // DataManager - Process State Notetags
    //=========================================================================
    
    var _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function() {
        if (!_DataManager_isDatabaseLoaded.call(this)) return false;
        if (!this._loaded_StateDropRateModifier) {
            this.processStateDropRateNotetags($dataStates);
            this.processEnemyDropRateNotetags($dataEnemies);
            this._loaded_StateDropRateModifier = true;
        }
        return true;
    };
    
    // Process state notetags for drop rate modifiers
    DataManager.processStateDropRateNotetags = function(group) {
        for (var i = 1; i < group.length; i++) {
            var state = group[i];
            if (!state) continue;
            
            // Initialize drop rate data
            state.dropRateModifier = {
                global: 1.0,           // Global multiplier
                items: {},              // Item-specific multipliers { id: multiplier }
                weapons: {},           // Weapon-specific multipliers
                armors: {}             // Armor-specific multipliers
            };
            
            var notedata = state.note.split(/[\r\n]+/);
            
            for (var j = 0; j < notedata.length; j++) {
                var line = notedata[j];
                
                // Global drop rate modifier
                var globalMatch = line.match(/<DropRate:\s*(\d+)%>/i);
                if (globalMatch) {
                    var rate = parseFloat(globalMatch[1]) / 100;
                    state.dropRateModifier.global = rate;
                    continue;
                }
                
                // Item-specific modifier
                var itemMatch = line.match(/<DropRateItem:\s*(\d+),\s*(\d+)%>/i);
                if (itemMatch) {
                    var itemId = parseInt(itemMatch[1]);
                    var itemRate = parseFloat(itemMatch[2]) / 100;
                    state.dropRateModifier.items[itemId] = itemRate;
                    continue;
                }
                
                // Weapon-specific modifier
                var weaponMatch = line.match(/<DropRateWeapon:\s*(\d+),\s*(\d+)%>/i);
                if (weaponMatch) {
                    var weaponId = parseInt(weaponMatch[1]);
                    var weaponRate = parseFloat(weaponMatch[2]) / 100;
                    state.dropRateModifier.weapons[weaponId] = weaponRate;
                    continue;
                }
                
                // Armor-specific modifier
                var armorMatch = line.match(/<DropRateArmor:\s*(\d+),\s*(\d+)%>/i);
                if (armorMatch) {
                    var armorId = parseInt(armorMatch[1]);
                    var armorRate = parseFloat(armorMatch[2]) / 100;
                    state.dropRateModifier.armors[armorId] = armorRate;
                    continue;
                }
            }
        }
    };
    
    // Process enemy notetags for disabling drop rate modifiers
    DataManager.processEnemyDropRateNotetags = function(group) {
        for (var i = 1; i < group.length; i++) {
            var enemy = group[i];
            if (!enemy) continue;
            
            enemy.disableDropRateModifiers = false;
            
            var notedata = enemy.note.split(/[\r\n]+/);
            for (var j = 0; j < notedata.length; j++) {
                var line = notedata[j];
                if (line.match(/<DisableDropRateModifiers>/i)) {
                    enemy.disableDropRateModifiers = true;
                    break;
                }
            }
        }
    };
    
    //=========================================================================
    // Game_Enemy - Drop Rate Modification
    //=========================================================================
    
    // Store death states for drop rate calculation
    var _Game_Enemy_die = Game_Enemy.prototype.die;
    Game_Enemy.prototype.die = function() {
        // Store the states at time of death for drop rate calculation
        this._deathStates = this._states.slice();
        _Game_Enemy_die.call(this);
    };
    
    // Get the combined drop rate multiplier from death states
    Game_Enemy.prototype.getDropRateMultiplier = function(dropType, dropId) {
        var enemyData = this.enemy();
        
        // Check if enemy disables drop rate modifiers
        if (enemyData.disableDropRateModifiers) {
            return 1.0;
        }
        
        var multiplier = 1.0;
        var deathStates = this._deathStates || [];
        
        // Check each state the enemy had at death
        for (var i = 0; i < deathStates.length; i++) {
            var stateId = deathStates[i];
            var state = $dataStates[stateId];
            if (!state || !state.dropRateModifier) continue;
            
            var mod = state.dropRateModifier;
            
            // Apply global multiplier
            multiplier *= mod.global;
            
            // Apply type-specific multiplier
            if (dropType === 'item' && mod.items[dropId]) {
                multiplier *= mod.items[dropId];
            } else if (dropType === 'weapon' && mod.weapons[dropId]) {
                multiplier *= mod.weapons[dropId];
            } else if (dropType === 'armor' && mod.armors[dropId]) {
                multiplier *= mod.armors[dropId];
            }
        }
        
        return multiplier;
    };
    
    // Get the modified drop rate for a specific drop
    Game_Enemy.prototype.getModifiedDropRate = function(dropItem, originalRate) {
        var dropType = '';
        var dropId = 0;
        
        switch (dropItem.kind) {
            case 1:
                dropType = 'item';
                dropId = dropItem.dataId;
                break;
            case 2:
                dropType = 'weapon';
                dropId = dropItem.dataId;
                break;
            case 3:
                dropType = 'armor';
                dropId = dropItem.dataId;
                break;
            default:
                return originalRate;
        }
        
        var multiplier = this.getDropRateMultiplier(dropType, dropId);
        var modifiedRate = Math.min(originalRate * multiplier, 1.0);
        
        return modifiedRate;
    };
    
    // Helper to get item name for logging
    function getDropItemName(item, kind) {
        if (kind === 1) {
            var dataItem = $dataItems[item.dataId];
            return dataItem ? dataItem.name : 'Unknown Item';
        } else if (kind === 2) {
            var dataWeapon = $dataWeapons[item.dataId];
            return dataWeapon ? dataWeapon.name : 'Unknown Weapon';
        } else if (kind === 3) {
            var dataArmor = $dataArmors[item.dataId];
            return dataArmor ? dataArmor.name : 'Unknown Armor';
        }
        return 'Unknown';
    }
    
    function getDropTypeName(kind) {
        if (kind === 1) return 'Item';
        if (kind === 2) return 'Weapon';
        if (kind === 3) return 'Armor';
        return 'Unknown';
    }
    
    // Override makeDropItems to apply modified rates
    var _Game_Enemy_makeDropItems = Game_Enemy.prototype.makeDropItems;
    Game_Enemy.prototype.makeDropItems = function() {
        // Store original rates for logging
        this._dropRateLog = [];
        
        // Get base drops (from original method)
        var drops = _Game_Enemy_makeDropItems.call(this);
        
        // Also get conditional drops if they exist (YEP_ExtraEnemyDrops)
        if (typeof this.makeConditionalDropItems === 'function') {
            var conditionalDrops = this.makeConditionalDropItems();
            drops = drops.concat(conditionalDrops);
        }
        
        // Now filter drops based on modified rates
        var finalDrops = [];
        var enemyData = this.enemy();
        
        // Process standard drop items (from the enemy's dropItems array)
        if (enemyData.dropItems && enemyData.dropItems.length > 0) {
            for (var i = 0; i < enemyData.dropItems.length; i++) {
                var dropItem = enemyData.dropItems[i];
                var originalRate = 1 / dropItem.denominator;
                var modifiedRate = this.getModifiedDropRate(dropItem, originalRate);
                
                // Log the rate change
                var itemName = getDropItemName(dropItem, dropItem.kind);
                var typeName = getDropTypeName(dropItem.kind);
                this._dropRateLog.push({
                    name: itemName,
                    type: typeName,
                    id: dropItem.dataId,
                    originalRate: originalRate,
                    modifiedRate: modifiedRate,
                    dropped: false
                });
                
                // Check if the drop occurs
                if (Math.random() < modifiedRate) {
                    var item = null;
                    switch (dropItem.kind) {
                        case 1: item = $dataItems[dropItem.dataId]; break;
                        case 2: item = $dataWeapons[dropItem.dataId]; break;
                        case 3: item = $dataArmors[dropItem.dataId]; break;
                    }
                    if (item) {
                        finalDrops.push(item);
                        this._dropRateLog[this._dropRateLog.length - 1].dropped = true;
                    }
                }
            }
        }
        
        // Handle conditional drops separately (they already have their own rate logic)
        // But we still want to log them if possible
        if (enemyData.conditionalDropItems && enemyData.conditionalDropItems.length > 0) {
            // Conditional drops are already processed in makeConditionalDropItems
            // We need to capture those drops that were added
            for (var j = 0; j < enemyData.conditionalDropItems.length; j++) {
                var condData = enemyData.conditionalDropItems[j];
                var condItem = condData[0];
                
                // Check if this item is already in finalDrops
                var alreadyDropped = false;
                for (var k = 0; k < finalDrops.length; k++) {
                    if (finalDrops[k] === condItem) {
                        alreadyDropped = true;
                        break;
                    }
                }
                
                if (!alreadyDropped) {
                    // We need to determine if this conditional drop should be affected
                    // For now, we'll add it to the log without that shit
                    // since conditional drops use a different mechanism
                    var condType = '';
                    var condId = 0;
                    if ($dataItems.contains(condItem)) {
                        condType = 'Item';
                        condId = condItem.id;
                    } else if ($dataWeapons.contains(condItem)) {
                        condType = 'Weapon';
                        condId = condItem.id;
                    } else if ($dataArmors.contains(condItem)) {
                        condType = 'Armor';
                        condId = condItem.id;
                    }
                    
                    this._dropRateLog.push({
                        name: condItem.name,
                        type: condType,
                        id: condId,
                        originalRate: 'Conditional',
                        modifiedRate: 'Conditional',
                        dropped: false
                    });
                }
            }
        }
        
        // Output console log
        this.logDropRates();
        
        return finalDrops;
    };
    
    // Log drop rates to console
    Game_Enemy.prototype.logDropRates = function() {
        if (!this._dropRateLog || this._dropRateLog.length === 0) return;
        
        var hasModifiers = false;
        for (var i = 0; i < this._dropRateLog.length; i++) {
            var log = this._dropRateLog[i];
            if (typeof log.originalRate === 'number' && 
                Math.abs(log.originalRate - log.modifiedRate) > 0.001) {
                hasModifiers = true;
                break;
            }
        }
        
        // Only log if there are actual modifiers or if there are drops
        if (!hasModifiers && this._dropRateLog.length === 0) return;
        
        console.log('[DropRate] ' + this.name());
        console.log('[DropRate] Drops:');
        
        for (var j = 0; j < this._dropRateLog.length; j++) {
            var logEntry = this._dropRateLog[j];
            
            if (typeof logEntry.originalRate === 'number') {
                var originalPercent = (logEntry.originalRate * 100).toFixed(1);
                var modifiedPercent = (logEntry.modifiedRate * 100).toFixed(1);
                var droppedText = logEntry.dropped ? ' [DROPPED]' : '';
                
                if (originalPercent !== modifiedPercent) {
                    console.log('[DropRate]   ' + logEntry.name + ' (' + logEntry.type + ' ' + logEntry.id + '): ' + 
                                originalPercent + '% -> ' + modifiedPercent + '%' + droppedText);
                } else {
                    console.log('[DropRate]   ' + logEntry.name + ' (' + logEntry.type + ' ' + logEntry.id + '): ' + 
                                originalPercent + '% (unchanged)' + droppedText);
                }
            } else {
                console.log('[DropRate]   ' + logEntry.name + ' (' + logEntry.type + ' ' + logEntry.id + '): ' + 
                            logEntry.originalRate + ' (conditional)');
            }
        }
    };
    
    //=========================================================================
    // Compatibility with BetterEnemySystem system
    //=========================================================================
    
    // If BetterEnemySystem is present, make sure drop rate modifiers work alongside it
    if (typeof Game_Enemy.prototype.doDropChance === 'function') {
        // Store original drop rate calculation for compatibility
        var _Game_Enemy_getIndividualDropMultiplier = Game_Enemy.prototype.getIndividualDropMultiplier;
        if (!_Game_Enemy_getIndividualDropMultiplier) {
            Game_Enemy.prototype.getIndividualDropMultiplier = function() {
                // This is called from BetterEnemySystem's dropItemRate
                // We'll return the global drop rate multiplier
                return this.getDropRateMultiplier('global', 0);
            };
        }
    }
    
    console.log("KOFFIN_StateDropRateModifier plugin loaded.");
    
})();