/*:
 * @plugindesc Extra Undertale Battle Plugin Configs V2.0.0
 * @author Geo
 *
 * @help
 * To not clutter the old plugin with even more functionalities and variables, this plugin was made
 * in order to add new configs, vars and more flexibity with the purpose of keeping the plugin organized!
 * 
 * Functions to be used in 
 * "Direct Code" in a bullet's code:
 * 
 * Create a new child attack for a bullet    - this.createChildAttack(index, x, y)
 * 
 * Variables to be used in 
 * "Direct Code" in a bullet's code:
 *
 * Child attack's parent properties         - this._parentAttack
 * Destroy On Touch                         - this.destroyUponTouch
 * Vertical Frames                          - this.aniverticalFrames
 * Vertical Current Frame                   - this._verticalFrame
 * No Damage                                - this.noDamage
 * Collide On Box     - this.boxCollision (use this for the attack to check whenever a bullet collides
 * on the box's boundaries)
 * Following above, variables utilized to check what boundary the bullet has hit :
 * Left - this._collidedLeft; Right - this._collidedRight; Up - this.collidedUp; Down - this._collidedDown;
 * General Check - this.checkCollision();
 *
 * @param Destroy On Touch
 * @desc if 'true', bullets will be destroyed upon touch.
 * @default 
 *
 */
 
var beesList = beesList || {}; beesList.UTConf = beesList.UTConf || {};
var params = PluginManager.parameters('Geo_ExtraUTConfigs');
 
var destroyUponTouch = String(params['Destroy On Touch']);

// ------------------------------------------------- 
// All stuff from below is from the original plugin, some code is overriden for the sake of implementing/tweaking stuff :tm:
// ------------------------------------------------- 
 
beesList.UTConf.oldloadUTBTagsFromSkillsPart2 = SRD.UTB.loadUTBTagsFromSkillsPart2;
SRD.UTB.loadUTBTagsFromSkillsPart2 = function(matchResult, skills, i, index) {
	beesList.UTConf.oldloadUTBTagsFromSkillsPart2.call(this, matchResult, skills, i, index);
	var destroyUponTouch = /\s*Destroy\s*On\s*Touch\s*:\s*(.*)/im;
	var verticalSheet = /\s*Vertical\s*Animations\s*:\s*(.*)/im;
	var noDamage = /\s*No\s*Damage\s*:\s*(.*)/im;
	var boxCollision = /\s*Collide\s*On\s*Box\s*:\s*(.*)/im;
	var renderBoundaries = /\s*Only\s*Render\s*In\s*Box\s*:\s*(.*)/im;
	var heal = /\s*Heal\s*Amount\s*:\s*(.*)/im;
	if (matchResult[1].match(destroyUponTouch)) {
		skills[i].utb_attack[index].destroyUponTouch = RegExp.$1;
	} else {
		skills[i].utb_attack[index].destroyUponTouch = destroyUponTouch;
	}
	if(matchResult[1].match(verticalSheet)) {
		skills[i].utb_attack[index].aniverticalFrames = RegExp.$1;
	} else {
		skills[i].utb_attack[index].aniverticalFrames = 0;
	}
	if(matchResult[1].match(noDamage)) {
	    skills[i].utb_attack[index].noDamage = RegExp.$1;
    } else {
	    skills[i].utb_attack[index].noDamage = false;
	}
	if(matchResult[1].match(boxCollision)) {
	    skills[i].utb_attack[index].boxCollision = RegExp.$1;
    } else {
	    skills[i].utb_attack[index].boxCollision = false;
	}
	if(matchResult[1].match(renderBoundaries)) {
	    skills[i].utb_attack[index].renderBoundaries = RegExp.$1;
    } else {
	    skills[i].utb_attack[index].renderBoundaries = false;
	}
	if(matchResult[1].match(heal)) {
	    skills[i].utb_attack[index].healing = RegExp.$1;
    } else {
	    skills[i].utb_attack[index].healing = 0;
	}
};


if (Imported.YEP_BattleEngineCore) {
	var _BattleManager_updatePhase = BattleManager.updatePhase;
	BattleManager.updatePhase = function() {
		var checkAction = (this._phaseSteps[0] === 'target' && this._action.isForOne()) || (this._phaseSteps[0] === 'whole' && (this._action.isForAll() || this._action.isForRandom()));
		if (this._subject.isEnemy() && this._action.item().utb_usage && checkAction) {
			if(!$gameMessage.isBusy()) this.updateDaUTB();
		} else {
			_BattleManager_updatePhase.call(this);
		}
		if (this._action.hasIndicated) { return; };
		if (this._subject.isEnemy() && this._action.item().utb_usage && !this._action.hasIndicated) {
			var target = (this._action.isForAll() || this._action.isForRandom()) !== true ? this._targets.shift() : this._targets;
		    // check if omori's battle HUD exists. in the case it's decided this plugin will go for other projects, remove this
		    var faceWindows = SceneManager._scene._faceWindows ? SceneManager._scene._faceWindows : false;
		    if (faceWindows && target) {
			    BattleManager.makeTargetIndicators(target, faceWindows);
		    };
			this._action.hasIndicated = true;
		};
	};
} else {
	var _BattleManager_updateAction = BattleManager.updateAction;
	BattleManager.updateAction = function() {
		if(this._subject.isEnemy() && this._action.item().utb_usage) {
			if(!$gameMessage.isBusy()) this.updateDaUTB();
		} else {
			_BattleManager_updateAction.call(this);
		}
	};
}

BattleManager.updateDaUTB = function() {
	if(!this._battleMovementFrameWindow.isActivated()) {
		this._battleMovementFrameWindow.activate();
		// this._singleActorHP.open(); omori already shows actor hp on the battle screen- there's no need to fix the layering on this
		var target = (this._action.isForAll() || this._action.isForRandom()) !== true ? this._targets.shift() : this._targets;
		if (target) {
			this._battleMovementFrameWindow.transferVariables(this._subject, target, this._action);
			// this._singleActorHP.setActor(target);
			if(SRD.UTB.isHUDImported) this._statusWindow.setFocusUTBActor(target);
			// this._singleActorHP.refresh();
		} else {
			BattleManager.endUTBAttack();
		}
		this._utbActivity = true;
	}
	if(this._statusWindow.isOpen() && !SRD.UTB.isHUDImported) {
		this._statusWindow.close();
	}
	this._battleMovementFrameWindow.masterRefresh();
	if(!SRD.UTB.isHUDImported) this._singleActorHP.refresh();
	else this._statusWindow.updateFocusUTBActor();
};

UndertaleBattleSystem.prototype.transferVariables = function(subject, target, action) {
	this._subject = subject;
	this._action = action;
	this._item = action.item();
	this._target = target;
	if (this._target && this._action.isForAll()) {
        this._targetFace = $gameParty.members()[0].characterName();
        this._targetIndex = $gameParty.members()[0].characterIndex();
		var targetAll = true;
    } else 
	if (this._target && this._action.isForRandom() && Array.isArray(this._target)) {
		var rActor = this._target[Math.floor(Math.random() * this._target.length)];
		this._targetFace = rActor.characterName();
        this._targetIndex = rActor.characterIndex();
		var targetRandom = true;
	} else
	if (this._target && this._target.isActor()) {
		this._target = [target];
		this._targetFace = this._target[0].characterName();
		this._targetIndex = this._target[0].characterIndex();
	};
	this._player.setMode(this._item.utb_mode);
	if (targetAll) { this._player.setActor($gameParty.members()[0]); }
	else if (targetRandom) { this._player.setActor(rActor); }
	else { this._player.setActor(this._target[0]); };
	if(this._item && this._item.utb_inicode) {
		eval(this._item.utb_inicode);
	}
	if(this._item.utb_invincibility) this._invincibility = this._item.utb_invincibility;
};

UndertaleBattleSystem.prototype.refresh = function() {
	var p = this._player;
	var f = Math.floor(this._i);
	this._trapBackground.x = this.window.x;
	this._trapBackground.y = this.window.y;

	if(SRD.UTB.autoSaveText && f === 2 && $gameMessageBubble.hasSavedText()) {
		$gameMessageBubble.useText();
	}

	if(this._item && this._item.utb_code) {
		eval(this._item.utb_code);
	}

	for(var i = 0; i < this._enemies.length; i++) {
		if(this._enemies[i]) {
			this._enemies[i].move(this.window.x, this.window.y, this.window.width, this.window.height, this._speed);
			if(!this._enemies[i]) continue;

			if(this._enemies[i].checkCollisionPlayer(p) && p.invincibleTime === 0 && !this._enemies[i].noDamage) {
                for (var b = 0; b < this._target.length; b++) {
                    var heal = this._enemies[i].healing;					
				    if (heal) {
					    this._target[b].gainHp(heal);
						this._target[b].startDamagePopup()
					    AudioManager.playSe({"name":"BA_Heart_Heal","pan":0,"pitch":100,"volume":90});
				    } else {
				        this._action.apply(this._target[b]);
						if (this._target[b].hp > 0) {
					        AudioManager.playSe({"name":SRD.UTB.damageSE,"pan":0,"pitch":100,"volume":90});
				        } else {
					        AudioManager.playSe({"name":SRD.UTB.death1Se,"pan":0,"pitch":100,"volume":90});
				        };
                    };				
				    this._target[b].refresh();
				};
				if (!heal) { p.setInvincibleTime(this._invincibility) };
				if (this._enemies[i].destroyUponTouch) {
					this._enemyHolder.removeChild(this._enemies[i]);
				    this._enemies.delete(i);
				    i--;
					continue;
				}
						   
											 
			}

			if(this._enemies[i].destructible && p.mode >= 4 && p.mode < 5) {
				for(var j = 0; j < p.bullets.length; j++) {
					if(this._enemies[i].checkCollisionCircle(p.bullets[j].x, p.bullets[j].y, 5)) {
						this._enemies[i].startDestroy(i);
						this.removeChild(p.bullets[j]);
						p.bullets.delete(j);
						i--;
						j = p.bullets.length;
					}
				}
			}

			if(!this._item.utb_deleteOutsideFrame) {
				if(this._enemies[i] && this._enemies[i].needsDelete(0, Graphics.width, 0, Graphics.height)) {
					this._enemyHolder.removeChild(this._enemies[i]);
					this._enemies.delete(i);
					i--;
				}
			} else {
				if(this._enemies[i] && this._enemies[i].needsDelete(this.boundingBox('left'), this.boundingBox('right'), 
					this.boundingBox('up'), this.boundingBox('down'))) {
					this._enemyHolder.removeChild(this._enemies[i]);
					this._enemies.delete(i);
					i--;
				}
			}

			if(p.mode == 2 && this._enemies[i] && this._enemies[i].checkCollisionShield(p.getShieldRect())) {
				AudioManager.playSe({"name":SRD.UTB.shieldSE,"pan":0,"pitch":100,"volume":90});
				this._enemyHolder.removeChild(this._enemies[i]);
				this._enemies.delete(i);
				i--;
			}
			// box collision check, requires extraUTConfigs
			if(this._enemies[i] && this._enemies[i].boxCollision) {
				this._enemies[i].checkCollision(this.boundingBox('left'), this.boundingBox('right'), this.boundingBox('up'), this.boundingBox('down'));
			};
		}
	}
	if(this._item && this._item.utb_attack) {
		for(var i = 0; i < this._item.utb_attack.length; i++) {
			if(this._item.utb_attack[i] && Number(this._item.utb_attack[i].spawnRate) > 0) {
				var rate = Number(this._item.utb_attack[i].spawnRate);
				var delay = Number(this._item.utb_attack[i].spawnDelay);
				if(f > delay && (f - delay) % rate === 0 && this._i3 != f) {
					this.createAttack(i + 1);
				}
			}
		}
	}

	if(this._greenShield.visible && p.mode != 2) this._greenShield.visible = false;
	if(!this._greenShield.visible && p.mode == 2) this._greenShield.visible = true;

	if(this._trapBackground.visible && p.mode != 3) this._trapBackground.visible = false;
	if(!this._trapBackground.visible && p.mode == 3) this._trapBackground.visible = true;

	if(f >= BattleManager.UTBAttackDuration()) {
		BattleManager.endUTBAttack();
	}
	this._i += this._speed;
	if(this._frameCount % 8 === 0) {
		this._i2 = !this._i2;
	}

	if(this._target && this._target.hp <= 0) {
		this._isPlayerDying = true;
	}

	this._i3 = f;
	this._frameCount++;
};

Undertale_Enemy.prototype.initialize = function(utb, window, p) {
	Sprite_Base.prototype.initialize.call(this);
	this.window = window;
	this._player = p;
	this.type = String(utb.type);
	this.directCode = String(utb.directCode);
	this.iniCode = String(utb.iniCode);
	this.image = (utb.image) ? String(utb.image) : 0;
	this.aniFrames = (utb.aniFrames) ? parseInt(utb.aniFrames) : 1;
	this.aniSpeed = (utb.aniSpeed) ? parseInt(utb.aniSpeed) : 0;
	this.aniverticalFrames = (utb.aniverticalFrames) ? parseInt(utb.aniverticalFrames) : 0;
	this.x = eval(utb.initX);
	this.y = eval(utb.initY);
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.shape = String(utb.collision);
	this.destructible = eval(utb.destructible);
	this.destroyUponTouch = eval(utb.destroyUponTouch);
	this.noDamage = eval(utb.noDamage);
	this.healing = eval(utb.healing);
	this.deleteDistance = Number(utb.deleteDistance);
	this.boxCollision = eval(utb.boxCollision);
	this.boundaries = eval(utb.renderBoundaries);
	this.scale.x = eval(utb.scaleX);
	this.scale.y = eval(utb.scaleY);
	this.opacity = eval(utb.opacity);
	// Moved rotation to the attack's startup
	//this._rotation = 0;
	//this.rotation = 0;
	this.startRotation = eval(utb.rotation);
	this.visibility = eval(utb.visibility);
	this.radius = eval(utb.radius);
	this._myheight = eval(utb.height);
	this._mywidth = eval(utb.width);
	this.frame = 0;
	this.color = function() {
		var temp = String(utb.color).trim().toLowerCase();
		if(temp === 'random') temp = SRD.UTB.getRandomColor();
		return temp;
	}.call(this);
	this.bitmap = new Bitmap(this.getWidth(), this.getHeight());
	this.xspeed = eval(utb.staticX);
	this.yspeed = eval(utb.staticY);
	this.xaccel = eval(utb.accelX);
	this.yaccel = eval(utb.accelY);
	this.destroyAnimation = false;
	this.destroyIndex = 0;
	this.battleSystem = null;
	this._needsToBeDeleted = false;
	this._frameWidth = 0;
	this._frameHeight = 0;
	this._currentFrame = 0;
	this._baseBitmap = null;
	this.start(this.window);
};

Undertale_Enemy.prototype.start = function(window) {
	if (this.boundaries) { this.drawBoundaries(); };
	this.drawTheThing();
	eval(this.iniCode);
};

Undertale_Enemy.prototype.refreshFrame = function() {
	if (this.aniverticalFrames) {
		var newheight = Math.floor(this._baseBitmap.height/this.aniverticalFrames);
		this.setFrame(this._currentFrame * this._frameWidth, this._verticalFrame * newheight, this._frameWidth, newheight);
		return;
	};
	this.setFrame(this._currentFrame * this._frameWidth, 0, this._frameWidth, this._frameHeight);
};

Undertale_Enemy.prototype.move = function(speed, window) {
	if(this.destroyAnimation) {
		this.scale.x += 0.02;
		this.scale.y += 0.02;
		this.opacity -= 20;
		if(this.opacity <= 0) {
			this.parent.parent._enemies.delete(this.destroyIndex);
			this.parent.removeChild(this);
		}
	} else {
		var f = this.frame;
		var second = Math.floor(f / 60);
		this.x += this.xspeed;
		this.y += this.yspeed;
		this.xspeed += this.xaccel;
		this.yspeed += this.yaccel;
		if(this.directCode != 0) eval(this.directCode);
		this.frame += 1;
	}
	if(this.aniFrames > 1 && this.aniSpeed > 0 && this.frame % this.aniSpeed === 0) {
		this._currentFrame++;
		if(this._currentFrame+1 > this.aniFrames) this._currentFrame = 0;
		this.refreshFrame();
	}
	this.updateBoundaries();
};

// ------------------------------------------------- 
// end of code override stuff, start of new-ish stuff (some may be, some may not still)
// ------------------------------------------------- 
 
Undertale_Enemy.prototype.createChildAttack = function(index, x, y, amount = 1) {
	var bWindow = SceneManager._scene._battleMovementFrameWindow
	index = (index > 0) ? index - 1 : index;
	if(bWindow._item) {
		this._childAttacks = this._childAttacks || [];
		var utb = bWindow._item.utb_attack[index];
		for (let i = 0; i < amount; i++) {
		    var attack = new Undertale_Enemy(utb, bWindow.window, bWindow._player);
		    attack._parentAttack = this;
		    attack.x = x ? x : attack.x
		    attack.y = y ? y : attack.y
		    this._childAttacks.push(attack);
		    bWindow._enemyHolder.addChild(attack);
		    bWindow._enemies.push(attack);
        };
		return attack;
	};
};

// will move this to another plugin later
// convert this function to be part of the enemy class for less clutter

Undertale_Enemy.prototype.moveTo = function(moveId = 0, endx = this.x, endy = this.y, t = 10, ease) {
	if (this._currentMoveId !== moveId) { this._frameT = 0; this._moveFinished = false; };
	this._currentMoveId = moveId;
	this._duration = t
    if (this._frameT <= this._duration) {	
	    this._frameT = this._frameT || 0
	    this._frameT++;
		switch (ease) {
		case 'easeoutQuart':
		const easeoutQuart = function (a) {return 1 - Math.pow(1 - a, 4)};
		this.x = this.x + (endx - this.x) * easeoutQuart(this._frameT / this._duration);
	    this.y = this.y + (endy - this.y) * easeoutQuart(this._frameT / this._duration);
		break;
		case 'easeinCubic':
		const easeinCubic = function (a) {return a * a * a};
		this.x = this.x + (endx - this.x) * easeinCubic(this._frameT / this._duration);
	    this.y = this.y + (endy - this.y) * easeinCubic(this._frameT / this._duration);
		break;
		case 3:
		// PLACEHOLDER
		break;
		default:		
	    this.x = this.x + (endx - this.x) * this._frameT / this._duration;
	    this.y = this.y + (endy - this.y) * this._frameT / this._duration;
	};
	} else if (this._frameT >= this._duration) { this._moveFinished = true; };
};

Undertale_Enemy.prototype.moveToAngle = function(amoveId = 0, x = this.x, y = this.y, s = 0.1) {
	if (this._currentAMoveId !== amoveId) { this._frameAT = 0; this._pPos = undefined; };
	this._currentAMoveId = amoveId;
	this._pPos = this._pPos || Math.atan2(y - this.y, x - this.x);
    this.x += s * Math.cos(this._pPos);
    this.y += s * Math.sin(this._pPos);
};

Undertale_Enemy.prototype.drawBoundaries = function() {
	this.mask = new PIXI.Graphics();
    this.mask.beginFill(0xffffff);
    this.mask.drawRect(this.window.x + 4, this.window.y + 4, this.window.width - 8, this.window.height - 8);
};

Undertale_Enemy.prototype.updateBoundaries = function() {
	if (!this.boundaries) {
		this.mask = undefined;
		return;
	};
	if (!this.mask) { this.drawBoundaries(); };
	var cWindow = { maxX: (this.window.x + 4) + (this.window.width - 8), maxY: (this.window.y + 4) + (this.window.height - 8)};
	var oWindow = this.mask._bounds;
	if (oWindow.maxX == cWindow.maxX && oWindow.maxY == cWindow.maxY) {
	return;
	};
	this.mask = undefined;
	this.drawBoundaries();
};

// =================================================
// start of omori battle scene indicators
// =================================================

BattleManager.makeTargetIndicators = function(target, faceWindows) {
	for (let i = 0; i < faceWindows.length; i++) {
			// set unique targets
			var uTarget = Array.isArray(target) ? [...new Set(target)] : target;
            var windowActor = faceWindows[i].actor();
			var checkuTarget = Array.isArray(uTarget) ? true : false;
            if (windowActor === uTarget) { SceneManager._scene._faceWindows[i].makeTarget(); };
			if (!checkuTarget) { continue; };	
			if (uTarget.contains(windowActor)) { SceneManager._scene._faceWindows[i].makeTarget(); };
        };
};

Window_OmoriBattleActorStatus.prototype.makeTarget = function() {
  var layers = this._displayLayers;
  // Get Position
  var pos = this._homePosition;
  // Create Indicator
  this._indicator = new Sprite_TargetIndicator();
  this._indicator.x = pos.x 
  this._indicator.y = pos.y
  layers._front.addChild(this._indicator);
};

function Sprite_TargetIndicator() { this.initialize.apply(this, arguments); }
Sprite_TargetIndicator.prototype = Object.create(Sprite.prototype);
Sprite_TargetIndicator.prototype.constructor = Sprite_TargetIndicator;

Sprite_TargetIndicator.prototype.initialize = function() {
  // Super Call
  Sprite.prototype.initialize.call(this);
  // Setup Bitmap
  this._currentFrame = this._currentFrame || 0
  this.setupBitmap();
};

Sprite_TargetIndicator.prototype.setupBitmap = function() {
    // Set Bitmap
    this.bitmap = ImageManager.loadSystem('bsys_selecttargetDT');
    // Get Index
    var bx = 0
    var by = 0
    this.setFrame(bx, by, 114, 164);
};

Sprite_TargetIndicator.prototype.update = function() {
	// Super Call
    Sprite.prototype.update.call(this);
	this._frameCount = this._frameCount || 0;
    this._frameCount++;
	if (this._frameCount % 24 == 0) {
        var by = 0;
		this.setFrame(this._currentFrame, by, 114, 164);
		this._currentFrame += 114
		if (this._currentFrame >= 228) { this._currentFrame = 0; };
	};
	if (this._frameCount >= 175) {
		this.parent.removeChild(this);
	};
};

// =================================================
// end of omori battle scene indicators
// =================================================

Undertale_Enemy.prototype.checkCollision = function(l, r, u, d) {
	var w = (this.getWidth()/2) + this.deleteDistance;
	var h = (this.getHeight()/2) + this.deleteDistance;
	if (this.x - w < l) { this._collidedLeft = true; } else { this._collidedLeft = false; };
	if (this.x + w > r) { this._collidedRight = true; } else { this._collidedRight = false; };
	if (this.y - h < u) { this._collidedUp = true; } else { this._collidedUp = false; };
	if (this.y + h > d) { this._collidedDown = true; } else { this._collidedDown = false; };
	return (this.x - w < l || this.x + w > r || this.y - h < u || this.y + h > d);
};

// =================================================
// -- Maybe in the future lo --
// =================================================
// Bitmap.prototype.getAlphaPixelTest = function(bullet, x, y, p) {
	// var bulletXY = { x: Math.round(x), y: Math.round(y) };
	// if (!bullet.storedXY || !this.storedXY2) {
		// return false;
	// };
	// for (var k = 0; k < this.storedXY2.length; k++) {
		// if (this.storedXY2[k].x == bulletXY.x && this.storedXY2[k].y == bulletXY.y) { return true; };
		// if (bullet.frame % 8 == 0) {
			// var tensionX = Math.round((this.storedXY2[k].x * (1.15 * bullet.width)) / bullet.width);
			// var tensionY = Math.round((this.storedXY2[k].y * (1.15 * bullet.height)) / bullet.height);
			// if (bulletXY.x == tensionX && bulletXY.y == tensionY) { p._tension = true; };
		// }
	// };
// };

// Undertale_Enemy.prototype.makeCollision = function() {
	// this.storedXY = this.storedXY || [];
	// var width = this.width;
	// var height = this.height;
	// if (this.aniFrames > 1) { var width = Math.floor(this._baseBitmap.width / this.aniFrames); };
	// if (this.aniverticalFrames > 1) { var height = Math.floor(this._baseBitmap.height / this.aniverticalFrames); };
	// if (this.storedXY.length <= 0) {
        // for(var i = this._frame.y; i < height; i++) {
		    // for(var j = this._frame.x; j < width; j++) {
				// var pixel = this.bitmap.getAlphaPixel(j, i);
				// if (pixel > 0) {
					    // var xy = { x: j, y: i }; 
					    // this.storedXY.push(xy);
				// };
		    // };
		// }
	// };
// };

Undertale_Enemy.prototype.makeBoxMask = function () {
	if (!this.mask) {
		this.mask = new PIXI.Graphics();
		this.mask.beginFill(0xffffff);
		this.mask.drawRect(this.window.x + 4, this.window.y + 4, this.window.width - 8, this.window.height - 8);
	} else {
		this.mask.contents.clearRect(this.window.x + 4, this.window.y + 4, this.window.width - 8, this.window.height - 8);
		this.mask.drawRect(this.window.x + 4, this.window.y + 4, this.window.width - 8, this.window.height - 8);
    }
};

// Object.defineProperty(Undertale_Enemy.prototype, '_rotation', {
  // get: function() { return this.rotation; },
  // set: function(value) {
    // if (this.rotation !== value || !this.bitmap.storedXY2) {
        // this.rotation = value;
	    // var radiant = value < 0 ? value : value * -1;
	    // var bXMiddle = Math.round(this.width / 2);
	    // var bYMiddle = Math.round(this.height / 2);
		// // after array of coordinates has been made, instead just simply calculate all of the coordinates gotten
		// this.bitmap.storedXY2 = [];
		// for (var b = 0; b < this.storedXY.length; b++) {
		    // var x2 = ((this.storedXY[b].x - bXMiddle) * Math.cos(radiant)) + ((this.storedXY[b].y - bYMiddle) * Math.sin(radiant)) + bXMiddle;
		    // var y2 = ((this.storedXY[b].y - bYMiddle) * Math.cos(radiant)) - ((this.storedXY[b].x - bXMiddle) * Math.sin(radiant)) + bYMiddle;
			// var xy2 = { x: Math.round(x2), y: Math.round(y2) }; 
		    // this.bitmap.storedXY2.push(xy2);
		// };
    // }
  // },
  // configurable: true
// });

// ************************
// -- UndertaleBattleSystem --
// ************************

// Fix for attack not ending when all targets are knocked out. Credits: kebab/@pitus33
beesList.UTConf.UTBRefresh = UndertaleBattleSystem.prototype.refresh;
UndertaleBattleSystem.prototype.refresh = function() {
	beesList.UTConf.UTBRefresh.call(this);
	if (this._target && this._target.every(e => e.isDead())) {
        BattleManager.endUTBAttack();
    };
};