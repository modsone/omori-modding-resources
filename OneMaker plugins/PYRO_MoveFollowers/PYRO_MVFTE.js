/*:
 * @plugindesc Followers to Events & Follower targeting
 * @author PYRO
 *
 *
 * @help
 * ============================================================
 * PYRO_MVFTE - Followers to Events & Follower targeting
 * ============================================================
 * 
 * -- Overview --
 * This plugin allows you to target Followers with Movement Routes along with the respective OneMakerMV mod.
 * 
 * The following plugin commands turn followers into events and vice versa.
 * 
 * They are NOT required, but are helpful for when the engine does not 
 * let you do things with followers that you could do ordinarily with events. 
 * 
 * Internally, they're brand-new events with the event ID 500 (or whatever you set it as below) and can be targeted
 * with the usual Follower 0 - 3.
 * 
 * -- Plugin commands --
 * 
 * FTE - Followers to Events
 * ETF - Events to Followers
 * 
 * -- Usage Notes --
 * 
 * - If you try to change the image of a follower, reset it with "this.flushRoute()" at the end of the movement route.
 * 
 * 
 * Technically there's a built in way to call these but for the sake of simplicity I have not included them yet.
 * 
 * v. 1.0.4
 * 
 * -- Changelog --
 * 1.0.0 - Plugin creation
 * 1.0.1 - Also include player to be converted into events
 * 1.0.2 - Accidentally swapped functions
 * 1.0.3 - Fix TDS code. You can now change follower images. Remember to run this.flushRoute() at the end of a route.
 * "     - This shouldn't break things retroactively
 * 1.0.4 - Introduce this.flushRoute() to reset a changed follower's image back. (and potentially fix other things.)
 * 
 * TERMS OF USE
 * Copyright (c) 2025 Pyro
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
 * associated documentation files (the “Software”), to deal in the Software without restriction, including 
 * without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
 * copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION 
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
*/
    
var PYRO     = PYRO     || {};
PYRO.FTE     = PYRO.FTE || {};

// If this is changed, make sure it is also changed in MV side under qml/Event/characterSelectBox
PYRO.FTE.FOLLOWERID = 500;
PYRO.FTE.TargetFollowers = false;
PYRO.FTE.TrackedFollowers = 0;
PYRO.FTE.PlayerEvent = 0;

let _char = Game_Interpreter.prototype.character
Game_Interpreter.prototype.character = function(param) {
    if(param >= PYRO.FTE.FOLLOWERID && !PYRO.FTE.FollowersAreEvents)
        return $gamePlayer._followers._data[param - PYRO.FTE.FOLLOWERID];
    else if(param == -1 && PYRO.FTE.FollowersAreEvents)
        return $gameMap._events.find((event, index) => event && event._eventId == PYRO.FTE.PlayerEvent); 
    else
        return _char.call(this, param)
};


// Everything from here on out works, but it's actually not needed at all if you just want to control followers. 

// Followers to events
Game_Interpreter.prototype.command1005 = function() {

    if(PYRO.FTE.TrackedFollowers > 0)
        return true;

    PYRO.FTE.FollowersAreEvents = true;
    PYRO.FTE.TrackedFollowers = 0;
    //$gamePlayer.hideFollowers();
    $gamePlayer.setTransparent(true);
    let followers = $gamePlayer.getFollowers()._data;
    
    for (let i = 0; i < followers.length; i++) {

        let follower = followers[i];

        if(follower._characterName === '')
            continue;

        this.createCopy(follower);
    }

    this.createCopy($gamePlayer);
    PYRO.FTE.PlayerEvent = 500 + PYRO.FTE.TrackedFollowers - 1; 

    $gamePlayer.refresh();
    return true;
}

Game_Interpreter.prototype.createCopy = function(old) {

    let spriteset = SceneManager._scene._spriteset;

    let eventId = PYRO.FTE.FOLLOWERID + PYRO.FTE.TrackedFollowers;

    let event = new Game_Event($gameMap.mapId, 1);
    event._eventId = eventId;
    
    $gameMap._events[eventId] = event;
    
    event.locate(old.x, old.y);

    event.setImage(old._characterName, old._characterIndex);
    event.setDirection(old.direction());

    var sprite = new Sprite_Character(event);
    spriteset._characterSprites.push(sprite);
    spriteset._tilemap.addChild(sprite);
    sprite.update();
    
    PYRO.FTE.TrackedFollowers++;
}

Game_Event.prototype.isFake = function() {
    if(this._eventId >= PYRO.FTE.FOLLOWERID)
        return true;
}

PYRO.FTE._event = Game_Event.prototype.event;
Game_Event.prototype.event = function () {
    if(this.isFake())
        return {
            
            id: this._eventId,
            name: "Follower " + (this._eventId - PYRO.FTE.FOLLOWERID),
            note: "",
            // completely empty page! Replace this if you want them to have stuff in them for some reason?
            pages: [{"conditions":{"actorId":1,"actorValid":false,"itemId":1,"itemValid":false,"selfSwitchCh":"A","selfSwitchValid":false,"switch1Id":1,"switch1Valid":false,"switch2Id":1,"switch2Valid":false,"variableId":1,"variableValid":false,"variableValue":0},"directionFix":false,"image":{"characterIndex":0,"characterName":"","direction":2,"pattern":0,"tileId":0},"list":[{"code":0,"indent":0,"parameters":[]}],"moveFrequency":3,"moveRoute":{"list":[{"code":0,"parameters":[]}],"repeat":true,"skippable":false,"wait":false},"moveSpeed":3,"moveType":0,"priorityType":0,"stepAnime":false,"through":false,"trigger":0,"walkAnime":true}],
            meta: "",
            metaArray: [],
            illegalJump: false,
            x: 0,
            y: 0
        }
    else
        return PYRO.FTE._event.call(this);
};

// Events to followers
Game_Interpreter.prototype.command1006 = function() {

    if(PYRO.FTE.TrackedFollowers == 0)
        return true;

    PYRO.FTE.FollowersAreEvents = false;
    PYRO.FTE.TrackedFollowers = 0;
    let followers = $gamePlayer.getFollowers()._data;

    var del = $gameMap._events.filter((event, index) => event._eventId >= PYRO.FTE.FOLLOWERID)
   
    //$gamePlayer.showFollowers();
    $gamePlayer.setTransparent(false);

    for (let index = 0; index < del.length - 1; index++) {
        let follower = followers[index];
        follower.locate(del[index].x, del[index].y);
    }

    let playerevent = del[del.length - 1];
    $gamePlayer.locate(playerevent.x, playerevent.y);

    for (let index = 0; index < del.length; index++) {
        const element = del[index];
        element.erase();
    }
    
    let sprites = SceneManager._scene._spriteset._characterSprites;

    SceneManager._scene._spriteset._characterSprites = sprites.filter((event, index) => event._character._eventId < PYRO.FTE.FOLLOWERID) 
    $gameMap._events = $gameMap._events.filter((event, index) => event._eventId < PYRO.FTE.FOLLOWERID)

    $gamePlayer.refresh();
    return true;
}


PYRO.FTE._Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function (command, args) {
    PYRO.FTE._Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'FTE') {
        this.command1005();
    } else if(command === "ETF")
        this.command1006(); 
        
};


/*#
    I HATE TDS I HATE TDS I HATE TDS I HATE TDS I HATE TDS I HATE TDS I HATE TDS I HATE TDS I HATE TDS I HATE TDS 

                                        Character_Movement_Graphics fix
    
    I HATE TDS I HATE TDS I HATE TDS I HATE TDS I HATE TDS I HATE TDS I HATE TDS I HATE TDS I HATE TDS I HATE TDS 
*/

Game_Follower.prototype.updateMovementGraphics = function() {
  if (this.canUpdateMovementGraphics()) {
    var actor = this.movementGraphicsSource();
    var graphics = actor ? actor._characterMovementGraphics : this._characterMovementGraphics;

    if (graphics) {
      this.applyMovementGraphics(graphics);
    }
  }
  this.updateToast();
};

// Picks the correct graphic entry for the current state and applies it.
Game_Follower.prototype.applyMovementGraphics = function(graphics) {
  this.patchBasilClimbGraphic(graphics);

  var entry = this.currentMovementGraphicEntry(graphics);
  if (!entry) return;

  if (this.characterName() === entry.name && this.characterIndex() === entry.index) {
    return; // already showing this graphic
  }

  var bitmap = ImageManager.loadCharacter(entry.name);
  if (!bitmap.isReady()) return;

  // ULTRA SPECIAL PYRO PATCH :D
  
  if(!this._moveRoute)
    this.setImage(entry.name, entry.index);
};

// Determines which graphic entry (climbing/running/walking/idle) applies right now.
Game_Follower.prototype.currentMovementGraphicEntry = function(graphics) {
  if (this.isClimbing()) {
    return graphics.climbing || null;
  }
  if (this.isMoving()) {
    return this.shouldUseRunningGraphics() ? (graphics.running || null) : (graphics.walking || null);
  }
  // Idle only counts after standing still for a bit
  return (graphics.idle && this._stopCount > 0) ? graphics.idle : null;
};

// Special-case: certain Basil graphics always use the dedicated climb sprite.
Game_Follower.prototype.patchBasilClimbGraphic = function(graphics) {
  if (!this.isClimbing()) return;
  var name = this.characterName();
  if (name === "DW_BASIL" || name === "$DW_BASIL_RUN%(8)") {
    this._characterMovementGraphics.climbing = { name: "DW_Climb", index: 0 };
  }
};

Game_Follower.prototype.flushRoute = function() {
    this._moveRoute = null;
    this._moveRouteIndex = 0;
    this._moveRouteForcing = false;
}