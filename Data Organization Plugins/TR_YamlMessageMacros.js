//=============================================================================
// YAML Message Macros - By TomatoRadio
// TR_YamlMessageMacros.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_YamlMessageMacros = true;

var TR = TR || {};
TR.YMM = TR.YMM || {};

/*: 
 *
 * @plugindesc v1.0 Allows storing YEP_MessageMacros text as a YAML file.
 * @author TomatoRadio
 * 
 * @help
 * 
 * Add a YAML that looks like this:
 * MessageMacros:
 *  66: #The id of the macro. eg 5
 *      name: wdg #The shorthand used in yaml. eg \bas
 *      text: \n<DR. GASTER> #The text that is passed. eg \n<BASIL>
 * You can add as many indexes as you like. You also don't need to have
 * anything set in the actual YEP plugins for this to override the slot.
 * 
 * If you don't edit an index, the old YEP settings will still be used.
 * 
 * @param Yaml
 * @text Message Macro YAML
 * @desc The YAML file that the Macros are in.
 * 
*/

(function($) {
  for (const id in $) {
    let m = $[id];
    if (m && m.text && m.name) {
      Yanfly.MsgMacro[id] = m.text.replace(/\\/g,'\x1b');
      Yanfly.MsgMacroRef[m.name.toUpperCase()] = m.name;
      Yanfly.MsgMacroArr[id] = new RegExp('\x1b'+m.name,'gi');
    };
  };
})(LanguageManager.getMessageData(PluginManager.parameters('TR_YamlMessageMacros')["Yaml"].trim()+".MessageMacros") || {});