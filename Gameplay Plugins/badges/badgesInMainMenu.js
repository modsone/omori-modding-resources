Scene_Menu.prototype.createCommandWindow = function() {
    // If Command Window Does Not Exist
    if (!this._commandWindow) {
      // Create Command Window
      this._commandWindow = new Window_MenuCommand(10, 10);
    } else {
      this._commandWindow.refresh();
    };
    this._commandWindow.activate();
    this._commandWindow.setHandler('talk',      this.commandTalk.bind(this));
    this._commandWindow.setHandler('item',      this.onPersonalOk.bind(this));
    this._commandWindow.setHandler('skill',     this.commandPersonal.bind(this));
    this._commandWindow.setHandler('equip',     this.commandPersonal.bind(this));
    this._commandWindow.setHandler('options',   this.commandOptions.bind(this));
    this._commandWindow.setHandler('badge',      this.commandBadge.bind(this));
    this._commandWindow.setHandler('cancel',    this.popScene.bind(this));
    this.addWindow(this._commandWindow);
  };
  
  Scene_Menu.prototype.commandBadge = function() {
    SceneManager.push(DGT.BadgeScene)
  };
  
  
  var old_Window_MenuCommand_prototype_makeCommandList = Window_MenuCommand.prototype.makeCommandList;
  Window_MenuCommand.prototype.makeCommandList = function() {
    old_Window_MenuCommand_prototype_makeCommandList.call(this);
    // First argument here ("SAVE") is what sets the actual text that appears in menu
    this.addCommand('BADGES', 'badge');
  };
  
  Window_MenuCommand.prototype.spacing = function () {  return 10; };