//=============================================================================
// Template - By [AUTHOR]
// Template.js
//=============================================================================

var Imported = Imported || {};
Imported.Template = true;

var NAME = NAME || {};
NAME.TEMP = NAME.TEMP || {};

/*: 
 * @plugindesc v1.0 Header Text
 * @author [AUTHOR]
 * 
 * @help
 * Plugin Documentation
 * 
 * @param string
 * @text String Param
 * @desc Description
 * @default text
 * 
 * @param note
 * @text Note Param
 * @type note
 * @desc Description
 * @default "Multi\nLine\nText"
 * 
 * @param boolean
 * @text Bool Param
 * @type boolean
 * @desc Description
 * @on TRUE
 * @off FALSE
 * @default true
 * 
 * @param number
 * @text Number Param
 * @type number
 * @desc Description
 * @min 0
 * @max 10
 * @decimals 1
 * @default 2.5
 * 
 * @param file
 * @text Image Param
 * @type file
 * @dir img/
 * @desc Description
 * @default characters/DW_OMORI
 * 
 * @param select
 * @text Select Param
 * @type select
 * @desc Description
 * @option Choice #1
 * @value 1
 * @option Choice #2
 * @value 2 
 * @option Choice #3
 * @value 3
 * @option Choice #4
 * @value 4
 * @default Choice #1
 * 
 * @param combo
 * @text Combo Param
 * @type combo 
 * @desc Description
 * @option Choice #1
 * @option Choice #2
 * @option Choice #3
 * @option Choice #4
 * @default Choice #1
 * 
 * These settings can also be used for [class, skill, item, weapon, armor, enemy, troop, state, animation, tileset, common_event, switch, variable]
 * @param actor
 * @text Actor Param
 * @type actor
 * @desc Description
 * @default 1
 * 
 * Reminder that Arrays can be set to any of the above types like a Java array. (eg. number[])
 * @param array
 * @text Array Param
 * @type []
 * @desc Description
 * @default ["a","b"]
 * 
 * @param struct
 * @text Struct Param
 * @type struct<bgm>
 * @desc Description
 * @default {"name":"white_space","volume":"100","pitch":"60","pan":"0"}
 * 
*/
/*~struct~bgm:
 * @param name
 * @text Name
 * @type file
 * @dir audio/bgm
 * @desc Description
 * @default white_space
 * 
 * @param volume
 * @text Volume
 * @type number
 * @min 0
 * @max 200
 * @decimals 0
 * @desc Description
 * @default 100
 * 
 * @param pitch
 * @text Pitch
 * @type number
 * @min 0
 * @max 200
 * @decimals 0
 * @desc Description
 * @default 60
 * 
 * @param pan
 * @text Pan
 * @type number
 * @min 0
 * @max 200
 * @decimals 0
 * @desc Description
 * @default 0
 * 
 */


NAME.TEMP.Param = PluginManager.parameters('TR_Template');

NAME.TEMP.string = NAME.TEMP.Param["string"];
NAME.TEMP.note = NAME.TEMP.Param["note"];
NAME.TEMP.boolean = eval(NAME.TEMP.Param["boolean"]);
NAME.TEMP.number = Number(NAME.TEMP.Param["number"]);
NAME.TEMP.file = NAME.TEMP.Param["file"];
NAME.TEMP.select = NAME.TEMP.Param["select"]; // This can be made into a parseInt() or Number() if you store them as numbers
NAME.TEMP.combo = NAME.TEMP.Param["combo"];
NAME.TEMP.actor = Number(NAME.TEMP.Param["actor"]);
NAME.TEMP.array = JSON.parse(NAME.TEMP.Param["array"]);
NAME.TEMP.struct = JSON.parse(NAME.TEMP.Param["struct"]);

NAME.TEMP.pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	// Return Original Function
	return NAME.TEMP.pluginCommand.call(this, command, args);
};