//===============================================================================================================
// FoGsesipod - Base64 To File
// FoG_Base64ToFile.js
//===============================================================================================================

//===============================================================================================================
/*:
 * @plugindesc Output Base64 Srtings to specific folders.
 * @author FoGsesipod
 * @help
 * 
 * ◆Script：window.$WriteToFolder("Directory", "Name of File.Extension", Base64String);
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
  const WriteToFolder = async function(directory, name, string) {
    directory = ModLoaderDetected ? directory : directory.replace(/^www[\\/]/, '');
    const filepath = path.resolve(directory);
    const file = path.join(filepath, name);
    const buffer = Buffer.from(string, 'base64');

    try {
      await writeFile(file, buffer);
      console.log(file);
    } catch (err) {
      console.log(err);
    }
  };
  window.$WriteToFolder = WriteToFolder;
}