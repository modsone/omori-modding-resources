//=============================================================================
// Bitmap Lines - By TomatoRadio
// TR_BitmapLines.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_BitmapLines = true;

var TR = TR || {};
TR.BL = TR.BL || {};
// "Don't"
// "Yeah it's too easy"

/*:
 * @plugindesc v1.1 Allows lines to be drawn on bitmaps and between characters.
 *
 * @author TomatoRadio
 *
 * @help
 * 
 * With this plugin, lines can be drawn on bitmaps,
 * and a Sprite_Line object was created to draw lines
 * between 2 positions in the map, either as screen coords
 * or character positions.
 * 
 * To draw a line on a bitmap, the fillLine() function
 * was added.
 * 
 * Parameters
 * x1 - The x coordinate for the start of the line
 * y1 - The y coordinate for the start of the line
 * x2 - The x coordinate for the end of the line
 * y2 - The y coordinate for the end of the line
 * width - The width of the line
 * color - The color of the line in CSS format
 * cap - The shape at the end of the lines. "butt","round","square". Default "butt"
 * 
 * More notably though is Sprite_Line. To make these use:
 * 
 * $gameMap.createLine(z,data);
 * 
 * z - The Z-Index of the line. (1-Below Characters, 3-Same As Characters, 5-Above Characters)
 * (Generally you want to place the line on the between indexes, such as 0 or 2)
 * data - An Object of all the other data on the line. Every property is optional.
 * ---------------------------------------------------------------------------------
 * character1 - Either a Game_Character or an Array of the X and Y screen coords. Defaults to [0,0]
 * character2 - Either a Game_Character or an Array of the X and Y screen coords. Defaults to [640,480]
 * offset1 - An Array of an X and Y offset from character1. Useful for offsetting on characters. Defaults to [0,0]
 * offset2 - An Array of an X and Y offset from character2. Useful for offsetting on characters. Defaults to [0,0]
 * width - The width of the line. Defaults to 2
 * color - The CSS color of the line. Defaults to #000
 * cap - The cap-style of the line. Defaults to "butt"
 * ---------------------------------------------------------------------------------
 * 
 * These lines will persist in their original maps after scene changes and map loads.
 * 
 * To delete all lines from a map, use
 * $gameMap.deleteLines(mapId);
 * 
 * You can also access the line data from
 * $gameMap._lines
 * which an object of all the active lines, grouped by MapId.
 * Edits made to the properties in here will only take effect
 * once the line is remade (when the scene changes)
 * 
 */

/**
 * Fills the specified line.
 *
 * @method fillLine
 * @param {Number} x1 The x coordinate for the start of the line
 * @param {Number} y1 The y coordinate for the start of the line
 * @param {Number} x2 The x coordinate for the end of the line
 * @param {Number} y2 The y coordinate for the end of the line
 * @param {Number} width The width of the line
 * @param {String} color The color of the line in CSS format
 * @param {String} [cap="butt"] The shape at the end of the lines. "butt","round","square"
 *  
 */
Bitmap.prototype.fillLine = function(x1, y1, x2, y2, width, color, cap="butt") {
    var context = this._context;
    context.save();
    context.beginPath();
    context.strokeStyle = color;
    context.lineCap = cap;
    context.lineWidth = width;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.restore();
    this._setDirty();
};

function Sprite_Line() {
    this.initialize.apply(this, arguments);
}

Sprite_Line.prototype = Object.create(Sprite.prototype);
Sprite_Line.prototype.constructor = Sprite_Line;

Sprite_Line.prototype.initialize = function(z,data) {
    Sprite.prototype.initialize.call(this);
    this.z = z;
    this.createBitmap();
    this.setData(data);
};

Sprite_Line.prototype.createBitmap = function() {
    this.bitmap = new Bitmap(Graphics.width,Graphics.height);
};

Sprite_Line.prototype.setData = function(data) {
    this._data = data;
};

Sprite_Line.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateLine();
};

Sprite_Line.prototype.updateLine = function() {
    let bmp = this.bitmap;
    let p1 = this.getCoords(this._data.character1,this._data.offset1);
    let p2 = this.getCoords(this._data.character2,this._data.offset2);
    bmp.clear();
    bmp.fillLine(p1[0],p1[1],p2[0],p2[1],this._data.width,this._data.color,this._data.cap);
};

Sprite_Line.prototype.getCoords = function(c,o) {
    let x = 0;
    let y = 0;
    if (typeof c.screenX === "function") { // Assume character
        x = c.screenX();
        y = c.screenY();
    } else if (c instanceof Array) { // Assume raw coords
        x = c[0];
        y = c[1];
    } else {
        console.warn("Bad coords in Sprite_Line",c,this);
    };
    x+=o[0];
    y+=o[1];
    return [x,y];
};

Game_Map.prototype.createLine = function(z,data) {
    data = Object.assign({
        character1: [0,0],
        offset1: [0,0],
        character2: [640,480],
        offset2: [0,0],
        width: 2,
        color: "#000",
        cap: "butt"
    },data);
    this._lines = this._lines || {};
    this._lines[this._mapId] = this._lines[this._mapId] || [];
    this._lines[this._mapId].push([z,data]);
    const tilemap = SceneManager._scene._spriteset._tilemap;
    let sprite = new Sprite_Line(z,data);
    sprite.x = 0;
    sprite.y = 0;
    tilemap.addChild(sprite);
};

Game_Map.prototype.deleteLines = function(mapId) {
    this._lines = this._lines || {};
    this._lines[this._mapId] = [];
    let tilemap = SceneManager._scene._spriteset._tilemap;
    tilemap.children.forEach(function(s) {
        if ((s instanceof Sprite_Line)) {
            tilemap.removeChild(s);
        };
    });
};

Game_Map.prototype.updateLinePos = function(offset1,offset2) {
    if (offset1) this._lines[this._mapId][0][1].offset1 = offset1;
    if (offset2) this._lines[this._mapId][0][1].offset2 = offset2;
    let line = SceneManager._scene._spriteset._tilemap.children.find((s) => s instanceof Sprite_Line);
    if (offset1) line._data.offset1 = offset1;
    if (offset2) line._data.offset2 = offset2;
};

Game_Map.prototype.hideLine = function() {
    SceneManager._scene._spriteset._tilemap.children.find((s) => s instanceof Sprite_Line).alpha = 0;
};
Game_Map.prototype.showLine = function() {
    SceneManager._scene._spriteset._tilemap.children.find((s) => s instanceof Sprite_Line).alpha = 1;
};

const __SPRITESETMAP_OLD_CREATETILEMAP__ = Spriteset_Map.prototype.createTilemap;
Spriteset_Map.prototype.createTilemap = function() {
    __SPRITESETMAP_OLD_CREATETILEMAP__.call(this);
    if ($gameMap && $gameMap._lines && $gameMap._lines[$gameMap.mapId()] && $gameMap._lines[$gameMap.mapId()].length > 0) {
        let tilemap = this._tilemap;
        for (let data of $gameMap._lines[$gameMap.mapId()]) {
            let sprite = new Sprite_Line(data[0],data[1]);
            sprite.x = 0;
            sprite.y = 0;
            tilemap.addChild(sprite);
        };
    };
};