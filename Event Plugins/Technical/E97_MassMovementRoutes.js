/*:
 * @author Eggshell97
 * @plugindesc Allows events to "lead" other events, causing them to mimic the leader's movement.
 *
 * @help
 * This plugin simultaneously doesn't behave the way I expect and behaves exactly the way I expect.
 * Feel free to ask me to update this if you need something added/adjusted/fixed.
 *
 * The notetags are <MMR Channel: #> and <MMR Leader: #> for events that mimic and events that lead, respectively.
 * Do not have both of these on the same event unless they are different channels
 * 
 * When an event with the leader tag is given a move route, all followers of the same channel will gain the same route.
 * Follower events will therefore attempt to move the entire route regardless of whether the leader is blocked.
 * Follower events cannot use Wait For Completion, but the leader event can.
 * 
 * 
 * Script calls:
 * 
 * $gameMap.event(#).pauseMMR(); // Temporarily disables the MMR Leader tag on that event, until map reload.
 * $gameMap.event(#).resumeMMR(); // Enables the MMR Leader tag after being paused.
 * $gameMap.event(#).unpauseMMR(); // Enables the MMR Leader tag after being paused.
*/

// Calls checkMMRList when a map is loaded
const old_sceneOnMapLoaded = Scene_Map.prototype.onMapLoaded;

Scene_Map.prototype.onMapLoaded = function() {
	$gameMap.refreshMMRList();
	old_sceneOnMapLoaded.call(this);
}

// Refreshes the list of MMR follower events
// The array stores an array of event IDs for each MMR channel it finds
Game_Map.prototype.refreshMMRList = function() {
	this._MMRChannels = [];
	$dataMap.events.forEach(event => {
		if (event) {
			if (event.meta['MMR Channel']) {
				if (Array.isArray($gameMap._MMRChannels[event.meta['MMR Channel']])) {
					$gameMap._MMRChannels[event.meta['MMR Channel']].push(event.id);
				} else {
					$gameMap._MMRChannels[event.meta['MMR Channel']] = [event.id];
				}
			}
		}
	});
}

// Distributes movement routes
const old_eventForceMoveRoute = Game_Event.prototype.forceMoveRoute;

Game_Event.prototype.forceMoveRoute = function(moveRoute) {
	old_eventForceMoveRoute.call(this, moveRoute);
	if ($dataMap.events[this.eventId()].meta['MMR Leader'] && !this._pauseMMR) {
		$gameMap._MMRChannels[$dataMap.events[this.eventId()].meta['MMR Leader']].forEach(eventId => {
			$gameMap.event(eventId).forceMoveRoute(moveRoute);
		});
	}
}

Game_Event.prototype.pauseMMR = function() {
	this._pauseMMR = true;
}

Game_Event.prototype.resumeMMR = function() {
	this._pauseMMR = false;
}

Game_Event.prototype.unpauseMMR = function() {
	this._pauseMMR = false;
}