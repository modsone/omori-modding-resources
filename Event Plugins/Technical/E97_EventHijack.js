/*:
 * @author Eggshell97
 * @plugindesc Lets the player control events instead of the player object.
 *
 * @help
 * This Plugin was created for the express purpose of letting me make abilities more easily.
 *
 * While controlling an event, the player object will not move, and menu is disabled.
 * The event's autonomous movement should stop, but may have issues.
 * Parallel events will still run while being controlled.
 * It is recommended to ONLY use this on Same as Character priority events.
 * Sprinting does not work while an event is being controlled.
 * Notetags can be used to run event commands before, during, and after hijacking an event.
 * Player Touch and Event Touch events can optionally detect controlled events.
 * 
 * $gameMap.event(#).hijackEvent(); // Makes the player begin controlling this event.
 *                                  // Can be used to switch which event is controlled without using stopHijack.
 * $gameMap.event(#).stopHijack();  // Makes the player stop controlling this event.
 *
 *
 * <Hijack Action Page: #>          // When an event has this tag, pressing cancel while controlling it will run this page.
 *                                  // The page's conditions and other information are ignored.
 *                                  // However, if the page trigger is Parallel, then it will run like a parallel event, but once.
 *
 *
 * <Hijack Start Page: #>           // This page behaves like the previous tag.
 *                                  // This one will run when the event starts being controlled.
 *
 *
 * <Hijack End Page: #>             // This one will run when the event stops being controlled.
 *                                  // When parallel, this will not stop running until the interpreter finishes.
 *                                  // The other two are forced to stop when the event stops being controlled.
 *
 *
 * <CanDetectHijacks>               // Events with this tag with the Player Touch or Event Touch triggers will detect controlled events.
 *                                  // Without this tag, controlled events will be ignored by these triggers.
 *
*/

// Override to prevent player from moving while an event is being controlled
const old_canMove = Game_Player.prototype.canMove;

Game_Player.prototype.canMove = function() {
	if ($gamePlayer._hijackingEvent) {
		return false;
	} else {
		return old_canMove.call(this);
	}
};

// Override to get inputs to work using the Game_Event's update function
// Autorun events would be problematic anyway, so I used this
// If someone asks for autorun functionality, then I'll just figure out how to make my own update function
// I don't think overriding the event one entirely is the best idea
//const old_checkEventTriggerAuto = Game_Event.prototype.checkEventTriggerAuto;

//Game_Event.prototype.checkEventTriggerAuto = function () {
//    if (this._hijacked) {
//		if (this.eventId() != $gamePlayer._hijackedEventId || !$gamePlayer._hijackingEvent) {
//			this._hijacked = false;
//			return old_checkEventTriggerAuto.call(this);
//		}
//        if (this._hijackAction && Input.isTriggered('cancel')) {
//			if (this._hijackInterpreter) {
//				this._hijackInterpreter.setup(this._hijackAction, $gamePlayer._hijackedEventId);
//			} else {
//				$gameMap._interpreter.setup(this._hijackAction, $gamePlayer._hijackedEventId);
//			}
//		}
//    } else {
//		return old_checkEventTriggerAuto.call(this);
//	}
//};

Game_Event.prototype.checkHijackInput = function() {
	if (this._hijacked) {
		if (this._hijackAction && Input.isTriggered('cancel')) {
			if (this._hijackInterpreter) {
				this._hijackInterpreter.setup(this._hijackAction, this.eventId());
			} else {
				$gameMap._interpreter.setup(this._hijackAction, this.eventId());
			}
		}
	}
}

// Repurposed code from Game_Player, this part was replaced with an override for now
//Game_Event.prototype.moveByInput = function() {
//    if (!this.isMoving() && this.canMove()) {
//        var direction = this.getInputDirection();
//        if (direction > 0) {
//            $gameTemp.clearDestination();
//        } else if ($gameTemp.isDestinationValid()){
//            var x = $gameTemp.destinationX();
//            var y = $gameTemp.destinationY();
//            direction = this.findDirectionTo(x, y);
//        }
//        if (direction > 0) {
//            this.executeMove(direction);
//        }
//    }
//};

// Override of moveByInput
const old_moveByInput = Game_Player.prototype.moveByInput;

Game_Player.prototype.moveByInput = function() {
	if ($gamePlayer._hijackingEvent) {
		if (!$gameMap.event($gamePlayer._hijackedEventId).isMoving() && $gameMap.event($gamePlayer._hijackedEventId).canMove()) {
			var direction = this.getInputDirection();
			if (direction > 0) {
				$gameTemp.clearDestination();
			} else if ($gameTemp.isDestinationValid()){
				var x = $gameTemp.destinationX();
				var y = $gameTemp.destinationY();
				direction = $gameMap.event($gamePlayer._hijackedEventId).findDirectionTo(x, y);
			}
			if (direction > 0) {
				$gameMap.event($gamePlayer._hijackedEventId).executeMove(direction);
			}
		}
	} else {
		return old_moveByInput.call(this);
	}
};

Game_Event.prototype.canMove = function() {
    if ($gameMap.isEventRunning() || $gameMessage.isBusy()) {
        return false;
    }
    if (this.isMoveRouteForcing()) {
        return false;
    }
    return true;
};

Game_Event.prototype.getInputDirection = function() {
    return Input.dir4;
};

Game_Event.prototype.executeMove = function(direction) {
    this.moveStraight(direction);
};

// Hijack function
Game_Event.prototype.hijackEvent = function() {
	this._hijacked = true;
	$gamePlayer._hijackingEvent = true;
	$gamePlayer._hijackedEventId = this.eventId();
	$gameSystem.disableMenu();
	if ($dataMap.events[this.eventId()].meta['Hijack Start Page']) {
		this._hijackStartPage = $dataMap.events[this.eventId()].pages[parseInt($dataMap.events[this.eventId()].meta['Hijack Start Page']) - 1];
		this._hijackStartAction = this._hijackStartPage.list;
	} else {
		this._hijackStartPage = null;
		this._hijackStartAction = null;
	}
	if ($dataMap.events[this.eventId()].meta['Hijack Action Page']) {
		this._hijackPage = $dataMap.events[this.eventId()].pages[parseInt($dataMap.events[this.eventId()].meta['Hijack Action Page']) - 1];
		this._hijackAction = this._hijackPage.list;
	} else {
		this._hijackPage = null;
		this._hijackAction = null;
	}
	if ($dataMap.events[this.eventId()].meta['Hijack End Page']) {
		this._hijackEndPage = $dataMap.events[this.eventId()].pages[parseInt($dataMap.events[this.eventId()].meta['Hijack End Page']) - 1];
		this._hijackEndAction = this._hijackEndPage.list;
	} else {
		this._hijackEndPage = null;
		this._hijackEndAction = null;
	}
	if (this._moveRoute) {
		this.processRouteEnd();
	}
	if (this._hijackStartPage) {
		if (this._hijackStartPage.trigger === 4) {
			this._hijackStartInterpreter = new Game_Interpreter();
		} else {
			this._hijackStartInterpreter = null;
		}
	}
	if (this._hijackPage) {
		if (this._hijackPage.trigger === 4) {
			this._hijackInterpreter = new Game_Interpreter();
		} else {
			this._hijackInterpreter = null;
		}
	}
	if (this._hijackEndPage) {
		if (this._hijackEndPage.trigger === 4) {
			this._hijackEndInterpreter = new Game_Interpreter();
		} else {
			this._hijackEndInterpreter = null;
		}
	}
	if (this._hijackStartAction) {
		if (this._hijackStartInterpreter) {
			this._hijackStartInterpreter.setup(this._hijackStartAction, this.eventId());
		} else {
			$gameMap._interpreter.setup(this._hijackStartAction, this.eventId());
		}
	}
	// This disables the event's automatic movement
	this._moveType = 0;
	//This was supposed to stop the event's parallel processing, but it doesn't work
//	if (this._interpreter) {
//		this._interpreter.terminate();
//	}
};

// Stop hijack
Game_Event.prototype.stopHijack = function() {
	if (this._hijackEndAction) {
		if (this._hijackEndInterpreter) {
			this._hijackEndInterpreter.setup(this._hijackEndAction, this.eventId());
		} else {
			$gameMap._interpreter.setup(this._hijackEndAction, this.eventId());
		}
	}
	if (this._hijackStartInterpreter) {
		this._hijackStartInterpreter.terminate();
		this._hijackStartInterpreter = null;
	}
	if (this._hijackInterpreter) {
		this._hijackInterpreter.terminate();
		this._hijackInterpreter = null;
	}
	this._hijacked = false;
	$gameSystem.enableMenu();
	$gamePlayer._hijackingEvent = false;
}

// Stop hijack soft
// This is what events will automatically run when they detect that they are no longer hijacked
Game_Event.prototype.stopHijackSoft = function() {
	if (this._hijackEndAction) {
		if (this._hijackEndInterpreter) {
			this._hijackEndInterpreter.setup(this._hijackEndAction, this.eventId());
		} else {
			$gameMap._interpreter.setup(this._hijackEndAction, this.eventId());
		}
	}
	if (this._hijackStartInterpreter) {
		this._hijackStartInterpreter.terminate();
		this._hijackStartInterpreter = null;
	}
	if (this._hijackInterpreter) {
		this._hijackInterpreter.terminate();
		this._hijackInterpreter = null;
	}
	this._hijacked = false;
}

// Function to update the interpreters, which is run by the event's update
// This is also where the end interpreter destroys itself on completion
// Or it would be, if that had worked
Game_Event.prototype.updateHijackInterpreters = function() {
	if (this._hijackStartInterpreter) {
		this._hijackStartInterpreter.update();
	}
	if (this._hijackInterpreter) {
		this._hijackInterpreter.update();
	}
	if (this._hijackEndInterpreter) {
		this._hijackEndInterpreter.update();
		if (!this._hijackEndInterpreter.isRunning() && !this._hijacked) {
			this._hijackEndInterpreter.terminate();
			this._hijackEndInterpreter = null;
		}
	}
}

// I wasn't going to touch the event's update function, but I wanted normal inputs to work
// Instead I'll disable the menu later
const old_eventUpdate = Game_Event.prototype.update;

Game_Event.prototype.update = function() {
	if (this._hijacked) {
		var wasMoving = this.isMoving();
	}
	// Add any new parts after the old one is called
	// The wasMoving thing needs to be partially before and after
	old_eventUpdate.call(this);
	if (this._hijacked) {
		if (!this.isMoving()) {
			this.updateNonmoving(wasMoving);
		}
		this.checkHijackInput();
		if (this.eventId() != $gamePlayer._hijackedEventId || !$gamePlayer._hijackingEvent) {
			this.stopHijackSoft();
		}
	}
	if (this._hijackStartInterpreter || this._hijackInterpreter || this._hijackEndInterpreter) {
		this.updateHijackInterpreters();
	}
}

// Copied and modified from Game_player in rpg_objects.js
Game_Event.prototype.updateNonmoving = function(wasMoving) {
    if (!$gameMap.isEventRunning()) {
        if (wasMoving) {
            this.checkEventTriggerHere([1,2]);
            if ($gameMap.setupStartingEvent()) {
                return;
            }
        }
        if (this.triggerAction()) {
            return;
        }
        if (wasMoving) {
			
        } else {
            $gameTemp.clearDestination();
        }
    }
};

Game_Event.prototype.triggerAction = function() {
    if (this.canMove()) {
        if (this.triggerButtonAction()) {
            return true;
        }
        if (this.triggerTouchAction()) {
            return true;
        }
    }
    return false;
};

Game_Event.prototype.triggerButtonAction = function() {
    if (Input.isTriggered('ok')) {
        this.checkEventTriggerHere([0]);
        if ($gameMap.setupStartingEvent()) {
            return true;
        }
		// Originally this would also check triggers 1 and 2
		// I disabled them because I couldn't figure out the notetags
        this.checkEventTriggerThere([0]);
        if ($gameMap.setupStartingEvent()) {
            return true;
        }
    }
    return false;
};

Game_Event.prototype.checkEventTriggerHere = function(triggers) {
    if (this.canStartLocalEvents()) {
        this.startMapEvent(this.x, this.y, triggers, false);
    }
};

Game_Event.prototype.checkEventTriggerThere = function(triggers) {
    if (this.canStartLocalEvents()) {
        var direction = this.direction();
        var x1 = this.x;
        var y1 = this.y;
        var x2 = $gameMap.roundXWithDirection(x1, direction);
        var y2 = $gameMap.roundYWithDirection(y1, direction);
        this.startMapEvent(x2, y2, triggers, true);
        if (!$gameMap.isAnyEventStarting() && $gameMap.isCounter(x2, y2)) {
            var x3 = $gameMap.roundXWithDirection(x2, direction);
            var y3 = $gameMap.roundYWithDirection(y2, direction);
            this.startMapEvent(x3, y3, triggers, true);
        }
    }
};

Game_Event.prototype.startMapEvent = function(x, y, triggers, normal) {
    if (!$gameMap.isEventRunning()) {
        $gameMap.eventsXy(x, y).forEach(function(event) {
            if ((event.isTriggerIn(triggers) && event.isNormalPriority() === normal) && (triggers.includes(0) || ($dataMap.events[event.eventId()].meta['CanDetectHijacks'] || $dataMap.events[event.eventId()].meta['OnlyDetectHijacks'] || $dataMap.events[event.eventId()].meta['OnlyDetectsHijacks']))) {
                event.start();
            }
        });
    }
};

Game_Event.prototype.canStartLocalEvents = function() {
    return this._hijacked;
};

// Why did I decide to make touch actions work?
// Actually, I have no idea what any of this does
Game_Event.prototype.triggerTouchAction = function() {
    if ($gameTemp.isDestinationValid()){
        var direction = this.direction();
        var x1 = this.x;
        var y1 = this.y;
        var x2 = $gameMap.roundXWithDirection(x1, direction);
        var y2 = $gameMap.roundYWithDirection(y1, direction);
        var x3 = $gameMap.roundXWithDirection(x2, direction);
        var y3 = $gameMap.roundYWithDirection(y2, direction);
        var destX = $gameTemp.destinationX();
        var destY = $gameTemp.destinationY();
        if (destX === x1 && destY === y1) {
            return this.triggerTouchActionD1(x1, y1);
        } else if (destX === x2 && destY === y2) {
            return this.triggerTouchActionD2(x2, y2);
        } else if (destX === x3 && destY === y3) {
            return this.triggerTouchActionD3(x2, y2);
        }
    }
    return false;
};

Game_Event.prototype.triggerTouchActionD1 = function(x1, y1) {
    //if ($gameMap.airship().pos(x1, y1)) {
    //    if (TouchInput.isTriggered() && this.getOnOffVehicle()) {
    //        return true;
    //    }
    //}
    this.checkEventTriggerHere([0]);
    return $gameMap.setupStartingEvent();
};

Game_Event.prototype.triggerTouchActionD2 = function(x2, y2) {
    //if ($gameMap.boat().pos(x2, y2) || $gameMap.ship().pos(x2, y2)) {
    //    if (TouchInput.isTriggered() && this.getOnVehicle()) {
    //        return true;
    //    }
    //}
    //if (this.isInBoat() || this.isInShip()) {
    //    if (TouchInput.isTriggered() && this.getOffVehicle()) {
    //        return true;
    //    }
    //}
    this.checkEventTriggerThere([0,1,2]);
    return $gameMap.setupStartingEvent();
};

Game_Event.prototype.triggerTouchActionD3 = function(x2, y2) {
    if ($gameMap.isCounter(x2, y2)) {
        this.checkEventTriggerThere([0,1,2]);
    }
    return $gameMap.setupStartingEvent();
};

// FOR EVENT TOUCH TRIGGERS I HAVE TO OVERRIDE BOTH THE gamePlayer.pos AND THE checkEventTriggerTouch FUNCTIONS
// The first one needs to return the hijacked event's position (check for potential problems)
// The second one needs to check to see if an event is being controlled
// Be sure to make a notetag for EVENT PAGES (not the whole event) to check if hijacked events can be detected
// Or if ONLY hijacked events can be detected
// UPDATE: Page notetags are a pain. Abandon run
const old_eventCheckEventTriggerTouch = Game_Event.prototype.checkEventTriggerTouch;

Game_Event.prototype.checkEventTriggerTouch = function (x, y) {
	if ($dataMap.events[this.eventId()].meta['CanDetectHijacks']) {
		old_eventCheckEventTriggerTouch.call(this);
	} else if ($dataMap.events[this.eventId()].meta['OnlyDetectHijacks'] || $dataMap.events[this.eventId()].meta['OnlyDetectsHijacks']) {
		
	} else {
		return false;
	}
	if (!$gamePlayer._hijackingEvent) {
		return false;
	}
    if (!$gameMap.isEventRunning()) {
        if (this._trigger === 2 && $gameMap.event($gamePlayer._hijackedEventId).pos(x, y)) {
            if (!this.isJumping() && this.isNormalPriority()) {
                this.start();
            }
        }
    }
};

// Currently the OnlyDetectHijacks tag is broken
// The only way to fix it is by overriding Game_Player's startMapEvent entirely, which seems a bit risky