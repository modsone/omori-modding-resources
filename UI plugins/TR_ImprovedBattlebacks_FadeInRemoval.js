//=============================================================================
// YEP_ImprovedBattlebacks FadeIn Removal - By TomatoRadio
// TR_ImprovedBattlebacks_FadeInRemoval.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_ImprovedBattlebacks_FadeInRemoval = true;

var TR = TR || {};
TR.IB_FIR = TR.IB_FIR || {};
TR.IB_FIR.version = 2.0;

/*: 
 *
 * @plugindesc Removes fade in from Improved Battlebacks
 * Version 2.0
 * @author TomatoRadio
 * 
 * @help
 * Normally, when you add a new battleback with YEP_ImproveBattlebacks, it will fade in over 20 frames.
 * This sets it so that the HUE option in the ADD command now dictates the fade in time.
 * It defaults to 1, which is effectively instant.
 * 
*/

//Allows modding of the fade-in on ImprovedBattlebacks
BattleManager.alterBattleback = function(line) {
  if (line.match(/(?:BATTLEBACK|BATTLE BACK)[ ](\d+)/i)) {
    var id = Math.max(1, parseInt(RegExp.$1));
    var spriteset = SceneManager._scene._spriteset;
    if (!spriteset) return;
  } else {
    return;
  }
  // TESTING
  if (line.match(/TESTING/i)) {
    console.log('Test Passed');
  // CHANGE TO
  } else if (line.match(/CHANGE TO/i)) {
    if (line.match(/:[ ](.*),[ ](.*),[ ](\d+)/i)) {
      var folder = 'img/' + String(RegExp.$1) + '/';
      var filename = String(RegExp.$2);
      var hue = Number(RegExp.$3).clamp(0, 360);
    } else if (line.match(/:[ ](.*),[ ](.*)/i)) {
      var folder = 'img/' + String(RegExp.$1) + '/';
      var filename = String(RegExp.$2);
      var hue = 0;
    } else {
      return;
    }
    spriteset.changeBattlebackTo(id, folder, filename, hue);
  // FADE IN
  } else if (line.match(/FADE IN/i)) {
    if (line.match(/:[ ](\d+)/i)) {
      var duration = parseInt(RegExp.$1);
    } else {
      var duration = 20;
    }
    spriteset.battlebackFadeIn(id, duration);
  // FADE OUT
  } else if (line.match(/FADE OUT/i)) {
    if (line.match(/:[ ](\d+)/i)) {
      var duration = parseInt(RegExp.$1);
    } else {
      var duration = 20;
    }
    spriteset.battlebackFadeOut(id, duration);
  // OPACITY
  } else if (line.match(/OPACITY/i)) {
    if (line.match(/:[ ](\d+)([%％])/i)) {
      var rate = parseFloat(RegExp.$1) * 0.01;
      var value = Math.round(rate * 255);
    } else if (line.match(/:[ ](\d+)/i)) {
      var value = parseInt(RegExp.$1);
    } else {
      return;
    }
    spriteset.battlebackOpacity(id, value);
  // RESET SCROLL SPEED
  } else if (line.match(/RESET SCROLL SPEED/i)) {
    spriteset.resetScrollSpeeds(id);
  // SCROLL SPEED X
  } else if (line.match(/SCROLL SPEED X:[ ]([\+\-]\d+)/i)) {
    var speed = parseInt(RegExp.$1);
    spriteset.setBattlebackScrollSpeedX(id, speed);
  // SCROLL SPEED Y
  } else if (line.match(/SCROLL SPEED Y:[ ]([\+\-]\d+)/i)) {
    var speed = parseInt(RegExp.$1);
    spriteset.setBattlebackScrollSpeedY(id, speed);
  // ADD
  } else if (line.match(/ADD/i)) {
    if (line.match(/:[ ](.*),[ ](.*),[ ](\d+)/i)) {
      var folder = 'img/' + String(RegExp.$1) + '/';
      var filename = String(RegExp.$2);
      var duration = Number(RegExp.$3).clamp(0, 360);
    } else if (line.match(/:[ ](.*),[ ](.*)/i)) {
      var folder = 'img/' + String(RegExp.$1) + '/';
      var filename = String(RegExp.$2);
      var duration = 1;
    } else {
      return;
    }
    var hue = 0
    var bitmap = ImageManager.loadBitmap(folder, filename, hue, true);
    var opacity = 0;
    spriteset.addNewBattleback(id, bitmap, opacity, duration);
  // REMOVE
  } else if (line.match(/REMOVE/i)) {
    spriteset.removeBattleback(id);
  }
};