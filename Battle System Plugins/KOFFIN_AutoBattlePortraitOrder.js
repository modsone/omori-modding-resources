/*:
 * @plugindesc Auto Battle Portrait Order
 * @author KoffinKrypt
 *
 * @help
 * Makes so that the position of the Battle Portraits are based on the order
 * each party member was added, so you don't have to manually set  
 * their Battle Status Indexes. 
 *
 *
 *
 */
 
//=============================================================================
// * Get Party Member Status Order
//=============================================================================
Game_Actor.prototype.battleStatusIndex = function () {
  // Check if the actor is the leader
  if ($gameParty.leader() === this) {
    return 2; // Leader is assigned number 2
  } else {
    // Check the index of the actor in the followers
    var followerIndex = $gameParty.members().indexOf(this) - 1;
    
    // Make sure the index is within the range of 0 to 2
    followerIndex = Math.max(0, Math.min(followerIndex, 2));

    // Follower 1 is assigned number 3, Follower 2 is assigned number 0, Follower 3 is assigned number 1
    return [3, 0, 1][followerIndex];
  }
};
