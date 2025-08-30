/*:
 * @plugindesc Changes the battle follow-up speech bubble for a specific actor. (v1.0)
 * @author Draught
 * 
 * @help
 * =============================================================================
 * Introduction
 * =============================================================================
 * This plugin allows you to replace the default ACS_Bubble image with an 
 * alternate version for a specific actor during follow-up actions in battle. 
 * If the designated actor is in the party, the alternate bubble image will be used.
 * 
 * =============================================================================
 * How to Use
 * =============================================================================
 * 1. Place an alternate speech bubble image in img/system/.
 * 2. Set the SPRITE_NAME variable inside the script to match the filename 
 *    of the alternate bubble image (without the `.png` extension).
 * 3. Set ACTOR_ID to the actor whose follow-up speech bubbles should change.
 * 4. The script will automatically swap the speech bubble image during battles 
 *    if the actor is in the party.
 * 
 * =============================================================================
 * Configuration
 * =============================================================================
 * Inside the script, change the following variables:
 * 
 * let SPRITE_NAME = 'alt_ACS_Bubble' // Name of the alternate bubble image (no .png)
 * let ACTOR_ID = 20 // ID of the actor that triggers the change
 * 
 * =============================================================================
 * Example
 * =============================================================================
 * - Default bubble image: ACS_Bubble.png
 * - Alternate bubble image: alt_ACS_Bubble.png
 * - Actor ID set to 20
 * 
 * If actor 20 is in the party, alt_ACS_Bubble.png will be used instead 
 * of ACS_Bubble.png. If the actor is not present, the default bubble is used.
 * 
 * =============================================================================
 * Notes
 * =============================================================================
 * - The alternate image must be in img/system/.
 * - The change only applies if the specified actor is in the battle party.
 * - This does not affect other actors; only the specified one.
 * 
 * =============================================================================
 * Versions
 * =============================================================================
 * v1.0.0 - Initial release.
 */


{
  let SPRITE_NAME = 'alt_ACS_Bubble' // should be the name of the alternate bubble image in img/system (without the png)
  let ACTOR_ID = 20 // change this to the actor id you want to change the follow up bubbles to change for

  let old_lsi = Scene_Boot.loadSystemImages
  Scene_Boot.loadSystemImages = function() {
    old_lsi.call(this)
    ImageManager.reserveSystem(SPRITE_NAME)
  }
  let old_load = ImageManager.loadSystem
  ImageManager.loadSystem = function(img) {
    if (img !== 'ACS_Bubble') {return old_load.call(this, img)}
    if (!$gameParty) {return old_load.call(this, img)}
    if (!$gameParty.battleMembers().find(x=>x._actorId===ACTOR_ID)) {return old_load.call(this, img)}
    return old_load.call(this, SPRITE_NAME)
  }
}