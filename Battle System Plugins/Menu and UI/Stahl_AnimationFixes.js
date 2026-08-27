var Imported = Imported || {};
Imported.Stahl_AnimationFixes = true;

//-----------------------------------------------------------------------------
/*:
 * @plugindesc v1.0.0 Fixes mirror not working against actor portrait in OMORI
 *
 * @author StahlReyn
 *
 * @help
 * Fixes mirror not working against actor portrait in OMORI.
 * 
 * Put this below Omori Battle System.js and GTP_CoreUpdates.js in the plugin list.
 */

// Turns the Mirror logic back to exactly base engine logic, which is the correct one. 
// The original Omori logic was broken and caused mirror to not work improperly.
Sprite_Animation.prototype.updateCellSprite = function(sprite, cell) {
    var pattern = cell[0];
    if (pattern >= 0) {
        var sx = pattern % 5 * 192;
        var sy = Math.floor(pattern % 100 / 5) * 192;
        var mirror = this._mirror;
        sprite.bitmap = pattern < 100 ? this._bitmap1 : this._bitmap2;
        sprite.setFrame(sx, sy, 192, 192);
        sprite.x = cell[1];
        sprite.y = cell[2];
        sprite.rotation = cell[4] * Math.PI / 180;
        sprite.scale.x = cell[3] / 100;

        if(cell[5]){
            sprite.scale.x *= -1;
        }
        if(mirror){
            sprite.x *= -1;
            sprite.rotation *= -1;
            sprite.scale.x *= -1;
        }

        sprite.scale.y = cell[3] / 100;
        sprite.opacity = cell[6];
        sprite.blendMode = cell[7];
        sprite.visible = true;
    } else {
        sprite.visible = false;
    }
};

// Let startAnimation take in mirror parameter again, but inverted.
// The inversion is due to base engine logic mirroring for actors normally,
// And OMORI likely tried to just correct it by just forcing no mirror regardless.
// Mirroring twice should make it return to normal, which is what this does.
Window_OmoriBattleActorStatus.prototype.startAnimation = function(layer, animation, mirror, delay) {
  // Set Default Animation Layer
  var animLayer = this._displayLayers._animation4
  switch (layer) {
    case 0: animLayer = this._displayLayers._animation0 ;break;
    case 1: animLayer = this._displayLayers._animation1 ;break;
    case 2: animLayer = this._displayLayers._animation2 ;break;
    case 3: animLayer = this._displayLayers._animation4 ;break;
  };
  // Get Layers
  var sprite = animLayer.startAnimation(animation, !mirror, 0);
  sprite.setHomePosition(this._homePosition.x, this._homePosition.y);
};