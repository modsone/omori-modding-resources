Window_OmoMenuActorEquip.prototype.refresh = function () {
    // Run Original Function
    Window_Selectable.prototype.refresh.call(this);
    // Reset Font Settings
    this.resetFontSettings();
    // Draw Headers
    this.contents.fontSize = 20;
    this.changePaintOpacity(true)
    this.contents.fillRect(4, 28, this.width - 8, 2, 'rgba(255, 255, 255, 1)');
    this.contents.fillRect(4, 65, this.width - 8, 2, 'rgba(255, 255, 255, 1)');
    this.contents.fillRect(4, 90, this.width - 8, 2, 'rgba(255, 255, 255, 1)');
    this.drawText(LanguageManager.getPluginText('equipMenu', 'charm'), 0, -4, this.width, 'center');
    this.drawText(LanguageManager.getPluginText('equipMenu', 'charm'), 0, 58, this.width, 'center');
};

Game_Actor.prototype.equipSlots = function () {
    var slots = this.currentClass().equipSlots.slice();
    slots[0] = 2;
    return slots;
};