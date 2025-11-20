/*:
 * @plugindesc Enable multiple faces during message in OMORI
 * @author TrophicRain
 * 
 * @help
 * YAML example:
 * multiface_1:
 *   faceset: MainCharacters_DreamWorld
 *   faceindex: 1
 *   extraFaces:
 *   - faceset: MainCharacters_DreamWorld
 *     faceindex: 6
 *   - faceset: MainCharacters_DreamWorld
 *     faceindex: 18
 *   - faceset: MainCharacters_DreamWorld
 *     faceindex: 36
 *  text: "A white door casts a faint shadow.\\!<br>What would you like to do?\n"
 * 
 */

Window_Message.prototype.loadMessageFace = function () {
    _TDS_.OmoriBASE.Window_Message_loadMessageFace.call(this);

    if ($gameMessage.faceName() !== '') {
        this._faceBoxWindow.setup($gameMessage.faceName(), $gameMessage.faceIndex(), $gameMessage._faceBackgroundColor);
        this._faceBoxWindow.refresh();
        this._faceBoxWindow.open();
    }
    else {
        this._faceBoxWindow.close();
        this._faceBoxWindow.clear();
        this._faceBoxWindow.refresh();
    }

    var faces = $gameMessage.extraFaces();
    for (var i = 1; i < this._faceBoxWindows.length; i++) {
        var data = faces[i-1];
        var boxWindow = this._faceBoxWindows[i];
        if (data) {
            boxWindow.setup(data.faceName, data.faceIndex, data.color);
            boxWindow.refresh();
            boxWindow.open();
        } else {
            boxWindow.close();
            boxWindow.clear();
            boxWindow.refresh();
        };
    };
};


Window_Message.prototype.createFaceBoxWindows = function() {
  this._faceBoxWindows = [];
  this._faceBoxWindowContainer = new Sprite();
  this._faceBoxWindowContainer.x = Graphics.width - 14;

  for (var i = 0; i < 4; i++) {
    var win = new Window_MessageFaceBox(i);
    win.x = -((i + 1) * (win.width + 2));
    win.openness = 0;
    
    this._faceBoxWindows[i] = win;
    this._faceBoxWindowContainer.addChild(win);
  };

  this._faceBoxWindow = this._faceBoxWindows[0];
};


