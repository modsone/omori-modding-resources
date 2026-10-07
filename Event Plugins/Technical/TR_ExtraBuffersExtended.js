//=============================================================================
// Extra Buffers Extended - By TomatoRadio
// TR_ExtraBuffersExtended.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_ExtraBuffersExtended = true;

var TR = TR || {};
TR.EBE = TR.EBE || {};

/*:
 * @plugindesc v0.1 Cleans up ExtraBuffers.
 *
 * @author TomatoRadio
 *
 * @help
 * 
 * Of note:
 * - Fixes ExtraBuffers not following volume settings
 * - Adds a fadein function
 * - Adds a dataSwap function
 * 
 * This is not feature complete probably, but I do want it
 * out there bc the baseline stuff is there.
 * 
 */


AudioManager.fadeinExtraBuffer = function(index,type,sound,pos,loop,duration) {
    this.playToExtraBuffer(index,type,sound,pos,loop);
    let buffer = this._extraBuffers[index];
    if (buffer) buffer.fadeIn(duration);
};
AudioManager.fadeInExtraBuffer = AudioManager.fadeinExtraBuffer

AudioManager.playToExtraBuffer = function(index, type, sound, pos, loop = true) {
  let buffer = this._extraBuffers[index];
  if (buffer) {
    const path = require('path');
    const folders = buffer._url.split('/');
    if (type === folders[folders.length-2] && buffer._url.includes(sound.name)) {
    buffer.rawData = sound;
    buffer.rawData.pos = pos;
      this.updateBufferParameters(buffer, this[type.toLowerCase()+"Volume"], buffer.rawData);
      return;
    } else {
      AudioManager.StopExtraBuffer(index);
    };
  };
  // If Sound has a valid name
  if (sound.name) {
    buffer = this.createBuffer(type, sound.name);
    buffer.rawData = sound;
    buffer.rawData.pos = pos;
    this.updateBufferParameters(buffer, this[type.toLowerCase()+"Volume"], buffer.rawData);
    buffer.play(loop, pos || 0);
    if (loop === false) {
      buffer.addStopListener(this.StopExtraBuffer.bind(this, index));
    };
    this._extraBuffers[index] = buffer;
  };
};

AudioManager.stopExtraBuffer = AudioManager.StopExtraBuffer;

AudioManager.swapBufferData = function(index1,index2) {
    let buffer1 = this._extraBuffers[index1];
    let buffer2 = this._extraBuffers[index2];
    console.log(buffer1,buffer2);
    let type1 = (/audio\/(?<type>.+)\/./ig).exec(buffer1._url).groups.type;
    let type2 = (/audio\/(?<type>.+)\/./ig).exec(buffer2._url).groups.type;
    this.updateBufferParameters(buffer1, this[type2.toLowerCase()+"Volume"], buffer2.rawData);
    this.updateBufferParameters(buffer2, this[type1.toLowerCase()+"Volume"], buffer1.rawData);
    let temp = Object.create(buffer1.rawData);
    buffer1.rawData = buffer2.rawData;
    buffer2.rawData = temp;
};

AudioManager.updateBgmParameters = function(bgm) {
    this.updateBufferParameters(this._bgmBuffer, this._bgmVolume, bgm);
    for (let buffer of this._extraBuffers) {
        if (buffer && buffer._url && buffer._url.match(/audio\/bgm/ig)) {
            let sound = buffer.rawData;
            this.updateBufferParameters(buffer, this._bgmVolume, sound);
        };
    };
};
AudioManager.updateBgsParameters = function(bgs) {
    this.updateBufferParameters(this._bgsBuffer, this._bgsVolume, bgs);
    for (let buffer of this._extraBuffers) {
        if (buffer && buffer._url && buffer._url.match(/audio\/bgs/ig)) {
            let sound = buffer.rawData;
            this.updateBufferParameters(buffer, this._bgsVolume, sound);
        };
    };
};

WebAudio.prototype.nameFromUrl = function() {
    var result = (/audio\/\w+\/(?<name>\w+)\./ig).exec(this._url);
    if (result && result.groups) {return result.groups.name};
};