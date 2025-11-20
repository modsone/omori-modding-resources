//=============================================================================
// Stahl Plugin - Enemy Spawn
// Stahl_EnemySpawn.js    VERSION 1.0.1
//=============================================================================

var Imported = Imported || {};
Imported.Stahl_EnemySpawn = true;

var Stahl = Stahl || {};
Stahl.EnemySpawn = Stahl.EnemySpawn || {};

//=============================================================================
 /*:
 * @plugindesc Enemy spawning, alters HIME_EnemyReinforcements
 * @author ReynStahl, Draught
 * @help
 * Plugin Scripts added/changed:
 * add_enemy <memberId> from troop <troopId> <x> <y> <stateParentIndex>
 *     If memberId = -1, randomize ID
 * add_enemy_random <troopId> <amountSummon> <stateParentIndex>
 * 
 * stateParentIndex is the index of the enemy to copy states from (WIP)
 * 
 * New functions:
 * Game_Enemy.prototype.spawnRandomEnemy = function(troopId, amountSummon = 1, copyState = false)
 * Spawns random enemy from troop troopId, relative to the calling Enemy
 * 
 * Notetags:
 * <SpawnOffsetX:Number>
 * Number - x coordinate
 * X offset for the enemy spawned with spawnRandomEnemy
 * 
 * <SpawnOffsetY:Number>
 * Number - y coordinate
 * Y offset for the enemy spawned with spawnRandomEnemy
 */
//=============================================================================

{
	Game_Troop.prototype.addReinforcementMember = function(troopId, memberId, member, mx, my, stateParent) {  
		if ($dataEnemies[member.enemyId]) {
		  	var enemyId = member.enemyId;
		  	var x = mx === undefined ? member.x : mx;
		  	var y = my === undefined ? member.y : my;
		  	var enemy = new Game_Enemy(enemyId, x, y);
		  	let parent = $gameTroop.members()[stateParent]
		  	if (parent) {
				parent._states.filter(x => x != 1).forEach(id => enemy.addState(id))
		  	}
		  	enemy.setTroopId(troopId);
		  	enemy.setTroopMemberId(memberId);
		  	if (member.hidden) {
				  enemy.hide();
		  	}
		  	this._enemies.push(enemy);
		  	this._newEnemies.push(enemy);
		}   
	}
	  
	Game_Troop.prototype.addEnemyReinforcement = function(troopId, memberId, mx, my, stateParent) {
		var troop = $dataTroops[troopId];
		var memberAmount = troop.members.length;
		if (memberId < 0)
			memberId = randomIntRange(1, memberAmount);

		var member = troop.members[memberId - 1];
		this.addReinforcementMember(troopId, memberId, member, mx, my, stateParent);
		this.makeUniqueNames();
		BattleManager.refreshEnemyReinforcements();
	};

	Game_Enemy.prototype.spawnRandomEnemy = function(troopId, amountSummon = 1, copyState = false) {
		var memberAmount = $dataTroops[troopId].members.length;
		var spacing = 160;
		var baseOffset = (amountSummon-1) * -(spacing/2);

		var xOffset = Number(this.enemy().meta.SpawnOffsetX) || 0;
		var yOffset = Number(this.enemy().meta.SpawnOffsetY) || 0;

		debugger;

		for (let i = 0; i < amountSummon; i++){
			var mx = this._screenX + xOffset + baseOffset + (i * spacing);
			var my = this._screenY + yOffset + randomIntRange(-10, 10);
			var memberId = randomIntRange(1, memberAmount);
			if (copyState) 
				$gameTroop.addEnemyReinforcement(troopId, memberId, mx, my, this.index());
			else
				$gameTroop.addEnemyReinforcement(troopId, memberId, mx, my, undefined);
		};
	};
	/***************************************************************************/
	const resolve = x => {
		if (x === 'null') {return undefined}
		let match = `${x}`.match(/(v)?(.+)/)
		if (!match) {return x}
		if (match[1]) {
		  return Math.floor($gameVariables.value(Math.floor(match[2])))
		}
		return Math.floor(x)
	}
	//returns an integer random number between min (included) and max (included)
	function randomIntRange(min, max) {
		return Math.floor(Math.random()*(max-min+1)+min);
	};
  	const old_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		switch (command.toLowerCase()) {
			case "add_enemy":
				var troopId = resolve(args[3]);
				var memberId = resolve(args[0]);
				var mx = args[4] && resolve(args[4]);
				var my = args[5] && resolve(args[5]);
				var stateParent = args[6] && resolve(args[6])
				$gameTroop.addEnemyReinforcement(troopId, memberId, mx, my, stateParent)
			case "add_enemy_random":
				var troopId = resolve(args[0]);
				var amountSummon = resolve(args[1]);
				var stateParent = args[2] && resolve(args[2])

				var troop = $dataTroops[troopId];
				var memberAmount = troop.members.length;
				var spacing = (500 / (amountSummon + 1));
				for (let i = 0; i < amountSummon; i++){
					var mx = randomIntRange(160, 200) + (i + 1) * spacing;
					var my = randomIntRange(430, 440);
					var memberId = randomIntRange(1, memberAmount);
					$gameTroop.addEnemyReinforcement(troopId, memberId, mx, my, stateParent);
				};
			default:
				old_pluginCommand.call(this, command, args);
		}
  	};
};