/*:
 * @author Eggshell97
 * @plugindesc Allows the game to run faster. Slower does not work for some reason.
 *
 * @param Default Override Multiplier
 * @type number
 * @desc The default multiplier that will be applied to the game speed, roughly
 * Default: 1
 * @default 1
 *
 * @help
 * THIS AFFECTS ALMOST EVERYTHING.
 * 
 * The way this works with saving is a bit weird but hopefully that's okay.
 * 
 * You can change the speed multiplier midgame by running the following script:
 * E97.setClockMultiplier(#);
 * 
 * I recommend sticking to whole numbers. Set to 1 for default speed.
 * Setting this to anything higher than 4 will start to lag even okay computers.
*/

// Parameters, which I hopefully did not mess up
var params = PluginManager.parameters("E97_FrameClockOverride");

// This is the setup for the value actually affecting the speed
var E97 = E97 || {};
E97._frameClockOverride = parseInt(params["Default Override Multiplier"]) || 1;

// Makes it so saved game speed is loaded when the $gameSystem starts
const old_systemOnAfterLoad = Game_System.prototype.onAfterLoad;
Game_System.prototype.onAfterLoad = function() {
	old_systemOnAfterLoad.call(this);
	E97._frameClockOverride = this._savedClockOverride || E97._frameClockOverride;
}

// Changes the multiplier
E97.setClockMultiplier = function(multiplier) {
	if ($gameSystem) {
		$gameSystem._savedClockOverride = multiplier;
	}
	E97._frameClockOverride = multiplier;
}

// The function that is changed
// The basegame version exists in OmoriFixes, but does not have the SceneManager prefix
SceneManager.determineRepeatNumber = function(deltaTime) {
	this._smoothDeltaTime *= 0.8;
	this._smoothDeltaTime += Math.min(deltaTime, 2) * 0.2 * E97._frameClockOverride;
	if (this._smoothDeltaTime >= 0.9) {
		this._elapsedTime = 0;
		return Math.round(this._smoothDeltaTime);
	} else {
		this._elapsedTime += deltaTime;
		if (this._elapsedTime >= 1) {
			this._elapsedTime -= 1;
			return 1;
		}
		return 0;
	}
}