//=============================================================================
//=============================================================================
/*:
 * @plugindesc Patch for TDS Map Fog - Enables multiple fog layers
 * @author KoffinKrypt
 * 
 * @help
 * This plugin patches the TDS Map Fog plugin to enable multiple fog layers.
 * Place this plugin at the bottom in your plugin list.
 * 
 * ============================================================================
 * BASIC INFO
 * ============================================================================
 * 
 * 1. Place fog images in: img/overlays/
 * 2. Use script calls in events to create fog layers
 * 3. Each fog layer needs a unique ID
 * 4. Higher priority numbers appear on top
 * 
 * ============================================================================
 * BASIC FOG CREATION
 * ============================================================================
 * 
 * Single Fog Layer:
 * 
 * var fog = $gameMap.generateMapFog();
 * fog.name = 'fog_image';       // File name in img/overlays/ (without .png)
 * fog.priority = 1;             // Layer order (1 = bottom)
 * fog.opacity = 200;            // 0-255 (255 = fully opaque)
 * fog.blendMode = 0;            // 0=Normal, 1=Additive, 2=Multiply, 3=Screen
 * fog.move.x = 0.5;             // Horizontal movement speed (pixels/frame)
 * fog.move.y = 0.3;             // Vertical movement speed
 * $gameMap.createMapFog('fog1', fog);
 * 
 * ============================================================================
 * MULTIPLE LAYERS EXAMPLE
 * ============================================================================
 * 
 * // Clear existing fogs first
 * $gameMap.clearMapFogs();
 * 
 * // Bottom layer - distant haze
 * var fog1 = $gameMap.generateMapFog();
 * fog1.name = 'haze_light';
 * fog1.priority = 1;
 * fog1.opacity = 80;
 * fog1.blendMode = 1;           // Additive blend
 * fog1.move.x = 0.1;
 * $gameMap.createMapFog('haze', fog1);
 * 
 * // Middle layer - moving fog
 * var fog2 = $gameMap.generateMapFog();
 * fog2.name = 'fog_medium';
 * fog2.priority = 2;
 * fog2.opacity = 120;
 * fog2.blendMode = 1;
 * fog2.move.x = 0.5;
 * $gameMap.createMapFog('fog', fog2);
 * 
 * // Top layer - rain/snow effects
 * var fog3 = $gameMap.generateMapFog();
 * fog3.name = 'rain';
 * fog3.priority = 3;            // Highest = on top
 * fog3.opacity = 150;
 * fog3.blendMode = 0;
 * fog3.move.y = 2.0;            // Falling effect
 * $gameMap.createMapFog('rain', fog3);
 * 
 * ============================================================================
 * AVAILABLE FOG PROPERTIES
 * ============================================================================
 * 
 * fog.name = "filename"         // Image filename (without .png)
 * fog.opacity = 0-255           // Transparency (lower = more transparent)
 * fog.blendMode = 0-3           // 0=Normal, 1=Additive, 2=Multiply, 3=Screen
 * fog.scaleX = 1.0              // Horizontal scale
 * fog.scaleY = 1.0              // Vertical scale
 * fog.move.x = 0.0              // Horizontal scroll speed
 * fog.move.y = 0.0              // Vertical scroll speed
 * fog.width = Graphics.width    // Display width (usually leave as default)
 * fog.height = Graphics.height  // Display height
 * fog.mapBind = true           // If true, fog moves with map scrolling
 * fog.visible = true           // Show/hide fog
 * fog.priority = 0             // Stacking order (higher = on top)
 * fog.active = true            // Enable/disable updates
 * 
 * ============================================================================
 * FOG MANAGEMENT COMMANDS
 * ============================================================================
 * 
 * // Clear ALL fog layers
 * $gameMap.clearMapFogs();
 * 
 * // Remove specific fog layer
 * $gameMap.removeMapFog('layer_id');
 * 
 * // Get a fog layer to modify it
 * var myFog = $gameMap.getMapFog('layer_id');
 * if (myFog) {
 *     myFog.opacity = 100;      // Change opacity
 *     myFog.visible = false;    // Hide layer
 *     myFog.move.x = 0.0;       // Stop movement
 * }
 * 
 * // Show/hide specific layer
 * var fog = $gameMap.getMapFog('layer_id');
 * if (fog) {
 *     fog.visible = true;       // Show
 *     fog.visible = false;      // Hide
 * }
 * 
 * // Change layer priority (reorders stacking)
 * var fog = $gameMap.getMapFog('layer_id');
 * if (fog) {
 *     fog.priority = 5;         // New priority level
 *     $gameMap.refreshFogDisplay(); // Update display order
 * }
 * 
 * ============================================================================
 * SCRIPT CALL REFERENCE
 * ============================================================================
 * 
 * // Creation
 * $gameMap.generateMapFog()             // Create new fog object
 * $gameMap.createMapFog(id, fog)        // Add fog with ID
 * 
 * // Management
 * $gameMap.clearMapFogs()               // Remove all fogs
 * $gameMap.removeMapFog(id)             // Remove specific fog
 * $gameMap.getMapFog(id)                // Get fog by ID
 * $gameMap.refreshFogDisplay()          // Update display order
 * 
 * // Properties (on fog object)
 * .name .opacity .blendMode .priority
 * .move.x .move.y .scaleX .scaleY
 * .visible .active .mapBind
 * 
 */

var Imported = Imported || {};
Imported.TDS_MapFog_MultiLayer = true;

(function() {
    'use strict';
    
    // Store the original Scene_Map create method
    var _Scene_Map_create = Scene_Map.prototype.create;
    
    Scene_Map.prototype.create = function() {
        // Call original create
        _Scene_Map_create.call(this);
        
        // Patch after the scene is fully created
        this.patchMapFogPlugin();
    };
    
    Scene_Map.prototype.patchMapFogPlugin = function() {
        // Check if TDS Map Fog is loaded
        if (!Game_Interpreter.prototype.createMapFog) {
            console.warn('TDS Map Fog plugin not ready!');
            return;
        }
        
        console.log('Patching TDS Map Fog for multi-layer support...');
        
        // ========== PATCH 1: Fix createMapFog to use ID parameter ==========
        var originalCreateMapFog = Game_Interpreter.prototype.createMapFog;
        Game_Interpreter.prototype.createMapFog = function(id, fog) {
            // Get Container
            var container = null;
            if (SceneManager._scene && 
                SceneManager._scene._spriteset && 
                SceneManager._scene._spriteset._mapFogContainer) {
                container = SceneManager._scene._spriteset._mapFogContainer;
            }
            
            // Add Map Fog - FIXED: Use the id parameter instead of hardcoded 'fog1'
            if ($gameMap && $gameMap.addMapFog) {
                $gameMap.addMapFog(id, fog);
            }
            
            if (container && container.addFog) { 
                container.addFog(id); 
            }
        };
        
        // ========== PATCH 2: Add generateMapFog to Game_Map ==========
        if (!Game_Map.prototype.generateMapFog) {
            Game_Map.prototype.generateMapFog = function() { 
                // Check if Game_MapFog exists
                if (typeof Game_MapFog === 'function') {
                    return new Game_MapFog();
                } else {
                    // Create a basic fog object if Game_MapFog doesn't exist
                    return {
                        name: '',
                        opacity: 255,
                        blendMode: 0,
                        scaleX: 1,
                        scaleY: 1,
                        moveX: 0,
                        moveY: 0,
                        width: Graphics.width,
                        height: Graphics.height,
                        mapBind: true,
                        visible: true,
                        deactivateOnInvisible: true,
                        active: true,
                        priority: 0,
                        origin: {x: 0, y: 0},
                        move: {x: 0, y: 0}
                    };
                }
            };
        }
        
        // ========== PATCH 3: Add createMapFog to Game_Map ==========
        if (!Game_Map.prototype.createMapFog) {
            Game_Map.prototype.createMapFog = function(id, fog) {
                if (this.addMapFog) {
                    this.addMapFog(id, fog);
                }
                
                // Get Container and add fog if it exists
                if (SceneManager._scene && 
                    SceneManager._scene._spriteset && 
                    SceneManager._scene._spriteset._mapFogContainer &&
                    SceneManager._scene._spriteset._mapFogContainer.addFog) {
                    SceneManager._scene._spriteset._mapFogContainer.addFog(id);
                }
            };
        }
        
        // ========== PATCH 4: Fix Sprite_MapFogContainer.initialize ==========
        // We need to wait for Sprite_MapFogContainer to be defined
        setTimeout(function() {
            if (typeof Sprite_MapFogContainer === 'function') {
                var originalInit = Sprite_MapFogContainer.prototype.initialize;
                Sprite_MapFogContainer.prototype.initialize = function() {
                    // Call original initialize if it exists
                    if (originalInit) {
                        originalInit.call(this);
                    } else {
                        // Basic initialize if original doesn't exist
                        PIXI.Container.call(this);
                        this._sprites = [];
                    }
                    
                    // Fix: Check if $gameMap._mapFogs exists before using it
                    if ($gameMap && $gameMap._mapFogs) {
                        var mapFogs = Object.entries($gameMap._mapFogs);
                        
                        // Sort by priority
                        mapFogs.sort(function(a, b) {
                            return (a[1].priority || 0) - (b[1].priority || 0);
                        });
                        
                        // Add fogs in sorted order
                        for (var i = 0; i < mapFogs.length; i++) { 
                            if (this.addFog) {
                                this.addFog(mapFogs[i][0]); 
                            }
                        }
                    }
                };
            }
        }, 100); // Wait 100ms for everything to load
        
        console.log('TDS Map Fog successfully patched for multi-layer support!');
    };
    
    // ========== HELPER FUNCTIONS ==========
    
    // Add a helper function to Game_Interpreter for easy fog creation
    Game_Interpreter.prototype.generateFogWithParams = function(name, priority, opacity, moveX, moveY) {
        var fog;
        
        // Try to generate fog using available methods
        if (Game_Map.prototype.generateMapFog) {
            fog = $gameMap.generateMapFog();
        } else if (Game_Interpreter.prototype.generateMapFog) {
            fog = this.generateMapFog();
        } else {
            // Create a basic fog object
            fog = {
                name: '',
                opacity: 255,
                blendMode: 0,
                scaleX: 1,
                scaleY: 1,
                moveX: 0,
                moveY: 0,
                width: Graphics.width,
                height: Graphics.height,
                mapBind: true,
                visible: true,
                deactivateOnInvisible: true,
                active: true,
                priority: 0,
                origin: {x: 0, y: 0},
                move: {x: 0, y: 0}
            };
        }
        
        // Set parameters
        if (name) fog.name = name;
        if (priority !== undefined) fog.priority = priority;
        if (opacity !== undefined) fog.opacity = opacity;
        if (moveX !== undefined) fog.move.x = moveX;
        if (moveY !== undefined) fog.move.y = moveY;
        
        return fog;
    };
    
    // Add a function to refresh fog display
    Game_Map.prototype.refreshFogDisplay = function() {
        if (SceneManager._scene && 
            SceneManager._scene._spriteset && 
            SceneManager._scene._spriteset._mapFogContainer) {
            
            var container = SceneManager._scene._spriteset._mapFogContainer;
            
            // Clear and re-add all fogs
            if (container.removeChildren) {
                container.removeChildren();
                container._sprites = [];
                
                if ($gameMap._mapFogs) {
                    var mapFogs = Object.entries($gameMap._mapFogs);
                    
                    // Sort by priority
                    mapFogs.sort(function(a, b) {
                        return (a[1].priority || 0) - (b[1].priority || 0);
                    });
                    
                    // Add fogs back in sorted order
                    for (var i = 0; i < mapFogs.length; i++) { 
                        if (container.addFog) {
                            container.addFog(mapFogs[i][0]); 
                        }
                    }
                }
            }
        }
    };
    
})();