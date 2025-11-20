/*:
 * @plugindesc [v1.0.0] Adds Functions to event related to checking distance and direction
 * 
 * @author ReynStahl
 *
 * @help
 * TBA
 */

var Imported = Imported || {};
Imported.Stahl_EventDistance = true;

var Stahl = Stahl || {};
Stahl.EventDistance = Stahl.EventDistance || {};

class Pos2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    rotateRightAngle(times) {
        switch(times % 4) {
            case 0: // [x, y] 0 deg
                break; 
            case 1: // [y, -x] 90 deg
                [this.x,this.y] = [this.y,-this.x];
                break; 
            case 2: // [-x, -y] 180 deg
                [this.x,this.y] = [-this.x,-this.y];
                break;
            case 3: // [-y, x] 270 deg
                [this.x,this.y] = [-this.y,this.x];
                break;
        }
    }

    rotateFromDirection(direction) {
        let times = 0; // Right; 0 deg
        if (direction == 2) times = 1; // Down; 90 deg
        if (direction == 4) times = 2; // Left; 180 deg
        if (direction == 8) times = 3; // Up; 270 deg
        this.rotateRightAngle(times);
    }

    angle() {
        return Math.atan(y/x);
    }

    inRange(min, max) {
        return min.x <= this.x && this.x <= max.x && min.y <= this.y && this.y <= max.y;
    }
}

// Remember positive Y is down
Game_Event.prototype.isFacedByPlayer = function() {
    return this.isFacedByEvent($gamePlayer);
}

Game_Event.prototype.isFacingAtPlayer = function() {
    return this.isFacingAtEvent($gamePlayer);
}

Game_Event.prototype.isFacedByEvent = function(event) {
    return (event.y < this.y && event.direction() == 2) // Above; face down
        || (event.x > this.x && event.direction() == 4) // Right; face left
        || (event.x < this.x && event.direction() == 6) // Left; face right
        || (event.y > this.y && event.direction() == 8); // Bottom; face up
}

Game_Event.prototype.isFacingAtEvent = function(event) {
    return (this.y < event.y && this.direction() == 2) // Above; face down
        || (this.x > event.x && this.direction() == 4) // Right; face left
        || (this.x < event.x && this.direction() == 6) // Left; face right
        || (this.y > event.y && this.direction() == 8); // Bottom; face up
}

// Base is facing right, if event face other direction swap accordingly.
// 2 corner of the square, the min is top left, the max is bottom right
Game_Event.prototype.isPlayerInRangeDirectional = function(minX, minY, maxX, maxY) {
    let minPos = new Pos2D(minX, minY);
    let maxPos = new Pos2D(maxX, maxY);
    let dist = new Pos2D($gamePlayer.x - this.x, $gamePlayer.y - this.y);
    dist.rotateFromDirection(this.direction()); // Rotate position as if facing right
    return dist.inRange(minPos, maxPos);
}

Game_Event.prototype.getDistanceToPlayer = function() {
    let event = $gameMap.event(this._eventId);
    return $gameMap.distance($gamePlayer.x, $gamePlayer.y, event.x, event.y);
}

Game_Event.prototype.getEventsInRangeDirectional = function(minX, minY, maxX, maxY) {
    let minPos = new Pos2D(minX, minY);
    let maxPos = new Pos2D(maxX, maxY);
    let output = [];
    for (const EVENT of $gameMap.events()) {
        let dist = new Pos2D(EVENT.x - this.x, EVENT.y - this.y);
        dist.rotateFromDirection(this.direction()); // Rotate position as if facing right
        if (dist.inRange(minPos, maxPos) && this._eventId != EVENT._eventId) {
            output.push(EVENT);
        }
    }
    return output;
}
