/*:
 * @plugindesc Splash Expander
 * @author RPH
 *
 * @help
 * Using the splash expander:
 * - Add a new image to system/
 *
 * - In the code of this file, below the line marked "RULES HERE" put the following
 *       window.splashExpanderRules.add("<name of image>");
 *   where <name of image> is the name of the new file you put into img/system/ without the .png extensionj
 * - After all that, run this script in a plugin
 * - Example rule: window.splashExpanderRules.add("trigger_warning_for_my_mod");
 *
 *
 */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* DO NOT MODIFY THIS LINE */ if (!window.splashExpanderRules) window.splashExpanderRules = new Set(); ///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//

//
// RULES HERE:



// DO NOT MODIFY ANYTHING PAST THIS LINE!
if (!window.splashExpanderInstalled) {
    // back up original rules
    let splashImgs = JSON.parse(JSON.stringify(Galv.ASPLASH.splashImgs));
    function splashExpanderReload() {
        Galv.ASPLASH.splashImgs = JSON.parse(JSON.stringify(splashImgs));
        splashExpanderRules.forEach(function(e) {
            Galv.ASPLASH.splashImgs.push({
                image: e,
                timer: 200,
                fade: 3,
                anim: 314
            })
        })
    }

    window.splashExpanderReload = splashExpanderReload;
    window.splashExpanderInstalled = true;
}

window.splashExpanderReload();
