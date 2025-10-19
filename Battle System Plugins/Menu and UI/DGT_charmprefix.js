/*:
 * @plugindesc Adds dynamic battle status face name prefixes based on equipped armor notetag. (v1.0)
 * @author Draught
 * 
 * @help
 * =============================================================================
 * Introduction
 * =============================================================================
 * This plugin allows an actor’s battle status face name to be dynamically modified 
 * based on the first equipped armor’s notetags. If the equipped armor has a 
 * `<PortraitPrefix: XYZ>` note tag, the actor’s face name will be updated to:
 * 
 *    {Prefix}_{OriginalName}
 * 
 * =============================================================================
 * How to Use
 * =============================================================================
 * 1. Add a note tag to an armor in the database:
 * 
 *    <PortraitPrefix: Sunglasses>
 * 
 * 2. Equip the armor on an actor.
 * 3. The actor’s battle status face name will update dynamically.
 * 
 * =============================================================================
 * Example
 * =============================================================================
 * - Original face name: 01_BATTLE_OMORI
 * - Equipped armor has <PortraitPrefix: Sunglasses>
 * - The new battle status face name becomes: Sunglasses_01_BATTLE_OMORI
 * 
 * If no armor with the note tag is equipped, the default face name is used.
 * 
 * =============================================================================
 * Notes
 * =============================================================================
 * - Only the first equipped armor is checked.
 * - If no <PortraitPrefix: name> tag is found, the original face name remains 
 * unchanged.
 * 
 * =============================================================================
 * Versions
 * =============================================================================
 * v1.0.0 - Initial release.
 * 
 */


{
  let old = Game_Actor.prototype.battleStatusFaceName
    Game_Actor.prototype.battleStatusFaceName = function() {
      let truename = old.call(this)
      let charm = this.armors()[0]
			if (!charm) {return truename}
      let name = charm.meta.PortraitPrefix
      if (name) {
        return  `${name.trim()}_${truename}`
      }
			return truename
    }
}
