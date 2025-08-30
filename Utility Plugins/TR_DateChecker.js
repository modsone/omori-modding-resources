//=============================================================================
// Date Checker - By TomatoRadio
// TR_DateChecker.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_DateChecker = true;

var TR = TR || {};
TR.DC = TR.DC || {};
TR.DC.version = 1.0;

/*: 
 *
 * @plugindesc Adds a bunch of Date checking functions.
 * Version 1.0
 * @author TomatoRadio
 * 
 * @help
 * Adds the class TRDate with the following functions:
 * 
 * TRDate.fullTime();
 * Returns the full time as a Date object.
 * 
 * TRDate.getMonthDate(utc);
 * Gets the current month and date as an array of numbers.
 * If utc is true, returns the time in UTC. Defaults false.
 * 
 * TRDate.isMonthDate(month,date,utc);
 * Returns true if the current date is what's listed.
 * Input month and date as numbers please.
 * If utc is true, checks the times in UTC. Defaults false.
 * 
*/

class TRDate {

  static fullTime() {
    return new Date(Date.now())
  }

  static getMonthDate(utc = false) {
    let time = TRDate.fullTime();
    if (utc) {
      return [time.getUTCMonth() + 1,time.getUTCDate()]
    } else {
      return [time.getMonth() + 1,time.getDate()]
    }
  }

  static isMonthDate(month,date,utc = false) {
    if (TRDate.getMonthDate(utc)[0] ===month && TRDate.getMonthDate(utc)[1] === date) {
      return true;
    } else {
      return false;
    }
  }

}