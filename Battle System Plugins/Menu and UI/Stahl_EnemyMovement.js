 /*:
 * @plugindesc [v1.0.0] Allows moving enemy sprites in troop, spawning and collapse.
 * @author ReynStahl
 * @help
 * Dependency:
 * - Put this BELOW any plugin changing HIME reinforcement, such as Stahl_EnemySpawn
 * 
 * Changes:
 * - Enemy Reinforcement CREATE only new sprites, does not deleter and readd all troop
 * - Allow Spawn Animations
 * 
 * NOTE: When moving, enemy layering are based on y values. 
 *       Try to vary it or make sure the enemy have different ZIndex.
 * 
 * Plugin Commands:
 * move_enemy x y duration easingMode
 *   x y: Relative position to the "Home" position. null will use current position
 *   duration: Duration in frames, 0 will instantly teleport sprite. 0 by default.
 *   easingMode: Ease name used by TDDP_AnimationCurves.easingFunctions. "Linear" by default; Case Sensitive.
 * 
 * spawn_anim animName
 *   animName: Presets defined in Spriteset_Battle.prototype.appearNewSprite
 *     - instant: Appears instantly, the default
 *     - fall: Enemy falls from top off-screen
 * 
 * Enemy Notetag:
 * <DisappearOnDeath> - Makes enemy sprite invisible once it runs through death frame once.
 * <FlipOnDeath> - Makes enemy sprite flip and goes upwards on death. Paper-like animation.
 */

var Imported = Imported || {};
Imported.Stahl_EnemyMovement = true;

var Stahl = Stahl || {};
Stahl.EnemyMovement = Stahl.EnemyMovement || {};


// ================================================================ 
//          PLUGIN COMMANDS
// ================================================================


Stahl.EnemyMovement.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    // Not battle, none is relevant here
    if (!(SceneManager._scene instanceof Scene_Battle)) {
        return Stahl.EnemyMovement.Game_Interpreter_pluginCommand.call(this, command, args);
    }

    let resolve = x => {
        let match = `${x}`.match(/v(.+)/)
        if (!match) {return x}
        return $gameVariables.value(Math.floor(match[1]))
    }

    let enemySprites = SceneManager._scene._spriteset._enemySprites;
    switch (command.toLowerCase()) {
        // move_enemy x y duration easingMode
        case "move_enemy":
            var spriteIndex = args[0]
            var enemySprite = enemySprites[spriteIndex]
            var x = args[1] == "null" ? enemySprite._offsetX : Number(args[1])
            var y = args[2] == "null" ? enemySprite._offsetX : Number(args[2])
            var duration = args[3] || 0
            var easingMode = args[4] || "Linear"
            enemySprite.startMoveEase(x, y, duration, easingMode)
            break;
        case "spawn_anim":
            $gameTemp._spawnAnim = args[0]
        default:
            Stahl.EnemyMovement.Game_Interpreter_pluginCommand.call(this, command, args);
    }
};

// ================================================================ 
//          SPRITE MOVEMENT
// ================================================================
// Remove YEP Sideview restriction and make sprite always movable.
Game_Battler.prototype.spriteCanMove = function() {
    return true;
};

Sprite_Battler.prototype.startMove = function(x, y, duration) {
    if (this._targetOffsetX !== x || this._targetOffsetY !== y) {
        this._targetOffsetX = x;
        this._targetOffsetY = y;
        this._movementDuration = duration;

        // Extra data as tween uses begin and change in value instead
        this._beginOffsetX = this._offsetX;
        this._beginOffsetY = this._offsetY;
        this._totalMovementDuration = duration
        if (duration === 0) {
            this._offsetX = x;
            this._offsetY = y;
        }
    }
};

Sprite_Battler.prototype.startMoveEase = function(x, y, duration, easingMode) {
    this.startMove(x, y, duration)
    this._easingMode = easingMode
}

Sprite_Battler.prototype.updateMove = function() {
    let curves = TDDP_AnimationCurves.easingFunctions;
    let animate = curves[this._easingMode || "Linear"]

    if (this._movementDuration > 0) {
        var d = this._movementDuration;
        // this._offsetX = (this._offsetX * (d - 1) + this._targetOffsetX) / d;
        // this._offsetY = (this._offsetY * (d - 1) + this._targetOffsetY) / d;
        // t: current time, b: begInnIng value, c: change In value, d: duration
        var t = this._totalMovementDuration - this._movementDuration; // Original was a countdown, find time elapsed
        var d = this._totalMovementDuration

        this._offsetX = animate(t, this._beginOffsetX, this._targetOffsetX - this._beginOffsetX, d);
        this._offsetY = animate(t, this._beginOffsetY, this._targetOffsetY - this._beginOffsetY, d);

        this._movementDuration--;
        if (this._movementDuration === 0) {
            this.onMoveEnd();
        }
    }
};

// ================================================================ 
//          CUSTOM DEATH ANIM
// ================================================================
Stahl.EnemyMovement.Sprite_Enemy_initMembers = Sprite_Enemy.prototype.initMembers;
Sprite_Enemy.prototype.initMembers = function() {
  Stahl.EnemyMovement.Sprite_Enemy_initMembers.call(this);
  this._flipOnDeath = false;
  this._flipPhase = 0;
  this._flipPhaseFrames = 0;
  this._flipOrigY = 0;
};

Stahl.EnemyMovement.Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler;
Sprite_Enemy.prototype.setBattler = function(battler) {
    Stahl.EnemyMovement.Sprite_Enemy_setBattler.call(this, battler);
    if (this._enemy) {
        this._flipOnDeath = this._enemy.enemy().meta.FlipOnDeath;
        this._disappearOnDeath = this._enemy.enemy().meta.DisappearOnDeath;
    } else {
        this._flipOnDeath = false;
    }
};

Stahl.EnemyMovement.Sprite_Enemy_startCollapse = Sprite_Enemy.prototype.startCollapse;
Sprite_Enemy.prototype.startCollapse = function() {
    Stahl.EnemyMovement.Sprite_Enemy_startCollapse.call(this);
    if (this._flipOnDeath) {
        this._effectDuration = 64; // Original is 32
    }
};

Stahl.EnemyMovement.Sprite_Enemy_updateCollapse = Sprite_Enemy.prototype.updateCollapse;
Sprite_Enemy.prototype.updateCollapse = function() {
    if (this._flipOnDeath) {
        let curves = TDDP_AnimationCurves.easingFunctions;
        // t: current time, b: begInnIng value, c: change In value, d: duration
        switch (this._flipPhase) {
            case 0: // Flip
                this._mainSprite.scale.x = curves.SineInOut(this._flipPhaseFrames, 1, -2, 30);
                if (this._flipPhaseFrames >= 30) {
                    this._flipPhase += 1;
                    this._flipPhaseFrames = 0;
                    this._flipOrigY = this._offsetY; // Remember previous Y before moving
                }
                break;
            case 1: // Go Up
                this._offsetY = curves.QuadIn(this._flipPhaseFrames, this._flipOrigY, -800, 30);
                break;
        }
        this._flipPhaseFrames += 1;
    } else if (this._disappearOnDeath) {
        // If On last frame of motion
        if (this._pattern >= this.motionFrames() - 2) {
            this._deathDisappeared = true;
        }
    } else {
        Stahl.EnemyMovement.Sprite_Enemy_updateCollapse.call(this);
    };
};

// ================================================================ 
// Make Enemy Reinforcement CREATE only new sprites + Spawn Animations
// ================================================================
Stahl.EnemyMovement.Game_Troop_setup = Game_Troop.prototype.setup;
Game_Troop.prototype.setup = function(troopId) {
    Stahl.EnemyMovement.Game_Troop_setup.call(this, troopId);
    this._newEnemiesToDraw = [];
}

Stahl.EnemyMovement.Game_Troop_addReinforcementMember = Game_Troop.prototype.addReinforcementMember;
Game_Troop.prototype.addReinforcementMember = function(troopId, memberId, member) {    
    Stahl.EnemyMovement.Game_Troop_addReinforcementMember.call(this, ...arguments)
    
    let newEnemies = this._newEnemies;
    if (newEnemies.length > 0) {
        this._newEnemiesToDraw.push(newEnemies[newEnemies.length - 1])
    }
}

Spriteset_Battle.prototype.refreshEnemyReinforcements = function() {
    // this.removeEnemies();
    // this.createEnemies();
    // this.createEnemyReinforcements();
    this.createNewEnemies();
}

Spriteset_Battle.prototype.createNewEnemies = function() {
    var enemies = $gameTroop._newEnemiesToDraw;

    while (enemies.length > 0) {
        var enemy = enemies.pop();
        let newSprite = new Sprite_Enemy(enemy);
        // console.log(enemy, newSprite);

        this._battleField.addChild(newSprite);
        this._enemySprites.push(newSprite);

        this.appearNewSprite(newSprite);
    }
    this._enemySprites.sort(this.compareEnemySprite.bind(this));
};

Spriteset_Battle.prototype.appearNewSprite = function(newSprite) {
    if (!$gameTemp._spawnAnim) return;
    switch ($gameTemp._spawnAnim.toLowerCase()) {
        case "instant":
            break;
        case "fall":
            newSprite.startMove(0, -1000, 0)
            newSprite.startMoveEase(0, 0, 64, "QuadOut")
            break;
    }
}
