!function(){ 
    //Gold Counter Disabler for Headspace
    Scene_Menu.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createCommandWindow();
        this.createStatusWindows();
        //Check if Headspace or Faraway
            if ($gameSwitches.value(7) == 1) {
                this.createGoldWindow();
        }
    };

    Scene_Menu.prototype.onPersonalOk = function() {
        //Check if Headspace or Faraway
        if ($gameSwitches.value(7) == 1)
            this._goldWindow.close();
            switch (this._commandWindow.currentSymbol()) {
             case 'talk': return this.processTag() ;break;
             case 'item':  SceneManager.push(Scene_OmoMenuItem)   ;break;
             case 'skill': SceneManager.push(Scene_OmoMenuSkill)  ;break;
             case 'equip':  SceneManager.push(Scene_OmoMenuEquip) ;break;
        }
        // Transfer Command and Status Window to new Scene
        SceneManager._nextScene.setCommandWindow(this._commandWindow)
        SceneManager._nextScene.setStatusWindow(this._statusWindow);
    };

    Scene_OmoMenuOptions.prototype.createGoldWindow = function() {
        //Check if Headspace or Faraway
        if ($gameSwitches.value(7) == 1) {
            this._goldWindow = new Window_Gold(0, 0);
            this._goldWindow.x = (Graphics.boxWidth - this._goldWindow.width) - 10;
            this._goldWindow.y = (this._commandWindow.y + this._commandWindow.height) + 8;
            this._goldWindow.openness = 255;
            this._goldWindow.close();
            this.addChild(this._goldWindow);
        }
    };

    Scene_Menu.prototype.processTag = function() {
        // Get Index
        var index = this._statusWindow.index();
      
        // If Stab switch is on
        if ($gameSwitches.value(4)) {
      
          if (index === 0) {
            // Reserve Common Event
            $gameTemp.reserveCommonEvent(34);
            // Go to Scene Map
            SceneManager.goto(Scene_Map);
          } else {
            // Play Buzzer
            SoundManager.playBuzzer();
            // this._commandWindow.activate();
            this._statusWindow.activate();
          }
          return;
        }
        // If Index is more than 0
        if (index > 0) {
          // Reopen Gold Window
          //Check if Headspace or Faraway
          if ($gameSwitches.value(7) == 1) {
            this._goldWindow.open()
        }
          // Get Actor ID
          var actorId = $gameParty.members()[index].actorId();
          // Set Actor ID Variable
          $gameVariables.setValue(_TDS_.MapCharacterTag.params.selectedVariableID, actorId);
          // Reserve Common Event
          $gameTemp.reserveCommonEvent(_TDS_.MapCharacterTag.params.commonEventID);
        } else {
            // Play Buzzer
            SoundManager.playBuzzer();
            // Reopen Gold Window
            //Check if Headspace or Faraway
            if ($gameSwitches.value(7) == 1) {
                this._goldWindow.open()
        }
        // this._commandWindow.activate();
        this._statusWindow.activate();
        // this._statusWindow.deselect();
        return;
        }
        // Go to Scene Map
        SceneManager.goto(Scene_Map);
    };

    Scene_OmoMenuOptions.prototype.create = function() {
        // Super Call
        Scene_OmoMenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createStatusWindows();
        if ($gameSwitches.value(7) == 1) {
            this.createGoldWindow();
        }
        this.createGeneralOptionsWindow();
        this.createAudioOptionsWindow();
        this.createControllerOptionsWindow();
        this.createSystemOptionsWindow();
        this.createOptionCategoriesWindow();
        // this.createHelpWindow();
        this.createCommandWindow();
        this.createExitPromptWindow();
      };
}() //Thanks FoG