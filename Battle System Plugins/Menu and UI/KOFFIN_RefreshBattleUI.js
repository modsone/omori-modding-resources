/*:
 * @plugindesc Refresh Battle UI
 * @author KoffinKrypt
 *
 * @help
 * Makes so that you can refresh the battle UI mid-battle
 * after changing the WORLD VALUE like in the console version.
 * 
 * How to use:
 * Use the script call command in a battle event page and type this:
 * SceneManager._scene.refreshBattleUI()
 * 
 * Be sure to set the WORLD VALUE (variable 22)
 * BEFORE the script call.
 * 
 */
Scene_Battle.prototype.refreshBattleUI = function() {
    // Remove and recreate Party Command Window sprites
    this._partyCommandWindow._commandSprites.forEach(sprite => sprite.destroy());
    this._partyCommandWindow.createCommandSprites();
    this._partyCommandWindow.refresh();

    // Manually refresh the party command window
    this._partyCommandWindow.refresh();

    // Manually destroy and recreate Actor Command Window sprites
    this._actorCommandWindow._commandSprites.forEach(sprite => sprite.destroy());
    this._actorCommandWindow.createCommandSprites();
    this._actorCommandWindow.refresh();

    // Manually refresh the actor command window
    this._actorCommandWindow.refresh();

    // Reload EKG
    this._stressBar.updateBackgroundImage();
    this._stressBar.refreshEKGBitmap();
};
