// allows for a section of text in a message to update dynamically
// requires TDS Text Effects.js
// ( TDS Text Effects.js already exists in base game OMORI )

// USAGE:
// \LIVEUD[x]  where x is the variable ID to pull live data from
// to mark the end of the live update section, use \LIVEUD[0]
// IMPORTANT: due to engine limitations and how text effects are processed
// the live update section must be a fixed length. If the variable's value
// is shorter than the space allocated, it will be padded with spaces.
// excess characters will be truncated.
// EXAMPLE:
// \LIVEUD[1]Hello\LIVEUD[0]
// will initialize a live update section pulling from variable 1 that is 5 characters long
// the original text Hello may be displayed briefly before updating to the variable's value
// to avoid this you can use this character ( ) U+2007 FIGURE SPACE
// normal spaces cant be used as they get completely skipped when rendering
// example:
// \LIVEUD[1]          \LIVEUD[0]
// this will allocate a live update section of 10 characters
// 
// DO NOT NEST A LIVE UPDATE INSIDE ANOTHER LIVE UPDATE
// I WILL FIND YOU AND I WILL KILL YOU
// this may cause unexpected behavior
(function () {
    const old_Window_Base_processEscapeCharacter = Window_Base.prototype.processEscapeCharacter;
    Window_Base.prototype.processEscapeCharacter = function (code, textState) {
        // If Not ignoring letter effec escape codes
        if (this.isIgnoringLetterEffectEscapeCodes()) { return old_Window_Base_processEscapeCharacter.call(this, code, textState); };
        if (code !== 'LIVEUD') { return old_Window_Base_processEscapeCharacter.call(this, code, textState); }
        let varId = this.obtainEscapeParam(textState);
        this.setupLetterEffect(code, varId, textState);

        // Run Original Function
        return old_Window_Base_processEscapeCharacter.call(this, code, textState);
    };
    const old_getLetterEffectBase = Window_Base.prototype.getLetterEffectBase;
    Window_Base.prototype.getLetterEffectBase = function (name, index, textState) {
        console.log("Getting Letter Effect Base for:", name, index);
        if (name !== 'LIVEUD') { return old_getLetterEffectBase.call(this, name, index, textState); }
        // Create Effect
        var effect = Object.assign({ active: true, tag: this._letterEffectTag, startIndex: textState.index, endIndex: Infinity }, {varId: index+1, name});
        effect.active = !this._isDoingTextWidthOperation // stupid
        console.log(effect.active)
        // Set Timer
        if (this._letterEffectTimer !== null) { effect.timer = 60; };
        // Return Effect
        return effect
    };

    const old_Window_Base_updateLetterEffects = Window_Base.prototype.updateLetterEffects;
    Window_Base.prototype.updateLetterEffects = function () {
        old_Window_Base_updateLetterEffects.call(this);
        // Update LIVEUD Effects
        let pos = 0;
        let curEffect = null;
        for (const sprite of this._letterEffectSprites) {
            if (!sprite.visible) {continue}
            let index = sprite._effectData.index
            let effect = this._letterEffects.find(e => e.startIndex <= index && e.endIndex > index && e.name === 'LIVEUD' && e.active);
            if (!effect) { continue; }
            if (effect._isDoingTextWidthOperation) {continue}
            if (curEffect !== effect) {
                curEffect = effect;
                pos = 0;
            }
            let varId = effect.varId;
            let value = `${$gameVariables.value(varId)}`;
            let char = value.charAt(pos) || ' ';
            sprite.bitmap.clear();
            sprite.bitmap.drawText(char, 0, 0, sprite.bitmap.width, sprite.bitmap.height, 'center');
            pos++;

        }
    }

    const old_Window_NameBox_textWidthEx = Window_NameBox.prototype.textWidthEx;
    Window_NameBox.prototype.textWidthEx = function(text) {
        this._isDoingTextWidthOperation = true
        let result = old_Window_NameBox_textWidthEx.call(this, text)
        this._isDoingTextWidthOperation = false
        return result
    }

    const old_Window_Base_createLetterEffectSprite = Window_Base.prototype.createLetterEffectSprite;
    Window_Base.prototype.createLetterEffectSprite = function(textState) {
        old_Window_Base_createLetterEffectSprite.call(this, textState)
        this._letterEffectSprites[this._letterEffectSprites.length - 1].visible = !this._isDoingTextWidthOperation
    }
})();