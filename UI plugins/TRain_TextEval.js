/*:
 * @plugindesc Execute between text & Centering
 * @author TrophicRain
 * 
 * @help
 * This plugin provides the following control characters:
 * 
 * \eval<<expression>>
 *   Execute the expression and replace it in the text (before printing the text)
 * 
 * \exec<<code>>
 *   Execute the code in the middle of printing the text (will not insert text)
 * 
 * \ctr<<text>>
 *   Center the text
 *   (NOTE: in OMORI if you use multiple lines, use plugin command "DisableWordWrap" first)
 * 
 * ------------------------------------------------------------------------
 * [Usage Example]
 * \eval<<'Replace'+'Text'>>
 * \exec<<$gameMessage.setFaceImage("MainCharacter_Mari", 0);this.loadMessageFace();>>
 * \ctr<<Center Text>>
 * 
 */


var TR_TEval = {};

TR_TEval.stripEscapeCode = function (text) {
    return text
        .replace(/\x1b[$.|^!><{}\\]/g, '')      // \$ \{
        .replace(/\x1b[a-zA-Z]+<<.*?>>/g, '')   // \eval<<expr>>
        .replace(/\x1b[a-zA-Z]+<.*?>/g, '')     // \fn<font>
        .replace(/\x1b[a-zA-Z]+\[.*?\]/g, '');  // \hc[f0]
};


TR_TEval._convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
Window_Base.prototype.convertEscapeCharacters = function(_text) {
    _text = TR_TEval._convertEscapeCharacters.call(this, _text);
    _text = _text.replace(/\x1bEVAL<<(.*?)>>/gi, function(){
        return eval(arguments[1]);
    }.bind(this));
    return _text;
};

TR_TEval._processEscapeCharacter = Window_Base.prototype.processEscapeCharacter;
Window_Base.prototype.processEscapeCharacter = function(_code, _textState) {
    switch(_code) {
        case 'EXEC':
            eval(this.TR_TEval_obtainEscapeText(_textState));
            break;
        case 'CTR':
            this.TR_TEval_centerText(this.TR_TEval_obtainEscapeText(_textState), _textState);
            break;
        default:
            TR_TEval._processEscapeCharacter.call(this, _code, _textState);
            break;
    }
};

Window_Base.prototype.TR_TEval_obtainEscapeText = function(textState) {
    var regExp = /^<<(.*?)>>/;
    var arr = regExp.exec(textState.text.slice(textState.index));
    if (arr){
        textState.index += arr[0].length;
        return arr[1];
    }
};

Window_Base.prototype.TR_TEval_centerText = function(text, textState) {
    var actualText = TR_TEval.stripEscapeCode(text);
    textState.x = (this.contents.width - this.textWidth(actualText)) / 2;
    if (textState.left > 64) textState.x += textState.left / 2;   // Having facebox on the left
    textState.text = textState.text.slice(0, textState.index) + text + textState.text.slice(textState.index);
};

