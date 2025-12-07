//=============================================================================
// Variable Based Images - By TomatoRadio
// TR_VariableBasedImages.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_VariableBasedImages = true;

var TR = TR || {};
TR.VBI = TR.VBI || {};
TR.VBI.version = 1.5;

/*: 
 * @plugindesc v1.5 Plugin to allow changing images with Variables.
 * @author TomatoRadio
 * 
 * @help
 * Warning: Due to the complexity of this plugin in addition to
 * my laziness, there is rather minimal testing so Bug Report
 * ANYTHING you find to the Resource Submission for this plugin
 * in the Omori Modding Hub and I'll either give you a workaround
 * or actually get off my ass and fix the bug.
 * 
 * ==============================================================
 * USAGE
 * ==============================================================
 * 
 * This plugin makes it so that all bitmaps loaded by the game
 * will check if they include any of the 10 keywords for each 
 * image group. 
 * 
 * If the image is found to be part of a group, 
 * it will check the value of the associated Variable, 
 * and if the value is not 0 (Or null/undefined), it will add the 
 * value of the Variable directly after the keyword and call that 
 * image instead.
 * 
 * Example:
 * The keyword of Image Group 3 is 'FA'
 * Value of the Variable is 12
 * Original file is 'FA_BigBastard.png'
 * Now it calls for 'FA_IG3_12_BigBastard.png'
 * 
 * ==============================================================
 * QUESTIONS
 * ==============================================================
 * 
 * Q: What happens if an image has multiple keywords?
 * A: It checks in numerical order and will apply multiple if
 * the image has multiple.
 * 
 * Q: What happens if an Image is replaced with a new one that
 * has a Keyword in it?
 * A: It check for Keywords using the current edits. For example,
 * if Image Group 2 adds 'Cat' to an image, and Image Group 4
 * checks for 'Cat', it will pass.
 * 
 * Q: Is this compatible with your other plugins?
 * A: Assuming you mean GirlmoriIsReal & VariableBasedFacesets,
 * then yes for the first, and no for the second. This plugin
 * has special code to check for Girlmori Is Real and adds it
 * as effectively "Image Group 11" (Though it doesnt add an "IG11")
 * However you need to have this placed LOWER than GIR.
 * 
 * Q: Am I allowed to mod this?
 * A: Every plugin I make that isn't labelled as for a 
 * specific mod (For example TR_ParallelsFixes) is always free to use, 
 * even if I don't license it under WTFPL or MIT.
 * 
 * @param CaseSensitive
 * @text Case Sensitive?
 * @type boolean
 * @desc If ON, case sensitive checks.
 * @default false
 * 
 * @param BannedScenes
 * @text Banned Scenes
 * @type []
 * @desc A list of scenes that won't activate VBI. Case Sensitve. Only touch if you know what you're doing.
 * @default ["Scene_SplashScreens","Scene_OmoriTitleScreen","Scene_OmoriFile"]
 * 
 * @param ===Image Groups===
 * @param ---Image Group 1---
 * @parent ===Image Groups===
 * @param ImageGroup1Key
 * @text Image Group 1 Keyword
 * @desc An all lowercase keyword that is used to identify members of this image group.
 * @parent ---Image Group 1---
 * @default Group1
 * 
 * @param ImageGroup1Var
 * @text Image Group 1 Variable
 * @type variable
 * @desc The ID of the variable that determines the alt image.
 * @parent ---Image Group 1---
 * @default 51
 * 
 * @param ---Image Group 2---
 * @parent ===Image Groups===
 * @param ImageGroup2Key
 * @text Image Group 2 Keyword
 * @desc An all lowercase keyword that is used to identify members of this image group.
 * @parent ---Image Group 2---
 * @default Group2
 * 
 * @param ImageGroup2Var
 * @text Image Group 2 Variable
 * @type variable
 * @desc The ID of the variable that determines the alt image.
 * @parent ---Image Group 2---
 * @default 52
 * 
 * @param ---Image Group 3---
 * @parent ===Image Groups===
 * @param ImageGroup3Key
 * @text Image Group 3 Keyword
 * @desc An all lowercase keyword that is used to identify members of this image group.
 * @parent ---Image Group 3---
 * @default Group3
 * 
 * @param ImageGroup3Var
 * @text Image Group 3 Variable
 * @type variable
 * @desc The ID of the variable that determines the alt image.
 * @parent ---Image Group 3---
 * @default 53
 * 
 * @param ---Image Group 4---
 * @parent ===Image Groups===
 * @param ImageGroup4Key
 * @text Image Group 4 Keyword
 * @desc An all lowercase keyword that is used to identify members of this image group.
 * @parent ---Image Group 4---
 * @default Group4
 * 
 * @param ImageGroup4Var
 * @text Image Group 4 Variable
 * @type variable
 * @desc The ID of the variable that determines the alt image.
 * @parent ---Image Group 4---
 * @default 54
 * 
 * @param ---Image Group 5---
 * @parent ===Image Groups===
 * @param ImageGroup5Key
 * @text Image Group 5 Keyword
 * @desc An all lowercase keyword that is used to identify members of this image group.
 * @parent ---Image Group 5---
 * @default Group5
 * 
 * @param ImageGroup5Var
 * @text Image Group 5 Variable
 * @type variable
 * @desc The ID of the variable that determines the alt image.
 * @parent ---Image Group 5---
 * @default 55
 * 
 * @param ---Image Group 6---
 * @parent ===Image Groups===
 * @param ImageGroup6Key
 * @text Image Group 6 Keyword
 * @desc An all lowercase keyword that is used to identify members of this image group.
 * @parent ---Image Group 6---
 * @default Group6
 * 
 * @param ImageGroup6Var
 * @text Image Group 6 Variable
 * @type variable
 * @desc The ID of the variable that determines the alt image.
 * @parent ---Image Group 6---
 * @default 56
 * 
 * @param ---Image Group 7---
 * @parent ===Image Groups===
 * @param ImageGroup7Key
 * @text Image Group 7 Keyword
 * @desc An all lowercase keyword that is used to identify members of this image group.
 * @parent ---Image Group 7---
 * @default Group7
 * 
 * @param ImageGroup7Var
 * @text Image Group 7 Variable
 * @type variable
 * @desc The ID of the variable that determines the alt image.
 * @parent ---Image Group 7---
 * @default 57
 * 
 * @param ---Image Group 8---
 * @parent ===Image Groups===
 * @param ImageGroup8Key
 * @text Image Group 8 Keyword
 * @desc An all lowercase keyword that is used to identify members of this image group.
 * @parent ---Image Group 8---
 * @default Group8
 * 
 * @param ImageGroup8Var
 * @text Image Group 8 Variable
 * @type variable
 * @desc The ID of the variable that determines the alt image.
 * @parent ---Image Group 8---
 * @default 58
 * 
 * @param ---Image Group 9---
 * @parent ===Image Groups===
 * @param ImageGroup9Key
 * @text Image Group 9 Keyword
 * @desc An all lowercase keyword that is used to identify members of this image group.
 * @parent ---Image Group 9---
 * @default Group9
 * 
 * @param ImageGroup9Var
 * @text Image Group 9 Variable
 * @type variable
 * @desc The ID of the variable that determines the alt image.
 * @parent ---Image Group 9---
 * @default 59
 * 
 * @param ---Image Group 10---
 * @parent ===Image Groups===
 * @param ImageGroup10Key
 * @text Image Group 10 Keyword
 * @desc An all lowercase keyword that is used to identify members of this image group.
 * @parent ---Image Group 10---
 * @default Group10
 * 
 * @param ImageGroup10Var
 * @text Image Group 10 Variable
 * @type variable
 * @desc The ID of the variable that determines the alt image.
 * @parent ---Image Group 10---
 * @default 60
 * 
 */

TR.VBI.Param = PluginManager.parameters('TR_VariableBasedImages');
TR.VBI.GIR = Imported.TR_GIRLMORI_IS_REAL;

TR.VBI.CaseSensitive = eval(TR.VBI.Param["CaseSensitive"]);

TR.VBI.BannedScenes = JSON.parse(TR.VBI.Param["BannedScenes"]);

TR.VBI.ImageGroup1Key = TR.VBI.Param["ImageGroup1Key"];
TR.VBI.ImageGroup1Var = parseInt(TR.VBI.Param["ImageGroup1Key"]);

TR.VBI.ImageGroup2Key = TR.VBI.Param["ImageGroup2Key"];
TR.VBI.ImageGroup2Var = parseInt(TR.VBI.Param["ImageGroup2Key"]);

TR.VBI.ImageGroup3Key = TR.VBI.Param["ImageGroup3Key"];
TR.VBI.ImageGroup3Var = parseInt(TR.VBI.Param["ImageGroup3Key"]);

TR.VBI.ImageGroup4Key = TR.VBI.Param["ImageGroup4Key"];
TR.VBI.ImageGroup4Var = parseInt(TR.VBI.Param["ImageGroup4Key"]);

TR.VBI.ImageGroup5Key = TR.VBI.Param["ImageGroup5Key"];
TR.VBI.ImageGroup5Var = parseInt(TR.VBI.Param["ImageGroup5Key"]);

TR.VBI.ImageGroup6Key = TR.VBI.Param["ImageGroup6Key"];
TR.VBI.ImageGroup6Var = parseInt(TR.VBI.Param["ImageGroup6Key"]);

TR.VBI.ImageGroup7Key = TR.VBI.Param["ImageGroup7Key"];
TR.VBI.ImageGroup7Var = parseInt(TR.VBI.Param["ImageGroup7Key"]);

TR.VBI.ImageGroup8Key = TR.VBI.Param["ImageGroup8Key"];
TR.VBI.ImageGroup8Var = parseInt(TR.VBI.Param["ImageGroup8Key"]);

TR.VBI.ImageGroup9Key = TR.VBI.Param["ImageGroup9Key"];
TR.VBI.ImageGroup9Var = parseInt(TR.VBI.Param["ImageGroup9Key"]);

TR.VBI.ImageGroup10Key = TR.VBI.Param["ImageGroup10Key"];
TR.VBI.ImageGroup10Var = parseInt(TR.VBI.Param["ImageGroup10Key"]);

ImageManager.loadBitmap = function(folder, filename, hue, smooth) {
    if (filename) {
        var BannedScenes = TR.VBI.BannedScenes
        if (SceneManager && SceneManager._scene && SceneManager._scene.constructor && BannedScenes.includes(SceneManager._scene.constructor.name)) {
        //Beginning of VBI Code
        let VarList = [TR.VBI.ImageGroup1Var, TR.VBI.ImageGroup2Var, TR.VBI.ImageGroup3Var, TR.VBI.ImageGroup4Var, TR.VBI.ImageGroup5Var, TR.VBI.ImageGroup6Var, TR.VBI.ImageGroup7Var, TR.VBI.ImageGroup8Var, TR.VBI.ImageGroup9Var, TR.VBI.ImageGroup10Var];
        let KeyList = [TR.VBI.ImageGroup1Key, TR.VBI.ImageGroup2Key, TR.VBI.ImageGroup3Key, TR.VBI.ImageGroup4Key, TR.VBI.ImageGroup5Key, TR.VBI.ImageGroup6Key, TR.VBI.ImageGroup7Key, TR.VBI.ImageGroup8Key, TR.VBI.ImageGroup9Key, TR.VBI.ImageGroup10Key];
        let creatingname = filename
        let index = 69420
        const KeyToVar = (element) => KeyList.includes(element)
        for (const element of KeyList) {
            if ((TR.VBI.CaseSensitive && creatingname.includes(element)) || (!TR.VBI.CaseSensitive && creatingname.toLowerCase().includes(element))) {
                index = element.findIndex(KeyToVar);
                suffix = $gameVariables.value(VarList[index])
                //Console mod sets vars to strings so i have to check both.
                if ((suffix === 0) || (suffix = '0') || (suffix = null) || (suffix = undefined)) {
                    //do nothing
                    creatingname = creatingname
                } else { 
                    creatingname = creatingname.replace(element, `${element}_IG${index+1}_${suffix}`)
                }
            };
        };
        //GIR Compatibility
        var Plugins = []
        for (i=0;i<$plugins.length;i++) {
          Plugins.push($plugins[i].name)
        }
        var GIR = Plugins.includes('TR_GIRLMORI_IS_REAL')
        if (GIR) {
            if (creatingname.toLowerCase().includes("sunny")) {
                if (ImageManager.isGirlmoriActive()) {
                    if (creatingname.toLowerCase().includes("%(")) {
		            	creatingname = `${creatingname.replace("%","_girl%")}`
		            } else {
		            	creatingname = `${creatingname}_girl`
		            }
                }
            }
        }

        let filename = creatingname
        //End of VBI Code
        }
        var path = folder + encodeURIComponent(filename) + '.png';
        var bitmap = this.loadNormalBitmap(path, hue || 0);
        bitmap.smooth = smooth;
        return bitmap;
    } else {
        return this.loadEmptyBitmap();
    }
};

