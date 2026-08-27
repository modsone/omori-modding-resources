 /*:
 * @plugindesc (PLACE ABOVE VisuMZ_5_TiledMZ.js) makes dummy stuff for stuff doesn't exist in MV
 */
 
Tilemap.Layer = class {
  constructor() {
  }
};

PluginManager.registerCommand = function (...args) {
};

var beesList_arrayFilter = Array.prototype.filter;

// Oneloader compatibility
if (typeof $modLoader !== "undefined") {
    Array.prototype.filter = function (callback, thisArg) {
        if (callback.toString().includes("TiledMZ")) {
            callback = "function (p) { return p.status && p.name.includes('5_tiledmz') }";
            callback = new Function(`return ${callback}`)();
        };
        return beesList_arrayFilter.call(this, callback, thisArg);
    };
};

