//=============================================================================
// Allow Skill Attempts - By TomatoRadio
// TR_AllowSkillAttempts.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_AllowSkillAttempts = true;

var TR = TR || {};
TR.ASA = TR.ASA || {};
TR.ASA.version = 1.1;

/*: 
 *
 * @plugindesc Allows all Unicode characters.
 * Version 1.0
 * @author TomatoRadio
 * 
 * @help
 * If the chosen switch is OFF, then the player is allowed to attempt to
 * perform the skill, regardless of if they have enough ENERGY or JUICE.
 * 
 * @param Skill Select Switch
 * @desc If this switch is OFF, then you can attempt to use any skill.
 * @type switch
*/

TR.ASA.Param = PluginManager.parameters('TR_AllowSkillAttempts');

TR.SkillSwitch = Number(TR.ASA.Param["Skill Select Switch"])

Window_SkillList.prototype.isEnabled = function(item) {
    if ($gameSwitches.value(TR.SkillSwitch)) {
        return this._actor && this._actor.canUse(item);
    } else {
        return this._actor
    }
};