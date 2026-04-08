/*:
@author FoGsesipod, WHITENOISE, Draughtyan
@plugindesc v1.0.4 Add event points to audio files for event triggering.
@help
This plugin allows you to add 'PING' points to audio files, which can be used to trigger events.
To add a PING point, you need to modify the audio file's metadata. You can use a tool like Audacity to add custom metadata tags.
The format for the PING point metadata is as follows:
PING[name]=sample_position
Where 'name' is an optional identifier for the ping point, and 'sample_position' is the sample position in the audio file where the ping point should occur.
If 'name' is omitted, the ping point is considered anonymous.

example:
PINGIntro=514985

This will create a ping point named 'Intro' at the specified sample position.
You can then use `Plugin Command: Wait for PingPoint Intro` to wait until that ping point is reached during playback.


You can use the following plugin commands in your events:
- Wait for PingPoint any: Waits until any named or anonymous ping point is reached.
- Wait for PingPoint [name]: Waits until the specified ping point is reached.
- Wait for PingPoint: Waits until any anonymous ping point is reached.

You can also add ping listeners in your code using the following functions:
FWD.AddPingListener(pingname, callback): Adds a listener for the specified ping point. If pingname is null, undefined, empty, or 'anonymous', it adds a listener for anonymous ping points.
NOTE: PING LISTENERS DO NOT SUPPORT CUSTOM EPSILON VALUES

Also available for script conditions or other uses:
FWD.IsPingPointActive(pingname): Returns true if the specified ping point is currently active.
FWD.IsAnonymousPingPointActive(): Returns true if any anonymous ping point is currently active.
FWD.IsAnyPingPointActive(): Returns true if any ping point (named or anonymous) is currently active.

Advanced Usage:
Most functions support an optional second parameter 'E' which allows you to specify a custom epsilon value for determining if a ping point is active.
By default, the epsilon value is set to 0.05 seconds. You most likely won't need to change this.

Syntax Examples:
FWD.IsPingPointActive("namehere", 0.1)
FWD.IsAnonymousPingPointActive(0.02)
FWD.IsAnyPingPointActive(0.2)

Plugin command syntax examples for Wait command with custom epsilon:
Wait for PingPoint any 0.1
Wait for PingPoint Intro 0.02
Wait for PingPoint anonymouspingpoint 0.2


== Changelog ==
v1.0.2 - Add support for multiple named ping points with the same identifier.
v1.0.3 - Add custom epsilon support
v1.0.4 - Fix bug where size of metadata was not being reported correctly, causing ping points to not be read.

=== License ===
This plugin is licensed under the MIT License.
*/

{
    const FWD = window.FWD || {};
    window.FWD = FWD;

    const SEARCH_RANGE = 40;
    const old_readMetaData = WebAudio.prototype._readMetaData;
    WebAudio.prototype._readMetaData = function (array, index, size) {
        this._PingPoints = {};
        this._TriggeredPingPoints = {};
        this._PingListeners = {};
        // this._AnonymousPingPoints = [];
        // this._AnonymousPointTriggered = false;
        let charsSinceLastPing = -size;
        let i = index
        while (charsSinceLastPing < SEARCH_RANGE) {
            if (this._readFourCharacters(array, i) === 'PING') {
                let text = '';
                while (array[i] > 0) {
                    text += String.fromCharCode(array[i++]);
                }
                if (text.match(/PING([A-Za-z0-9]+)?=([0-9]+)/)) {
                    let pingname = RegExp.$1 || "__ANONYMOUS__";
                    let pingsamplepos = RegExp.$2;
                    let pingseconds = parseInt(pingsamplepos) / this._sampleRate;
                    if (pingname) {
                        if (!this._PingPoints[pingname]) { this._PingPoints[pingname] = []; }
                        if (!this._PingListeners[pingname]) { this._PingListeners[pingname] = []; }
                        this._PingPoints[pingname].push(pingseconds);
                        this._TriggeredPingPoints[pingname] = false;
                    }
                }
            } else {
                charsSinceLastPing++;
            }
            i++;

        }
        old_readMetaData.call(this, array, index, size);
    }

    const EPSILON = 0.05
    FWD.IsAnyPingPointActive = function (E = EPSILON) {
        let buffer = AudioManager._bgmBuffer;
        if (!buffer) return false;
        if (!buffer.isPlaying()) return false;
        let currentTime = buffer.seek();

        for (let pingname in buffer._PingPoints) {
            for (let point of buffer._PingPoints[pingname]) {
                let diff = Math.abs(point - currentTime);
                if (diff <= E && diff >= 0) {
                    return true;
                }
            }
        }

        return false;
    }
    window.BangingYroueMom = FWD.IsAnyPingPointActive; // legacy name

    FWD.IsPingPointActive = function (pingname, E = EPSILON) {
        let buffer = AudioManager._bgmBuffer;
        if (!buffer) return false;
        if (!buffer.isPlaying()) return false;
        if (E !== EPSILON) { // only default EPSILON gets cached, so if custom E is used, do full check
            return FWD._IsPingPointActive(pingname, E);
        }
        return buffer._TriggeredPingPoints[pingname] === true;
    }
    FWD._IsPingPointActive = function (pingname, E = EPSILON) {
        let buffer = AudioManager._bgmBuffer;
        if (!buffer) return false;
        if (!buffer.isPlaying()) return false;
        let currentTime = buffer.seek();

        if (pingname in buffer._PingPoints) {
            for (let point of buffer._PingPoints[pingname]) {
                let diff = Math.abs(point - currentTime);
                if (diff <= E && diff >= 0) {
                    return true;
                }
            }
        }
        return false;
    }

    FWD.IsAnonymousPingPointActive = function (E = EPSILON) {
        let buffer = AudioManager._bgmBuffer;
        if (!buffer) return false;
        if (!buffer.isPlaying()) return false;
        if (E !== EPSILON) {
            return FWD._IsPingPointActive('__ANONYMOUS__', E);
        }
        return buffer._TriggeredPingPoints['__ANONYMOUS__'] === true;
    }
    FWD._IsAnonymousPingPointActive = function (E = EPSILON) {
        return FWD._IsPingPointActive('__ANONYMOUS__', E);
    }

    FWD.AddPingListener = function (pingname, callback) {
        let buffer = AudioManager._bgmBuffer;
        if (!buffer) return;

        if (pingname === null || pingname === undefined || pingname === '' || pingname.toLowerCase() === 'anonymous') {
            pingname = '__ANONYMOUS__';
        }

        if (!(pingname in buffer._PingListeners)) {
            console.warn(`Tried to add ping listener, but no pingpoints exist on this track for ${pingname}`);
            return;
        }
        buffer._PingListeners[pingname].push(callback);
    }

    const old_updateWebAudio = SceneManager.updateWebAudio;
    SceneManager.updateWebAudio = function () {
        old_updateWebAudio.call(this);
        let buffer = AudioManager._bgmBuffer;
        if (!buffer) return;
        if (!buffer.isPlaying()) return;

        for (let pingname in buffer._PingPoints) {
            let wasTriggered = buffer._TriggeredPingPoints[pingname];
            let isTriggered = FWD._IsPingPointActive(pingname);
            if (isTriggered && !wasTriggered) {
                for (let callback of buffer._PingListeners[pingname]) {
                    callback();
                }
            }
            buffer._TriggeredPingPoints[pingname] = isTriggered;
        }
    }

    const old_gameInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        old_gameInterpreter_pluginCommand.call(this, command, args);
        if (command.trim().toLowerCase() === 'wait') {
            if (args[0].trim().toLowerCase() === 'for') {
                if (args[1].trim().toLowerCase() === 'pingpoint' || args[1].trim().toLowerCase() === 'ping') {
                    let pingname = '';
                    let epsilon = undefined
                    if (args[2]) {
                        pingname = args[2].trim();
                    }
                    if (args[3]) {
                        epsilon = parseFloat(args[3]);
                    }
                    this._waitEpsilon = epsilon;
                    if (pingname === '') {
                        this._waitMode = 'anonymouspingpoint';
                    } else if (pingname === 'any' || pingname === 'all') {
                        this._waitMode = 'pingpointany';
                    } else {
                        this._waitMode = `pingpoint`;
                        this._waitPingPointName = pingname;
                    }
                }
            }
        }
    }

    const old_gameInterpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function () {
        if (this._waitMode === 'pingpoint') {
            if (FWD.IsPingPointActive(this._waitPingPointName, this._waitEpsilon)) {
                this._waitMode = '';
                this._waitPingPointName = '';
                this._waitEpsilon = undefined;
            } else {
                return true;
            }
        } else if (this._waitMode === 'anonymouspingpoint') {
            if (FWD.IsAnonymousPingPointActive(this._waitEpsilon)) {
                this._waitMode = '';
                this._waitEpsilon = undefined;
            } else {
                return true;
            }
        } else if (this._waitMode === 'pingpointany') {
            if (FWD.IsAnyPingPointActive(this._waitEpsilon)) {
                this._waitMode = '';
                this._waitEpsilon = undefined;
            } else {
                return true;
            }
        }
        return old_gameInterpreter_updateWaitMode.call(this);
    };
}
