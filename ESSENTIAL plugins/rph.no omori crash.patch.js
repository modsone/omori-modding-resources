/*:
 * @plugindesc No omori/sunny in battle patch
 * @author RPH
 *
 * @help
 *
 * Prevents battles crashing if there's no Sunny/Omori in battle
 *
 * Put this in your mod under a unique name
 * Should not conflict with itself because it's a non-invasive
 *
 *
 *
 */

{
  let old_getOmori =Game_Party.prototype.getOmori ;
  Game_Party.prototype.getOmori = function () {
    let omori = old_getOmori.call(this);
    if( !omori) {
      return this.leader();
    }
    return omori;
  };
}
