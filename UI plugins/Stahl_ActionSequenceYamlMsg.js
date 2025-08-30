 /*:
 * @plugindesc v1.0.0 Makes Battle Text addable with YAML
 * @author ReynStahl
 * 
 * @help
 * Dependencies: Put BELOW YEP ActionSequence; (Optionally) BattleManager.addTextSplit() by vl
 * 
 * File name is get from BattleManager.getYamlFileName()
 * The function can be overrided by plugin placed below this.
 * 
 * ================================================================================
 * Example in YEP Action sequence:
 * 
 * YAMLMSG: YamlTextNameHere
 * YAMLMSG: attack_basic
 * 
 * ================================================================================
 * In Yaml Files, Text are formatted to %1 Subject Name, %2 Target Name
 * 
 * In order of priorities:
 * userActorText: Used when the user is an actor
 * userEnemyText: Used when the user is an enemy
 * targetActorText: Used when the target is an actor
 * targetEnemyText: Used when the target is an enemy
 * text: Basic text
 * 
 * Example YAML format:
 * 
 * attack_basic:
 *   text: "%1 attacks %2!"
 * 
 * clean_buff:
 *   targetActorText: "All friends' BUFFS were removed!"
 *   targetEnemyText: "All foes' BUFFS were removed!"
 * 
 * ================================================================================
 */

var Stahl = Stahl || {};
Stahl.AS_YAML = Stahl.AS_YAML || {};

/**
 * The YAML File name. Can override this function for own plugins.
 * @returns 
 */
BattleManager.getYamlFileName = function() {
  return 'reverie_battletext';
}

Stahl.AS_YAML.BattleManager_processActionSequence = BattleManager.processActionSequence;
BattleManager.processActionSequence = function(actionName, actionArgs) {
  if (['YAMLMSG'].contains(actionName)) {
    return this.yamlText(actionArgs[0]);
  }
  return Stahl.AS_YAML.BattleManager_processActionSequence.call(this, actionName, actionArgs);
};

BattleManager.getTextFromYamlData = function(data) {
  var subject = this._subject;
  var target = this._targets[0];

  if (subject.isActor() && data.userActorText) {
    return data.userActorText;
  }
  if (subject.isEnemy() && data.userEnemyText) {
    return data.userEnemyText;
  }
  if (target.isActor() && data.targetActorText) {
    return data.targetActorText;
  }
  if (target.isEnemy() && data.targetEnemyText) {
    return data.targetEnemyText;
  }
  return data.text;
}

BattleManager.yamlText = function(msgName) {
  var subject = this._subject;
  var target = this._targets[0];

  try {
    var data = LanguageManager.getTextData(this.getYamlFileName(), msgName);
    var text = this.getTextFromYamlData(data);
    text = text.format(subject.name(), target.name()); // Formats - %1 is Subject, %2 is Target
    this.addTextSplit(text);
  } catch (e) {
    console.log('YAMLMSG MESSAGE NOT FOUND');
    return false;
  }
  return true;
};

// Adds own function if it does not already exist.
if (BattleManager.addTextsplit == undefined) {
  BattleManager.addTextSplit = function(text) {
    const maxTextLength = 388;
    let lastIndex = text.lastIndexOf(" ");
    if (SceneManager._scene._logWindow._backBitmap.measureTextWidth(text, true) < maxTextLength || lastIndex < 0) {
      SceneManager._scene._logWindow.push("addText", text, 16)
    } else {
      let textBeginning = text.slice(0, lastIndex)
      let textEnding = text.slice(lastIndex + 1)
      for (var i = text.length; i > 0; i--) {
        if (text.charAt(i) != " ") { continue }
        if (SceneManager._scene._logWindow._backBitmap.measureTextWidth(textBeginning, true) > maxTextLength) {
          textBeginning = text.slice(0, i)
          textEnding = text.slice(textBeginning.length + 1)
        }
      }
      SceneManager._scene._logWindow.push("addText", textBeginning, 16)
      SceneManager._scene._logWindow.push("addText", textEnding, 16)
    }
  }
}