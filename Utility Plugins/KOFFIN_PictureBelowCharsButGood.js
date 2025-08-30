/*:
 * @plugindesc v1.10 Plugin to display multiple pictures with specific z-indexes below characters
 * but above tilemap.
 * @author not Kenway (modified by KoffinKrypt)
 *
 * @param Picture Configs
 * @desc Comma-separated list of pictureID:z-index pairs. Example: "2:4,3:1" (don't use quotations)
 * @default 
 *
 * @help
 * Use the Show Picture command as usual. When a picture is shown whose ID is
 * listed in the Picture Configs parameter, its z-index will be reassigned accordingly.
 */
 
var _createPictures = Spriteset_Base.prototype.createPictures;
Spriteset_Base.prototype.createPictures = function() {
    _createPictures.call(this);
    var params = PluginManager.parameters("KOFFIN_PictureBelowCharsButGood");
    var configStr = params["Picture Configs"] || "";
    
    // If no custom configurations are provided, fallback to the single picture method.
    if (configStr.trim() === "") {
        var picID = parseInt(params["Picture ID"]);    
        var sprite = this._pictureContainer.removeChildAt(picID - 1);
        sprite.z = sprite.zIndex = parseInt(params["Picture Z"]);
        this._tilemap.addChild(sprite);
    } else {
        // Split configurations by comma. e.g., "2:4,3:1"
        var configs = configStr.split(",");
        // To avoid index shifting issues when removing sprites, sort by picture id descending.
        configs.sort(function(a, b) { 
            return parseInt(b.split(":")[0]) - parseInt(a.split(":")[0]); 
        });
        // Process each configuration pair
        configs.forEach(function(item) {
            var parts = item.split(":");
            var pictureID = parseInt(parts[0]);
            var zValue = parseInt(parts[1]);
            // Adjust the sprite’s z-index if it exists
            if (this._pictureContainer.children[pictureID - 1]) {
                var sprite = this._pictureContainer.removeChildAt(pictureID - 1);
                sprite.z = sprite.zIndex = zValue;
                this._tilemap.addChild(sprite);
            }
        }, this);
    }
};
