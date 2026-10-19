 /*:
 * @plugindesc (PLACE BELOW VisuMZ_5_TiledMZ.js) main compatibility patch for MV
 * @author GeoBees & Draughtnyan ( + VisuStella / Daniel "Kaliya" Deptula for main plugin)
 * @help
 * This plugin patch requires VisuMZ_5_TiledMZ.js AND Geo_TiledMZ_Patch_Above.js to work at all.
 * Basically backports VisuMZ_5_TiledMZ.js to work in MV.
 * Documenting of everything should be in the original plugin itself.
 *
 * Some warning(s):
 *
 * - The blend mode "SUBTRACT" is not available in MV, so you can't use it here.
 */
 
 // revert filter function
 if (beesList_arrayFilter) {
	Array.prototype.filter = beesList_arrayFilter;
 };

var beeList_gInterpreterPluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function (command, args) {
    // reset picture
    if (command.toLowerCase() === "resetpicture") {
        if (!$gameMap._picturesWithZ)
            $gameMap._picturesWithZ = [];
        const pictureId = parseInt(args[0]);
        const scene = SceneManager._scene;
        if (scene && scene instanceof Scene_Map) {
            const spriteset = scene._spriteset;
            const tilemap = (spriteset && spriteset._tilemap) ? spriteset._tilemap : null;

            if (tilemap != null) {
                const picture = tilemap.children.find(p => p._pictureId === pictureId);
                const container = spriteset._pictureContainer;
                if (container != null && picture != null) {
                    tilemap.removeChild(picture);
                    container.addChildAt(picture, pictureId - 1);
                    $gameMap._picturesWithZ = $gameMap._picturesWithZ.filter(p => p.id !== pictureId);
                }
            }
        }
    };
    if (command.toLowerCase() === "showpictureatz") {
        // Convert Arguments
        if (!$gameMap._picturesWithZ)
            $gameMap._picturesWithZ = [];
        const pictureId = parseInt(args[0]);
        const zIndex = parseInt(args[1]);

        const scene = SceneManager._scene;
        if (scene && scene instanceof Scene_Map) {
            const spriteset = scene._spriteset;
            const tilemap = (spriteset && spriteset._tilemap) ? spriteset._tilemap : null;
            if (tilemap !== null) {
                const container = spriteset._pictureContainer;
                if (container) {
                    let picture = container.children.find(p => p._pictureId === pictureId);

                    if (picture) {
                        container.removeChild(picture);
                        picture.z = picture.zIndex = zIndex;
                        tilemap.addChild(picture);
                        $gameMap._picturesWithZ.push({
                            id: picture._pictureId,
                            zIndex: picture.zIndex
                        });
                    } else {
                        picture = tilemap.children.find(p => p._pictureId === pictureId);
                        if (picture) {
                            tilemap.removeChild(picture);
                            picture.z = picture.zIndex = zIndex;
                            tilemap.addChild(picture);
                        }
                    }
                }
            }
        }
    };
    if (command.toLowerCase() === "setcurrentmaplevel") {
        const level = parseInt(args[0]);
        const scene = SceneManager._scene;
        if (scene && scene instanceof Scene_Map) {
            $gameMap.currentMapLevel = level;
        }
    };
    beeList_gInterpreterPluginCommand.call(this, command, args);
};

VisuMZ.TiledMZ.propertyValue = function(properties, key) {
    if (!properties) {
        return null;
    }
	if (!Array.isArray(properties)) {
	  var p = [];
	  for (const [k, value] of Object.entries(properties)) {
		let i = {};
		i.name = k;
		i.value = value;
		p.push(i);
	  };
	  properties = p;
	};
    let property = properties.find(function(prop) {
        return prop.name.toLowerCase() ==  key.toLowerCase();
    });
    if (property) {
        if (typeof property.value === "string") property.value.trim();
        return property.value;
    } else {
        return null;
    }

};

VisuMZ.TiledMZ.strToBlendMode = function(str) {
    if (str === undefined) return PIXI.BLEND_MODES.NORMAL;
    switch (str.toLowerCase()) {
        case "normal":
            return PIXI.BLEND_MODES.NORMAL;
        case "add":
            return PIXI.BLEND_MODES.ADD;
        // case "subtract":
            // return PIXI.BLEND_MODES.SUBTRACT; not available in MV :(
        case "multiply":
            return PIXI.BLEND_MODES.MULTIPLY;
        case "screen":
            return PIXI.BLEND_MODES.SCREEN;
        default:
            return PIXI.BLEND_MODES.NORMAL;
    }
    return PIXI.BLEND_MODES.NORMAL;
};

DataManager.loadMapData = function (mapId) {
    if (this._loadedMapId === mapId && this._tempTiledData !== undefined) 
    {
        this._tiledLoaded = true;
        return;
    }
    VisuMZ.TiledMZ.DataManager_loadMapData.call(this, mapId);
	if (typeof $modLoader === "undefined") this.loadTiledMapData(mapId);
};

var beesList_loadTiledMapData = DataManager.loadTiledMapData;
DataManager.loadTiledMapData = function(mapId) {
    if (typeof $modLoader === "undefined") {
        return beesList_loadTiledMapData.call(this, mapId);
    };
	this._tiledLoaded = false;
    this._loadedMapId = mapId;
    const path = require('path');
    const fs = require('fs');
    var base = path.dirname(process.mainModule.filename);
    let mapName = `/maps/map${mapId}.AUBREY`;
    fs.readFile(base + mapName, (err, buffer) => {
        if (!!err) {
            console.error(err)
            Graphics.printLoadingError(base + mapName);
            SceneManager.stop();
        }
        let decrypt = Encryption.decrypt(buffer);
        this.parseTiledData(JSON.parse(decrypt));
        this.loadTilesetData();
        this._tiledLoaded = true;
    })
}

DataManager.recursiveExtractLayers = function (groupLayer, extracted) {
    const level = (VisuMZ.TiledMZ.propertyValue(groupLayer.properties, 'level')) || 0;
    const hideOnLevel = (VisuMZ.TiledMZ.propertyValue(groupLayer.properties, 'hideOnLevel')) || -1;
    const zIndex = (VisuMZ.TiledMZ.propertyValue(groupLayer.properties, 'zIndex')) || 0;
    const hiddenInGame = (VisuMZ.TiledMZ.propertyValue(groupLayer.properties, "hiddenInGame")) || false;
    const blendMode = (VisuMZ.TiledMZ.propertyValue(groupLayer.properties, 'blendMode')) || undefined;
    const reflectionCast = (VisuMZ.TiledMZ.propertyValue(groupLayer.properties, "reflectionCast")) || undefined;
    const regionId = undefined; // needed? not sure yet! (VisuMZ.TiledMZ.propertyValue(groupLayer.properties, "regionId"))
    const collision = (VisuMZ.TiledMZ.propertyValue(groupLayer.properties, "collision")) || undefined;
    const toLevel = (VisuMZ.TiledMZ.propertyValue(groupLayer.properties, "toLevel")) || undefined;
    const layers = groupLayer.layers;
    for (let i = 0; i < layers.length; ++i) {
        const layer = layers[i];
        if (layer.type !== 'group') {
            const layerLevel = (VisuMZ.TiledMZ.propertyValue(layer.properties, 'level')) || undefined;
            const layerHideOnLevel = (VisuMZ.TiledMZ.propertyValue(layer.properties, 'hideOnLevel')) || undefined;
            const layerZIndex = (VisuMZ.TiledMZ.propertyValue(layer.properties, 'zIndex')) || undefined;
            const layerHiddenInGame = (VisuMZ.TiledMZ.propertyValue(layer.properties, "hiddenInGame")) || undefined;
            const layerBlendMode = (VisuMZ.TiledMZ.propertyValue(layer.properties, 'blendMode')) || undefined;
            const layerReflectionCast = (VisuMZ.TiledMZ.propertyValue(layer.properties, "reflectionCast")) || undefined;
            const layerRegionId = (VisuMZ.TiledMZ.propertyValue(layer.properties, "regionId")) || undefined;
            const layerCollision = (VisuMZ.TiledMZ.propertyValue(layer.properties, "collision")) || undefined;
            const layerToLevel = (VisuMZ.TiledMZ.propertyValue(layer.properties, "toLevel")) || undefined;
            layer.level = layerLevel || level;
            layer.hideOnLevel = layerHideOnLevel || hideOnLevel;
            layer.zIndex = layerZIndex || zIndex;
            layer.hiddenInGame = layerHiddenInGame || hiddenInGame;
            layer.blendMode = layerBlendMode ? VisuMZ.TiledMZ.strToBlendMode(layerBlendMode) : VisuMZ.TiledMZ.strToBlendMode(blendMode);
            layer.reflectionCast = layerReflectionCast || reflectionCast;
            layer.regionId = layerRegionId || regionId;
            layer.collision = layerCollision || collision;
            layer.toLevel = layerToLevel || toLevel;
            extracted.push(layer);
			if (!layer.id) layer.id = i + 1;
        } else {
            this.recursiveExtractLayers.call(this, layer, extracted);
        }
    }
};

var beesList_loadTilesetData = DataManager.loadTilesetData;
DataManager.loadTilesetData = function () {
    if (typeof $modLoader === "undefined") {
        return beesList_loadTilesetData.call(this);
    };
    const tilesets = this._tempTiledData.tilesets;
    for (let i = 0, len = tilesets.length; i < len; ++i) {
        const tileset = tilesets[i];
        if (!tileset.source)
            continue;
        this._tilesetToLoad++;
        var name = tileset.source.replace(/^.*[\\\/]/, '');
        const path = require('path');
        const fs = require('fs');
        var base = path.dirname(process.mainModule.filename);
        name = name.replace(".json", ".AUBREY")
            fs.readFile(base + "/maps/" + name, (err, buffer) => {
                if (!!err) {
                    console.error(err)
                    Graphics.printLoadingError(base + mapName);
                    SceneManager.stop();
                }
                let decrypt = Encryption.decrypt(buffer);
				Object.assign(tileset, JSON.parse(decrypt.toString()));
				this.getTilesetProperties(tileset);
                this._tilesetToLoad--;
            })
    }
};

var beesList_imageManagerLoadTiledTileset = ImageManager.loadTiledTileset;
ImageManager.loadTiledTileset = function (path) {
    if (!path) return this.loadEmptyBitmap();
    return beesList_imageManagerLoadTiledTileset.call(this, path);
};

var beesList_imageManagerLoadTiledParallax = ImageManager.loadTiledParallax;
ImageManager.loadTiledParallax = function(path) {
    if (!path) return this.loadEmptyBitmap();
    return beesList_imageManagerLoadTiledParallax.call(this, path);
};

Sprite_TiledObject.prototype.updateAnim = function() {
    if (!this._data || (this._data && !this._data._animData)) {
        this.setInitialAnimation();
        return;
    }
    const animData = this._data._animData;
    animData.duration -= 1;
    if (animData.duration <= 0) {
        animData.frame = (animData.frame + 1) % animData.maxFrame;
        animData.duration = animData.maxDuration[animData.frame];
        const rId = this._data._tileData.animation[animData.frame].tileid;
        const w = this._data._tileWidth;
        const h = this._data._tileHeight;
        const tileCols = this.bitmap.width / w;
        const ux = rId % tileCols * w;
        const uy = Math.floor(rId / tileCols) * h;
        this.setFrame(ux, uy, w, h);
    }
};

TiledTilemap.prototype._setupAnim = function() {
    this._animationData = {};
    const tilesets = this.tiledData.tilesets;
    for (const tileset of tilesets) {
        if (!tileset.tiles) continue;
		// convert to object if array
		if (Array.isArray(tileset.tiles)) {
			var arr = JSON.parse(JSON.stringify(tileset.tiles));
			tileset.tiles = {};
			for (i of arr) {
			  if (!i.animation) continue;
			  tileset.tiles[i.id] = {};
			  tileset.tiles[i.id].animation = i.animation;
			};
		};
        for (const [key, value] of Object.entries(tileset.tiles)) {
            const animation = value.animation;
            if (!animation) continue;
			const tileId = key;
			const durations = [];
			animation.forEach(a => durations.push(a.duration / 1000 * 60));
            const duration = animation[0].duration / 1000 * 60;
            const maxFrame = animation.length;
			// if animation data exists already
			if (this._animationData[tileId]) {
				this._animationData[tileId].dupes++;
				var dupeId = value.dupeId = this._animationData[tileId].dupes;
				this._animationData[tileId + "d" + dupeId] = { frame: 0, maxFrame: maxFrame, duration: duration, maxDuration: duration };
		        continue;
			};
            this._animationData[tileId] = { frame: 0, maxFrame: maxFrame, duration: duration, maxDuration: durations, dupes: 0 };
        }
    }
};

TiledTilemap.prototype._createLayers = function() {
    let id = 0;
    this.refresh();
    const layers = this.tiledData.layers;
	this.horizontalWrap = $gameMap.isLoopHorizontal();
	this.verticalWrap = $gameMap.isLoopHorizontal();
    for (const layerData of layers) {

        if (!this.isPaintableLayer(layerData)) {
            id++;
            continue;
        }

        if (this.isReflectionLayer(layerData)) {
            id++;
            continue;
        }
        const layer = new PIXI.tilemap.CompositeRectTileLayer();
        layer.layerData = layerData;
        layer.layerId = id;
        layer.spriteId = id;
        layer.priority = layerData.priority || 0;
        layer.z = layerData.zIndex || 0;
        layer.blendMode = layerData.blendMode;
        this._layers.push(layer);
        this.addChild(layer);
        id++;
    }

    for (let i = 0; i < VisuMZ.TiledMZ.Settings.PriorityTileLimit; i++) {
        let sprite = new Sprite_Base();
        sprite.z = sprite.zIndex = 3;
        sprite.layerId = -1;
        sprite.hide();
        this.addChild(sprite);
        this._priorityTiles.push(sprite);
    }

    this._needsRepaint = true;
    this.createSpriteObjects();
};

TiledTilemap.prototype.createSpriteObjects = function() {
    const objects = $gameTemp._tiledObjects;
    for (const obj of objects) {
		// no compatibility with embedded tilesets atm
		if (!obj.imageFolder) continue;
        this._objectSprites.push(new Sprite_TiledObject(obj));
    }
    if (this._objectSprites.length > 0) {
        this.addChild(...this._objectSprites);
    }
    this._objectsCreated = true;
};

TiledTilemap.prototype.refreshTileset = function() {
    var bitmaps = this.bitmaps.map(function (x) { return x._baseTexture ? new PIXI.Texture(x._baseTexture) : x; });
    for (let layer of this._layers) {
        layer.setBitmaps(bitmaps);
    };
};

TiledTilemap.prototype._paintTile = function(layer, startX, startY, x, y) {
    var mx = startX + x;
    var my = startY + y;
    
    if (this.horizontalWrap) {
        mx = mx.mod(this._mapWidth);
    }
    if (this.verticalWrap) {
        my = my.mod(this._mapHeight);
    }

    let tilePos = 0
    const layerData = layer.layerData;
    const tilesets = this.tiledData.tilesets;

    const width = this._mapWidth;
    const height = this._mapHeight;

    // Possible problem with offsets
    if (mx >= 0 && mx < width && my >= 0 && my < height) {
        tilePos = mx + my * this._mapWidth;
    } else {
        return;
    }

    
    let tileId = layerData.data[tilePos];

    if (!tileId) {
        return;
    }


    const fHorz = (tileId & FLIPPED_HORIZONTALLY_FLAG);
    const fVert = (tileId & FLIPPED_VERTICALLY_FLAG);
    const fDiag = (tileId & FLIPPED_DIAGONALLY_FLAG);

    let rotate = 0;
    if (fHorz && fDiag && fVert) {
        rotate = 14
    } else if (fHorz && fDiag) {
        rotate = 6;
    } else if (fHorz && fVert) {
        rotate = 4;
    } else if (fVert && fDiag) {
        rotate = 2
    } else if (fHorz) {
        rotate = 12;
    } else if (fVert) {
        rotate = 8
    } else if (fDiag) {
        rotate = 10
    }

    tileId &= ~(FLIPPED_HORIZONTALLY_FLAG | FLIPPED_VERTICALLY_FLAG | FLIPPED_DIAGONALLY_FLAG);

    const textureId = VisuMZ.TiledMZ.getTextureId(tileId);
    const dx = x * this._tileWidth;
    const dy = y * this._tileHeight;
    const tileset = tilesets[textureId];
    const w = tileset.tilewidth;
    const h = tileset.tileheight;
    const tileCols = tileset.columns;
    const realId = this._getAnimationTileId(textureId, tileId - tileset.firstgid);
    const ux = realId %  tileCols * w;
    const uy = Math.floor(realId / tileCols) * h;

    if (this.isPriorityTile(layer)) {
        this._paintPriorityTile(layer, textureId, tileId, startX, startY, dx, dy);
        return;
    }

    layer.children[0].addRect(textureId, ux, uy, dx, dy, w, h, rotate);
};

TiledTilemap.prototype._paintPriorityTile = function(layer, textureId, tileId, startX, startY, dx, dy) {
    const tileset = this.tiledData.tilesets[textureId];
    const w = tileset.tilewidth;
    const h = tileset.tileheight;
    const tileCols = tileset.columns;
    const realId = this._getAnimationTileId(textureId, tileId - tileset.firstgid);
    const ux = realId %  tileCols * w;
    const uy = Math.floor(realId / tileCols) * h
    const sprite = this._priorityTiles[this._priorityTilesCount];
    const layerData = layer.layerData;
    const offsetX = layerData ? layerData.offsetx || 0 : 0;
    const offsetY = layerData ? layerData.offsety || 0 : 0;
    let ox = Math.floor(this.origin.x);
    let oy = Math.floor(this.origin.y);

    if (this._priorityTilesCount >= this._priorityTiles.length) {
        return;
    }

    sprite.layerId = layer.layerId;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 1.0;
    sprite.origX = dx;
    sprite.origY = dy;
    sprite.x = sprite.origX + startX * this._tileWidth - ox + offsetX + w / 2;
    sprite.y = sprite.origY + startY * this._tileHeight - oy + offsetY + h;
    sprite.bitmap = this.bitmaps[textureId];
    sprite.setFrame(ux, uy, w, h);
    sprite.priority = layer.priority;
    sprite.z = sprite.zIndex = layer.z;
	sprite.blendMode = layer.blendMode;
    sprite.show();

    this._priorityTilesCount += 1;
};

TiledTilemap.prototype._updateBitmaps = function() {
    if (this._needsBitmapsUpdate && this.isReady()) {
        for (let i = 0; i < this._layers.length; ++i) {
            const layer = this._layers[i];
            layer.setBitmaps(this.bitmaps);
        }
        this._needsBitmapsUpdate = false;
        this._needsRepaint = true;
    }
};

TiledTilemap.prototype.updateTransform = function() {
    const ox = Math.floor(this.origin.x);
    const oy = Math.floor(this.origin.y);
    const startX = Math.floor((ox - this._margin) / this._tileWidth);
    const startY = Math.floor((oy - this._margin) / this._tileHeight);
    this._updateLayerPositions(startX, startY, ox, oy);
    if (this._needsRepaint ||
        this._lastAnimationFrame !== this.animationFrame ||
        this._lastStartX !== startX ||
        this._lastStartY !== startY) {
            this._lastAnimationFrame = this.animationFrame;
            this._lastStartX = startX;
            this._lastStartY = startY;
            this._addAllSpots(startX, startY);
            this._needsRepaint = false;
        }
        this._sortChildren();
    PIXI.Container.prototype.updateTransform.call(this);
};

var beesList_updateLayerPositions = TiledTilemap.prototype._updateLayerPositions;
TiledTilemap.prototype._updateLayerPositions = function (startX, startY, ox, oy) {
	beesList_updateLayerPositions.call(this, startX, startY, ox, oy);
    for (const layer of this._layers) {
		const layerData = layer.layerData;
		const layerOffsetX = layerData ? layerData.offsetx || 0 : 0;
        const layerOffsetY = layerData ? layerData.offsety || 0 : 0;
        layer.x += layerOffsetX;
        layer.y += layerOffsetY;
    };
};

TiledTilemap.prototype._updateAnimation = function() {
    let needsRefresh = false;
    for (const key in this._animationData) {
        this._animationData[key].duration -= 1;
        if (this._animationData[key].duration <= 0) {
            this._animationData[key].frame = (this._animationData[key].frame + 1) % this._animationData[key].maxFrame;
            this._animationData[key].duration = this._animationData[key].maxDuration[this._animationData[key].frame];
            needsRefresh = true;
        }
    }
    if (needsRefresh) {
        this._needsRepaint = true;
    }
};

TiledTilemap.prototype._getAnimationTileId = function(textureId, tileId) {
    const tiles = this.tiledData.tilesets[textureId].tiles;
    
    if (!tiles) {
        return tileId;
    }

    const tile = this._getTileData(tiles, tileId);
    if (!tile) {
        return tileId;
    }

    if (!tile.animation) {
        return tileId;
    }

    const animation = tile.animation;
    const frame = tile.dupeId ? this._animationData[tileId + "d" + tile.dupeId].frame : this._animationData[tileId].frame;
    if (!frame) {
        return tileId;
    }
    return animation[frame].tileid;
};

TiledTilemap.prototype._getTileData = function(tiles, tileId) {
    return tiles[tileId];	
};

// same as character layers fix
// also camera in MV is a bit buggy if you meet a border, which results in decimal off-positioning for some sprites.
TiledTilemap.prototype._compareChildOrder = function(a, b) {
    var result = 0;
  
    if (!isNaN(a.z) && a.z != null &&
    !isNaN(b.z) && b.z != null && a.z !== b.z) {
        result = a.z - b.z;
    } else if (((a instanceof PIXI.tilemap.CompositeRectTileLayer) && !(b instanceof PIXI.tilemap.CompositeRectTileLayer)) || (!(a instanceof PIXI.tilemap.CompositeRectTileLayer) && (b instanceof PIXI.tilemap.CompositeRectTileLayer))) {
        result = a.spriteId - b.spriteId;
    } else if ((a.y || 0) !== (b.y || 0)) {        
        result = (a.y || 0) - (b.y || 0);
    } else if ((a.priority || 0) !== (b.priority || 0)) {        
        result = (a.priority || 0) - (b.priority || 0);
    } else if (!isNaN(a.x) && a.x != null &&
    !isNaN(b.x) && b.x !== undefined && b.x != null && a.x !== b.x) {
        result = a.x - b.x;
    } else {
        result = a.spriteId - b.spriteId;
    }
    return result;
};

//=============================================================================
// PIXI.tilemap.RectTileLayer
//=============================================================================

// Object.defineProperties(PIXI.tilemap.CompositeRectTileLayer.prototype, {
    // blendMode: {
        // set: function (val) {
			// console.log(this);
            // //this.children[0].blendMode = val;
        // },
        // get: function () {
            // return this.blendMode;
        // }
    // }
// });

// beesList_oldRectTileaddRect = PIXI.tilemap.RectTileLayer.prototype.addRect;
PIXI.tilemap.RectTileLayer.prototype.addRect = function (textureId, u, v, x, y, tileWidth, tileHeight, rotate = 0, animX, animY) {
    if (animX === void 0) { animX = 0; }
    if (animY === void 0) { animY = 0; }
    var pb = this.pointsBuf;
    this.hasAnim = this.hasAnim || animX > 0 || animY > 0;
    if (tileWidth == tileHeight) {
        pb.push(u);
        pb.push(v);
        pb.push(x);
        pb.push(y);
        pb.push(tileWidth);
        pb.push(tileHeight);
        pb.push(animX | 0);
        pb.push(animY | 0);
        pb.push(textureId);
    } else {
        var i;
        if (tileWidth % tileHeight === 0) {
            for (i = 0; i < tileWidth / tileHeight; i++) {
                pb.push(u + i * tileHeight);
                pb.push(v);
                pb.push(x + i * tileHeight);
                pb.push(y);
                pb.push(tileHeight);
                pb.push(tileHeight);
                pb.push(animX | 0);
                pb.push(animY | 0);
                pb.push(textureId);
            }
        } else if (tileHeight % tileWidth === 0) {
            for (i = 0; i < tileHeight / tileWidth; i++) {
                pb.push(u);
                pb.push(v + i * tileWidth);
                pb.push(x);
                pb.push(y + i * tileWidth);
                pb.push(tileWidth);
                pb.push(tileWidth);
                pb.push(animX | 0);
                pb.push(animY | 0);
                pb.push(textureId);
            }
        } else {
            pb.push(u);
            pb.push(v);
            pb.push(x);
            pb.push(y);
            pb.push(tileWidth);
            pb.push(tileHeight);
            pb.push(animX | 0);
            pb.push(animY | 0);
            pb.push(textureId);
        }
    }
	pb.push(rotate);												
};

// beesList_oldRectTileRenderWebGL = PIXI.tilemap.RectTileLayer.prototype.renderWebGL;
PIXI.tilemap.RectTileLayer.prototype.renderWebGL = function (renderer, useSquare) {
    if (this.parent) {
        renderer.gl.blendFunc(renderer.gl.ONE, renderer.gl.ONE_MINUS_SRC_ALPHA);
        renderer.state.setBlendMode(this.parent.blendMode);
    };
    if (useSquare === void 0) {
        useSquare = false;
    }
    var points = this.pointsBuf;
    if (points.length === 0)
        return;
    var rectsCount = points.length / 10;
    var tile = renderer.plugins.tilemap;
    var gl = renderer.gl;
    if (!useSquare) {
        tile.checkIndexBuffer(rectsCount);
    }
    var shader = tile.getShader(useSquare);
    var textures = this.textures;
    if (textures.length === 0)
        return;
    var len = textures.length;
    if (this._tempTexSize < shader.maxTextures) {
        this._tempTexSize = shader.maxTextures;
        this._tempSize = new Float32Array(2 * shader.maxTextures);
    }
    for (var i = 0; i < len; i++) {
        if (!textures[i] || !textures[i].valid)
            return;
        var texture = textures[i].baseTexture;
    }
    tile.bindTextures(renderer, shader, textures);
    var vb = tile.getVb(this.vbId);
    if (!vb) {
        vb = tile.createVb(useSquare);
        this.vbId = vb.id;
        this.vbBuffer = null;
        this.modificationMarker = 0;
    }
    var vao = vb.vao;
    renderer.bindVao(vao);
    var vertexBuf = vb.vb;
    vertexBuf.bind();
    var vertices = rectsCount * shader.vertPerQuad;
    if (vertices === 0)
        return;
    if (this.modificationMarker != vertices) {
        this.modificationMarker = vertices;
        var vs = shader.stride * vertices;
        if (!this.vbBuffer || this.vbBuffer.byteLength < vs) {
            var bk = shader.stride;
            while (bk < vs) {
                bk *= 2;
            }
            this.vbBuffer = new ArrayBuffer(bk);
            this.vbArray = new Float32Array(this.vbBuffer);
            this.vbInts = new Uint32Array(this.vbBuffer);
            vertexBuf.upload(this.vbBuffer, 0, true);						   
        }
        var arr = this.vbArray,
        ints = this.vbInts;
        var sz = 0;
        var textureId,
        shiftU,
        shiftV;
        if (useSquare) {
            for (i = 0; i < points.length; i += 10) {
                textureId = (points[i + 8] >> 2);
                shiftU = 1024 * (points[i + 8] & 1);
                shiftV = 1024 * ((points[i + 8] >> 1) & 1);
                arr[sz++] = points[i + 2];
                arr[sz++] = points[i + 3];
                arr[sz++] = points[i + 0] + shiftU;
                arr[sz++] = points[i + 1] + shiftV;
                arr[sz++] = points[i + 4];
                arr[sz++] = points[i + 6];
                arr[sz++] = points[i + 7];
                arr[sz++] = textureId;
            }
        } else {
            var tint = -1;
            for (i = 0; i < points.length; i += 10) {
                var eps = 0.5;
                textureId = (points[i + 8] >> 2);
                shiftU = 1024 * (points[i + 8] & 1);
                shiftV = 1024 * ((points[i + 8] >> 1) & 1);
                var x = points[i + 2],
                y = points[i + 3];
                var w = points[i + 4],
                h = points[i + 5];
                var u = points[i] + shiftU,
                v = points[i + 1] + shiftV;
                var animX = points[i + 6],
                animY = points[i + 7];
                var rot = points[i + 9];
                arr[sz++] = x;
                arr[sz++] = y;
                arr[sz++] = u;
                arr[sz++] = v;
                arr[sz++] = u + eps;
                arr[sz++] = v + eps;
                arr[sz++] = u + w - eps;
                arr[sz++] = v + h - eps;
                arr[sz++] = animX;
                arr[sz++] = animY;
                arr[sz++] = textureId;
                arr[sz++] = rot;
                arr[sz++] = x + w;
                arr[sz++] = y;
                arr[sz++] = u + w;
                arr[sz++] = v;
                arr[sz++] = u + eps;
                arr[sz++] = v + eps;
                arr[sz++] = u + w - eps;
                arr[sz++] = v + h - eps;
                arr[sz++] = animX;
                arr[sz++] = animY;
                arr[sz++] = textureId;
                arr[sz++] = rot;
                arr[sz++] = x + w;
                arr[sz++] = y + h;
                arr[sz++] = u + w;
                arr[sz++] = v + h;
                arr[sz++] = u + eps;
                arr[sz++] = v + eps;
                arr[sz++] = u + w - eps;
                arr[sz++] = v + h - eps;
                arr[sz++] = animX;
                arr[sz++] = animY;
                arr[sz++] = textureId;
                arr[sz++] = rot;
                arr[sz++] = x;
                arr[sz++] = y + h;
                arr[sz++] = u;
                arr[sz++] = v + h;
                arr[sz++] = u + eps;
                arr[sz++] = v + eps;
                arr[sz++] = u + w - eps;
                arr[sz++] = v + h - eps;
                arr[sz++] = animX;
                arr[sz++] = animY;
                arr[sz++] = textureId;
                arr[sz++] = rot;
            }
        }
        vertexBuf.upload(arr, 0, true);
    }
    if (useSquare)
        gl.drawArrays(gl.POINTS, 0, vertices);
    else
        gl.drawElements(gl.TRIANGLES, rectsCount * 6, gl.UNSIGNED_SHORT, 0);
};

//=============================================================================
// PIXI.tilemap.RectTileShader
//=============================================================================

// ty Draughtnyan for some of the shader code here
var rectShaderFrag = "varying vec2 vTextureCoord;\nvarying vec4 vFrame;\nvarying float vTextureId;\nuniform vec4 shadowColor;\nuniform sampler2D uSamplers[%count%];\nuniform vec2 uSamplerSize[%count%];\n\nvoid main(void){\n   vec2 textureCoord = clamp(vTextureCoord, vFrame.xy, vFrame.zw);\n   float textureId = floor(vTextureId + 0.5);\n\n   vec4 color;\n   %forloop%\n   gl_FragColor = color;\n}";
var rectShaderVert = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aFrame;\nattribute vec2 aAnim;\nattribute float aTextureId;\nattribute float aFlipWays;\nuniform mat3 projectionMatrix;\nuniform vec2 animationFrame;\nvarying vec2 vTextureCoord;\nvarying float vTextureId;\nvarying vec4 vFrame;\n\nvoid main() {\n  gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n  vec2 anim = aAnim * animationFrame;\n  vec2 texCoord = aTextureCoord + anim;\n  vec4 frame = aFrame + vec4(anim, anim);\n  vec2 localCoord = (texCoord - frame.xy) / (frame.zw - frame.xy);\n  if (aFlipWays == 2.0 || aFlipWays == 6.0 || aFlipWays == 10.0 || aFlipWays == 14.0) {\n    localCoord = vec2(localCoord.y, localCoord.x);\n  }\n  ;\n  if (aFlipWays == 2.0 || aFlipWays == 4.0 || aFlipWays == 12.0 || aFlipWays == 14.0) {\n    localCoord.x = 1.0 - localCoord.x;\n  }\n  ;\n  if (aFlipWays == 4.0 || aFlipWays == 6.0 || aFlipWays == 8.0 || aFlipWays == 14.0) {\n    localCoord.y = 1.0 - localCoord.y;\n  }\n  ;\n  vTextureCoord = frame.xy + localCoord * (frame.zw - frame.xy);\n  vFrame = frame;\n  vTextureId = aTextureId;\n}\n"

var rectTileShader_createVao = function (renderer, vb) {
    var gl = renderer.gl;
    return renderer.createVao()
    .addIndex(this.indexBuffer)
    .addAttribute(vb, this.attributes.aVertexPosition, gl.FLOAT, false, this.stride, 0)
    .addAttribute(vb, this.attributes.aTextureCoord, gl.FLOAT, false, this.stride, 2 * 4)
    .addAttribute(vb, this.attributes.aFrame, gl.FLOAT, false, this.stride, 4 * 4)
    .addAttribute(vb, this.attributes.aAnim, gl.FLOAT, false, this.stride, 8 * 4)
    .addAttribute(vb, this.attributes.aTextureId, gl.FLOAT, false, this.stride, 10 * 4)
    .addAttribute(vb, this.attributes.aFlipWays, gl.FLOAT, false, this.stride, 11 * 4);
};

PIXI.tilemap.RectTileShader = function (gl, maxTextures) {
	// make a "new subclass", i don't really like this but works about the same as the normal RectTileShader
	// since it's just TileMapShader but with the "createVao" method, not only that but it already sets new
	// properties as well for it
	var _this = new PIXI.tilemap.TilemapShader(gl, maxTextures, rectShaderVert, PIXI.tilemap.shaderGenerator.generateFragmentSrc(maxTextures, rectShaderFrag)) || this;
	_this.createVao = rectTileShader_createVao;
    _this.vertSize = 12;
    _this.vertPerQuad = 4;
    _this.stride = _this.vertSize * 4;
    PIXI.tilemap.shaderGenerator.fillSamplers(_this, _this.maxTextures);
    return _this;
};

Game_TiledObject.prototype._setup = function (data) {
    this._data = data;
    this._id = data.id;

    let gid = data.gid;
    gid &= ~(FLIPPED_HORIZONTALLY_FLAG | FLIPPED_VERTICALLY_FLAG);
    this._gid = gid ? gid : undefined;
    this._textureId = VisuMZ.TiledMZ.getTextureId(gid);

    const tileset = $gameMap.tiledData.tilesets[this._textureId];

    if (tileset) {
        this._tileWidth = tileset.tilewidth;
        this._tileHeight = tileset.tileheight;
        let paths = tileset.image.split("/");
        this._tileId = this._gid - tileset.firstgid;
		if (typeof tileset.tiles === 'object') {
	        var p = [];
	        for (const [k, value] of Object.entries(tileset.tiles)) {
				let i = value;
		        i.id = k;
		        p.push(i);
	        };
	        var tileArr = p;
		};

        const tile = tileset.tiles ? tileArr.find(t => t.id == this._tileId) : undefined;
        if (tile) {
            const anim = tile.animation;
            if (anim) {
				const durations = [];
			    anim.forEach(a => durations.push(a.duration / 1000 * 60));
                const duration = anim[0].duration / 1000 * 60;
                const maxFrame = anim.length;
                this._animData = { frame: 0, maxFrame: maxFrame, duration: duration, maxDuration: durations};
            }
            this._tileData = tile;
        }

        paths.shift();
        
        this.imageName = VisuMZ.TiledMZ.trimExt(paths.pop());
        this.imageFolder = paths.join('/') + '/';


    } else {
        this.imageName = "";
        this.imageFolder = "";
    }

    this.priority = this._priority();
    this.z = this._zIndex();

    this.visible = (data.visible === (undefined || null)) ? data.visible : true;
    this.x = data.x;
    this.y = data.y;
    this.width = data.width;
    this.height = data.height;
    this.rotation = data.rotation ? (data.rotation * Math.PI / 180) : 0;

    this.flipHorz = !!(data.gid & FLIPPED_HORIZONTALLY_FLAG);
    this.flipVert = !!(data.gid & FLIPPED_VERTICALLY_FLAG);

    const layer = VisuMZ.TiledMZ.layerFromId(this._data.layerId);

    this.anchor = new PIXI.Point(0, 1);

    const blendMode = VisuMZ.TiledMZ.propertyValue(data.properties, "blendMode");
    this.blendMode = VisuMZ.TiledMZ.strToBlendMode(blendMode !== null ? blendMode : "Normal");

    const opacity = VisuMZ.TiledMZ.propertyValue(data.properties, "opacity");
    this.opacity = parseInt(opacity) !== NaN ? parseInt(opacity) : 255;

    if (layer) {
        const xOffset = layer.offsetx;
        const yOffset = layer.offsety;
        this.offset = new PIXI.Point(xOffset, yOffset);
    } else {
        this.offset = new PIXI.Point(0,0);
    }
    this.alpha = 1;
    this.tint = 0xffffff;
};

// New function for grouped regions

Game_Map.prototype._setupRegions = function(layer, index) {
    const collisionMap = this._collisionMap[layer.level];
    const regionId = layer.regionId;
    if (regionId) {
        const data = layer.data[index];
        const x = index;
        if (regionId === "tile-base") {
            const tileProps = this._tileProperties(data);
            if (!!tileProps.regionId) {
                collisionMap[x].region = parseInt(tileProps.regionId);
				collisionMap[x].regionArray = collisionMap[x].regionArray || [];
                collisionMap[x].regionArray.push(parseInt(tileProps.regionId));
            }
        } else if (!!data) {
            collisionMap[x].region = parseInt(regionId);
			collisionMap[x].regionArray = collisionMap[x].regionArray || [];
            collisionMap[x].regionArray.push(parseInt(regionId));
        }
    }
};

var beesList_gameMapCreateTiledObject = Game_Map.prototype.createTiledObject;
Game_Map.prototype.createTiledObject = function (obj) {
    if (obj && obj.gid) {
        let gid = obj.gid;
        gid &= ~(FLIPPED_HORIZONTALLY_FLAG | FLIPPED_VERTICALLY_FLAG);
        let textureId = VisuMZ.TiledMZ.getTextureId(gid);
        const source = $gameMap.tiledData.tilesets[textureId].source;
        if (!source) return;
    };
    beesList_gameMapCreateTiledObject.call(this, obj);
};

Game_Map.prototype._tileProperties = function(tileId) {
    const tilesets = this.tiledData.tilesets;
    const tilesetId = VisuMZ.TiledMZ.getTextureId(tileId);
    const tileset = tilesets[tilesetId];
    if (!tileId || !tileset) return {};
    const tilesetProps = tileset.tileproperties;
    if (!tilesetProps) return {};
    const id = tileId - tileset.firstgid;
    const tileProps = tileset.tileproperties[id];
    if (tileProps) return tileProps;
    return {};
};

// for same as character fix
Sprite_Character.prototype.initMembers = function() {
    VisuMZ.TiledMZ.Sprite_Character_initMmebers.call(this);
};

Game_Map.prototype.hasRegionId = function(x, y, regionId) {
    const collisionMap = this._collisionMap[this.currentMapLevel];
    const index = x + this.width() * y;
	if (this.isValid(x, y)) {
		if (!collisionMap[index].regionArray) return false;
		return collisionMap[index].regionArray.includes(regionId);
	};
};

Spriteset_Map.prototype.loadTileset = function() {
    if (!$gameMap.isTiled()) return VisuMZ.TiledMZ.Spriteset_Map_loadTileset.call(this);
    //const bitmaps = [];
	var i = 0;
    for (const tileset of $gameMap.tiledData.tilesets) {
        // bitmaps.push(ImageManager.loadTiledTileset(tileset.image));
		this._tilemap.bitmaps[i] = ImageManager.loadTiledTileset(tileset.image);
		i++;
    }
    //this._tilemap.setBitmaps(bitmaps);
	this._tilemap.refreshTileset();
    this._tileset = $gameMap.tiledData.tilesets;
};

Spriteset_Map.prototype.update = function() {
    VisuMZ.TiledMZ.Spriteset_Map_update.call(this);
    for (const character of this._characterSprites) {
        if (!character._character.mirrors) character._character.mirrors = [];
        for (const mirror of character._character.mirrors) {
            if (this._reflectionSprites.find(refSprite => refSprite._data && refSprite._data.reflectionCast === undefined && refSprite._data.id === mirror.id
                && refSprite._character === character._character)) {
                continue;
            }
            const refSprite = new Sprite_CharacterReflection(character._character);
            refSprite.setup(mirror);
            this._reflectionSprites.push(refSprite);
            this._tilemap.addChild(refSprite);
        }
        if (!character._character.reflections) character._character.reflections = [];
        for (const reflection of character._character.reflections) {
            if (this._reflectionSprites.find(refSprite => refSprite._data && refSprite._data.reflectionCast !== undefined && refSprite._data.id === reflection.id
                && refSprite._character === character._character)) {
                continue;
            }
            const refSprite = new Sprite_CharacterReflection(character._character);
            refSprite.setup(reflection);
            this._reflectionSprites.push(refSprite);
            this._tilemap.addChild(refSprite);
        }
    }
    for (const sprite of this._reflectionSprites) {
        if (!sprite.isValidReflection()) {
            var i = this._reflectionSprites.indexOf(sprite);
			this._reflectionSprites.splice(i, 1);
            this._tilemap.removeChild(sprite);
            delete sprite;
        }
    }
    for (const sprite of this._characterSprites) {
        if (sprite._character instanceof Game_Event && sprite._character._erased) {
            this._tilemap.removeChild(sprite);
            delete sprite;
        }
    }
};

// Slowdown Fix, The MV Tiled plugin makes event objects (which yes, includes the player itself) have faster moving distances (... for some reason?)
// this is somewhat-ish taken from it so it's basically inherited from the MV Plugin itself
// ty Cooldry for catching this

var gameCharacterBaseOld_distancePerFrame = Game_CharacterBase.prototype.distancePerFrame;
Game_CharacterBase.prototype.distancePerFrame = function () {
	let d = gameCharacterBaseOld_distancePerFrame.call(this);
	return d * (48 / Math.min($gameMap.tileWidth(), $gameMap.tileHeight()));
};