//=============================================================================
// Stahl Plugin - Damage Tracker
// Stahl_BattleStats.js    VERSION 1.0.0
//=============================================================================

var Imported = Imported || {};
Imported.Stahl_BattleStats = true;

var Stahl = Stahl || {};
Stahl.BattleStats = Stahl.BattleStats || {};

Stahl.BattleStats.enableLog = false;
Stahl.BattleStats.turnLimit = 100; // TBA
Stahl.BattleStats.battleLimit = 10; // TBA

//=============================================================================
 /*:
 * @plugindesc v1.0.0 Gives handy functions related to tracking damage
 * @author ReynStahl
 * 
 * @help
 * Stuff
 */
//=============================================================================

{
    //================================================================
    // Game_BattleStatsBase
    //================================================================

    function Game_BattleStatsBase() {
        this.initialize.apply(this, arguments);
    }

    Game_BattleStatsBase.prototype.initialize = function() {
        this.resetStat();
    };

    Game_BattleStatsBase.prototype.resetStat = function() {
        this.hpDamage = 0;
        this.mpDamage = 0;
        this.hpHeal = 0;
        this.mpHeal = 0;
        this.hpDamageTaken = 0;
        this.mpDamageTaken = 0;
        this.hpHealTaken = 0;
        this.mpHealTaken = 0;
        this.deathsTaken = 0;
        this.revivesTaken = 0;
        this.deathsGiven = 0;
        this.revivesGiven = 0;
    };
    
    //================================================================
    // Game_BattleStats
    //================================================================

    function Game_BattleStats() {
        this.initialize.apply(this, arguments);
    }

    Game_BattleStats.prototype.initialize = function() {
        this._turn = new Game_BattleStatsBase();
        this._turnList = [];
        this._battle = new Game_BattleStatsBase();
        this._battleList = [];
        this._lifetime = new Game_BattleStatsBase();
    };
    
    Game_BattleStats.prototype.setStats = function(type, value) {
        this._turn[type] = value;
        this._battle[type] = value;
        this._lifetime[type] = value;
    }

    Game_BattleStats.prototype.addStats = function(type, value) {
        if (Stahl.BattleStats.enableLog)
            console.log("added stat: ", type, value);
        this._turn[type] += value;
        this._battle[type] += value;
        this._lifetime[type] += value;
    }

    Game_BattleStats.prototype.resetTurnStats = function() {
        this._turn.resetStat();
    }

    Game_BattleStats.prototype.resetBattleStats = function() {
        this._battle.resetStat();
        this._turnList = [];
    }
    
    //================================================================
    // Battler value setting
    //================================================================

    Game_Battler.prototype.initBattleStats = function() {
		this.battleStats = new Game_BattleStats();
    };

    const _old_Game_Battler_initMembers = Game_Battler.prototype.initMembers;
	Game_Battler.prototype.initMembers = function() {
		_old_Game_Battler_initMembers.call(this);
        this.initBattleStats();
	};

    //For some reason on Battle Start have to be split sperately
    const _old_Game_Actor_onBattleStart = Game_Actor.prototype.onBattleStart;
	Game_Actor.prototype.onBattleStart = function() {
        _old_Game_Actor_onBattleStart.call(this);
        if (this.battleStats == undefined) {
            this.initBattleStats();
        } else {
            this.battleStats.resetTurnStats();
            this.battleStats.resetBattleStats();
        }
    }

    const _old_Game_Enemy_onBattleStart = Game_Enemy.prototype.onBattleStart;
	Game_Enemy.prototype.onBattleStart = function() {
        _old_Game_Enemy_onBattleStart.call(this);
        if (this.battleStats == undefined) {
            this.initBattleStats();
        } else {
            this.battleStats.resetTurnStats();
            this.battleStats.resetBattleStats();
        }
    }

    const _old_Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
	Game_Battler.prototype.onBattleEnd = function() {
        _old_Game_Battler_onBattleEnd.call(this);
        var stats = this.battleStats;
        var battleCount = $gameSystem.battleCount();
        stats._battleList[battleCount] = Object.assign({}, stats._battle);
    }

	const _old_Game_Battler_onTurnEnd = Game_Battler.prototype.onTurnEnd;
	Game_Battler.prototype.onTurnEnd = function() {
		_old_Game_Battler_onTurnEnd.call(this);
        if ($gameParty.inBattle()) {
            var stats = this.battleStats;
            var turnCount = $gameTroop.turnCount();
            stats._turnList[turnCount] = Object.assign({}, stats._turn);
            this.battleStats.resetTurnStats();
        };
	};

    //================================================================
    // Tracking action
    //================================================================

    // ==== Track latest caster for attribution ==== //
    const _old_Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        user = this.subject();
        BattleManager._latestCaster = user;
        console.log("latest caster: ", user);
        _old_Game_Action_apply.call(this, ...arguments);
    };

    // ==== Detect if latest action is by system ==== //
    // Change HP
    const _old_Game_Interpreter_command311 = Game_Interpreter.prototype.command311;
    Game_Interpreter.prototype.command311 = function() {
        BattleManager._systemAction = true;
        _old_Game_Interpreter_command311.call(this, ...arguments);
		return true;
    };

    // Change MP
    const _old_Game_Interpreter_command312 = Game_Interpreter.prototype.command312;
    Game_Interpreter.prototype.command312 = function() {
        BattleManager._systemAction = true;
        _old_Game_Interpreter_command312.call(this, ...arguments);
		return true;
    };

    // Change Enemy HP
    const _old_Game_Interpreter_command331 = Game_Interpreter.prototype.command331;
    Game_Interpreter.prototype.command331 = function() {
        BattleManager._systemAction = true;
        _old_Game_Interpreter_command331.call(this, ...arguments);
		return true;
    };

    // Change Enemy MP
    const _old_Game_Interpreter_command332 = Game_Interpreter.prototype.command332;
    Game_Interpreter.prototype.command332 = function() {
        BattleManager._systemAction = true;
        _old_Game_Interpreter_command332.call(this, ...arguments);
		return true;
    };

    // ==== Regenerations are for now considered system ====//
    const _old_Game_Battler_regenerateHp = Game_Battler.prototype.regenerateHp;
    Game_Battler.prototype.regenerateHp = function() {
        BattleManager._systemAction = true;
        _old_Game_Battler_regenerateHp.call(this, ...arguments);
    };
    
    const _old_Game_Battler_regenerateMp = Game_Battler.prototype.regenerateMp;
    Game_Battler.prototype.regenerateMp = function() {
        BattleManager._systemAction = true;
        _old_Game_Battler_regenerateMp.call(this, ...arguments);
    };
    
    Game_Battler.prototype.regenerateAll = function() {
        if (this.isAlive()) {
            BattleManager._systemAction = true;
            this.regenerateHp();
            this.regenerateMp();
            this.regenerateTp();
        }
    };

    //================================================================
    // Update Values
    //================================================================

    // HP changes
    const _old_Game_Battler_gainHp = Game_Battler.prototype.gainHp;
    Game_Battler.prototype.gainHp = function(value) {
        _old_Game_Battler_gainHp.call(this, ...arguments);
        if (BattleManager._systemAction) {
            BattleManager._systemAction = null;
        } else {
            if (value > 0)
                if (BattleManager._latestCaster) BattleManager._latestCaster.battleStats.addStats("hpHeal", value);
            else
                if (BattleManager._latestCaster) BattleManager._latestCaster.battleStats.addStats("hpDamage", -value);
        };

        if (value > 0) 
            this.battleStats.addStats("hpHealTaken", value);
        else 
            this.battleStats.addStats("hpDamageTaken", -value);
    };

    // MP changes
    const _old_Game_Battler_gainMp = Game_Battler.prototype.gainMp;
    Game_Battler.prototype.gainMp = function(value) {
        _old_Game_Battler_gainMp.call(this, ...arguments);
        if (BattleManager._systemAction) {
            BattleManager._systemAction = null;
        } else {
            if (value > 0)
                if (BattleManager._latestCaster) BattleManager._latestCaster.battleStats.addStats("mpHeal", value);
            else
                if (BattleManager._latestCaster) BattleManager._latestCaster.battleStats.addStats("mpDamage", -value);
        };

        if (value > 0) 
            this.battleStats.addStats("mpHealTaken", value);
        else 
            this.battleStats.addStats("mpDamageTaken", -value);
    };


    // Death and Revives, Split into enemy and actor as battler doesn't work
    const _old_Game_Enemy_die = Game_Enemy.prototype.die;
    Game_Enemy.prototype.die = function() {
        _old_Game_Enemy_die.call(this);
        if (BattleManager._systemAction) {
            BattleManager._systemAction = null;
        } else {
            if (BattleManager._latestCaster) BattleManager._latestCaster.battleStats.addStats("deathsGiven", 1);
        };

        this.battleStats.addStats("deathsTaken", 1);
    };

    const _old_Game_Enemy_revive = Game_Enemy.prototype.revive;
    Game_Enemy.prototype.revive = function() {
        _old_Game_Enemy_revive.call(this);
        if (BattleManager._systemAction) {
            BattleManager._systemAction = null;
        } else {
            if (BattleManager._latestCaster) BattleManager._latestCaster.battleStats.addStats("revivesGiven", 1);
        };

        this.battleStats.addStats("revivesTaken", 1);
    };

    const _old_Game_Actor_die = Game_Actor.prototype.die;
    Game_Actor.prototype.die = function() {
        _old_Game_Actor_die.call(this);
        if (BattleManager._systemAction) {
            BattleManager._systemAction = null;
        } else {
            if (BattleManager._latestCaster) BattleManager._latestCaster.battleStats.addStats("deathsGiven", 1);
        };

        this.battleStats.addStats("deathsTaken", 1);
    };

    const _old_Game_Actor_revive = Game_Actor.prototype.revive;
    Game_Actor.prototype.revive = function() {
        _old_Game_Actor_revive.call(this);
        if (BattleManager._systemAction) {
            BattleManager._systemAction = null;
        } else {
            if (BattleManager._latestCaster) BattleManager._latestCaster.battleStats.addStats("revivesGiven", 1);
        };

        this.battleStats.addStats("revivesTaken", 1);
    };
}