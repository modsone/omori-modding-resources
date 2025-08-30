/*:
 * @plugindesc v1.4.0 Adds dynamic rows for state icons with customizable spacing and layout settings. 
 * @author RPH (Original) & KoffinKrypt(Bug fixes, extra functionality as of v1.3.1)
 *
 * @param Icon Spacing
 * @type number
 * @min 1
 * @desc Horizontal space between icons in pixels.
 * @default 26
 *
 * @param Row Spacing
 * @type number
 * @min 1
 * @desc Vertical space between rows in pixels.
 * @default 26
 *
 * @param Icons Per Row
 * @type number
 * @min 1
 * @desc Number of icons displayed per row.
 * @default 5
 *
 * @help
 * ============================================================================
 * Description
 * ============================================================================
 * This plugin lets you add icons for your states, that show in battle.
 * If you want to add icons for your own modded states, all you have to do 
 * is put in this in the Notes section for your state: <StateIcon: filename>
 * Then, just put the icon of the same name under img/system.
 *
 * You can also dynamically adjust the layout of state icons in battle. Icons
 * are displayed in rows with customizable spacing and limits. Parameters
 * allow for full control over the appearance of state icons.
 *
 * Plugin Parameters:
 * - Icon Spacing: Adjusts the horizontal space between icons.
 * - Row Spacing: Adjusts the vertical space between rows.
 * - Icons Per Row: Sets the maximum number of icons per row.
 *
 *
 */

var Imported = Imported || {};
Imported.DynamicStateIcons = true;

var DynamicStateIcons = DynamicStateIcons || {};
DynamicStateIcons.Parameters = PluginManager.parameters('rph_state_icons');
DynamicStateIcons.Param = DynamicStateIcons.Param || {};

DynamicStateIcons.Param.IconSpacing = Number(DynamicStateIcons.Parameters['Icon Spacing']);
DynamicStateIcons.Param.RowSpacing = Number(DynamicStateIcons.Parameters['Row Spacing']);
DynamicStateIcons.Param.IconsPerRow = Number(DynamicStateIcons.Parameters['Icons Per Row']);

{
    let sceneBootOld = Scene_Boot;
    window.stateIconReservations = [];

    window.Scene_Boot = class extends sceneBootOld {
        start() {
            super.start();
            for (let i = 0; i < $dataStates.length; i++) {
                let entry = $dataStates[i];
                if (entry && entry.meta && entry.meta.StateIcon) {
                    let icon = entry.meta.StateIcon.trim();
                    window.stateIconReservations.push(icon);
                }
            }
        }
    };

    let _old_scene_battle_load_reserved_bitmaps = Scene_Battle.prototype.loadReservedBitmaps;
    Scene_Battle.prototype.loadReservedBitmaps = function() {
        _old_scene_battle_load_reserved_bitmaps.call(this);

        for (let img of window.stateIconReservations) {
            ImageManager.reserveSystem(img, 0, this._imageReservationId);
        }
    };

    let _old_window_battle_actor_status_createSprites = Window_OmoriBattleActorStatus.prototype.createACSBubbleSprites;
    let _old_window_battle_actor_status_updatePositions = Window_OmoriBattleActorStatus.prototype.updatePositions;
    Window_OmoriBattleActorStatus.prototype.createACSBubbleSprites = function() {
        this._stateIcons = new Sprite(new Bitmap(96, 16));
        this._stateIcons.x = 0;
        this._stateIcons.y = this.y < 240 ? this.y + this.height : this.y;
        this._stateIconCache = [];
        this.addChild(this._stateIcons);

        _old_window_battle_actor_status_createSprites.call(this, ...arguments);
    };

    Window_OmoriBattleActorStatus.prototype.updatePositions = function() {
        _old_window_battle_actor_status_updatePositions.call(this, ...arguments);

        this._stateIcons.x = (this.width - 96) / 2;
        this._stateIcons.y = this.y < 240 ? this.height : -28;

        let nc = [];
        let actor = this.actor();
        if (actor) {
            for (let state of actor._states) {
                if ($dataStates[state] && $dataStates[state].meta && $dataStates[state].meta.StateIcon) {
                    nc.push(state);
                }
            }
        }

        if (JSON.stringify(nc) !== JSON.stringify(this._stateIconCache)) {
            this._stateIcons.bitmap.clear();
            while (this._stateIcons.children[0]) {
                this._stateIcons.removeChild(this._stateIcons.children[0]);
            }

            let totalLength = nc.length;
            let totalRows = Math.ceil(totalLength / DynamicStateIcons.Param.IconsPerRow);

            for (let i = 0; i < totalLength; i++) {
                let state = nc[i];
                let icon = $dataStates[state].meta.StateIcon.trim();
                let sprite = new Sprite(ImageManager.loadSystem(icon));

                let row = Math.floor(i / DynamicStateIcons.Param.IconsPerRow);
                let col = i % DynamicStateIcons.Param.IconsPerRow;

                let iconsInThisRow = (row === totalRows - 1) ? totalLength % DynamicStateIcons.Param.IconsPerRow || DynamicStateIcons.Param.IconsPerRow : DynamicStateIcons.Param.IconsPerRow;
                let offsetX = ((96 - (iconsInThisRow * DynamicStateIcons.Param.IconSpacing)) / 2);

                sprite.x = offsetX + col * DynamicStateIcons.Param.IconSpacing;
                sprite.y = (this.y < 240 ? row : -row) * DynamicStateIcons.Param.RowSpacing;
                this._stateIcons.addChild(sprite);
            }

            this._stateIconCache = nc;
        }

        this._stateIcons.update();
    };

    let _old_sprite_enemybattlerstatus_refreshBitmap = Sprite_EnemyBattlerStatus.prototype.refreshBitmap;
    Sprite_EnemyBattlerStatus.prototype.refreshBitmap = function(battler) {
        _old_sprite_enemybattlerstatus_refreshBitmap.call(this, ...arguments);
        if (!this._stateIcons) {
            this._stateIcons = new Sprite(new Bitmap(96, 16));
        }
        
        let nc = [];
        if (battler) {
            this._stateIcons.x = (this.bitmap.width - 96) / 2;
            this._stateIcons.y = -28;
            this._stateIcons.bitmap.clear();
            this.addChild(this._stateIcons);

            for (let state of battler._states) {
                if ($dataStates[state] && $dataStates[state].meta && $dataStates[state].meta.StateIcon) {
                    nc.push(state);
                }
            }
        }
        
        while (this._stateIcons.children[0]) {
            this._stateIcons.removeChild(this._stateIcons.children[0]);
        }

        let totalLength = nc.length;
        let totalRows = Math.ceil(totalLength / DynamicStateIcons.Param.IconsPerRow);

        for (let i = 0; i < totalLength; i++) {
            let state = nc[i];
            let icon = $dataStates[state].meta.StateIcon.trim();
            let sprite = new Sprite(ImageManager.loadSystem(icon));

            let row = Math.floor(i / DynamicStateIcons.Param.IconsPerRow);
            let col = i % DynamicStateIcons.Param.IconsPerRow;

            let iconsInThisRow = (row === totalRows - 1) ? totalLength % DynamicStateIcons.Param.IconsPerRow || DynamicStateIcons.Param.IconsPerRow : DynamicStateIcons.Param.IconsPerRow;
            let offsetX = ((96 - (iconsInThisRow * DynamicStateIcons.Param.IconSpacing)) / 2);

            sprite.x = offsetX + col * DynamicStateIcons.Param.IconSpacing;
            sprite.y = -row * DynamicStateIcons.Param.RowSpacing;
            this._stateIcons.addChild(sprite);
        }

        this._stateIcons.update();
    };
}
