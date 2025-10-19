/*:
 * @plugindesc Mirror-ish dialogue text effect.
 * @author Draught
 * @help
 *
 * \OMIRROR[1] to begin mirroring
 * \OMIRROR[0] to end mirroring
 *
 *
 *
 *
 */


//=============================================================================
// DGT Rewind Text
// Version: 0.1
//=============================================================================
window.Imported = window.Imported || {};
Imported.DGTMirrorText = true;
//=============================================================================
window.DGT = window.DGT || {};
DGT.MirrorText = DGT.MirrorText || {};
//=============================================================================
//=============================================================================
DGT.MirrorText.old_processEscapeCharacter = Window_Base.prototype.processEscapeCharacter;
Window_Base.prototype.processEscapeCharacter = function (code, textState) {
    // If Not ignoring letter effect escape codes
    switch (code) {
        case 'OMIRROR':
            let state = parseInt(this.obtainEscapeParam(textState));
            if (state === 0 || state === 1) {
                this._mirroringtext = !!state;
                this._justChangedMirror = true;
                if (this._refreshPauseSign) {this._refreshPauseSign()}
            }
            break;
    };
    // Run Original Function
    DGT.MirrorText.old_processEscapeCharacter.call(this, code, textState);
};
DGT.MirrorText.old_processNormalCharacter = Window_Base.prototype.processNormalCharacter;
Window_Base.prototype.processNormalCharacter = function (textState) {
    let cstate = this._justChangedMirror
    this._justChangedMirror = false
    if (!this._mirroringtext) { return DGT.MirrorText.old_processNormalCharacter.call(this, textState) };
    if (this.checkWordWrap(textState)) return this.processNewLine(textState);
    if (cstate) { textState.x = 582 }
    var c = textState.text[textState.index++];
    var w = this.textWidth(c);
    //let uw = this.textWidth(textState.text[textState.index - 1] || c)
    textState.x -= (w);
    this.contents.drawText(c, textState.x, textState.y, w, textState.height);
};
DGT.MirrorText.old_newLineX = Window_Message.prototype.newLineX
Window_Message.prototype.newLineX = function () {
    if (!this._mirroringtext) { return DGT.MirrorText.old_newLineX.call(this) }
    return 582;
};

DGT.MirrorText.old_checkWordWrap = Window_Base.prototype.checkWordWrap
Window_Base.prototype.checkWordWrap = function (textState) {
    if (!this._mirroringtext) { return DGT.MirrorText.old_checkWordWrap.call(this, textState) }
    if (!textState) return false;
    if (!this._wordWrap) return false;
    if (textState.text[textState.index] === ' ') {
        var nextSpace = textState.text.indexOf(' ', textState.index + 1);
        var nextBreak = textState.text.indexOf('\n', textState.index + 1);
        if (nextSpace < 0) nextSpace = textState.text.length + 1;
        if (nextBreak > 0) nextSpace = Math.min(nextSpace, nextBreak);
        var word = textState.text.substring(textState.index, nextSpace);
        var size = this.textWidthExCheck(word);
    }
    let length = 582 - textState.x
    // console.log(textState.x)
    // console.log(size, length, this.wordwrapWidth())
    return (length - size > this.wordwrapWidth());
};

DGT.MirrorText.old_refreshPauseSign = Window_Message.prototype._refreshPauseSign
Window_Message.prototype._refreshPauseSign = function () {
    DGT.MirrorText.old_refreshPauseSign.call(this)
    if (!this._mirroringtext) { return }
    this._windowPauseSignSprite.scale.x = -1
    this._windowPauseSignSprite.move(40, this._height - 10);
};