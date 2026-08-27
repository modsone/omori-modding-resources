/*:
 * @author Eggshell97
 * @plugindesc Allows the speed of RPG Maker jumps to be changed.
 *
 * @help
 * Set the character's _jumpSpeedFactor property to a number between 0 and 1 to slow it down
 * The closer to 1, the slower, but the parabola gets messed up, so I keep it around 0.5
 * Do not set it to 1 or higher, or to a negative value
 * No idea how to fix speeding it up or the parabola movement
*/

var E97 = E97 || {};

// Maybe this dumb strategy will work
E97.characterBaseUpdateJump = Game_CharacterBase.prototype.updateJump;

Game_CharacterBase.prototype.updateJump = function() {
    this._jumpCount += this._jumpSpeedFactor || 0;
    E97.characterBaseUpdateJump.call(this);
}