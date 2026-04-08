//=============================================================================
// Multi Parallax - By TomatoRadio
// TR_MultiParallax.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_MultiParallax = true;

var TR = TR || {};
TR.MP = TR.MP || {};

/*: 
 *
 * @plugindesc v1.0 Allows multiple parallaxes.
 * @author TomatoRadio
 * 
 * @help
 * This plugin allows you to add extra Parallaxes on top of the base one.
 * 
 * There are two ways to do this, being Map Notetags & Plugin Commands.
 * 
 * To add an ExtraParallax using a Map Notetag, add this tag to the notetags.
 * <ExtraParallax: name, opacity, xScroll, yScroll, xShift, yShift>
 * name - The name of the image from img/parallaxes.
 * opacity - The opacity of the image from 0-255. Defaults to 255.
 * xScroll - The scrolling speed on the X axis. Defaults to 0.
 * yScroll - The scrolling speed on the Y axis. Defaults to 0.
 * xShift - The offset that the parallax will horizontally move with the rest of the world. Defaults to 1.
 * (This value is a multiplier. So if you want it to move at half speed, use 0.5, 2 for double, etc.)
 * (This is actually what parallaxing is. Ironically, RPG Maker parallaxes don't parallax.)
 * yShift - The offset that the parallax will vertically move with the rest of the world. Defaults to 1.
 * 
 * If you would like to use the default value without actually setting it for whatever reason,
 * simply don't include anything in that slot.
 * eg. <ExtraParallax:Space_parallax,,3>
 * This will use the Space_parallax image and have an xScroll of 3, while all other parameters are default.
 * 
 * To add multiple ExtraParallaxes, simply include multiple notetags. They will be layered from top to bottom,
 * with the top being displayed furthest back.
 * 
 * To add an ExtraParallax using a Plugin Command, use this command.
 * AddExtraParallax name opacity xScroll yScroll xShift yShift index
 * 
 * All parameters are the same as the notetag, with the exception of index.
 * 
 * Index alls you to determine the layer position of the parallax, with lower indexes (down to 0)
 * being placed further backwards.
 * 
 * For the plugin command, 'x' (caseSensitive) may be used to revert to the default. The default of
 * index is to be placed at the front.
 * 
 * eg. AddExtraParallax Space_parallax x x 3
 * Will do the same as the last example.
 * 
 * To remove an ExtraParallax, use the Plugin Command
 * RemoveExtraParallax index
 * 
 * index functions identically to before, but does not default.
 * 
 * A reminder that adding and removing parallaxes will shift the index of the other parallaxes.
 * 
 * Lastly, a note that ZeroParallaxes (parallaxes that begin with a ! which stay aligned with the map rather
 * than the camera) are supported by this plugin.
 * 
*/

Spriteset_Map.prototype.createParallax = function() {
  this._parallax = new TilingSprite();
  this._parallax.move(0, 0, Graphics.width, Graphics.height);
  this._baseSprite.addChild(this._parallax);
  this._extraParallaxes = new Sprite();
  if ($dataMap.metaArray && $dataMap.metaArray["ExtraParallax"]) {
    for (let i = 0; i < $dataMap.metaArray["ExtraParallax"].length; i++) {
      let data = $dataMap.metaArray["ExtraParallax"][i];
      this.createExtraParallax(data.split(",").map(a=>a.trim()),i);
    };
  };
  this._baseSprite.addChild(this._extraParallaxes);
};

Spriteset_Map.prototype.createExtraParallax = function(array,index) {
  let parallax = new TilingSprite(ImageManager.loadParallax(String(array[0])));
  parallax._name    = String(array[0]);
  parallax.alpha    = typeof array[1] !== "undefined" ? Number(array[1])/255 : 1;
  parallax._scrollX = typeof array[2] !== "undefined" ? Number(array[2]) : 0;
  parallax._scrollY = typeof array[3] !== "undefined" ? Number(array[3]) : 0;
  parallax._shiftX  = typeof array[4] !== "undefined" ? Number(array[4]) : 1;
  parallax._shiftY  = typeof array[5] !== "undefined" ? Number(array[5]) : 1;
  parallax._scroll = {x:0,y:0};
  parallax.move(0, 0, Graphics.width, Graphics.height);
  if (isFinite(index)) {
    this._extraParallaxes.addChildAt(parallax,index);
  } else {
    this._extraParallaxes.addChild(parallax);
  }
};

Spriteset_Map.prototype.updateParallax = function() {
    if (this._parallaxName !== $gameMap.parallaxName()) {
        this._parallaxName = $gameMap.parallaxName();

        if (this._parallax.bitmap && Graphics.isWebGL() != true) {
            this._canvasReAddParallax();
        } else {
            this._parallax.bitmap = ImageManager.loadParallax(this._parallaxName);
        }
    }
    if (this._parallax.bitmap) {
        this._parallax.origin.x = $gameMap.parallaxOx();
        this._parallax.origin.y = $gameMap.parallaxOy();
    }
    if (this._extraParallaxes) {
      this.updateExtraParallaxes();
    }
};

Spriteset_Map.prototype.updateExtraParallaxes = function() {
  for (const parallax of this._extraParallaxes.children) {
    console.log(parallax.origin);
    parallax._scroll.x = (parallax._scroll.x + parallax._scrollX) % parallax.bitmap.width;
    parallax._scroll.y = (parallax._scroll.y + parallax._scrollY) % parallax.bitmap.height;
    if (!ImageManager.isZeroParallax(parallax._name)) {
      parallax.origin.x = ($gameMap.tileWidth() * parallax._shiftX) + parallax._scroll.x;
      parallax.origin.y = ($gameMap.tileHeight() * parallax._shiftY) + parallax._scroll.y;
    } else {
      parallax.origin.x = ($gameMap.displayX() * ($gameMap.tileWidth() * parallax._shiftX)) + parallax._scroll.x;
      parallax.origin.y = ($gameMap.displayY() * ($gameMap.tileHeight() * parallax._shiftY)) + parallax._scroll.y;
    };
  };
};

TR.MP.pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(cmd,args) {
  if (cmd && cmd.toLowerCase() === "addextraparallax" && SceneManager._scene instanceof Scene_Map) {
    SceneManager._scene._spriteset.createExtraParallax(args.map(a=>{a.trim();a.replace("x",undefined)}),args[6]);
  } else if (cmd && cmd.toLowerCase() === "removeextraparallax" && SceneManager._scene instanceof Scene_Map) {
    SceneManager._scene._spriteset._extraParallaxes.removeChildAt(args[0])
  } else {
    TR.MP.pluginCommand.call(this,cmd,args);
  };
};