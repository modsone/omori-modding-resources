//=============================================================================
// Text Sound Arrays - By TomatoRadio
// TR_TextSoundArrays.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_TextSoundArrays = true;

var TR = TR || {};
TR.TSA = TR.TSA || {};
TR.TSA.version = 2.0;

/*: 
 * @plugindesc v2.0 Allows for multiple Letter Sounds to be used together.
 * @author TomatoRadio
 * 
 * @help
 * This plugin allows for you to have an array of Letter Sounds 
 * that are selected either randomly or sequencially when
 * text is displayed.
 * 
 * To set them up, go to where you define your Letter Sounds,
 * which is primarily with the textcode `lsn<Sounds>`, or
 * the yaml header `textsound:` for WN_ExtendedYaml users.
 * 
 * Then when defining them, make them a list of them,
 * seperating them with either an `,` or `.` (No spaces)
 * The different puncuation determines the method of
 * how the Letter Sounds are selected.
 * 
 * Commas:
 * These arrays will select the sound randomly from the
 * array, with the exception that the last sound played
 * cannot play again. So effectively no dittoes.
 * 
 * Periods: (Not the menstrual ones)
 * These arrays will select the sound sequencially in the
 * order you defined them as. The slot in sequence will
 * persist between messages with the same arrays, but will
 * reset if the array is changed. They will start at the
 * first sound listed.
 * 
 * #################################################
 * 
 * Extra JS/Technical stuff:
 * 
 * Random Exclusion Rules:
 * Due to the way I coded this randomizer,
 * the first message to use a randomized array
 * will start with the "last played sound" as
 * the first one. So the first letter sound will
 * never be the first sound played. This...
 * doesn't really matter...
 * 
 * Script Calls:
 * $gameSystem._msgSoundIndex
 * This returns the index (0 indexed) of the either
 * the last played sound (random) or the next sound
 * to play (sequenced.)
 * 
 * $gameSystem._msgOldSoundName
 * This returns the last message sound used.
 * This includes both arrays and single-files.
 * 
 * When $gameSystem._msgSoundIndex is not defined,
 * or is otherwise a falsy value, then it will be
 * set to 0. This should never impact gameplay beyond
 * not crashing the game.
 * 
*/

Game_System.prototype.getMessageSound = function() {
    if (this._msgSoundName === undefined) this.initMessageSounds();
    var obj = {
      name: this._msgSoundName,
      volume: this._msgSoundVol,
      pitch: this._msgSoundPitch,
      pan: this._msgSoundPan
    }
    var name = obj['name']
    if (!this._msgSoundIndex) this._msgSoundIndex = 0 //Creates it if it doesn't exist.
    //If we changed message sounds since last play, reset the randomness index.
    if (this._msgOldSoundName && this._msgOldSoundName !== name) this._msgSoundIndex = 0;
    //Store this name for the next time we get this sound.
    this._msgOldSoundName = name
    if (name.includes(',')) { //Random
        let array = name.split(',')
        let max = array.length
        let index //Init the var bc declaring it in a loop sounds dangerous lol
        //Generates an index
        do {
          index = Math.floor(Math.random() * max)
        } while (index === this._msgSoundIndex); 
        // ^ Makes sure the index is not the same as the last played index.
        // This is to make sure we don't play the same sound twice.
        obj['name'] = array[index]
        this._msgSoundIndex = index;
        // ^ Store this index for future checks
    } else if (name.includes('.')) { //Sequencial
        let array = name.split('.');
        let max = array.length-1
        let index = this._msgSoundIndex
        if (index > max) index = 0 //If we go past the last sound, reset
        obj['name'] = array[index]
        this._msgSoundIndex = index+1 //increase the index for next play.
    }
    //console.log(obj['name'])
    var max = this._msgSoundPitch + this._msgSoundPitchVar;
    var min = this._msgSoundPitch - this._msgSoundPitchVar;
    obj['pitch'] = Math.floor(Math.random() * ( max - min + 1) + min);
    var max = this._msgSoundPan + this._msgSoundPanVar;
    var min = this._msgSoundPan - this._msgSoundPanVar;
    obj['pan'] = Math.floor(Math.random() * ( max - min + 1) + min);
    return obj;
};