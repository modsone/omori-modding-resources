//=============================================================================
// ★ FD_BetterPluginCommands ★                                  v1.1.0      
//=============================================================================
 /*:
 * @plugindesc A variety of plugin commands + better plugin functionality.
 * @author FruitDragon
 * @version 1.1.0
 * 
 * @help
 * Special Thanks: bajamaid, FoG, stahl, tomatoradio
 * 
 * Plugin Commands Available:
 * - SelfSwitch
 * - SelfVariable
 * - NameInput
 * - MapFog
 * - CustomPicture
 * - EventTremble
 * 
 * For requests, lmk on the Modding Hub discord server (feel free to ping)
 * Also please tell me if there are any bugs so I can release a patch
 * 
 * =============================================================================
 * ALL COMMANDS BELOW:
 * 
 * Plugin: SelfSwitch [mapId] [eventId] [switchId] [value]
 * Plugin: SelfVariable [mapId] [eventId] [varId] [value]
 * 
 * Plugin: BalloonImage set [image] 
 * Plugin: BalloonImage clear 
 * Plugin: BalloonImage reset 
 * 
 * Plugin: NameInput [message] [default] [max] [wait]*
 * 
 * Plugin: MapFog set [fogId] [file] [x] [y] [opacity] [blend] [scaleX]* [scaleY]* [panX]* [panY]*
 * Plugin: MapFog update [fogId] [file] [x] [y] [opacity] [blend] [scaleX]* [scaleY]* [panX]* [panY]*
 * Plugin: MapFog fade [fogId] [opacity] [time]
 * Plugin: MapFog fadescrollx [fogId] [x] [time]
 * Plugin: MapFog fadescrolly [fogId] [y] [time]
 * Plugin: MapFog clear [fogId]
 * 
 * Plugin: CustomPicture setup [id] [width] [height] [hframes] [vframes]
 * Plugin: CustomPicture animate [id] [frames] [delay] [loops]* [wait]*
 * Plugin: CustomPicture frame [id] [frameId]
 * 
 * Plugin: EventTremble start [eventid] [power] [speed] [stop_cycle]*
 * Plugin: EventTremble stop [eventid]
 * 
 * 
 * =============================================================================
 * SelfSwitch
 * =============================================================================
 * Plugin: SelfSwitch [mapId] [eventId] [switchId] [value]
 * 
 * Sets a self switch in any event.
 * 
 * [mapId] Numerical Id or 'this' (returns current map)
 * [eventId] Id of event (returns current event)
 * [switchId] Id of self switch
 * [value] 'on', 'off', 'true', 'false'
 * 
 * SelfSwitch this 7 A on
 * SelfSwitch 140 12 C false
 * SelfSwitch 250 this cat true
 * 
 * 
 * 
 * =============================================================================
 * SelfVariable
 * =============================================================================
 * Plugin: SelfVariable [mapId] [eventId] [varId] [value]
 * 
 * Sets a self variable in any event.
 * 
 * [mapId] Numerical Id (returns current map) (note: 'this' does not work)
 * [eventId] Id of event (returns current event)
 * [varId] Id of self variable (can be anything)
 * [value] Some value (can be a number or as many words as you want)
 * 
 * SelfVariable 250 7 Five 5
 * SelfVariable 140 12 Six How are you doing today?
 * SelfVariable 55 3 cat Kitties are cool.
 * 
 * 
 * 
 * =============================================================================
 * BalloonImage
 * =============================================================================
 * Plugin: BalloonImage set [image] 
 * Plugin: BalloonImage clear (this makes balloons invisible)
 * Plugin: BalloonImage reset (returns to default defined in parameters)
 * 
 * Sets the image used for balloons.
 * 
 * [image] The image file name in img/system which the balloon comes from.
 * 
 * BalloonImage set BalloonDoReMi
 * BalloonImage clear
 * BalloonImage reset
 * 
 * 
 * 
 * =============================================================================
 * NameInput (Omori Name Input.js)
 * =============================================================================
 * Plugin: NameInput [message] [default] [max] [wait]
 * 
 * Sets up the name input window.
 * 
 * [message] The yaml.message_id for the ask text. 
 * [default] The default name in the input. Leave an extra space for nothing.
 * [max] Maximum number of characters.
 * [wait] (optional) Whether the game waits for the name window to close.
 * 
 * NameInput map_flavor.message_66 BOB 8
 * NameInput map_flavor.message_77  7 false
 * NameInput XX_BLUE.Omori_Name_Input SUNNY 7 true
 * 
 * Yaml message should be formatted as follows:
 * 
 * message_id:
 *     text: What is your name?
 * 
 * or
 * 
 * message_id:
 *     nameask: What is your name?
 * 
 * 
 * **NOTE: The script originally used has a new (optional) parameter:**
 * 
 * this.showNameInputWindows(name, max, wait, "yaml.message_id");
 * This means that you can define a custom ask message in the script itself.
 * 
 * Default ask text is "XX_BLUE.Omori_Name_Input"
 * 
 * This plugin command cannot currently handle a default name with a space.
 * Better to use the script for that.
 * 
 * 
 * 
 * =============================================================================
 * MapFog (TDS Map Fog.js) (edited to include fade transition)
 * =============================================================================
 * Plugin: MapFog set [fogId] [file] [x] [y] [opacity] [blend] [scaleX] [scaleY] [panX] [panY]
 * Plugin: MapFog update [fogId] [file] [x] [y] [opacity] [blend] [scaleX] [scaleY] [panX] [panY]
 * Plugin: MapFog fade [fogId] [opacity] [time]
 * Plugin: MapFog fadescrollx [fogId] [x] [time]
 * Plugin: MapFog fadescrolly [fogId] [y] [time]
 * Plugin: MapFog clear [fogId]
 * 
 * Plugin command to create the fog that is used in places like Pyrefly Forest.
 * 
 * [fogId] Id of fog (typically 'fog1' is used)
 * [file] Name of image file from img/overlays
 * [x] Speed at which the fog scrolls on horizontal axis
 * [y] Speed at which the fog scrolls on vertical axis
 * [opacity] Opacity of the fog
 * [blend] Blendmode of fog (0 - Normal, 1 - Additive, 2 - Multiply, 3 - Screen) Both word and number are accepted.
 * [scaleX] (optional) Horizontal stretch of image
 * [scaleY] (optional) Vertical stretch of image
 * [panX] (optional) Horizontal scroll speed relative to map. Accepts any number. eg: 1 is the same speed as the map, 0.5 is half, 2 is twice.
 * [panX] (optional) Horizontal scroll speed relative to map.
 * [time] Frames for the fog to fade from original to new opacity/scroll
 * 
 * MapFog set fog1 fog 1 0 75 0
 * MapFog set fog2 circle_fog 0 1 0 0 6 4
 * MapFog fade fog2 75 60
 * MapFog clear fog1
 * 
 * 
 * 
 * =============================================================================
 * CustomPicture (Custom Picture Controls.js)
 * =============================================================================
 * Plugin: CustomPicture setup [id] [width] [height] [hframes] [vframes]
 * Plugin: CustomPicture animate [id] [frames] [delay] [loops] [wait]
 * Plugin: CustomPicture frame [id] [frameId]
 * 
 * Plugin command to setup, animate, and select custom picture frames.
 * 
 * [id] Id number of picture
 * [width] Pixel width of image area
 * [height] Pixel height of image area
 * [hframes] Number of horizontal frames
 * [vframes] Number of vertical frames
 * [frames] List that contains the animation pattern
 * [delay] Delay between each frame update (in frames)
 * [loops*] (optional, default infinite) Number of times animation is repeated
 * 			When selecting # of loops, subtract one from number (0 = 1 loop)
 * [wait*] (optional, default true) If game waits for animation to finish
 * [frameId] Id of the frame to display
 * 
 * CustomPicture setup 5 1920 960 3 2
 * CustomPicture animate 5 [0,1,2] 45 3
 * CustomPicture animate 7 [1,2,1,3] 35
 * CustomPicture frame 5 3
 * 
 * 
 * 
 * =============================================================================
 * EventTremble (fuku_EventTremble.js)
 * =============================================================================
 * Plugin: EventTremble start [eventid] [power] [speed] [stop_cycle]
 * Plugin: EventTremble stop [eventid]
 * 
 * Makes the selected event tremble. View fuku_EventTremble.js for more info
 * 
 * [eventId] Event Id, 'this' (current event), or 'player' (player)
 * [power] Trembling width
 * [speed] Speed of tremble. Can be a decimal.
 * [stop_cycle*] (optional, default none) Number of trembles before stopping.
 * 
 * EventTremble start this 3 0.8 5
 * EventTremble start player 8 0.8
 * EventTremble start 17 6 1.3
 * EventTremble stop player
 * 
 * 
 * 
 * =============================================================================
 * Changelog
 * =============================================================================
 * 
 * v1.0.0 Released plugin! 
 * Four commands:
 * - SelfSwitch
 * - MapFog
 * - CustomPicture
 * - EventTremble
 * 
 * v1.1.0 Added two new commands
 * - SelfVariable
 * - NameInput
 * 
 * v1.2.0 Added one new command
 * - BalloonImage
 * 
 * 
 * 
 * @param Balloon Image
 * @default
 * 
 * @param BalloonImageVar
 * @text Balloon Image Variable
 * @type number
 * @parent Balloon Image
 * @desc The 'Change Balloon Image' variable
 * @default 25
 * 
 * @param DefaultBalloonImage
 * @text Default Balloon Image
 * @parent Balloon Image
 * @type string
 * @desc The default image from img/system used for balloons.
 * @default Balloon
 * 
 */
//=============================================================================


{
var Imported = Imported || {};
Imported.FD_BetterPluginCommands = true;

var FD = FD || {};
FD.BetterPluginCommands = FD.BetterPluginCommands || {};
FD.BetterPluginCommands.Param = PluginManager.parameters('FD_BetterPluginCommands');

FD.BetterPluginCommands.DefaultBalloonImage = FD.BetterPluginCommands.Param["DefaultBalloonImage"]
FD.BetterPluginCommands.BalloonImageVar = Number(FD.BetterPluginCommands.Param["BalloonImageVar"])

// FoG - This is quite disgusting but its the best way to grab the nested function without just modifying the base plugin.
function obtainSpriteMapFogClass() {
	if (FD.BetterPluginCommands.Sprite_MapFog) {
		return true;
	}

	// FoG - Check if the scene is defined, if so create a initialization fog to run the Sprite_MapFog class
	// FoG - Afterwords we remove the initialization fog.
	if (SceneManager._scene instanceof Scene_Map && SceneManager._scene._spriteset._mapFogContainer) {
		Game_Interpreter.prototype.createFogWithoutFade('initialize1', 'fog', 0, 0, 0, 0, 0, 0, 1, 1);
		const Container = SceneManager._scene._spriteset._mapFogContainer;
		const SpriteInstance = Container._sprites[0];
		$gameMap.removeMapFog('initialize1')

		// If the constructor name matches the class we want, save it
		if (SpriteInstance && SpriteInstance.constructor.name === `Sprite_MapFog`) {
			FD.BetterPluginCommands.Sprite_MapFog = SpriteInstance.constructor;
		}
	}

	// FoG - check if we saved the original Sprite_MapFog function, if we did, we can now overwrite its update function with out own.
	if (FD.BetterPluginCommands.Sprite_MapFog && !FD.BetterPluginCommands.Sprite_MapFog_Aliased) {
		const RealSpriteMapFog = FD.BetterPluginCommands.Sprite_MapFog;
		
		// FoG = overwrite the original Sprite_MapFog update function.
		RealSpriteMapFog.prototype.update = function() {
			//console.log("alias update")
			// Super Call
			TilingSprite.prototype.update.call(this);
			// Get Data
			let data = $gameMap.getMapFog(this._id);
			// If Data Exists
			if (data && data.active) {
			// If Bitmap name has changed
			if (this._bitmapName !== data.name) {
				// Set bitmap
				this.bitmap = ImageManager.loadOverlay(data.name);
				this.move(0, 0, data.width, data.height);      
				this._bitmapName = data.name;
			};
			// Apply Data
			this.opacity = data.opacity;
			if (data._fadeFlag && data._fadeStep && data.finalOpacity !== 'undefined') {
				data.opacity += data._fadeStep;
				this.opacity = data.opacity;
				if (data._fadeStep > 0) {
					if (data.opacity >= data.finalOpacity) {
						data._fadeFlag = false;
						this._fadeFlag = data._fadeFlag;
					}
				} else {
					if (data.opacity <= data.finalOpacity) {
						data._fadeFlag = false;
						this._fadeFlag = data._fadeFlag;
					}
				}
			}
			this.move.x = data.move.x
			if (data._fadeScrollXFlag && data._fadeScrollXStep && data.finalScrollX !== 'undefined') {
				data.move.x += data._fadeScrollXStep;
				this.move.x = data.move.x
				if (data._fadeScrollXStep > 0) {
					if (data.move.x >= data.finalScrollX) {
						data._fadeScrollXFlag = false;
						this._fadeScrollXFlag = false;
					}
				} else {
					if (data.move.x <= data.finalScrollX) {
						data._fadeScrollXFlag = false;
						this._fadeScrollXFlag = false;
					}
				}
			}
			this.move.y = data.move.y
			if (data._fadeScrollYFlag && data._fadeScrollYStep && data.finalScrollY !== 'undefined') {
				data.move.y += data._fadeScrollYStep;
				this.move.y = data.move.y
				if (data._fadeScrollYStep > 0) {
					if (data.move.y >= data.finalScrollY) {
						data._fadeScrollYFlag = false;
						this._fadeScrollYFlag = false;
					}
				} else {
					if (data.move.y <= data.finalScrollY) {
						data._fadeScrollYFlag = false;
						this._fadeScrollYFlag = false;
					}
				}
			}
			this.blendMode = data.blendMode;
			this.scale.x = data.scaleX;
			this.scale.y = data.scaleY;
			this.visible = data.visible;
			// Deactivate if not visible
			if (!data.visible && data.deactivateOnInvisible) { data.active = false; };
			// If Bitmap width is more than 0
			if (this.bitmap.width > 0) {
				// Set Base Origin Position
				data.origin.x = (data.origin.x + this.move.x) % this.bitmap.width;
				data.origin.y = (data.origin.y + this.move.y) % this.bitmap.height;
				// Set Origin
				this.origin.x = data.origin.x;
				this.origin.y = data.origin.y;
				// If Fog should be boudn to map
				if (data.mapBind) {
				this.origin.x += ($gameMap.displayX() * ($gameMap.tileWidth() * data.parallaxX))
				this.origin.y += ($gameMap.displayY() * ($gameMap.tileHeight() * data.parallaxY));        
				};
			};
			} else {
			// Remove From parent
			this.parent.removeFog(this);
			};
		}

		// FoG - set the aliased flag to true so we dont run this again
		FD.BetterPluginCommands.Sprite_MapFog_Aliased = true;
		return true;
	}

	return false;
}

// FoG -  obtain the aliased function when a map updates, realistically we should only run obtainSpriteMapFogClass() only once per game session.
const old_Scene_Map_Update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	old_Scene_Map_Update.call(this);

	if (!FD.BetterPluginCommands.Sprite_MapFog) {
		obtainSpriteMapFogClass();
	}
}

// FoG - the original plugin would hardcode the addMapFog functions id to `fog1`, which for some reason breaks the plugin command `set` function and our alias function, overwrite it.
Game_Interpreter.prototype.createMapFog = function(id, fog) {
	// Get Container
	let container = SceneManager._scene._spriteset._mapFogContainer;
	// Add Map Fog
	$gameMap.addMapFog(id, fog);
	if (container) { container.addFog(id); };
}; 

Game_Interpreter.prototype.createFogWithoutFade = function(id, name, x_scroll, y_scroll, opacity, blendmode, scaleX, scaleY, parallaxX, parallaxY) {
		let fog = this.generateMapFog()
		fog.move.x = x_scroll
		fog.move.y = y_scroll
		fog.scaleX = scaleX
		fog.scaleY = scaleY
		fog.name = name
		fog.opacity = opacity
		fog.finalOpacity = opacity
		blendmode = blendmode.toString()
		if (blendmode.toLowerCase() == 'normal') {
			blendmode = 0
		} else if (blendmode.toLowerCase().startsWith('add')) {
			blendmode = 1
		} else if (blendmode.toLowerCase() == 'multiply') {
			blendmode = 2
		} else if (blendmode.toLowerCase() == 'screen') {
			blendmode = 3
		} else {
			blendmode = parseInt(blendmode)
		}
		fog.blendMode = blendmode
		fog.parallaxX = parallaxX
		fog.parallaxY = parallaxY

	//FD.BetterPluginCommands.opacity = opacity
	//FD.BetterPluginCommands.time = 0

		this.createMapFog(id, fog);

}

Game_Interpreter.prototype.updateFog = function(id, name, x_scroll, y_scroll, opacity, blendmode, scaleX, scaleY, parallaxX, parallaxY) {
		let fog = $gameMap.getMapFog(id)
		if (x_scroll !== 'same') {fog.move.x = Number(x_scroll)}
		if (y_scroll !== 'same') {fog.move.y = Number(y_scroll)}
		if (scaleX !== 'same') {fog.scaleX = Number(scaleX)}
		if (scaleY !== 'same') {fog.scaleY = Number(scaleY)}
		if (name !== 'same') {fog.name = name}
		if (opacity !== 'same') {fog.opacity = Number(opacity)}
		if (blendmode.toLowerCase() == 'normal') {
			blendmode = 0
		} else if (blendmode.toLowerCase().startsWith('add')) {
			blendmode = 1
		} else if (blendmode.toLowerCase() == 'multiply') {
			blendmode = 2
		} else if (blendmode.toLowerCase() == 'screen') {
			blendmode = 3
		} else if (blendmode !== 'same') {
			blendmode = Number(blendmode)
		}
		if (blendmode !== 'same') {fog.blendMode = blendmode}
		if (parallaxX !== 'same') {fog.parallaxX = Number(parallaxX)}
		if (parallaxY !== 'same') {fog.parallaxY = Number(parallaxY)}
}

Game_Interpreter.prototype.fadeFog = function(id, opacity, time) {
	// For now the slowest it updates is +1 opacity every frame, might be able to get rid of math.floor() though?
	// I don't really know how it handles decimal values for that can't hurt to try though.
	// Decimal values work fine
	let data = $gameMap.getMapFog(id);
	data.finalOpacity = opacity;
	data._fadeFlag = true;
	data._fadeStep = (data.finalOpacity - data.opacity) / time;
	if (data._fadeStep === 0) {
		if (data.finalOpacity - data.opacity > 0) {
			data._fadeStep = 1;
		} else {
			data._fadeStep = -1;
		}
	}
};

Game_Interpreter.prototype.fadeScrollX = function(id, finalScroll, time) {
	let data = $gameMap.getMapFog(id);
	let scroll = data.move.x
	data.finalScrollX = finalScroll
	data._fadeScrollXFlag = true;
	data._fadeScrollXStep = (data.finalScrollX - scroll) / time;
	if (data._fadeScrollXStep === 0) {
		if (data.finalScrollX - scroll > 0) {
			data._fadeScrollXStep = 1;
		} else {
			data._fadeScrollXStep = -1;
		}
	}
};

Game_Interpreter.prototype.fadeScrollY = function(id, finalScroll, time) {
	let data = $gameMap.getMapFog(id);
	let scroll = data.move.y
	data.finalScrollY = finalScroll
	data._fadeScrollYFlag = true;
	data._fadeScrollYStep = (data.finalScrollY - scroll) / time;
	if (data._fadeScrollYStep === 0) {
		if (data.finalScrollY - scroll > 0) {
			data._fadeScrollYStep = 1;
		} else {
			data._fadeScrollYStep = -1;
		}
	}
};

Game_Interpreter.prototype.returnGivenEvent = function(arg) {

	switch (arg.toLowerCase()) {
		case "player":
			return $gamePlayer;
		case "this":
			return this._eventId;
		default:
			return $gameMap.event(Number(arg));
	}

}

Game_Interpreter.prototype.returnGivenMap = function(arg) {
	
	switch (arg.toLowerCase()) {
		case "this":
			return $gameMap.mapId();
		default:
			return Number(arg);
	}

}

//$gameSelfSwitches.setValue()
Game_Interpreter.prototype.setSelfSwitch = function(map, event, id, value){
	mapid = this.returnGivenMap(map)
	$gameSelfSwitches.setValue([mapid, event, id], value);
}

//$gameSelfVariables.setValue()
Game_Interpreter.prototype.setSelfVariable = function(map, event, id, value){
	mapid = this.returnGivenMap(map)
	$gameSelfVariables.setValue([map, event, id], value)
}

Game_Interpreter.prototype.showNameInputWindows = function(name = "", max = 7, wait = true, ask) {
	// Show Name Input Windows
	SceneManager._scene.showNameInputWindows(ask, name, max);
	// Set Wait
	if (wait) { this.setWaitMode('nameInput'); };

}

//Omori Name Input.js
Scene_Map.prototype.showNameInputWindows = function(ask, name, max) {
	this._nameInputNameWindow._maxCharacters = max;
	this._nameInputNameWindow.width = this._nameInputNameWindow.windowWidth()
	this._nameInputNameWindow.createContents()
	this._nameInputNameWindow.refresh(ask)
	this._nameInputNameWindow.clearName(name);
	this._nameInputNameWindow.open();
	/*this._nameInputLetterWindow.open();
	this._nameInputLetterWindow.activate();
	this._nameInputLetterWindow.select(0);*/
	this._virtualKeyboard.setup()
};

Window_OmoriNameInputName.prototype.refresh = function(ask) {
	// Clear Contents
	this.contents.clear();
	this.contents.fontSize = 23
	this.contents.drawText((LanguageManager.getMessageData(ask || "XX_BLUE.Omori_Name_Input").text || LanguageManager.getMessageData(ask || "XX_BLUE.Omori_Name_Input").nameask), 0, 1, this.contents.width, this.contents.fontSize, 'center');
	this.contents.fillRect(0, 32, this.contents.width, 2, 'rgba(255, 255, 255, 1)');
	// Refresh Text
	this.refreshText();
};

Game_Interpreter.prototype.handleNameInput = function(args) {
	this.showNameInputWindows(args[1], Number(args[2]), eval(args[3]), args[0])
}

Game_Interpreter.prototype.handleMapFog = function(args) {
	// PluginCommand MapFog set id filename x_scroll y_scroll opacity blendmode scaleX scaleY parallaxX parallaxY
	// PluginCommand MapFog fade id opacity time
	// PluginCommand MapFog clear id
	// PluginCommand MapFog fadeScrollX id x_scroll time
	// PluginCommand MapFog fadeScrollY id y_scroll time
	// PluginCommand MapFog update id filename x_scroll y_scroll opacity blendmode scaleX scaleY parallaxX parallaxY
	temp = args.shift();
	switch (temp.toLowerCase()) {
	case 'set':
		this.createFogWithoutFade(args[0], args[1], Number(args[2]), Number(args[3]), Number(args[4]), String(args[5]), Number(args[6]) || 1, Number(args[7]) || 1, Number(args[8]) || 1, Number(args[9]) || 1)
		return;
	case 'clear':
		$gameMap.removeMapFog(args[0])
		return;
	case 'fade':
		this.fadeFog(args[0], Number(args[1]), Number(args[2]))
		return;
	case 'fadescrollx':
		this.fadeScrollX(args[0],Number(args[1]),Number(args[2]))
		return;
	case 'fadescrolly':
		this.fadeScrollY(args[0],Number(args[1]),Number(args[2]))
		return;
	case 'update':
		this.updateFog(args[0], args[1] || 'same', args[2] || 'same', args[3] || 'same', args[4] || 'same', args[5] || 'same', args[6] || 'same', args[7] || 'same', args[8] || 'same', args[9] || 'same')
	default:
		return;
	}
}

Game_Interpreter.prototype.handleSelfSwitch = function(args) {
	//PluginCommand selfswitch map (this) event id value
	if (args[3].toLowerCase() === 'true' || args[3].toLowerCase() === 'on') {
		this.setSelfSwitch(args[0], args[1], args[2], true)
	}
	else if (args[3].toLowerCase() === 'false' || args[3].toLowerCase() === 'off') {
		this.setSelfSwitch(args[0], args[1], args[2], false)
	}
}

Game_Interpreter.prototype.handleSelfVariable = function(args) {

	//PluginCommand selfvariable map (this) event id value
	var value = ""

	for (var i = 3; i < args.length; i++) {
		value += " " + args[i]
	}

	this.setSelfVariable(args[0], args[1], args[2], value)

}

Game_Interpreter.prototype.handleCustomPicture = function(args) {
	temp = args.shift();
	switch (temp.toLowerCase()) {
	case 'setup':
		//CustomPicture setup pictureId width height horizontal_frames vertical_frames
		this.setupPictureCustomFrames(Number(args[0]), Number(args[1]), Number(args[2]), Number(args[3]), Number(args[4]))
		return;
	case 'animate':
		frames = JSON.parse(args[1]).map(Number)
		console.log(args[1], frames)
		//CustomPicture animate pictureId frames delay loops = Infinity wait = true
		this.setPictureAnimation(Number(args[0]), frames, Number(args[2]), Number(args[3]) || Infinity, eval(args[4]) || true)
		return;
	case 'frame':
		//CustomPicture frame pictureId frameId
		this.setPictureFrameIndex(Number(args[0]), Number(args[1]))
		return;
	default:
		return;
	}
		//this.setupPictureCustomFrames(pictureId, width, height, horizontal frames, vertical frames)
		//Game_Interpreter.prototype.setupPictureCustomFrames()
		//this.setPictureFrameIndex(pictureId, frame)
}

Game_Interpreter.prototype.handleEventTremble = function(args) {
	temp = args.shift();
	var event = this.returnGivenEvent(args[0])
	switch (temp.toLowerCase()) {
		case 'start':
			//Fuku_Plugins.EventTremble.start=function(eventid,power,speed,stop_cycle)
			//var event = args[0].toLowerCase() == "player" ? $gamePlayer : $gameMap.event(Number(args[0]))

			if (args[3]) {
				Fuku_Plugins.EventTremble.startObject(event, Number(args[1]), Number(args[2]), Number(args[3]))
			}
			else {
				Fuku_Plugins.EventTremble.startObject(event, Number(args[1]), Number(args[2]))
			}
			return;

		case 'stop':
			//Fuku_Plugins.EventTremble.stop=function(eventid)
			Fuku_Plugins.EventTremble.stopObject(event)
			return;
		default:
			return;
	};
}

Game_Interpreter.prototype.handleBalloonImage = function(args) {
	//BalloonImage set image
	//BalloonImage clear
	//BalloonImage reset
	//console.log("balloon plugin command")
	temp = args.shift();
	switch (temp.toLowerCase()) {
		case 'set':
			$gameVariables.setValue(FD.BetterPluginCommands.BalloonImageVar, args[0])
			//console.log("case set")
			console.log(FD.BetterPluginCommands.BalloonImageVar)
			return;
		case 'clear':
			$gameVariables.setValue(FD.BetterPluginCommands.BalloonImageVar, '')
			//console.log("case clear")
			console.log(FD.BetterPluginCommands.BalloonImageVar)
			return;
		case 'reset':
			$gameVariables.setValue(FD.BetterPluginCommands.BalloonImageVar, FD.BetterPluginCommands.DefaultBalloonImage)
			//console.log("case reset")
			console.log(FD.BetterPluginCommands.BalloonImageVar)
			return;
	}
}

// Adds the plugin commands
FD.BetterPluginCommands.GameInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function (command, args) {
	switch (command.toLowerCase()) {
		case 'mapfog': //TDS Map Fog.js
			this.handleMapFog(args)
			return;
		case 'selfswitch':
			this.handleSelfSwitch(args)
			return;
		case 'selfvariable':
			this.handleSelfVariable(args)
			return;
		case 'custompicture': //Custom Picture Controls.js
			this.handleCustomPicture(args)
			return;
		case 'eventtremble': //fuku_EventTremble.js
			this.handleEventTremble(args)
			return;
		case 'nameinput': //Omori Name Input.js
			this.handleNameInput(args)
			return;
		case 'balloonimage': 
			this.handleBalloonImage(args)
			return;
		default:
			FD.BetterPluginCommands.GameInterpreter_pluginCommand.call(this, command, args);
			return;
	}
};

}