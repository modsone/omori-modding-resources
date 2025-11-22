
  /*:
 * @plugindesc v1.00000000000000000000000000000000000001 Allows you to toggle the mouse ON/OFF.
 * @author Dying Pregnant Hyena
 *
 * 
 * @help
 * Base OMORI strictly disables mouse controls instead of letting you toggle them.
 * This fixes that.
 * Do EnableMouse() in a script call to enable mouse usage.
 * Do DisableMouse() in a script call to disable mouse usage.
 */

// I DONT KNOW WHY THE FUCK I HAVE TO DO THIS BUT APPARENTLY OMOEXE IS BROKEN SO

// const oldstart = Scene_Boot.prototype.start

// Scene_Boot.prototype.start = function() {
//  oldstart.call(this)
//  $gameSystem._MouseToggle == true
// };

TouchInput._onMouseDown = function(event) {
    if (typeof DataManager.MouseToggle !== "undefined") {
	if (DataManager.MouseToggle == true) {
    if (event.button === 0) {
        this._onLeftButtonDown(event);
    } else if (event.button === 1) {
        this._onMiddleButtonDown(event);
    } else if (event.button === 2) {
        this._onRightButtonDown(event);
    }
	} else {
	// Overwrite to do nothing
	}
    }

};

EnableMouse = function() {
DataManager.MouseToggle = true
}

DisableMouse = function() {
DataManager.MouseToggle = false
}