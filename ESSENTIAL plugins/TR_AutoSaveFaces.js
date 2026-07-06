//=============================================================================
// Auto Save Faces - By TomatoRadio
// TR_AutoSaveFaces.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_AutoSaveFaces = true;

var TR = TR || {};
TR.ASF = TR.ASF || {};

/*: 
 * @plugindesc v1.0 Automatically handles save faces.
 * @author TomatoRadio
 * 
 * @help
 * Automatically handles assigning face images
 * to save files. Actors will always use their
 * BattleStatusFaceName for their save face.
 * 
 * In addition the preloading of these faces is
 * also handled.
 * (Users of Girlmori Is Real will also have the
 * fem variants of faces preloaded as well.)
 * 
*/

Game_Actor.prototype.faceSaveLoad = function() {
var actor = this.actor();
    if (actor && this.battleStatusFaceName()) {
        return this.battleStatusFaceName();
    } else {
        console.error("SAVE FACE ERROR: Actor is falsy OR there's not BattleStatusFaceName",this.actor(),this.battleStatusFaceName());
        return "01_OMORI_BATTLE";
    };
};

TR.ASF.oldDatabaseLoad = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
    if (!TR.ASF.oldDatabaseLoad.call(this)) return false;
    var actors = $dataActors.filter(a=>a&&a.meta.BattleStatusFaceName);
    for (let actor of actors) {
        if (TR.GIR) { // Girlmori Is Real support.
            let name = TR.GIR.Keyword  || "sunny";
            let suffix = TR.GIR.Suffix || "_girl";
            if (actor.meta.BattleStatusFaceName.trim().toLowerCase().includes(name)) {
                ImageManager.reserveFace(actor.meta.BattleStatusFaceName.trim()+suffix);
            }
        };
        ImageManager.reserveFace(actor.meta.BattleStatusFaceName.trim());
    };
    return true;
};