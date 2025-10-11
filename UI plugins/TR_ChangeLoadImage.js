//=============================================================================
// Change Load Image - By TomatoRadio
// TR_ChangeLoadImage.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_ChangeLoadImage = true;

var TR = TR || {};
TR.CLI = TR.CLI || {};
TR.CLI.version = 1.0;

/*: 
 *
 * @plugindesc Version 1.0 Changes the loading image used.
 * @author TomatoRadio
 * 
 * @help
 * Changes the lightbulb loading image to a different image
 * in img/system/
 * 
 * @param image
 * @text Image
 * @type file
 * @dir img/system/
 * @desc The loading image
 * 
*/

TR.CLI.Param = PluginManager.parameters('TR_ChangeLoadImage');

TR.CLI.LoadImage = TR.CLI.Param["image"];

SceneManager.initGraphics = function() {
    var type = this.preferableRendererType();
    Graphics.initialize(this._screenWidth, this._screenHeight, type);
    Graphics.boxWidth = this._boxWidth;
    Graphics.boxHeight = this._boxHeight;
    Graphics.setLoadingImage(`img/system/${TR.CLI.LoadImage}.png`);
    if (Utils.isOptionValid('showfps')) {
        Graphics.showFps();
    }
    if (type === 'webgl') {
        this.checkWebGL();
    }
};