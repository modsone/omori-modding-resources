//=============================================================================
// Camera Blockers - By TomatoRadio
// TR_CustomMenuFaceSizes.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_CameraBlockers = true;

var TR = TR || {};
TR.CB = TR.CB || {};

/*: 
 *
 * @plugindesc v0.2 Allows Regions to Block Cam Movement
 * @author TomatoRadio
 * 
 * @help
 * With this plugin, region tiles (by default 101-103)
 * can be used to block camera movement.
 * 
 * When the camera passes over a blocking region, it will
 * not scroll past that tile.
 * 
 * Note that:
 * Up blocks its bottom
 * Down blocks its top
 * Right blocks its left
 * Left blocks its right
 * 
 * You can choose different regions to block
 * any combination of the cardinal directions.
 * 
 * ---------------------------------------------------------
 * 
 * This release is considered a "good enough" version.
 * Roughly translated, that means "This plugin is prob
 * very weird with any kind of edge case but the baseline
 * stuff works and the baseline stuff is like 80% of uses
 * so I'm just letting people have this now and fix it up
 * to a proper standard later."
 * 
 * If you encounter bugs, please reach out to me on Discord
 * with the name @tomatoradio. I am relatively active in the
 * MODSPACE server and also have open DMs, so either method
 * of contact works.
 * 
 * ----------------------------------------------------------
 * 
 * v0.1 - Release
 * v0.2 - Fixed bug where opening the menu misaligns the camera.
 * (Thank you Another Fran)
 * 
 * @param regions
 * @text Region IDs
 * @type struct<DirArrays>
 * @description The RegionIDs.
 * @default {"up":"[\"101\",\"102\"]","down":"[\"101\",\"102\"]","left":"[\"101\",\"103\"]","right":"[\"101\",\"103\"]"}
*/
/*~struct~DirArrays:
* 
* @param up
* @type number[]
* @min 1
* @max 128
* @decimals 0
* @desc Regions that block upwards scrolling.
*
* @param down
* @type number[]
* @min 1
* @max 128
* @decimals 0
* @desc Regions that block downwards scrolling.
* 
* @param left
* @type number[]
* @min 1
* @max 128
* @decimals 0
* @desc Regions that block leftward scrolling.
*
* @param right
* @type number[]
* @min 1
* @max 128
* @decimals 0
* @desc Regions that block rightward scrolling.
*
*/

TR.CB.Param  = PluginManager.parameters('TR_CameraBlockers');

TR.CB.regions = JSON.parse(TR.CB.Param["regions"]);
for (let dir in TR.CB.regions) {TR.CB.regions[dir] = JSON.parse(TR.CB.regions[dir]).map(function(n){return parseInt(n)})};

TR.CB.scrollUp = Game_Map.prototype.scrollUp;
Game_Map.prototype.scrollUp = function(distance) {
    let yList = Array.distanceLoop(Math.floor(this._displayY),-1,0,this.height(),this.isLoopVertical());
    let xList = Array.fromTo(Math.floor(this._displayX),Math.floor(this._displayX)+this.screenTileX());
    let blockY = 0;
    let foundBlock = false;
    for (let y of yList) {
        if (foundBlock) break;
        for (let x of xList) {
            if (this.isCamBlock(x,y,"up")) {
                blockY = y+1;
                foundBlock = true;
                break;
            };
        };
    };
    if (foundBlock) {
        distance = this._displayY - distance < blockY ? Math.max(this._displayY - blockY,0) : distance;
    }
    TR.CB.scrollUp.call(this,distance);
};

TR.CB.scrollDown = Game_Map.prototype.scrollDown;
Game_Map.prototype.scrollDown = function(distance) {
    let yList = Array.distanceLoop(Math.floor(this.displayBottomY()),0,0,this.height(),this.isLoopVertical());
    let xList = Array.fromTo(Math.round(this._displayX),Math.round(this._displayX)+this.screenTileX());
    let blockY = 0;
    let foundBlock = false;
    for (let y of yList) {
        if (foundBlock) break;
        for (let x of xList) {
            if (this.isCamBlock(x,y,"down")) {
                blockY = y;
                foundBlock = true;
                break;
            };
        };
    };
    if (foundBlock) {
        console.log(distance,blockY,this.displayBottomY());
        distance = this.displayBottomY() - 1 < blockY ? 0 : distance;
        console.log(distance);
        this._displayY = Math.floor(this._displayY);
    }
    TR.CB.scrollDown.call(this,distance);
};

TR.CB.scrollRight = Game_Map.prototype.scrollRight;
Game_Map.prototype.scrollRight = function(distance) {
    let xList = Array.distanceLoop(Math.floor(this.displayRightX()),0,0,this.width(),this.isLoopHorizontal());
    let yList = Array.fromTo(Math.round(this._displayY),Math.round(this._displayY)+this.screenTileY());
    let blockX = 0;
    let foundBlock = false;
    for (let x of xList) {
        if (foundBlock) break;
        for (let y of yList) {
            if (this.isCamBlock(x,y,"right")) {
                blockX = x;
                foundBlock = true;
                break;
            };
        };
    };
    if (foundBlock) {
        distance = this.displayRightX() - 1 < blockX ? 0 : distance;
        this._displayX = Math.floor(this._displayX);
    }
    TR.CB.scrollRight.call(this,distance);
};

TR.CB.scrollLeft = Game_Map.prototype.scrollLeft;
Game_Map.prototype.scrollLeft = function(distance) {
    let xList = Array.distanceLoop(Math.floor(this._displayX),-1,0,this.width(),this.isLoopHorizontal());
    let yList = Array.fromTo(Math.floor(this._displayY),Math.floor(this._displayY)+this.screenTileY());
    let blockX = 0;
    let foundBlock = false;
    for (let x of xList) {
        if (foundBlock) break;
        for (let y of yList) {
            if (this.isCamBlock(x,y,"left")) {
                blockX = x+1;
                foundBlock = true;
                break;
            };
        };
    };
    if (foundBlock) {
        distance = this._displayX - distance < blockX ? Math.max(this._displayX - blockX,0) : distance;
    }
    TR.CB.scrollLeft.call(this,distance);
};

TR.CB.setDisplayPos = Game_Map.prototype.setDisplayPos;
Game_Map.prototype.setDisplayPos = function(x, y) {
    if (SceneManager._scene.constructor.name !== "TeleportScene") { // This is the console map teleport
        let xList = Array.distanceLoop(Math.floor(x),this.screenTileX()+1,0,this.width(),this.isLoopHorizontal());
        let yList = Array.distanceLoop(Math.floor(y),this.screenTileY()+1,0,this.height(),this.isLoopVertical());
        let top = 0;let left = 0;let bottom = null;let right = null;
        for (let ix = 0; ix < xList.length; ix++) {
            let x = xList[ix];
            let l = x<$gamePlayer.x;
            for (let iy = 0; iy < yList.length; iy++) {
                let y = yList[iy];
                let u = y<$gamePlayer.y;
                //console.log(x,y,u,l,ix,iy);
                if (l && this.isCamBlock(x,y,"left")) left = ix;
                if (u && this.isCamBlock(x,y,"up")) top = iy;
                if (!l && right === null && this.isCamBlock(x,y,"right")) right = ix-xList.length+1;
                if (!u && bottom === null && this.isCamBlock(x,y,"down")) bottom = iy-yList.length+1;
            };
        };
        if (bottom === null) bottom = 0;
        if (right === null) right = 0;
        x = left || right ? Math.ceil(x+left+right) : x;
        y = top || bottom ? Math.ceil(y+top+bottom) : y;
    };
    TR.CB.setDisplayPos.call(this,x,y);
};

TR.CB.onMapLoaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
    TR.CB.onMapLoaded.call(this);
	Game_CharacterBase.prototype.locate.call($gamePlayer, $gamePlayer.x, $gamePlayer.y);
	$gamePlayer.center($gamePlayer.x, $gamePlayer.y);
};  

Game_Map.prototype.displayRightX = function() {return this._displayX+this.screenTileX()};
Game_Map.prototype.displayBottomY = function() {return this._displayY+this.screenTileY()};
Game_Map.prototype.isCamBlock = function(x,y,dir) {return TR.CB.regions[dir].includes(this.regionId(x,y))};

Array.distanceLoop = function(start,distance,min=Number.MIN_SAFE_INTEGER,max=Number.MAX_SAFE_INTEGER,loop=true) {
    let arr = [];
    let mult = distance > 0 ? 1 : -1;
    for (let i = start; arr.length <= Math.abs(distance); i+=mult) {
        if (i < min) {if (loop) {i = max} else {break;}};
        if (i > max) {if (loop) {i = min} else {break;}};
        arr.push(i);
    };
    return arr;
};
Array.fromTo = function(start,end,interval=1) {
	var arr = [];
	for (let i = start; i <= end; i+=interval) {arr.push(i);};
	return arr;
};