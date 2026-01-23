//=============================================================================
// Dynamic Images - By TomatoRadio
// TR_DynamicImages.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_DynamicImages = true;

var TR = TR || {};
TR.DI = TR.DI || {};
TR.DI.version = 1;

/*: 
 * @plugindesc v1.0 Allows changing images by varying game data
 * @author TomatoRadio
 * 
 * @help
 * Warning: Due to the complexity of this plugin in addition to
 * my laziness, there is only so much testing I can do so report
 * ANYTHING you find to the Resource Submission for this plugin
 * in the Omori Modding Hub and I'll either give you a workaround
 * or actually get off my ass and fix the bug.
 * 
 * ==============================================================
 * USAGE
 * ==============================================================
 * 
 * This plugin makes it so that all bitmaps loaded by the game
 * will check if they include any of the keywords for each of the
 * image groups you create, then add a suffix to the image based
 * on a piece of game data.
 * 
 * These can be:
 * Variables
 * Switches
 * An Actor's Charm
 * An Actor's Weapon
 * A Boolean Function
 * A Return Function
 * 
 * For example, if there is an Image Group with the key "PLAYER_BASIL"
 * and the Image Group checked Basil's armor, the following results
 * would be given
 * 
 * (Basil has no Armor)
 * RS_PLAYER_BASIL -> RS_PLAYER_BASIL
 * FA_SUNNY -> FA_SUNNY
 * DW_PLAYER_BASIL_RUN -> DW_PLAYER_BASIL_RUN
 * 
 * (Basil has TULIP)
 * RS_PLAYER_BASIL -> RS_PLAYER_BASIL_TULIP
 * FA_SUNNY -> FA_SUNNY
 * DW_PLAYER_BASIL_RUN -> DW_PLAYER_BASIL_TULIP_RUN
 * 
 * For more configuration details, see the plugin code.
 * 
 * ==============================================================
 * QUESTIONS
 * ==============================================================
 * 
 * Q: What happens if an image has multiple keywords?
 * A: It checks each Image Group from top to bottom. Modifications
 * made by previous IGs are kept through the following checks.
 * 
 * Q: Is this compatible with Girlmori Is Real?
 * A: Yes.
 * 
 * Q: Am I allowed to mod this?
 * A: MIT License. (yes)
 * 
 */

// This is just an object so you can also use a YAML file.
TR.DI.ImageGroups = //LanguageManager.getMessageData("mod_sys_di.ImageGroups");
{
    UniversalParameters: {//These parameters apply to all of these IG types
        Key: "KEL", //This is the string being checked for. If excluded the IG is skipped.
        CaseSensitive: true, //If true, the check performed is case sensitive. Both the filename and key are converted to lowercase when checking. Default false.
        FolderLimits: ["faces","system"], //If included, then only run if in the file is from one of these folders. Defaults to allowing all folders.
        SceneBans: ["Scene_Boot"] //If the scene is any of these, then the check fails. Only use if you know what you're doing.
    },

    Boolean:{ //Runs a Boolean Function
        //Note: TR_GIRLMORI_IS_REAL does not get overridden by this plugin.
        Key: "SUNNY",
        Boolean: "$gameActors.actor(8).gender === 1", //The code to be checked. You can use "filename" as a parameter to check the image name.
        TrueText: "_GIRL", //The text to be used if the bool is true. If exlcuded, will be set to "" (nothing).
        FalseText: "" //Ditto for false.
    },

    Return: { //Runs a Return Function
        Key: "LEAF",
        Return: "ImageManager.getImageStuffThatYouDontNeedToKnow(filename)", //The code to be checked. You can use "filename" as a parameter to check the image name.
        ExcludeFalsy: true, //If true, don't add a suffix if the returned value is falsy (usually 0).
        Text: "_%1" //The suffix to be added. %1 will be subbed out with the returned value.
    },
  
    Variable: { //Uses a Variable
        Key: "CLOCK",
        Variable: 120, //The ID of the Variable to check.
        ExcludeFalsy: true, //If true, don't add a suffix if the variable is falsy (usually 0).
        Text: "_v%1" //The suffix to be added. %1 will be subbed out with the value of the variable.
    },

    Switch: { //Uses a Switch
        Key: "LUCILLE",
        Switch: 2, //The ID of the Switch to check.
        TrueText: "_BIKINI", //The suffix to be added if the Switch is ON. If exlcuded, will be set to "" (nothing).
        FalseText: "" //Ditto for OFF.
    },

    Armor: { //Uses the Armor of an Actor
        Key: "BASIL",
        ArmorActor: 8, //The ID of the Actor to check.
        Text: "_%1" //The suffix to be added if the armor has the <DynamicImageName: suffixName> tag, where %1 will be subbed out with suffixName
    },

    Weapon: { //Uses the Weapon of an Actor
        Key: "CHARLIE_BROWN",
        WeaponActor: 43, //The ID of the Actor to check.
        Text: "_%1" //The suffix to be added if the weapon has the <DynamicImageName: suffixName> tag, where %1 will be subbed out with suffixName
    }
    //Weapons and Armor actually just check the first and second equipment slot. So if you have VL_TwoCharmSlots be mindful of that.

};

TR.DI.oldLoadBitmap = ImageManager.loadBitmap;
ImageManager.loadBitmap = function(folder, filename, hue, smooth) {
    if (filename) {
        var newname = filename;
        for (const group in TR.DI.ImageGroups) {
            let ig = TR.DI.ImageGroups[group];
            //Is this IG valid?
            if (!ig.Key) {continue;};
            if (ig.CaseSensitive) {if (ig.Key.toLowerCase() !== newname.toLowerCase()) {continue;};} else {if (ig.Key !== newname) {continue;};};
            if (ig.SceneBans && ig.SceneBans.includes(SceneManager._scene.constructor.name)) {continue;};
            if (ig.FolderLimits && !ig.FolderLimits.includes(folder)) {continue;};
            //What is the suffix?
            let suffix = "";
            if (ig.Boolean) {
                try {
                    let tt = ig.TrueText || "";
                    let ft = ig.FalseText || "";
                    suffix = eval(ig.Boolean) ? suffix+tt : suffix+ft;
                } catch (e) {
                    console.error(e,ig.Boolean,`IG: ${group} BOOLEAN ERROR`);
                    let ft = ig.FalseText || "";
                    suffix = suffix+ft;
                };
            } else if (ig.Return) {
                try {
                    suffix = ig.ExcludeFalsy && !eval(ig.Return) ? "" : ig.Text.format(eval(ig.Return));
                } catch (e) {
                    console.error(e,ig.Boolean,`IG: ${group} RETURN ERROR`);
                    suffix = "";
                };
            } else if (ig.Variable) {
                suffix = ig.ExcludeFalsy && !$gameVariables.value(parseInt(ig.Variable)) ? "" : ig.Text.format($gameVariables.value(parseInt(ig.Variable)));
            } else if (ig.Switch) {
                let tt = ig.TrueText || "";
                let ft = ig.FalseText || "";
                suffix = $gameSwitches.value(parseInt(ig.Switch)) ? suffix+tt : suffix+ft;
            } else if (ig.ArmorActor) {
                let actor = $gameActors.actor(parseInt(ig.ArmorActor));
                let charm = actor._equips[1]._itemId ? actor._equips[1]._dataClass == "weapon" ? $dataWeapons[actor._equips[1]._itemId] : $dataArmors[actor._equips[1]._itemId] : false;
                suffix = charm && charm.meta.DynamicImageName ? ig.Text.format(charm.meta.DynamicImageName.trim()) : "";
            } else if (ig.WeaponActor) {
                let actor = $gameActors.actor(parseInt(ig.ArmorActor));
                let weapon = actor._equips[0]._itemId ? actor._equips[0]._dataClass == "weapon" ? $dataWeapons[actor._equips[0]._itemId] : $dataArmors[actor._equips[0]._itemId] : false;
                suffix = weapon && weapon.meta.DynamicImageName ? ig.Text.format(weapon.meta.DynamicImageName.trim()) : "";
            };
            //Actually apply the suffix
            let insertIndex = newname.toLowerCase().indexOf(ig.Key.toLowerCase())+ig.Key.length;
            newname = newname.slice(0,insertIndex)+suffix+newname.slice(insertIndex);
        };
        return TR.DI.oldLoadBitmap.call(this,folder,newname,hue,smooth);
    } else {
        return this.loadEmptyBitmap();
    };
};