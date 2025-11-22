 /*:
 * @plugindesc [v1.0.1] Adds category for enemies with bestiary extended support.
 * @author ReynStahl
 * @help
 * Adds category for enemies and keep track of defeats. 
 * Also supports bestiary extended display if the plugin exists.
 * 
 * On Enemy Note tag
 * <Category: String>
 * String - Name of Category
 * 
 * Dependencies: IF EXIST - Put BELOW BestiaryExtended
 */

var Stahl = Stahl || {};
Stahl.EnemyCategory = Stahl.EnemyCategory || {};

Stahl.EnemyCategory.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
  if (!Stahl.EnemyCategory.DataManager_isDatabaseLoaded.call(this)) return false;

  if (!Stahl.EnemyCategory.loaded) {
    this.processEnemyCategoryNotetags1($dataEnemies);
    Stahl.EnemyCategory.loaded = true;
  }
  
  return true;
};

DataManager.processEnemyCategoryNotetags1 = function(group) {
    for (var n = 1; n < group.length; n++) {
        var obj = group[n];
        var notedata = obj.note.split(/[\r\n]+/);

        obj.category = [];

        for (var i = 0; i < notedata.length; i++) {
            var line = notedata[i];
            if (line.match(/<CATEGORY:[ ](.*)>/i)) {
                obj.category.push(String(RegExp.$1).toUpperCase())
            }
        }
    }
};

/**
 * Gets the data for the group names.
 * @returns 
 */
BestiaryManager.getCategoryNameData = function() {
    return LanguageManager.getTextData('reverie_bestiary', 'CategoryName');
}

/**
 * Whether to do group lines added to bestiary.
 * @returns 
 */
BestiaryManager.doGroupLines = function(bestiary) {
    return !$gameTemp._rvGuideBestiary && bestiary.pageNumber == 1 && !bestiary.recentLockedPage;
}

/**
 * Gets array of lines that display enemy group.
 * @param {*} enemyId 
 * @returns 
 */
BestiaryManager.getEnemyCategoryLines = function(enemyId) {
    var data = this.getCategoryNameData();
    var stringList = this.getEnemyCategoryNames(enemyId);

    const title = data.title ? data.title : "GROUP: ";
    const outputLine = title + stringList.join(", ");
    return [outputLine, ""]
}

/**
 * Returns array of category string name based off enemy
 * @param {*} enemyId enemy ID
 * @returns String[]
 */
BestiaryManager.getEnemyCategoryNames = function(enemyId) {
    var enemyData = $dataEnemies[enemyId];
    var categories = enemyData.category;
    var data = this.getCategoryNameData();
    var stringList = [];
    for (let category of categories) {
        stringList.push(data[category] ? data[category] : category)
    }
    return stringList;
}

/**
 * Value keeping track whether to do Enemy Defeat counting.
 */
BestiaryManager._allowDefeatCount = true;

/**
 * Sets whether to do Enemy Defeat counting.
 * Can be useful for certain case where shouldn't count, like special areas.
 * @param {*} value boolean
 */
BestiaryManager.setAllowDefeatCount = function(value) {
    this._allowDefeatCount = value;
}

/**
 * Returns whether to do Enemy Defeat counting.
 * @returns 
 */
BestiaryManager.allowDefeatCount = function() {
    return this._allowDefeatCount;
}

// Alias from Bestiary Extended
BestiaryManager.modifyLines = function(lines, bestiary) {
    if (!this.doGroupLines(bestiary)) {
        return lines;
    }
    var enemyCategoryLine = BestiaryManager.getEnemyCategoryLines(bestiary._enemyListWindow.enemyId());
    return enemyCategoryLine.concat(lines);
}

// Initialize variable
Stahl.EnemyCategory.Game_Party_initialize = Game_Party.prototype.initialize;
Game_Party.prototype.initialize = function() {
    Stahl.EnemyCategory.Game_Party_initialize.call(this);
    this._defeatedEnemyCategories = {};
};

/**
 * Only triggers when enemies properly dies. Adds to defeated enemy category.
 * @param {*} enemy
 */
Game_Party.prototype.addTrueDefeatedEnemy = function(enemy) {
    var enemyData = enemy.enemy();
    var enemyCategories = enemyData.category;
    this._defeatedEnemyCategories = this._defeatedEnemyCategories || {}; // Initialize misses existing save
    for (let category of enemyCategories) {
        if (this._defeatedEnemyCategories[category]) {
            this._defeatedEnemyCategories[category] += 1;
        } else {
            this._defeatedEnemyCategories[category] = 1;
        }
        console.log("Added Defeated Enemy Category, Count:", category, this._defeatedEnemyCategories[category])
    }
};

/**
 * Returns count of enemies defeated of that category
 * @param {*} category String : category
 * @returns int
 */
Game_Party.prototype.getDefeatedEnemyCategoryCount = function(category) {
    return this._defeatedEnemyCategories[category];
}

// Own variant, as base omori defeated enemy is added on start as well, more like "Encountered" than actually defeated
Stahl.EnemyCategory.Game_Enemy_die = Game_Enemy.prototype.die;
Game_Enemy.prototype.die = function() {
    if (BestiaryManager.allowDefeatCount()) {
        $gameParty.addTrueDefeatedEnemy(this);
    }
    Stahl.EnemyCategory.Game_Enemy_die.call(this);
};

Game_Enemy.prototype.isEnemyCategory = function(string) {
    var enemyData = this.enemy();
    if (!enemyData.category) { return false; }
    return enemyData.category.contains(string);
};