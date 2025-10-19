/*:
 * @plugindesc [Custom State Damage Face – Set a custom damage face for states using notetags.
 * @author Riomo
 *
 * @help
 * ==============================================================================
 *  CUSTOM STATE DAMAGE FACE
 * ==============================================================================
 * This plugin allows you to override the default damage face shown during battle
 * by using state notetags. When an actor takes damage and a state with a specific
 * notetag is active, the plugin will display a custom damage face based on the
 * row index defined in the state.
 *
 * ------------------------------------------------------------------------------
 * FEATURES:
 * ------------------------------------------------------------------------------
 * • Custom Damage Face:
 *   – Add the notetag <StateDamageFaceIndex: integer> to any state.
 *   – When an actor with that state takes damage, the plugin uses the specified
 *     row index from the actor's face sprite sheet for the damage popup.
 *   – If the notetag value is set to -1, the actor’s current face is maintained.
 *
 * ------------------------------------------------------------------------------
 * HOW TO USE:
 * ------------------------------------------------------------------------------
 * 1. Place this plugin in your RPG Maker MV project.
 * 2. Open the state’s note field in the database and add:
 *      <StateDamageFaceIndex: your_integer>
 *    Replace "your_integer" with the desired row index on the sprite sheet.
 * 3. During battle, when the actor takes damage, the custom damage face will be
 *    displayed according to the defined index.
 *
 */


if (!window.isStateDamageFaceLoaded) {
    // Every state that has "<StateDamageFaceIndex: integer>" in its notes will use
    // that index as the row on the sprite sheet to look up for the damage face
    // Set it to -1 to not change the face
    let oldUpdateDamage = Window_OmoriBattleActorStatus.prototype.updateDamage;
    Window_OmoriBattleActorStatus.prototype.updateDamage = function() {
        let faceOverride = -1;

        let actor = this.actor();
        if (actor && actor.isDamagePopupRequested()) {
            // Get Main State
            let state = actor.states()[0];
            let result = actor._damagePopup[0] || actor.result();

            if (state && state.meta.StateDamageFaceIndex !== undefined && result.hpDamage > 0) {
                let face = Number(state.meta.StateDamageFaceIndex);
                if (face === -1) {
                    // Just set to same face as before
                    faceOverride = this._faceSprite._animRow;
                } else {
                    faceOverride = face;
                }
            }
        }

        oldUpdateDamage.call(this);

        if (faceOverride !== -1) {
            this._faceSprite.setAnimRow(faceOverride);
        }
    };

    window.isStateDamageFaceLoaded = true;
}
