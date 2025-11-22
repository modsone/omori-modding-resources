/*:
 * @plugindesc Level Up Actor Animation
 * @author Draught
 * @help
 *
 * Plays an animation on a specific actor when they level up.
 *
 * Put this notetag on your actor
 *
 * <Level Up Anim ID:id>
 *
 * Replace the id with the id of the animation.
 * Example: 
 *
 * <Level Up Anim ID:214>
 * 
 * 
 *
 *
 *
 *
 */


{
    {
        BattleManager.gainExp = function() {
            var exp = this._rewards.exp;
            $gameParty.allMembers().forEach(function(actor) {
                actor.gainExp(exp);
            });
            // Clear Game Message
            $gameMessage.clear();
        
            // Go Through Actors
            $gameParty.allMembers().forEach(function(actor) {
            // Go Through Data
            var data = actor._levelUpData;
            // If Data Exists
            if (data) {
                this._logWindow.push('clear');
                this._logWindow.push('playSE', {name: "BA_Happy", volume: 90, pitch: 100, pan: 0});
                this._logWindow.push('addText', TextManager.levelUp.format(actor._name, TextManager.level, data.level) + `\\DGT_LUA[${actor._actorId}]`);
                this._logWindow.push('wait');
                this._logWindow.push('waitForInput');
                data.skills.forEach(function(skill) {
                this._logWindow.push('addText', TextManager.obtainSkill.format(skill.name));
                this._logWindow.push('wait');
                }, this);
                if (data.skills.length > 0) {
                this._logWindow.push('waitForInput')
                };
            };
            // Delete Actor Level Up Data
            delete actor._levelUpData;
            }, this);
            // Get Last Method
            var lastMethod = this._logWindow._methods[this._logWindow._methods.length-1];
            // If Last Method is not wait for input
            if (lastMethod && lastMethod.name !== 'waitForInput') {
            // if (this._logWindow._methods)
            this._logWindow.push('waitForInput')
            };
        };
    }
    let levelAnimation = Symbol('levelAnimation')
    {
        Game_Actor.prototype[levelAnimation] = function () {
            if (SceneManager._scene.constructor === Scene_Battle) {
                let animId = this.actor().meta['Level Up Anim ID']
                if (parseInt(animId)) {
                    this.startAnimation(parseInt(animId), false, 0)
                }
            };
        }
    }
    {
        let old = Window_Base.prototype.convertEscapeCharacters
        Window_Base.prototype.convertEscapeCharacters = function(text) {
            text = old.call(this, text)
            return text.replace(/\x1bDGT_LUA\[(\d+)\]/, function() {
                let actor = $gameActors.actor(arguments[1])
                if (actor) {
                    actor[levelAnimation]()
                }
                return ''
            })
        };
    }
}