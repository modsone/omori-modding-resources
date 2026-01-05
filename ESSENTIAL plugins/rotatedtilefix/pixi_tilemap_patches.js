(function (PIXI) {
    var tilemap;
    (function (tilemap) {
        var rectShaderFrag = "\nvarying vec2 vTextureCoord;\nvarying vec4 vFrame;\nvarying float vTextureId;\nuniform vec4 shadowColor;\nuniform sampler2D uSamplers[%count%];\nuniform vec2 uSamplerSize[%count%];\n\nvoid main(void){\n   vec2 textureCoord = clamp(vTextureCoord, vFrame.xy, vFrame.zw);\n   float textureId = floor(vTextureId + 0.5);\n\n   vec4 color;\n   %forloop%\n   gl_FragColor = color;\n}";
        var rectShaderVert = "\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aFrame;\nattribute vec2 aAnim;\nattribute float aTextureId;\nattribute vec3 aFlipWays;\n\nuniform mat3 projectionMatrix;\nuniform vec2 animationFrame;\n\nvarying vec2 vTextureCoord;\nvarying float vTextureId;\nvarying vec4 vFrame;\n\nvoid main(void){\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n   \n   vec2 anim = aAnim * animationFrame;\n   vec2 texCoord = aTextureCoord + anim;\n   vec4 frame = aFrame + vec4(anim, anim);\n   \n   vec2 localCoord = (texCoord - frame.xy) / (frame.zw - frame.xy);\n   \n   if (aFlipWays.z > 0.5) {\n      localCoord = vec2(localCoord.y, localCoord.x);\n   }\n   \n   if (aFlipWays.x > 0.5) {\n      localCoord.x = 1.0 - localCoord.x;\n   }\n   \n   if (aFlipWays.y > 0.5) {\n      localCoord.y = 1.0 - localCoord.y;\n   }\n   \n   vTextureCoord = frame.xy + localCoord * (frame.zw - frame.xy);\n   vFrame = frame;\n   vTextureId = aTextureId;\n}\n";
        var TilemapShader = (function (_super) {
            __extends(TilemapShader, _super);
            function TilemapShader(gl, maxTextures, shaderVert, shaderFrag) {
                var _this = _super.call(this, gl, shaderVert, shaderFrag) || this;
                _this.maxTextures = 0;
                _this.maxTextures = maxTextures;
                tilemap.shaderGenerator.fillSamplers(_this, _this.maxTextures);
                return _this;
            }
            return TilemapShader;
        }(PIXI.Shader));
        tilemap.TilemapShader = TilemapShader;
        var RectTileShader = (function (_super) {
            __extends(RectTileShader, _super);
            function RectTileShader(gl, maxTextures) {
                var _this = _super.call(this, gl, maxTextures, rectShaderVert, tilemap.shaderGenerator.generateFragmentSrc(maxTextures, rectShaderFrag)) || this;
                _this.vertSize = 14;
                _this.vertPerQuad = 4;
                _this.stride = _this.vertSize * 4;
                tilemap.shaderGenerator.fillSamplers(_this, _this.maxTextures);
                return _this;
            }
            RectTileShader.prototype.createVao = function (renderer, vb) {
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
            return RectTileShader;
        }(TilemapShader));
        tilemap.RectTileShader = RectTileShader;
    })(tilemap = PIXI.tilemap || (PIXI.tilemap = {}));
})(PIXI || (PIXI = {}));
var PIXI;
(function (PIXI) {
    var tilemap;
    (function (tilemap) {
        var RectTileLayer = (function (_super) {
            __extends(RectTileLayer, _super);
            function RectTileLayer(zIndex, texture) {
                var _this = _super.call(this) || this;
                _this.z = 0;
                _this.zIndex = 0;
                _this.pointsBuf = [];
                _this._tempSize = new Float32Array([0, 0]);
                _this._tempTexSize = 1;
                _this.modificationMarker = 0;
                _this.hasAnim = false;
                _this.vbId = 0;
                _this.vbBuffer = null;
                _this.vbArray = null;
                _this.vbInts = null;
                _this.initialize(zIndex, texture);
                return _this;
            }
            RectTileLayer.prototype.initialize = function (zIndex, textures) {
                if (!textures) {
                    textures = [];
                }
                else if (!(textures instanceof Array) && textures.baseTexture) {
                    textures = [textures];
                }
                this.textures = textures;
                this.z = this.zIndex = zIndex;
                this.visible = false;
            };
            RectTileLayer.prototype.clear = function () {
                this.pointsBuf.length = 0;
                this.modificationMarker = 0;
                this.hasAnim = false;
            };
            RectTileLayer.prototype.drawImageEx = function (renderer,textureId, sx, sy, sw, sh, dx, dy, dw, dh) {
                renderer.context.save();
                renderer.context.translate(dx + dw / 2, dy + dh / 2);
                var fH = (textureId & 0x80000000) !== 0;
                var fV = (textureId & 0x40000000) !== 0;
                var fD = (textureId & 0x20000000) !== 0;
                // if (fH || fV || fD) { console.log(fH, fV, fD); }
                if (fD) {
                    fH = !fH;
                    renderer.context.rotate(Math.PI / 2);
                }
                renderer.context.scale(fH ? -1 : 1, fV ? -1 : 1);
                renderer.context.drawImage(this.textures[textureId & 0x0FFFFFFF].baseTexture.source, sx, sy, sw, sh, -dw / 2, -dh / 2, dw, dh);
                renderer.context.restore();
            }
            RectTileLayer.prototype.renderCanvas = function (renderer) {
                if (this.textures.length === 0)
                    return;
                var points = this.pointsBuf;
                renderer.context.fillStyle = '#000000';
                for (var i = 0, n = points.length; i < n; i += 9) {
                    var x1 = points[i], y1 = points[i + 1];
                    var x2 = points[i + 2], y2 = points[i + 3];
                    var w = points[i + 4];
                    var h = points[i + 5];
                    x1 += points[i + 6] * renderer.plugins.tilemap.tileAnim[0];
                    y1 += points[i + 7] * renderer.plugins.tilemap.tileAnim[1];
                    var textureId = points[i + 8];
                    if (((textureId & 0x0FFFFFFF) >= 0) && (this.textures[textureId & 0x0FFFFFFF] !== undefined)) {
                        // renderer.context.drawImage(this.textures[textureId & 0x0FFFFFFF].baseTexture.source, x1, y1, w, h, x2, y2, w, h);
                        this.drawImageEx(renderer, textureId, x1, y1, w, h, x2, y2, w, h);
                    }
                    else {
                        renderer.context.globalAlpha = 0.5;
                        renderer.context.fillRect(x2, y2, w, h);
                        renderer.context.globalAlpha = 1;
                    }
                }
            };
            RectTileLayer.prototype.addRect = function (textureId, u, v, x, y, tileWidth, tileHeight, animX, animY) {
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
                }
                else {
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
                    }
                    else if (tileHeight % tileWidth === 0) {
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
                    }
                    else {
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
            };
            ;
            RectTileLayer.prototype.renderWebGL = function (renderer, useSquare) {
                if (useSquare === void 0) { useSquare = false; }
                var points = this.pointsBuf;
                if (points.length === 0)
                    return;
                var rectsCount = points.length / 9;
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
                    var arr = this.vbArray, ints = this.vbInts;
                    var sz = 0;
                    var textureId, shiftU, shiftV;
                    if (useSquare) {
                        for (i = 0; i < points.length; i += 9) {
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
                    }
                    else {
                        var tint = -1;
                        for (i = 0; i < points.length; i += 9) {
                            var eps = 0.5;
                            flippedH = ((points[i + 8] & 0x80000000) !== 0)?1:0;
                            flippedV = ((points[i + 8] & 0x40000000) !== 0)?1:0;
                            flippedD = ((points[i + 8] & 0x20000000) !== 0)?1:0;
                            textureId = (points[i + 8] >> 2) & 0x0FFFFFFF;
                            shiftU = 1024 * (points[i + 8] & 1);
                            shiftV = 1024 * ((points[i + 8] >> 1) & 1);
                            var x = points[i + 2], y = points[i + 3];
                            var w = points[i + 4], h = points[i + 5];
                            var u = points[i] + shiftU, v = points[i + 1] + shiftV;
                            var animX = points[i + 6], animY = points[i + 7];
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
                            arr[sz++] = flippedH;
                            arr[sz++] = flippedV;
                            arr[sz++] = flippedD;
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
                            arr[sz++] = flippedH;
                            arr[sz++] = flippedV;
                            arr[sz++] = flippedD;
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
                            arr[sz++] = flippedH;
                            arr[sz++] = flippedV;
                            arr[sz++] = flippedD;
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
                            arr[sz++] = flippedH;
                            arr[sz++] = flippedV;
                            arr[sz++] = flippedD;
                        }
                    }
                    vertexBuf.upload(arr, 0, true);
                }
                if (useSquare)
                    gl.drawArrays(gl.POINTS, 0, vertices);
                else
                    gl.drawElements(gl.TRIANGLES, rectsCount * 6, gl.UNSIGNED_SHORT, 0);
            };
            return RectTileLayer;
        }(PIXI.Container));
        tilemap.RectTileLayer = RectTileLayer;
    })(tilemap = PIXI.tilemap || (PIXI.tilemap = {}));
})(PIXI || (PIXI = {}));