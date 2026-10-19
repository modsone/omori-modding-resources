/*:
 @plugindesc Fixes the AtlasMaker and allows it to generate yaml text correctly. Use the script SceneManager.goto(Scene_AtlasMaker) to enter AtlasMaker

*/

//=============================================================================
// ** Scene_AtlasMaker
//-----------------------------------------------------------------------------
// This scene is used to make atlas data
//=============================================================================
function Scene_AtlasMaker() { this.initialize.apply(this, arguments);}
Scene_AtlasMaker.prototype = Object.create(Scene_Base.prototype);
Scene_AtlasMaker.prototype.constructor = Scene_AtlasMaker;
//=============================================================================
// * Object Initialization
//=============================================================================
Scene_AtlasMaker.prototype.initialize = function() {
  // Super Call
  Scene_Base.prototype.initialize.call(this);
  this._sourceRectangle = new Rectangle(0, 0, 0, 0);
  this._destRectangle = new Rectangle(0, 0, 0, 0);
  this._HFrames = 0;
  this._VFrames = 0;
  this._atlasName = ""

  // Resize Window to Screen
  this.resizeWindowToScreen();

  this._fileInput = document.createElement('input');
  this._fileInput.accept = '.png'
  this._fileInput.type = 'file';

  this._fileInput.onchange = function() {
    this._atlasName = this._fileInput.value.replace(/^.*[\\\/]/, '').split('.')[0]
    this._atlasSprite.bitmap = ImageManager.loadAtlas(this._atlasName)
    this.showSource();
    // console.log(this.value)
  }.bind(this)

  // Get Atlas Load Button
  var button = AtlasMakerContainer._buttons.atlasLoadButton;
  button.onclick = function() { this._fileInput.click(); }.bind(this);

  // Get Source Rect Inputs
  var inputs = AtlasMakerContainer._sourceRectInputs;

  for (var i = 0; i < inputs.length; i++) {
    inputs[i].onchange = this.onSourceRectChange.bind(this, i);
  }

  // Get Source Rect Inputs
  var inputs = AtlasMakerContainer._rectInputs;
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].onchange = this.onDestRectChange.bind(this, i);
  }

  // Get Frame Inputs
  var inputs = AtlasMakerContainer._frameInputs;
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].onchange = this.onFrameChange.bind(this, i);
  }


  // Get Show Source Button
  var button = AtlasMakerContainer._buttons.showSource;
  button.onclick = this.showSource.bind(this)

  // Get Show Result Button
  var button = AtlasMakerContainer._buttons.showResult;
  button.onclick = this.showResult.bind(this)

  // Get Show Result Button
  var button = AtlasMakerContainer._buttons.generateYAML;
  button.onclick = this.makeYAML.bind(this)



  // Get Show Result Button
  var button = AtlasMakerContainer._buttons.copySize;
  button.onclick = function() {
    // Get Source Rect Inputs
    var sInputs = AtlasMakerContainer._sourceRectInputs;
    var rInputs = AtlasMakerContainer._rectInputs;

    rInputs[2].value = sInputs[2].value
    rInputs[3].value = sInputs[3].value
    this.onDestRectChange()
  }.bind(this);

  for (var i = 0; i < 4; i++) {
    // console.log(AtlasMakerContainer._buttons['step' + i])
    AtlasMakerContainer._buttons['step' + i].onclick = this.processStep.bind(this, i);
  }



  AtlasMakerContainer.show()

};
//=============================================================================
// * Resize Window to screen size
//=============================================================================
Scene_AtlasMaker.prototype.resizeWindowToScreen = function() {
  // Set Width & Height
  Yanfly.Param.ScreenWidth = window.screen.width
  Yanfly.Param.ScreenHeight = window.screen.height
  SceneManager._screenWidth  = Yanfly.Param.ScreenWidth;
  SceneManager._screenHeight = Yanfly.Param.ScreenHeight;
  // SceneManager._boxWidth     = Yanfly.Param.ScreenWidth;
  // SceneManager._boxHeight    = Yanfly.Param.ScreenHeight
  Yanfly.updateResolution();
  // Get Window X & Y Coordinates
  var x = (window.screen.width - Yanfly.Param.ScreenWidth) / 2
  var y = (window.screen.height - Yanfly.Param.ScreenHeight) / 2
  // Center Window
  window.moveTo(0, 0);



  Graphics.width = window.screen.width
  Graphics.height = window.screen.height

  Graphics._stretchEnabled = false;
  Graphics._updateAllElements

  this.x = 0;
  this.y = 32;
};
//=============================================================================
// * Create
//=============================================================================
Scene_AtlasMaker.prototype.create = function() {

  this._background = new Sprite(new Bitmap(Graphics.width, Graphics.height))
  this._background.bitmap.fillAll('rgba(255, 255, 255, 1)')
  this.addChild(this._background);


  // Create Atlas Container
  this._atlasContainer = new Sprite()
  this._atlasContainer.y = 100;
  this.addChild(this._atlasContainer)

  // Create Atlas Sprite
  this._atlasSprite = new Sprite();
  // this._atlasSprite.x = 100;
  // this._atlasSprite.y = 100
  // this._atlasSprite.scale.set(0.75, 0.75)
  this._atlasContainer.addChild(this._atlasSprite);
  this._atlasSprite.bitmap = ImageManager.loadAtlas('Faraway_PolaroidAtlas')


  this._atlasAreaSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
  this._atlasAreaSprite.bitmap.fillAll('rgba(255, 0, 0, 0.5)')
  this._atlasSprite.addChild(this._atlasAreaSprite)



  this._resultBack = new Sprite(new Bitmap(Graphics.width, Graphics.height));
  this._resultBack.x = 25;
  this._resultBack.y = 25;
  this._resultBack.visible = false
  this._atlasContainer.addChild(this._resultBack)



  this._resultSprite = new Sprite();
  this._resultSprite.x = 25;
  this._resultSprite.y = 25;
  this._atlasContainer.addChild(this._resultSprite)



  this._cover = new Sprite(new Bitmap(Graphics.width, 100))
  this._cover.bitmap.fillAll('rgba(32, 32, 32, 1)')
  this.addChild(this._cover);



  // img/pictures/Faraway_FA_A_01.png:
  //   atlasName: FarawayAtlas_01
  //   rect: {x: 0, y: 0, width: 361, height: 437}
  //   sourceRect: {x: 0, y: 0, width: 361 , height: 437}

}
//=============================================================================
// * Frame Update
//=============================================================================
Scene_AtlasMaker.prototype.getAtlasFile = function() {

  // console.log(this._fileInput.value)
};
//=============================================================================
// * On Source Rect Change
//=============================================================================
Scene_AtlasMaker.prototype.onSourceRectChange = function(index) {
  // Get Source Rect Inputs
  var inputs = AtlasMakerContainer._sourceRectInputs;

  inputs[1].min = 0;
  inputs[1].max = this._atlasSprite.height


  // var maxWidth = ;
  // var maxHeight = this._atlasSprite.height

  this._sourceRectangle.x = inputs[0].value
  this._sourceRectangle.y = inputs[1].value
  this._sourceRectangle.width = inputs[2].value
  this._sourceRectangle.height = inputs[3].value


  this._atlasAreaSprite.setFrame(0, 0, this._sourceRectangle.width, this._sourceRectangle.height)
  this._atlasAreaSprite.x = this._sourceRectangle.x
  this._atlasAreaSprite.y = this._sourceRectangle.y

};
//=============================================================================
// * On Destination Rect Change
//=============================================================================
Scene_AtlasMaker.prototype.onDestRectChange = function() {
  // Get Source Rect Inputs
  var inputs = AtlasMakerContainer._rectInputs;

  this._destRectangle.x = inputs[0].value
  this._destRectangle.y = inputs[1].value
  this._destRectangle.width = inputs[2].value
  this._destRectangle.height = inputs[3].value
};
//=============================================================================
// * On Source Rect Change
//=============================================================================
Scene_AtlasMaker.prototype.showSource = function() {
  this._atlasSprite.x = 0
  this._atlasSprite.y = 0

  this._atlasSprite.visible = true;
  this._atlasAreaSprite.visible = true;
  this._resultSprite.visible = false
  this._resultBack.visible = false

};

//=============================================================================
// * On Show Result Change
//=============================================================================
Scene_AtlasMaker.prototype.showResult = function() {
  this._atlasSprite.visible = false;
  this._atlasAreaSprite.visible = false;
  this._resultSprite.visible = true
  this._resultBack.visible = true

  var dRect = this._destRectangle;
  var sRect = this._sourceRectangle

  var srcBitmap = this._atlasSprite.bitmap;
  var bitmap = new Bitmap(dRect.width, dRect.height);

  bitmap.blt(srcBitmap, sRect.x, sRect.y, sRect.width, sRect.height, dRect.x, dRect.y);


  this._resultBack.bitmap.clear();
  this._resultBack.bitmap.fillRect(0, 0, bitmap.width, bitmap.height, 'rgba(32, 32, 32, 0.1)')

  this._resultSprite.bitmap = bitmap;
};

//=============================================================================
// * On Frame Change
//=============================================================================
Scene_AtlasMaker.prototype.onFrameChange = function() {
  // Get Frame Inputs
  var inputs = AtlasMakerContainer._frameInputs;

  this._HFrames = inputs[0].value
  this._VFrames = inputs[1].value
};


//=============================================================================
// * Process Step
//=============================================================================
Scene_AtlasMaker.prototype.processStep = function(index) {
  // Get Source Rect Inputs
  var inputs = AtlasMakerContainer._sourceRectInputs;

  var width = Number(inputs[2].value);
  var height = Number(inputs[3].value);

  switch (index) {
    case 0: // Up
      inputs[1].value = (Number(inputs[1].value) - height);
      break;
    case 1: // Down
      inputs[1].value = (Number(inputs[1].value) + height);
      break
    case 2: // Left
      inputs[0].value = (Number(inputs[0].value) - width);
      break
    case 3: // Right
      inputs[0].value = (Number(inputs[0].value) + width);
    break
  }
  this.onSourceRectChange();

};
//=============================================================================
// * Process Step
//=============================================================================
Scene_AtlasMaker.prototype.makeYAML = function() {
  var hFrames = this._HFrames;
  var vFrames = this._VFrames;
  var frameTotal = Number(hFrames) + Number(vFrames);
  var dRect = this._destRectangle;
  var sRect = this._sourceRectangle
  var xFrames = [] //updates width per frame
  var yFrames = [] //updates height per frame
 // var text = [];

  //filling x and y array
  for (var i = 0; i <= Number(hFrames); i++){
    xFrames.push(sRect.width * i)
  }

  for (var i = 0; i <= Number(vFrames); i++){
    yFrames.push(sRect.height * i)
  }

  var fullText = `` 

  for(var i = 0; i <= Number(hFrames); i++){
    for(var k = 0; k <= Number(vFrames); k++){
      var text = `
      img/FOLDER/FILENAME.png:
        atlasName: ${this._atlasName}
        rect: {x: ${dRect.x}, y: ${dRect.y}, width: ${dRect.width}, height: ${dRect.height}}
        sourceRect: {x: ${Number(sRect.x) + (Number(sRect.width) * i)}, y: ${Number(sRect.y) + (Number(sRect.height) * k)}, width: ${sRect.width}, height: ${sRect.height}}
      ` 
      fullText = fullText + text; 
     
    };
  };

  console.log(fullText);

 const fs = require('fs');
 fs.writeFileSync('./img/atlases/AtlasOutput.yaml', fullText);

  alert(`YAML GENERATED! Check img/atlases/AtlasOutput.yaml`)
};
//=============================================================================
// * Frame Update
//=============================================================================
Scene_AtlasMaker.prototype.update = function() {
  // Run Original Function
  Scene_Base.prototype.update.call(this);


  if (Input.isRepeated('up')) {

    this._atlasSprite.y -= (this._atlasSprite.height * 0.1)

    if (this._atlasSprite.y < -this._atlasSprite.height) { this._atlasSprite.y = -this._atlasSprite.height}
  };


  if (Input.isRepeated('down')) {

    this._atlasSprite.y += (this._atlasSprite.height * 0.1)
    if (this._atlasSprite.y > 0) { this._atlasSprite.y = 0}

  };

  if (Input.isRepeated('right')) {

    this._atlasSprite.x -= (this._atlasSprite.width * 0.1)

    if (this._atlasSprite.x < -this._atlasSprite.width) { this._atlasSprite.x = -this._atlasSprite.width}
  };


  if (Input.isRepeated('left')) {

    this._atlasSprite.x += (this._atlasSprite.width * 0.1)
    if (this._atlasSprite.x > 0) { this._atlasSprite.x = 0}

  };


}









//=============================================================================
// ** AtlasMakerContainer
//----------------------------------------------------------------------------------------------
//  The static class that handles Atlas settings
//=============================================================================
AtlasMakerContainer.initialize = function() {
  // Set Visibility
  this._visible = false;
  // Create Container
  this.createContainer();


  this.container.appendChild(this.createTextNode('ATLAS CONTROLS:', 5, 0));
  this.container.appendChild(this.createTextNode('SOURCE RECT: (X, Y, WIDTH, HEIGHT)', 300, 0));
  this.container.appendChild(this.createTextNode('RECT: (X, Y, WIDTH, HEIGHT)', 650, 0));
  this.container.appendChild(this.createTextNode('FRAMES: (HORIZONTAL, VERTICAL)', 950, 0));
  
  

  this._sourceRectInputs = [];
  this._rectInputs = []
  this._frameInputs = []

  for (var i = 0; i < 4; i++) {
    var numberInput = document.createElement("INPUT");
    numberInput.type = "number";
    numberInput.defaultValue = 0;
    numberInput.style.position = 'absolute';
    numberInput.style.left = (300 + (i * 70)) + 'px';
    numberInput.style.top = '30px';
    numberInput.style.width = '60px'
    this._sourceRectInputs[i] = numberInput
    this.container.appendChild(numberInput);

    var numberInput = document.createElement("INPUT");
    numberInput.type = "number";
    numberInput.defaultValue = 0;
    numberInput.style.position = 'absolute';
    numberInput.style.left = (650 + (i * 70)) + 'px';
    numberInput.style.top = '30px';
    numberInput.style.width = '60px'
    this._rectInputs[i] = numberInput
    this.container.appendChild(numberInput);
  }

  for (var i = 0; i < 2; i++) {
    var numberInput = document.createElement("INPUT");
    numberInput.type = "number";
    numberInput.defaultValue = 0;
    numberInput.style.position = 'absolute';
    numberInput.style.left = (950 + (i * 70)) + 'px';
    numberInput.style.top = '30px';
    numberInput.style.width = '60px'
    this._frameInputs[i] = numberInput
    this.container.appendChild(numberInput);
  }


  // Initialize Buttons Object
  this._buttons = {}


  var button = document.createElement("BUTTON");
  button.innerHTML = 'Load ATLAS IMAGE'
  button.style.position = 'absolute';
  button.style.left = '0px';
  button.style.top = '30px';
  this._buttons.atlasLoadButton = button;
  this.container.appendChild(button);


  var button = document.createElement("BUTTON");
  button.innerHTML = 'GENERATE YAML'
  button.style.position = 'absolute';
  button.style.left = '150px';
  button.style.top = '30px';
  this._buttons.generateYAML = button;
  this.container.appendChild(button);

  var button = document.createElement("BUTTON");
  button.innerHTML = 'SHOW SOURCE'
  button.style.position = 'absolute';
  button.style.left = '0px';
  button.style.top = '60px';
  this._buttons.showSource = button;
  this.container.appendChild(button);


  var button = document.createElement("BUTTON");
  button.innerHTML = 'SHOW RESULT'
  button.style.position = 'absolute';
  button.style.left = '130px';
  button.style.top = '60px';
  this._buttons.showResult = button;
  this.container.appendChild(button);



  var button = document.createElement("BUTTON");
  button.innerHTML = 'COPY SIZE'
  button.style.position = 'absolute';
  button.style.left = '650px';
  button.style.top = '60px';
  this._buttons.copySize = button;
  this.container.appendChild(button);



  var steps = ['↑', '↓', '←', '→']

  for (var i = 0; i < 4; i++) {
    var button = document.createElement("BUTTON");
    button.innerHTML = 'STEP ' + steps[i]
    button.style.position = 'absolute';
    button.style.left = (300 + (i * 70)) + 'px';
    button.style.top = '60px';
    this._buttons['step' + i] = button
    this.container.appendChild(button);
  }



  // // Create Text Node
  // var node = document.createElement('p');
  // node.innerHTML = text;
  // node.style.position = 'absolute';
  // node.style.margin = "0px";
  // node.style.left = x + 'px';
  // node.style.top = y + 'px';
  // // node.style.textShadow = '1px 1px 0 rgba(0,0,0,0.5)';
  // node.style.color = 'white';
  // node.style.fontSize = '16px';
  // node.style.fontWeight = 'bold';
};