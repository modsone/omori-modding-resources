/*:
 * @plugindesc v1.0.0 Extends Atlas by allowing separate file.
 * @author ReynStahl
 */

AtlasManager = class extends AtlasManager {
    static initAtlasDataExtra(filename) {
        const path = require("path");
        const fs = require("fs");
        const yaml = require('./js/libs/js-yaml-master')
        var base = path.dirname(process.mainModule.filename);
        let folder = '/img/atlases/';
        var filePath = base + folder;
        var dirList = fs.readdirSync(filePath);

        // Getting Data
        let loadData;
        let finalPath;
        if(!!Utils.isOptionValid("test")) { // Test no encryption
            finalPath = base + `/data/${filename}.yaml`;
            loadData = fs.readFileSync(finalPath, 'utf8');
        } else { // No Test may have encryption (base game)
            finalPath = base + `/data/${filename}.PLUTO`;
            loadData = fs.readFileSync(finalPath);
            loadData = Encryption.decrypt(loadData);
        }
        var newData = yaml.safeLoad(loadData);

        // Adds on top rather than replace
        Object.assign($atlasData.source, newData.source); // assign the source specifically, not whole thing
        console.log("Extended Atlas:", finalPath);
    }
}

// NEED TO CLEAR ATLAS PLUGIN! DON'T FORGET!!
// AtlasManager.initAtlasData();

// Load AFTER initAtlasData
AtlasManager.initAtlasDataExtra("LTS_Atlas");