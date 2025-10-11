//=============================================================================
// Fix Default Text Color - By TomatoRadio
// TR_FixDefaultTextColor.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_FixDefaultTextColor = true;

var TR = TR || {};
TR.FDTC = TR.FDTC || {};
TR.FDTC.version = 1;

/*: 
 * @plugindesc v1.0 Allows changing the default text color by windowskin
 * @author TomatoRadio
 * 
 * @help
 * Makes it so that when calling for the base
 * text color (index 0) gets subbed out for a
 * different index based on the windowskin.
 * 
 * This basically means you can change the
 * default text color and it actually works
 * instead of taking a bit to change.
 * 
 * Read the plugin code for implementation.
 * 
*/

//ONLY EDIT THIS
//==================================================================================

TR.FDTC.Keypairs = 
{
"Window": 0,
"Window_Default": 0,
"Window_Basil": 24,
//Add your own here
};

//==================================================================================
//DONT EDIT BELOW THIS


if (!TR.NullCoal) {
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
	return fallback; };
};

TR.FDTC.IsolateSystemURL = function(bitmap) {
	return bitmap.url.replace("img/system/","").replace(".png","");
};

TR.FDTC.textColor = Window_Base.prototype.textColor;
Window_Base.prototype.textColor = function(n) {
	// If anyone is code digging and knows a way to make me not have to do this, please reach out.
	var skin = this instanceof Window_NameBox ? $gameSystem.windowskin() : TR.FDTC.IsolateSystemURL(this.windowskin);
	if (n === 0) n = TR.NullCoal([TR.FDTC.Keypairs[skin]],0);
	return TR.FDTC.textColor.call(this,n);
};