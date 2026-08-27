//=============================================================================
// JS Extensions - By TomatoRadio
// TR_JsExtensions.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_JsExtensions = true;

var TR = TR || {};
TR.JSEXT = TR.JSEXT || {};
TR.JSEXT.version = 9;

/*: 
 * @plugindesc v9.0 Adds more JS functions to RPG Maker MV
 * @author TomatoRadio
 * 
 * @help
 * OMORI runs using a pre-2020 version of nwjs, meaning
 * that newer JS functions don't work with it.
 * 
 * This plugin adds some of those functions.
 * It also adds some general stuff that I like using.
 * 
*/

/**
 * Returns the item at the given index.
 * If given a negative integer, will count
 * from the end of the Array.
 *
 * @method Array.prototype.at
 * @param {Number} index The index to call.
 * @return {*} The item at given index.
 */
Array.prototype.at = function(index) {
    if (index >= 0) return this[index];
	else return this[(this.length+index)];
};

/**
 * 
 * Returns an Array of Numbers starting at 'start' and
 * ending at start+distance, going by intervals of 1.
 * Looping is also supported.
 * 
 * @param {Number} start The number to start at
 * @param {Number} distance The distance from start
 * @param {Number} min The lowest number allowed. Default MinSafeInt
 * @param {Number} max The highest number allowed. Default MaxSafeInt
 * @param {Boolean} loop Whether to loop when reaching min/max. If false the array is immediately returned when the min/max is reached. Default true
 * @returns {Array}
 */
Array.distanceLoop = function(start,distance,min=Number.MIN_SAFE_INTEGER,max=Number.MAX_SAFE_INTEGER,loop=true) {
    let arr = [];
    let mult = distance > 0 ? 1 : -1;
    for (let i = start; arr.length <= Math.abs(distance); i+=mult) {
        if (i < min) {if (loop) {i = max} else {break;}};
        if (i > max) {if (loop) {i = min} else {break;}};
        arr.push(i);
    };
    return arr;
};

/**
 * Returns the last item to satisfy a
 * testing function.
 *
 * @method Array.prototype.findLast
 * @param {CallbackFn} func The callback function.
 * @param {thisArg} thisArg The value to be used as 'this' for the callback function.
 * @return {*} The last item that passes the function.
 */
Array.prototype.findLast = function(func, thisArg = this) {
    for (let i = this.length; i >= 0; i--) {
		if (func.call(thisArg,this[i],i,this)) return this[i];
	}
	return undefined;
};

/**
 * Returns the index of the last item to satisfy a
 * testing function.
 *
 * @method Array.prototype.findLastIndex
 * @param {CallbackFn} func The callback function.
 * @param {thisArg} thisArg The value to be used as 'this' for the callback function.
 * @return {Number} The index of the last item that passes the function.
 */
Array.prototype.findLastIndex = function(func, thisArg = this) {
    for (let i = this.length; i >= 0; i--) {
		if (func.call(thisArg,this[i],i,this)) return i;
	}
	return -1;
};

/**
 * Creates a new array with all sub-array elements 
 * concatenated into it recursively up to the specified depth.
 *
 * @method Array.prototype.flat
 * @param {Depth} depth The depth level specifying how deep a nested array structure should be flattened. Defaults to 1.
 * @return {Array} The flattened Array.
 */
Array.prototype.flat = function(depth=1) {
	var copy = Array.from(this);
    for (depth = depth; depth > 0; depth--) {
		var foundSubArray = false
		for (let i = 0; i < this.length; i++) {
			if (Array.isArray(this[i])) {
				var ary = this[i]
				for (let e = 0; e < ary.length; i++) {
					if (e === 0) copy.splice(i, 1, ary[e]);
					else copy.splice(i,0,ary[e]);
				}
				foundSubArray = true;
			}
		}
		if (!foundSubArray) return copy;
	}
	return copy;
};

/**
 * Returns a new array formed by applying a given callback function 
 * to each element of the array, and then flattening the result by one level.
 *
 * @method Array.prototype.flatMap
 * @param {CallbackFn} func The callback function.
 * @param {thisArg} thisArg The value to be used as 'this' for the callback function.
 * @return {Array} The flattened Array.
 */
Array.prototype.flatMap = function() {
	return this.map(...args).flat();
};

/**
 * Returns the first item of the Array to not be
 * nullish (null or undefined).
 * @param {Array} operators An array of the operators.
 * @param {*} fallback The item to be returned if the entire Array is nullish. Defaults to null.
 * @return {*} The first item in the array to not be null or undefined.
 */
Array.nullCoal = function(operators, fallback = null) {
	for (const thing of operators) {
		if (thing !== undefined && thing !== null) {
			return thing;
		}
	}
	return fallback;
};
Array.NullCoal = Array.nullCoal;
TR.NullCoal = Array.nullCoal;
TR.nullCoal = Array.nullCoal;

/**
 * Returns a new array formed by reversing the Array.
 *
 * @method Array.prototype.toReversed
 * @return {Array} The reversed Array.
 */
Array.prototype.toReversed = function() {
	var copy = Array.from(this);
	return copy.reverse();
};

/**
 * Returns a new array formed by sorting the Array.
 *
 * @method Array.prototype.toSorted
 * @return {Array} The sorted Array.
 */
Array.prototype.toSorted = function() {
	var copy = Array.from(this);
	return copy.sort();
};

/**
 * Returns a new array formed by splicing the Array.
 *
 * @method Array.prototype.toSpliced
 * @return {Array} The spliced Array.
 */
Array.prototype.toSpliced = function() {
	var copy = Array.from(this);
	return copy.splice(...args);
};

/**
 * Returns a new array formed by replacing
 * the given index with a new value.
 *
 * @method Array.prototype.with
 * @param {Number} index The index in the Array.
 * @param {Value} value The value to replace with.
 * @return {Array} The replaced Array.
 */
Array.prototype.with = function(index,value) {
	var copy = Array.from(this);
	copy[index] = value;
	return copy;
};

/**
 * Returns a random entry from the array.
 * If the Array is falsy, returns undefined.
 * 
 * @method Array.prototype.random
 * @return {*} A random item.
 */
Array.prototype.random = function() {
	if (!this) {return undefined;};
	return this[Math.floor(Math.random()*this.length)];
};

/**
 * Returns the index of first item in the array to be
 * equal to the first arg.
 * 
 * The second arg is a bool to determine if strict (===)
 * or loose (==) equality is used. True/False -> Strict/Loose
 * 
 * @method Array.prototype.findItemIndex
 * @param {*} wanted The wanted item.
 * @param {Boolean} strict True if using strict equality. Default false.
 * @return {Number} Index of item.
 */
Array.prototype.findItemIndex = function(wanted,strict = false) {
	if (strict) {
		for (let i = 0; i < this.length; i++) {
			if (this[i] === wanted) return i;
		};
	} else {
		for (let i = 0; i < this.length; i++) {
			if (this[i] == wanted) return i;
		};
	};
};

/**
 * 
 * Pushes a value multiple times to an array.
 * 
 * @param {*} val The value to push.
 * @param {Integer} num The number of times to push.
 * @returns {Integer} The length of the array after pushing.
 */
Array.prototype.pushMultiple = function(val,num) {
  for (let i = 0; i < num; i++) {this.push(val)};
  return this.length;
}

/**
 * 
 * Returns true if both Arrays share at least 1 element.
 * 
 * @method Array.prototype.shares
 * @param {Array} arr The other array to check.
 * @return {Boolean} True if the other Array includes on of this array's elements.
 */
Array.prototype.shares = function(arr) {
	return this.some(e=>arr.includes(e))
};

/**
 * 
 * Returns a copy of the array with the 
 * elements shuffled randomly.
 * 
 * @method Array.prototype.shares
 * @returns {Array} A copy of the array in a randomized order.
 */
Array.prototype.shuffle = function() {
  var options = this.map(function(a,i) {return i});
  var newArr = [];
  for (let i = 0; i < this.length; i++) {
    let item = this[i];
    let index = options[Math.floor(Math.random()*options.length)];
    options = options.filter(function(i) {return i !== index});
    newArr[index] = item;
  };
  return newArr;
};

/**
 * Returns true if exactly one of the two arguments
 * are truthy.
 * 
 * @param {*} first 
 * @param {*} second 
 * @return {Boolean} Boolean
 */
Boolean.XOR = function(first,second) {
	let truth = 0;
	if (first) truth++
	if (second) truth++
	if (truth === 1) return true;
	return false;
}
Boolean.xor = Boolean.XOR;
TR.XOR = Boolean.XOR;
TR.xor = Boolean.XOR;

/**
 * Converts in-game frames into an array of
 * [Minutes,Seconds,Milliseconds], all rounded.
 * The method assumes 60fps with no slowdown.
 * 
 * @param {Number} frames Number of Frames
 * @returns {Array} An array of integers.
 */
Date.frameToTime = function(frames=0) {
  let min = Math.floor(frames/3600);
  frames %= 3600;
  let sec = Math.floor(frames/60);
  frames %= 60;
  let mil = Math.round(frames/0.06);
  return [min,sec,mil];
};
TR.frameToTime = Date.frameToTime;

/**
 * Converts Minutes:Seconds:Milliseconds into in-game frames.
 * The method assumes 60fps with no slowdown.
 * 
 * @param {Number} min Number of Minutes, defaults to 0
 * @param {Number} sec Number of Seconds, defaults to 0
 * @param {Number} mil Number of Milliseconds, defaults to 0
 * @returns {Number} The time in frames.
 */
Date.timeToFrame = function(min=0,sec=0,mil=0) {
  let frame = min*3600;
  frame += sec*60;
  frame += mil*0.06;
  return frame;
};
TR.timeToFrame = Date.timeToFrame;

/**
 * 
 * Returns value1 or value2 based on which is closer to target.
 * min & max can be used to support looping.
 * If both values are the same distance, value1 is returned.
 * 
 * @param {Number} target The reference value
 * @param {Number} value1 The first value being compared
 * @param {Number} value2 The second value being compared
 * @param {Boolean} loop Whether to allow looping distances. Default true
 * @param {Number} min The minimum value when looping. Default Number.MIN_SAFE_INTEGER
 * @param {Number} max The maximum value when looping. Default Number.MAX_SAFE_INTEGER
 * @returns {Number} Returns value1 or value2
 */
Math.closest = function(target,value1,value2,loop=true,min=Number.MIN_SAFE_INTEGER,max=Number.MAX_SAFE_INTEGER) {
    let distance1 = Math.abs(target-value1);
    if (distance1 > max/2 && loop) {
        distance1 = max-value1+target;
    };
    let distance2 = Math.abs(target-value2);
    if (distance2 > max/2 && loop) {
        distance2 = max-value2+target;
    };
    return Math.min(distance1,distance2) === distance1 ? value1 : value2;
};

/**
 * 
 * Returns the factorial of a number.
 * 
 * @param {Number} num
 * @returns {Number} The factorial
 * 
 */
Math.factorial = function(num) {
	if (num === 0) {
		return 1;
	} else if (num < 0) {
		return NaN;
	};
	var count = 1;
	for (let i = num; i > 0; i--) {
		count *= i;
	};
	return count;
};

/**
 * 
 * Returns value1 or value2 based on which is farther from target.
 * min & max can be used to support looping.
 * If both values are the same distance, value1 is returned.
 * 
 * @param {Number} target The reference value
 * @param {Number} value1 The first value being compared
 * @param {Number} value2 The second value being compared
 * @param {Boolean} loop Whether to allow looping distances. Default true
 * @param {Number} min The minimum value when looping. Default Number.MIN_SAFE_INTEGER
 * @param {Number} max The maximum value when looping. Default Number.MAX_SAFE_INTEGER
 * @returns {Number} Returns value1 or value2
 */
Math.farthest = function(target,value1,value2,loop=true,min=Number.MIN_SAFE_INTEGER,max=Number.MAX_SAFE_INTEGER) {
    let distance1 = Math.abs(target-value1);
    if (distance1 > max/2 && loop) {
        distance1 = max-value1+target;
    };
    let distance2 = Math.abs(target-value2);
    if (distance2 > max/2 && loop) {
        distance2 = max-value2+target;
    };
    return Math.max(distance1,distance2) === distance1 ? value1 : value2;
};

/**
 * Returns true if value is equal to target with a margin
 * of error.
 *
 * @method Math.withinRange
 * @param {Number} value The value to check.
 * @param {Number} target The target value.
 * @param {Number} elipson The margin of error for the check.
 * @return {Boolean}
 */
Math.withinRange = function(value,target,elipson) {
    return (value >= target-elipson && value <= target+elipson);
};

/**
 * 
 * Converts a number into a formatted string,
 * using commas like written English.
 * (eg. 1000 -> 1,000)
 * @param {String} seperator The character to split with, defaults to , 
 * @returns {String} The formatted number.
 */
Number.prototype.format = function(seperator=',') {
  var arr = String(this).split("");let a = 1;
  for (let i = arr.length-1;i>0;i--) {if (a%3===0){arr.splice(i,0,seperator);}a+=1;};
  return arr.join('');
};

/**
 * 
 * Behaves the same as Object.assign, but modifies and returns
 * a copy of target instead of target itself.
 * 
 * @method Object.assignToCopy
 * @param {Object} target The object to be assigned.
 * @param {Object} source The object to assign from.
 * @returns {Object} A copy of target with properties assigned from source.
 */
Object.assignToCopy = function(target,source) {
  let ret = {};
  for (let key in target) {
    ret[key] = target[key];
  };
  for (let key in source) {
    ret[key] = source[key];
  };
  return ret;
};

/**
 * Transforms a list of key-value pairs into an object.
 *
 * @method Object.fromEntries
 * @param {Map} map The map to reference.
 * @return {Object} The new Object.
 */
Object.fromEntries = function(map) {
	var obj = {};
	map.forEach(function(value,key) {
		Object.defineProperty(obj,key,{value: value});
	})
	return obj;
}

/**
 * 
 * Returns the first key of the object that contains
 * the search value. If the value is not in the object,
 * the method returns null.
 * 
 * @method Object.keyOf
 * @param {Object} obj The object being searched
 * @param {*} value The value being searched for
 * @returns {*} The first key to contain the value, or null if the value isn't present.
 */
Object.keyOf = function(obj,value) {
  for (const key in obj) {
    if (obj[key] === value) {
      return key;
    };
  };
  return null;
};

/**
 * Creates a new object with the keys of the given array,
 * each assigned a value from a callback function.
 * 
 * @method Object.map
 * @param {Array} array The array to use
 * @param {Function} callbackFn The callback function
 * @param {*} thisArg The object to use as 'this' in the callback
 * @return {Object} Returns an object with key value pairs of the original array and the mapped array.
 */
Object.map = function(array,callbackFn,thisArg) {
	var mappedArray = array.map(callbackFn,thisArg);
	var obj = {};
	for (let i = 0; i < array.length; i++) {
		let key = array[i];
		let value = mappedArray[i];
		obj[key] = value;
	};
	return obj;
};


// ==========================================================================================================================================
/*

METHODS PAST HERE REQUIRE RPGMAKER
This obviously shouldn't matter much since this is an RPGMaker plugin,
but it's worth noting for people who may want to use these elsewhere.

*/
// ==========================================================================================================================================

/**
 * 
 * A debugging function that returns a numbered list of every actor
 * ordered by the value of a stat at a given level.
 * 
 * For reference, these are the stats and their indexes:
 * 0-MHP,1-MMP,2-ATK,3-DEF,4-MAT,5-MDF,6-AGI,7-LUK
 * 
 * Note: due to referring to $dataActors, equipments and ingame buffs
 * will not be factored into the ordering.
 * @param {Integer} param The index of the parameter being checked.
 * @param {Integer} level The level of all actors when getting their param.
 * @returns {String} A numbered list of every actor ordered by param.
 */
DataManager.returnStatList = function(param,level=50) {
  var actors = $dataActors.filter(function(a) {return a && a.name && a.meta && a.meta.BattleStatusFaceName});
  actors.sort(function(a,b) {
    let aStat = $dataClasses[a.classId].params[param][level];
    let bStat = $dataClasses[b.classId].params[param][level];
    return bStat-aStat;
  });
  var lowestStat = 999999999999999999;
  var count = 0;
  var string = "";
  var tempCount = 1;
  for (let actor of actors) {
    let stat = $dataClasses[actor.classId].params[param][level];
    if (stat < lowestStat) {
      lowestStat = stat;count+=tempCount;tempCount=1;
    } else {tempCount++;};
    let name = actor.nickname ? actor.nickname : actor.name;
    string+=`#${count}: ${name}, ${stat}\n`
  };
  return string;
};
TR.returnStatList = DataManager.returnStatList;

/**
 * 
 * Returns the Nickname of the Actor if it exists,
 * but will default back to the Name if no Nickname exists.
 * 
 * Useful for actors that share names, but have a Nickname to distinguish them.
 * (eg. Faraway and Headspace variants of the main cast)
 * 
 * @param {Object} obj Either the Game_Actor object, or the $dataActors entry for the actor
 * @returns {String} The alternate name.
 */
DataManager.actorAltName = function(obj) {
  if (obj instanceof Game_Actor) {
    return obj.nickname() ? obj.nickname() : obj.name();
  } else {
    return obj.nickname ? obj.nickname : obj.name;
  };
};
TR.actorAltName = DataManager.actorAltName;

/**
 * 
 * Returns the Sprite_Character for a Game_Character.
 * 
 * @returns {Sprite_Character} The corresponding sprite
 */
Game_CharacterBase.prototype.getSprite = function() {
  let arr = SceneManager._scene._spriteset._characterSprites;
  return arr.find((c) => {return c._character === this});
};

/**
 * 
 * Returns the value of a character's SelfSwitch
 * 
 * @param {String} key The SelfSwitch name
 * @returns {Boolean}
 */
Game_CharacterBase.prototype.selfSwitch = function(key) {
  return $gameSelfSwitches.value([$gameMap._mapId,this.eventId(),key]);
};

/**
 * 
 * Sets the value of a character's SelfSwitch
 * 
 * @param {String} key The SelfSwitch name
 * @param {Boolean} value The value to assign
 */
Game_CharacterBase.prototype.setSelfSwitch = function(key,value) {
  $gameSelfSwitches.setValue([$gameMap._mapId,this.eventId(),key],value);
};

/**
 * 
 * Returns the value of a character's SelfVariable
 * 
 * @param {Integer} key The SelfVariable name
 * @returns {Boolean} 
 */
Game_CharacterBase.prototype.selfVariable = function(key) {
  return $gameSelfVariables.value([$gameMap._mapId,this.eventId(),key]);
};

/**
 * 
 * Sets the value of a character's SelfVariable
 * 
 * @param {Integer} key The SelfVariable name
 * @param {Boolean} value The value to assign
 */
Game_CharacterBase.prototype.setSelfVariable = function(key,value) {
  $gameSelfVariables.setValue([$gameMap._mapId,this.eventId(),key],value);
};

/**
 * 
 * This method sets the custom frame of a character, but the indexes
 * are localized to the character set being used.
 * Eg, you're using the sixth character set of a sheet and you run
 * this.setRelativeCustomFrameXY(0,0);
 * this will be converted into
 * this.setCustomFrameXY(3,4);
 * 
 * @param {Integer} x The X index
 * @param {Integer} y The Y index
 */
Game_CharacterBase.prototype.setRelativeCustomFrameXY = function(x,y) {
  let index = this.characterIndex();
  let x2 = x+3*(index%4);
  let y2 = y+4*Math.floor(index/4);
  this.setCustomFrameXY(x2,y2);
};

/**
 * 
 * This method clears a bunch of map-exclusive data for a specific map.
 * To be specific, it does the following:
 * - Resets all Self-Switches to False (Including scripted and OneMaker Switches)
 * - Resets all Self-Variables to 0 (Including scripted and OneMaker Switches)
 * - Deletes all Saved Event Locations
 * 
 * @param {Integer} mapId The ID of the map to clear.
 */
Game_Map.prototype.clearMapData = function(mapId) {
  let isolateMapKeys = function(object){return Object.keys(object).filter(k=>k.startsWith(String(mapId)))};
  let deletedSwitches = isolateMapKeys($gameSelfSwitches._data);
  let deletedVariables = isolateMapKeys($gameSelfVariables._data);
  let deletedLocations = isolateMapKeys($gameSystem._savedEventLocations);
  for (let key of deletedSwitches) {delete $gameSelfSwitches._data[key];};
  for (let key of deletedVariables) {delete $gameSelfVariables._data[key];};
  for (let key of deletedLocations) {delete $gameSystem._savedEventLocations[key];};
};
TR.clearMapData = Game_Map.prototype.clearMapData;


/**
 * 
 * These methods allow quick operations on a variable.
 * add -> Addition
 * sub -> Subtraction
 * mul -> Multiplication
 * div -> Division
 * mod -> Modulo
 * 
 * @param {Integer} id The VariableID being modified.
 * @param {Number} value The operating value.
 */
Game_Variables.prototype.addValue = function(id,value) {
	let val = this.value(id)+value;
	this.setValue(id,val);
};

Game_Variables.prototype.subValue = function(id,value) {
	let val = this.value(id)-value;
	this.setValue(id,val);
};

Game_Variables.prototype.mulValue = function(id,value) {
	let val = this.value(id)*value;
	this.setValue(id,val);
};

Game_Variables.prototype.divValue = function(id,value) {
	let val = this.value(id)/value;
	this.setValue(id,val);
};

Game_Variables.prototype.modValue = function(id,value) {
	let val = this.value(id)%value;
	this.setValue(id,val);
};

/**
 * 
 * Returns the name of an audio file based on its URL.
 * 
 * @returns {String} The name
 */
WebAudio.prototype.nameFromUrl = function() {
    var result = (/audio\/\w+\/(?<name>\w+)\./ig).exec(this._url);
    if (result && result.groups) {return result.groups.name};
};

/**
 * Returns the x coordinate of the right side of the window,
 * or the y coordinate of the bottom side of the window.
 * 
 * @returns {Integer}
 */
Window.prototype.rightX = function() {return this.x+this.width};
Window.prototype.bottomY = function() {return this.y+this.height};

/**
 * Runs code to determine whether the camera from GALV_CamControl (the one we use in OMORI)
 * has reached it's target. If it has, it breaks the current loop of the event.
 * 
 * This can be placed in a Common Event like this:
 * ◆Loop
 * ◆Script：this.waitForGalvCam();
 * ◆
 * ：Repeat Above
 * The code also automatically adds a 5 frame wait for every check, so lag shouldn't occur.
 */
Game_Interpreter.prototype.waitForGalvCam = function() {
  const t  = $gameMap.camTarget;
  var tx = t.screenX();var ty = t.screenY();
  var sx = Graphics.width/2;var sy = Graphics.height/2;
  if (!$gameMap.isLoopHorizontal()) {
    if ($gameMap.width()-t.x<$gameMap.screenTileX()/2) {
        sx += (($gameMap.screenTileX()/2)-($gameMap.width()-t.x))*$gameMap.tileWidth()+($gameMap.tileWidth()/2);
    } else if (t.x<$gameMap.screenTileX()/2) {
        sx -= (($gameMap.screenTileX()/2)-(t.x))*$gameMap.tileWidth()+($gameMap.tileWidth()/2);
    };
  }
  if (!$gameMap.isLoopVertical()) {
    if ($gameMap.height()-t.y<$gameMap.screenTileY()/2) {
        sy += (($gameMap.screenTileY()/2)-($gameMap.height()-t.y))*$gameMap.tileHeight()+$gameMap.tileHeight();
    } else if (t.y<$gameMap.screenTileY()/2) {
        sy -= (($gameMap.screenTileY()/2)-(t.y))*$gameMap.tileHeight()+$gameMap.tileHeight();
    };
  };
  if (Math.withinRange(tx,sx,$gameMap.tileWidth()/2)&&Math.withinRange(ty,sy,$gameMap.tileWidth()/2)) {
    this.command113();
  };
  this.wait(5);
};

// These require Badges obviously.
if (DGT && DGT.Badges) {
  /**
   * Debug function that unlocks every badge in the given modId
   * @param {String} modId The modId defined by the badgedata_modId.yaml of the mod.
   */
  DGT.unlockAllBadges = function(modId) {
    for (const badge in DGT.Badges._data[modId]) {
      DGT.UnlockBadgeSilent(modId,badge);
    };
  };

  /**
   * Debug function that locks every badge in the given modId
   * @param {String} modId The modId defined by the badgedata_modId.yaml of the mod.
   */
  DGT.lockAllBadges = function(modId) {
    for (const badge in DGT.Badges._data[modId]) {
      DGT.LockBadge(modId,badge);
    };
  };

  // These declarations prevent capitalization errors.
  DGT.unlockBadge = DGT.UnlockBadge;
  DGT.unlockBadgeSilent = DGT.UnlockBadgeSilent;
  DGT.lockBadge = DGT.LockBadge;
  DGT.UnlockAllBadges = DGT.unlockAllBadges;
  DGT.LockAllBadges = DGT.lockAllBadges;
};

// These are simply windows with their padding set to 4, 
// which means that you can draw to everything withing the white borders.
function Window_Padless() { this.initialize.apply(this, arguments); }
Window_Padless.prototype = Object.create(Window_Base.prototype);
Window_Padless.prototype.constructor = Window_Padless;
Window_Padless.prototype.standardPadding = function() {return 4;}
Window_Padless.prototype.textPadding = function() {return 4;}
function Window_PadlessSelectable() { this.initialize.apply(this, arguments); }
Window_PadlessSelectable.prototype = Object.create(Window_Selectable.prototype);
Window_PadlessSelectable.prototype.constructor = Window_PadlessSelectable;
Window_PadlessSelectable.prototype.standardPadding = function() {return 4;}
Window_PadlessSelectable.prototype.textPadding = function() {return 4;}