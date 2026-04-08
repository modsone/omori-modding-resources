//=============================================================================
 /*:
 * @plugindesc
 * Lets you set layers for attack animations (1.0)
 *
 * @author LAUPIG and some dude in rpgmaker forums called GLAPHEN
 * @help
 * this just adds 2 name tags to attack animations
 * -"<ue>" (lowercase) to have it render below enemies
 * -"<cl> [number]" to have it render at any layer you want (under enemies is -1, idk what the others do)
 * P.D i hope archeia omocat and yanfly die a slow and painful death for not making this already
 */
//=============================================================================

var animation_position = Sprite_Animation.prototype.updatePosition;
Sprite_Animation.prototype.updatePosition = function() {
    animation_position.call(this)
    //behind shortcut
    if (this._animation.name.contains("<ue>")) {
        this.z = -1;
    } else {
        this.z = 8;
    }
    //custom layer
    if (this._animation.name.contains("<cl>")) {
        var truez = this._animation.name.match(/-?\d+/);
        this.z = truez[0];}
}