/*:
 * @author Eggshell97
 * @plugindesc Allows checking if there is collision between two points.
 *
 * @help
 * This plugin checks every pixel in a line to determine whether there is collision.
 * Console logs have been commented out.
 * 
 * There are currently two scripts that can be used for a raycast.
 * 
 * 
 * E97.raycastTarget(source, target, max distance);
 * 
 * The source and target can each be set two ways.
 * An array of two numbers will be coordinates. Pixel coordinates for this one.
 * A character object, such as $gamePlayer or $gameMap.event(#) can be used instead.
 * The max distance is in pixels, so keep that in mind.
 * 
 * 
 * E97.quadRaycastTarget(source, target, max distance);
 * 
 * For this one, coordinates are in tiles.
 * This is because it will take the four corners of the tile or character...
 * ...and raycast toward the same corner on the target tile or character.
 * It will then return how many of the rays made it, 0-4.
 * The max distance is still calculated from the center of the tile or character.
 * 
 * 
 * If you'd like more features, let me know.
 * Also the source and target can take anything extending Game_CharacterBase, plus followers.
 * Followers need to be grabbed with $gamePlayer.followers().follower(#).
 * Events and collision will stop the raycast, but the player and followers will not.
 * That can also be changed if needed.
*/

var E97 = E97 || {};

// The casting is done with corners
// Each of the four starting corners are simulated by requiring initial walks
// Issue with this right now is that it doesn't choose the right path
// I am working on a new function at the bottom of this plugin
E97.oldRaycast = function(source,target,maxDistance) {
	var sx, sy;
	if (Array.isArray(source)) {
		sx = source[0];
		sy = source[1];
	} else if (source instanceof Game_CharacterBase) {
		sx = source._x;
		sy = source._y;
	} else {
		//console.log('Invalid source of raycast!');
		return 0;
	}
	var tx, ty;
	if (Array.isArray(target)) {
		tx = target[0];
		ty = target[1];
	} else if (target instanceof Game_CharacterBase) {
		tx = target._x;
		ty = target._y;
	} else {
		//console.log('Invalid target of raycast!');
		return 0;
	}
	var x = sx;
	var y = sy;
	var rise, run, splits;
	// ADD A ZERO CHECK!!
	rise = ty - sy;
	run = tx - sx;
	splits = this.greatestCommonDivisor(rise, run);
	rise /= splits;
	run /= splits;
	var tempRise = rise;
	var tempRun = run;
	var dir;
	var exposure = 0;
	while (splits) {
		if (tempRise === 0 && tempRun === 0) {
			tempRise = rise;
			tempRun = run;
			splits--;
			continue;
		}
		if (Math.abs(tempRise) > Math.abs(tempRun)) {
			dir = tempRise < 0 ? 8 : 2;
			//console.log(x + ', ' + y + ', ' + dir);
			if (this.canPass(x, y, dir)) {
				if (tempRise < 0) {
					tempRise += 1;
					y -= 1;
				} else {
					tempRise -= 1;
					y += 1
				}
			} else {
				exposure -= 1;
				break;
			}
		} else {
			dir = tempRun < 0 ? 4 : 6;
			//console.log(x + ', ' + y + ', ' + dir);
			if (this.canPass(x, y, dir)) {
				if (tempRun < 0) {
					tempRun += 1;
					x -= 1;
				} else {
					tempRun -= 1;
					x += 1
				}
			} else {
				exposure -= 1;
				break;
			}
		}
	}
	exposure += 1;
	tempRise = rise;
	tempRun = run;
	//console.log(exposure);
}

E97.greatestCommonDivisor = function(a,b) {
	a = Math.abs(a);
	b = Math.abs(b);
	while (b) {
		var n = b;
		b = a % b;
		a = n;
	}
	return a;
}

E97.canPass = function(x, y, d, source = undefined, target = undefined) {
    var x2 = $gameMap.roundXWithDirection(x, d);
    var y2 = $gameMap.roundYWithDirection(y, d);
    if (!$gameMap.isValid(x2, y2)) {
        return false;
    }
    if (!this.isMapPassable(x, y, d)) {
        return false;
    }
    if (this.isCollidedWithEvents(x2, y2, source, target)) {
        return false;
    }
    return true;
}

E97.isCollidedWithEvents = function(x, y, source, target) {
    var events = $gameMap.eventsXyNt(x, y);
    return events.some(function(event) {
        return event.isNormalPriority() && event != source && event != target;
    });
}

E97.isMapPassable = function(x, y, d) {
    var x2 = $gameMap.roundXWithDirection(x, d);
    var y2 = $gameMap.roundYWithDirection(y, d);
    var d2 = this.reverseDir(d);
    return $gameMap.isPassable(x, y, d) && $gameMap.isPassable(x2, y2, d2);
}

E97.reverseDir = function(d) {
    return 10 - d;
}

// This one uses pixel coordinates, not screen coordinates
// ScreenX and ScreenY are annoying to deal with and easy to misalign
// Thus, tile coordinates are split into pixels instead
// For character sources and targets, it will select the middle of the character
E97.raycastTarget = function(source,target,maxDistance) {
	var sx, sy;
	if (Array.isArray(source)) {
		sx = source[0];
		sy = source[1];
	} else if (source instanceof Game_CharacterBase) {
		sx = this.tileToPixel(source._x) + $gameMap.tileWidth() / 2;
		sy = this.tileToPixel(source._y) + $gameMap.tileWidth() / 2;
	} else {
		//console.log('Invalid source of raycast!');
		return 0;
	}
	var tx, ty;
	if (Array.isArray(target)) {
		tx = target[0];
		ty = target[1];
	} else if (target instanceof Game_CharacterBase) {
		tx = this.tileToPixel(target._x) + $gameMap.tileWidth() / 2;
		ty = this.tileToPixel(target._y) + $gameMap.tileWidth() / 2;
	} else {
		//console.log('Invalid target of raycast!');
		return 0;
	}
	if(this.findDistance(sx, sy, tx, ty) > maxDistance) {
		return 0;
	}
	var slope = this.findSlope(sx, sy, tx, ty);
	var x = sx;
	var y = sy;
	var yIntercept = sy - slope * x;
	var previousTile = [this.pixelToTile(x), this.pixelToTile(y)];
	var nextTile;
	var dir;
	while (x != tx || Math.round(y) != ty) {
		//console.log(x + ', ' + y);
		if (!Number.isFinite(slope)) {
			y += sy < ty ? 1 : -1;
		} else {
			x += sx < tx ? 1 : -1;
			y = slope * x + yIntercept;
		}
		nextTile = [this.pixelToTile(x), this.pixelToTile(y)];
		if (previousTile[0] == nextTile[0] && previousTile[1] == nextTile[1]) {
			//console.log('Same tile: ' + nextTile[0] + ', ' + nextTile[1]);
			continue;
		} else if (this.isCardinalDirection(this.findDirection(previousTile, nextTile))) {
			if (this.canPass(previousTile[0], previousTile[1], this.findDirection(previousTile, nextTile), source, target)) {
				previousTile = nextTile;
				//console.log('Next tile is cardinal: ' + nextTile[0] + ', ' + nextTile[1]);
				continue;
			} else {
				//console.log('Collided with something: ' + nextTile[0] + ', ' + nextTile[1]);
				return 0;
			}
		} else {
			dir = this.splitDiagonalDirection(this.findDirection(previousTile, nextTile));
			if (this.canPassDiagonally(previousTile[0], previousTile[1], dir[0], dir[1], slope, source, target)) {
				previousTile = nextTile;
				//console.log('Next tile is diagonal: ' + nextTile[0] + ', ' + nextTile[1]);
				continue;
			} else {
				//console.log('Collided with something: ' + nextTile[0] + ', ' + nextTile[1]);
				return 0;
			}
		}
	}
	return 1;
}

// Version that takes the four corners of the casting tile and target tile
// Useful if you want varying intensity based on exposure
// This one takes tile coordinates, and still calculates distance from center
E97.quadRaycastTarget = function(source,target,maxDistance) {
	var sx1, sy1, sx2, sy2, sx3, sy3, sx4, sy4;
	var cornerOffset = $gameMap.tileWidth() - 1;
	if (Array.isArray(source)) {
		sx1 = this.tileToPixel(source[0]);
		sy1 = this.tileToPixel(source[1]);
		sx2 = sx1 + cornerOffset;
		sy2 = sy1;
		sx3 = sx1;
		sy3 = sy1 + cornerOffset;
		sx4 = sx2;
		sy4 = sy3;
	} else if (source instanceof Game_CharacterBase) {
		sx1 = this.tileToPixel(source._x);
		sy1 = this.tileToPixel(source._y);
		sx2 = sx1 + cornerOffset;
		sy2 = sy1;
		sx3 = sx1;
		sy3 = sy1 + cornerOffset;
		sx4 = sx2;
		sy4 = sy3;
	} else {
		//console.log('Invalid source of raycast!');
		return 0;
	}
	var tx1, ty1, tx2, ty2, tx3, ty3, tx4, ty4;
	if (Array.isArray(target)) {
		tx1 = this.tileToPixel(target[0]);
		ty1 = this.tileToPixel(target[1]);
		tx2 = tx1 + cornerOffset;
		ty2 = ty1;
		tx3 = tx1;
		ty3 = ty1 + cornerOffset;
		tx4 = tx2;
		ty4 = ty3;
	} else if (target instanceof Game_CharacterBase) {
		tx1 = this.tileToPixel(target._x);
		ty1 = this.tileToPixel(target._y);
		tx2 = tx1 + cornerOffset;
		ty2 = ty1;
		tx3 = tx1;
		ty3 = ty1 + cornerOffset;
		tx4 = tx2;
		ty4 = ty3;
	} else {
		//console.log('Invalid target of raycast!');
		return 0;
	}
	var halfTile = $gameMap.tileWidth() / 2;
	if(this.findDistance(sx1 + halfTile, sy1 + halfTile, tx1 + halfTile, ty1 + halfTile) > maxDistance) {
		return 0;
	}
	var slope = this.findSlope(sx1, sy1, tx1, ty1);
	var x = sx1;
	var y = sy1;
	var yIntercept = y - slope * x;
	var previousTile = [this.pixelToTile(x), this.pixelToTile(y)];
	var nextTile;
	var dir;
	var exposure = 0;
	while (x != tx1 || Math.round(y) != ty1) {
		//console.log(x + ', ' + y);
		if (!Number.isFinite(slope)) {
			y += sy1 < ty1 ? 1 : -1;
		} else {
			x += sx1 < tx1 ? 1 : -1;
			y = slope * x + yIntercept;
		}
		nextTile = [this.pixelToTile(x), this.pixelToTile(y)];
		if (previousTile[0] == nextTile[0] && previousTile[1] == nextTile[1]) {
			//console.log('Same tile: ' + nextTile[0] + ', ' + nextTile[1]);
			continue;
		} else if (this.isCardinalDirection(this.findDirection(previousTile, nextTile))) {
			if (this.canPass(previousTile[0], previousTile[1], this.findDirection(previousTile, nextTile), source, target)) {
				previousTile = nextTile;
				//console.log('Next tile is cardinal: ' + nextTile[0] + ', ' + nextTile[1]);
				continue;
			} else {
				//console.log('Collided with something: ' + nextTile[0] + ', ' + nextTile[1]);
				exposure--;
				break;
			}
		} else {
			dir = this.splitDiagonalDirection(this.findDirection(previousTile, nextTile));
			if (this.canPassDiagonally(previousTile[0], previousTile[1], dir[0], dir[1], slope, source, target)) {
				previousTile = nextTile;
				//console.log('Next tile is diagonal: ' + nextTile[0] + ', ' + nextTile[1]);
				continue;
			} else {
				//console.log('Collided with something: ' + nextTile[0] + ', ' + nextTile[1]);
				exposure--;
				break;
			}
		}
	}
	exposure++;
	slope = this.findSlope(sx2, sy2, tx2, ty2);
	x = sx2;
	y = sy2;
	yIntercept = y - slope * x;
	previousTile = [this.pixelToTile(x), this.pixelToTile(y)];
	while (x != tx2 || Math.round(y) != ty2) {
		//console.log(x + ', ' + y);
		if (!Number.isFinite(slope)) {
			y += sy2 < ty2 ? 1 : -1;
		} else {
			x += sx2 < tx2 ? 1 : -1;
			y = slope * x + yIntercept;
		}
		nextTile = [this.pixelToTile(x), this.pixelToTile(y)];
		if (previousTile[0] == nextTile[0] && previousTile[1] == nextTile[1]) {
			//console.log('Same tile: ' + nextTile[0] + ', ' + nextTile[1]);
			continue;
		} else if (this.isCardinalDirection(this.findDirection(previousTile, nextTile))) {
			if (this.canPass(previousTile[0], previousTile[1], this.findDirection(previousTile, nextTile), source, target)) {
				previousTile = nextTile;
				//console.log('Next tile is cardinal: ' + nextTile[0] + ', ' + nextTile[1]);
				continue;
			} else {
				//console.log('Collided with something: ' + nextTile[0] + ', ' + nextTile[1]);
				exposure--;
				break;
			}
		} else {
			dir = this.splitDiagonalDirection(this.findDirection(previousTile, nextTile));
			if (this.canPassDiagonally(previousTile[0], previousTile[1], dir[0], dir[1], slope, source, target)) {
				previousTile = nextTile;
				//console.log('Next tile is diagonal: ' + nextTile[0] + ', ' + nextTile[1]);
				continue;
			} else {
				//console.log('Collided with something: ' + nextTile[0] + ', ' + nextTile[1]);
				exposure--;
				break;
			}
		}
	}
	exposure++;
	slope = this.findSlope(sx3, sy3, tx3, ty3);
	x = sx3;
	y = sy3;
	yIntercept = y - slope * x;
	previousTile = [this.pixelToTile(x), this.pixelToTile(y)];
	while (x != tx3 || Math.round(y) != ty3) {
		//console.log(x + ', ' + y);
		if (!Number.isFinite(slope)) {
			y += sy3 < ty3 ? 1 : -1;
		} else {
			x += sx3 < tx3 ? 1 : -1;
			y = slope * x + yIntercept;
		}
		nextTile = [this.pixelToTile(x), this.pixelToTile(y)];
		if (previousTile[0] == nextTile[0] && previousTile[1] == nextTile[1]) {
			//console.log('Same tile: ' + nextTile[0] + ', ' + nextTile[1]);
			continue;
		} else if (this.isCardinalDirection(this.findDirection(previousTile, nextTile))) {
			if (this.canPass(previousTile[0], previousTile[1], this.findDirection(previousTile, nextTile), source, target)) {
				previousTile = nextTile;
				//console.log('Next tile is cardinal: ' + nextTile[0] + ', ' + nextTile[1]);
				continue;
			} else {
				//console.log('Collided with something: ' + nextTile[0] + ', ' + nextTile[1]);
				exposure--;
				break;
			}
		} else {
			dir = this.splitDiagonalDirection(this.findDirection(previousTile, nextTile));
			if (this.canPassDiagonally(previousTile[0], previousTile[1], dir[0], dir[1], slope, source, target)) {
				previousTile = nextTile;
				//console.log('Next tile is diagonal: ' + nextTile[0] + ', ' + nextTile[1]);
				continue;
			} else {
				//console.log('Collided with something: ' + nextTile[0] + ', ' + nextTile[1]);
				exposure--;
				break;
			}
		}
	}
	exposure++;
	slope = this.findSlope(sx4, sy4, tx4, ty4);
	x = sx4;
	y = sy4;
	yIntercept = y - slope * x;
	previousTile = [this.pixelToTile(x), this.pixelToTile(y)];
	while (x != tx4 || Math.round(y) != ty4) {
		//console.log(x + ', ' + y);
		if (!Number.isFinite(slope)) {
			y += sy4 < ty4 ? 1 : -1;
		} else {
			x += sx4 < tx4 ? 1 : -1;
			y = slope * x + yIntercept;
		}
		nextTile = [this.pixelToTile(x), this.pixelToTile(y)];
		if (previousTile[0] == nextTile[0] && previousTile[1] == nextTile[1]) {
			//console.log('Same tile: ' + nextTile[0] + ', ' + nextTile[1]);
			continue;
		} else if (this.isCardinalDirection(this.findDirection(previousTile, nextTile))) {
			if (this.canPass(previousTile[0], previousTile[1], this.findDirection(previousTile, nextTile), source, target)) {
				previousTile = nextTile;
				//console.log('Next tile is cardinal: ' + nextTile[0] + ', ' + nextTile[1]);
				continue;
			} else {
				//console.log('Collided with something: ' + nextTile[0] + ', ' + nextTile[1]);
				exposure--;
				break;
			}
		} else {
			dir = this.splitDiagonalDirection(this.findDirection(previousTile, nextTile));
			if (this.canPassDiagonally(previousTile[0], previousTile[1], dir[0], dir[1], slope, source, target)) {
				previousTile = nextTile;
				//console.log('Next tile is diagonal: ' + nextTile[0] + ', ' + nextTile[1]);
				continue;
			} else {
				//console.log('Collided with something: ' + nextTile[0] + ', ' + nextTile[1]);
				exposure--;
				break;
			}
		}
	}
	exposure++;
	return exposure;
}

// This function was for Petal Feather's fake raycast
E97.pixelToTile = function(n) {
	return Math.floor(n / $gameMap.tileWidth());
}

// Reversed version
E97.tileToPixel = function(n) {
	return n * $gameMap.tileWidth();
}

// Calculate slope is a function because it's annoying
E97.findSlope = function(x1,y1,x2,y2) {
	return (y2 - y1) / (x2 - x1);
}

// And this one is even more annoying
E97.findDistance = function(x1,y1,x2,y2) {
	return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// Takes in two tiles, returns a number direction from start to target
E97.findDirection = function(startTile,targetTile) {
	if (startTile[0] == targetTile[0] && startTile[1] == targetTile[1]){
		return 0;
	} else if (startTile[0] == targetTile[0] || startTile[1] == targetTile[1]) {
		if (startTile[0] != targetTile[0]) {
			return startTile[0] < targetTile[0] ? 6 : 4;
		} else {
			return startTile[1] < targetTile[1] ? 2 : 8;
		}
	} else {
		if (startTile[0] < targetTile[0]) {
			return startTile[1] < targetTile[1] ? 3 : 9;
		} else {
			return startTile[1] < targetTile[1] ? 1 : 7;
		}
	}
}

// Checks for whether I'm dealing with diagonals or not
// Uses a set in case I for some reason need to change the directions
E97.isCardinalDirection = function(direction) {
	if (!this._cardinalDirections) {
		this._cardinalDirections = new Set([2,4,6,8]);
	}
	return this._cardinalDirections.has(direction);
}

// Modified version of the function in Game_CharacterBase
// Uses the slope to determine which path the line took to the diagonal tile
E97.canPassDiagonally = function(x, y, horz, vert, slope, source = undefined, target = undefined) {
    var x2 = $gameMap.roundXWithDirection(x, horz);
    var y2 = $gameMap.roundYWithDirection(y, vert);
	if (Math.abs(slope) == 1) {
		if (this.canPass(x, y, vert, source, target) && this.canPass(x, y2, horz, source, target)) {
			return true;
		}
		if (this.canPass(x, y, horz, source, target) && this.canPass(x2, y, vert, source, target)) {
			return true;
		}
	} else if (Math.abs(slope) > 1) {
		return this.canPass(x, y, vert, source, target) && this.canPass(x, y2, horz, source, target);
	} else {
		return this.canPass(x, y, horz, source, target) && this.canPass(x2, y, vert, source, target);
	}
}

// For using the above function, I need the different cardinal directions
// There were definitely better ways to do this
E97.splitDiagonalDirection = function(direction) {
	if (direction == 1) {
		return [4,2];
	} else if (direction == 3) {
		return [6,2];
	} else if (direction == 7) {
		return [4,8];
	} else {
		return [6,8];
	}
}