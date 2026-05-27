//=============================================================================
 /*:
 * @plugindesc
 * Lets you customize them damage number' (0.1, probably not done!)
 * 
 * @help
 * HOW TO USE: The "Number conditions" setting lets you make a list of conditions for displaying
 * damage numbers, going top to bottom priority wise. "atkReq" let's you set the condition itself,
 * and "atkId" is the index of the number used:
 * 
 * - (NOTE: examples and requirements will be set up as text, so they can just be copypasted)
 *
 * - EXAMPLE 1 (display index 5 if actor deals over 1000 damage)
 * - ,{"atkReq":"result.hpDamage > 1000","atkId":"4"} (Index starts from 0 obv)
 * 
 * - EXAMPLE 2 (display index 2 if actor deals under 0 mp damage (juice drain))
 * - ,{"atkReq":"result.mpDamage < 0","atkId":"1"}
 *
 * the 3 default conditions are the vanilla number displays, due to how conditions are prioritized it is recommended to leave these at the bottom of the conditions list at all times.
 * (NOTE, the first one is for juice drain. I know its displayed as an example already. I dont care.)
 * 
 * The "damageIDs" variable is the amount of indexes the "damage" system picture has. due to how the numbers object is set up
 * this needs to be exactly the amount of damage numbers the spritesheet has, otherwise it will cause broken cropping.
 * 
 * there is a few commented out console logs you can use to check both what the plugin is doing and what values you can use to make
 * conditionals. this should be fairly mod compatible as far as im aware.
 * 
 * @author LAUPIG
 * 
 * 
 *  * @param settings
 * @text Number conditions
 * @type struct<Chars>[]
 * @desc the formulas for setting attack numbers
 * @default ["{\"atkReq\":\"result.mpDamage < 0\",\"atkId\":\"3\"}","{\"atkReq\":\"result.hpAffected\",\"atkId\":\"0\"}","{\"atkReq\":\"result.mpAffected\",\"atkId\":\"2\"}"]
 * 
 *  * @param damageIDs
 * @min 1
 * @max 999
 * @desc the amount of damage indexes
 * @default 7
 * 
 */
/*~struct~Chars:
 *
 * @param atkReq
 * @desc the requirement for this number to be displayed
 * @default result.hpAffected
 *
 * @param atkId
 * @min 1
 * @max 999
 * @desc the number row this requirement shows (from damage.png)
 * @default 1
 */
  
//=============================================================================

// setting up plugin parameters and stuff

setupParameters = function(objList) {
  var list = [];
  objList = JSON.parse(objList);
  for (var i = 0; i < objList.length; ++i) {
    var d = JSON.parse(objList[i]);
    d.atkReq = (d.atkReq);
    d.atkId = parseInt(d.atkId);
    list.push(d);
  }
  return list;
  }  
var params = PluginManager.parameters('LPG_attacknumberplus');
var indexcap = parseInt(params['damageIDs']);
var characterObjList = setupParameters(params['settings']);
console.log(characterObjList);
console.log(characterObjList[1].atkReq);

// damage bitmap height

Sprite_Damage.prototype.digitHeight = function() {
  return this._damageBitmap ? this._damageBitmap.height / indexcap : 0;
};

// bullshit to make the damage display display the damage displayed properly

(function () {
Sprite_Damage.prototype.setup = function(target) {
    this._result = target.shiftDamagePopup();
    var result = this._result;
    console.log(result);
    if (result.missed || result.evaded) {
      this.createMiss();}
    for (var i = 0; i < characterObjList.length; i++) {
      if (characterObjList[i].atkReq && !!eval(characterObjList[i].atkReq)) {
      this.createDigits(characterObjList[i].atkId, result.hpDamage);
      console.log(i);
      console.log(characterObjList[i].atkReq);
      console.log(characterObjList[i].atkId);
      break}
    if (result.critical) {
      this.setupCriticalEffect();
    }
};}})()    

