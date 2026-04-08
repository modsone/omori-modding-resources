// this plugin overrides the default play movie command to use YSP_Video plugin's video player
// instead of the default one, which has issues(?) sometimes(?) for some reason(?) (unreproducible(?))

// uses ysp video id 909 to play movies

// code 261: Play Movie
// code 356: Plugin Command
// code 355: Script
// code 655: Script (continued)
// code 230: Wait (frames)
// code 108: Comment
{
    const videoFileExt = function() {
        if (Graphics.canPlayVideoType('video/webm') && !Utils.isMobileDevice()) {
            return '.webm';
        } else {
            return '.mp4';
        }
    };
    const _YSP_normalizeVideoSizeAndPosition = function (video) {
        const width = video.texture.baseTexture.width;
        const height = video.texture.baseTexture.height;
        const screenWidth = Graphics.width;
        const screenHeight = Graphics.height;
        if (width <= screenWidth && height <= screenHeight) {
            // no need to scale, just center it
            video.x = (screenWidth - width) / 2;
            video.y = (screenHeight - height) / 2;
            return;
        }
        const scaleX = screenWidth / width;
        const scaleY = screenHeight / height;
        const scale = Math.min(scaleX, scaleY);
        const newWidth = Math.floor(width * scale);
        const newHeight = Math.floor(height * scale);
        video.x = (screenWidth - newWidth) / 2;
        video.y = (screenHeight - newHeight) / 2;
        video._YSP_targetScale = scale;
    }
    Game_Interpreter.prototype._YSP_normalizeVideoSizeAndPosition = function (video) {
        _YSP_normalizeVideoSizeAndPosition(video);
    }
    Game_Interpreter.prototype.setupYSPVideoInterpreter = function (videoName, ext) {
        //check for skippable flag in a preceding comment
        let skippable = false;
        if (this._index > 0) {
            let previousCommand = this._list[this._index - 1];
            if (previousCommand.code === 108) {
                let commentText = previousCommand.parameters[0];
                if (commentText.includes("<MOVIE_SKIPPABLE>")) {
                    skippable = true;
                }
            }
        }

        let videoFinishCondition = "ysp.VideoPlayer.hasVideoFinished(909)";
        if (skippable) {
            videoFinishCondition += " || Input.isTriggered('cancel')";
        }
        //setup the interpreter with commands to play video using YSP_VideoPlayer
        this.setupChild([
            // preload video (this doesnt actually seem to be necessary, but whatever)
            { code: 355, parameters: [`ysp.VideoPlayer.loadVideo('${videoName}${ext}')`], indent: 0 },
            // wait for video to be ready
            { code: 356, parameters: [`Wait For Condition ysp.VideoPlayer.isReady()`], indent: 0 },
            // play video, store reference to it in $gameTemp
            { code: 355, parameters: [`$gameTemp.__YSP_MOVIE = ysp.VideoPlayer.newVideo('${videoName}${ext}', 909)`], indent: 0 },
            { code: 655, parameters: [`ysp.VideoPlayer.playVideoById(909)`], indent: 0 },
            // add black background behind video
            { code: 355, parameters: [`const bg = new Sprite();`], indent: 0 },
            { code: 655, parameters: [`bg.bitmap = new Bitmap(Graphics.width, Graphics.height);`], indent: 0 },
            { code: 655, parameters: [`bg.bitmap.fillAll("black");`], indent: 0 },
            { code: 655, parameters: [`SceneManager._scene.addChild(bg);`], indent: 0 },
            // store background reference for later removal
            { code: 655, parameters: [`$gameTemp.__YSP_MOVIE_background = bg;`], indent: 0 },
            // add video sprite to scene (YSP_VideoPlayer adds it to spriteset, which is underneath the picture layer)
            { code: 355, parameters: [`SceneManager._scene.addChild($gameTemp.__YSP_MOVIE)`], indent: 0 },
            // normalize size and position
            { code: 355, parameters: [`this._YSP_normalizeVideoSizeAndPosition($gameTemp.__YSP_MOVIE)`], indent: 0 },
            // wait for video to finish
            { code: 356, parameters: [`Wait For Condition ${videoFinishCondition}`], indent: 0 },
            // small delay to avoid potential issues with stopping video too early
            { code: 230, parameters: [1], indent: 0 },
            { code: 355, parameters: [`ysp.VideoPlayer.stopVideoById(909)`], indent: 0 },
            // remove background sprite from scene
            { code: 355, parameters: [`SceneManager._scene.removeChild($gameTemp.__YSP_MOVIE_background)`], indent: 0 },
            // remove video sprite from scene
            { code: 355, parameters: [`SceneManager._scene.removeChild($gameTemp.__YSP_MOVIE)`], indent: 0 },
            // clear reference
            { code: 355, parameters: [`$gameTemp.__YSP_MOVIE = null`], indent: 0 },
            { code: 355, parameters: [`$gameTemp.__YSP_MOVIE_background = null`], indent: 0 },
            // release video resources
            // { code: 355, parameters: [`ysp.VideoPlayer.releaseVideo('${videoName}${ext}')`], indent: 0 },
        ], 0)
    }
    Game_Interpreter.prototype.command261 = function () {
        const videoName = this._params[0];
        const ext = this.videoFileExt();
        this.setupYSPVideoInterpreter(videoName, ext);
        return true;
    }

    const _old_ysp_VideoPlayer_newVideo = ysp.VideoPlayer.newVideo;
    ysp.VideoPlayer.newVideo = function (videoName, id = "video") {
        let video = _old_ysp_VideoPlayer_newVideo.call(this, videoName, id);
        video.update = function () {
            video.texture.update();
            // console.log(video.texture.baseTexture.source.readyState)
            let scale = video._YSP_targetScale || 1;
            let baseTexture = video.texture.baseTexture;
            let baseWidth = baseTexture.width;
            let baseHeight = baseTexture.height;
            if (video.width !== baseWidth * scale || video.height !== baseHeight * scale) {
                _YSP_normalizeVideoSizeAndPosition(video);
                video.width = baseWidth * scale;
                video.height = baseHeight * scale;
            }
        }
        return video;
    }


    // i hate YSP video player so much

    // anyway, preload/release videos based on events present on the map
    // preload when event is present, release when event is gone
    // easy peasy lemony squeezy
    let preloadPageMovies = function(page, preloadNames, visitedCommonEvents = new Set()) {
        for (let command of page.list) {
            if (command.code === 261) {
                let videoName = command.parameters[0];
                if (!preloadNames.has(videoName)) {
                    preloadNames.add(videoName + videoFileExt());
                }
            }
            if (command.code === 355 || command.code === 655) {
                let script = command.parameters[0];
                let loadMatch = script.match(/ysp\.VideoPlayer\.loadVideo\(['"](.+?)['"]\)/);
                if (loadMatch) {
                    let videoName = loadMatch[1];
                    if (!preloadNames.has(videoName)) {
                        preloadNames.add(videoName);
                    }
                }
            }
            if (command.code === 117) { // common event
                let commonEventId = command.parameters[0];
                if (visitedCommonEvents.has(commonEventId)) {
                    continue;
                }
                visitedCommonEvents.add(commonEventId);
                let commonEvent = $dataCommonEvents[commonEventId];
                if (commonEvent) {
                    preloadPageMovies(commonEvent, preloadNames, visitedCommonEvents);
                }
            }
        }
    }
    let preloadEventMovies = function(event, preloadNames) {
        for (let page of event.pages) {
            preloadPageMovies(page, preloadNames);
        }
    }

    Game_Map.prototype._YSP_PreloadEventsVideos = function() {
        if (!window._YSP_loadedMapMovieNames) { window._YSP_loadedMapMovieNames = new Set(); }
        let newMapVideoNames = new Set();
        for (let gameEvent of this.events()) {
            let event = gameEvent.event();
            preloadEventMovies(event, newMapVideoNames);
        }
        for (let videoName of newMapVideoNames) {
            if (!window._YSP_loadedMapMovieNames.has(videoName)) {
                console.log("Preloading movie: ", videoName);
                ysp.VideoPlayer.loadVideo(videoName);
                window._YSP_loadedMapMovieNames.add(videoName);
            }
        }
        for (let videoName of window._YSP_loadedMapMovieNames) {
            if (!newMapVideoNames.has(videoName)) {
                console.log("Releasing movie: ", videoName);
                ysp.VideoPlayer.releaseVideo(videoName);
                window._YSP_loadedMapMovieNames.delete(videoName);
            }
        }
    };

    Game_Troop.prototype._YSP_PreloadVideos = function() {
        if (!window._YSP_loadedTroopMovieNames) { window._YSP_loadedTroopMovieNames = new Set(); }
        let newTroopVideoNames = new Set();
        let troop = this.troop();
        for (let page of troop.pages) {
            preloadPageMovies(page, newTroopVideoNames);
        }
        for (let videoName of newTroopVideoNames) {
            if (!window._YSP_loadedTroopMovieNames.has(videoName)) {
                console.log("Preloading troop movie: ", videoName);
                ysp.VideoPlayer.loadVideo(videoName);
                window._YSP_loadedTroopMovieNames.add(videoName);
            }
        }
    }

    let old_Game_Troop_setup = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function(troopId) {
        old_Game_Troop_setup.call(this, troopId);
        this._YSP_PreloadVideos();
    }

    let old_Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        old_Scene_Map_onMapLoaded.call(this);
        $gameMap._YSP_PreloadEventsVideos();

        // release all troop movies when going to map scene (which would happen after battle)
        if (window._YSP_loadedTroopMovieNames) {
            for (let videoName of window._YSP_loadedTroopMovieNames) {
                console.log("Releasing troop movie: ", videoName);
                ysp.VideoPlayer.releaseVideo(videoName);
            }
        }
        window._YSP_loadedTroopMovieNames = new Set();
    }
    
}