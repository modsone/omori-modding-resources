{
  function fuck(map) {
      map.layers = map.layers.map(layer => {
          if (!layer.properties) return layer;
          if (Array.isArray(layer.properties)) {
            let newProps = {};
            let newPropTypes = {};
            layer.properties.map( property => {
              newProps[property.name] = property.value;
              newPropTypes[property.name] = property.type;
            });
            layer.properties = newProps;
            layer.propertytypes = newPropTypes;
          }
          return layer;
      });
      map.tilesets = map.tilesets.map(tileset => {
          if(!tileset.tiles) return tileset;
          if(!Array.isArray(tileset.tiles)) return tileset;

          let newTiles = {};
          for (let el of tileset.tiles) {
              let elid = '' + el.id
              let a = new Set(Object.keys(el));
              a.delete("id");
              if (a.size > 0) {
                  newTiles[elid] = {};
                  for (let k of a) {
                      newTiles[elid][k] = el[k];
                  }
              }
          }
          tileset.tiles = newTiles;
          return tileset;
      })

      return map;
  }

  DataManager.loadTiledMapData = function (mapId) {
      const path = require('path');
      const fs = require('fs');
      const base = path.dirname(process.mainModule.filename);
      if (Utils.isOptionValid("test")) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', "./maps/Map" + mapId + ".json");
          xhr.overrideMimeType('application/json');
          xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                  if (xhr.status === 200 || xhr.responseText !== "") {
                      DataManager._tempTiledData = fuck(JSON.parse(xhr.responseText));
                  }
                  DataManager.loadTilesetData();
                  DataManager._tiledLoaded = true;
              }
          };
          this.unloadTiledMapData();
          xhr.send();
      } else {
          const mapName = `/maps/map${mapId}.AUBREY`;
          this.unloadTiledMapData();
          fs.readFile(path.join(base, mapName), (err, buffer) => {
              if(!!err) {
                  console.error(err)
                  Graphics.printLoadingError(base + mapName);
                  SceneManager.stop();
              }
              let decrypt = Encryption.decrypt(buffer);
              DataManager._tempTiledData = fuck(JSON.parse(decrypt.toString()));
              DataManager.loadTilesetData();
              DataManager._tiledLoaded = true;
          })
      }
  };
  let old_unload = DataManager.unloadTiledMapData
  DataManager.unloadTiledMapData = function () {
      old_unload.call(this)
      DataManager._hasMutateMap = false
  };
  let old_isload = DataManager.isMapLoaded
  DataManager.isMapLoaded = function() {
    let result = old_isload.call(this)
    let tiledLoaded = DataManager._tilesetToLoad <= 0 &&
                      DataManager._tiledLoaded        &&
                      result
    if (tiledLoaded && !DataManager._hasMutateMap) {
      DataManager._tempTiledData = fuck(DataManager._tempTiledData)
      DataManager._hasMutateMap = true
    }
    return result
  }
  // Priority Fix For Using Same As Characters And Levels
  let makeTMap = Spriteset_Map.prototype.createTilemap
  Spriteset_Map.prototype.createTilemap = function(...args) {
    makeTMap.call(this, ...args)
    let TiledTilemap = this._tilemap
    let old = TiledTilemap._getPriority
    TiledTilemap._getPriority = function(layerId) {
      let layerData = this.tiledData.layers[layerId]
      let level = $gameVariables.value(44)
      if (layerData.properties && layerData.properties.hasOwnProperty("hideOnLevel")) {
        let hideLevels = layerData.properties.hideOnLevel.split(",").map(x=>parseInt(x))
        if (hideLevels.includes(level)) {
          return 0
        }
      }
      return old.call(this, layerId)
    }
  // HideOnLevel Override so we can have multiple hide on levels.
    TiledTilemap.hideOnLevel = function(level) {
      var layerIds = [];
      var _iteratorNormalCompletion16 = true;
      var _didIteratorError16 = false;
      var _iteratorError16 = undefined;

      try {
          for (var _iterator16 = this._layers[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
              var layer = _step16.value;

              var layerData = this.tiledData.layers[layer.layerId];
              if (layerData.properties && layerData.properties.hasOwnProperty("hideOnLevel")) {
                  let hideLevels = layerData.properties.hideOnLevel.split(",").map(x=>parseInt(x))
                  if (!hideLevels.includes(level)) {
                      this.addChild(layer);
                      continue;
                  }
                  layerIds.push(layer.layerId);
                  this.removeChild(layer);
              }
          }
      } catch (err) {
          _didIteratorError16 = true;
          _iteratorError16 = err;
      } finally {
          try {
              if (!_iteratorNormalCompletion16 && _iterator16.return) {
                  _iterator16.return();
              }
          } finally {
              if (_didIteratorError16) {
                  throw _iteratorError16;
              }
          }
      }

      var _iteratorNormalCompletion17 = true;
      var _didIteratorError17 = false;
      var _iteratorError17 = undefined;

      try {
          for (var _iterator17 = this._priorityTiles[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
              var sprite = _step17.value;

              if (layerIds.indexOf(sprite.layerId) === -1) {
                  continue;
              }
              sprite.visible = false;
          }
      } catch (err) {
          _didIteratorError17 = true;
          _iteratorError17 = err;
      } finally {
          try {
              if (!_iteratorNormalCompletion17 && _iterator17.return) {
                  _iterator17.return();
              }
          } finally {
              if (_didIteratorError17) {
                  throw _iteratorError17;
              }
          }
      }
    }
  }
}// Thank You Draught
