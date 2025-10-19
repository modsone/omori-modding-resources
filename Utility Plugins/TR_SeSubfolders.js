//=============================================================================
// SE Subfolders - By TomatoRadio
// TR_SeSubfolders.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_SeSubfolders = true;

var TR = TR || {};
TR.SS = TR.SS || {};
TR.SS.version = 1.0;

/*: 
 *
 * @plugindesc Version 1.0 Allows SE from subfolders to be played.
 * @author TomatoRadio
 * 
 * @help
 * Allows SE from subfolders to be played correctly.
 * This will NOT add them to the Sound Manager, so you'll
 * have to call them through scripts. The main use case is
 * text sounds, which lack this issue.
 * 
*/

AudioManager.playSe = function(se) {
    if (se.name) {
        this._seBuffers = this._seBuffers.filter(function(audio) {
            return audio.isPlaying();
        });
        let folder = "se";
        let sub = this.subfolderDetect(se.name);
        folder = sub !== '' ? `se/${sub}` : 'se';
        se.name = se.name.replace(`${sub}/`,``);
        var buffer = this.createBuffer(folder, se.name);
        this.updateSeParameters(buffer, se);
        buffer.play(false);
        this._seBuffers.push(buffer);
    };
};

AudioManager.loadStaticSe = function(se) {
    if (se.name && !this.isStaticSe(se)) {
        let folder = "se";
        let sub = this.subfolderDetect(se.name);
        folder = sub !== '' ? `se/${sub}` : 'se';
        se.name = se.name.replace(`${sub}/`,``);
        var buffer = this.createBuffer(folder, se.name);
        buffer._reservedSeName = se.name;
        this._staticBuffers.push(buffer);
        if (this.shouldUseHtml5Audio()) {
            Html5Audio.setStaticSe(buffer._url);
        };
    };
};

AudioManager.subfolderDetect = function(name) {
  var lastFolder = name.lastIndexOf('/');
  if (lastFolder === -1) return '';
  return name.slice(0,lastFolder);
};