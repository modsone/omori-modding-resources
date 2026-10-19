/*:
 * @plugindesc Refresh Party Members In-battle
 * @author KoffinKrypt 
 *
 * @help
 * Automatically refreshes party members' battle portraits after adding
 * or removing party members mid-battle.
 *
 * V1.3 - Preserves z-index and prevents HEART/JUICE bars from re-animating on refresh.
 *
 */

(function() {
    // Store original Game_Party methods
    var _Game_Party_addActor = Game_Party.prototype.addActor;
    var _Game_Party_removeActor = Game_Party.prototype.removeActor;

    // Override addActor to refresh battle sprites when in battle
    Game_Party.prototype.addActor = function(actorId) {
        var wasInBattle = $gameParty.inBattle();
        var result = _Game_Party_addActor.call(this, actorId);
        
        if (wasInBattle && SceneManager._scene instanceof Scene_Battle) {
            SceneManager._scene.refreshFaceWindows(true); // Pass true to indicate refresh from party change
        }
        
        return result;
    };

    // Override removeActor to refresh battle sprites when in battle
    Game_Party.prototype.removeActor = function(actorId) {
        var wasInBattle = $gameParty.inBattle();
        var result = _Game_Party_removeActor.call(this, actorId);
        
        if (wasInBattle && SceneManager._scene instanceof Scene_Battle) {
            SceneManager._scene.refreshFaceWindows(true); // Pass true to indicate refresh from party change
        }
        
        return result;
    };

    // Store original refresh method
    var _Scene_Battle_refreshFaceWindows = Scene_Battle.prototype.refreshFaceWindows;
    
    // Override refreshFaceWindows to preserve picture layers and prevent HP/MP animation
    Scene_Battle.prototype.refreshFaceWindows = function(skipAnimation) {
        // Store the picture container and its current Z-index
        var pictureContainer = this._spriteset ? this._spriteset._pictureContainer : null;
        var pictureIndex = -1;
        var pictureParent = null;
        
        if (pictureContainer && this._spriteset) {
            pictureParent = this._spriteset;
            pictureIndex = pictureParent.children.indexOf(pictureContainer);
        }
        
        // Store other important elements that might be affected
        var stressBar = this._stressBar;
        var stressBarParent = stressBar ? stressBar.parent : null;
        var stressBarIndex = -1;
        if (stressBarParent && stressBar) {
            stressBarIndex = stressBarParent.children.indexOf(stressBar);
        }
        
        // Store low HP overlay
        var lowHpOverlay = this._lowHpOverlay;
        var lowHpOverlayParent = lowHpOverlay ? lowHpOverlay.parent : null;
        var lowHpOverlayIndex = -1;
        if (lowHpOverlayParent && lowHpOverlay) {
            lowHpOverlayIndex = lowHpOverlayParent.children.indexOf(lowHpOverlay);
        }
        
        // Store current HP/MP values for each actor before refresh
        var currentHpValues = [];
        var currentMpValues = [];
        if (skipAnimation && this._faceWindows) {
            for (var i = 0; i < this._faceWindows.length; i++) {
                var win = this._faceWindows[i];
                var actor = win.actor();
                if (actor) {
                    currentHpValues[i] = actor.hp;
                    currentMpValues[i] = actor.mp;
                }
            }
        }
        
        // Call original refresh (removes and recreates face windows)
        if (_Scene_Battle_refreshFaceWindows) {
            _Scene_Battle_refreshFaceWindows.call(this);
        } else {
            // Original logic if no stored method
            if (this._faceWindowsContainer) {
                this.removeChild(this._faceWindowsContainer);
                this._faceWindowsContainer = null;
            }
            this.createFaceWindows();
            this.createActorWindow();
        }
        
        // If skipping animation, set animation durations to 0 and force correct values
        if (skipAnimation && this._faceWindows) {
            for (var i = 0; i < this._faceWindows.length; i++) {
                var win = this._faceWindows[i];
                var actor = win.actor();
                if (actor) {
                    // Set animation durations to 0 to prevent animation
                    if (win._hpAnim) {
                        win._hpAnim.duration = 0;
                        win._hpAnim.current = actor.hp;
                        win._hpAnim.target = actor.hp;
                        win._hpAnim.old = actor.hp;
                    }
                    if (win._mpAnim) {
                        win._mpAnim.duration = 0;
                        win._mpAnim.current = actor.mp;
                        win._mpAnim.target = actor.mp;
                        win._mpAnim.old = actor.mp;
                    }
                    
                    // Force redraw of HP and MP values
                    win.drawHP(actor.hp, actor.mhp);
                    win.drawMP(actor.mp, actor.mmp);
                    
                    // Force update bar widths
                    if (win._hpBarSprite) {
                        var hpWidth = (actor.hp / actor.mhp) * 81;
                        win._hpBarSprite._frame.width = hpWidth;
                        win._hpBarSprite._refresh();
                    }
                    if (win._mpBarSprite) {
                        var mpWidth = (actor.mp / actor.mmp) * 81;
                        win._mpBarSprite._frame.width = mpWidth;
                        win._mpBarSprite._refresh();
                    }
                }
            }
        }
        
        // Restore picture container to its original Z-index
        if (pictureContainer && pictureParent && pictureIndex !== -1) {
            // Check if it's still in the parent
            var currentIndex = pictureParent.children.indexOf(pictureContainer);
            if (currentIndex !== pictureIndex && currentIndex !== -1) {
                pictureParent.removeChild(pictureContainer);
                pictureParent.addChildAt(pictureContainer, pictureIndex);
            } else if (currentIndex === -1) {
                // Reattach if it got removed
                pictureParent.addChildAt(pictureContainer, Math.min(pictureIndex, pictureParent.children.length));
            }
        }
        
        // Restore stress bar position
        if (stressBar && stressBarParent && stressBarIndex !== -1) {
            var currentStressIndex = stressBarParent.children.indexOf(stressBar);
            if (currentStressIndex !== stressBarIndex && currentStressIndex !== -1) {
                stressBarParent.removeChild(stressBar);
                stressBarParent.addChildAt(stressBar, stressBarIndex);
            }
        }
        
        // Restore low HP overlay position
        if (lowHpOverlay && lowHpOverlayParent && lowHpOverlayIndex !== -1) {
            var currentOverlayIndex = lowHpOverlayParent.children.indexOf(lowHpOverlay);
            if (currentOverlayIndex !== lowHpOverlayIndex && currentOverlayIndex !== -1) {
                lowHpOverlayParent.removeChild(lowHpOverlay);
                lowHpOverlayParent.addChildAt(lowHpOverlay, lowHpOverlayIndex);
            }
        }
        
        // Force refresh stress bar bitmap
        if (this._stressBar && this._stressBar.refreshEKGBitmap) {
            this._stressBar.refreshEKGBitmap();
        }
        
        // Reapply picture display layer setting
        if (BattleManager._pictureDisplayLayer) {
            BattleManager.setPictureDisplayLayer(BattleManager._pictureDisplayLayer);
        }
    };
})();