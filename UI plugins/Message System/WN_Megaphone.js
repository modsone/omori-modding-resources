/*:
 * @plugindesc v1.00 Text loudness changes with size.
 * @author WHITENOISE
 *
 * 
 * @help
 * Pretty simple plugin. Makes text become louder or quieter when the size changes.
 * Bigger text is louder. Smaller text is quieter.
 * You can also change the quantity by which the volume changes from the "Volume Change
 * Amount" option.
 * 
 * Requires YEP_X_ExtMesPack1.
 * 
 * AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
 * 
 * @param Volume Change Amount
 * @type number
 * @min 0
 * @desc Amount the volume changes with each size
 * change. Default: 30
 * @default 30
 * 
 */

// PARAMS

let volumechangeparam = PluginManager.parameters('WN_Megaphone');

let volumechange = Number(volumechangeparam['Volume Change Amount'])

let SAM2 = Window_Base.prototype.makeFontBigger

let BOOTLOOP = Window_Base.prototype.makeFontSmaller

// OVERRIDE OLD FUNCTIONS AND THEN CALL THEM BACK

Window_Base.prototype.makeFontBigger = function() {
        SAM2.call(this)
        $gameSystem._msgSoundVol += volumechange;
        console.log($gameSystem._msgSoundVol)
    }


Window_Base.prototype.makeFontSmaller = function() {
        BOOTLOOP.call(this)
        $gameSystem._msgSoundVol -= volumechange;
    }

//YEAH THATS LITERALLY IT.