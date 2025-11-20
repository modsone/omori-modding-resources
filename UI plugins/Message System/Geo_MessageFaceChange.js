/*:
 * @plugindesc Adds a message command that allows to switch the facebox image midway through a message.
 * 
 * @author Geo
 *
 * @help
 * =================
 * Quick Rundown
 * =================
 * In a message, use the \face[x] command (replace the x with a number) to switch
 * the facebox image to another specified face from the face sheet that the
 * message uses, using the number used as the index for so.
 *
 * Currently only compatible with OMORI.
 */
 
 var beesList = beesList || {}; beesList.messageBox = beesList.messageBox || {};

beesList.messageBox.Window_Message_oldProcessEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
Window_Message.prototype.processEscapeCharacter = function(code, textState) {
    switch (code) {
    case 'FACE':
	    // added "this._checkWordWrapMode" false check for yanfly compatibility
        if ($gameMessage.faceName() !== '' && !this._checkWordWrapMode) {
            var id = this.obtainEscapeParam(textState);
	        this._faceBoxWindow.changeFace(id);
		};
		break;
    default:
        beesList.messageBox.Window_Message_oldProcessEscapeCharacter.call(this, code, textState);
        break;
    }
};

Window_MessageFaceBox.prototype.changeFace = function(id) {
	this.clear();
	this.refresh();
	if(!!this._stopFace) {return this._faceReady = true;}
	var width = 106 || Window_Base._faceWidth;
	var height = 106 || Window_Base._faceHeight;
	var bitmap = !!this._faceBitmap ? this._faceBitmap : ImageManager.loadFace($gameMessage.faceName());
	var pw = Window_Base._faceWidth;
	var ph = Window_Base._faceHeight;
	var sw = Math.min(width, pw);
	var sh = Math.min(height, ph);
	var dx = Math.floor(0 + Math.max(width - pw, 0) / 2);
	var dy = Math.floor(0 + Math.max(height - ph, 0) / 2);
	var sx = id % 4 * pw + (pw - sw) / 2;
	var sy = Math.floor(id / 4) * ph + (ph - sh) / 2;
	this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
	this.clear();
	this._faceReady = true;
};