# **OMORI Script Tricks**

# **Notes**

## **Links**

Omori Modding Wiki Guide: [https://omori-modding.gitbook.io/wiki/](https://omori-modding.gitbook.io/wiki/) 

RPGMakerMV Library: [https://kinoar.github.io/rmmv-doc-web/globals.html](https://kinoar.github.io/rmmv-doc-web/globals.html)

MDN Docs Javascript: [https://developer.mozilla.org/en-US/docs/Web/JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) 

Formatting Text: [https://github.com/Gilbert142/gomori/wiki/Text-Formatting](https://github.com/Gilbert142/gomori/wiki/Text-Formatting) 

## **Common Terms**

#### Custom Battle Action Text (CBAT)

A plugin called **Custom Battle Action Text.js** that manages text that displays for skills/item used

#### Action Sequence

Extension plugin for basic functions used for customized action sequences on a technical scale. Change switches, operate variables, add states, change damage rates, etc.

[Action Sequence Pack 1 (YEP) \- Yanfly.moe Wiki](http://www.yanfly.moe/wiki/Action_Sequence_Pack_1_\(YEP\)) 

# **Cheat Sheet**

Only for very common ones.

* MV \- RPG Maker MV  
* PL \- Plugin block in RPG Maker MV  
* JS \- Javascript  
* OM \- Omori specific  
* EV \- Event Notetags  
* EM \- Event Movement Script

| `Type` | `Code Example` | `Notes` |
| :---: | ----- | ----- |
| **`MV`** | **`$gameMap._mapId this._mapId`** | Get Current Map ID Uses: Cutscenes |
| **`MV`** | **`this._eventId this.eventId()`** | Get Event ID (In event page itself) Uses: Quest bubble variable |
| **`MV`** | **`$gamePlayer.x $gamePlayer.y`** | Get player coordinate Uses: Relative Map Teleports |
| **`MV`** | **`$gameSelfSwitches.setValue([mapId, eventId, letter], value); $gameSelfSwitches.value([mapId, eventId, letter]);`** `Example: In same map, set event 4 self switch C on $gameSelfSwitches.setValue([this._mapId, 4, 'C'], true); Example: Check if event 4 self switch C is on (true if on) $gameSelfSwitches.value([this._mapId, 4, 'C']);` | Get / set self switch |
| **`MV`** | `$gameVariables.setValue(id, type); $gameVariables.value(id, type); $gameSwitches.setValue(id, type); $gameSwitches.value(id, type);` | Get / set variables or switches |
| **`MV`** | `Window_BattleLog: addText(text) BattleManager.addText(text) SceneManager._scene._logWindow.push("addText", text)` | Adding text to battle log |
| **`PL`** | `ShowMessage yaml_file.message_name ShowMessage 01_cutscenes_neighbor.message_1` | Shows message from yaml\_file |
| **`PL`** | `AddChoice yaml_file.message_name label AddChoice XX_GENERAL.message_4 YES` | Add a choice which says the message name. Selecting this choice will jump to the label. |
| **`PL`** | `ShowChoices num ShowChoices 2` | Shows choices. Grabs the \<num\> amount of recent addChoice. |
| **`JS`** | `Array: every(function)  Example: Check if ALL switch 1,2,3 is on [1, 2, 3].every((x) => $gameSwitches.value(x))`  | Check if ALL are true [Array.prototype.every() \- JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)  |
| **`JS`** | `Array: some(function)  Example: Check if ANY of switch 1,2,3 is on [1, 2, 3].some((x) => $gameSwitches.value(x)) Example: Check if ANY party member has weapon 203 $gameParty.members().some((actor) => actor.hasWeapon($dataWeapons[203]));` | Check if at least 1 is true [Array.prototype.some() \- JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)  |
| **`JS`** | `Array: forEach(function); Example: Add Happy State to all Alive Enemies $gameTroops.aliveMembers().forEach((enemy) => enemy.addState(5));` | Iterates (doing something) over the array [Array.prototype.forEach() \- JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)  |
| **`JS`** | `Array: reduce((accumulator, currentValue) => accumulator + currentValue, initialValue);  Example: Count amount of Happy Enemies $gameTroops.aliveMembers().reduce((count, battler) => count + battler.isStateAffected(5), 0);` | Return how many is true [Array.prototype.reduce() \- JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)  |
| **`JS`** | `const userName = process.env.WINEUSERNAME ? process.env.WINEUSERNAME : require('os').userInfo().username;` | Return the current username of the logged in account on the computer. Works with linux too. |
| **`OM`** | `Game_Message: showLanguageMessage(string) $gameMessage.showLanguageMessage("XX_GENERAL.message_1");` | Script version of ShowMessage command |
| **`OM`** | `Game_Battler: isEmotionAffected(string) Game_Battler: isAnyEmotionAffected()  $gameActor.actor(1).isEmotionAffected("happy") $gameActor.actor(1).isAnyEmotionAffected()` | Check Emotion |
| **`EM`** | **`MOVE TO: x, y MOVE TO: EVENT x MOVE TO: PLAYER`** `Example Movement Route Script: Move To: 20, 30 Move To: Event 5 Move To: Player` | Make the event path find that coordinate. |
| **`EM`** | **`SELF SWITCH x: ON SELF SWITCH x: OFF SELF SWITCH x: TOGGLE`** `Example Movement Route Script: Self Switch A: On Self Switch B: Off` | Set the event's self switch in the movement route. |
| **`EM`** | `Game_Event: setCustomFrameXY(x,y) Example Movement Route Script: this.setCustomFrameXY(0,2) this.setCustomFrameXY(null,null)` | Sets custom frame, first column and row being 0\. Inputting null value will revert to default. |
| **`EM`** | **`Game_Event: _spriteOffsetX Game_Event: _spriteOffsetY`** `Example Movement Route Script: this._spriteOffsetX = 32 this._spriteOffsetY = -32` | Sets sprite offset value. |
| **`EM`** | **`Fuku_Plugins.EventTremble.start(eventId,power,speed) Fuku_Plugins.EventTremble.stop(eventId)`** `Example Movement Route Script: Fuku_Plugins.EventTremble.start(this._eventId,3,1) Fuku_Plugins.EventTremble.stop(this._eventId)` | Start / Stop event shaking. |
| **`EV`** | **`<Hitbox Up: x> <Hitbox Left: x> <Hitbox Right: x> <Hitbox Down: x>`** | Expand the hitbox upward, left, right, or down by x tiles. If used, makes the event immobile. Commonly used in teleports and walls [Event Hitbox Resize (YEP) \- Yanfly.moe Wiki](http://www.yanfly.moe/wiki/Event_Hitbox_Resize_\(YEP\))  |
| **`EV`** | **`<Sprite Offset X: +n> <Sprite Offset X: -n> <Sprite Offset Y: +n> <Sprite Offset Y: -n> <Sprite Offset: +x, +y> <Sprite Offset: -x, -y>`** | Offset sprite by n amount of pixels, in x or y direction. [Event Sprite Offset (YEP) \- Yanfly.moe Wiki](http://www.yanfly.moe/wiki/Event_Sprite_Offset_\(YEP\))  |
| **`EV`** | **`<Copy Event: Map x, Event y> <Copy Event: mapId, eventId> <Copy Event: template>`** | Copies event, recommended to read in more detail in wiki. Commonly used by enemies. [Event Copier (YEP) \- Yanfly.moe Wiki](http://www.yanfly.moe/wiki/Event_Copier_\(YEP\))  |
| **`EV`** | **`<Save Event Location>`** | Saves Event Location \- Even when re-entering the map |
| **`EV`** | **`<Copy Event: eventName>`** | Copies event, defined in YEP\_EventCopier in plugin list |
| **`EV`** | **`<Activation Square: x> <Activation Radius: x> <Activation Row: x> <Activation Column: x>`** | Give activation range, activating certain events from a distance. Square: x tiles from center in a square shape. Radius: x tiles from center in a diamond shape. Row: Horizontal bar to whole map, with x thickness. Column: Vertical bar to whole map, with x thickness. [Event Proximity Activate (YEP) \- Yanfly.moe Wiki](http://www.yanfly.moe/wiki/Event_Proximity_Activate_\(YEP\))  |

## **Technical File Handling**

### **Video compression \- mp4 to webm**

Optimal mp4 to webm video compression parameter. Used in the command line.

| `ffmpeg -i [filename].mp4 -c:v libvpx-vp9 -crf 23 -vf "scale=640:480,setsar=1,fps=fps=30" -c:a libvorbis -b:a 128k output.webm` |
| :---- |

### **Audio compression \- ogg files**

Compress ogg files. Audio is one of largest space takers, and usually ogg files are more "higher quality" for the same bitrate as mp4.

RPGMaker MV does not like libopus, so libvorbis is used.

| `ffmpeg -i inputFile.wav -c:a libvorbis -b:a 128k output.ogg` |
| :---- |

For windows batch processing can be done. Will go through all audio in the folder the terminal is in, outputting to a folder "result" (also need to be created beforehand):

| `for %i in (*.ogg) do ffmpeg -i "%i" -c:a libvorbis -b:a 128k "result/%i"` |
| :---- |

### **Copy audio metadata**

This is done in a command line folder full of ORIGINAL audios, and has a dummy folder result1 (compressed audio with missing meta) and result2 (the destination).

Windows:

| `for %i in (*.ogg) do ffmpeg -i "%i" -i "result/%i" -map 0 -map_metadata 1 -c copy -movflags use_metadata_tags "result2/%i"` |
| :---- |

# **Detailed**

## **Other**

### **Change Game Speed**

Make the game run faster by how many times it processes in a single frame.

| `SceneManager.determineRepeatNumber = function() { return 1; }` |
| :---- |

## **Map Events**

### **Direction Number**

The Direction numbers are based on the num pad direction, with 0 being no change.

![][image1]

### **Setting Follower Location or Direction**

Useful for setting follower location after cutscene. 

Here's example of moving player to 18, 16, having everyone facing up and behind the player:

| `$gamePlayer.locate(18, 16); $gamePlayer.setDirection(8); $gamePlayer.followers().follower(0).setDirection(8); $gamePlayer.followers().follower(1).setDirection(8); $gamePlayer.followers().follower(2).setDirection(8); $gamePlayer.followers().follower(0).setPosition($gamePlayer.x, $gamePlayer.y+1);  $gamePlayer.followers().follower(1).setPosition($gamePlayer.x, $gamePlayer.y+2); $gamePlayer.followers().follower(2).setPosition($gamePlayer.x, $gamePlayer.y+3);` |
| :---- |

### **Random Specific Number**

Here's an example of generating a random number of randomizing troops. 

In here the variable used for troops is 1502 called “TROOP SELECTION”

| `let list = [709,711,712,714,715,721]; let type = list[Math.randomInt(list.length)]; $gameVariables.setValue(1502, type);` |
| :---- |

![][image2]![][image3]

This removes the need for a long else if chain for each number case.

### **Bulk Messages**

Directly inserting lines into an event with script allows using variables to insert multiple in a loop. For example:

| `let list = [] for (let i = 10; i <= 50; i++) {   list.push({code: 356, indent: 0, parameters: ['ShowMessage FILENAME.message_${i}']}) } $gameMap._interpreter.setupChild(list, $gameMap._ interpreter._ eventId)` |
| :---- |

This example runs showing message\_10 to message\_50 from `FILENAME.yaml`.

For code number see RPGMV Documentation: [https://kinoar.github.io/rmmv-doc-web/classes/game\_interpreter.html](https://kinoar.github.io/rmmv-doc-web/classes/game_interpreter.html) 

## **Action Sequence**

### **Function on group of targets in Whole Target**

In \<whole target\> Eval function only does it to a single target, to do it over all in single line do the following in the notes:

`eval: BattleManager.makeActionTargets('actors').forEach(x=>x.someStuff())`

*This goes through and does **someStuff()** for every battler in **actors**. 'actors' can be replaced with any other target type by YEP*

### **Add battle text (without CBAT)**

In Action Sequence

`BattleManager.addText(String)`

`SceneManager._scene._logWindow.push("addText", String)`

Example:

`eval: BattleManager.addText(user.name() + " throws some biscuit")`

## **AI Priority**

### **Return how many satisfy a function**

Return number of condition met, using reduce() function  and arrow notation in JavaScript:

`$gameParty.members().reduce((n, actor)=>n+actor.isActor(),0)`

*Explanation: Go through **$gameParty.members()** array and **return the sum** of **actor.isActor()** function result.*

*Boolean return when added is considered 1 for true and 0 for false, effectively counting the amount of trues.*

*In this case it should return 4, assuming 4 party member and party members are always actor*

This can be useful for Enemy AI to consider for example when more than 2 party members have max buff for example.