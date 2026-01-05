//=============================================================================
 /*:
 * @plugindesc
 * This plugin adds additional functions to make follower movement in cutscenes easier.
 *
 * @author Rawberry
 * @help
 * There are two main ways to handle cutscenes with the extra functions.
 * 
 * 
 * In a script block:
 * RWB_Follower.storePositions() - Will store the positions of your followers at the moment of call.
 * 
 * RWB_Follower.relocateFollowers() - Will move your followers to the stored position
 * 
 * These two are best used with the Exhydra Follower functions ("exaFC").
 * 
 * ♥
 * 
 * RWB_Follower.attachEvent(event, followerId) - Will move an event to the exact position and direction of the chosen follower.
 * 
 * This accepts both event id and event name.
 * ie. RWB_Follower.attachEvent(3, 0) - Attaches event 3 to the first follower.
 * RWB_Follower.attachEvent("SUNNY", 2) - Attaches an event named "SUNNY" to the third follower. Best used with unique event name.
 * 
 * RWB_Follower.eventIsAttached(event, followerId) - Returns true when the target event is attached to the follower.
 * 
 * The inputs for event and follower are the sae as the above script.
 * This is best used in a plugin command block like so: Wait For Condition RWB_Follower.eventIsAttached("OMARI", 0)
 * This will make the game wait until the event is attached before continuing.
 * 
 * 
 * You can then use Movement Route, Balloon, etc. event blocks on the event to mimic it being used on the follower.
 * It is recommended to turn off Show Player Followers during the cutscene and reactivate it after.
 * You can use these to mimic OMORI's cutscene style with significantly less script calls.
 * If you make your event names the same every map you can make a common event to start cutscene movement.
 * 
 * 
 */
//=============================================================================


var RWB_Follower = RWB_Follower || {};


RWB_Follower.storePositions = function() {
  $gameTemp._followerPositions = [];
  var old_followers = $gamePlayer._followers._data;
  var followers = [];
  for (i = 0; i < old_followers.length; i++) {
    if (old_followers[i]._characterName !== "") {
      followers.push(i);
    }
  }

  followers.forEach(function(followerid) {
    var cur_follower = $gamePlayer.followers().follower(followerid);
    var cur_follower_positions = {
      id: followerid,
      x: cur_follower.x,
      y: cur_follower.y,
      dir: cur_follower.direction()
    };
    $gameTemp._followerPositions.push(cur_follower_positions);
  });
};

RWB_Follower.relocateFollowers = function() {
  if (typeof $gameTemp._followerPositions !== "object" || $gameTemp._followerPositions.length < 1) {
    return;
  }
  var follower_positions = $gameTemp._followerPositions;
  follower_positions.forEach(function(cur_follower) {
    $gamePlayer.followers().follower(cur_follower.id).locate(cur_follower.x, cur_follower.y);
    $gamePlayer.followers().follower(cur_follower.id).setDirection(cur_follower.dir);
  });

  $gameTemp._followerPositions = undefined;

};


RWB_Follower.attachEvent = function(target, followerId) {
  var follower = $gamePlayer.followers().follower(followerId);
  var eventId = 1;
  if (typeof target === "string") {
    eventId = $dataMap.events.find(e => e && e.name == target).id;
  } else {
    eventId = target;
  }
  $gameMap.event(eventId).locate(follower.x, follower.y);
  $gameMap.event(eventId).setDirection(follower.direction());
}

RWB_Follower.eventIsAttached = function(target, followerId) {
  var follower = $gamePlayer.followers().follower(followerId);
  var eventId = 1;
  if (typeof target === "string") {
    eventId = $dataMap.events.find(e => e && e.name == target).id;
  } else {
    eventId = target;
  }
  return $gameMap.event(eventId).pos(follower.x, follower.y);
}