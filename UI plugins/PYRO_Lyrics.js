



var PYRO = PYRO || {};
PYRO.Lyrics = true;

PYRO.Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function() {
    PYRO.Scene_Map_createAllWindows.call(this);
    this.createTempVarText();
};

Scene_Map.prototype.createTempVarText = function() {
  this.LyricsText = new Window_Lyric();
  this.LyricsText.ypos = 30;
  this.LyricsText.lang = 0;
  this.addChild(this.LyricsText);

  this.LyricsTextRus = new Window_Lyric();
  this.LyricsTextRus.lang = 1;
  this.LyricsTextRus.makeFontSmaller();
  
  this.addChild(this.LyricsTextRus);
};

PYRO.Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function() {
    PYRO.Scene_Battle_createAllWindows.call(this);
    this.createTempVarText();
};

Scene_Battle.prototype.createTempVarText = function() {
  this.LyricsText = new Window_Lyric();
  this.LyricsText.ypos = 30;
  this.LyricsText.lang = 0;
  this.addChild(this.LyricsText);

  this.LyricsTextRus = new Window_Lyric();
  this.LyricsTextRus.lang = 1;
  this.LyricsTextRus.makeFontSmaller();
  
  this.addChild(this.LyricsTextRus);
};


///
///
///

function Window_Lyric() {
    this.initialize.apply(this, arguments);
}

Window_Lyric.prototype = Object.create(Window_Base.prototype);
Window_Lyric.prototype.constructor = Window_Lyric;

Window_Lyric.prototype.initialize = function() {
    
    var ww = 640;
    var wh = 200;
    var wx = 0;
    var wy = 0;
    this.ypos = 0;
    this.text = "";
    this.lang = 0;

    Window_Base.prototype.initialize.call(this, wx, wy, ww, wh);

    
    this.refresh();
    this.opacity = 0;
};

Window_Lyric.prototype.refresh = function() {
  this.contents.clear();
};

Window_Lyric.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    this.visible = true;
    this.contents.clear();

    var pos = 0;
    if(window.extrabgm != undefined)
    {
        pos = window.extrabgm.seek() / (267 * 1000 + 29);
    }
    //var pos = AudioManager._bgmBuffers[1].seek();

    var seekedpos = 0;
    for (var key in window.lyrics[0]) {
        if (key < pos)
            seekedpos = key;
        else if(key < pos)
            break;
    }

    text = window.lyrics[this.lang][seekedpos];
    var w = this.textWidth(text);
    this.drawText(text, 640 / 2 - w / 2, this.ypos, 600)

    if(this.lang == 0)
        this.drawText(pos, 640 / 2 - w / 2, this.ypos + 30, 600)
};

Window_Lyric.prototype.setColor = function(string) {
    this.changeTextColor(string)
}

Window_Lyric.prototype.setText = function(string) {
    this.text = string;
}

window.lyrics = [{}, {}]


    /*
    1:500 - Disposable life in the world number one
    5:800 - This torn city lived, the slaves of Sic'em order
    9:700 - I pour life into a disposable glass
    13:900 - Wait for the arrival, lie down on the virtual sofa
    18:000 - I was chased by the grunts and shot by a dream
    21:800 - Blank windows of the dawn, the border checkpoint
    26:100 - I got the part, but I lost my ticket.
    30:000 - We are killed by a game 
    31:900 - in which there IS NO WIN!
    34:400 - Cooked earth, I met with her, I -
    41:100 - MOTHER DO NO-O-O-O-OT!
    50:800 - DO NO-O-O-O-OT!
    59:300 - 
    83:700 - Disposable life in the world number one
    88:000 - Where my father sent me, and my mother sang the order
    92:000 - I understand life, he makes you sit down
    96:100 - In the hallway killer at the door, he also wants to eat
    100:100 - I've gone mad from the shit and scrap atmospheres
    104:276 - Scream in pain from curling up brain music of the spheres
    108:300 - Rock'n'roll and Metro waiting on suicide watch
    112:400 - We got busted, where are the ciphers? 
    115:000 - Again zero!
    116:900 - Cooked earth, I met with her, I -
    123:200 - MOTHER DO NO-O-O-O-OT! 
    132:000 - DO NO-O-O-O-OT!
    140:000 - 
    141:400 - In the world of million numbers, 21-zero
    145:500 - In the reflection of the masses, I'm an injured moth
    149:300 - 0-two, 0-three, when the moon is dying on a party
    153:500 - Accidentally ran over, sad, lived whole life alone
    157:400 - One-time life in the world number one
    161:800 - I'm tired of surviving, carrying  rock,  eye, a pelvis
    165:500 - I'm suffocating don't keep quiet where the low light is
    169:500 - He's been watching me for thousands of years
    218:600 - MOTHER DO NO-O-O-O-OT! 
    227:700 - DO NO-O-O-O-OT!
    235:600 - MOTHER DO NO-O-O-O-OT! 
    244:700 - DO NO-O-O-O-OT!

    */

var totalLength = (267 * 1000 + 29) 
window.lyrics[0][0]  = "";
window.lyrics[0][(100)  / totalLength]  = "";
window.lyrics[0][(1 * 1000 + 400)  / totalLength]  = "";
window.lyrics[0][(1 * 1000 + 500)  / totalLength]  = "Disposable life in the world number one";
window.lyrics[0][(5 * 1000 + 800)  / totalLength]   = "This torn city lived, the slaves of Sic'em order";
window.lyrics[0][(9 * 1000 + 700)  / totalLength]   = "I pour life into a disposable glass";
window.lyrics[0][(13 * 1000 + 900) / totalLength]   = "Wait for the arrival, lie down on the virtual sofa";
window.lyrics[0][(18 * 1000)       / totalLength]   = "I was chased by the grunts and shot by a dream";
window.lyrics[0][(21 * 1000 + 800) / totalLength]   = "Blank windows of the dawn, the border checkpoint";
window.lyrics[0][(26 * 1000 + 100) / totalLength]   = "I got the part, but I lost my ticket.";
window.lyrics[0][(30 * 1000)       / totalLength]   = "We are killed by a game ";
window.lyrics[0][(31 * 1000 + 900) / totalLength]   = "in which there IS NO WIN!";
window.lyrics[0][(34 * 1000 + 400) / totalLength]   = "Cooked earth, I met with her, I -";
window.lyrics[0][(41 * 1000 + 100) / totalLength]   = "MOTHER DO NO-O-O-O-OT!";
window.lyrics[0][(50 * 1000 + 800) / totalLength]   = "DO NO-O-O-O-OT!";
window.lyrics[0][(59 * 1000 + 300) / totalLength]   = "";
window.lyrics[0][(83 * 1000 + 700) / totalLength]   = "Disposable life in the world number one";
window.lyrics[0][(88 * 1000)       / totalLength]   = "Where my father sent me, and my mother sang the order";

window.lyrics[1][0]  = "";
window.lyrics[1][(1 * 1000 + 500)  / totalLength]  = "RUSSIAN";
window.lyrics[1][(5 * 1000 + 800)  / totalLength]  = "RUSSIAN";
window.lyrics[1][(9 * 1000 + 700)  / totalLength]  = "RUSSIAN";
window.lyrics[1][(13 * 1000 + 900) / totalLength]  = "RUSSIAN";
window.lyrics[1][(18 * 1000)       / totalLength]  = "RUSSIAN";
window.lyrics[1][(21 * 1000 + 800) / totalLength]  = "RUSSIAN";
window.lyrics[1][(26 * 1000 + 100) / totalLength]  = "RUSSIAN";
window.lyrics[1][(30 * 1000)       / totalLength]  = "We are killed by a game ";
window.lyrics[1][(31 * 1000 + 900) / totalLength]  = "in which there IS NO WIN!";
window.lyrics[1][(34 * 1000 + 400) / totalLength]  = "Cooked earth, I met with her, I -";
window.lyrics[1][(41 * 1000 + 100) / totalLength]  = "MOTHER DO NO-O-O-O-OT!";
window.lyrics[1][(50 * 1000 + 800) / totalLength]  = "DO NO-O-O-O-OT!";
window.lyrics[1][(59 * 1000 + 300) / totalLength]  = "";
window.lyrics[1][(83 * 1000 + 700) / totalLength]  = "Disposable life in the world number one";
window.lyrics[1][(88 * 1000)       / totalLength]  = "Where my father sent me, and my mother sang the order";