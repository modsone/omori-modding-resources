/*:
 * @plugindesc Visual Novel style choice for OMORI
 * @author TrophicRain
 * 
 * @help
 * Enables or disables the Visual Novel style choice list.
 * plugin commands:
 * 
 * TR_VNC enable
 * TR_VNC disable
 * 
 * 
 * @param width
 * @desc Width of the choice button.
 * @type number
 * @default 420
 * 
 * @param button_height
 * @desc Height of the choice button.
 * @type number
 * @default 52
 * 
 * @param spacing
 * @desc Spacing between choice buttons.
 * @type number
 * @default 34
 * 
 * @param margin_top
 * @desc Top margin for the choice list.
 * @type number
 * @default 56
 * 
 * @param cursor_x
 * @desc X offset for the redhand cursor.
 * @type number
 * @default 48
 * 
 */



var TR_VNC = {
    _extends: {
        pluginCommand: Game_Interpreter.prototype.pluginCommand,
        standardPadding: Window_ChoiceList.prototype.standardPadding,
        textPadding: Window_ChoiceList.prototype.textPadding,
        lineHeight: Window_ChoiceList.prototype.lineHeight,
        maxChoiceWidth: Window_ChoiceList.prototype.maxChoiceWidth,
        customCursorRectTextXOffset: Window_ChoiceList.prototype.customCursorRectTextXOffset,
        customCursorRectTextYOffset: Window_ChoiceList.prototype.customCursorRectTextYOffset,
        openSpeed: Window_ChoiceList.prototype.openSpeed,
        closeSpeed: Window_ChoiceList.prototype.closeSpeed,
        customCursorRectXOffset: Window_ChoiceList.prototype.customCursorRectXOffset,
        customCursorRectYOffset: Window_ChoiceList.prototype.customCursorRectYOffset,

        updateBackground: Window_ChoiceList.prototype.updateBackground,
        updatePlacement: Window_ChoiceList.prototype.updatePlacement,
        drawItem: Window_ChoiceList.prototype.drawItem
    },

    _default: {
        width: parseInt(PluginManager.parameters('TRain_VNChoice')['width']),
        button_height: parseInt(PluginManager.parameters('TRain_VNChoice')['button_height']),
        spacing: parseInt(PluginManager.parameters('TRain_VNChoice')['spacing']),
        margin_top: parseInt(PluginManager.parameters('TRain_VNChoice')['margin_top']),
        cursor_x: parseInt(PluginManager.parameters('TRain_VNChoice')['cursor_x'])
    },

    _store: Game_System.prototype.initialize
};



Game_Interpreter.prototype.pluginCommand = function(command, args) {
    TR_VNC._extends.pluginCommand.call(this, command, args);
    if (command && command.toUpperCase() === 'TR_VNC') {
        switch (args[0] && args[0].toLowerCase()) {
            case 'enable':
                $gameSystem.TR_VNC.enabled = true;
                break;
            case 'disable':
                $gameSystem.TR_VNC.enabled = false;
                break;
            default:
                console.warn('TR_VNC: Unknown command:', args[0]);
        }
    }
};




Game_System.prototype.initialize = function() {
    TR_VNC._store.call(this);
    this.resetVNC();
};

Game_System.prototype.resetVNC = function() {
    this.TR_VNC = {
        enabled: true
    };
};




Window_ChoiceList.prototype.standardPadding = function() {
    if ($gameSystem.TR_VNC.enabled) return 0;
    return TR_VNC._extends.standardPadding.call(this);
};

Window_ChoiceList.prototype.textPadding = function() {
    if ($gameSystem.TR_VNC.enabled) return 0;
    return TR_VNC._extends.textPadding.call(this);
};

Window_ChoiceList.prototype.lineHeight = function() {
    if ($gameSystem.TR_VNC.enabled) return TR_VNC._default.button_height + TR_VNC._default.spacing;
    return TR_VNC._extends.lineHeight.call(this);
};

Window_ChoiceList.prototype.maxChoiceWidth = function() {
    if ($gameSystem.TR_VNC.enabled) return TR_VNC._default.width;
    return TR_VNC._extends.maxChoiceWidth.call(this);
};

Window_ChoiceList.prototype.customCursorRectTextXOffset = function() {
    if ($gameSystem.TR_VNC.enabled) return 0;
    return TR_VNC._extends.customCursorRectTextXOffset.call(this);
};

Window_ChoiceList.prototype.customCursorRectTextYOffset = function() {
    if ($gameSystem.TR_VNC.enabled) return 0;
    return TR_VNC._extends.customCursorRectTextYOffset.call(this);
};

Window_ChoiceList.prototype.openSpeed = function() {
    if ($gameSystem.TR_VNC.enabled) return 255;
    return TR_VNC._extends.openSpeed.call(this);
};

Window_ChoiceList.prototype.closeSpeed = function() {
    if ($gameSystem.TR_VNC.enabled) return 255;
    return TR_VNC._extends.closeSpeed.call(this);
};

Window_ChoiceList.prototype.customCursorRectXOffset = function() {
    if ($gameSystem.TR_VNC.enabled) return TR_VNC._default.cursor_x;
    return TR_VNC._extends.customCursorRectXOffset.call(this);
};

Window_ChoiceList.prototype.customCursorRectYOffset = function() {
    if ($gameSystem.TR_VNC.enabled) return 2;
    return TR_VNC._extends.customCursorRectYOffset.call(this);
};




Window_ChoiceList.prototype.updateBackground = function() {
    if (!$gameSystem.TR_VNC.enabled) return TR_VNC._extends.updateBackground.call(this);
    
    this._background = 2;   // Transparent
    this.setBackgroundType(2);
};


Window_ChoiceList.prototype.updatePlacement = function(){
    this.updatePadding();   // Fix this.padding !== this.standardPadding()
    if (!$gameSystem.TR_VNC.enabled) return TR_VNC._extends.updatePlacement.call(this);

    this.width = this.windowWidth();
    this.height = this.windowHeight();
    this.x = (Graphics.width - TR_VNC._default.width) / 2;
    this.y = TR_VNC._default.margin_top - TR_VNC._default.spacing / 2;
};


Window_ChoiceList.prototype.drawItem = function(index) {
    if (!$gameSystem.TR_VNC.enabled) return TR_VNC._extends.drawItem.call(this, index);

    // Draw button
    var rect = this.itemRectForText(index);
    var button_y = rect.y + TR_VNC._default.spacing / 2;
    this.contents.fillRect(rect.x, button_y, rect.width, TR_VNC._default.button_height, 'black');
    this.contents.fillRect(rect.x+1, button_y+1, rect.width-2, TR_VNC._default.button_height-2, 'white');
    this.contents.fillRect(rect.x+4, button_y+4, rect.width-8, TR_VNC._default.button_height-8, 'black');

    // Draw text
    var text = this.commandName(index);
    var text_width = this.textWidthEx(text);
    var text_x = rect.x + (rect.width - text_width) / 2;
    var text_y = rect.y + (rect.height - this.contents.fontSize) / 2;
    text_y -= 7;    // Compensate for the gap above font

    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawTextEx(text, text_x, text_y);
};

