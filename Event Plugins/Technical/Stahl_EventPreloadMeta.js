/*:
 * @plugindesc [v1.0.0] Makes preload event used by Yanfly also have meta carried over.
 * 
 * @author ReynStahl
 *
 * @help
 * Some Yanfly plugins preloads the map beforehand, but the notes are not
 * parsed into meta field for like usualy when trying to access .event()
 * for the copied events.
 * 
 * This plugin makes the meta parsed also carry over into preloaded map events.
 * The note still is untouched due to how event copier works.
 * 
 * Usage: Put below
 * - YEP_EventCopier
 * - YEP_EventMorpher
 * - YEP_EventSpawner
 */

var Imported = Imported || {};
Imported.Stahl_EventMeta = true;

var Stahl = Stahl || {};
Stahl.EventMeta = Stahl.EventMeta || {};

Stahl.EventMeta.DataManager_onLoad = DataManager.onLoad;
DataManager.onLoad = function(object) {
    Stahl.EventMeta.DataManager_onLoad.call(this, object);
    if (object === $dataMap && !Stahl.EventMeta._extractedMetadata) {
        for (let map of Yanfly.PreloadedMaps) {
            if (!map) continue;
            for (let event of map.events) {
                if (!event) continue;
                this.extractMetadata(event);
            }
            console.log("Extract Metadata for Preloaded Map", map._mapId);
        }
        Stahl.EventMeta._extractedMetadata = true;
    }
}