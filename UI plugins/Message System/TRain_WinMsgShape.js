/*:
 * @plugindesc change Window_Message shape and position for OMORI
 * @author TrophicRain
 * 
 * @help
 * plugin commands:
 *   TR_WMS x [value]      # set x position
 *   TR_WMS y [value]      # set y position
 *   TR_WMS width [value]  # set width
 *   TR_WMS height [value] # set height
 *   TR_WMS quicknamebox [true/false] # let me explain this
 *   TR_WMS reset          # reset x,y,width,height
 * 
 * quicknamebox:
 * if true, the name box won't move in from the left side of the screen,
 * instead it just opens at final position.
 * this is useful if message window x is much higher than 0.
 * "TR_WMS reset" will NOT reset quicknamebox, you need to manually use "TR_WMS quicknamebox false" then.
 * 
 */





var TR_WMS = {
    _store: Game_System.prototype.initialize
};



TR_WMS._GameInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function (command, args) {
    TR_WMS._GameInterpreter_pluginCommand.call(this, command, args);
    if (command && command.toUpperCase() === 'TR_WMS') {
        switch (args[0] && args[0].toLowerCase()) {
            case 'x':
                $gameSystem.TR_WMS.x = parseInt(args[1]);
                break;
            case 'y':
                $gameSystem.TR_WMS.y = parseInt(args[1]);
                break;
            case 'width':
                $gameSystem.TR_WMS.width = parseInt(args[1]);
                break;
            case 'height':
                $gameSystem.TR_WMS.height = parseInt(args[1]);
                break;
            case 'quicknamebox':
                $gameSystem.TR_WMS.quickNB = (args[1] && args[1].toLowerCase() === 'true');
                break;
            case 'reset':
                $gameSystem.resetWMS();
                break;
            default:
                console.warn('TR_WMS: Unknown command:', args[0]);
        }
    }
};





Game_System.prototype.initialize = function () {
    TR_WMS._store.call(this);
    this.TR_WMS = {};
    this.TR_WMS.quickNB = true;
    this.resetWMS();
};

Game_System.prototype.resetWMS = function(){
    // [NOTE] quickNB is not reset,
    // because if resetWMS() mid-message, quickNB should keep true
    // You need to reset it manually
    this.TR_WMS.x = null;
    this.TR_WMS.y = null;
    this.TR_WMS.width = null;
    this.TR_WMS.height = null;
};





Window_NameBox.prototype.refresh = function (text, position) {
    this.show();
    this._lastNameText = text;
    this._text = Yanfly.Param.MSGNameBoxText + text;
    this._position = position;
    this.width = this.windowWidth();
    this.createContents();
    this.contents.clear();
    this.resetFontSettings();
    this.changeTextColor(this.textColor(Yanfly.Param.MSGNameBoxColor));
    var padding = eval(Yanfly.Param.MSGNameBoxPadding) / 2;
    const loc_position = LanguageManager.getMessageData("XX_BLUE.Window_NameBox").refresh_draw_text_position
    this.drawTextEx(this._text, eval(loc_position[0]), loc_position[1], this.contents.width);
    this._parentWindow.adjustWindowSettings();
    this._parentWindow.updatePlacement();
    this.adjustPositionY();
    this.open();
    this.activate();
    this._closeCounter = 4;

    if ($gameSystem.TR_WMS.quickNB) this.adjustPositionX();
    return '';
};


Window_NameBox.prototype.adjustPositionY = function () {
    if ($gameMessage.positionType() === 0) {
        this.y = this._parentWindow.y + this._parentWindow.height;
        this.y -= eval(Yanfly.Param.MSGNameBoxBufferY);
        this.y += 4;
    } else {
        this.y = this._parentWindow.y;
        this.y -= this.height;
        this.y += eval(Yanfly.Param.MSGNameBoxBufferY);
        this.y -= 4;
    }
    if (this.y < 0) {
        this.y = this._parentWindow.y + this._parentWindow.height;
        this.y -= eval(Yanfly.Param.MSGNameBoxBufferY);
        this.y += 4;
    }
};





Window_Message.prototype.updateOpen = function () {
    if (this._opening) {
        Window_Base.prototype.updateOpen.call(this);
        var rate = this.openness / 255;
        if (this._battleMessageTail) {
            this._battleMessageTail.y = this._windowSpriteContainer.y + 4;
            this._battleMessageTail.scale.y = rate;
        }

        if (!$gameSystem.TR_WMS.quickNB) {
            var d = Math.max((rate * 20), 1);
            this._nameWindow.x = (this._nameWindow.x * (d - 1) + 77) / d;
        }
    }
};


Window_Message.prototype.updateClose = function () {
    if (this._closing) {
        Window_Base.prototype.updateClose.call(this);
        var rate = this.openness / 255;
        if (this._battleMessageTail) {
            this._battleMessageTail.y = this._windowSpriteContainer.y + 4;
            this._battleMessageTail.scale.y = rate;
        }
        if (this.isClosed()) { }

        var faceBoxes = this._faceBoxWindowContainer.children;
        for (var i = 0; i < faceBoxes.length; i++) {
            faceBoxes[i].openness = Math.min(faceBoxes[i].openness, this.openness);
        }

        if (!$gameSystem.TR_WMS.quickNB) {
            var d = Math.max((rate * 20), 1);
            this._nameWindow.x = (this._nameWindow.x * (d - 1) + -300) / d;
        }
    }
};



Window_Message.prototype.windowWidth = function(){
    if ($gameParty.inBattle()) { return 360 }
    if ($gameSystem.TR_WMS.width) return $gameSystem.TR_WMS.width;
    return Graphics.boxWidth - 32;
};

Window_Message.prototype.windowHeight = function(){
    if ($gameSystem.TR_WMS.height) return $gameSystem.TR_WMS.height;
    return this.fittingHeight(this.numVisibleRows());
};


Window_Message.prototype.adjustWindowSettings = function() {
    this.width = this.windowWidth();
    this.height = Math.min(this.windowHeight(), Graphics.boxHeight);
    if (Math.abs(Graphics.boxHeight - this.height) < this.lineHeight()) {
      this.height = Graphics.boxHeight;
    }
    this.createContents();

    if ($gameSystem.TR_WMS.x != null) this.x = $gameSystem.TR_WMS.x;
    else this.x = (Graphics.boxWidth - this.width) / 2;
};


Window_Message.prototype.updatePlacement = function () {
    _TDS_.OmoriBASE.Window_Message_updatePlacement.call(this);
    if (this._battleMessageTail) {
        this._battleMessageTail.x = this.width / 2;
        this._battleMessageTail.visible = this.isBattleMessageTailVisible();
    };

    if ($gameSystem.TR_WMS.y != null) {
        this.y = $gameSystem.TR_WMS.y;
    } else {
        if (this._positionType === 0) { this.y += 8 };
        if (this._positionType === 2) {
            if ($gameParty.inBattle()) {
                if ($gameSwitches.value(41) || [2, 5, 6].contains($gameVariables.value(22))) {
                    this.y -= 11;
                } else {
                    this.y -= 65;
                }
            } else {
                this.y -= 8
            }
        };
    }

    this._faceBoxWindowContainer.y = this.y - this._faceBoxWindow.height - 4;
    this._faceBoxWindowContainer.x = this.x + this.width + 2;
    this._goldWindow.y = this.y > 0 ? 12 : Graphics.boxHeight - this._goldWindow.height
};

