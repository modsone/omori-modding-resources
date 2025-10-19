/*:
 * @plugindesc Allows smooth camera movement using Bezier curves with 
 * customizable easing animations. (v1.1.0)
 * @author Draught
 * 
 * @help
 * This plugin provides a script command to smoothly move the camera along a 
 * Bezier curve, allowing for cinematic and controlled camera movements. 
 * You can define start, control, and end points using various node types 
 * (such as specific coordinates, events, or the player’s position).
 * 
 * =============================================================================
 * Syntax
 * =============================================================================
 * Use the following script call:
 * 
 *    BCAM (START) (P1) (P2) (END) length mode
 * 
 * Where:
 *   • START, P1, P2, END - Define the points for the Bezier curve.
 *   • length - Determines how many frames the movement should take.
 *   • mode (optional) - Defines the animation easing type (default is Linear).
 * 
 * =============================================================================
 * Node Syntax
 * =============================================================================
 * Nodes define camera positions using the following formats:
 *   • PLAYER  - Uses the player's current position.
 *   • CUR     - Uses the camera’s current position.
 *   • X00Y00  - A fixed coordinate (e.g., X100Y200 for (100,200)).
 *   • E00     - Uses the position of a specific event ID.
 *   • XV00YV00 - Uses values stored in variables as coordinates.
 *   • EV00    - Uses a variable’s value as an event ID for positioning.
 * 
 * =============================================================================
 * Animation Types
 * =============================================================================
 * The mode parameter allows for different easing types:
 *   QuadIn      QuadOut      QuadInOut
 *   CubicIn     CubicOut     CubicInOut
 *   QuartIn     QuartOut     QuartInOut
 *   QuintIn     QuintOut     QuintInOut
 *   SineIn      SineOut      SineInOut
 *   ExpoIn      ExpoOut      ExpoInOut
 *   CircIn      CircOut      CircInOut
 *   ElasticIn   ElasticOut   ElasticInOut
 *   BackIn      BackOut      BackInOut
 *   BounceIn    BounceOut    BounceInOut
 *   Linear (default)
 * 
 * =============================================================================
 * Versions
 * =============================================================================
 * v1.1.0 - Added snap scroll function.
 * v1.0.0 - Initial release.
 * 
 */


var DGT = DGT || {}
DGT.BCAM = DGT.BCAM || {}

{
    DGT.BCAM.old_fn_store = DGT.BCAM.old_fn_store || new Map()
    let _alias = (originalStorage, baseClass, funcName, newFunc) => {

        let storedBase = originalStorage.get(baseClass) || {} // ensure default
        originalStorage.set(baseClass, storedBase)
        storedBase[funcName] = baseClass[funcName] || (() => { }) // store old function
        baseClass[funcName] = function (...args) {
            return newFunc.call(this, storedBase[funcName], ...args) // call new function, passing the original function as the first argument
        }
    }
    let alias = _alias.bind(null, DGT.BCAM.old_fn_store)

    alias(Game_Interpreter.prototype, 'pluginCommand', function (original, command, args) {
        if (command.toLowerCase() !== "bcam") { return original.call(this, command, args) }
        if (args[0].toLowerCase() === "snap") {
        	let target = resolveEvent(args[1])
            if (target === null) { return console.error("INVALID BCAM PLUGIN COMMAND SYNTAX") }
            $gameMap.snapScrollToXY(target.x, target.y)
            return
        }
        let targets = args.slice(0, 4).map(resolveEvent)
        let length = parseInt(args[4])
        let mode = TDDP_AnimationCurves.easingFunctions[args[5]]
        if (targets.includes(null) || !length) {
            return console.error("INVALID BCAM PLUGIN COMMAND SYNTAX")
        }
        $gameMap.setBcamTarget(targets, length, mode)
    })

    const X_OFFSET = 9.5
    const Y_OFFSET = 6.625 // could not figure out how to derive this from base engine functions so HARDCODED VALUES IT IS

    function constructPsuedoEvent(x, y) {
        // x = x - X_OFFSET
        // y = y - Y_OFFSET // whY
        return ({
            x: x,
            y: y,
            _realX: x,
            _realY: y,
            screenX: Game_CharacterBase.prototype.screenX,
            screenY: function () {
                let th = $gameMap.tileHeight();
                return Math.round(this.scrolledY() * th + th);
            },
            scrolledX: Game_CharacterBase.prototype.scrolledX,
            scrolledY: Game_CharacterBase.prototype.scrolledY
        })
    }

    function resolveValue(val) {
        if (val[0] === 'v') {
            let varid = Number(val[0].replace('v', ''))
            return $gameVariables.value(varid)
        } else {
            return Number(val)
        }
    }

    function resolveEvent(loc) {
        loc = loc.toLowerCase()
        if (loc === "cur") {
            let x = $gameMap.displayX() + X_OFFSET
            let y = $gameMap.displayY() + Y_OFFSET
            return constructPsuedoEvent(x, y)
        }
        if (loc === "player") {
            return constructPsuedoEvent($gamePlayer.x, $gamePlayer.y)
        }
        if (loc.match(/x(v?[0-9.]+)y(v?[0-9.]+)/)) {
            let x = resolveValue(RegExp.$1)
            let y = resolveValue(RegExp.$2)
            return constructPsuedoEvent(x, y)
        }
        if (loc.match(/e(v?[0-9.]+)/)) {
            let eventid = resolveValue(RegExp.$1)
            return $gameMap.event(eventid)
        }
        return null
    }
    DGT.BCAM.resolveEvent = resolveEvent
    alias(Game_Map.prototype, 'initBcam', function () {
        this.bcam = {
            norm: true,
            targets: [],
            length: 500,
            frames: 0,
            lastx: 0,
            lasty: 0,
            mode: TDDP_AnimationCurves.easingFunctions.Linear
        }
    })
    alias(Game_Map.prototype, 'setup', function (original, ...args) {
    	this.initBcam()
        original.apply(this, args)
    })

    alias(Game_Map.prototype, 'setBcamTarget', function (_, nodes, length, mode) {
    	if (!this.bcam) { this.initBcam() }
        this.bcam.targets = nodes
        this.bcam.length = length
        this.bcam.norm = false
        this.bcam.frames = 0
        this.bcam.lastx = 0
        this.bcam.lasty = 0
        this.bcam.mode = mode || TDDP_AnimationCurves.easingFunctions.Linear
    })
    
    alias(Game_Map.prototype, 'snapScrollToXY', function (_, toX, toY) {
    	var cw = (Graphics.boxWidth / 2);
        var ch = (Graphics.boxHeight / 2);
        let cx = $gameMap.displayX() + X_OFFSET
        let cy = $gameMap.displayY() + Y_OFFSET
        let fx = toX
        let fy = toY
        let dx = fx - cx
        let dy = fy - cy
        if (dy > ch) { this.scrollUp(dy) } else if (dy < ch) { this.scrollDown(dy) };
        if (dx > cw) { this.scrollLeft(dx) } else if (dx < cw) { this.scrollRight(dx) };
    })

    alias(Game_Map.prototype, 'updateScroll', function (original) {
    	if (!this.bcam) { this.initBcam() }
        if (this.bcam.norm) { return original.call(this) }
        
        var cw = (Graphics.boxWidth / 2);
        var ch = (Graphics.boxHeight / 2);
        let x0 = this.bcam.targets[0].x
        let y0 = this.bcam.targets[0].y
        if (this.bcam.frames === 0) {
        	this.snapScrollToXY(x0, y0)
        }
        
        this._scrollRest = 0;
        this.bcam.frames++
        
        let x1 = this.bcam.targets[1].x
        let y1 = this.bcam.targets[1].y
        let x2 = this.bcam.targets[2].x
        let y2 = this.bcam.targets[2].y
        let x3 = this.bcam.targets[3].x
        let y3 = this.bcam.targets[3].y

        let L = TDDP_AnimationCurves.easingFunctions.Linear
        let l0x0 = L(this.bcam.frames, x0, x1 - x0, this.bcam.length)
        let l0y0 = L(this.bcam.frames, y0, y1 - y0, this.bcam.length)
        let l0x1 = L(this.bcam.frames, x1, x2 - x1, this.bcam.length)
        let l0y1 = L(this.bcam.frames, y1, y2 - y1, this.bcam.length)
        let l0x2 = L(this.bcam.frames, x2, x3 - x2, this.bcam.length)
        let l0y2 = L(this.bcam.frames, y2, y3 - y2, this.bcam.length)

        let l1x0 = L(this.bcam.frames, l0x0, l0x1 - l0x0, this.bcam.length)
        let l1y0 = L(this.bcam.frames, l0y0, l0y1 - l0y0, this.bcam.length)
        let l1x1 = L(this.bcam.frames, l0x1, l0x2 - l0x1, this.bcam.length)
        let l1y1 = L(this.bcam.frames, l0y1, l0y2 - l0y1, this.bcam.length)

        let C = this.bcam.mode
        let fx = C(this.bcam.frames, l1x0, l1x1 - l1x0, this.bcam.length)
        let fy = C(this.bcam.frames, l1y0, l1y1 - l1y0, this.bcam.length)

        let dx = fx - this.lastx
        let dy = fy - this.lasty

        this.lastx = fx
        this.lasty = fy

        if (dy > ch) { this.scrollUp(dy) } else if (dy < ch) { this.scrollDown(dy) };

        if (dx > cw) { this.scrollLeft(dx) } else if (dx < cw) { this.scrollRight(dx) };

        if (this.bcam.frames === this.bcam.length) { this.bcam.norm = true }
    })

    // alias(Game_Variables.prototype, 'value', function(original, id) {
    //     let val = original.call(this, id)
    //     if (parseInt(val)) {
    //         return Math.randomInt(14)
    //     }
    //     return val
    // })
}