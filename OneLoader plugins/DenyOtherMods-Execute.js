//=============================================================================
// FoGsesipod - Deny Other Mods - Execute
// DenyOtherMods-Execute.js
//=============================================================================

//=============================================================================
/*:
 * Please see the other file for setup.
*/
//=============================================================================

{
    if (window.CloseGame) {
        alert(`Mods were detected that could mess with the functionality of: ${window.TotalNames}\nProblematic Mods:\n${window.NotAllowedMods}\n\nPlease remove offending mods and relaunch OMORI.`)
        const nwWindow = nw.Window.get();
        nwWindow.close();
    }
}