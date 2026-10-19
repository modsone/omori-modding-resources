//=============================================================================
// Seeded RNG - By TomatoRadio
// TR_SeededRng.js
//=============================================================================

var Imported = Imported || {};
Imported.TR_SeededRng = true;

var TR = TR || {};
TR.SEED = TR.SEED || {};

/*: 
 *
 * @plugindesc v1.0 Adds JS functions for seeded RNG.
 * @author TomatoRadio + Chris Doty-Humphrey & bryc
 * 
 * @help
 * This plugin adds a seeded RNG functions to the game.
 * 
 * Firstly, the seed for these functions is set by
 * $gameSystem.setSeed(str);
 * str is a String value containing whatever text you want as the seed.
 * This value is then stored in $gameSystem._seedData['seedStr'] which can be
 * obtained with $gameSystem.getSeed();
 * 
 * From here you can use the following function:
 * Math.seedRandom(key);
 * key is a String value that allows you to iterate the seeded RNG across
 * multiple groups. Eg. storing shop rng in "shop" and enemy patterns in "enemy"
 * so that one doesn't affect the other.
 * Otherwise, the function behaves the same as Math.random(), returning
 * a psuedo-random Number from 0-inclusive to 1-exclusive.
 * 
 * Additionally, these functions are also available:
 * Math.seedRandomInt(max,key);
 * Array.prototype.seedRandom(key);
 * Array.prototype.seedShuffle(key);
 * They behave the same as their standard counterparts,
 * but with seeded RNG.
 * 
 * The non-seeded Array functions are from TR_JsExtensions,
 * though said plugin is not needed for the seeded versions to work.
 * 
 * Lastly, if a seeded function or $gameSystem.getSeed() is called with no
 * defined seed, then the game will leave a warning in console before automatically
 * generating a 12-character alphanumeric seed to use.
 * You can get these random strings yourself with String.random();
 * 
*/

// Source - https://stackoverflow.com/a/47593316
// Posted by bryc, modified by community. See post 'Timeline' for change history
// Retrieved 2026-04-05, License - CC BY-SA 4.0

function sfc32(a, b, c, d) {
  return function() {
    a |= 0; b |= 0; c |= 0; d |= 0;
    let t = (a + b | 0) + d | 0;
    d = d + 1 | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  };
};

// Source - https://stackoverflow.com/a/47593316
// Posted by bryc, modified by community. See post 'Timeline' for change history
// Retrieved 2026-04-05, License - CC BY-SA 4.0

function cyrb128(str) {
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
    return [h1>>>0, h2>>>0, h3>>>0, h4>>>0];
};


// Rest is Tomato

String.random = function(length=12) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

Math.seedRandom = function(key) {
  if (!$gameSystem) {
    console.error("Math.seedRandom() ran without $gameSystem.");
    return Math.random();
  } else {
    if (!$gameSystem._seedData) {
      const str = String.random(12);
      const arr = cyrb128(str);
      console.warn("Seed Data undefined, generated \""+str+"\" automatically")
      $gameSystem._seedData = {seedStr: str, seedArr: arr};
    };
    if (!$gameSystem._seedData[key]) {
      const arr = $gameSystem._seedData.seedArr;
      $gameSystem._seedData[key] = sfc32(arr[0],arr[1],arr[2],arr[3]);
    };
    return $gameSystem._seedData[key]();
  };
};

Math.seedRandomInt = function(max, key) {
  return Math.floor(max * Math.seedRandom(key));
};

Array.prototype.seedRandom = function(key) {
  return this[Math.floor(Math.seedRandom(key)*this.length)]
};

Array.prototype.seedShuffle = function(key) {
  let rand = key ? Math.seedRandom : Math.random;
  var options = this.map(function(a,i) {return i});
  var newArr = [];
  for (let i = 0; i < this.length; i++) {
    let item = this[i];
    let index = options[Math.floor(rand(seed)*options.length)];
    options = options.filter(function(i) {return i !== index});
    newArr[index] = item;
  };
  return newArr;
};

Game_System.prototype.getSeed = function() {
  if (!$gameSystem._seedData) {
    const str = String.random(12);
    const arr = cyrb128(str);
    console.warn("Seed Data undefined, generated \""+str+"\" automatically")
    $gameSystem._seedData = {seedStr: str, seedArr: arr};
  };
  return $gameSystem._seedData.seedStr;
};

Game_System.prototype.setSeed = function(str) {
  const arr = cyrb128(str);
  $gameSystem._seedData = {seedStr: str, seedArr: arr};
};