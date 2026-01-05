// It's basically an attempt to make UltraMode7.js compatible with YED_Tiled.js -Geobees
 
ShaderTilemap.prototype._createLayersUltra7 = function() {
		// width/height forcing is needed, because some scripts manipulate the width and height values of the tilemap
		this._width = $gameMap.width() * $gameMap.tileWidth();
		this._height = $gameMap.height() * $gameMap.tileHeight();
		if ($gameMap.isLoopHorizontal())
		{
			this._width += Graphics.width;
		}
		if ($gameMap.isLoopVertical())
		{
			this._height += Graphics.height;
		}
		const width = this._width;
		const height = this._height;
		const tileCols = Math.ceil(width / this.tileWidth) + 1;
		const tileRows = Math.ceil(height / this.tileHeight) + 1;
		this._layerWidth = tileCols * this.tileWidth;
		this._layerHeight = tileRows * this.tileHeight;
		this._needsRepaint = true;
		if (!this.lowerZLayer)
		{
			this.lowerZLayer = new PIXI.tilemap.ZLayer(this, 0);
			this.upperZLayer = new PIXI.tilemap.ZLayer(this, 0);
			this.addChild(this.lowerZLayer);
			this.addChild(this.upperZLayer);
			const parameters = PluginManager.parameters('ShaderTilemap');
			const useSquareShader = Number(parameters.hasOwnProperty('squareShader') ? parameters['squareShader'] : 0);
			this.lowerLayer = new PIXI.tilemap.CompositeRectTileLayer(0, [], useSquareShader);
			this.lowerLayer.shadowColor = new Float32Array([0.0, 0.0, 0.0, 0.5]);
			this.lowerZLayer.addChild(this.lowerLayer);
			this.upperLayer = new PIXI.tilemap.CompositeRectTileLayer(0, [], useSquareShader);
			this.upperZLayer.addChild(this.upperLayer);
		}
}

// These are sort of no use atm with the tiled plugin
Tilemap.prototype._makeMarginX = function() {
	return 0;
};

Tilemap.prototype._makeMarginY = function() {
	return 0;
};

// Overriding original initialize
let UltraMode7_initialize = Tilemap.prototype.initialize;
Tilemap.prototype.initialize = function() {
	if (!UltraMode7.isActive())
	{
		UltraMode7_initialize.call(this);
		return;
	}
	const _createLayers = this._createLayers;
	const refresh = this.refresh;
	this._createLayers = this.refresh = function() { };
	UltraMode7_initialize.call(this);
	this._margin = 0;
	this._width = $gameMap.width() * $gameMap.tileWidth();
	this._height = $gameMap.height() * $gameMap.tileHeight();
	if (UltraMode7.IS_RMMV)
	{
		this._layerWidth = 0;
		this._layerHeight = 0;
		this._lastTiles = [];
	}
	this._createLayers = _createLayers;
	this._createLayers();
	// Removed these for YED_Tiled compatibility
	// (okay but what was this for anyway??)
	// this.refresh = _createLayers;
	// this.refresh();
};

// Finnicky, but seems to work. Instead of directly lias listing outside of its scope, we do it through the instantiating function.
// Other methods do not work since this is a function only ran usually once, and not every frame.
// ... Although, I wonder why putting the code below above all else in this plugin re-triggers the memory leak bug... -Geobees
ShaderTilemap_initialize = ShaderTilemap.prototype.initialize;
ShaderTilemap.prototype.initialize = function(tiledData) {
	let old_createLayers = this._createLayers;
    this._createLayers = function(layer, startX, startY, x, y) {
	    old_createLayers.call(this, startX, startY, x, y);
	    if (UltraMode7.isActive()) {
		    this._createLayersUltra7();
	    };
    };
	// Uses "same as characters" layers for tiles to render like events
	if (this._paintPriorityTile) {
		// console.log("tiledmap constructor!");
		let old_paintPriorityTile = this._paintPriorityTile;
		this._paintPriorityTile = function(layerId, textureId, tileId, startX, startY, dx, dy) {
			if (!UltraMode7.isActive()) {
		        old_paintPriorityTile.call(this, layerId, textureId, tileId, startX, startY, dx, dy);
				return;
	        };
			this._paintUltraMode7Tile(layerId, textureId, tileId, startX, startY, dx, dy);
	    }
	};
	// Optimize animated tiles
	if (this._updateAnimFrames) {
		// console.log("tiledmap constructor!");
		let old_updateAnimFrames = this._updateAnimFrames;
		this._updateAnimFrames = function() {
			if (UltraMode7.isActive()) {
		        old_updateAnimFrames.call(this);
				this._needsRepaint = true;
				return;
	        };
			old_updateAnimFrames.call(this);
	    }
	};
	ShaderTilemap_initialize.call(this, tiledData);
};

ShaderTilemap.prototype._paintUltraMode7Tile = function(layerId, textureId, tileId, startX, startY, dx, dy) {
	var tileset = this.tiledData.tilesets[textureId];
	var w = tileset.tilewidth;
	var h = tileset.tileheight;
	var tileCols = tileset.columns;
    var rId = this._getAnimTileId(textureId, tileId - tileset.firstgid);
	var ux = rId % tileCols * w;
	var uy = Math.floor(rId / tileCols) * h;
	var sprite = this._priorityTiles[this._priorityTilesCount];
	var layerData = this.tiledData.layers[layerId];
	var offsetX = layerData ? layerData.offsetx || 0 : 0;
	var offsetY = layerData ? layerData.offsety || 0 : 0;
	var ox = 0;
	var oy = 0;
	if (this.roundPixels) {
	    ox = Math.floor(this.origin.x);
	    oy = Math.floor(this.origin.y);
	} else {
	    ox = this.origin.x;
	    oy = this.origin.y;
	}
	if (this._priorityTilesCount >= this._priorityTiles.length) {
	     return;
	}
	sprite.layerId = layerId;
	sprite.anchor.x = layerData.type == "objectgroup" ? 0.31 : 0.5;
	sprite.anchor.y = 1.0;
	sprite.origX = dx;
	sprite.origY = dy;
	sprite.x = UltraMode7.mapToScreen(sprite.origX + startX * this._tileWidth - ox + offsetX + w / 2, sprite.origY + startY * this._tileHeight - oy + offsetY + h).x;
	sprite.y = UltraMode7.mapToScreen(sprite.origX + startX * this._tileWidth - ox + offsetX + w / 2, sprite.origY + startY * this._tileHeight - oy + offsetY + h).y;
	var scale = UltraMode7.mapToScreenScale(sprite.origX + startX * this._tileWidth - ox + offsetX + w / 2, sprite.origY + startY * this._tileHeight - oy + offsetY + h);
	sprite.scale.x = 1;
	sprite.scale.y = 1;
	sprite.scale.x *= scale;
	sprite.scale.y *= scale;
	sprite.bitmap = this.bitmaps[textureId];
	sprite.setFrame(ux, uy, w, h);
	sprite.priority = this._getPriority(layerId);
	sprite.z = sprite.zIndex = this._getZIndex(layerId);
	sprite.show();
    this._priorityTilesCount += 1;
};

// ###########################
// Make "same as character" & object layer tiles render as events
// ###########################
const Old_ShaderTilemap_updateTransform = ShaderTilemap.prototype.updateTransform;
ShaderTilemap.prototype.updateTransform = function() {
	if (UltraMode7.isActive()) {
		this.updateSameCharacterTilesUltra7();
		Old_ShaderTilemap_updateTransform.call(this);
		return;
	}
	Old_ShaderTilemap_updateTransform.call(this);
};

ShaderTilemap.prototype.updateSameCharacterTilesUltra7 = function() {
	const startX = Math.floor(-this._makeMarginX() / this.tileWidth);
    const startY = Math.floor(-this._makeMarginY() / this.tileHeight);
	this._priorityTilesCount = 0;
	for (let layer of this._layers) {
		if (layer.zIndex == 3) {
            layer.clear();
            this._paintTiles(layer, startX, startY);
		};
    };
	var id = 0;
	for (layer of this.tiledData.layers) {
		if (layer.properties && layer.properties.zIndex == '3') {
			if (layer.type == "objectgroup") {
		        this._paintObjectLayers(id, startX, startY);
			}
		};
		id++;
	};
	while (this._priorityTilesCount < this._priorityTiles.length) {
        let sprite = this._priorityTiles[this._priorityTilesCount];
        sprite.hide();
        sprite.layerId = -1;
        this._priorityTilesCount++;
	};
};

// Straight up override this method
PIXI.tilemap.RectTileLayer.prototype.ultraMode7Render = function(renderer, tile) {
	const points = this.pointsBuf;
	if (points.length === 0) {
		return;
	}
	const shader = tile.getShader();
	const textures = this.textures;
	if (textures.length === 0) {
		return;
	}
	const quadsCount = points.length / 9;
	if (quadsCount === 0) {
		return;
	}
	const gl = renderer.gl;
	const length = textures.length;
	for (var i = 0; i < length; ++i) {
		if (!textures[i] || !textures[i].valid) {
			return;
		}
		const texture = textures[i].baseTexture;
	}
	if (!this.vbIds) {
		this.vbIds = [];
		this.vbBuffers = [];
		this.modificationMarkers = [];
		this.vbArrays = [];
	}
	tile.checkIndexBuffer(quadsCount);
	tile.bindTextures(renderer, shader, textures);
	shader.uniforms.uMode7ProjectionMatrix = $gameMap.ultraMode7ProjectionMatrix.data;
	shader.uniforms.uMode7ModelviewMatrix = $gameMap.ultraMode7ModelviewMatrix.data;
	shader.uniforms.uFadeBegin = $gameMap.ultraMode7FadeBegin;
	shader.uniforms.uFadeRange = $gameMap.ultraMode7FadeEnd - $gameMap.ultraMode7FadeBegin;
	shader.uniforms.uFadeColor = $gameMap.ultraMode7FadeColor;
	const maxQuads = UltraMode7.WEBGL_MAX_VERTICES / shader.vertPerQuad;
	const maxLoops = Math.floor((quadsCount + maxQuads - 1) / maxQuads);
	for (var j = 0; j < maxLoops; ++j) {
		if (!this.vbIds[j]) {
			this.vbIds[j] = 0;
			this.vbBuffers[j] = null;
			this.modificationMarkers[j] = 0;
			this.vbArrays[j] = null;
		}
		const currentRectsCount = Math.min(maxQuads, quadsCount - j * maxQuads);
		var vb = null;
		if (!UltraMode7.NEWER_PIXI_TILEMAP)	{
			vb = tile.getVb(this.vbIds[j]);
		} else {
			if (!this.vbs) {
				this.vbs = {};
			}
			vb = this.getUltraMode7Vb(tile, this.vbIds[j]);
		}
		if (!vb) {
			if (!UltraMode7.NEWER_PIXI_TILEMAP) {
					vb = tile.createVb(false);
			} else {
				vb = tile.createVb();
				this.vbs[vb.id] = vb;
			}
			this.vbIds[j] = vb.id;
			this.vbBuffers[j] = null;
			this.modificationMarkers[j] = 0;
			this.vbArrays[j] = null;
		}
		const vao = vb.vao;
		renderer.bindVao(vao);
		const vertexBuf = vb.vb;
		vertexBuf.bind();
		const currentVertices = currentRectsCount * shader.vertPerQuad;
		// Commented out, not sure what this condition is exactly for yet but yed_tiled.js seems to run this section of the code fine every frame
		// (maybe it's not just limited to yed_tiled.js and default rpg maker mapping runs this just once too?)
		//if (this.modificationMarkers[j] !== currentVertices) {
		this.modificationMarkers[j] = currentVertices;
		const vs = shader.stride * currentVertices;
		if (!this.vbBuffers[j] || this.vbBuffers[j].byteLength < vs) {
			var bk = shader.stride;
			while (bk < vs) {
				bk *= 2;
			}
			this.vbBuffers[j] = new ArrayBuffer(bk);
			this.vbArrays[j] = new Float32Array(this.vbBuffers[j]);
			vertexBuf.upload(this.vbBuffers[j], 0, true);
		}
		const data = this.vbArrays[j];
		var index = 0;
		const eps = 0.5;
		for (i = j * maxQuads * 9; i < points.length && i < (j + 1) * maxQuads * 9; i += 9) {
			const x = points[i + 2];
			const y = points[i + 3];
			const w = points[i + 4];
			const h = points[i + 5];
			const u = points[i] + 1024 * (points[i + 8] & 1);
			const v = points[i + 1] + 1024 * ((points[i + 8] >> 1) & 1);
			const animX = points[i + 6];
			const animY = points[i + 7];
			const textureId = (points[i + 8] >> 2);
			data[index++] = textureId;
			data[index++] = u + eps;
			data[index++] = v + eps;
			data[index++] = u + w - eps;
			data[index++] = v + h - eps;
			data[index++] = u;
			data[index++] = v;
			data[index++] = x;
			data[index++] = y;
			data[index++] = animX;
			data[index++] = animY;
			data[index++] = textureId;
			data[index++] = u + eps;
			data[index++] = v + eps;
			data[index++] = u + w - eps;
			data[index++] = v + h - eps;
			data[index++] = u + w;
			data[index++] = v;
			data[index++] = x + w;
			data[index++] = y;
			data[index++] = animX;
			data[index++] = animY;
			data[index++] = textureId;
			data[index++] = u + eps;
			data[index++] = v + eps;
			data[index++] = u + w - eps;
			data[index++] = v + h - eps;
			data[index++] = u + w;
			data[index++] = v + h;
			data[index++] = x + w;
			data[index++] = y + h;
			data[index++] = animX;
			data[index++] = animY;
			data[index++] = textureId;
			data[index++] = u + eps;
			data[index++] = v + eps;
			data[index++] = u + w - eps;
			data[index++] = v + h - eps;
			data[index++] = u;
			data[index++] = v + h;
			data[index++] = x;
			data[index++] = y + h;
			data[index++] = animX;
			data[index++] = animY;
		}
		vertexBuf.upload(data, 0, true);
		//}
	gl.drawElements(gl.TRIANGLES, currentRectsCount * 6, gl.UNSIGNED_SHORT, 0);
	}
}	