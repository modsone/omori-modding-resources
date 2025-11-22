//===============================================================================================================
// FoGsesipod - Copy Image To Folder
// FoG_CopyImageToFolder.js
//===============================================================================================================

//===============================================================================================================
/*:
 * @plugindesc Copy images from the img/system directory to other directories
 * @author FoGsesipod
 * @help
 * 
 * ◆Script：window.$putImageToFolder("Image.png", "Path/To/NewImage.png");
 * The base Directory starts next to the OMORI.exe file, in retail. In playtest it starts in the www folder.
*/
//===============================================================================================================
{
  const fs = (typeof $modLoader === "undefined") ? require('fs') : $modLoader.native_fs;
  const util = require('util');
  const path = require('path');
  const readFile = util.promisify(fs.readFile);
  const writeFile = util.promisify(fs.writeFile);
  const www = fs.existsSync('www/')?'www/':'';
  const putImageToFolder = function(image, newName) {
    readFile(www + 'img/system/' + image).then(file => writeFile(newName, file)).catch(console.error);
  }
  window.$putImageToFolder = putImageToFolder;
}
