/*:
 * @plugindesc Auto/Fix Turn Order
 * @author Geo
 *
 * @help
 * Basically un-does the hardcode turn order of party members and instead
 * turn order is decided by the position of the actors in the actor database OR
 * decided by their Battle Status Indexes. (Their portrait position in the battle.)
 *
 * If the parameter is set to "true", Turn Order is now based on the
 * "<BattleStatusIndex: number>" in their notetags.
 * (ORDER: 2 goes first, 0 goes second, 3 goes third, and 1 goes last.)
 *
 * 
 * @param Portrait Index Turn Order
 * @desc Set this to 'true' for this to instead be based on the "<BattleStatusIndex: number>" in the notetags of the actor. Set this to "false" to disable this.
 * @default false
 *
 *
 */
 
var beesList = beesList || {}; beesList.TurnOrder = beesList.TurnOrder || {};

// Plugin Parameters
var parameters = PluginManager.parameters('Geo_AutoTurnOrder');
// Initialize Parameters
beesList.TurnOrder.params = {};
beesList.TurnOrder.params.portraitIndex = String(parameters['Portrait Index Turn Order'] || false);

{
BattleManager.getActorInputOrder = function() {
  let members = $gameParty.members();
  let order = [];
  for (let i = 0; i < members.length; i++) {
    let actorID = members[i].actorId();
    order.push(actorID);
  };
  order.sort(function(a, b){return a-b});
  let portraitIndex = beesList.TurnOrder.params.portraitIndex
  var portraitTrue = (String(portraitIndex).toLowerCase() === 'true');
  if (portraitTrue) {
	  let sObject = {}
      var ordering = {2:1, 0:2, 3:3, 1:4};
      for (let i = 0; i < order.length; i++) {
        let statusIndex = $gameActors.actor(order[i]).actor().meta.BattleStatusIndex;
		var objNumber = order[i].toString();
        sObject = { ...sObject, [objNumber]: ordering[statusIndex] };
    };
   order.sort(function(a,b) { return sObject[a] - sObject[b]; })
  };
  let list = [];
  for (let i = 0; i < order.length; i++) {
    let index = members.indexOf($gameActors.actor(order[i]));
    if (index > -1 && members[index].isAlive() && members[index].isBattleMember()) { list.push(index); }
  };
  return list;
};
}