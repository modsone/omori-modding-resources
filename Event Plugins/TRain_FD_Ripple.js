/*:
 * @plugindesc Produces a water ripple/splash effect when walking
 * @author TrophicRain and FruitDragon
 * 
 * @help
 * This plugin allows you to add ripples to the map that gradually grow and fade 
 * as your character walks. The position of the ripple layer is between "Same 
 * as character" and "Below character".
 * 
 * Credits: TrophicRain: main part; FruitDragon: audio, docs
 * 
 * ------------------------------------------------------------------------------
 * Usage:
 * 
 * (REQUIRED) Add in map notes:
 * 
 * <ripple:filename,secondRipple,maskname,duration,scaleBegin,scaleEnd,audioOn,audioFile,
 * audioVolume,audioPitch,audioPitchVar>
 * 
 * All parameters are optional and the plugin parameters will be used by default. 
 * To use only default, only put <ripple> in the map notes. To use only some default, leave
 * no space between commas.
 * 
 * THERE MUST NOT BE ANY SPACES ON EITHER END OF VALUES.
 * 
 * Examples:
 * <ripple>
 * <ripple:,,,40>
 * <ripple:,,,,,,,,10,,20>
 * <ripple:splash2,true>
 * 
 * Ripples are limited to tiles with the regionId specified in the plugin parameters.
 * 
 * 
 * (OPTIONAL) You can also add specific ripple settings to events.
 * Add the following notetag to the event's notes: 
 * 
 * <ripple:filename,duration,scaleBegin,scaleEnd,audioOn,audioFile,audioVolume,
 * audioPitch,audioPitchVar>
 * 
 * ------------------------------------------------------------------------------
 * [Parameter Description]
 * filename: The file name of the ripple image.
 * secondRipple: When the character walks, The footsteps, one in front of the other, 
 * create two ripples.
 * maskname: The file name of the image used to mask the ripples. 
 *           The image size should be the size of the map.
 *   This parameter is effective for the entire map, It can prevent ripples from 
 * spreading to areas such as the "shore" where ripples are not needed.
 * duration: The number of frames the ripple lasts.
 * scaleBegin: The scale at which the ripple starts.
 * scaleEnd: The scale at which the ripple ends.
 * audioOn: Whether audio plays on every footstep or not.
 * audioFile: The name of the SE that plays on every splash.
 * audioVolume: The volume of the SE that plays on every splash.
 * audioPitch: The pitch of the SE that plays on every splash.
 * audioPitchVar: The maximum value SE pitch can shift by in either direction
 *                For no variation, use '0'
 * 
 * 
 * @param filepath
 * @desc In which folder should the ripple and mask files be placed? 
 * For example'img/system/'。
 * @type text
 * @default img/system/
 * 
 * @param rippleRegion
 * @desc It creates ripples when you walk on it. regionId。
 * @type number
 * @default 249
 * 
 * @param ======Default======
 * 
 * @param filename
 * @parent ======Default======
 * @desc The default file name of the ripple image.
 * @type text
 * @default ripple
 * 
 * @param secondRipple
 * @parent ======Default======
 * @desc When the character walks, The footsteps, one in front of the other, 
 * create two ripples.
 * @type boolean
 * @default false
 * 
 * @param duration
 * @parent ======Default======
 * @desc The default number of frames that the ripple lasts.
 * @type number
 * @default 30
 * 
 * @param scaleBegin
 * @parent ======Default======
 * @desc The default scale at which the ripple starts.
 * @type number
 * @default 0.3
 * 
 * @param scaleEnd
 * @parent ======Default======
 * @desc The default scale at which the ripple ends.
 * @type number
 * @default 1.0
 * 
 * @param audioOn
 * @parent ======Default======
 * @desc Whether audio plays on every footstep or not.
 * @type boolean
 * @default false
 * 
 * @param audioFile
 * @parent ======Default======
 * @desc The name of the SE that plays on every splash.
 * @type file
 * @dir audio/se/
 * @default
 * 
 * @param audioPitch
 * @parent ======Default======
 * @desc The pitch of the SE that plays on every splash.
 * @type number
 * @default 100
 * 
 * @param audioVolume
 * @parent ======Default======
 * @desc The volume of the SE that plays on every splash.
 * @type number
 * @default 50
 * 
 * @param pitchVariation
 * @parent ======Default======
 * @desc The maximum value SE pitch can shift by in either direction
 * For no variation, use '0'
 * @type number
 * @min 0
 * @default 15
 *
 */







var TR_Rpl = {
    filepath: PluginManager.parameters('TRain_FD_Ripple')['filepath'],
    rippleRegion: parseInt(PluginManager.parameters('TRain_FD_Ripple')['rippleRegion']),
    default: {
        filename: PluginManager.parameters('TRain_FD_Ripple')['filename'],
        second: PluginManager.parameters('TRain_FD_Ripple')['secondRipple'] === 'true',
        duration: parseInt(PluginManager.parameters('TRain_FD_Ripple')['duration']),
        scaleBegin: parseFloat(PluginManager.parameters('TRain_FD_Ripple')['scaleBegin']),
        scaleEnd: parseFloat(PluginManager.parameters('TRain_FD_Ripple')['scaleEnd']),
        sefilename: PluginManager.parameters('TRain_FD_Ripple')['audioFile'],
        sepitch: parseInt(PluginManager.parameters('TRain_FD_Ripple')['audioPitch']),
        sevolume: parseInt(PluginManager.parameters('TRain_FD_Ripple')['audioVolume']),
        sepitchvar: parseInt(PluginManager.parameters('TRain_FD_Ripple')['pitchVariation']),
        se: eval(PluginManager.parameters('TRain_FD_Ripple')['audioOn'])
    }
};


// t: time, b: begin, c: change, d: duration
TR_Rpl._linear = function(t, b, c, d) {
    return c * t / d + b;
};






// ================================================================================
// Storable Game Objects
// ================================================================================

function Game_Ripple() {
    this.initialize.apply(this, arguments);
}

Game_Ripple.prototype.initialize = function(x, y, filename, duration, scaleBegin, scaleEnd, audioOn, audioFile, audioVolume, audioPitch, audioPitchVar){
    this._x = x;    // Position on map (unit: tile)
    this._y = y;
    this._filename = filename;
    this._duration = duration;
    this._scaleBegin = scaleBegin;
    this._scaleEnd = scaleEnd;
    this._audioOn = audioOn
    this._audioFile = audioFile
    this._audioVolume = audioVolume
    this._audioPitch = audioPitch
    this._audioPitchVar = audioPitchVar

    this._time = 0;
    this._remove = false;
};

Game_Ripple.prototype.update = function() {
    this._time++;
    if (this._time >= this._duration) this._remove = true;
};




TR_Rpl._GameMap_initialize = Game_Map.prototype.initialize;
Game_Map.prototype.initialize = function(){
    TR_Rpl._GameMap_initialize.call(this);
    this.initRipples();
};

TR_Rpl._GameMap_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {
    TR_Rpl._GameMap_setup.call(this, mapId);
    this.setupRipples();
};

TR_Rpl._GameMap_update = Game_Map.prototype.update;
Game_Map.prototype.update = function(sceneActive) {
    TR_Rpl._GameMap_update.call(this, sceneActive);
    this.updateRipples();
};


Game_Map.prototype.initRipples = function() {
    this._ripples = [];
    this._rippleEnabled = false;
    this._rippleMask = null;
    this._rippleSecond = TR_Rpl.default.second;

    // map default ripple
    this._rippleFile = TR_Rpl.default.filename;
    this._rippleDuration = TR_Rpl.default.duration;
    this._rippleScaleBegin = TR_Rpl.default.scaleBegin;
    this._rippleScaleEnd = TR_Rpl.default.scaleEnd;
    this._rippleAudioOn = TR_Rpl.default.se;
    this._rippleAudioFile = TR_Rpl.default.sefilename;
    this._rippleAudioVolume = TR_Rpl.default.sevolume;
    this._rippleAudioPitch = TR_Rpl.default.sepitch;
    this._rippleAudioPitchVar = TR_Rpl.default.sepitchvar;
};

Game_Map.prototype.setupRipples = function() {
    this.initRipples();
    var meta = $dataMap.meta.ripple;
    if (!meta) return;
    this._rippleEnabled = true;
    if (meta === true) return;  // only a tag, no parameters

    // has <ripple:...> tag -> map can use ripples
    var arr = meta.split(',');
    if (arr[0] != undefined && arr[0] != '') this._rippleFile = arr[0];
    if (arr[1] == 'true') this._rippleSecond = true;
    if (arr[2] != undefined && arr[2] != '') this._rippleMask = arr[2];
    if (arr[3] != undefined && arr[3] != '') this._rippleDuration = parseInt(arr[3]);
    if (arr[4] != undefined && arr[4] != '') this._rippleScaleBegin = parseFloat(arr[4]);
    if (arr[5] != undefined && arr[5] != '') this._rippleScaleEnd = parseFloat(arr[5]);
    if (arr[6] != undefined && arr[6] != '') this._rippleAudioOn = eval(arr[6]);
    if (arr[7] != undefined && arr[7] != '') this._rippleAudioFile = arr[7];
    if (arr[8] != undefined && arr[8] != '') this._rippleAudioVolume = parseInt(arr[8]);
    if (arr[9] != undefined && arr[9] != '') this._rippleAudioPitch = parseInt(arr[9]);
    if (arr[10] != undefined && arr[10] != '') this._rippleAudioPitchVar = parseInt(arr[10]);
};

Game_Map.prototype.updateRipples = function() {
    for (var i = this._ripples.length - 1; i >= 0; i--) {
        var ripple = this._ripples[i];
        ripple.update();
        if (ripple._remove) this._ripples.splice(i, 1);
    }
};

Game_Map.prototype.addRipple = function(x, y, filename, duration, scaleBegin, scaleEnd, audioOn, audioFile, audioVolume, audioPitch, audioPitchVar) {
    if (!this._rippleEnabled) return;
    if (!filename) filename = this._rippleFile;
    if (duration == undefined) duration = this._rippleDuration;
    if (scaleBegin == undefined) scaleBegin = this._rippleScaleBegin;
    if (scaleEnd == undefined) scaleEnd = this._rippleScaleEnd;
    if (audioOn == undefined) audioOn = this._rippleAudioOn;
    if (audioFile == undefined) audioFile = this._rippleAudioFile;
    if (audioVolume == undefined) audioVolume = this._rippleAudioVolume;
    if (audioPitch == undefined) audioPitch = this._rippleAudioPitch;
    if (audioPitchVar == undefined) audioPitchVar = this._rippleAudioPitchVar;

    // duration+1 because Game_Ripple updates 1 frame ahead of Sprite_Ripple
    var ripple = new Game_Ripple(x, y, filename, duration+1, scaleBegin, scaleEnd, audioOn, audioFile, audioVolume, audioPitch, audioPitchVar);
    this._ripples.push(ripple);
    return ripple
};




// event-specific ripples
TR_Rpl._GameEvent_initialize = Game_Event.prototype.initialize;
Game_Event.prototype.initialize = function(mapId, eventId) {
    TR_Rpl._GameEvent_initialize.call(this, mapId, eventId);
    this.initRippleMeta();
};

Game_Event.prototype.initRippleMeta = function() {
    var meta = this.event().meta ? this.event().meta.ripple : undefined;
    if (meta) {
        var arr = meta.split(',');
        this._rippleFile = arr[0];
        if (arr[1] != undefined && arr[1] != '') this._rippleDuration = parseInt(arr[1]);
        if (arr[2] != undefined && arr[2] != '') this._rippleScaleBegin = parseFloat(arr[2]);
        if (arr[3] != undefined && arr[3] != '') this._rippleScaleEnd = parseFloat(arr[3]);
        if (arr[4] != undefined && arr[4] != '') this._rippleAudioOn = eval(arr[4]);
        if (arr[5] != undefined && arr[5] != '') this._rippleAudioFile = arr[5];
        if (arr[6] != undefined && arr[6] != '') this._rippleAudioVolume = parseInt(arr[6]);
        if (arr[7] != undefined && arr[7] != '') this._rippleAudioPitch = parseInt(arr[7]);
        if (arr[8] != undefined && arr[8] != '') this._rippleAudioPitchVar = parseInt(arr[8]);
    }
};







// ================================================================================
// View Layer
// ================================================================================

TR_Rpl._SpritesetMap_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
Spriteset_Map.prototype.createLowerLayer = function() {
    TR_Rpl._SpritesetMap_createLowerLayer.call(this);
    this.createRippleContainer();
    this.createRippleMask();
};

Spriteset_Map.prototype.createRippleContainer = function() {
    this._rippleContainer = new Sprite();
    this._rippleContainer.z = 2;    // Between normal chars and lower chars
    for (var i = 0; i < 100; i++){
        // 100 ripples at max, similar to Sprite_Picture
        this._rippleContainer.addChild(new Sprite_Ripple(i));
    }
    this._tilemap.addChild(this._rippleContainer);
};

Spriteset_Map.prototype.createRippleMask = function() {
    if (!$gameMap._rippleMask) return;
    var maskBitmap = ImageManager.loadBitmap(TR_Rpl.filepath, $gameMap._rippleMask, 0, false);

    var loopX = $gameMap.isLoopHorizontal() ? 2 : 1;
    var loopY = $gameMap.isLoopVertical() ? 2 : 1;
    if (loopX === 1 && loopY === 1){
        this._rippleMask = new Sprite(maskBitmap);
    } else {    // Looping map
        var maskLooped = new Bitmap(loopX*$gameMap.width()*$gameMap.tileWidth(), loopY*$gameMap.height()*$gameMap.tileHeight());
        maskBitmap.addLoadListener(function(){
            for (var i = 0; i < loopX; i++)
                for (var j = 0; j < loopY; j++)
                    maskLooped.blt(maskBitmap, 0, 0, maskBitmap.width, maskBitmap.height, i*maskBitmap.width, j*maskBitmap.height);
        });
        this._rippleMask = new Sprite(maskLooped);
    }

    this._rippleMask.update = function(){
        Sprite.prototype.update.call(this);
        this.x = - $gameMap.displayX() * $gameMap.tileWidth();
        this.y = - $gameMap.displayY() * $gameMap.tileHeight();
    };

    this._tilemap.addChild(this._rippleMask);
    this._rippleContainer.mask = this._rippleMask;
};




function Sprite_Ripple(index) {
    this.initialize.apply(this, arguments);
}
Sprite_Ripple.prototype = Object.create(Sprite.prototype);
Sprite_Ripple.prototype.constructor = Sprite_Ripple;

Sprite_Ripple.prototype.initialize = function(index) {
    Sprite.prototype.initialize.call(this);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this._filename = null;
    this._index = index;
};


Sprite_Ripple.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateBitmap();
    this.updateShape();
};

Sprite_Ripple.prototype.updateBitmap = function() {
    var ripple = $gameMap._ripples[this._index];
    if (!ripple || !ripple._filename) {
        this._filename = null;
        this.bitmap = null;
        this.visible = false;
        return;
    }

    if (this._filename != ripple._filename) {
        this._filename = ripple._filename;
        this.bitmap = ImageManager.loadBitmap(TR_Rpl.filepath, this._filename, 0, true);
    }
    this.visible = true;
};

Sprite_Ripple.prototype.updateShape = function() {
    var ripple = $gameMap._ripples[this._index];
    if (!ripple) return;

    this.x = Math.round($gameMap.adjustX(ripple._x) * $gameMap.tileWidth());
    this.y = Math.round($gameMap.adjustY(ripple._y) * $gameMap.tileHeight());
    
    var scale = TR_Rpl._linear(ripple._time, ripple._scaleBegin, ripple._scaleEnd-ripple._scaleBegin, ripple._duration);
    this.scale = { x: scale, y: scale };
    var opacity = TR_Rpl._linear(ripple._time, 255, -255, ripple._duration);
    this.opacity = opacity;
};







// ================================================================================
// Ripple Generating
// ================================================================================

// 1 character move triggers 2 ripples
// _rippleTimer counts down for the second ripple
TR_Rpl._GameCharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
    TR_Rpl._GameCharacterBase_initMembers.call(this);
    this._rippleTimer = 0;
    this._rippleOffset = { x: 0, y: 0 };
};

TR_Rpl._GameCharacterBase_update = Game_CharacterBase.prototype.update;
Game_CharacterBase.prototype.update = function(){
    TR_Rpl._GameCharacterBase_update.call(this);
    this.updateRippleTimer();
};

Game_CharacterBase.prototype.updateRippleTimer = function() {
    if (this._rippleTimer > 0){
        this._rippleTimer--;
        if (this._rippleTimer <= 0)
            this.triggerRipple(this._rippleOffset.x, this._rippleOffset.y);
    }
};




Game_CharacterBase.prototype.nowInRipple = function(){
    if (!$gameMap._rippleEnabled) return false;
    if (this instanceof Game_Follower && !this.isVisible()) return false;

    var x = Math.round($gameMap.roundX(this._realX));
    var y = Math.round($gameMap.roundY(this._realY));
    var regionId = $gameMap.regionId(x, y);
    return regionId === TR_Rpl.rippleRegion;
};

Game_CharacterBase.prototype.destInRipple = function() {
    if (!$gameMap._rippleSecond) return false;
    if (!$gameMap._rippleEnabled) return false;
    if (this instanceof Game_Follower && !this.isVisible()) return false;

    var x = $gameMap.roundX(this._x);
    var y = $gameMap.roundY(this._y);
    var regionId = $gameMap.regionId(x, y);
    return regionId === TR_Rpl.rippleRegion;
};



Game_CharacterBase.prototype.triggerRipple = function(xOffset, yOffset){
    var x = this._realX + 0.5;
    var y = this._realY + 1 - this.shiftY()/$gameMap.tileHeight();
    var ripple = $gameMap.addRipple(x+xOffset, y+yOffset, this._rippleFile, this._rippleDuration,
                       this._rippleScaleBegin, this._rippleScaleEnd,this._rippleAudioOn, 
                       this._rippleAudioFile, this._rippleAudioVolume, this._rippleAudioPitch, 
                       this._rippleAudioPitchVar);
    ripple.playRippleSE()
};


Game_CharacterBase.prototype.calcRippleOffset = function(dir) {
    var offset = {
        now: { x: 0, y: 0 },
        dest: { x: 0, y: 0 }
    };

    if (!$gameMap._rippleSecond){
        // 只有一个涟漪时, 稍微前移涟漪, 以免看起来太落后
        var value = 2 * this.distancePerFrame();  // 2 frames ahead
        switch (dir){
            case 2: // down
                offset.now.y += value;
            break;
            case 8: // up
                offset.now.y -= value;
            break;
            case 4: // left
                offset.now.x -= value;
            break;
            case 6: // right
                offset.now.x += value;
            break;
        }

    } else {
        // 有两个涟漪时, 垂直方向偏移一些, 这样看起来更像用两只脚走路
        var value = 2 / $gameMap.tileWidth();   // 2 pixels
        switch (dir) {
            case 2: // down
            case 8: // up
                offset.now.x = -value;
                offset.dest.x = value;
            break;

            case 4: // left
            case 6: // right
                offset.now.y = -value;
                offset.dest.y = value;
            break;
        }
    }

    return offset;
};


TR_Rpl._GameCharacterBase_moveStraight = Game_CharacterBase.prototype.moveStraight;
Game_CharacterBase.prototype.moveStraight = function(d) {
    TR_Rpl._GameCharacterBase_moveStraight.call(this, d);

    if (this.isMovementSucceeded()){
        var offset = this.calcRippleOffset(d);
        if (this.nowInRipple()){
            this.triggerRipple(offset.now.x, offset.now.y);
        }
        if (this.destInRipple()){
            this._rippleTimer = Math.ceil((1 / this.distancePerFrame()) / 2);
            this._rippleOffset = { x: offset.dest.x, y: offset.dest.y };
        }
    }
};

TR_Rpl._GameCharacterBase_moveDiagonally = Game_CharacterBase.prototype.moveDiagonally;
Game_CharacterBase.prototype.moveDiagonally = function(horz, vert) {
    TR_Rpl._GameCharacterBase_moveDiagonally.call(this, horz, vert);

    if (this.isMovementSucceeded()){
        // Don't need offset for diagonal movement
        if (this.nowInRipple()){
            this.triggerRipple(0, 0);
        }
        if (this.destInRipple()){
            this._rippleTimer = Math.ceil((1 / this.distancePerFrame()) / 2);
            this._rippleOffset = { x: 0, y: 0 };
        }
    }
};


// =================================================
// Footstep sound manager
// ==================================================


Game_Ripple.prototype.playRippleSE = function(){
    if (!this.audioOn && !TR_Rpl.default.se) {
        return;
    }
    var se = {};
    // adds slight pitch variation
    var temp = Math.floor(Math.random()*(this._audioPitchVar || TR_Rpl.default.sepitchvar))
    var direction = Math.round(Math.random())
    if (direction > 0) {
            temp = temp * -1
    }
    se.name = this._audioFile || TR_Rpl.default.sefilename;
    se.pitch = (this._audioPitch || TR_Rpl.default.sepitch) + temp;
    se.volume = this._audioVolume || TR_Rpl.default.sevolume;
    if(se.name){AudioManager.playSe(se)};
}; 