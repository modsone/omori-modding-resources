// ================================================================================
// MIT License - Vincent Garreau - particles.js
// ================================================================================
/*
The MIT License (MIT)

Copyright (c) 2015, Vincent Garreau

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// ================================================================================
// MIT License - TrophicRain - TRain_ParticlesJS.js
// ================================================================================
/*
The MIT License (MIT)
Copyright (c) 2025 TrophicRain
Permission is hereby granted, ...(same as the lengthy paragraph above ^_^), ...IN THE SOFTWARE.
This project is based on particles.js (Vincent Garreau, MIT License). I extended it for use with RPGMaker MV.
*/










/*:
 * @plugindesc particles.js particle effects v1.1
 * @author Vincent Garreau (particles.js), TrophicRain (this plugin), TomatoRadio (plugin command)
 * 
 * @help
 * This plugin provides Sprite_pJS class to display the particle effects of particles.js.
 * 
 * ------------------------------------------------------------------------------
 * [Main functions]
 * new Sprite_pJS(json, width, height)
 *   width, height: optional parameters, default to the width and height of the screen
 *   Create a particle layer Sprite with json as the parameter. The original pJS element is in sprite.pJS_element.
 * 
 * sprite_pjs.set_follow_map(follow_ratio_x, follow_ratio_y, offset_x, offset_y)
 *   follow_ratio_x/y: e.g. if follow_ratio is 2, map moves 1 grid -> sprite moves 2 grids
 *   offset_x/y: optional parameter, offset relative to the upper left corner of the map, default is 0
 *   Make sprite_pjs follow the map. It can produce the effect of close view/distant view. (only applicable to non-looping maps)
 * 
 * TR_pJS.map_layers.push({ sprite, on_recover })
 * 　sprite: element to be retained on the map
 *   on_recover: method to restore sprite to the map, e.g. function(scene_map, sprite){ scene_map.addChild(sprite); }
 *   Make the sprite stay on the map when returning to Scene_Map from other Scene (such as Scene_Menu). (invalidated when leaving the local map)
 * 
 * 
 * [Helper functions]
 * TR_pJS.load_json(filename)
 *   Loads data/TR_particles/filename.json to TR_pJS.jsons[filename]。
 *   Note that this operation takes some time, and the game will continue to run before loading is complete. Please load it in advance before use.
 * 
 * TR_pJS.map_layer_width(follow_ratio_x), map_layer_height(follow_ratio_y)
 *   follow_ratio_x/y: the ratio of moving with the map, the default is 1
 *   Given follow_ratio, calculate the width and height required to fill the current map (unit: pixel)
 * 
 * 
 * [Parameter Description]
 * Particle_Jsons: Particle json loaded immediately when the game starts.
 * 
 * [Usage example]
 * Event EV001 - Trigger: Autorun
 * ◆Comment: Insert a particle layer which moves with the map.
 *          : This event is executed every time entering the current map.
 * ◆Script:
 * var follow_ratio = 0.5;
 * var json = TR_pJS.jsons['example'];
 * var width = TR_pJS.map_layer_width(follow_ratio);
 * var height = TR_pJS.map_layer_height(follow_ratio);
 * var sprite_pjs = new Sprite_pJS(json, width, height);
 * var add_to_map = function(scene_map, sprite){
 *     var base_sprite = scene_map._spriteset._baseSprite;
 *     var insert_index = 2; // above parallax, under tilemap
 *     base_sprite.addChildAt(sprite_pjs, insert_index);
 * };
 * TR_pJS.map_layers.push({sprite: sprite_pjs, on_recover: add_to_map});
 * add_to_map(SceneManager._scene, sprite_pjs);
 * ◆Erase Event
 * 
 * ------------------------------------------------------------------------------
 * 
 * [RMMV default function override]
 * extends:
 *   SceneManager.updateInputData()
 *   Scene_Map.createDisplayObjects()
 * 
 * [Performance test]
 * - Place 20 particle layer on the map, and repeatedly exit and enter the map to create layers again.
 *   Found that the memory usage is automatically released after reaching about 2GB at most, and no memory leak was found.
 * - The game will lag when there are too many particles at the same time, so please don't create too many particles.
 * 
 * [License]
 * Both Vincent Garreau's particles.js, and my plugin TRain_ParticlesJS.js, use the MIT License.
 * See the beginning of the source code for details.
 * 
 * ------------------------------------------------------------------------------
 * 
 * [v1.1 Note about persistence]
 * 
 * The plugin itself doesn't support storing the particles layer persistently.
 * (if you save game and load, it disappears)
 * This is on purpose because I can't assume where would you like to put the layer in
 * (e.g. in SceneManager._scene_spriteset._tilemap, or _spriteset._baseSprite, or somewhere else)
 * If you need that, you need to extend Spriteset_Map by yourself
 * (which basically makes TR_pJS.map_layers.push({sprite, on_recover}) unnecessary.
 * it's still useful if you don't have a save point in the map, can save you some effort)
 * 
 * Like this:
 * var old_Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
 * Spriteset_Map.prototype.createLowerLayer = function() {
 *     old_Spriteset_Map_createLowerLayer.call(this);
 *     
 *     // create particle layer for map 1
 *     if ($gameMap.mapId() === 1) this.createParticleLayer();
 * };
 * 
 * Spriteset_Map.prototype.createParticleLayer = function() {
 *     var json;    // get your json here
 *     this._particle_layer = new Sprite_pJS(json, TR_pJS.map_layer_width(1), TR_pJS.map_layer_height(1));
 *     this._particle_layer.set_follow_map(1, 1);
 * };
 * 
 * And now the layer keeps if you save and load the game.
 * In this case, there's no need to (i mean, don't) use the example event.
 * 
 * 
 * ------------------------------------------------------------------------------
 * 
 * [Update history]
 * v1.1
 *   Added plugin commands (thanks to TomatoRadio!)
 *   Updated documentation
 * 
 *   Plugin Command:
 *   trainparticles <json> <index> <follow_ratio_X> <follow_ratio_Y>
 *   insert a particle layer at SceneManager._scene._spriteset._baseSprite[index]
 * 
 * 
 * 
 * 
 * @param Particle_Jsons
 * @desc Preloaded particle json, placed in the data/TR_particles folder, accessed through TR_pJS.jsons[filename]. Enter only the file name (without .json).
 * @type text[]
 * @require 1
 * 
 */



var TR_pJS = {};
TR_pJS._stored = {};
TR_pJS._params = PluginManager.parameters('TRain_ParticlesJS');
TR_pJS._params.Particle_Jsons = JSON.parse(TR_pJS._params.Particle_Jsons);



// ===============================================================================
// Plugin Commands (from TomatoRadio)
// ===============================================================================

let old_plugincommandparticles = Game_Interpreter.prototype.pluginCommand
Game_Interpreter.prototype.pluginCommand = function(command, args) {
  switch (command.toLowerCase()) {
    case 'trainparticles':
      this.handleTRainParticleArgs(args[0],Number(args[1]),Number(args[2]),Number(args[3]))
      return;
  }
  //Do old plugin command
  return old_plugincommandparticles.call(this,command,args);
};

Game_Interpreter.prototype.handleTRainParticleArgs = function(json,index = 3,follow_ratio_X = 0,follow_ratio_Y = follow_ratio_X) {
  //Catch dummies
  if (json === undefined) {
    console.log(`PluginCommand: TRainParticles lacks any arguements. No scripts ran.`)
  }
  //Perform Script
  json = TR_pJS.jsons[json];
  var width = TR_pJS.map_layer_width(follow_ratio_X);
  var height = TR_pJS.map_layer_height(follow_ratio_Y);
  var sprite_pjs = new Sprite_pJS(json, width, height);
  var add_to_map = function(scene_map, sprite){
    var base_sprite = scene_map._spriteset._baseSprite;
    var insert_index = index;
    base_sprite.addChildAt(sprite_pjs, insert_index);
  };
  TR_pJS.map_layers.push({sprite: sprite_pjs, on_recover: add_to_map});
  add_to_map(SceneManager._scene, sprite_pjs);
};






// ================================================================================
// Helper function: Loads .json to TR_pJS.jsons[filename]
// ================================================================================
TR_pJS.jsons = {};

TR_pJS.load_json = function(filename){
    var path = 'data/TR_particles/' + filename + '.json';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path);
    xhr.overrideMimeType('application/json');
    xhr.onload = function(){
        if (xhr.status < 400){
            TR_pJS.jsons[filename] = JSON.parse(xhr.responseText);
        }
    };
    xhr.onerror = function(){
        console.warn('TR_pJS.load_json(): failed to load ' + filename + '.json');
    };
    xhr.send();
};

for (var i = 0; i < TR_pJS._params.Particle_Jsons.length; i++){
    TR_pJS.load_json(TR_pJS._params.Particle_Jsons[i]);
}




// ================================================================================
// Helper function: Given the "layer: map" movement ratio, calculate the width and height required to fill the current map (unit: pixel)
// ================================================================================
TR_pJS.map_layer_width = function(follow_ratio_x){
    follow_ratio_x = follow_ratio_x || 1;
    var map_width = $gameMap.width() * $gameMap.tileWidth();
    var screen_width = Graphics.width;

    if (map_width <= screen_width){
        return screen_width;
    } else {
        var excess = map_width - screen_width;
        return screen_width + excess * follow_ratio_x;
    }
};

TR_pJS.map_layer_height = function(follow_ratio_y){
    follow_ratio_y = follow_ratio_y || 1;
    var map_height = $gameMap.height() * $gameMap.tileHeight();
    var screen_height = Graphics.height;

    if (map_height <= screen_height){
        return screen_height;
    } else {
        var excess = map_height - screen_height;
        return screen_height + excess * follow_ratio_y;
    };
};





// ================================================================================
// Supporting function: mouse status, used for interactivity.events event triggering
// ================================================================================
// [NOTE] Each pJS no longer addEventListener separately, TR_pJS.mouse broadcasts the mouse status uniformly, _pJS_trigger_events() checks
// Deleted resize event it for brevity

TR_pJS.mouse = { x: -1, y: -1, on_screen: false, click: false };
TR_pJS._mouse_next = { x: -1, y: -1, on_screen: false, click: false };

document.addEventListener('mousemove', function(event){
    TR_pJS._mouse_next.x = event.pageX;
    TR_pJS._mouse_next.y = event.pageY;
    TR_pJS._mouse_next.on_screen = true;
});
document.addEventListener('mouseleave', function(){
    TR_pJS._mouse_next.on_screen = false;
});
document.addEventListener('click', function(){
    TR_pJS._mouse_next.click = true;
});

TR_pJS.update_mouse = function(){
    TR_pJS.mouse.x = TR_pJS._mouse_next.x;
    TR_pJS.mouse.y = TR_pJS._mouse_next.y;
    TR_pJS.mouse.on_screen = TR_pJS._mouse_next.on_screen;
    TR_pJS.mouse.click = TR_pJS._mouse_next.click;

    TR_pJS._mouse_next.click = false;
};

TR_pJS._stored.updateInputData = SceneManager.updateInputData;
SceneManager.updateInputData = function() {
    TR_pJS._stored.updateInputData.call(this);
    TR_pJS.update_mouse();
};






// ================================================================================
// Core function: Sprite_pJS
// ================================================================================
function Sprite_pJS(){
    this.initialize.apply(this, arguments);
}
Sprite_pJS.prototype = Object.create(Sprite.prototype);
Sprite_pJS.prototype.constructor = Sprite_pJS;

Sprite_pJS.prototype.initialize = function(json, width, height){
    width = width || Graphics.width;
    height = height || Graphics.height;

    var bitmap = new Bitmap(width, height);
    Sprite.prototype.initialize.call(this, bitmap);

    this.update = function(){
        Sprite.prototype.update.call(this);
        this._pJS_trigger_events();
        if (this._pJS_update_check) this.pJS_element.pJS.fn.vendors.checkBeforeDraw();
        if (this._pJS_update_draw) this.pJS_element.pJS.fn.vendors.draw();
        this.bitmap._setDirty();
    };

    this._pJS_listeners = {};
    this._pJS_update_check = false;
    this._pJS_update_draw = false;

    this.pJS_element = new pJS(bitmap._canvas, json, this);
};




// Mouse position on screen -> position on Sprite
// The x coordinate does not use this.worldTransform.tx, because updateTransform is performed during render(), having a delay
Sprite_pJS.prototype._page_to_local_unscaled_x = function(pageX){
    var scale = this.scale.x;
    var x = this.x;
    var node = this.parent || null;
    while (node) {
        scale *= node.scale.x;
        x = x * node.scale.x + node.x;
        node = node.parent;
    }
    return (Graphics.pageToCanvasX(pageX) - x) / scale;
};
Sprite_pJS.prototype._page_to_local_unscaled_y = function(pageY){
    var scale = this.scale.y;
    var y = this.y;
    var node = this.parent || null;
    while (node) {
        scale *= node.scale.y;
        y = y * node.scale.y + node.y;
        node = node.parent;
    }
    return (Graphics.pageToCanvasY(pageY) - y) / scale;
};


Sprite_pJS.prototype._pJS_trigger_events = function(){
    // pJS has onhover -> listeners have mousemove, mouseleave
    // pJS has onclick -> listeners have mousemove, mouseleave, click
    if (!this._pJS_listeners.mousemove) return;

    var mouse_x = -1;
    var mouse_y = -1;
    var on_sprite = TR_pJS.mouse.on_screen;

    if (on_sprite){
        mouse_x = this._page_to_local_unscaled_x(TR_pJS.mouse.x);
        mouse_y = this._page_to_local_unscaled_y(TR_pJS.mouse.y);

        if (this.pJS_element.pJS.interactivity.detect_on != 'window'){  // detect on "canvas" (sprite)
            on_sprite = mouse_x >= 0 && mouse_x < this.width && mouse_y >= 0 && mouse_y < this.height
            && Graphics.isInsideCanvas(Graphics.pageToCanvasX(TR_pJS.mouse.x), Graphics.pageToCanvasY(TR_pJS.mouse.y));
        }
    }

    if (on_sprite){
        this._pJS_listeners.mousemove(mouse_x, mouse_y);
        if (this._pJS_listeners.click && TR_pJS.mouse.click) this._pJS_listeners.click();
    } else {
        this._pJS_listeners.mouseleave();
    }
};






// ================================================================================
// Main function: bind Sprite_pJS position to the map (not suitable for looping maps)
// ================================================================================
Sprite_pJS.prototype.set_follow_map = function(follow_ratio_x, follow_ratio_y, offset_x, offset_y){
    this._follow_ratio_x = follow_ratio_x || 1;
    this._follow_ratio_y = follow_ratio_y || follow_ratio_x;
    this._map_offset_x = offset_x || 0;
    this._map_offset_y = offset_y || 0;

    this._map_to_screen_x = function(){
        var map_x = -($gameMap.displayX() * $gameMap.tileWidth());
        return this._map_offset_x + map_x * this._follow_ratio_x;
    };
    this._map_to_screen_y = function(){
        var map_y = -($gameMap.displayY() * $gameMap.tileHeight());
        return this._map_offset_y + map_y * this._follow_ratio_y;
    };

    this._pJS_stored_update = this.update;
    this.update = function(){
        this.x = this._map_to_screen_x();
        this.y = this._map_to_screen_y();
        this._pJS_stored_update.call(this);
    }
};





// ================================================================================
// Main function: Leave the Sprite on the map and restore it when returning from other Scenes (invalidated when leaving the local map)
// ================================================================================
TR_pJS.map_layers = [];
// { sprite: Sprite, on_recover: function(scene_map, sprite) }

TR_pJS._last_mapId = -1;

TR_pJS._stored.createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
Scene_Map.prototype.createDisplayObjects = function(){
    TR_pJS._stored.createDisplayObjects.call(this);
    TR_pJS._recover_map_layers(this);
};

TR_pJS._recover_map_layers = function(scene_map){
    var mapId = $gameMap.mapId();
    if (mapId != TR_pJS._last_mapId){
        TR_pJS.map_layers.splice(0, TR_pJS.map_layers.length);
    } else {
        for (var i = 0; i < TR_pJS.map_layers.length; i++){
            var map_layer = TR_pJS.map_layers[i];
            map_layer.on_recover(scene_map, map_layer.sprite);
        }
    }
    TR_pJS._last_mapId = mapId;
};












// ================================================================================
// particles.js
// ================================================================================

/* -----------------------------------------------
/* Author : Vincent Garreau  - vincentgarreau.com
/* MIT license: http://opensource.org/licenses/MIT
/* Demo / Generator : vincentgarreau.com/particles.js
/* GitHub : github.com/VincentGarreau/particles.js
/* How to use? : Check the GitHub README
/* v2.0.0
/* ----------------------------------------------- */

// [NOTE] Draw directly on the Bitmap canvas, no longer use the offsetWidth/Height of the Dom element
// Use the parent Sprite to control updates and listeners, replacing requestAnimFrame, interactivity.el and addEventListener
var pJS = function (canvas_el, params, sprite) {

    /* particles.js variables with default values */
    this.pJS = {
        canvas: {
            el: canvas_el,
            w: canvas_el.width,
            h: canvas_el.height
        },
        particles: {
            number: {
                value: 400,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#fff'
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#ff0000'
                },
                polygon: {
                    nb_sides: 5
                },
                image: {
                    src: '',
                    width: 100,
                    height: 100
                }
            },
            opacity: {
                value: 1,
                random: false,
                anim: {
                    enable: false,
                    speed: 2,
                    opacity_min: 0,
                    sync: false
                }
            },
            size: {
                value: 20,
                random: false,
                anim: {
                    enable: false,
                    speed: 20,
                    size_min: 0,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 100,
                color: '#fff',
                opacity: 1,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 3000,
                    rotateY: 3000
                }
            },
            array: []
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 100,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 200,
                    size: 80,
                    duration: 0.4
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            },
            mouse: {}
        },
        retina_detect: false,
        fn: {
            interact: {},
            modes: {},
            vendors: {}
        },
        tmp: {}
    };

    var pJS = this.pJS;

    /* params settings */
    if (params) {
        TR_pJS._deepExtend(pJS, params);
    }

    // [NOTE] Parameter changes for RPGMaker MV
    // The pJS canvas is not displayed directly but on the Sprite, so retina-detect of devicePixelRatio may cause side effects
    // Users can generate too many particles when interactivity.events.onclick.mode = 'push'
    if (pJS.retina_detect == true){
        console.warn('new Sprite_pJS(): retina_detect=true causes abnormal display. changed to false');
        pJS.retina_detect = false;
    }
    if (pJS.interactivity.events.onclick.mode == 'push'){
        console.warn('new Sprite_pJS(): when onclick.mode="push", users can click frequently to crash the game. changed to "repulse"');
        pJS.interactivity.events.onclick.mode = 'repulse';
    }
    if (pJS.interactivity.events.resize == true){
        console.warn('new Sprite_pJS(): resize event is removed and will not take effect');
    }

    pJS.tmp.obj = {
        size_value: pJS.particles.size.value,
        size_anim_speed: pJS.particles.size.anim.speed,
        move_speed: pJS.particles.move.speed,
        line_linked_distance: pJS.particles.line_linked.distance,
        line_linked_width: pJS.particles.line_linked.width,
        mode_grab_distance: pJS.interactivity.modes.grab.distance,
        mode_bubble_distance: pJS.interactivity.modes.bubble.distance,
        mode_bubble_size: pJS.interactivity.modes.bubble.size,
        mode_repulse_distance: pJS.interactivity.modes.repulse.distance
    };


    pJS.fn.retinaInit = function () {

        if (pJS.retina_detect && window.devicePixelRatio > 1) {
            pJS.canvas.pxratio = window.devicePixelRatio;
            pJS.tmp.retina = true;
        }
        else {
            pJS.canvas.pxratio = 1;
            pJS.tmp.retina = false;
        }

        pJS.canvas.w = pJS.canvas.el.width * pJS.canvas.pxratio;
        pJS.canvas.h = pJS.canvas.el.height * pJS.canvas.pxratio;

        pJS.particles.size.value = pJS.tmp.obj.size_value * pJS.canvas.pxratio;
        pJS.particles.size.anim.speed = pJS.tmp.obj.size_anim_speed * pJS.canvas.pxratio;
        pJS.particles.move.speed = pJS.tmp.obj.move_speed * pJS.canvas.pxratio;
        pJS.particles.line_linked.distance = pJS.tmp.obj.line_linked_distance * pJS.canvas.pxratio;
        pJS.interactivity.modes.grab.distance = pJS.tmp.obj.mode_grab_distance * pJS.canvas.pxratio;
        pJS.interactivity.modes.bubble.distance = pJS.tmp.obj.mode_bubble_distance * pJS.canvas.pxratio;
        pJS.particles.line_linked.width = pJS.tmp.obj.line_linked_width * pJS.canvas.pxratio;
        pJS.interactivity.modes.bubble.size = pJS.tmp.obj.mode_bubble_size * pJS.canvas.pxratio;
        pJS.interactivity.modes.repulse.distance = pJS.tmp.obj.mode_repulse_distance * pJS.canvas.pxratio;

    };



    /* ---------- pJS functions - canvas ------------ */

    pJS.fn.canvasInit = function () {
        pJS.canvas.ctx = pJS.canvas.el.getContext('2d');
    };

    pJS.fn.canvasSize = function () {

        pJS.canvas.el.width = pJS.canvas.w;
        pJS.canvas.el.height = pJS.canvas.h;

        if (pJS && pJS.interactivity.events.resize) {

            sprite._pJS_listeners.resize = function() {

                pJS.canvas.w = pJS.canvas.el.width;
                pJS.canvas.h = pJS.canvas.el.height;

                /* resize canvas */
                if (pJS.tmp.retina) {
                    pJS.canvas.w *= pJS.canvas.pxratio;
                    pJS.canvas.h *= pJS.canvas.pxratio;
                }

                pJS.canvas.el.width = pJS.canvas.w;
                pJS.canvas.el.height = pJS.canvas.h;

                /* repaint canvas on anim disabled */
                if (!pJS.particles.move.enable) {
                    pJS.fn.particlesEmpty();
                    pJS.fn.particlesCreate();
                    pJS.fn.particlesDraw();
                    pJS.fn.vendors.densityAutoParticles();
                }

                /* density particles enabled */
                pJS.fn.vendors.densityAutoParticles();

            };

        }

    };


    pJS.fn.canvasPaint = function () {
        pJS.canvas.ctx.fillRect(0, 0, pJS.canvas.w, pJS.canvas.h);
    };

    pJS.fn.canvasClear = function () {
        pJS.canvas.ctx.clearRect(0, 0, pJS.canvas.w, pJS.canvas.h);
    };


    /* --------- pJS functions - particles ----------- */

    pJS.fn.particle = function (color, opacity, position) {

        /* size */
        this.radius = (pJS.particles.size.random ? Math.random() : 1) * pJS.particles.size.value;
        if (pJS.particles.size.anim.enable) {
            this.size_status = false;
            this.vs = pJS.particles.size.anim.speed / 100;
            if (!pJS.particles.size.anim.sync) {
                this.vs = this.vs * Math.random();
            }
        }

        /* position */
        this.x = position ? position.x : Math.random() * pJS.canvas.w;
        this.y = position ? position.y : Math.random() * pJS.canvas.h;

        /* check position  - into the canvas */
        if (this.x > pJS.canvas.w - this.radius * 2) this.x = this.x - this.radius;
        else if (this.x < this.radius * 2) this.x = this.x + this.radius;
        if (this.y > pJS.canvas.h - this.radius * 2) this.y = this.y - this.radius;
        else if (this.y < this.radius * 2) this.y = this.y + this.radius;

        /* check position - avoid overlap */
        if (pJS.particles.move.bounce) {
            pJS.fn.vendors.checkOverlap(this, position);
        }

        /* color */
        this.color = {};
        if (typeof (color.value) == 'object') {

            if (color.value instanceof Array) {
                var color_selected = color.value[Math.floor(Math.random() * pJS.particles.color.value.length)];
                this.color.rgb = TR_pJS._hexToRgb(color_selected);
            } else {
                if (color.value.r != undefined && color.value.g != undefined && color.value.b != undefined) {
                    this.color.rgb = {
                        r: color.value.r,
                        g: color.value.g,
                        b: color.value.b
                    }
                }
                if (color.value.h != undefined && color.value.s != undefined && color.value.l != undefined) {
                    this.color.hsl = {
                        h: color.value.h,
                        s: color.value.s,
                        l: color.value.l
                    }
                }
            }

        }
        else if (color.value == 'random') {
            this.color.rgb = {
                r: (Math.floor(Math.random() * (255 - 0 + 1)) + 0),
                g: (Math.floor(Math.random() * (255 - 0 + 1)) + 0),
                b: (Math.floor(Math.random() * (255 - 0 + 1)) + 0)
            }
        }
        else if (typeof (color.value) == 'string') {
            this.color = color;
            this.color.rgb = TR_pJS._hexToRgb(this.color.value);
        }

        /* opacity */
        this.opacity = (pJS.particles.opacity.random ? Math.random() : 1) * pJS.particles.opacity.value;
        if (pJS.particles.opacity.anim.enable) {
            this.opacity_status = false;
            this.vo = pJS.particles.opacity.anim.speed / 100;
            if (!pJS.particles.opacity.anim.sync) {
                this.vo = this.vo * Math.random();
            }
        }

        /* animation - velocity for speed */
        var velbase = {}
        switch (pJS.particles.move.direction) {
            case 'top':
                velbase = { x: 0, y: -1 };
                break;
            case 'top-right':
                velbase = { x: 0.5, y: -0.5 };
                break;
            case 'right':
                velbase = { x: 1, y: -0 };
                break;
            case 'bottom-right':
                velbase = { x: 0.5, y: 0.5 };
                break;
            case 'bottom':
                velbase = { x: 0, y: 1 };
                break;
            case 'bottom-left':
                velbase = { x: -0.5, y: 1 };
                break;
            case 'left':
                velbase = { x: -1, y: 0 };
                break;
            case 'top-left':
                velbase = { x: -0.5, y: -0.5 };
                break;
            default:
                velbase = { x: 0, y: 0 };
                break;
        }

        if (pJS.particles.move.straight) {
            this.vx = velbase.x;
            this.vy = velbase.y;
            if (pJS.particles.move.random) {
                this.vx = this.vx * (Math.random());
                this.vy = this.vy * (Math.random());
            }
        } else {
            this.vx = velbase.x + Math.random() - 0.5;
            this.vy = velbase.y + Math.random() - 0.5;
        }

        // var theta = 2.0 * Math.PI * Math.random();
        // this.vx = Math.cos(theta);
        // this.vy = Math.sin(theta);

        this.vx_i = this.vx;
        this.vy_i = this.vy;



        /* if shape is image */

        var shape_type = pJS.particles.shape.type;
        if (typeof (shape_type) == 'object') {
            if (shape_type instanceof Array) {
                var shape_selected = shape_type[Math.floor(Math.random() * shape_type.length)];
                this.shape = shape_selected;
            }
        } else {
            this.shape = shape_type;
        }

        if (this.shape == 'image') {
            var sh = pJS.particles.shape;
            this.img = {
                src: sh.image.src,
                ratio: sh.image.width / sh.image.height
            }
            if (!this.img.ratio) this.img.ratio = 1;
            if (pJS.tmp.img_type == 'svg' && pJS.tmp.source_svg != undefined) {
                pJS.fn.vendors.createSvgImg(this);
                if (pJS.tmp.pushing) {
                    this.img.loaded = false;
                }
            }
        }



    };


    pJS.fn.particle.prototype.draw = function () {

        var p = this;

        if (p.radius_bubble != undefined) {
            var radius = p.radius_bubble;
        } else {
            var radius = p.radius;
        }

        if (p.opacity_bubble != undefined) {
            var opacity = p.opacity_bubble;
        } else {
            var opacity = p.opacity;
        }

        if (p.color.rgb) {
            var color_value = 'rgba(' + p.color.rgb.r + ',' + p.color.rgb.g + ',' + p.color.rgb.b + ',' + opacity + ')';
        } else {
            var color_value = 'hsla(' + p.color.hsl.h + ',' + p.color.hsl.s + '%,' + p.color.hsl.l + '%,' + opacity + ')';
        }

        pJS.canvas.ctx.fillStyle = color_value;
        pJS.canvas.ctx.beginPath();

        switch (p.shape) {

            case 'circle':
                pJS.canvas.ctx.arc(p.x, p.y, radius, 0, Math.PI * 2, false);
                break;

            case 'edge':
                pJS.canvas.ctx.rect(p.x - radius, p.y - radius, radius * 2, radius * 2);
                break;

            case 'triangle':
                pJS.fn.vendors.drawShape(pJS.canvas.ctx, p.x - radius, p.y + radius / 1.66, radius * 2, 3, 2);
                break;

            case 'polygon':
                pJS.fn.vendors.drawShape(
                    pJS.canvas.ctx,
                    p.x - radius / (pJS.particles.shape.polygon.nb_sides / 3.5), // startX
                    p.y - radius / (2.66 / 3.5), // startY
                    radius * 2.66 / (pJS.particles.shape.polygon.nb_sides / 3), // sideLength
                    pJS.particles.shape.polygon.nb_sides, // sideCountNumerator
                    1 // sideCountDenominator
                );
                break;

            case 'star':
                pJS.fn.vendors.drawShape(
                    pJS.canvas.ctx,
                    p.x - radius * 2 / (pJS.particles.shape.polygon.nb_sides / 4), // startX
                    p.y - radius / (2 * 2.66 / 3.5), // startY
                    radius * 2 * 2.66 / (pJS.particles.shape.polygon.nb_sides / 3), // sideLength
                    pJS.particles.shape.polygon.nb_sides, // sideCountNumerator
                    2 // sideCountDenominator
                );
                break;

            case 'image':

                function draw() {
                    pJS.canvas.ctx.drawImage(
                        img_obj,
                        p.x - radius,
                        p.y - radius,
                        radius * 2,
                        radius * 2 / p.img.ratio
                    );
                }

                if (pJS.tmp.img_type == 'svg') {
                    var img_obj = p.img.obj;
                } else {
                    var img_obj = pJS.tmp.img_obj;
                }

                if (img_obj) {
                    draw();
                }

                break;

        }

        pJS.canvas.ctx.closePath();

        if (pJS.particles.shape.stroke.width > 0) {
            pJS.canvas.ctx.strokeStyle = pJS.particles.shape.stroke.color;
            pJS.canvas.ctx.lineWidth = pJS.particles.shape.stroke.width;
            pJS.canvas.ctx.stroke();
        }

        pJS.canvas.ctx.fill();

    };


    pJS.fn.particlesCreate = function () {
        for (var i = 0; i < pJS.particles.number.value; i++) {
            pJS.particles.array.push(new pJS.fn.particle(pJS.particles.color, pJS.particles.opacity.value));
        }
    };

    pJS.fn.particlesUpdate = function () {

        for (var i = 0; i < pJS.particles.array.length; i++) {

            /* the particle */
            var p = pJS.particles.array[i];

            // var d = ( dx = pJS.interactivity.mouse.click_pos_x - p.x ) * dx + ( dy = pJS.interactivity.mouse.click_pos_y - p.y ) * dy;
            // var f = -BANG_SIZE / d;
            // if ( d < BANG_SIZE ) {
            //     var t = Math.atan2( dy, dx );
            //     p.vx = f * Math.cos(t);
            //     p.vy = f * Math.sin(t);
            // }

            /* move the particle */
            if (pJS.particles.move.enable) {
                var ms = pJS.particles.move.speed / 2;
                p.x += p.vx * ms;
                p.y += p.vy * ms;
            }

            /* change opacity status */
            if (pJS.particles.opacity.anim.enable) {
                if (p.opacity_status == true) {
                    if (p.opacity >= pJS.particles.opacity.value) p.opacity_status = false;
                    p.opacity += p.vo;
                } else {
                    if (p.opacity <= pJS.particles.opacity.anim.opacity_min) p.opacity_status = true;
                    p.opacity -= p.vo;
                }
                if (p.opacity < 0) p.opacity = 0;
            }

            /* change size */
            if (pJS.particles.size.anim.enable) {
                if (p.size_status == true) {
                    if (p.radius >= pJS.particles.size.value) p.size_status = false;
                    p.radius += p.vs;
                } else {
                    if (p.radius <= pJS.particles.size.anim.size_min) p.size_status = true;
                    p.radius -= p.vs;
                }
                if (p.radius < 0) p.radius = 0;
            }

            /* change particle position if it is out of canvas */
            if (pJS.particles.move.out_mode == 'bounce') {
                var new_pos = {
                    x_left: p.radius,
                    x_right: pJS.canvas.w,
                    y_top: p.radius,
                    y_bottom: pJS.canvas.h
                }
            } else {
                var new_pos = {
                    x_left: -p.radius,
                    x_right: pJS.canvas.w + p.radius,
                    y_top: -p.radius,
                    y_bottom: pJS.canvas.h + p.radius
                }
            }

            if (p.x - p.radius > pJS.canvas.w) {
                p.x = new_pos.x_left;
                p.y = Math.random() * pJS.canvas.h;
            }
            else if (p.x + p.radius < 0) {
                p.x = new_pos.x_right;
                p.y = Math.random() * pJS.canvas.h;
            }
            if (p.y - p.radius > pJS.canvas.h) {
                p.y = new_pos.y_top;
                p.x = Math.random() * pJS.canvas.w;
            }
            else if (p.y + p.radius < 0) {
                p.y = new_pos.y_bottom;
                p.x = Math.random() * pJS.canvas.w;
            }

            /* out of canvas modes */
            switch (pJS.particles.move.out_mode) {
                case 'bounce':
                    if (p.x + p.radius > pJS.canvas.w) p.vx = -p.vx;
                    else if (p.x - p.radius < 0) p.vx = -p.vx;
                    if (p.y + p.radius > pJS.canvas.h) p.vy = -p.vy;
                    else if (p.y - p.radius < 0) p.vy = -p.vy;
                    break;
            }

            /* events */
            if (TR_pJS._isInArray('grab', pJS.interactivity.events.onhover.mode)) {
                pJS.fn.modes.grabParticle(p);
            }

            if (TR_pJS._isInArray('bubble', pJS.interactivity.events.onhover.mode) || TR_pJS._isInArray('bubble', pJS.interactivity.events.onclick.mode)) {
                pJS.fn.modes.bubbleParticle(p);
            }

            if (TR_pJS._isInArray('repulse', pJS.interactivity.events.onhover.mode) || TR_pJS._isInArray('repulse', pJS.interactivity.events.onclick.mode)) {
                pJS.fn.modes.repulseParticle(p);
            }

            /* interaction auto between particles */
            if (pJS.particles.line_linked.enable || pJS.particles.move.attract.enable) {
                for (var j = i + 1; j < pJS.particles.array.length; j++) {
                    var p2 = pJS.particles.array[j];

                    /* link particles */
                    if (pJS.particles.line_linked.enable) {
                        pJS.fn.interact.linkParticles(p, p2);
                    }

                    /* attract particles */
                    if (pJS.particles.move.attract.enable) {
                        pJS.fn.interact.attractParticles(p, p2);
                    }

                    /* bounce particles */
                    if (pJS.particles.move.bounce) {
                        pJS.fn.interact.bounceParticles(p, p2);
                    }

                }
            }


        }

    };

    pJS.fn.particlesDraw = function () {

        /* clear canvas */
        pJS.canvas.ctx.clearRect(0, 0, pJS.canvas.w, pJS.canvas.h);

        /* update each particles param */
        pJS.fn.particlesUpdate();

        /* draw each particle */
        for (var i = 0; i < pJS.particles.array.length; i++) {
            var p = pJS.particles.array[i];
            p.draw();
        }

    };

    pJS.fn.particlesEmpty = function () {
        pJS.particles.array = [];
    };

    pJS.fn.particlesRefresh = function () {

        /* init all */
        sprite._pJS_update_check = false;
        sprite._pJS_update_draw = false;
        pJS.tmp.source_svg = undefined;
        pJS.tmp.img_obj = undefined;
        pJS.tmp.count_svg = 0;
        pJS.fn.particlesEmpty();
        pJS.fn.canvasClear();

        /* restart */
        pJS.fn.vendors.start();

    };


    /* ---------- pJS functions - particles interaction ------------ */

    pJS.fn.interact.linkParticles = function (p1, p2) {

        var dx = p1.x - p2.x,
            dy = p1.y - p2.y,
            dist = Math.sqrt(dx * dx + dy * dy);

        /* draw a line between p1 and p2 if the distance between them is under the config distance */
        if (dist <= pJS.particles.line_linked.distance) {

            var opacity_line = pJS.particles.line_linked.opacity - (dist / (1 / pJS.particles.line_linked.opacity)) / pJS.particles.line_linked.distance;

            if (opacity_line > 0) {

                /* style */
                var color_line = pJS.particles.line_linked.color_rgb_line;
                pJS.canvas.ctx.strokeStyle = 'rgba(' + color_line.r + ',' + color_line.g + ',' + color_line.b + ',' + opacity_line + ')';
                pJS.canvas.ctx.lineWidth = pJS.particles.line_linked.width;
                //pJS.canvas.ctx.lineCap = 'round'; /* performance issue */

                /* path */
                pJS.canvas.ctx.beginPath();
                pJS.canvas.ctx.moveTo(p1.x, p1.y);
                pJS.canvas.ctx.lineTo(p2.x, p2.y);
                pJS.canvas.ctx.stroke();
                pJS.canvas.ctx.closePath();

            }

        }

    };


    pJS.fn.interact.attractParticles = function (p1, p2) {

        /* condensed particles */
        var dx = p1.x - p2.x,
            dy = p1.y - p2.y,
            dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= pJS.particles.line_linked.distance) {

            var ax = dx / (pJS.particles.move.attract.rotateX * 1000),
                ay = dy / (pJS.particles.move.attract.rotateY * 1000);

            p1.vx -= ax;
            p1.vy -= ay;

            p2.vx += ax;
            p2.vy += ay;

        }


    }


    pJS.fn.interact.bounceParticles = function (p1, p2) {

        var dx = p1.x - p2.x,
            dy = p1.y - p2.y,
            dist = Math.sqrt(dx * dx + dy * dy),
            dist_p = p1.radius + p2.radius;

        if (dist <= dist_p) {
            p1.vx = -p1.vx;
            p1.vy = -p1.vy;

            p2.vx = -p2.vx;
            p2.vy = -p2.vy;
        }

    }


    /* ---------- pJS functions - modes events ------------ */

    pJS.fn.modes.pushParticles = function (nb, pos) {

        pJS.tmp.pushing = true;

        for (var i = 0; i < nb; i++) {
            pJS.particles.array.push(
                new pJS.fn.particle(
                    pJS.particles.color,
                    pJS.particles.opacity.value,
                    {
                        'x': pos ? pos.pos_x : Math.random() * pJS.canvas.w,
                        'y': pos ? pos.pos_y : Math.random() * pJS.canvas.h
                    }
                )
            )
            if (i == nb - 1) {
                if (!pJS.particles.move.enable) {
                    pJS.fn.particlesDraw();
                }
                pJS.tmp.pushing = false;
            }
        }

    };


    pJS.fn.modes.removeParticles = function (nb) {

        pJS.particles.array.splice(0, nb);
        if (!pJS.particles.move.enable) {
            pJS.fn.particlesDraw();
        }

    };


    pJS.fn.modes.bubbleParticle = function (p) {

        /* on hover event */
        if (pJS.interactivity.events.onhover.enable && TR_pJS._isInArray('bubble', pJS.interactivity.events.onhover.mode)) {

            var dx_mouse = p.x - pJS.interactivity.mouse.pos_x,
                dy_mouse = p.y - pJS.interactivity.mouse.pos_y,
                dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse),
                ratio = 1 - dist_mouse / pJS.interactivity.modes.bubble.distance;

            function init() {
                p.opacity_bubble = p.opacity;
                p.radius_bubble = p.radius;
            }

            /* mousemove - check ratio */
            if (dist_mouse <= pJS.interactivity.modes.bubble.distance) {

                if (ratio >= 0 && pJS.interactivity.status == 'mousemove') {

                    /* size */
                    if (pJS.interactivity.modes.bubble.size != pJS.particles.size.value) {

                        if (pJS.interactivity.modes.bubble.size > pJS.particles.size.value) {
                            var size = p.radius + (pJS.interactivity.modes.bubble.size * ratio);
                            if (size >= 0) {
                                p.radius_bubble = size;
                            }
                        } else {
                            var dif = p.radius - pJS.interactivity.modes.bubble.size,
                                size = p.radius - (dif * ratio);
                            if (size > 0) {
                                p.radius_bubble = size;
                            } else {
                                p.radius_bubble = 0;
                            }
                        }

                    }

                    /* opacity */
                    if (pJS.interactivity.modes.bubble.opacity != pJS.particles.opacity.value) {

                        if (pJS.interactivity.modes.bubble.opacity > pJS.particles.opacity.value) {
                            var opacity = pJS.interactivity.modes.bubble.opacity * ratio;
                            if (opacity > p.opacity && opacity <= pJS.interactivity.modes.bubble.opacity) {
                                p.opacity_bubble = opacity;
                            }
                        } else {
                            var opacity = p.opacity - (pJS.particles.opacity.value - pJS.interactivity.modes.bubble.opacity) * ratio;
                            if (opacity < p.opacity && opacity >= pJS.interactivity.modes.bubble.opacity) {
                                p.opacity_bubble = opacity;
                            }
                        }

                    }

                }

            } else {
                init();
            }


            /* mouseleave */
            if (pJS.interactivity.status == 'mouseleave') {
                init();
            }

        }

        /* on click event */
        else if (pJS.interactivity.events.onclick.enable && TR_pJS._isInArray('bubble', pJS.interactivity.events.onclick.mode)) {


            if (pJS.tmp.bubble_clicking) {
                var dx_mouse = p.x - pJS.interactivity.mouse.click_pos_x,
                    dy_mouse = p.y - pJS.interactivity.mouse.click_pos_y,
                    dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse),
                    time_spent = (new Date().getTime() - pJS.interactivity.mouse.click_time) / 1000;

                if (time_spent > pJS.interactivity.modes.bubble.duration) {
                    pJS.tmp.bubble_duration_end = true;
                }

                if (time_spent > pJS.interactivity.modes.bubble.duration * 2) {
                    pJS.tmp.bubble_clicking = false;
                    pJS.tmp.bubble_duration_end = false;
                }
            }


            function process(bubble_param, particles_param, p_obj_bubble, p_obj, id) {

                if (bubble_param != particles_param) {

                    if (!pJS.tmp.bubble_duration_end) {
                        if (dist_mouse <= pJS.interactivity.modes.bubble.distance) {
                            if (p_obj_bubble != undefined) var obj = p_obj_bubble;
                            else var obj = p_obj;
                            if (obj != bubble_param) {
                                var value = p_obj - (time_spent * (p_obj - bubble_param) / pJS.interactivity.modes.bubble.duration);
                                if (id == 'size') p.radius_bubble = value;
                                if (id == 'opacity') p.opacity_bubble = value;
                            }
                        } else {
                            if (id == 'size') p.radius_bubble = undefined;
                            if (id == 'opacity') p.opacity_bubble = undefined;
                        }
                    } else {
                        if (p_obj_bubble != undefined) {
                            var value_tmp = p_obj - (time_spent * (p_obj - bubble_param) / pJS.interactivity.modes.bubble.duration),
                                dif = bubble_param - value_tmp;
                            value = bubble_param + dif;
                            if (id == 'size') p.radius_bubble = value;
                            if (id == 'opacity') p.opacity_bubble = value;
                        }
                    }

                }

            }

            if (pJS.tmp.bubble_clicking) {
                /* size */
                process(pJS.interactivity.modes.bubble.size, pJS.particles.size.value, p.radius_bubble, p.radius, 'size');
                /* opacity */
                process(pJS.interactivity.modes.bubble.opacity, pJS.particles.opacity.value, p.opacity_bubble, p.opacity, 'opacity');
            }

        }

    };


    pJS.fn.modes.repulseParticle = function (p) {

        if (pJS.interactivity.events.onhover.enable && TR_pJS._isInArray('repulse', pJS.interactivity.events.onhover.mode) && pJS.interactivity.status == 'mousemove') {

            var dx_mouse = p.x - pJS.interactivity.mouse.pos_x,
                dy_mouse = p.y - pJS.interactivity.mouse.pos_y,
                dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);

            var normVec = { x: dx_mouse / dist_mouse, y: dy_mouse / dist_mouse },
                repulseRadius = pJS.interactivity.modes.repulse.distance,
                velocity = 100,
                repulseFactor = ((1 / repulseRadius) * (-1 * Math.pow(dist_mouse / repulseRadius, 2) + 1) * repulseRadius * velocity).clamp(0, 50);

            var pos = {
                x: p.x + normVec.x * repulseFactor,
                y: p.y + normVec.y * repulseFactor
            }

            if (pJS.particles.move.out_mode == 'bounce') {
                if (pos.x - p.radius > 0 && pos.x + p.radius < pJS.canvas.w) p.x = pos.x;
                if (pos.y - p.radius > 0 && pos.y + p.radius < pJS.canvas.h) p.y = pos.y;
            } else {
                p.x = pos.x;
                p.y = pos.y;
            }

        }


        else if (pJS.interactivity.events.onclick.enable && TR_pJS._isInArray('repulse', pJS.interactivity.events.onclick.mode)) {

            if (!pJS.tmp.repulse_finish) {
                pJS.tmp.repulse_count++;
                if (pJS.tmp.repulse_count == pJS.particles.array.length) {
                    pJS.tmp.repulse_finish = true;
                }
            }

            if (pJS.tmp.repulse_clicking) {

                var repulseRadius = Math.pow(pJS.interactivity.modes.repulse.distance / 6, 3);

                var dx = pJS.interactivity.mouse.click_pos_x - p.x,
                    dy = pJS.interactivity.mouse.click_pos_y - p.y,
                    d = dx * dx + dy * dy;

                var force = -repulseRadius / d * 1;

                function process() {

                    var f = Math.atan2(dy, dx);
                    p.vx = force * Math.cos(f);
                    p.vy = force * Math.sin(f);

                    if (pJS.particles.move.out_mode == 'bounce') {
                        var pos = {
                            x: p.x + p.vx,
                            y: p.y + p.vy
                        }
                        if (pos.x + p.radius > pJS.canvas.w) p.vx = -p.vx;
                        else if (pos.x - p.radius < 0) p.vx = -p.vx;
                        if (pos.y + p.radius > pJS.canvas.h) p.vy = -p.vy;
                        else if (pos.y - p.radius < 0) p.vy = -p.vy;
                    }

                }

                // default
                if (d <= repulseRadius) {
                    process();
                }

                // bang - slow motion mode
                // if(!pJS.tmp.repulse_finish){
                //   if(d <= repulseRadius){
                //     process();
                //   }
                // }else{
                //   process();
                // }


            } else {

                if (pJS.tmp.repulse_clicking == false) {

                    p.vx = p.vx_i;
                    p.vy = p.vy_i;

                }

            }

        }

    }


    pJS.fn.modes.grabParticle = function (p) {

        if (pJS.interactivity.events.onhover.enable && pJS.interactivity.status == 'mousemove') {

            var dx_mouse = p.x - pJS.interactivity.mouse.pos_x,
                dy_mouse = p.y - pJS.interactivity.mouse.pos_y,
                dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);

            /* draw a line between the cursor and the particle if the distance between them is under the config distance */
            if (dist_mouse <= pJS.interactivity.modes.grab.distance) {

                var opacity_line = pJS.interactivity.modes.grab.line_linked.opacity - (dist_mouse / (1 / pJS.interactivity.modes.grab.line_linked.opacity)) / pJS.interactivity.modes.grab.distance;

                if (opacity_line > 0) {

                    /* style */
                    var color_line = pJS.particles.line_linked.color_rgb_line;
                    pJS.canvas.ctx.strokeStyle = 'rgba(' + color_line.r + ',' + color_line.g + ',' + color_line.b + ',' + opacity_line + ')';
                    pJS.canvas.ctx.lineWidth = pJS.particles.line_linked.width;
                    //pJS.canvas.ctx.lineCap = 'round'; /* performance issue */

                    /* path */
                    pJS.canvas.ctx.beginPath();
                    pJS.canvas.ctx.moveTo(p.x, p.y);
                    pJS.canvas.ctx.lineTo(pJS.interactivity.mouse.pos_x, pJS.interactivity.mouse.pos_y);
                    pJS.canvas.ctx.stroke();
                    pJS.canvas.ctx.closePath();

                }

            }

        }

    };



    /* ---------- pJS functions - vendors ------------ */

    pJS.fn.vendors.eventsListeners = function () {

        /* events target element */
        if (pJS.interactivity.detect_on == 'window') {
            pJS.interactivity.el = window;
        } else {
            pJS.interactivity.el = pJS.canvas.el;
        }


        /* detect mouse pos - on hover / click event */
        if (pJS.interactivity.events.onhover.enable || pJS.interactivity.events.onclick.enable) {

            /* el on mousemove */
            sprite._pJS_listeners.mousemove = function(pos_x, pos_y) {

                /*
                if (pJS.interactivity.el == window) {
                    var pos_x = e.clientX,
                        pos_y = e.clientY;
                }
                else {
                    var pos_x = e.offsetX || e.clientX,
                        pos_y = e.offsetY || e.clientY;
                }
                */

                pJS.interactivity.mouse.pos_x = pos_x;
                pJS.interactivity.mouse.pos_y = pos_y;

                if (pJS.tmp.retina) {
                    pJS.interactivity.mouse.pos_x *= pJS.canvas.pxratio;
                    pJS.interactivity.mouse.pos_y *= pJS.canvas.pxratio;
                }

                pJS.interactivity.status = 'mousemove';

            };

            /* el on onmouseleave */
            sprite._pJS_listeners.mouseleave = function() {

                pJS.interactivity.mouse.pos_x = null;
                pJS.interactivity.mouse.pos_y = null;
                pJS.interactivity.status = 'mouseleave';

            };

        }

        /* on click event */
        if (pJS.interactivity.events.onclick.enable) {

            sprite._pJS_listeners.click = function() {

                pJS.interactivity.mouse.click_pos_x = pJS.interactivity.mouse.pos_x;
                pJS.interactivity.mouse.click_pos_y = pJS.interactivity.mouse.pos_y;
                pJS.interactivity.mouse.click_time = new Date().getTime();

                if (pJS.interactivity.events.onclick.enable) {

                    switch (pJS.interactivity.events.onclick.mode) {

                        case 'push':
                            if (pJS.particles.move.enable) {
                                pJS.fn.modes.pushParticles(pJS.interactivity.modes.push.particles_nb, pJS.interactivity.mouse);
                            } else {
                                if (pJS.interactivity.modes.push.particles_nb == 1) {
                                    pJS.fn.modes.pushParticles(pJS.interactivity.modes.push.particles_nb, pJS.interactivity.mouse);
                                }
                                else if (pJS.interactivity.modes.push.particles_nb > 1) {
                                    pJS.fn.modes.pushParticles(pJS.interactivity.modes.push.particles_nb);
                                }
                            }
                            break;

                        case 'remove':
                            pJS.fn.modes.removeParticles(pJS.interactivity.modes.remove.particles_nb);
                            break;

                        case 'bubble':
                            pJS.tmp.bubble_clicking = true;
                            break;

                        case 'repulse':
                            pJS.tmp.repulse_clicking = true;
                            pJS.tmp.repulse_count = 0;
                            pJS.tmp.repulse_finish = false;
                            setTimeout(function () {
                                pJS.tmp.repulse_clicking = false;
                            }, pJS.interactivity.modes.repulse.duration * 1000)
                            break;

                    }

                }
            };

        }


    };

    pJS.fn.vendors.densityAutoParticles = function () {

        if (pJS.particles.number.density.enable) {

            /* calc area */
            var area = pJS.canvas.el.width * pJS.canvas.el.height / 1000;
            if (pJS.tmp.retina) {
                area = area / (pJS.canvas.pxratio * 2);
            }

            /* calc number of particles based on density area */
            var nb_particles = area * pJS.particles.number.value / pJS.particles.number.density.value_area;

            /* add or remove X particles */
            var missing_particles = pJS.particles.array.length - nb_particles;
            if (missing_particles < 0) pJS.fn.modes.pushParticles(Math.abs(missing_particles));
            else pJS.fn.modes.removeParticles(missing_particles);

        }

    };


    pJS.fn.vendors.checkOverlap = function (p1, position) {
        for (var i = 0; i < pJS.particles.array.length; i++) {
            var p2 = pJS.particles.array[i];

            var dx = p1.x - p2.x,
                dy = p1.y - p2.y,
                dist = Math.sqrt(dx * dx + dy * dy);

            if (dist <= p1.radius + p2.radius) {
                p1.x = position ? position.x : Math.random() * pJS.canvas.w;
                p1.y = position ? position.y : Math.random() * pJS.canvas.h;
                pJS.fn.vendors.checkOverlap(p1);
            }
        }
    };


    pJS.fn.vendors.createSvgImg = function (p) {

        /* set color to svg element */
        var svgXml = pJS.tmp.source_svg,
            rgbHex = /#([0-9A-F]{3,6})/gi,
            coloredSvgXml = svgXml.replace(rgbHex, function (m, r, g, b) {
                if (p.color.rgb) {
                    var color_value = 'rgba(' + p.color.rgb.r + ',' + p.color.rgb.g + ',' + p.color.rgb.b + ',' + p.opacity + ')';
                } else {
                    var color_value = 'hsla(' + p.color.hsl.h + ',' + p.color.hsl.s + '%,' + p.color.hsl.l + '%,' + p.opacity + ')';
                }
                return color_value;
            });

        /* prepare to create img with colored svg */
        var svg = new Blob([coloredSvgXml], { type: 'image/svg+xml;charset=utf-8' }),
            DOMURL = window.URL || window.webkitURL || window,
            url = DOMURL.createObjectURL(svg);

        /* create particle img obj */
        var img = new Image();
        img.addEventListener('load', function () {
            p.img.obj = img;
            p.img.loaded = true;
            DOMURL.revokeObjectURL(url);
            pJS.tmp.count_svg++;
        });
        img.src = url;

    };


    /* no longer needed
    pJS.fn.vendors.destroypJS = function () {
        cancelAnimationFrame(pJS.fn.drawAnimFrame);
        canvas_el.remove();
        pJSDom = null;
    };
    */


    pJS.fn.vendors.drawShape = function (c, startX, startY, sideLength, sideCountNumerator, sideCountDenominator) {

        // By Programming Thomas - https://programmingthomas.wordpress.com/2013/04/03/n-sided-shapes/
        var sideCount = sideCountNumerator * sideCountDenominator;
        var decimalSides = sideCountNumerator / sideCountDenominator;
        var interiorAngleDegrees = (180 * (decimalSides - 2)) / decimalSides;
        var interiorAngle = Math.PI - Math.PI * interiorAngleDegrees / 180; // convert to radians
        c.save();
        c.beginPath();
        c.translate(startX, startY);
        c.moveTo(0, 0);
        for (var i = 0; i < sideCount; i++) {
            c.lineTo(sideLength, 0);
            c.translate(sideLength, 0);
            c.rotate(interiorAngle);
        }
        //c.stroke();
        c.fill();
        c.restore();

    };

    pJS.fn.vendors.exportImg = function () {
        window.open(pJS.canvas.el.toDataURL('image/png'), '_blank');
    };


    pJS.fn.vendors.loadImg = function (type) {

        pJS.tmp.img_error = undefined;

        if (pJS.particles.shape.image.src != '') {

            if (type == 'svg') {

                var xhr = new XMLHttpRequest();
                xhr.open('GET', pJS.particles.shape.image.src);
                xhr.onreadystatechange = function (data) {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            pJS.tmp.source_svg = data.currentTarget.response;
                            pJS.fn.vendors.checkBeforeDraw();
                        } else {
                            console.log('Error pJS - Image not found');
                            pJS.tmp.img_error = true;
                        }
                    }
                }
                xhr.send();

            } else {

                var img = new Image();
                img.addEventListener('load', function () {
                    pJS.tmp.img_obj = img;
                    pJS.fn.vendors.checkBeforeDraw();
                });
                img.src = pJS.particles.shape.image.src;

            }

        } else {
            console.log('Error pJS - No image.src');
            pJS.tmp.img_error = true;
        }

    };


    pJS.fn.vendors.draw = function () {

        if (pJS.particles.shape.type == 'image') {

            if (pJS.tmp.img_type == 'svg') {

                if (pJS.tmp.count_svg >= pJS.particles.number.value) {
                    pJS.fn.particlesDraw();
                    if (!pJS.particles.move.enable) sprite._pJS_update_draw = false;
                    else sprite._pJS_update_draw = true;
                } else {
                    //console.log('still loading...');
                    if (!pJS.tmp.img_error) sprite._pJS_update_draw = true;
                }

            } else {

                if (pJS.tmp.img_obj != undefined) {
                    pJS.fn.particlesDraw();
                    if (!pJS.particles.move.enable) sprite._pJS_update_draw = false;
                    else sprite._pJS_update_draw = true;
                } else {
                    if (!pJS.tmp.img_error) sprite._pJS_update_draw = true;
                }

            }

        } else {
            pJS.fn.particlesDraw();
            if (!pJS.particles.move.enable) sprite._pJS_update_draw = false;
            else sprite._pJS_update_draw = true;
        }

    };


    pJS.fn.vendors.checkBeforeDraw = function () {

        // if shape is image
        if (pJS.particles.shape.type == 'image') {

            if (pJS.tmp.img_type == 'svg' && pJS.tmp.source_svg == undefined) {
                sprite._pJS_update_check = true;
            } else {
                //console.log('images loaded! cancel check');
                sprite._pJS_update_check = false;
                if (!pJS.tmp.img_error) {
                    pJS.fn.vendors.init();
                    pJS.fn.vendors.draw();
                }

            }

        } else {
            sprite._pJS_update_check = false;
            pJS.fn.vendors.init();
            pJS.fn.vendors.draw();
        }

    };


    pJS.fn.vendors.init = function () {

        /* particles.line_linked - convert hex colors to rgb */
        pJS.particles.line_linked.color_rgb_line = TR_pJS._hexToRgb(pJS.particles.line_linked.color);

        /* init canvas + particles */
        pJS.fn.retinaInit();
        pJS.fn.canvasInit();
        pJS.fn.canvasSize();
        pJS.fn.canvasPaint();
        pJS.fn.particlesCreate();
        pJS.fn.vendors.densityAutoParticles();

    };


    pJS.fn.vendors.start = function () {

        if (TR_pJS._isInArray('image', pJS.particles.shape.type)) {
            pJS.tmp.img_type = pJS.particles.shape.image.src.substr(pJS.particles.shape.image.src.length - 3);
            pJS.fn.vendors.loadImg(pJS.tmp.img_type);
        } else {
            pJS.fn.vendors.checkBeforeDraw();
        }

    };


    /* ---------- pJS - start ------------ */

    pJS.fn.vendors.eventsListeners();
    pJS.fn.vendors.start();

};





/* ---------- global functions - vendors ------------ */

TR_pJS._deepExtend = function (destination, source) {
    for (var property in source) {
        if (source[property] && source[property].constructor &&
            source[property].constructor === Object) {
            destination[property] = destination[property] || {};
            TR_pJS._deepExtend(destination[property], source[property]);
        } else {
            destination[property] = source[property];
        }
    }
    return destination;
};


TR_pJS._hexToRgb = function(hex) {
    // By Tim Down - http://stackoverflow.com/a/5624139/3493650
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};


TR_pJS._isInArray = function(value, array) {
    return array.indexOf(value) > -1;
};












// ================================================================================
// particle json template
// ================================================================================

/* data/TR_particles/example.json

{
  "particles": {
    "number": {
      "value": 80,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/pictures/your_image.png",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.5,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 5,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 6,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "window",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "grab"
      },
      "onclick": {
        "enable": true,
        "mode": "repulse"
      }
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 200
      },
      "remove": {
        "particles_nb": 2
      }
    }
  }
}

*/

