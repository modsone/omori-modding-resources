{
    let _old_scene_battle_load_reserved_bitmaps = Scene_Battle.prototype.loadReservedBitmaps;
    Scene_Battle.prototype.loadReservedBitmaps = function() {
        _old_scene_battle_load_reserved_bitmaps.call(this);
          
        // load funky command sprites
        ImageManager.reserveSystem('battleatlas_dw_omori',  0, this._imageReservationId);
		ImageManager.reserveSystem('battleatlas_dw_basil',  0, this._imageReservationId);
        ImageManager.reserveSystem('battleatlas_dw_kel',  0, this._imageReservationId);
        ImageManager.reserveSystem('battleatlas_dw_hero',  0, this._imageReservationId);
        ImageManager.reserveSystem('battleatlas_dw_aubrey',  0, this._imageReservationId);

        ImageManager.reserveSystem('battleatlas_fa_sunny',  0, this._imageReservationId);
		ImageManager.reserveSystem('battleatlas_fa_basil',  0, this._imageReservationId);
        ImageManager.reserveSystem('battleatlas_fa_kel',  0, this._imageReservationId);
        ImageManager.reserveSystem('battleatlas_fa_hero',  0, this._imageReservationId);
        ImageManager.reserveSystem('battleatlas_fa_aubrey',  0, this._imageReservationId);
    };

    let _old_window_actor_command_create_command_sprites = Window_ActorCommand.prototype.createCommandSprites;

    Window_ActorCommand.prototype.createCommandSprites = function() {
        _old_window_actor_command_create_command_sprites.call(this);

        let commandName = 'BattleCommands_DreamWorld';
        // Set Command
        switch ($gameVariables.value(22)) {
          case 1:
            commandName = 'BattleCommands_DreamWorld';
            break;
          case 2: 
            commandName = 'BattleCommands_Faraway';
            break;
          case 3:
            commandName = 'BattleCommands_BlackSpace';
            break;
          case 4:
            commandName = 'BattleCommands_BlackSpace';
            break;
          case 5:
            commandName = 'BattleCommands_BlackSpace';
            break;
        };

        this._actorCommandSprites = {};

        // actor specific funnyness
        this._actorSpecific = false;
        if (commandName === 'BattleCommands_DreamWorld') {
            // load DW actors
            this._actorAtlases = {
                1: ImageManager.loadSystem("battleatlas_dw_omori"),
                2: ImageManager.loadSystem("battleatlas_dw_aubrey"),
                3: ImageManager.loadSystem("battleatlas_dw_kel"),
				4: ImageManager.loadSystem("battleatlas_dw_hero"),
                8: ImageManager.loadSystem("battleatlas_fa_sunny"),
                9: ImageManager.loadSystem("battleatlas_fa_aubrey"),
                10: ImageManager.loadSystem("battleatlas_fa_kel"),
                11: ImageManager.loadSystem("battleatlas_fa_hero"),
				12: ImageManager.loadSystem("battleatlas_fa_basil"),
            };
            this._actorCommandSprites = {1: [], 2: [], 3: [], 4: [], 8: [], 9: [], 10: [], 11: [], 12: []};
            this._actorSpecific = true;
        }

        if (commandName === 'BattleCommands_Faraway') {
            // load FA actors
            this._actorAtlases = {
            8: ImageManager.loadSystem("battleatlas_fa_sunny"),
            9: ImageManager.loadSystem("battleatlas_fa_aubrey"),
            10: ImageManager.loadSystem("battleatlas_fa_kel"),
            11: ImageManager.loadSystem("battleatlas_fa_hero"),
            };
            this._actorCommandSprites = {8: [], 9: [], 10: [], 11: []};
            this._actorSpecific = true;
        }

        
        if (this._actorSpecific) {
            for (let actorId in this._actorAtlases) {
                let asprite = new Sprite(this._actorAtlases[actorId]);
                let rect = this.itemRect(0);

                asprite.x = rect.x;
                asprite.y = rect.y;

                this._actorCommandSprites[actorId] = asprite;
                this.addChildToBack(asprite);
                asprite.visible = false;
            }
            // Set Default Custom cursor X Offset
            this._customCursorXOffset = 12;
            // Set Default Max Columns
            this._commandMaxCols = 2;
        }
    }

    let _old_window_actorCommand_update = Window_ActorCommand.prototype.update;
    Window_ActorCommand.prototype.update = function() {
        _old_window_actorCommand_update.call(this, ...arguments);
        // refresh if this is active
        if (this.active) {
            if (this._actorSpecific) {
            for (let a of this._commandSprites) {
                a.visible = false;
            }

            for (let a in this._actorCommandSprites) {
                this._actorCommandSprites[a].visible = false;
            }

            this._actorCommandSprites[this._actor._actorId].visible = true;
            }
        }
    }
}