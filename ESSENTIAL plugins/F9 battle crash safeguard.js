/*:
 * @plugindesc [v1.0.0] Fixes the crash when entering/exiting the F9 debug menu
 * @author A Australian
 *
 * @help
 * ============================================================================
 * OMORI F9 Battle Debug Fix
 * ============================================================================
 * 
 * This plugin acts as a stability patch for OMORI. It adds safety null-guards 
 * to the custom OMORI battle UI windows, preventing the game from crashing 
 * with "TypeError" errors when closing the F9 Debug Menu mid-combat.
 *
 * Place this plugin ABOVE 'YEP_Debugger.js' but BELOW 'Omori BASE.js' in your Plugin Manager list.
 */

(function() {
    // 1. Fixes Game_Party.battleNumItems crash
    const _OmoOpt_Game_Party_battleNumItems = Game_Party.prototype.battleNumItems;
    Game_Party.prototype.battleNumItems = function(item) {
        const actor = BattleManager.actor();
        if (!actor || !actor.currentAction()) return 0; // Guard clause
        return _OmoOpt_Game_Party_battleNumItems.call(this, item);
    };

    // 2. Fixes Window_ChainSkillList.drawBackgroundColor crash
    const _OmoOpt_Window_ChainSkillList_drawBackgroundColor = Window_ChainSkillList.prototype.drawBackgroundColor;
    Window_ChainSkillList.prototype.drawBackgroundColor = function() {
        if (!this._skills) return; // Guard clause
        _OmoOpt_Window_ChainSkillList_drawBackgroundColor.call(this);
    };
})();
