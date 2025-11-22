/*:
 * @plugindesc Enhances the equipment status window with dynamic stat comparisons, 
 * fake stat bonuses, and customizable indicators.
 *
 * @author KoffinKrypt
 *
 * @help
 * Use this script call and replace ACTOR_ID with the actual ID of your actor, 
 * and skillid with the ID of the skill to be unequipped
 *
 * $gameActors.actor(id).unequipSpecificSkill(skillid)
 *
 *
 * ============================================================================
 * Terms of Use:
 * ============================================================================
 *
 * Free to use and modify in your projects, with credit. (stop stealing my shit)
 *
 * @version 1.0
 */


// Add a new method to the Game_Actor class
Game_Actor.prototype.unequipSpecificSkill = function(skillId) {
    // Get the actor's skills
    var skills = this.skills();

    // Iterate through all skill slots
    for (var i = 0; i < skills.length; i++) {
        // Check if the skill at the current slot matches the specified skill ID
        if (skills[i] && skills[i].id === skillId) {
            // Unequip the skill from the current slot
            this.unequipSkill(i, 0);
            break; // Exit the loop after unequipping the skill
        }
    }
};


