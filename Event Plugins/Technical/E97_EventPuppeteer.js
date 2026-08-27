/*:
 * @author Eggshell97
 * @plugindesc Modified version of EventHijack to let several events mimic player's movement.
 *
 * @help
 * Do not combine with EventHijack. It probably will not work.
 * Does not work on events with hitbox size increases.
 * 
 * By adding <Puppet Channel: #> to an event, you can make it into a puppet.
 * Puppets will move almost exactly as the player does, with speed as the main exception.
 * Setting an event's speed to 4 will make it move almost seamlessly with the player.
 * 
 * Puppets will only move when the conditions are met.
 * Firstly, $gamePlayer._puppetChannel must match the puppet's channel.
 * This can be set in any script like this:
 * $gamePlayer._puppetChannel = 1;
 * Or like this:
 * $gamePlayer._puppetChannel = [1,2,3];
 * The latter will allow the player to control all three of the listed channels at once.
 * 
 * Second, you need to run this script anywhere:
 * $gamePlayer._puppetingEvents = true;
 * This can be set to false the same way to disable the effect.
 * 
 * These do not reset between maps, so be careful.
 * May add notetags for event actions to happen when an event is puppeted sometime later.
*/

// Calls listing function during map load
const old_sceneMapOnMapLoaded = Scene_Map.prototype.onMapLoaded;

Scene_Map.prototype.onMapLoaded = function() {
	$gameMap.refreshPuppetList();
	old_sceneMapOnMapLoaded.call(this);
}

// Refreshes the list of events that can act as puppets
// This function is modified from MassMovementRoutes
Game_Map.prototype.refreshPuppetList = function() {
	this._puppetChannels = [];
	$dataMap.events.forEach(event => {
		if (event) {
			if (event.meta['Puppet Channel']) {
				if (Array.isArray($gameMap._puppetChannels[parseInt(event.meta['Puppet Channel'])])) {
					$gameMap._puppetChannels[parseInt(event.meta['Puppet Channel'])].push(event.id);
				} else {
					$gameMap._puppetChannels[parseInt(event.meta['Puppet Channel'])] = [event.id];
				}
			}
		}
	});
}

// Calls the event version of the function when the player one is called
const old_playerMoveByInput = Game_Player.prototype.moveByInput;

Game_Player.prototype.moveByInput = function() {
	old_playerMoveByInput.call(this);
	this.movePuppets();
}

// Modified function from EventHijack, which was a modified version of the gamePlayer function
Game_Event.prototype.moveByInput = function() {
	if ($gamePlayer._puppetingEvents) {
		if (!this.isMoving() && this.canMove()) {
			var direction = $gamePlayer.getInputDirection();
			if (direction > 0) {
				$gameTemp.clearDestination();
			} else if ($gameTemp.isDestinationValid()){
				var x = $gameTemp.destinationX();
				var y = $gameTemp.destinationY();
				direction = this.findDirectionTo(x, y);
			}
			if (direction > 0) {
				this.executeMove(direction);
			}
		}
	}
};

Game_Event.prototype.canMove = function() {
    if ($gameMap.isEventRunning() || $gameMessage.isBusy()) {
        return false;
    }
    if (this.isMoveRouteForcing()) {
        return false;
    }
    return true;
};

Game_Event.prototype.executeMove = function(direction) {
    this.moveStraight(direction);
};

// Moves the puppet events
Game_Player.prototype.movePuppets = function() {
	if (this._puppetChannel) {
		if (Array.isArray(this._puppetChannel)) {
			this._puppetChannel.forEach(channel => {
				$gameMap._puppetChannels[channel].forEach(eventId => {
					$gameMap.event(eventId).moveByInput();
				});
			});
		} else {
			$gameMap._puppetChannels[this._puppetChannel].forEach(eventId => {
				$gameMap.event(eventId).moveByInput();
			});
		}
	}
}