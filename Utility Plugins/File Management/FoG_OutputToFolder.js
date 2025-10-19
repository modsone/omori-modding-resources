//===============================================================================================================
// FoGsesipod - OutputToFolder
// FoG_OutputToFolder.js
//===============================================================================================================

//===============================================================================================================
/*:
 * @plugindesc Output text files to specific folders
 * @author FoGsesipod
 * @help
 * 
 * ◆Script：window.$WriteTextToFolder("Directory", "Name of File.Extension", "Text");
 * The base Directory starts next to the OMORI.exe file, in retail. In playtest it starts in the www folder.
 * Regardless, you should include "www/..." for the directory
*/
//===============================================================================================================
{
  const ModLoaderDetected = typeof $modLoader !== "undefined";
  const fs = ModLoaderDetected ? $modLoader.native_fs : require('fs');
  const util = require('util');
  const path = require('path');
  const writeFile = util.promisify(fs.writeFile);
  const WriteTextToFolder = function(directory, name, text) {
    directory = ModLoaderDetected ? directory : directory.replace(/^www[\\/]/, '');
    const filepath = path.resolve(directory);
    const file = `${filepath}\\${name}`;

    writeFile(file, text, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(file);
      };
    });
  };
  window.$WriteTextToFolder = WriteTextToFolder;
}
