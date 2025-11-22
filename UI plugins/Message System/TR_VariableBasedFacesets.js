/*:
 * @plugindesc Allows Facesets to be swapped out with variables. 
 * Version 1.0
 * @author TomatoRadio
 * 
 * @help
 * This plugin allows for images in the Faces folder to change depending on the value of a Variable.
 * When you add a faceset to one of the groups, and the game calls for the faceset, it will check for the variable, and add that value to the end of the filename (unless the variable is 0)
 * So for example, if you have 'MainCharacters_ParallelsSunny' in FacesetGroup1 and the variable is 4, then it will call for 'MainCharacters_ParallelsSunny4'
 * This directly highjacks the ImageManager.loadFace() function, so it should always work.
 * If you are using TR_GIRLMORI_IS_REAL, then the '_girl' suffix is added after the variable is added, so it would look like 'MainCharacters_ParallelsSunny4_girl'
 * @param FacesetGroup1
 * @text Faceset Group 1
 * @type []
 * @desc All of the facesets in Faceset Group 1
 * @parent ---Faceset Group 1---
 * @default ["FaceName","FaceName","FaceName"]
 * 
 * @param FacesetGroup1Var
 * @text Faceset Group 1 Variable
 * @desc The ID of the variable that determines the alt faceset.
 * @parent ---Faceset Group 1---
 * @default 45
 * 
 * @param FacesetGroup2
 * @text Faceset Group 2
 * @type []
 * @desc All of the facesets in Faceset Group 2
 * @parent ---Faceset Group 2---
 * @default ["FaceName","FaceName","FaceName"]
 * 
 * @param FacesetGroup2Var
 * @text Faceset Group 2 Variable
 * @desc The ID of the variable that determines the alt faceset.
 * @parent ---Faceset Group 2---
 * @default 46
 * 
 * @param FacesetGroup3
 * @text Faceset Group 3
 * @type []
 * @desc All of the facesets in Faceset Group 3
 * @parent ---Faceset Group 3---
 * @default ["FaceName","FaceName","FaceName"]
 * 
 * @param FacesetGroup3Var
 * @text Faceset Group 3 Variable
 * @desc The ID of the variable that determines the alt faceset.
 * @parent ---Faceset Group 3---
 * @default 47
 * 
 * @param FacesetGroup4
 * @text Faceset Group 4
 * @type []
 * @desc All of the facesets in Faceset Group 4
 * @parent ---Faceset Group 4---
 * @default ["FaceName","FaceName","FaceName"]
 * 
 * @param FacesetGroup4Var
 * @text Faceset Group 4 Variable
 * @desc The ID of the variable that determines the alt faceset.
 * @parent ---Faceset Group 4---
 * @default 48
 * 
 */

//Import Info
var Imported = Imported || {};
Imported.TR_VBF = true;
Imported.TR_VariableBasedFacesets = true;

var TR = TR || {};
TR.VBF = TR.VBF || {};

//Param Defining
TR.VBF.Param = PluginManager.parameters('TR_VariableBasedFacesets');

TR.FacesetGroup1 =  JSON.parse(TR.VBF.Param["FacesetGroup1"])
TR.FacesetGroup1Var = Math.floor(Number(TR.VBF.Param["FacesetGroup1Var"] || 0))

TR.FacesetGroup2 =  JSON.parse(TR.VBF.Param["FacesetGroup2"])
TR.FacesetGroup2Var = Math.floor(Number(TR.VBF.Param["FacesetGroup2Var"] || 0))

TR.FacesetGroup3 =  JSON.parse(TR.VBF.Param["FacesetGroup3"])
TR.FacesetGroup3Var = Math.floor(Number(TR.VBF.Param["FacesetGroup3Var"] || 0))

TR.FacesetGroup4 =  JSON.parse(TR.VBF.Param["FacesetGroup4"])
TR.FacesetGroup4Var = Math.floor(Number(TR.VBF.Param["FacesetGroup4Var"] || 0))

//Override Function
ImageManager.loadFace = function(filename, hue) {
	if (TR.FacesetGroup1.includes(filename)) {
		let newname = this.faceSuffix(filename, 1);
		return this.loadBitmap('img/faces/', newname, hue, true);
	} else if (TR.FacesetGroup2.includes(filename)) {
		let newname = this.faceSuffix(filename, 2);
		return this.loadBitmap('img/faces/', newname, hue, true);
	} else if (TR.FacesetGroup3.includes(filename)) {
		let newname = this.faceSuffix(filename, 3);
		return this.loadBitmap('img/faces/', newname, hue, true);
	} else if (TR.FacesetGroup4.includes(filename)) {
		let newname = this.faceSuffix(filename, 4);
		return this.loadBitmap('img/faces/', newname, hue, true);
	} else {
    return this.loadBitmap('img/faces/', filename, hue, true);
};
};

ImageManager.faceSuffix = function(filename, group) {
	let suffix = 0
	switch (group) {
		case 1:
			suffix = $gameVariables.value(TR.FacesetGroup1Var);
			break;
		case 2:
			suffix = $gameVariables.value(TR.FacesetGroup2Var);
			break;
		case 3:
			suffix = $gameVariables.value(TR.FacesetGroup3Var);
			break;
		case 4:
			suffix = $gameVariables.value(TR.FacesetGroup4Var);
			break;
	};
	if (suffix === 0) {
		suffix = ''
	}
	let newname = `${filename}${suffix}`
	console.log(`${newname} loaded from Group ${group}`);
	return newname;
};