/*:
 * @plugindesc AmaraTime displays a 12-hour AM/PM clock on the screen. Provides commands to show/hide the clock and window independently. Adds a glitch effect to the clock and allows defining events at specific times. Includes a debug menu to set the clock time manually.
 * @param EnableDebugMenu
 * @text Enable Debug Menu
 * @type boolean
 * @default true
 * @desc Enable or disable the debug menu (F6 key).
 *
 * @param TrackComputerTime
 * @text Track Computer Time
 * @type boolean
 * @default true
 * @desc Enable or disable tracking the computer's time.
 *
 * @author Failsaafe
 * @help
 * AmaraTime V1.1.0
 * Plugin Commands:
 *   ShowClock - Shows the clock
 *   HideClock - Hides the clock
 *   ShowWindow - Shows the dialogue window
 *   HideWindow - Hides the dialogue window
 *   GlitchOn - Turns on the glitch effect for the clock
 *   GlitchOff - Turns off the glitch effect for the clock
 *   DefineEventRange - Defines events to trigger from and to specific times
 *
 * UPDATES:
 * Added a feature in the plugin parameters to disable and enable tracking of
 * users computer time.
 *
 * Added a debug menu when you hit the F6 key to put in time for easy testing
 * This will only work if you have users tracking of computer time disabled.
 *
 * -----------------------------------------------------------------------------
 * A quick tutorial on how to use this:
 * -----------------------------------------------------------------------------
 *
 * To define specific times for events to happen you can do this:
 * Create a parallel event. You can name it whatever you want.
 *
 * Go to a specific switch and name it whatever you want as well. Pay attention
 * to the switches ID when you make it. For this example, we'll use switch 3481.
 * You can use this event to keep track of times for events in a map!
 *
 * Now, lets say you want your event to trigger from 1:00 PM to 1:10 PM! you
 * will simply use the command:
 * DefineEventRange 1:00 PM 3481 ON to 1:09 PM 3481 OFF
 *
 * Just a short note, the range above is not a mistake. The event will continue
 * for the full minute of 1:09 PM until it hits 1:10 PM!
 *
 * Now, assign this switch to another event. Be sure to set this other event as
 * parallel as well but only if you want an animation to play! You can also set
 * an event to change its text or a sprite when you press the action button
 * at any time assigned! Honestly theres no limit to what you can do!
 *
 * That should be all that you need to know! Have fun! If there are any
 * bugs or issues or suggestions at all be sure to contact me on X
 * (formerly twitter)
 * This pluigin is free so all I ask is that you credit me if you use this!
 * Twitter/X: failsaafe
 *
 *
 * PLANNED UPDATES:
 * Allowing clock events to run even if player is outside the map intended
 * to run that event (togglable feature)
 *
 * ---------------------------------------------------
 * Create Forever -- Failsaafe
 * ---------------------------------------------------
 */

(function() {
    var parameters = PluginManager.parameters('AmaraTime');
    var enableDebugMenu = parameters['EnableDebugMenu'] === 'true';
    var trackComputerTime = parameters['TrackComputerTime'] === 'true';

    var clockVisible = true;
    var windowVisible = true;
    var glitchOn = false;
    var debugMenuVisible = false;
    var events = {};
    var eventRanges = {};
    var customTime = null;

    var windowX = 540;
    var windowY = 5;
    var windowWidth = 100;
    var windowHeight = 50;

    function updateClock() {
        if (glitchOn) {
            return generateGlitchText();
        } else {
            var date = new Date();
            if (!trackComputerTime && customTime) {
                date = customTime;
            }
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';

            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            checkEvents(strTime);
            checkEventRanges(strTime);
            return strTime;
        }
    }

    function generateGlitchText() {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var glitchText = '';
        for (var i = 0; i < 6; i++) {
            glitchText += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return glitchText;
    }

    function checkEvents(currentTime) {
        if (events[currentTime]) {
            events[currentTime].forEach(event => {
                $gameSwitches.setValue(event.switchId, event.state === 'ON');
            });
        }
    }

    function checkEventRanges(currentTime) {
        for (var range in eventRanges) {
            var [startTime, endTime] = range.split(' to ');
            if (isTimeInRange(currentTime, startTime, endTime)) {
                eventRanges[range].forEach(event => {
                    $gameSwitches.setValue(event.switchId, event.state === 'ON');
                });
            } else {
                eventRanges[range].forEach(event => {
                    $gameSwitches.setValue(event.switchId, event.state === 'OFF');
                });
            }
        }
    }

    function isTimeInRange(currentTime, startTime, endTime) {
        var current = parseTime(currentTime);
        var start = parseTime(startTime);
        var end = parseTime(endTime);

        if (start < end) {
            return current >= start && current <= end;
        } else {
            return current >= start || current <= end;
        }
    }

    function parseTime(time) {
        var [hours, minutes, period] = time.match(/(\d+):(\d+) (AM|PM)/).slice(1);
        hours = parseInt(hours);
        minutes = parseInt(minutes);
        if (period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }
        return hours * 60 + minutes;
    }

    function toggleDebugMenu() {
        debugMenuVisible = !debugMenuVisible;
        if (debugMenuVisible) {
            showDebugMenu();
        } else {
            hideDebugMenu();
        }
    }

    function showDebugMenu() {
        var overlay = document.createElement('div');
        overlay.id = 'debugOverlay';
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '999';
        document.body.appendChild(overlay);

        var debugMenu = document.createElement('div');
        debugMenu.id = 'debugMenu';
        debugMenu.style.position = 'absolute';
        debugMenu.style.top = '50%';
        debugMenu.style.left = '50%';
        debugMenu.style.transform = 'translate(-50%, -50%)';
        debugMenu.style.padding = '20px';
        debugMenu.style.backgroundColor = 'white';
        debugMenu.style.border = '1px solid black';
        debugMenu.style.zIndex = '1000';

        var input = document.createElement('input');
        input.type = 'text';
        input.id = 'debugTimeInput';
        input.placeholder = 'Enter time (e.g., 4:56 PM)';

        var button = document.createElement('button');
        button.innerText = 'Set Time';
        button.onclick = function() {
            var time = document.getElementById('debugTimeInput').value;
            setTime(time);
        };

        debugMenu.appendChild(input);
        debugMenu.appendChild(button);
        document.body.appendChild(debugMenu);

        // Add event listener for Enter key to set time
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                var time = document.getElementById('debugTimeInput').value;
                setTime(time);
            }
        });

        // Add event listener for Backspace key to delete text
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Backspace') {
                var inputField = document.getElementById('debugTimeInput');
                inputField.value = inputField.value.slice(0, -1);
                event.preventDefault();
            }
        });
    }


    function hideDebugMenu() {
        var overlay = document.getElementById('debugOverlay');
        if (overlay) {
            document.body.removeChild(overlay);
        }
        var debugMenu = document.getElementById('debugMenu');
        if (debugMenu) {
            document.body.removeChild(debugMenu);
        }
    }

    function setTime(time) {
        var parsedTime = parseTime(time);
        var hours = Math.floor(parsedTime / 60);
        var minutes = parsedTime % 60;
        customTime = new Date();
        customTime.setHours(hours);
        customTime.setMinutes(minutes);
        customTime.setSeconds(0);
        customTime.setMilliseconds(0);
        var strTime = hours % 12 + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + (hours >= 12 ? 'PM' : 'AM');
        checkEvents(strTime);
        checkEventRanges(strTime);
        SceneManager._scene._clockSprite.bitmap.clear();
        SceneManager._scene._clockSprite.bitmap.drawText(strTime, 0, 0, 200, 48, 'right');
    }

    if (enableDebugMenu) {
        document.addEventListener('keydown', function(event) {
            if (event.key === 'F6') {
                toggleDebugMenu();
            }
        });
    }

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'ShowClock') {
            clockVisible = true;
            if (SceneManager._scene._clockSprite) {
                SceneManager._scene._clockSprite.visible = true;
            }
            console.log('Clock is now visible.');
        } else if (command === 'HideClock') {
            clockVisible = false;
            if (SceneManager._scene._clockSprite) {
                SceneManager._scene._clockSprite.visible = false;
            }
            console.log('Clock is now hidden.');
        } else if (command === 'ShowWindow') {
            windowVisible = true;
            if (SceneManager._scene._dialogueWindow) {
                SceneManager._scene._dialogueWindow.visible = true;
            }
            console.log('Window is now visible.');
        } else if (command === 'HideWindow') {
            windowVisible = false;
            if (SceneManager._scene._dialogueWindow) {
                SceneManager._scene._dialogueWindow.visible = false;
            }
            console.log('Window is now hidden.');
        } else if (command === 'GlitchOn') {
            glitchOn = true;
            console.log('Glitch effect is now on.');
        } else if (command === 'GlitchOff') {
            glitchOn = false;
            console.log('Glitch effect is now off.');
        } else if (command === 'DefineEvent') {
            var time = args[0] + ' ' + args[1];
            var switchId = Number(args[2]);
            var state = args[3];
            if (!events[time]) {
                events[time] = [];
            }
            events[time].push({ switchId: switchId, state: state });
            console.log('Event defined for ' + time + ' with switch ID ' + switchId + ' set to ' + state);
        } else if (command === 'DefineEventRange') {
            var startTime = args[0] + ' ' + args[1];
            var switchId = Number(args[2]);
            var state = args[3];
            var endTime = args[5] + ' ' + args[6];
            if (!eventRanges[startTime + ' to ' + endTime]) {
                eventRanges[startTime + ' to ' + endTime] = [];
            }
            eventRanges[startTime + ' to ' + endTime].push({ switchId: switchId, state: state });
            console.log('Event range defined from ' + startTime + ' to ' + endTime + ' with switch ID ' + switchId + ' set to ' + state);
        }
    };

    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        if (clockVisible) {
            var clockText = updateClock();
            this._clockSprite.bitmap.clear();
            this._clockSprite.bitmap.drawText(clockText, 0, 0, 200, 48, 'right');
        }
    };

    var _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        _Scene_Map_createDisplayObjects.call(this);
        this._dialogueWindow = new Window_Base(windowX, windowY, windowWidth, windowHeight);
        this._dialogueWindow.z = 0; // Set the layer priority to 0
        this.addChild(this._dialogueWindow);
        // Clock sprite itself
        this._clockSprite = new Sprite(new Bitmap(200, 48));
        this._clockSprite.x = Graphics.width - 215; // Change this to adjust the X position
        this._clockSprite.y = 0; // Change this to adjust the Y position
        this._clockSprite.z = 1; // Set the layer priority to 1
        this.addChild(this._clockSprite);
    };

    var _DataManager_loadGame = DataManager.loadGame;
    DataManager.loadGame = function(savefileId) {
        var result = _DataManager_loadGame.call(this, savefileId);
        clockVisible = true;
        windowVisible = true;
        glitchOn = false;
        customTime = null;
        return result;
    };

    // Update the clock every minute
    setInterval(function() {
        if (!trackComputerTime && customTime) {
            customTime.setMinutes(customTime.getMinutes() + 1);
        }
    }, 60000);

})();
