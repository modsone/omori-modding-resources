/*:
 * @plugindesc Small text annotation above message
 * @author TrophicRain
 * 
 * @help
 * This plugin allows you to add small text annotations above the text in Window_Base (e.g. message window).
 * The annotation is centered above the base text and is displayed char by char, 
 * with the same start and end timing as the base text.
 * 
 * ------------------------------------------------------------------------------
 * [Usage]
 * TR_TNote.makePreset(1, 'Annotation', 'Base Text', textInterval,
 *                    { textColor: '#ff0000' }, xAdjust, yAdjust);  // Optional
 * 
 * window_base_object.drawTextEx('Previous text, \tnote[1]Base Text, following text', x, y);
 * ◆"Show Text" and "Show Options" event commands: \tnote[1]Base Text
 * 
 * [Parameters]
 * textInterval: How many frames per char in BASE TEXT.
 *               If you're not using message speed changing plugins, it's 1.
 * xAdjust, yAdjust: Normally the annotation is centered above the base text.
 *                   If the position is not very correct, you can adjust it with these parameters.
 * 
 * 
 * 
 * @param Preset_List
 * @desc Preloaded presets.
 * @type struct<TNotePreset>[]
 * @default []
 * 
 */
/*~struct~TNotePreset:
 * @param id
 * @type number
 * @default 0
 * 
 * @param text
 * @type text
 * 
 * @param baseText
 * @type text
 * 
 * @param textInterval
 * @type number
 * 
 * @param ==== options ====
 * 
 * @param fontFace
 * @parent ==== options ====
 * @type text
 * 
 * @param fontSize
 * @parent ==== options ====
 * @type number
 * 
 * @param textColor
 * @parent ==== options ====
 * @type text
 * 
 * @param outlineWidth
 * @parent ==== options ====
 * @type number
 * 
 * @param outlineColor
 * @parent ==== options ====
 * @type text
 * 
 * @param xAdjust
 * @type number
 * 
 * @param yAdjust
 * @type number
 * 
 */




/*
TR_TNote.presets[i] Format:
{
    text: "Annotation",   // Must be raw text (cannot contain Escape Code)
    baseText: "Base Text",   // Used to measure the width of the base text for centering the annotation
    delay: [],   // Delay for each character of the annotation relative to \tnote[], array length is text.length

    // Adjust annotation position
    xAdjust: 0,
    yAdjust: 3,

    options: {
        fontFace: 'GameFont',
        fontSize: 14,
        textColor: '#ffffff',
        outlineWidth: 3,
        outlineColor: 'rgba(0, 0, 0, 0.4)'
    }
}
*/


var TR_TNote = {
    _extends: {
        createContents: Window_Base.prototype.createContents,
        processEscapeCharacter: Window_Base.prototype.processEscapeCharacter,
        update: Window_Base.prototype.update
    },
    _defaultOptions: {
        fontFace: 'GameFont',
        fontSize: 18,
        textColor: '#ffffff',
        outlineWidth: 3,
        outlineColor: 'rgba(0, 0, 0, 0.4)'
    },
    _defaultXAdjust: 0,
    _defaultYAdjust: 10,
    _defaultTextInterval: 1,

    presets: []
};



TR_TNote.makePreset = function(id, text, baseText, textInterval, options, xAdjust, yAdjust){
    if (xAdjust === undefined) xAdjust = TR_TNote._defaultXAdjust;
    if (yAdjust === undefined) yAdjust = TR_TNote._defaultYAdjust;

    var delay = [];
    var len = text.length;
    var itv = textInterval === undefined ? TR_TNote._defaultTextInterval : textInterval;

    if (itv <= 0){
        for (var i = 0; i < len; i++) delay[i] = 0;
    } else if (len <= 1) {
        delay = [baseText.length * itv];
    } else {
        var begin = itv;
        var end = baseText.length * itv;
        var step = (end - begin) / (len - 1);
        for (var i = 0; i < len; i++) delay[i] = Math.round(begin + step * i);
    }

    var preset = {
        text: text,
        baseText: baseText,
        delay: delay,
        xAdjust: xAdjust,
        yAdjust: yAdjust,
        options: {}
    };
    for (var key in TR_TNote._defaultOptions){
        preset.options[key] = (options && options[key] !== undefined) ? options[key] : TR_TNote._defaultOptions[key];
    }
    TR_TNote.presets[id] = preset;
};





Window_Base.prototype.createContents = function(){
    TR_TNote._extends.createContents.call(this);
    this._TR_TNote_env = {};
    this._TR_TNote_processingNotes = [];

    var this_window = this;
    this.contents.TR_TNote_realClear = this.contents.clear;

    this.contents.clear = function() {
        this_window._TR_TNote_processingNotes = [];
        this.TR_TNote_realClear();
    };
};


Window_Base.prototype.processEscapeCharacter = function(code, textState) {
    switch (code){
        case 'TNOTE':
            var preset = TR_TNote.presets[this.obtainEscapeParam(textState)];
            this.TR_TNote_addNote(preset, textState);
            break;
        default:
            TR_TNote._extends.processEscapeCharacter.call(this, code, textState);
            break;
    }
};


Window_Base.prototype.update = function() {
    TR_TNote._extends.update.call(this);
    this.TR_TNote_updateNotes();
};





Window_Base.prototype.TR_TNote_addNote = function(preset, textState){
    var record = JSON.parse(JSON.stringify(preset));

    var baseTextWidth = this.textWidth(record.baseText);
    this.TR_TNote_saveEnv();
    this.TR_TNote_replaceEnv(record.options);
    var noteTextWidth = this.textWidth(record.text);
    this.TR_TNote_restoreEnv();

    record.xBase = textState.x + (baseTextWidth - noteTextWidth) / 2 + record.xAdjust;
    record.yBase = textState.y - record.options.fontSize + record.yAdjust;

    this._TR_TNote_processingNotes.push(record);
    this.TR_TNote_drawDelay0Text(record);   // Draw delay[j]==0 chars immediately
};


Window_Base.prototype.TR_TNote_updateNotes = function(){
    // record.delay[j] status:
    // -1: Already written | 0: Needs to be written this frame | >0: Write after a few frames

    var i = 0;
    while (i < this._TR_TNote_processingNotes.length){
        var record = this._TR_TNote_processingNotes[i];

        for (var j = 0; j < record.text.length; j++){
            if (record.delay[j] > 0) record.delay[j] -= 1;
        }
        this.TR_TNote_drawDelay0Text(record);

        // If all delay[] < 0 (i.e. already written), delete the record
        if (record.delay.every(function(d){ return d < 0; })) this._TR_TNote_processingNotes.splice(i, 1);
        else i++;
    }
};


Window_Base.prototype.TR_TNote_drawDelay0Text = function(record){
    this.TR_TNote_saveEnv();
    this.TR_TNote_replaceEnv(record.options);

    for (var j = 0; j < record.text.length; j++){
        if (record.delay[j] === 0){
            var x = record.xBase + this.textWidth(record.text.substring(0, j));
            var y = record.yBase;
            var ch = record.text[j];

            this.contents.drawText(ch, x, y, 2*this.textWidth(ch), this.contents.fontSize, 'left');
            record.delay[j] = -1;
        }
    }

    this.TR_TNote_restoreEnv();
};



Window_Base.prototype.TR_TNote_saveEnv = function(){
    this._TR_TNote_env = {
        fontFace: this.contents.fontFace,
        fontSize: this.contents.fontSize,
        textColor: this.contents.textColor,
        outlineWidth: this.contents.outlineWidth,
        outlineColor: this.contents.outlineColor
    };
};

Window_Base.prototype.TR_TNote_restoreEnv = function(){
    for (var key in this._TR_TNote_env){
        this.contents[key] = this._TR_TNote_env[key];
    }
};

Window_Base.prototype.TR_TNote_replaceEnv = function(options){
    for (var key in options){
        this.contents[key] = options[key];
    }
};








(function(){
    var params = PluginManager.parameters('TRain_TextNote');
    var presetList = JSON.parse(params.Preset_List);
    for (var i = 0; i < presetList.length; i++){
        var preset = JSON.parse(presetList[i]);
        TR_TNote.makePreset(
            Number(preset.id),
            preset.text,
            preset.baseText,
            preset.textInterval ? Number(preset.textInterval) : TR_TNote._defaultTextInterval,
            {
                fontFace: preset.fontFace || TR_TNote._defaultOptions.fontFace,
                fontSize: preset.fontSize ? Number(preset.fontSize) : TR_TNote._defaultOptions.fontSize,
                textColor: preset.textColor || TR_TNote._defaultOptions.textColor,
                outlineWidth: preset.outlineWidth ? Number(preset.outlineWidth) : TR_TNote._defaultOptions.outlineWidth,
                outlineColor: preset.outlineColor || TR_TNote._defaultOptions.outlineColor
            },
            preset.xAdjust ? Number(preset.xAdjust) : TR_TNote._defaultXAdjust,
            preset.yAdjust ? Number(preset.yAdjust) : TR_TNote._defaultYAdjust
        );
    }
})();

