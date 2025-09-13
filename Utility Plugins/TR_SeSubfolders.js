//=============================================================================
// SE Subfolder - By TomatoRadio
// TR_SeSubfolders.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_SeSubfolders = true;

var TR = TR || {};
TR.SS = TR.SS || {};
TR.SS.version = 1;

/*: 
 * @plugindesc v1.0 Header Text
 * @author TomatoRadio
 * 
 * @help
 * When calling an SE with any script, subfolders now can be used.
 * 
 * For example:
 * AudioManager.playSe({name: "textsounds/SE-txtAUBREY", volume: 90, pitch: 100});
 * 
 * and it'll call from the se/textsounds folder.
 * 
 * This doesn't make SEs appear in the RPG Maker UI
 * or allow for SubFolders in BGM, BGS, or ME.
 * 
 * Also some characters like [] or {} might cause crashes.
 * 
*/

AudioManager.playSe = function(se) {
	if (se.name) {
		this._seBuffers = this._seBuffers.filter(function(audio) {
			return audio.isPlaying();
		});
		let folder = "se"
		let sub = this.subfolderDetect(se.name);
		folder = sub !== '' ? `se/${sub}` : 'se'
		se.name = se.name.replace(`${sub}/`,``)
		/*
		let folder = 'se'
		TR.SeSubfolders.forEach(function(sub) {
		if (se.name.startsWith(sub)) { se.name = se.name.replace(`${sub}/`,''); folder = `se/${sub}`}
		});
		*/
		var buffer = this.createBuffer(folder, se.name);
		this.updateSeParameters(buffer, se);
		buffer.play(false);
		this._seBuffers.push(buffer);
	}
};

AudioManager.loadStaticSe = function(se) {
	if (se.name && !this.isStaticSe(se)) {
		let folder = "se"
		let sub = this.subfolderDetect(se.name);
		folder = sub !== '' ? `se/${sub}` : 'se'
		se.name = se.name.replace(`${sub}/`,``)
		var buffer = this.createBuffer(folder, se.name);
		buffer._reservedSeName = se.name;
		this._staticBuffers.push(buffer);
		if (this.shouldUseHtml5Audio()) {
			Html5Audio.setStaticSe(buffer._url);
		}
	}
};

AudioManager.subfolderDetect = function(name) {
var lastFolder = name.lastIndexOf('/')
if (lastFolder === -1) return ''
return name.slice(0,lastFolder);
}
