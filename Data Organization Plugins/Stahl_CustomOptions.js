/*:
* @plugindesc v1.1.0 Adds Extensible Custom Options
* @author ReynStahl
* 
* @help
* Adds Extensible Custom Options
* 
* Instruction:
* - Put this plugin at the bottom of plugin list. (Most use case)
* - Functionality must be coded in JS, this just provides a framework.
* - Options is got from YAML file,
* - You MAY create another plugin that's below this and add option rather than override.
*   to prevent chance of mod conflict or easier time updating plugin.
*
* For getting the value for basic type of options, it is saved in "ConfigManager.variableName"
* You may want the variable name to be specific to avoid conflict with other mods, 
* as same name will override each other.
*
* To add options you can do
* CustomOptionHelper.addOption("header", new CustomOption());
* where "header" is the option id and the "new CustomOption()" is create any type of option
*
* NOTE: SEE EXAMPLE IMPLEMENTATION AT THE BOTTOM OF THIS PLUGIN SCRIPT
* NOTE 2: By defauly, the options are ON first then OFF, meaning ON is index 0 and OFF is index 1, 
*         being bit backwards to programming logic.
*
* # Example Script:
* CustomOptionHelper.addOption("header", new CustomOption()); // Empty Header
* CustomOptionHelper.addOption("difficulty", new CustomOptionVariable(1512, -1)); // Assign to variable 1512, actual variable value is offset by -1
* CustomOptionHelper.addOption("turnorder", new CustomOptionConfig("reverieTurnOrder", 1)); // index 1 (off) by default
* CustomOptionHelper.addOption("showstats", new CustomOptionConfig("reverieShowStats", 0)); // index 0 (on) by default
*
* # Example YAML:
* Options:
*     # Options starting with "/save/" Indicates the option is only for the save. 
*     # The word would be removed on display.
*     header:
*         header: "-------------------- MOD NAME --------------------"
*         options: []
*         helpText: "MOD NAME Options Below"
*     difficulty:
*         header: "/save/[IN SAVE] DIFFICULTY"
*         options: ["EASY", "NORMAL", "HARD"]
*         helpText: "Changes Difficulty. This is per SAVE."
*     turnorder:
*         header: "ACTUAL TURN ORDER"
*         options: ["ON", "OFF"]
*         helpText: "Makes the menu turn order be based on character's speed."
*/

var Stahl = Stahl || {};
Stahl.CustomOptions = Stahl.CustomOptions || {};

// =========================================================
// CUSTIOM OPTION HELPER
// =========================================================

class CustomOptionHelper {
    /**
     * Gets the Language Data. Override or add on top of this.
     * @returns 
     */
    static getLanguageData() {
        return this.languageData;
    };

    // Currently assumes being in save as NOT in the title screen.
    // This is due to technical issue with checking game scene itself.
    static inSave() {
        return !(SceneManager._scene instanceof Scene_OmoriTitleScreen);
    }

    static addOption(id, option) {
        this.optionData[id] = option;
    }

    static addLanguageData(file, name, language) {
        let newData = LanguageManager.getTextData(file, name, language);
        Object.assign(this.languageData, newData);
    }
}

CustomOptionHelper.COLOR_DISABLED = "rgb(100, 100, 100)";
CustomOptionHelper.COLOR_HEADER = "rgb(255, 200, 0)";
CustomOptionHelper.SAVEKEY = "/save/";

/**
 * This is to keep track of optionData.
 */
CustomOptionHelper.optionData = {}

CustomOptionHelper.languageData = {};

// =========================================================
// CUSTIOM OPTIONS CLASSES
// =========================================================
/**
 * Base class for custom option. On it's own, it works as a Header.
 */
class CustomOption {
    constructor(spacing = 120) {
        this.listIndex = 0;
        this.spacing = spacing;
    }

    getIndex() {return -1};
    processIndex(data) {};
    loadIndex(config) {};
    saveIndex(config) {};
}

/**
 * Basic type of option that saves to ConfigManager class.
 */
class CustomOptionConfig extends CustomOption {
    constructor(varName, defaultIndex = 0, spacing = 120) {
        super(spacing);
        this.varName = varName;
        this.defaultIndex = defaultIndex;
    }

    getIndex() {
        return ConfigManager[this.varName];
    };

    processIndex(data) {
        ConfigManager[this.varName] = data.index;
        console.log("Set ConfigManager", this.varName, "to", data.index)
    };

    loadIndex(config) {
        config[this.varName] = ConfigManager[this.varName];
    };

    saveIndex(config) {
        ConfigManager[this.varName] = (config[this.varName] == undefined) ? this.defaultIndex : config[this.varName];
    };
}

/**
 * Option that saves to game variable. Only work in save.
 */
class CustomOptionVariable extends CustomOption {
    constructor(varId, offset = 0, spacing = 120) {
        super(spacing);
        this.varId = varId;
        this.offset = offset;
    }

    getIndex() {
        if (!CustomOptionHelper.inSave()) {
            return 0;
        }
        return $gameVariables.value(this.varId) - this.offset;
    };

    processIndex(data) {
        if (!CustomOptionHelper.inSave()) {
            console.log("Attempted to change variable", this.varId, "without being in save!");
            return;
        }
        let value = data.index + this.offset;
        $gameVariables.setValue(this.varId, value);
        console.log("Set Variable", this.varId, "to", value);
    };
}

/**
 * Option that saves to game switch. Only work in save.
 */
class CustomOptionSwitch extends CustomOption {
    // Inverse on by default, as normally the first option (index 0) is ON and second (index 1) is OFF.
    constructor(varId, inverse = true, spacing = 120) {
        super(spacing);
        this.varId = varId;
        this.inverse = inverse;
    }

    getIndex() {
        if (!CustomOptionHelper.inSave()) {
            return 0;
        }
        let switchValue = $gameSwitches.value(this.varId);
        if (inverse) {
            return switchValue ? 0 : 1; // true is 0 instead
        }
        return switchValue ? 1 : 0;
    };

    processIndex(data) {
        if (!CustomOptionHelper.inSave()) {
            console.log("Attempted to change switch", this.varId, "without being in save!");
            return;
        }
        let value = data.index > 0; // 1 is on
        if (inverse) value = !value; // on is now off (1 is off, 0 is on)
        $gameSwitches.setValue(this.varId, value);
        console.log("Set Switch", this.varId, "to", value);
    };
}

// =========================================================
// SAVE AND LOAD OPTIONS
// =========================================================
Stahl.CustomOptions.Window_OmoMenuOptionsGeneral_processOptionCommand = Window_OmoMenuOptionsGeneral.prototype.processOptionCommand;
Window_OmoMenuOptionsGeneral.prototype.processOptionCommand = function () {
    Stahl.CustomOptions.Window_OmoMenuOptionsGeneral_processOptionCommand.call(this);
    var index = this.index();
    var data = this._optionsList[index];

    for (const [key, value] of Object.entries(CustomOptionHelper.optionData)) {
        if (value.listIndex == index) {
            value.processIndex(data);
            break;
        }
    }
};

Stahl.CustomOptions.ConfigManager_makeData = ConfigManager.makeData;
ConfigManager.makeData = function () {
    // Get Original Config
    var config = Stahl.CustomOptions.ConfigManager_makeData.call(this);
    // Set Config Settings
    for (const [key, value] of Object.entries(CustomOptionHelper.optionData)) {
        value.loadIndex(config);
    }
    // Return Config
    return config;
};

Stahl.CustomOptions.Window_OmoMenuOptionsGeneral_makeOptionsList = Window_OmoMenuOptionsGeneral.prototype.makeOptionsList;
Window_OmoMenuOptionsGeneral.prototype.makeOptionsList = function () {
    Stahl.CustomOptions.Window_OmoMenuOptionsGeneral_makeOptionsList.call(this);
    const LANG = CustomOptionHelper.getLanguageData();
    for (const [key, value] of Object.entries(CustomOptionHelper.optionData)) {
        this.createCustomOption(LANG, key, value.spacing, value.getIndex());
    }
};

/**
 * Creates an option from language file.
 * @param {*} lang Language File
 * @param {*} varName Varaible name of the option Index and Lang
 * @param {*} spacing Spacing between option
 * @param {*} index Where to start the index
 */
Window_OmoMenuOptionsGeneral.prototype.createCustomOption = function (lang, varName, spacing, index) {
    this._optionsList.push({
        header: lang[varName].header,
        options: lang[varName].options,
        helpText: lang[varName].helpText,
        spacing: spacing,
        index: index,
    });
    CustomOptionHelper.optionData[varName].listIndex = this._optionsList.length - 1;
}

Stahl.CustomOptions.ConfigManager_applyData = ConfigManager.applyData;
ConfigManager.applyData = function (config) {
    // Run Original Function
    Stahl.CustomOptions.ConfigManager_applyData.call(this, config);
    this.reverieTurnOrder = (config.reverieTurnOrder == undefined) ? 1 : config.reverieTurnOrder;
    for (const [key, value] of Object.entries(CustomOptionHelper.optionData)) {
        value.saveIndex(config);
    }
};

// =========================================================
// EMPTY OPTION HEADER
// =========================================================
Stahl.CustomOptions.Window_OmoMenuOptionsGeneral_drawOptionSegment = Window_OmoMenuOptionsGeneral.prototype.drawOptionSegment;
Window_OmoMenuOptionsGeneral.prototype.drawOptionSegment = function(header, options, spacing, rect) {
    let old_color = this.contents.textColor; // save color
    if (options.length > 0) {
        if (header.startsWith(CustomOptionHelper.SAVEKEY)) { // if it's a save.
            header = header.substring(CustomOptionHelper.SAVEKEY.length); // remove the initial suffix
            // If not in a save then gray out.
            if (!CustomOptionHelper.inSave()) {
                this.contents.textColor = CustomOptionHelper.COLOR_DISABLED;
            }
        }
        Stahl.CustomOptions.Window_OmoMenuOptionsGeneral_drawOptionSegment.call(this, header, options, spacing, rect);
    } else {
        // No options, treat as only a Header on its own.
        this.contents.textColor = CustomOptionHelper.COLOR_HEADER;    
        this.contents.drawText(header, rect.x + 50, rect.y + 20, rect.width, 24);
    }
    this.contents.textColor = old_color; // reset color
};

// ==================================================================================================================

// =========================================================
// EXAMPLE OPTION ADDITIONS
// =========================================================
CustomOptionHelper.addLanguageData("LTS_base", "Options");

CustomOptionHelper.addOption("header", new CustomOption()); // Empty Header
CustomOptionHelper.addOption("turnorder", new CustomOptionConfig("doTurnOrder", 1)); // index 1 (off) by default

// =========================================================
// FUNCTIONALITY
// =========================================================

// From Actual Turn Order
Stahl.CustomOptions.BattleManager_getActorInputOrder = BattleManager.getActorInputOrder;
BattleManager.getActorInputOrder = function () {
    // If no turn order, just use old one
    if (ConfigManager.doTurnOrder == 1) {
        return Stahl.CustomOptions.BattleManager_getActorInputOrder.call(this);
    }
    let members = $gameParty.members();
    let list = members.map((el, index) => [index, el.agi, el.isAlive() && el.isBattleMember()])
    list.sort((a, b) => b[1] > a[1])
    list = list.filter(_ => _[2])
    return list.map(_ => _[0])
};