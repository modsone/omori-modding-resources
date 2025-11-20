/*:
 * @plugindesc Refresh Party Members In-battle
 * @author KoffinKrypt
 *
 * @help
 * Makes so that you can refresh the party members' battle portraits
 * after adding them to the party mid-battle so that the portraits
 * of the new party member are loaded.
 *
 * Note: This also works with removing party members, and it will
 * delete the party member's battle portrait after they're removed!
 *
 * How to use:
 * Use the script call command in a battle event page after either
 * adding or removing a party member and type this:
 * SceneManager._scene.refreshFaceWindows();
 * 
 * 
 */

Scene_Battle.prototype.refreshFaceWindows = function() {
  // Remove existing face windows
  this.removeFaceWindows();

  // Create Face Windows Container
  this._faceWindowsContainer = new Sprite();
  this.addChild(this._faceWindowsContainer);

  // Initialize
  this._faceWindowsContainer._displayLayersContainer = new Sprite();
  this._faceWindowsContainer.addChild(this._faceWindowsContainer._displayLayersContainer);

  // Get Layers container
  var layers = this._faceWindowsContainer._displayLayersContainer;

  // Create Layer List
  var layerList = ['behind', 'statusBack', 'face', 'polaroid', 'front'];

  // Create Layers
  for (var i = 0; i < layerList.length; i++) {
    var name = '_' + layerList[i];
    var layer = new Sprite();
    layers[name] = layer;
    layers.addChild(layer);
  }

  // Initialize Face Windows Array
  this._faceWindows = [];

  // Position Indexes
  var indexes = [2, 3, 0, 1];

  // Create Face Windows
  for (var i = 0; i < 4; i++) {
    // Get Index
    var index = i;
    var x = 14 + ((index % 2) * ((Graphics.width - 28) - 114));
    var y = 5 + (Math.floor(index / 2) * ((Graphics.height - 16) - 164));

    // Create Face Window
    var faceWindow = new Window_OmoriBattleActorStatus(i, layers, x, y);
    faceWindow.x = !faceWindow.actor() ? i % 2 ? Graphics.width : -faceWindow.windowWidth() : x;
    faceWindow.y = y;
    this._faceWindows[i] = faceWindow;
    this._faceWindowsContainer.addChild(faceWindow);
  }

  // Create Animation Sprite for Layers
  for (var i = 0; i < layerList.length; i++) {
    // Get Layer
    layer = layers['_' + layerList[i]];

    // Create Face Animation Sprite
    var sprite = new Sprite_BattleFaceAnimation();
    sprite._effectTarget = sprite;
    layers['_animation' + i] = sprite;
    layer.addChild(sprite);
  }

  // Set status Windows Face Windows
  this._statusWindow._faceWindows = this._faceWindows;
};

Scene_Battle.prototype.removeFaceWindows = function() {
  // Remove existing face windows
  if (this._faceWindowsContainer) {
    this._faceWindowsContainer.parent.removeChild(this._faceWindowsContainer);
  }
};
