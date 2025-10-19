// PUT THIS BEFORE YED_TILED IN THE PLUGINS

Scene_Map.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this._transfer = $gamePlayer.isTransferring();
    var mapId = this._transfer ? $gamePlayer.newMapId() : $gameMap.mapId();
    if (typeof mapId === "string") {
      DataManager.loadSpecialMapData(mapId);
    } else {
      DataManager.loadMapData(mapId);
    }
};

DataManager.loadSpecialMapData = function(mapId) {
			if(!!Utils.isOptionValid("test")) {return this.loadSpecialMapDataPlaytest(mapId);}
			const path = require('path');
			const fs = require('fs');
			var base = path.dirname(process.mainModule.filename);
			if(typeof mapId === "string") {
				let filename = 'Map%1.KEL'.format(mapId);
				this._mapLoader = false;
				window["$dataMap"] = null;
				Graphics.startLoading();
				fs.readFile(base + "/data/" + filename, (err, buffer) => {
					if(!!err) {
						Graphics.printLoadingError(base + "/data/" + filename);
						SceneManager.stop();
					}
					let decrypt = Encryption.decrypt(buffer);
					window["$dataMap"] = JSON.parse(decrypt.toString());
					DataManager.onLoad(window["$dataMap"])
					Graphics.endLoading();
					this._mapLoader = true;
				})
				this.loadTiledMapData(mapId);
			}
			else {
				this.makeEmptyMap();
				this.unloadTiledMapData();
			}
		}


DataManager.loadSpecialMapDataPlaytest = function(mapId) {
    if (typeof mapId === "string") {
        var filename = 'Map%1.json'.format(mapId);
        this._mapLoader = ResourceHandler.createLoader('data/' + filename, this.loadDataFile.bind(this, '$dataMap', filename));
        this.loadDataFile('$dataMap', filename);
        this.loadTiledMapData(mapId);
    } else {
        this.makeEmptyMap();
    }
};

