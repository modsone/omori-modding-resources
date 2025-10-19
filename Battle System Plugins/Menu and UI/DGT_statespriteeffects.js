/*:
 * @plugindesc DGT State Sprite Effects Plugin 
 * Adds dynamic overlay effects to enemy and actor sprites using state notetags. 
 * @author Draught
 *
 * @help
 * =============================================================================
 * Introduction:
 * =============================================================================
 * This plugin enhances battler sprites by adding overlay effects when states with 
 * specific notetags are active. It supports animations, scrolling, transparency, 
 * and blend mode adjustments, allowing you to create dynamic visual effects on 
 * both enemy and actor sprites.
 *
 * =============================================================================
 * How to Use:
 * =============================================================================
 * 1. Place this plugin file in your project's plugin folder and activate it.
 *
 * 2. In the "Note" field of a state in your database, include the following 
 *    notetags to configure the overlay effect:
 *
 *      <enable overlay effect>
 *      <effect image: file, name>
 *      <enable overlay animation>
 *      <overlay animation speed: number>
 *      <overlay animation slices x: number>
 *      <overlay animation slices y: number>
 *      <overlay scroll x: number>
 *      <overlay scroll y: number>
 *      <use color channel>
 *      <overlay alpha: number>
 *      <blend mode: MODE>
 *      <player scale: number%>
 *
 * 3. The overlay effect will be applied to a battler's sprite when the corresponding 
 *    state is active. For enemies, the effect appears on their main sprite. 
 *    For actors, it is applied to the face sprite in the battle status window.
 *
 * =============================================================================
 * Notetags Explained:
 * =============================================================================
 * - <enable overlay effect>  
 *   Enables the overlay effect for the state.
 * - <effect image: file, name> 
 *    Specifies the overlay image file and image name.
 * - <enable overlay animation> 
 *   Turns on frame animation for the overlay.
 * - <overlay animation speed: number> 
 *   Sets the frame delay for the animation.
 * - <overlay animation slices x: number> and
 *   <overlay animation slices y: number> 
 *   Define the number of horizontal and vertical slices.
 * - <overlay scroll x: number>        
 *   Sets the horizontal scrolling speed.
 * - <overlay scroll y: number>        
 *   Sets the vertical scrolling speed.
 * - <use color channel>               
 *   Toggles the use of a color channel mask for the overlay.
 * - <overlay alpha: number>           
 *   Adjusts the transparency of the overlay (0 to 1).
 * - <blend mode: MODE>                
 *   Sets the blend mode (e.g., NORMAL, ADD, MULTIPLY, SCREEN, OVERLAY, 
 *                              DARKEN, LIGHTEN, COLOR_DODGE, COLOR_BURN, 
 *								HARD_LIGHT, SOFT_LIGHT, DIFFERENCE, EXCLUSION, 
 * 								HUE, SATURATION, COLOR, LUMINOSITY).
 * - <player scale: number%>
 *   Adjusts the overlay scale for actor sprites.
 *
 * =============================================================================
 * Additional Information:
 * =============================================================================
 * - The effect updates automatically when a battler gains or loses a state.
 * - If multiple states with overlay effects are active, the first state with the effect 
 *   enabled is used.
 *
 * =============================================================================
 * Versions:
 * =============================================================================
 * v1.0.0 - Initial release.
 *
 */



{
  window.DGT = window.DGT || {}
  DGT.stateSprites = {}

  let alias = (originalStorage, baseClass, funcName, usePrototype, newFunc) => {
    if (originalStorage[baseClass] == undefined) {
      originalStorage[baseClass] = {}
    }
    // note: using window here is supposedly slightly stupid and i should polyfill globalthis or something
    // but im not going to
    if (usePrototype) { // prototype solution is stupid
      originalStorage[baseClass][funcName] = window[baseClass].prototype[funcName] || (() => {}) // save original function
      window[baseClass].prototype[funcName] = function(...args) {
        return newFunc.call(this, originalStorage[baseClass][funcName], ...args)
      } // override function and pass original forward
    } else {
      originalStorage[baseClass][funcName] = window[baseClass][funcName] || (() => {}) // save original function
      window[baseClass][funcName] = newFunc.bind(window[baseClass], originalStorage[baseClass][funcName]) // override function and pass original forward
    }
  }
  alias = alias.bind(null, DGT.stateSprites)

  //add reference to enemy sprite in the enemy data
  Game_Enemy.prototype._getThisSprite = function() {
    if (SceneManager._scene._spriteset) {
      if (SceneManager._scene._spriteset._enemySprites) {
        const find = SceneManager._scene._spriteset._enemySprites.find(sprite => sprite._actor === this);
        return find ? find._mainSprite : null;
      }
    }
  }

  Game_Actor.prototype._getThisSprite = function() {
    if (BattleManager._statusWindow && BattleManager._statusWindow._faceWindows) {
      let thisActorWindow = BattleManager._statusWindow._faceWindows.find(win => win.actor() === this)
      if (thisActorWindow) {
        return thisActorWindow._faceSprite
      }
    }
  }

  let createEffectSprite = function(mainSp, isActor) {
    let maskSprite = new Sprite();
    let effectsSprite = new TilingSprite();
    mainSp._maskSprite = maskSprite
    mainSp._effectsSprite = effectsSprite
    let _ = mainSp.setFrame
    mainSp.setFrame = function(...args) {
      _.call(this, ...args)
      if (mainSp.width) {
        maskSprite.texture = mainSp.texture

        if (!isActor) {
          effectsSprite.x = -mainSp.width / 2;
          effectsSprite.y = -mainSp.height;
        }
        effectsSprite.width = mainSp.width
        effectsSprite.height = mainSp.height
        mainSp.setFrame = _
      }
    }
    effectsSprite.visible = false
    mainSp.addChild(effectsSprite)
    effectsSprite.addChild(maskSprite)

    effectsSprite._animData = {}
    effectsSprite._animIndex = 0
    effectsSprite._frameCounter = 0
    let __ = effectsSprite.update
    effectsSprite.update = function() { //wow animation!!??! but bad? wow
      __.call(this);
      if (this.visible) {
        this.origin.x += this._hSpeed //parallax scrolling effects
        this.origin.y += this._vSpeed
        if (this._animData.enabled) { //frame animation effects
          this._frameCounter++;
          this._frameCounter %= this._animData.frameDelay;
          if (this._frameCounter === 0) {
            this._animIndex++;
            this._animIndex %= this._animData.hSlices * this._animData.vSlices;
          }
          let cw = this.bitmap.width / this._animData.hSlices;
          let ch = this.bitmap.height / this._animData.vSlices;
          let cy = Math.floor(this._animIndex / this._animData.hSlices);
          let cx = this._animIndex % this._animData.hSlices;
          this.setFrame(cx * cw, cy * ch, cw, ch);
        }
      }
    }
  }

  alias("Sprite_Enemy", "initSVSprites", true, function(original){ // this is me when, when
    original.call(this);
    createEffectSprite(this._mainSprite, false);
  })
  alias("Window_OmoriBattleActorStatus", "createSprites", true, function(original){ // this is me when, when (when)
    original.call(this);
    createEffectSprite(this._faceSprite, true);
  })

  Game_Battler.prototype.updateStateEffects = function() {
    //get first effect enabled state
    let state = this.states().find(st => st._ceffectEnabled);
    let mainSprite = this._getThisSprite()
    if (!mainSprite) {return}
    let maskSprite = mainSprite._maskSprite
    if (!maskSprite) {return}
    let effectsSprite = mainSprite._effectsSprite
    if (state) {
      //console.log("yes state")
    } else {
      //console.log("no state")
    }
    if (state) {
      newbitmap = ImageManager.loadBitmap(state._ceffectImage[0], state._ceffectImage[1])
      effectsSprite.setFrame(0, 0, 0, 0)
      effectsSprite.bitmap = newbitmap
      effectsSprite.setFrame(0, 0, newbitmap.width, newbitmap.height)
      effectsSprite._animData = state._ceffectAnimData
      effectsSprite._hSpeed = state._ceffectHSpeed
      effectsSprite._vSpeed = state._ceffectVSpeed
      effectsSprite.alpha = state._ceffectAlpha
      effectsSprite.useColorChannel = state._ceffectColorChannel
      if (this instanceof Game_Actor) {
        effectsSprite.tileScale.x = state._ceffectScale
        effectsSprite.tileScale.y = state._ceffectScale
      }
      let afterLoad = function() {
        //console.log("afterload")
        let newFilter = null;

        if (this instanceof Game_Actor) {
          effectsSprite.x = -mainSprite.width / 2;
          effectsSprite.y = -mainSprite.height;
        }
        effectsSprite.width = mainSprite.width
        effectsSprite.height = mainSprite.height
        if (effectsSprite.useColorChannel) {
          newFilter = new PIXI.SpriteMaskFilter(maskSprite)
        } else {
          newFilter = new SpriteMaskFilterButGood(maskSprite)
        }
        newFilter.blendMode = PIXI.BLEND_MODES[state._ceffectBlend]
        effectsSprite.filters = [newFilter]
        effectsSprite.visible = true
      }
      if (effectsSprite.bitmap._loadingState == 'loaded') {
        console.log("wow quickly loaded")
        afterLoad()
      } else {
        console.log("not loaded yet, lets wait fforever")
        effectsSprite.bitmap.addLoadListener(function(...args) {
          console.log("finallt")
          afterLoad()
        })
      }
    } else { //remove state effects
      effectsSprite.visible = false
      effectsSprite._animData = {}
      effectsSprite._animIndex = 0
      effectsSprite._frameCounter = 0
    }
  }

  alias("Game_Battler", "addState", true, function(original, ...args) {
    original.call(this, ...args)
    this.updateStateEffects()
  })
  alias("Game_Battler", "removeState", true, function(original, ...args) {
    original.call(this, ...args)
    if (this._getThisSprite()) {
      this.updateStateEffects()
    }
  })
  alias("DataManager", "isDatabaseLoaded", false, function(original, ...args) {
    if (!original.call(this, ...args)) {return false};
    this.processDGTSENotetags($dataStates)
    return true;
  })

  DataManager.processDGTSENotetags = function(group) {
    let note1 = /<enable ?overlay ?effect>/i;
    let note2 = /<effect ?image: ?([^,]+), ?([^>]+)?>/i;
    let note3 = /<enable ?overlay ?animation>/i;
    let note4 = /<overlay ?animation ?speed: ?(\d+)>/i;
    let note5 = /<overlay ?animation ?slices? ?x: ?(\d+)>/i;
    let note6 = /<overlay ?animation ?slices? ?y: ?(\d+)>/i;
    let note7 = /<overlay ?scroll ?x: ?(-?[0-9.]+)>/i;
    let note8 = /<overlay ?scroll ?y: ?(-?[0-9.]+)>/i;
    let note9 = /<use ?color ?channel>/i;
    let note10 = /<overlay ?alpha: ?([0-9.]+)>/i;
    let note11 = /<blend(?: ?mode)?: ?([^>]+)>/i
    let note12 = /<player ?scale: ?([0-9.]+)%?>/i;

    for (let n = 1; n < group.length; n++) {
      let obj = group[n];
      let notedata = obj.note.split(/[\r\n]+/);

      obj._ceffectEnabled = false

      obj._ceffectImage = [];
      obj._ceffectAnimData = {
        enabled: false,
        frameDelay: 20,
        hSlices: 1,
        vSlices: 1
      }
      obj._ceffectHSpeed = 0
      obj._ceffectVSpeed = 0
      obj._ceffectColorChannel = false
      obj._ceffectAlpha = 0.5
      obj._ceffectBlend = "NORMAL"
      obj._ceffectScale = 1

      for (let i = 0; i < notedata.length; i++) {
        let line = notedata[i];
        if (line.match(note1)) {
          obj._ceffectEnabled = true
        } else if (line.match(note2)) {
          obj._ceffectImage = [RegExp.$1, RegExp.$2]
        } else if (line.match(note3)) {
          obj._ceffectAnimData.enabled = true
        } else if (line.match(note4)) {
          obj._ceffectAnimData.frameDelay = Number(RegExp.$1)
        } else if (line.match(note5)) {
          obj._ceffectAnimData.hSlices = Number(RegExp.$1)
        } else if (line.match(note6)) {
          obj._ceffectAnimData.vSlices = Number(RegExp.$1)
        } else if (line.match(note7)) {
          obj._ceffectHSpeed = Number(RegExp.$1)
        } else if (line.match(note8)) {
          obj._ceffectVSpeed = Number(RegExp.$1)
        } else if (line.match(note9)) {
          obj._ceffectColorChannel = true
        } else if (line.match(note10)) {
          obj._ceffectAlpha = Number(RegExp.$1)
        } else if (line.match(note11)) {
          obj._ceffectBlend = RegExp.$1.toUpperCase()
        } else if (line.match(note12)) {
          obj._ceffectScale = Number(RegExp.$1) / 100
        }
      }
    }
  };

  class OnlyOutlineFilter extends PIXI.Filter { // a modification on the built in outline shader that deletes the stuff that isnt an outline
    constructor(thickness = 1, color = 0x000000, quality = 0.1) {
      const samples =  Math.max(
          quality * OnlyOutlineFilter.MAX_SAMPLES,
          OnlyOutlineFilter.MIN_SAMPLES,
      );
      let angleStep = (Math.PI * 2 / samples).toFixed(7)
      super('attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}',`varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec2 thickness;\nuniform vec4 outlineColor;\nuniform vec4 filterClamp;\n\nconst float DOUBLE_PI = 3.14159265358979323846264 * 2.;\n\nvoid main(void) {\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float maxAlpha = 0.;\n    vec2 displaced;\n    for (float angle = 0.; angle <= DOUBLE_PI; angle += ${angleStep}) {\n        displaced.x = vTextureCoord.x + thickness.x * cos(angle);\n        displaced.y = vTextureCoord.y + thickness.y * sin(angle);\n        curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n        maxAlpha = max(maxAlpha, curColor.a);\n    }\n    float resultAlpha = max(maxAlpha, ownColor.a);\n    gl_FragColor = vec4((outlineColor.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);\n}\n`)
      //shader code :skull:

      this.uniforms.thickness = new Float32Array([0,0])
      this.uniforms.outlineColor = new Float32Array([0,0,0,1])

      this.thickness = thickness
      this.quality = quality
      this.color = color

    }
    apply(filterManager, input, output, clear) {
      this.uniforms.thickness[0] = this.thickness / input.size.width;
      this.uniforms.thickness[1] = this.thickness / input.size.height;

      filterManager.applyFilter(this, input, output, clear);
    }
    get color() {
        return PIXI.utils.rgb2hex(this.uniforms.outlineColor);
    }
    set color(value) {
        PIXI.utils.hex2rgb(value, this.uniforms.outlineColor);
    }
  }
  OnlyOutlineFilter.MIN_SAMPLES = 1
  OnlyOutlineFilter.MAX_SAMPLES = 100

  class SpriteMaskFilterButGood extends PIXI.Filter {
    constructor(sprite) {
      var maskMatrix = new PIXI.Matrix();

      super('attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 otherMatrix;\n\nvarying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vMaskCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n}\n', 'varying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform sampler2D mask;\nuniform float alpha;\nuniform vec4 maskClamp;\n\nvoid main(void)\n{\n    float clip = step(3.5,\n        step(maskClamp.x, vMaskCoord.x) +\n        step(maskClamp.y, vMaskCoord.y) +\n        step(vMaskCoord.x, maskClamp.z) +\n        step(vMaskCoord.y, maskClamp.w));\n\n    vec4 original = texture2D(uSampler, vTextureCoord);\n    vec4 masky = texture2D(mask, vMaskCoord);\n\n    original *= (masky.a * alpha * clip);\n\n    gl_FragColor = original;\n}\n');

      sprite.renderable = false;

      this.maskSprite = sprite;
      this.maskMatrix = maskMatrix;
      return this;
    }
    apply(filterManager, input, output, clear) {
      var maskSprite = this.maskSprite;
      var tex = this.maskSprite.texture;

      if (!tex.valid) {
          return;
      }
      if (!tex.transform) {
          // margin = 0.0, let it bleed a bit, shader code becomes easier
          // assuming that atlas textures were made with 1-pixel padding
          tex.transform = new PIXI.TextureMatrix(tex, 0.0);
      }
      tex.transform.update();

      this.uniforms.mask = tex;
      this.uniforms.otherMatrix = filterManager.calculateSpriteMatrix(this.maskMatrix, maskSprite).prepend(tex.transform.mapCoord);
      this.uniforms.alpha = maskSprite.worldAlpha;
      this.uniforms.maskClamp = tex.transform.uClampFrame;

      filterManager.applyFilter(this, input, output, clear);
    }
  }

  DGT.OnlyOutlineFilter = OnlyOutlineFilter
  DGT.SpriteMaskFilterButGood = SpriteMaskFilterButGood

  // alias("Scene_Battle", "update", true, function(original, ...args) {
  //   original.call(this, ...args)
  // })
}
