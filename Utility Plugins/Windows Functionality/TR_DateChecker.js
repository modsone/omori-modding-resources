//=============================================================================
// Date Checker - By TomatoRadio
// TR_DateChecker.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_DateChecker = true;

var TR = TR || {};
TR.DC = TR.DC || {};
TR.DC.version = 2.0;

/*: 
 *
 * @plugindesc Adds a bunch of Date checking functions.
 * Version 2.0
 * @author TomatoRadio
 * 
 * @help
 * Adds the class TRDate to store various date functions:
 * 
 * ------------------------------------------------
 * 
 * The class can get and check the following units of time:
 * 
 * UnitName - Values - Notes
 * Millisecond - 0-999
 * Seconds - 0-59
 * Minutes - 0-59
 * Hours - 0-23 - 0 is 12 AM
 * Weekday - 1-7 - 1 is Sunday
 * Date - 1-31 - As in days of the month
 * Month - 1-12 - 1 is January
 * Year - 0-9999 - It's the year. It can probably be more than 9999 but like, you're not gonna be there to find out.
 * 
 * ------------------------------------------------
 * 
 * You can get any of these with:
 * 
 * TRDate.getUnitName(utc);
 * 
 * UTC is a true/false (boolean) value that determines whether to return the time in UTC or your local timezone.
 * It defaults to false.
 * 
 * These will simply return the units current value when the script is called.
 * For example if it's 1:30PM, then
 * TRDate.getHour();
 * would return 13
 * 
 * ------------------------------------------------
 * 
 * You can check for the specific times of any of these with:
 * 
 * TRDate.isUnitName(value,utc);
 * 
 * Value is what number you're checking for.
 * For example if I was checking for March,
 * I'd use TRDate.isMonth(3);
 * 
 * UTC is the same as before
 * 
 * ------------------------------------------------
 * 
 * The following Unit Pairs can also be got and checked:
 * 
 * Hour&Minute
 * 
 * Month&Date
 * 
 * The get functions are:
 * TRDate.getHourMinute(utc);
 * and return an Array of the two values.
 * 
 * So for example if it was 1:30PM
 * TRDate.getHourMinute();
 * would return [13,30]
 * 
 * The check functions are:
 * TRDate.isMonthDate(month,date,utc)
 * and return true/false
 * 
 * So for example if we're checking for Lucille's birthday (Febuary 7th)
 * TRDate.isMonthDate(2,7)
 * 
 * 
*/

class TRDate {

  constructor() {
    throw new Error('This is a static class') 
  }

  static fullTime() {
    return new Date(Date.now())
  }

  static getMillisecond(utc = false) {
    let time = TRDate.fullTime()
    if (utc) {
      return time.getUTCMilliseconds();
    } else {
      return time.getMilliseconds();
    }
  }

  static isMillisecond(ms,utc=false) {
    if (TRDate.getMillisecond(utc)===ms) {
      return true;
    } else {
      return false;
    }
  }

  static getSecond(utc = false) {
    let time = TRDate.fullTime()
    if (utc) {
      return time.getUTCSeconds();
    } else {
      return time.getSeconds();
    }
  }

  static isSecond(sec,utc=false) {
    if (TRDate.getSecond(utc)===sec) {
      return true;
    } else {
      return false;
    }
  }

  static getMinute(utc = false) {
    let time = TRDate.fullTime()
    if (utc) {
      return time.getUTCMinutes();
    } else {
      return time.getMinutes();
    }
  }

  static isMinute(min,utc=false) {
    if (TRDate.getMinute(utc)===min) {
      return true;
    } else {
      return false;
    }
  }

  static getHour(utc = false) {
    let time = TRDate.fullTime()
    if (utc) {
      return time.getUTCHours();
    } else {
      return time.getHours();
    }
  }

  static isHour(hour,utc=false) {
    if (TRDate.getHour(utc)===hour) {
      return true;
    } else {
      return false;
    }
  }

  static getHour(utc = false) {
    let time = TRDate.fullTime()
    if (utc) {
      return time.getUTCHours();
    } else {
      return time.getHours();
    }
  }

  static isHour(hour,utc=false) {
    if (TRDate.getHour(utc)===hour) {
      return true;
    } else {
      return false;
    }
  }

  static getWeekday(utc = false) {
    let time = TRDate.fullTime();
    if (utc) {
      return time.getUTCDay() + 1;
    } else {
      return time.getDay() + 1;
    }
  }

  static isWeekday(day, utc = false) {
    if (TRDate.getWeekday(utc) === day) {
      return true;
    } else {
      return false;
    }
  }

  static getDate(utc = false) {
    let time = TRDate.fullTime()
    if (utc) {
      return time.getUTCDate();
    } else {
      return time.getDate();
    }
  }

  static isDate(date,utc=false) {
    if (TRDate.getDate(utc)===date) {
      return true;
    } else {
      return false;
    }
  }

  static getMonth(utc = false) {
    let time = TRDate.fullTime()
    if (utc) {
      return time.getUTCMonth()+1;
    } else {
      return time.getMonth()+1;
    }
  }

  static isMonth(month,utc=false) {
    if (TRDate.getMonth(utc)===month) {
      return true;
    } else {
      return false;
    }
  }

  static getYear(utc = false) {
    let time = TRDate.fullTime()
    if (utc) {
      return time.getUTCFullYear();
    } else {
      return time.getFullYear();
    }
  }

  static isYear(year,utc=false) {
    if (TRDate.getYear(utc)===year) {
      return true;
    } else {
      return false;
    }
  }

  static getHourMinute(utc = false) {
    let time = TRDate.fullTime();
    if (utc) {
      return [time.getUTCHours(),time.getUTCMinutes()]
    } else {
      return [time.getHours(),time.getMinutes()]
    }
  }

  
  static isHourMinute(hour,minute,utc=false) {
    if (TR.getHourMinute(utc)[0]===hour&&TRDate.getHourMinute(utc)[1]===minute) {
      return true;
    } else {
      return false;
    }
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