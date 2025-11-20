//=============================================================================
// * Set up generator on enemy sprite
//=============================================================================
const SEPSE_initMember = Sprite_Enemy.prototype.initMembers
Sprite_Enemy.prototype.initMembers = function() {
    SEPSE_initMember.call(this);

    var sprite = new Sprite_EnemyStatusEmitter();
    sprite.x = this.x
    sprite.y = this.y
    sprite._spriteSize = [0, 0];
    // Add Particle
    this._statusParticleEmitter = sprite;
}

const SEPSE_update = Sprite_Enemy.prototype.update
Sprite_Enemy.prototype.update = function() {
    SEPSE_update.call(this);

    if (this._enemy) {
        this.updateStatusParticles()
    }
}

Sprite_Enemy.prototype.updateStatusParticles = function() {
    var data = null;
    var emitter = this._statusParticleEmitter

    for (state of this._enemy.states()) {
        if (state.meta.particlesDataEnemy) {
            data = state.meta.particlesDataEnemy
        }
    }

    if (data) {
        emitter._spriteSize = this.frameSizes()
        emitter.setupGenerator(data);
        emitter.activate();
    } else {
        emitter.clear(); emitter.deactivate();
    }

    // This makes the emitter child of enemy sprite
    // if(!!this.parent && !this._statusParticleEmitter.parent) {
    //     this._statusParticleEmitter.position.set(0, 0);
    //     this.addChild(this._statusParticleEmitter);
    // }

    // Force add child update every update so it's always on top
    // As omori emotion change updates the enemy problem
    // Kind of bad, but it does not contribute to lag as far as its been checked
    this.addChild(this._statusParticleEmitter);

    emitter.update();
};

//=============================================================================
// * Sprite_EnemyStatusEmitter
//=============================================================================
function Sprite_EnemyStatusEmitter() { this.initialize.apply(this, arguments); };
Sprite_EnemyStatusEmitter.prototype = Object.create(Sprite.prototype);
Sprite_EnemyStatusEmitter.prototype.constructor = Sprite_EnemyStatusEmitter;

Sprite_EnemyStatusEmitter.prototype.initialize = function() {
  Sprite.prototype.initialize.call(this);
  this.clear();
  this.deactivate();
};

Sprite_EnemyStatusEmitter.prototype.activate = function() { this._active = true;};
Sprite_EnemyStatusEmitter.prototype.deactivate = function() { this._active = false;};
Sprite_EnemyStatusEmitter.prototype.clear = function() {
  // Set Intensity (How many sprites to spawn each time)
  this._intensity = 1;
  this._intensityVariance = 0;
  // Set Generation Type
  this._generateFunct = null;
  // Set Spawn Timer
  this._spawnTimer = 0;
  this._spawnTimerVariance = 0;
  this._spawnTimerCount = this._spawnTimerCount || 0;
  // Set Child Limit
  this._childLimit = 0;
};

Sprite_EnemyStatusEmitter.prototype.update = function() {
    // Super Call
    Sprite.prototype.update.call(this);

    // If Children Exists
    if (this.children.length > 0) {
        // Go Through Children
        this.children.forEach(function(particle) {
        // Remove Child if Finished
        if (particle.isFinished()) {  this.removeChild(particle); };
        }, this);    
    };

    // If Active
    if (this._active) {
        // If Children Length exceeds child limit
        if (this.children.length >= this._childLimit) { return; }

        // If Spawn Timer is not null
        if (this._spawnTimerCount !== null) {
            // Reduce Spawn Timer Count
            this._spawnTimerCount--;
            // If Timer is 0 or less
            if (this._spawnTimerCount <= 0) { 
                // Set Spawn Timer Count
                this._spawnTimerCount = this._spawnTimer + Math.randomInt(this._spawnTimerVariance);  
                // Call Generation Function
                if (this._generateFunct) { 
                    // Generate Amount of Sprites
                    for (var i = 0; i < this._intensity + Math.randomInt(this._intensityVariance); i++) {
                        // Run Generation Function
                        this._generateFunct();         
                    };
                };    
            };
        }
    };
};

Sprite_EnemyStatusEmitter.prototype.setupGenerator = function(type, settings = {}) {
    // Clear / Default
    this.clear();
    this._intensity = 1;
    this._intensityVariance = 0;
    this._generateFunct = this.generateTest;
    this._spawnTimer = 20;
    this._spawnTimerVariance = 0;
    this._childLimit = 30;

    // Switch Type
    switch (type.toLowerCase()) {
        case "burn":
            this._generateFunct = this.generateBurn;
            break;
        case "glow":
            this._generateFunct = this.generateGlow;
            break;
        case "weep":
            this._spawnTimer = 40;
            this._generateFunct = this.generateWeep;
            break;
        case "freeze":
            this._spawnTimer = 60;
            this._generateFunct = this.generateFreeze;
            break;
        case "charm":
            this._generateFunct = this.generateCharm;
            break;
        case "sick":
            this._spawnTimer = 40;
            this._generateFunct = this.generateSick;
            break;
        case "sleep":
            this._spawnTimer = 100;
            this._generateFunct = this.generateSleep;
            break;
    }
};

// default generator, as it's common enough
// this centers and spread accross enemy sprite; padding is the multiplier of size, less than 1 insets it
Sprite_EnemyStatusEmitter.prototype.defaultGenerate = function (sysImage, padding = 0.7) {
    var bitmap = ImageManager.loadSystem(sysImage);
    var sprite = new Sprite_Particle(bitmap);
    sprite.anchor.set(0.5, 0.5)
    sprite.x = (Math.round(Math.random()) * 2 - 1) * Math.randomInt(this._spriteSize[0] * 0.5) * padding;
    sprite.y = (Math.round(Math.random()) * 2 - 1) * Math.randomInt(this._spriteSize[1] * 0.5) * padding - (this._spriteSize[1] * 0.5);
    sprite.opacity = 0;
    sprite.scale.set(0, 0);
    this.addChild(sprite);
    return sprite
}

Sprite_EnemyStatusEmitter.prototype.generateGlow = function () {
    var sprite = this.defaultGenerate('rv_ailment_particles')
    sprite.setFrame(64, 0, 32, 32)
    // Set Unique Sprite Values
    sprite._baseX = sprite.x;
    sprite._shakeOffset = Math.randomInt(3);

    var xSpeed = Math.random() * 0.7 * (Math.round(Math.random()) * 2 - 1)
    var ySpeed = Math.random() * 0.7 * (Math.round(Math.random()) * 2 - 1)

    sprite.setup(
        [
            { duration: 10, x: xSpeed, y: ySpeed, rotation: 0, opacity: 26, scaleX: 0.1, scaleY: 0.1 },
            { duration: 50, x: xSpeed, y: ySpeed, rotation: 0, opacity: 0, scaleX: 0, scaleY: 0 },
            { duration: 20, x: xSpeed, y: ySpeed, rotation: 0, opacity: -20, scaleX: -0.02, scaleY: -0.02 }
        ]
    );
};

Sprite_EnemyStatusEmitter.prototype.generateWeep = function () {
    var sprite = this.defaultGenerate('rv_ailment_particles')
    sprite.setFrame(32, 0, 32, 32)

    var ySpeed = Math.random() * 0.5

    sprite.setup(
        [
            { duration: 10, x: 0, y: ySpeed, rotation: 0, opacity: 20, scaleX: 0.1, scaleY: 0.1 },
            { duration: 50, x: 0, y: ySpeed, rotation: 0, opacity: 0, scaleX: 0, scaleY: 0 },
            { duration: 20, x: 0, y: ySpeed, rotation: 0, opacity: -15, scaleX: -0.02, scaleY: -0.02 }
        ]
    );
};

Sprite_EnemyStatusEmitter.prototype.generateBurn = function () {
    var sprite = this.defaultGenerate('rv_ailment_particles')
    sprite.setFrame(0, 0, 32, 32)
    // Set Unique Sprite Values
    sprite._baseX = sprite.x;
    sprite._shakeOffset = Math.randomInt(3);
    sprite._shakeSpeed = 0.05 + Math.random() * 0.05;

    var shakeFunct = function () {
        this.x = sprite._baseX + (Math.sin((Graphics.frameCount + sprite._shakeOffset) * sprite._shakeSpeed) * 20);
        this.rotation += Math.sin(Graphics.frameCount) * 0.03
    };

    var ySpeed = Math.random() * -0.5

    sprite.setup(
        [
            { duration: 10, x: 0, y: ySpeed, rotation: 0, opacity: 26, scaleX: 0.12, scaleY: 0.12, functEnd: shakeFunct },
            { duration: 50, x: 0, y: ySpeed * 2, rotation: 0, opacity: 0, scaleX: 0, scaleY: 0, functEnd: shakeFunct },
            { duration: 20, x: 0, y: ySpeed, rotation: 0, opacity: -10, scaleX: 0.01, scaleY: 0.01, functEnd: shakeFunct }
        ]
    );
};

Sprite_EnemyStatusEmitter.prototype.generateFreeze = function () {
    var sprite = this.defaultGenerate('rv_ailment_particles')
    sprite.setFrame(96, 0, 32, 32)

    var xSpeed = Math.random() * 0.4 * (Math.round(Math.random()) * 2 - 1)
    var ySpeed = Math.random() * 0.4 * (Math.round(Math.random()) * 2 - 1)
    var rotationSpeed = Math.random() * 5.0 * (Math.round(Math.random()) * 2 - 1)

    sprite.setup(
        [
            { duration: 10, x: xSpeed, y: ySpeed, rotation: rotationSpeed, opacity: 26, scaleX: 0.1, scaleY: 0.1 },
            { duration: 100, x: xSpeed, y: ySpeed, rotation: rotationSpeed, opacity: 0, scaleX: 0, scaleY: 0 },
            { duration: 30, x: xSpeed, y: ySpeed, rotation: rotationSpeed, opacity: -10, scaleX: -0.02, scaleY: -0.02 }
        ]
    );
};

Sprite_EnemyStatusEmitter.prototype.generateCharm = function () {
    var sprite = this.defaultGenerate('rv_ailment_particles')
    sprite.setFrame(0, 32, 32, 32)
    // Set Unique Sprite Values
    sprite._baseX = sprite.x;
    sprite._shakeOffset = Math.randomInt(3);
    sprite._shakeSpeed = 0.03 + Math.random() * 0.03;

    var shakeFunct = function () {
        this.x = sprite._baseX + (Math.sin((Graphics.frameCount + sprite._shakeOffset) * sprite._shakeSpeed) * 15);
    };

    var ySpeed = Math.random() * -0.4

    sprite.setup(
        [
            { duration: 10, x: 0, y: ySpeed, rotation: 0, opacity: 26, scaleX: 0.08, scaleY: 0.08, functEnd: shakeFunct },
            { duration: 50, x: 0, y: ySpeed * 1.5, rotation: 0, opacity: 0, scaleX: 0, scaleY: 0, functEnd: shakeFunct },
            { duration: 20, x: 0, y: ySpeed, rotation: 0, opacity: -15, scaleX: 0.01, scaleY: 0.01, functEnd: shakeFunct }
        ]
    );
};

Sprite_EnemyStatusEmitter.prototype.generateSick = function () {
    var sprite = this.defaultGenerate('rv_ailment_particles')
    sprite.setFrame(32, 32, 32, 32)
    // Set Unique Sprite Values
    sprite._baseX = sprite.x;
    sprite._shakeOffset = Math.randomInt(3);
    sprite._shakeSpeed = 0.02 + Math.random() * 0.02;

    var shakeFunct = function () {
        this.x = sprite._baseX + (Math.sin((Graphics.frameCount + sprite._shakeOffset) * sprite._shakeSpeed) * 15);
    };

    var ySpeed = Math.random() * -0.3

    sprite.setup(
        [
            { duration: 20, x: 0, y: ySpeed, rotation: 0, opacity: 15, scaleX: 0.04, scaleY: 0.04, functEnd: shakeFunct },
            { duration: 100, x: 0, y: ySpeed, rotation: 0, opacity: 0, scaleX: 0, scaleY: 0, functEnd: shakeFunct },
            { duration: 30, x: 0, y: ySpeed, rotation: 0, opacity: -10, scaleX: 0.01, scaleY: 0.01, functEnd: shakeFunct }
        ]
    );
};

Sprite_EnemyStatusEmitter.prototype.generateSleep = function () {
    var sprite = this.defaultGenerate('rv_ailment_particles')
    sprite.setFrame(64, 32, 32, 32)
    sprite.y -= this._spriteSize[1] * 0.2 // move up a little
    // Set Unique Sprite Values
    sprite._baseX = sprite.x;
    sprite._shakeOffset = Math.randomInt(3);
    sprite._shakeSpeed = 0.02 + Math.random() * 0.02;

    var shakeFunct = function () {
        this.x = sprite._baseX + (Math.sin((Graphics.frameCount + sprite._shakeOffset) * sprite._shakeSpeed) * 30);
    };

    var ySpeed = Math.random() * -0.4

    sprite.setup(
        [
            { duration: 20, x: 0, y: ySpeed, rotation: 0, opacity: 15, scaleX: 0.04, scaleY: 0.04, functEnd: shakeFunct },
            { duration: 100, x: 0, y: ySpeed, rotation: 0, opacity: 0, scaleX: 0, scaleY: 0, functEnd: shakeFunct },
            { duration: 30, x: 0, y: ySpeed * 0.8, rotation: 0, opacity: -10, scaleX: -0.01, scaleY: -0.01, functEnd: shakeFunct }
        ]
    );
};



Sprite_EnemyStatusEmitter.prototype.generateTest = function () {
    // Get Bitmap
    var bitmap = ImageManager.loadPicture('StatusParticles');
    // Create Sprite
    var sprite = new Sprite_Particle(bitmap);
    sprite.anchor.set(0.5, 0.5)
    sprite.x = (Math.round(Math.random()) * 2 - 1) * Math.randomInt(this._spriteSize[0] / 2) * 0.8;
    sprite.y = (Math.round(Math.random()) * 2 - 1) * Math.randomInt(this._spriteSize[1] / 2) * 0.8 - (this._spriteSize[1] / 2);
    sprite.setFrame(0, 30, 30, 31)
    sprite.opacity = 0;
    sprite.scale.set(0, 0);
    this.addChild(sprite);


    // Set Unique Sprite Values
    sprite._baseX = sprite.x;
    sprite._angryOffset = Math.randomInt(3)
    sprite._angrySpeed = 1.5 + (Math.randomInt(100) / 100);

    // Create Shake Function
    var shakeFunct = function () {
        // Shake Sprite X value
        this.x = sprite._baseX + (Math.sin((Graphics.frameCount + sprite._angryOffset) * sprite._angrySpeed) * 3);
    };
    // Initialize Phase
    var phases = [];
    // Set Phase Values
    var xSpeed = 0;
    var ySpeed = -(0.5 + Math.randomInt(1));
    var rotation = 0

    // Appear Phase
    var phase = { duration: 10, x: xSpeed, y: ySpeed, rotation: rotation, opacity: 26, scaleX: 0.1, scaleY: 0.1 }
    phase.functEnd = shakeFunct;
    phases.push(phase);

    // Main Phase (Move up)
    var phase = { duration: 50, x: xSpeed, y: ySpeed * 2, rotation: rotation, opacity: 0, scaleX: 0, scaleY: 0 }
    phase.functEnd = shakeFunct;
    phases.push(phase);

    // Disappear Phase (Explode rotating)
    var phase = { duration: 10, x: xSpeed, y: ySpeed, rotation: 30, opacity: -26, scaleX: 0.1, scaleY: 0.1 }
    phase.functEnd = shakeFunct;
    phases.push(phase);
    // Setup Particle Phases
    sprite.setup(phases)
};

//=============================================================================
// * Sprite_Particle
//=============================================================================
function Sprite_Particle() { this.initialize.apply(this, arguments); };
Sprite_Particle.prototype = Object.create(Sprite.prototype);
Sprite_Particle.prototype.constructor = Sprite_Particle;

Sprite_Particle.prototype.initialize = function(bitmap) {
  // Super Call
  Sprite.prototype.initialize.call(this, bitmap);
  // Phase Index
  this._phaseIndex = 0;
  // Phases
  this._phases = []
};

Sprite_Particle.prototype.setup = function(phases) {
  // Clone Phases
  this._phases = phases.clone();
};

Sprite_Particle.prototype.isFinished = function() { return this._phaseIndex >= this._phases.length; };

Sprite_Particle.prototype.update = function() {
  // Super Call
  Sprite.prototype.update.call(this);
  // Get Current Phase
  var phase = this._phases[this._phaseIndex];
  // If Phase Exists
  if (phase) {
    // Update Phase
    this.updatePhase(phase);
    // If Phase is Finished
    if (phase.duration <= 0) {
      // Increase Phase Index
      this._phaseIndex++
    };
  };
};
//=============================================================================
// * Frame Update
//=============================================================================
Sprite_Particle.prototype.updatePhase = function(phase) {
  // Decrease Phase Duration
  phase.duration--
  // If Phase as a Function
  if (phase.functStart) { phase.functStart.call(this, phase); };
  this.x += phase.x;
  this.y += phase.y;
  this.rotation += phase.rotation * (Math.PI / 360);
  this.opacity += phase.opacity;
  this.scale.x += phase.scaleX;
  this.scale.y += phase.scaleY;
  // If Phase as a Function
  if (phase.functEnd) { phase.functEnd.call(this, phase); };
};
