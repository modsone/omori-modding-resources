/*:
 * @author Eggshell97
 * @plugindesc Fixes the ExtraMovementFrames plugin to work on full sheets.
 *
 * @help
 * Should require no extra input here. Place somewhere below ExtraMovementFrames just in case.
*/

var E97 = E97 || {};

E97.old_characterBlockX = Sprite_Character.prototype.characterBlockX;

Sprite_Character.prototype.characterBlockX = function() {
    if (!this._character.isEmfCharacter()) {
        return E97.old_characterBlockX.call(this);
    } else {
        return this._character.characterIndex() % 4 * this._character._emfCharacterState.frameNum;
    }
}