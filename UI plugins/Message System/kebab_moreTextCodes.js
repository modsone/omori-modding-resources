/*:
 * @plugindesc v0.1.0 a plugin that adds a few text codes.
 *
 * @author kebab5769/KEBAB/pitus33/whatever
 * 
 * @help WARNING: This was tested for OMORI mods, so if you want to use this for something
 * else, use it with caution. Feel free to edit the code in case you want and you know what
 * you're doing.
 * 
 * TEXT CODES:
 * 
 * {==========================================}
 * {===========>TENNA'S FUNNY TEXT<===========}
 * {==========================================}
 * 
 * This text code allows to add images, whether animated or not, in a message, just like deltarune's
 * character "Mr. (Ant)Tenna" does in the game's textboxes:
 * 
 *      \tenna[ImageFile, TotalFrames, AnimationSpeed, Spacing, FirstFrameOfTheLoopedAnimation]
 * 
 * ImageFile refers to the image name in the img/system folder without the png extension.
 * Replace it with the name of the image you want to use.
 * 
 * TotalFrames is the total amount of frames the animation of the image, they must be horizontal frames.
 * Replace it with an integer number.
 * 
 * AnimationSpeed (or rather a delay) is the speed of the animation, the lower it is, the faster the animation runs
 * Replace it with an integer number.
 * 
 * Spacing refers to the distance in pixels between the image and the next digit of the dialogue.
 * Replace it with an integer number.
 * 
 *      IMPORTANT NOTE!!: Replacing the Spacing parameter by 0 means there is not spacing between the image and its next digit,
 *      so the image will be above the text. If you don't want that to happen, I recommend to replace the spacing
 *      parameter with the width of a frame of the picture.
 *      Example: if I have a picture which is 128x32 pixels and want it to have 4 frames, each frame will have 32 pixels
 *      of width, so if I want the spacing to be the exact width of the animated picture, I set the spacing parameter as 32.
 * 
 * FirstFrameOfTheLoopedAnimation (long ass name) is the frame from where you like to start the loop of the animation, it is useful if you want
 * to make a beginning animation for when the image appears in your text and then you want it to loop another animation after it.
 * Replace this parameter with an integer number.
 * If you want it to loop the entire animation, you set this parameter to 0
 * 
 * IMPORTANT NOTE 2!!: The beginning frame is 0 and the last one is the one you set in the TotalFrames - 1.
 * 
 * 
 * 
 * EXAMPLE:
 *      text: \n<MR. TENNA>RIGHT! \tenna[tv_susiezilla, 5, 10, 64, 2] will be our baddie smashing!
 * 
 * In the previous example, when the text reaches the \tenna part it will run the animation of an image in img/system
 * folder called "tv_susiezilla", which has five horizontal frames and shows each frame until it reaches the third,
 * where it starts looping through 3rd, 4th, and 5th frame.
 * 
 * In case you don't want any animation for your image, just set the amount of frames to 0, speed to any number (never 0),
 * and the FirstFrameOfTheLoopedAnimation to 0 (or do not add that the FirstFrameOfTheLoopedAnimation)
 * 
 * 
 * 
 * 
 * {===========================================}
 * {==============>SOUND EFFECTS<==============}
 * {===========================================}
 * 
 * This plays a sound effect in the place where you set its textCode:
 * 
 *      \snd[fileName, volume, pitch, pan]
 * 
 *      NOTE: Yes, I know other plugins already add things like this. However, those are for textsounds or letter sounds, which
 *      play on a random pitch and they sound for every letter written in the text, so I added this one which just plays the sound
 *      effect once and lets you set its parameters easily.
 * 
 * 
 * 
 * fileName is the name of the sound effect in audio/se folder.
 * replace this parameter with the name of the sound you want to play.
 * 
 * 
 * volume should be an integer between 0 and 100.
 * pitch should be an integer between 50 and 100.
 * pan should be an integer between -100 and 100.
 * 
 * 
 * 
 * ===============================================
 * FINAL HYPER SUPER IMPORTANT NOTE!!!!!!!
 * ===============================================
 * Thanks to TomatoRadio for helping me on fixing a bug in tenna's funny text and coming up with the FirstFrameOfTheLoopedAnimation idea.
 * 
 * Oh and by the way this is my first plugin.
 *                                  - KEBAB
 * 
 */
var oldWindowMessageProtoProcessEscapeCharacter = Window_Message.prototype.processEscapeCharacter
Window_Message.prototype.processEscapeCharacter = function(code, textState) {
    var multiParamCodes = ["TENNA", "SND"];

    if (multiParamCodes.includes(code)) {
        var str = "";
            if (textState.text[textState.index] === '[') {
                    textState.index++;
                while (textState.index < textState.text.length && textState.text[textState.index] !== ']') {
                    str += textState.text[textState.index];
                    textState.index++;
                }
                textState.index++;
            }
        var input = str.split(",");
    }

    switch (code) {
        case "TENNA": // => \TENNA[file, frames, speed, frameWidth, firstLoopIndex]

            //FUCK THE EXTRA UNWANTED IMAGE (thanks tomatoradio)
            if (input[1] === "" || input.length < 4) break; // thank you, TomatoRadio for this line that fixed my worst issue

            var picture = input[0];
            var bitmap = ImageManager.loadSystem(picture);
            var frames = Number(input[1]);
            // console.log(input);
            var spd = Number(input[2]);
            var wdth = Number(input[3]);
            var loopFirstIdx = Number(input[4]) || 0;
            // console.log(loopFirstIdx)
            var sprite = new Sprite(bitmap);
            sprite.visible = false;
            sprite.x = textState.x;
            sprite.y = textState.y;
            // console.log(textState);
            var counter = 0;

            textState.x += wdth;


            sprite.update = function() {
                Sprite.prototype.update.call(this);
                if (this.bitmap.isReady()) {
                    var pictureWidth = this.bitmap.width / frames;
                    var pictureHeight = this.bitmap.height;
                    var initIdx = Math.floor(counter / spd);
                    var idx
                    if (initIdx < frames) {
                        idx = initIdx;
                    } else if (loopFirstIdx === 0){
                        idx = initIdx % frames;
                    } else {
                        var loopLength = frames - loopFirstIdx;
                        idx = (loopLength > 0) ? loopFirstIdx + ((initIdx - loopFirstIdx) % loopLength) : frames - 1;
                    }
                    this.setFrame(idx * pictureWidth, 0, pictureWidth, pictureHeight);
                    this.visible=true;
                    counter++
                }
            }
            this._windowContentsSprite.addChild(sprite);
            sprite._isTennaPicture = true;
            // console.log("Spamtenna is canon");
        break;

        case "SND": // => \SND[file, volume, pitch, pan]
            if (input[1] === "" || input.length < 4) break;
            AudioManager.playSe({
                name: input[0],
                volume: Number(input[1]),
                pitch: Number(input[2]),
                pan: Number(input[3])
            });
        break;

        default:
            oldWindowMessageProtoProcessEscapeCharacter.call(this, code, textState);
        break;
    }
}

// TENNA FUNCTION REMOVE PICTURE:
var oldWindowMessagePrototypeTerminateMessage = Window_Message.prototype.terminateMessage;
Window_Message.prototype.terminateMessage = function() {
    oldWindowMessagePrototypeTerminateMessage.call(this);
    for (let i = this._windowContentsSprite.children.length-1; i >= 0; i--) { //inverted array loop
        var _$child$_ = this._windowContentsSprite.children[i];
        if (_$child$_ && _$child$_._isTennaPicture) {
            this._windowContentsSprite.removeChild(_$child$_);
        }
    }
}