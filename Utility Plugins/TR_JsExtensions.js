//=============================================================================
// JS Extensions - By TomatoRadio
// TR_JsExtensions.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_JsExtensions = true;

var TR = TR || {};
TR.JSEXT = TR.JSEXT || {};
TR.JSEXT.version = 1;

/*: 
 * @plugindesc v1.0 Adds more JS functions to RPG Maker MV
 * @author TomatoRadio
 * 
 * @help
 * OMORI runs using a pre-2020 version of nwjs, meaning
 * that newer JS functions don't work with it.
 * 
 * This plugin adds some of those functions.
 * 
 * Currently added functions:
 * (Plugins with the TR object are not from
 * the JS baseline but from myself, though
 * they may be based from the JS baseline.)
 * 
 * TR.NullCoal()
 * TR.XOR()
 * 
 * Array.at()
 * Array.findLast()
 * Array.findLastIndex()
 * Array.flat()
 * Array.flatMap()
 * Array.toReversed()
 * Array.toSorted()
 * Array.toSpliced()
 * Array.with()
 * 
 * Object.fromEntries
 * 
*/

/**
 * Returns the first item of the Array to not be
 * nullish (null or undefined).
 * @param {Array} operators An array of the operators.
 * @param {*} fallback The item to be returned if the entire Array is nullish. Defaults to null.
 * @return {*} The first item in the array to not be null or undefined.
 */
TR.NullCoal = function(operators, fallback = null) {
	for (const thing of operators) {
		if (thing !== undefined && thing !== null) {
			return thing;
		}
	}
	return fallback;
}

/**
 * Returns true if exactly one of the two arguments
 * are truthy.
 * 
 * @param {*} first 
 * @param {*} second 
 * @return {Boolean} Boolean
 */
TR.XOR = function(first,second) {
	let truth = 0;
	if (first) truth++
	if (second) truth++
	if (truth === 1) return true;
	return false;
}

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

