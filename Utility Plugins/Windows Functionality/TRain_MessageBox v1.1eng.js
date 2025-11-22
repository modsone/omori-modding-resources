/*:
 * @plugindesc Windows-like Message Box v1.1
 * @author TrophicRain
 * 
 * @help
 * This plugin allows you to pop up a message box like OneShot.
 * Updates:
 * v1.1 No longer need extra folder, to make it work with OneLoader
 *      Fixed bugs with multiple message boxes and laggy computers
 * 
 * ------------------------------------------------------------------------------
 * [Please prepare the following Common Event]
 * Wait msgbox return - Trigger: None
 * 
 * ◆Comment: !!! Function: Wait until a message box returns after the last TR_MsgBox.show() !!!
 * ◆Loop
 *   ◆If: Script: TR_MsgBox.return
 *     ◆Break Loop
 *   :End
 *   ◆Wait: 1 frame
 * :Repeat Above
 * 
 * ------------------------------------------------------------------------------
 * [Example]
 * ◆Script:
 * TR_MsgBox.show({
 * 
 *   // Frequently used
 *   lines: ["Line 1", "Line 2"],
 *   title: "Window Title",
 *   buttons: ["OK", "Cancel"],
 *   msgIcon: "info",
 * 
 *   // Not so frequently used
 *   winIcon: "data:image/png;base64,png_base64_string",
 *   onTop: true,
 *   position: { dx: 100, dy: 100 },
 * 
 *   // Advanced
 *   blockMain: true,
 *   callback: function(button){ ... }
 * 
 * });
 * ◆Common Event: Wait msgbox return
 * ◆Script: var chosenButton = TR_MsgBox.return;
 * 
 * [Quick Use]
 * ◆Script: TR_MsgBox.show("Simple message\nwith line break");
 * ◆Common Event: Wait msgbox return
 * 
 * ------------------------------------------------------------------------------
 * [Parameters]
 * lines: a single string (automatically wrapped by '\n'), or a string array (one line each)
 * buttons: the name of selected button is stored in TR_MsgBox.return
 * msgIcon: icon on the left side of text, "info", "warning", "error", "question", ""(no icon)
 * 
 * winIcon: title bar icon, use base64 image
 * onTop: always on top of other windows
 * position: offset relative to the center of the screen
 * 
 * blockMain: stop SceneManager.update until a message box returns
 * callback: "this" is binded to child nw.Window; use TR_MsgBox._mainWin to reference the main Window
 * 
 * [Return Value]
 * The name of button selected is stored in TR_MsgBox.return. Cleared when TR_MsgBox.show() is called again.
 * 
 * 
 * ------------------------------------------------------------------------------
 * [If you want to pause the event execution and wait for the message box to return,
 * regardless of whether blockMain is set, Wait msgbox return should be called]
 * Explanation:
 * [1] SceneManager.stop() doesn't really block the main process, the current update() will still be completed,
 * and [2] there may be multiple updateScene() calls.
 * [1] causes the code after stop() to continue executing,
 * [2] makes waiting for just 1 frame not enough to ensure that message box has returned.
 * 
 * 
 * ------------------------------------------------------------------------------
 * [License]
 * MIT License
 * I would appreciate it if you could credit me (TrophicRain) (*^_^*).
 * 
 */




nw.Window.get().on('close', function(){
    nw.App.quit();
});


nw.global.TR_MsgBox = {
    return: null,

    _path: (require('fs').existsSync('www') ? 'www/' : '') + 'save/TR_MB.html',
    _mainWin: nw.Window.get(),
    _lastId: 0,
    _params: {},
    _html: null,
    _writeHtml: null,

    defaultCallback: function(button){
        TR_MsgBox.return = button;

        var id = parseInt(this.window.location.search.substring(1), 10);
        var mainWindow = TR_MsgBox._mainWin.window;
        if (TR_MsgBox._params[id].blockMain && mainWindow.SceneManager._stopped){
            mainWindow.TouchInput.clear();
            mainWindow.SceneManager.resume();
        }
        delete TR_MsgBox._params[id];

        TR_MsgBox._mainWin.focus();
        this.close(true);
    }
};
var TR_MsgBox = nw.global.TR_MsgBox;



TR_MsgBox.show = function(options) {
    TR_MsgBox._writeHtml();

    // ================================================================================
    var params = {
        lines: [],
        title: " ",
        buttons: ["OK"],
        msgIcon: "",

        winIcon: "",
        onTop: true,
        position: { dx: 0, dy: 0 },

        blockMain: true,
        callback: TR_MsgBox.defaultCallback
    };


    if (typeof options === "string"){
        params.lines = options.split('\n');
    } else {
        params.lines = Array.isArray(options.lines) ? options.lines : options.lines.split('\n');
        params.title = options.title || " ";
        params.buttons = options.buttons || ["OK"];
        params.msgIcon = options.msgIcon || "";
        params.winIcon = options.winIcon || "";
        params.onTop = options.onTop !== false;
        params.position = options.position || { dx: 0, dy: 0 };
        params.blockMain = options.blockMain !== false;
        params.callback = options.callback || TR_MsgBox.defaultCallback;
    }
    // ================================================================================


    TR_MsgBox.return = null;
    var id = ++TR_MsgBox._lastId;
    TR_MsgBox._params[id] = params;

    if (params.blockMain){
        SceneManager.stop();
    }

    nw.Window.open(TR_MsgBox._path + '?' + id, {
        show: false,
        fullscreen: false,
        resizable: false,
        always_on_top: params.onTop
    }, function(subWin){
    });

};





// ================================================================================

TR_MsgBox._html = `
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <link id="favicon" rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAABpJREFUWIXtwQEBAAAAgiD/r25IQAEAAADvBhAgAAFHAaCIAAAAAElFTkSuQmCC">
  <style>
    * {
      box-sizing: border-box;
      user-select: none;
    }

    body {
      margin: 0;
      background-color: #f0f0f0;
      overflow: hidden;
    }

    #content {
      background-color: white;
      padding: 35px 46px 35px 0px;
      display: flex;
      align-items: flex-start;
    }

    #msg-icon {
      width: 48px;
      height: 48px;
      margin-left: 30px;
      margin-top: 0px;
      flex-shrink: 0;
      pointer-events: none;
    }

    #text {
      margin-left: 15px;
      line-height: 20px;
      font-size: 16px;
      font-family: system-ui;
      white-space: pre;
      word-break: break-word;
    }

    #buttons {
      background-color: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 65px;
      padding: 0 24px 0 28px;
    }

    button {
      border: none;
      padding: 0;
      outline: none;
      box-shadow: none;
      width: 110px;
      height: 35px;
      margin-left: 12px;
      font-size: 15px;
      font-family: system-ui;
      flex-shrink: 0;
      background-size: 100% 100%;
    }

    
    button {
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAAAjCAYAAAB1nT9JAAAAAXNSR0IArs4c6QAAAK5JREFUaIHt27EJwzAYBeGXoFZbqvJKmsXbeAsVSWEwLm0XUQ7uqwRqHlz9v1prnwinJEnvffYOXbQsS8YYe7gk2bZt5h5dsK7r8S7nj1rrz8fomffsAXrGcFCGgzIclOGgDAdlOCjDQRkOynBQhoMyHJThoAwHZTgow0EZDspwUIaDMhyU4aAMB2U4KMNBGQ7KcFCGgzIc1HH0cb4E0f8ryX5zJZaSJGOM2Tt00xf5KRPtN1bssgAAAABJRU5ErkJggg==');
    }
    button:focus {
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAAAjCAYAAAB1nT9JAAAAAXNSR0IArs4c6QAAAO5JREFUaIHt27ENgzAURdGXiNaSh3TFSl6CBRiAPTwA/S9IESlCgoKkiHnSPY0RUHzJup39KKVsgp1BkmqtvefAReM4KiLeGydJrbWe8+CCeZ4/z8P+Q0rp78PgN8+zlzln1huue49SylZrVWtNKSXlnLWu6+FH9DdNk5ZlUUQci2PT7uesuMPGnf2Evs5iojgDFGeK4kxRnCmKM0VxpijOFMWZojhTFGeK4kxRnCmKM0VxpijOFMWZojhTFGeK4kxRnCmKM0Vxpi4X1/vELusPJ5lxX/uTzJ9LH/ubILi/QXrfuYKXQZIiovcc+NIL/SiRMcbmn2QAAAAASUVORK5CYII=');
    }
    button:active {
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAAAjCAYAAAB1nT9JAAAAAXNSR0IArs4c6QAAANRJREFUaIHt27ENwyAURdHnyAMwEEMwBAMyBAOxgVNYsSJBJMcNPOmehoYC6etSwZZzPgQ7uyTFGGefA3+otZ6Dk6SU0syz4KZSiiTpNfkceGg4uBAC64Lrty3nfMQYr6syhKDWWrcRayilqNbaF8fQ1jMqrhvcaBPmGsVEcQYozhTFmaI4UxRniuJMUZwpijNFcaYozhTFmaI4UxRniuJMUZwpijNFcaYozhTFmaI4UxRniuJM3S5u9otd1gcvmbG2ny+Z4eH6ZvX5vgMPu3R+lIOXN8WEfhl5mSKQAAAAAElFTkSuQmCC');
    }
  </style>


  <script>
    function getBase64Img(name) {
        var base64;
        switch (name) {
            case "info":
                base64 = "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";
                break;
            case "question":
                base64 = "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";
                break;
            case "warning":
                base64 = "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";
                break;
            case "error":
                base64 = "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";
                break;
        }
        if (base64) return 'data:image/png;base64,' + base64;
        else return name;
    }


    function measureTextWidth(texts, font = '16px system-ui') {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = font;

      var maxWidth = 0;
      for (let i = 0; i < texts.length; i++) {
        const text = texts[i];
        const width = context.measureText(text).width;
        if (width > maxWidth) maxWidth = width;
      }
      return maxWidth;
    }


    window.onload = function () {
      const win = nw.Window.get();
      const TR_MsgBox = nw.global.TR_MsgBox;
      const id = parseInt(location.search.substring(1), 10);

      try {

        const params = TR_MsgBox._params[id];
        const title = params.title;
        const lines = params.lines;
        const buttons = params.buttons;
        const msgIcon = params.msgIcon;
        const winIcon = params.winIcon;
        const onTop = params.onTop;
        const position = params.position;
        const callback = params.callback.bind(win);


        // ================================================================================
        if (winIcon !== ""){
          const winIconEle = document.getElementById('favicon');
          winIconEle.href = getBase64Img(winIcon);
        }

        const contentBar = document.getElementById('content');
        const textBar = document.getElementById('text');
        textBar.innerText = lines.join('\\n');

        if (msgIcon !== ""){
          const iconEle = document.createElement('img');
          iconEle.id = 'msg-icon';
          iconEle.src = getBase64Img(msgIcon);
          contentBar.insertBefore(iconEle, textBar);

          textBar.style.marginLeft = '12px';
          if (lines.length === 1)
            textBar.style.paddingTop = '10px';
          if (lines.length <= 2)
            contentBar.style.paddingBottom = '27px';
        }
        // ================================================================================


        // ================================================================================
        document.title = title;
        win.title = title;
        const buttonBar = document.getElementById('buttons');

        for (let i = 0; i < buttons.length; i++){
          const buttonEle = document.createElement('button');
          buttonEle.innerText = buttons[i];
          buttonEle.onclick = function(){ callback(buttons[i]); };
          buttonBar.appendChild(buttonEle);
        }
        // ================================================================================


        // ================================================================================
        const buttonsMinWidth = 40 + 110*buttons.length + 12*Math.max(0, buttons.length-1) + 24;
        const linesMinWidth = (msgIcon ? 30+48+12 : 15) + measureTextWidth(lines) + 46;
        var width = Math.max(buttonsMinWidth, linesMinWidth);
        var height = contentBar.scrollHeight + buttonBar.scrollHeight;

        if (window.devicePixelRatio > 1){
          document.body.style.zoom = 0.8;
          width *= 0.8;
          height *= 0.8;
        }

        const ver = nw.process.versions.nw.split('.');
        const ver1 = parseInt(ver[1], 10), ver2 = parseInt(ver[2], 10);
        const nw2 = ver1 >= 43 || (ver1 === 42 && ver2 >= 4);

        if (nw2) win.setResizable(true);
        const outlineWidth = outerWidth - innerWidth;
        const outlineHeight = outerHeight - innerHeight;
        win.moveTo(
          Math.round((screen.width - (width+outlineWidth)) / 2 + position.dx),
          Math.round((screen.height - (height+outlineHeight)) / 2 + position.dy)
        );
        win.resizeBy(
          Math.round(width - window.innerWidth),
          Math.round(height - window.innerHeight)
        );
        if (nw2) win.setResizable(false);
        // ================================================================================
        

        win.on('close', function(){ callback('close'); });
        if (onTop) win.on('minimize', function(){ win.focus(); });
        win.show();
        win.focus();

      } catch (e) {
        const mainWindow = TR_MsgBox._mainWin.window;
        mainWindow.console.log('[TRain_MessageBox] Error in msgbox.html:');
        mainWindow.console.log(e);  // Use console.log because NWjs console.error has bug
        TR_MsgBox.defaultCallback.bind(win)('close');
      }

    };
  </script>
</head>


<body>
  <div id="content">
    <div id="text"></div>
  </div>
  <div id="buttons"></div>
</body>

</html>
`;



TR_MsgBox._writeHtml = function(force) {
    const fs = require('fs');
    if (!force && fs.existsSync(TR_MsgBox._path)) return;
    fs.writeFileSync(TR_MsgBox._path, TR_MsgBox._html, { flush: true });
};

TR_MsgBox._writeHtml(true);
