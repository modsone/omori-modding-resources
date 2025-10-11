//=============================================================================
// Custom Crash Popups - By TomatoRadio
// TR_CustomCrashPopups.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_CustomCrashPopups = true;

var TR = TR || {};
TR.CCP = TR.CCP || {}; //我刚刚从中赢得了一百亿社会信用
TR.CCP.version = 1.0;

/*: 
 *
 * @plugindesc Version 1.0 Allows custom messages when the game crashes.
 * @author TomatoRadio
 * 
 * @help
 * You can define messages to appear when the game crashes,
 * both for the basegame crash message and the console mod
 * crash message.
 * 
 * You can also award a badge for when this occurs.
 * 
 * Here is an example yaml message for this:
 * 
 * errormessage:
 *   console: "PARALLELS has encountered a bug. Please report it to our Feedback Form at https://forms.gle/RfbtiFR1dD5rHEsK6."
 *   html:    'PARALLELS has encountered a bug. Please report it to our <a href="#" onclick="Graphics.openSteamBugPage()" style="color:green;">Feedback Form</a>.<br>'
 *   link:    "https://forms.gle/RfbtiFR1dD5rHEsK6"
 * 
 * @param yaml
 * @text Error YAML Message
 * @type struct<yaml>
 * @desc The YAML Message that contains the error messages.
 * 
 * @param badge
 * @text Error Badge
 * @type struct<badge>
 * @desc The badge to award if the game crashes.
*/
/*~struct~yaml:
 * @param yamlFile
 * @text YAML File
 * @desc The name of the YAML file.
 * 
 * @param messageId
 * @text Message ID
 * @desc The ID of the message that stores both error messages.
 * 
*/
/*~struct~badge:
 * @param unlockBadge
 * @text Unlock Badge?
 * @type boolean
 * @desc Set to ON to enable a crash badge.
 * 
 * @param modId
 * @text Mod ID
 * @desc The mod ID of the crash badge.
 * 
 * @param badgeId
 * @text Badge ID
 * @desc The badge ID of the crash badge.
 * 
*/

TR.CCP.Param = PluginManager.parameters('TR_CustomCrashPopups');

TR.CCP.yaml  = JSON.parse(TR.CCP.Param["yaml"]);
TR.CCP.badge = JSON.parse(TR.CCP.Param["badge"]);

TR.CCP.printFullError = Graphics.printFullError
Graphics.printFullError = function(name, message, stack) {
  TR.CCP.printFullError.call(this,name,message,stack);
  if (window.commands.active) { // If console mod exists
    window.commands.log(LanguageManager.getMessageData(`${TR.CCP.yaml[yamlFile]}.${TR.CCP.yaml[messageId]}`).console);
  };
  if (DGT && DGT.UnlockBadgeSilent && (TR.CCP.badge[unlockBadge] == "true")) { //Award error badge
    DGT.UnlockBadgeSilent(TR.CCP.badge[modId],TR.CCP.badge[badgeId]);
    if (DGT.isBadgeUnlocked(TR.CCP.badge[modId],TR.CCP.badge[badgeId])) console.log("crash badge unlocked");
  };
};

Graphics.processErrorStackMessage = function(stack) {
  var data = stack.split(/(?:\r\n|\r|\n)/);
  data.unshift(LanguageManager.getMessageData(`${TR.CCP.yaml[yamlFile]}.${TR.CCP.yaml[messageId]}`).html);
  for (var i = 1; i < data.length; ++i) {
    data[i] = data[i].replace(/[\(](.*[\/])/, '(');
  };
  return data;
};

Graphics.openSteamBugPage = function() {
  window.nw.Shell.openExternal(LanguageManager.getMessageData(`${TR.CCP.yaml[yamlFile]}.${TR.CCP.yaml[messageId]}`).link);
};