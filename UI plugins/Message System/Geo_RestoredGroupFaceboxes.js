//=============================================================================
 /*:
 * @plugindesc
 * Basically restores the old open/close message faceboxes AND re-implements the cut functionality of having more than one facebox on the screen.
 * @help
 * Basically restores the old open/close message faceboxes AND re-implements the cut functionality of having more than one facebox on the screen.
 * Just as a warning, this WILL change how faceboxes open/close. If you don't mind that, then you're good to go!
 *
 * Use "extraFaces:" as a message property in order to make this work. Example:
 *message_1:
 *     faceset: MainCharacters_DreamWorld 
 *     faceindex: 36
 *     extraFaces:
 *      -
 *        faceset: MainCharacters_DreamWorld
 *        faceindex: 16 
 *      -
 *        faceset: MainCharacters_DreamWorld
 *        faceindex: 0
 *     text: Woah, unused dialogue box functionalities!\!<br>Starting off with this!\. The limit of dialogue portraits on the screen is 4!
 *
 * @author Geo
 *
 */
//=============================================================================

// * FOR OVERRIDING THE EDITED METHOD * //

Window_Message.prototype.loadMessageFace = function() {
    this._faceBitmap = ImageManager.reserveFace($gameMessage.faceName(), 0, this._imageReservationId);
};

//=============================================================================
// * Load Message Face
//=============================================================================

_TDS_.OmoriBASE.Window_Message_loadMessageFace = Window_Message.prototype.loadMessageFace;
Window_Message.prototype.loadMessageFace = function() {
  // Run Original Function
  _TDS_.OmoriBASE.Window_Message_loadMessageFace.call(this);
  // Get Box Window
  var boxWindow = this._faceBoxWindows[0];
  // Setup Box Window
  // found out that if this was just plainly using the showtext command, it'd always clear the loaded face (and try to always setup empty facebox data)-
  // so it's better to Just import the code from the final game's facebox here for the original facebox at position 0, since the loop below ignores it
  if ($gameMessage.faceName() !== '') {
			boxWindow.setup($gameMessage.faceName(), $gameMessage.faceIndex(), $gameMessage._faceBackgroundColor);
			boxWindow.refresh();
			boxWindow.open();
	} else {
			boxWindow.close();
			boxWindow.clear();
			boxWindow.refresh();
  };
  // Get Extra Faces
  var faces = $gameMessage.extraFaces();
  // Go Through Face Box Windows
  for (var i = 1; i < this._faceBoxWindows.length; i++) {
    // Get Data
    var data = faces[i -1];
    // Get Box Window
    var boxWindow = this._faceBoxWindows[i];
    // If Data
    if (data) {
      // Setup Box Window
      boxWindow.setup(data.faceName, data.faceIndex, data.color);
      boxWindow.refresh();
	  boxWindow.clear();
      boxWindow.open();
    } else {
      // Clear Box Window
	  boxWindow.close();
      boxWindow.clear();
      boxWindow.refresh();
    };
  };
};

//=============================================================================
// * Create Face Box Windows
//=============================================================================

Window_Message.prototype.createFaceBoxWindows = function() {
  // Initialize Face Box Windows Array
  this._faceBoxWindows = [];
  // Create FaceBoxWindow Container
  this._faceBoxWindowContainer = new Sprite();
  this._faceBoxWindowContainer.x = 0//Graphics.width
  for (var i = 0; i < 4; i++) {
    // Create Window
    var win = new Window_MessageFaceBox(i);
    win.x = -((i + 1) * (win.width + 2));
    win.openness = 0;
    // Set FaceBox Window
    this._faceBoxWindows[i] = win;
    this._faceBoxWindowContainer.addChild(win);
  };
};

//=============================================================================
// * Update Open
//=============================================================================

Window_Message.prototype.updateOpen = function() {
  if (this._opening) {
    // Super Call
    Window_Base.prototype.updateOpen.call(this);
    var rate = this.openness / 255
    var tx = (this.x + this.width + 2);
    this._faceBoxWindowContainer.x = ((Graphics.width - 16) + tx + 2) - (rate * tx);
    var d = Math.max((rate * 20), 1);
    this._nameWindow.x = (this._nameWindow.x * (d - 1) + 77) / d;
    if (this._battleMessageTail) {
      this._battleMessageTail.y = this._windowSpriteContainer.y + 4;
      this._battleMessageTail.scale.y = rate;
    };
  };
};

//=============================================================================
// * Update Close
//=============================================================================

Window_Message.prototype.updateClose = function() {
  if (this._closing) {
    // Super Call
    Window_Base.prototype.updateClose.call(this);
    var rate = this.openness / 255
    var tx = Graphics.width;
    this._faceBoxWindowContainer.x = (Graphics.width + tx + 2) - (rate * tx)
    var d = Math.max((rate * 20), 1);
    this._nameWindow.x = (this._nameWindow.x * (d - 1) + -300) / d;
    if (this._faceBoxWindow) {this._faceBoxWindow.openness = Math.min(this._faceBoxWindow.openness,this.openness)};
    if (this._battleMessageTail) {
      this._battleMessageTail.y = this._windowSpriteContainer.y + 4;
      this._battleMessageTail.scale.y = rate;
    };
    if (this.isClosed()) {
      // Go Through Face Box Windows
      for (var i = 0; i < this._faceBoxWindows.length; i++) {
        this._faceBoxWindows[i].openness = 0;
      };
    };
  };
};

//=============================================================================
// * Update Placement
//=============================================================================

Window_ChoiceList.prototype.updatePlacement = function() {
  // Run Original Function
  _TDS_.OmoriBASE.Window_ChoiceList_updatePlacement.call(this);
  // Move Window
  this.x -= 18; this.y -= 8;
  var messageY = this._messageWindow.y;
  if (messageY >= Graphics.boxHeight / 2) {
    this.y -= 4;
  } else {
    this.y += 4;
  };
  // Get Face Window
  var faces = $gameMessage.extraFaces();
  for (var i = this._messageWindow._faceBoxWindows.length - 1; i >= 0; i--) {
    // Get Data
    var data = this._messageWindow._faceBoxWindows[i].openness > 0;
    // If Data
    if (data) {
		this.lastFaceWindow = this._messageWindow._faceBoxWindows[i];
		break;
    };
  };
  // Set Position based on face window
  if (!!$gameMessage.faceCount()) { this.x += this.lastFaceWindow.x; };
};

//=============================================================================
// * Request Images
//=============================================================================
Game_Interpreter.requestImages = function(list, commonList, id = 0){
  // Set Count
  let count = 0;
  // If List Exists
  if (list) {
    // If List exists
    if (list) {
      // Get First Command
      const command = list[0];
      // If its an event command and contains the tag
      if (command.code === 108 && command.parameters[0].contains("<IgnoreEventImageLoading>")) {
        return 0;
      };
    };
    // Get Temporary Reservation ID
    const reservationId = 'TEMP_EVENT_' + id;
    // Go Through list
    for (var i = 0; i < list.length; i++) {
      // Get Command
      const command = list[i];
      // Command Code Switch Case
      switch(command.code){
		  // Fix for "Show Text" (probably not actually) command in RPG Maker MV not loading portraits properly,
		  // move it here and make it use a different method for loading
		//case 101:
          //  ImageManager.reserveFace(command.parameters[0], 0, reservationId);
		  //  count++;
        //break;  
        // Plugin Command
        case 356:
          // Get Arguments and command name
          const args = command.parameters[0].split(" ");
          const commandName = args.shift();
          // If Command Name is for showing message
          if (commandName === 'ShowMessage') {
            // Get Message Data
            const data = LanguageManager.getMessageData(args[0]);
            // If Fceset is not empty
            if (data.faceset !== "") {
              // Request Face Image
              ImageManager.reserveFace(data.faceset, 0, reservationId);
              // Increase Count
              count++;
            };
            // If Data has Extra Faces
            if (data.extraFaces) {
              // Go Through Extra Fraces
              for (var a = 0; a < data.extraFaces.length; a++) {
                // Request Extra Faces Image
                ImageManager.loadFace(data.extraFaces[a].faceset);
                /// Increase Load Count
                count++;
              };
            };
          };
        break;
      }
    };
  };
  // Run Original Function
  _TDS_.OmoriBASE.Game_Interpreter_requestImages.call(this, list, commonList);
  // Return Total Count
  return count;
}