/*:
 * @plugindesc Fixes sprite changes from states so that they properly inherit 
 * notetag values based on priority. Also adds a new notetag to adjust animation speed.
 * @author KoffinKrypt
 *
 * @help
 * ============================================================================
 * Overview
 * ============================================================================
 * This plugin fixes an issue in OMORI where portrait changes from states 
 * (using <StateFaceIndex>, <StateBackIndex>, and <StateListIndex>) would be 
 * incorrectly reset to 0 if a higher-priority state lacked a notetag.
 *
 * Now, the game will check all active states, prioritizing the highest-priority 
 * one that actually defines a value. This ensures that a lower-priority state 
 * with a valid notetag is not ignored when a higher-priority state does not 
 * provide a value.
 *
 * ============================================================================
 * New Feature: Animation Speed Control
 * ============================================================================
 * This plugin introduces a new notetag that allows states to modify the
 * animation speed of actor portraits and enemy sprites.
 *
 * Use the following notetag inside a state:
 *
 *   <StateAnimationDelay: X>
 *
 * Where "X" is the number of frames per update. Lower values make the animation
 * faster, and higher values make it slower. The default value is 12.
 * 
 * If the battler has multiple states with this notetag, the first one found will 
 * take effect. When the state is removed, the animation speed returns to normal.
 *
 * ============================================================================
 * Features
 * ============================================================================
 * - Ensures that states with defined notetags take priority.
 * - Prevents missing notetags from overriding existing valid ones.
 * - Only resets indexes to 0 when no states have the corresponding notetag.
 * - Allows changing a specific part of the battle sprites using a higher-priority
 *   state.
 * - NEW: Allows states to modify the animation speed of portraits and enemy sprites.
 *
 */



//=============================================================================
// * Status Face Index
//=============================================================================
Game_Actor.prototype.statusFaceIndex = function () {
  // Optional: Preserve any special conditions first
  if (!!$gameTemp._secondChance && this.actorId() === 1) { return 3; }
  if (!!$gameTemp._damagedPlayer) { return 2; }
  if (this._useVictoryFace && this.isAlive()) { return 10; }
  
  // Loop through all states to see if any provide a StateFaceIndex
  var states = this.states();
  for (var i = 0; i < states.length; i++) {
    if (states[i].meta.StateFaceIndex) {
      return Number(states[i].meta.StateFaceIndex);
    }
  }
  
  // Additional check: use FearBattleFaceIndex if applicable
  const fearIndex = this.actor().meta.FearBattleFaceIndex;
  if (fearIndex && $gameSwitches.value(92)) {
    return Number(fearIndex);
  }
  return 0;
};

//=============================================================================
// * Status Back Index
//=============================================================================
Game_Actor.prototype.statusBackIndex = function () {
  var states = this.states();
  for (var i = 0; i < states.length; i++) {
    if (states[i].meta.StateBackIndex) {
      return Number(states[i].meta.StateBackIndex);
    }
  }
  return 0;
};

//=============================================================================
// * Status List Index
//=============================================================================
Game_Actor.prototype.statusListIndex = function () {
  var states = this.states();
  // Example: Check for a world-specific notetag first
  var worldIndex = SceneManager.currentWorldIndex();
  var worldTag = 'World_' + worldIndex + '_StateListIndex';
  for (var i = 0; i < states.length; i++) {
    if (states[i].meta[worldTag]) {
      return Number(states[i].meta[worldTag]);
    } else if (states[i].meta.StateListIndex) {
      return Number(states[i].meta.StateListIndex);
    }
  }
  return 0;
};


Sprite_OmoMenuStatusFace.prototype.defaultDelay = function() {
  // Start with the default value
  var delay = 12;
  
  // Check if an actor is associated with this face
  if (this.actor && typeof this.actor.states === 'function') {
    var states = this.actor.states();
    
    // Check if any active state has <StateAnimationDelay: X>
    for (var i = 0; i < states.length; i++) {
      if (states[i].meta.StateAnimationDelay) {
        return Number(states[i].meta.StateAnimationDelay);
      }
    }
  }
  
  return delay; // Default speed if no custom speed is found
};

Sprite_Enemy.prototype.motionSpeed = function() {
    var motionName = this._motionName;

    if (this._enemy.isSideviewBattler()) {
        // Check if any active state has <StateAnimationDelay: X>
        var states = this._enemy.states();
        for (var i = 0; i < states.length; i++) {
            if (states[i].meta.StateAnimationDelay) {
                return Number(states[i].meta.StateAnimationDelay);
            }
        }

        // Fall back to the standard method
        return this._enemy.getSideviewSpeed(motionName);
    }

    return 12; // Default speed if no custom speed is found
};
