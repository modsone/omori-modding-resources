//=============================================================================
// COOLDRY_Picture_Layers.js
//=============================================================================
/*:
 * @plugindesc Allows Pictures to be put on separate layers in battle.
 *
 * @author Cooldry
 *
 * @help
 * The ability to put pictures in both the foreground and background
 * separately basically allows you to make battlebackgrounds
 * that can be edited like normal pictures (Animated usinging
 * custom picture plugin, being manipulated with normal RPGMAKER).
 * 
 * =====================
 *  Instructions
 * =====================
 * 
 *  After creating a picture the normal way (eg: Show Picture):
 *  
 *  For creating a "back" image (Behind Enemies)
 * 
 *    BattleManager.CustomPictureBattleback(Picture Id)
 * 
 *  For removing a "back" image (Makes it a "normal picture")
 * 
 *    BattleManager.EraseCustomPictureBattleback(PictureId)
 * 
 *  For creating a "front" image (In Front of  Enemies, Behind Party UI)
 * 
 *    BattleManager.CustomPictureForeground(Picture Id)
 * 
 *  For removing a "front" image (Makes it a "normal picture")
 * 
 *    BattleManager.EraseCustomPictureForeGround(PictureId)
 *  
 * 
 */

//=============================================================================
// * 
//=============================================================================
// 

Game_Interpreter.prototype.FR_ToneSetup = function(picture)
{
picture._tone = $gameScreen._tone
picture._toneTarget = $gameScreen._toneTarget
picture._toneDuration = $gameScreen._toneDuration
}

// CUSTOM BACKGROUND STUFF



CheckForPictureBackground = function(){
    for(var i = 0; i < SceneManager._scene._spriteset._battleField.children.length; i++ )
      {if(SceneManager._scene._spriteset._battleField.children[i]._background != undefined)
       {return SceneManager._scene._spriteset._battleField.children[i]}
      }
  }

CheckForPictureForeground = function(){
  for(var i = 0; i < SceneManager._scene._spriteset.children.length; i++ )
    {if(SceneManager._scene._spriteset.children[i]._foreground != undefined)
     {return SceneManager._scene._spriteset.children[i]}
    }
}

// CheckForPictureEnemy = function(enemy){
//   for(var i = 0; i < BattleManager._spriteset._enemySprites.length; i++ )
//     {if(BattleManager._spriteset._enemySprites[i]._enemy == enemy)
//      {return BattleManager._spriteset._enemySprites[i]}
//     }
// }

////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////


  let oldSetPictureDisplay = BattleManager.setPictureDisplayLayer
  BattleManager.setPictureDisplayLayer = function(){
    oldSetPictureDisplay.call(this, ...arguments)
    
  
  }
  
  let oldBattleSetup = BattleManager.startBattle
  BattleManager.startBattle = function(){
  

    // Back Picture Setup

    pictureBattlebacks = new Sprite
    for(var i = 0; i < 100; i++){
    pictureBattlebacks.addChild(new Sprite_Picture)
    }
    pictureBattlebacks._background = true
    SceneManager._scene._spriteset._battleField.addChildAt(pictureBattlebacks, 0) 

    // Front Picture Setup

    pictureBattlebacks = new Sprite
    for(var i = 0; i < 100; i++){
    pictureBattlebacks.addChild(new Sprite_Picture)
    }
    pictureBattlebacks._foreground = true
    SceneManager._scene._spriteset.addChildAt(pictureBattlebacks, 3) 

    // Enemy Setup
    // pictureEnemy = new Sprite
    // var enemies = $gameTroop.members()
    // for(var i = 0; i < 100; i++){
    // pictureEnemy.children[i] = undefined
    // }
    // for(var k = 0; k < enemies.length; k++){
    //   BattleManager._spriteset._enemySprites[k].addChild(pictureEnemy)
    // }
    oldBattleSetup.call(this, ...arguments)
  }

  //////////////////////
  // Custom Background
  ///////////////////////

  BattleManager.CustomPictureBattleback = function(picture){

    var container = SceneManager._scene._spriteset._pictureContainer
    var pic = SceneManager._scene._spriteset._pictureContainer.children[picture - 1]
  
    CheckForPictureBackground().removeChildAt(picture)
    CheckForPictureBackground().addChildAt(pic, picture)
    container.addChildAt(new Sprite_Picture, picture - 1)
   }

/////////////////////////////////////////////////////////////////////
   
   BattleManager.EraseCustomPictureBattleback = function(picture){
  
    var container = SceneManager._scene._spriteset._pictureContainer
    //var pic = SceneManager._scene._spriteset._pictureContainer.children[picture - 1]
  
    container.removeChildAt(picture - 1)
    container.addChildAt(CheckForPictureBackground().children[picture], picture - 1)
    CheckForPictureBackground().addChildAt(new Sprite_Picture, picture)
    $gameScreen.erasePicture(picture);
   }

  //////////////////////
  // Custom Foreground
  ///////////////////////

  BattleManager.CustomPictureForeground = function(picture){
    
    var container = SceneManager._scene._spriteset._pictureContainer
    var pic = SceneManager._scene._spriteset._pictureContainer.children[picture - 1]
  
    CheckForPictureForeground().removeChildAt(picture)
    CheckForPictureForeground().addChildAt(pic, picture)
    //console.log("PICTURE = " + picture)
    container.addChildAt(new Sprite_Picture, picture - 1)
    Game_Interpreter.prototype.FR_ToneSetup($gameScreen.picture(picture))
   }

/////////////////////////////////////////////////////////////////////
   
   BattleManager.EraseCustomPictureForeground = function(picture){
  
    var container = SceneManager._scene._spriteset._pictureContainer
    // var pic = SceneManager._scene._spriteset._pictureContainer.children[picture - 1]
  
    container.removeChildAt(picture - 1)
    container.addChildAt(CheckForPictureForeground().children[picture], picture - 1)
    CheckForPictureForeground().addChildAt(new Sprite_Picture, picture)
    $gameScreen.erasePicture(picture);
   }