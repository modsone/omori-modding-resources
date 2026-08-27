// ===========================================================
// CustomThemeColors - By TomatoRadio (Version 1.0)
// Import Filename: ThemeManager.qml
// Import Directory: BasicControls/
// Allows editing the colors for any of the 4 themes used by
// RPG Maker MV. Currently edits "High Contrast Black."
// ===========================================================

pragma Singleton
import QtQuick 2.3

QtObject {
    property var currentTheme: {
        var data = createDefaultThemeData();
        currentTheme = data;
        return data;
    }

    function createDefaultThemeData() {
        var data = {};

        data.window2 =         "#d0dbe8";
        data.window1 =         Qt.lighter(data.window2, 1.1);
        data.outsideArea =     Qt.darker(data.window2, 1.2);
        data.inactiveTab1 =    Qt.darker(data.window2, 1.1);
        data.inactiveTab2 =    Qt.darker(data.window2, 1.2);
        data.controlFrame =    Qt.darker(data.window2, 1.7);
        data.toolBar1 =        data.window1;
        data.toolBar2 =        data.window2;
        data.scrollBar1 =      Qt.darker(data.window2, 1.1);
        data.scrollBar2 =      data.window2;
        data.focusFrame =      "#648cb4";

        data.normalText =      "#000000";
        data.normalBack1 =     "#ffffff";
        data.normalBack2 =     "#e4ecf2";
        data.selectedText =    "#ffffff";
        data.selectedBack =    "#0064c8";
        data.selectedEdText =  data.normalText;
        data.selectedEdBack =  "#bbddff";
        data.disabledText =    "#80000000";
        data.disabledOpacity = 0.5;
        data.hyperLinkText =   "#0000ff";

        data.button1 =         "#eef6fc";
        data.button2 =         "#aeb6bc";
        data.buttonFrame =     data.controlFrame;
        data.pressedButton1 =  data.button2;
        data.pressedButton2 =  data.button1;
        data.pressedButtonText = data.normalText;
        data.hotButton1 =      "#ffffff";
        data.hotButton2 =      "#c0e0ff";
        data.hotButtonText =   data.normalText;
        data.twinklingBtn1 =   Qt.lighter("#38d", 1.8);
        data.twinklingBtn2 =   Qt.lighter("#38d", 1.5);
        data.groupBox1 =       "#6090b0d0";
        data.groupBox2 =       "#607090b0";
        data.groupBoxFrame =   "#ffffff";
        data.deluxeLabel1 =    "#0050a0";
        data.deluxeLabel2 =    Qt.lighter(data.deluxeLabel1, 1.2);
        data.deluxeLabelText = "#ffffff";

        data.highlight =       "#80ffffff";
        data.workArea =        "#224488";
        data.checkMark =       "#4466aa";
        data.dropTarget =      "#ffee60";
        data.progressBar =     "#4499dd";

        data.arrowLeftImage =  "arrow-left.png";
        data.arrowRightImage = "arrow-right.png";
        data.arrowUpImage =    "arrow-up.png";
        data.arrowDownImage =  "arrow-down.png";

        data.expCurveColor1 =  "#13920D";
        data.expCurveColor2 =  "#DE5C2F";

        data.eventColorMap = {
            indigo:            "indigo",
            green:             "green",
            blue:              "blue",
            red:               "red",
            darkorange:        "darkorange",
            magenta:           "magenta",
            maroon:            "maroon",
            olive:             "olive",
            crimson:           "crimson",
            purple:            "purple",
            teal:              "teal",
            deeppink:          "deeppink",
            dodgerblue:        "dodgerblue",
            darkviolet:        "darkviolet",
            gray:              "gray",
            navy:              "navy",
            slategray:         "slategray",
        };

        data.toolbarMap = {};

        data.isDarkMode = false;

        return data;
    }

    function createDarkThemeData() {
        var data = {};

        data.window1 =         "#474b4d";
        data.window2 =         "#2f3335";
        data.outsideArea =     "#181819";
        data.inactiveTab1 =    "#373b3d";
        data.inactiveTab2 =    "#1f2325";
        data.controlFrame =    "#111618";
        data.toolBar1 =        data.window1;
        data.toolBar2 =        data.window2;
        data.scrollBar1 =      "#515658";
        data.scrollBar2 =      "#616668";
        data.focusFrame =      "#4e78a1";

        data.normalText =      "#cccccc";
        data.normalBack1 =     "#25282a";
        data.normalBack2 =     "#2c2f31";
        data.selectedText =    "#cccccc";
        data.selectedBack =    "#4b6eaf";
        data.selectedEdText =  data.normalText;
        data.selectedEdBack =  "#4b6eaf";
        data.disabledText =    "#777777";
        data.disabledOpacity = 0.5;
        data.hyperLinkText =   "#0099ff";

        data.button1 =         "#616668";
        data.button2 =         "#54595b";
        data.buttonFrame =     data.controlFrame;
        data.pressedButton1 =  data.button2;
        data.pressedButton2 =  data.button1;
        data.pressedButtonText = data.normalText;
        data.hotButton1 =      "#717678";
        data.hotButton2 =      "#64696b";
        data.hotButtonText =   data.normalText;
        data.twinklingBtn1 =   "#173e70";
        data.twinklingBtn2 =   "#082147";
        data.groupBox1 =       "#18ffffff";
        data.groupBox2 =       "#10ffffff";
        data.groupBoxFrame =   "#202020";
        data.deluxeLabel1 =    "#272b2d";
        data.deluxeLabel2 =    "#0f1315";
        data.deluxeLabelText = "#dddddd";

        data.highlight =       "#80515557";
        data.workArea =        "#224488";
        data.checkMark =       "#aaaaaa";
        data.dropTarget =      "#456ea6";
        data.progressBar =     "#4499dd";

        data.arrowLeftImage =  "arrow-left-white.png";
        data.arrowRightImage = "arrow-right-white.png";
        data.arrowUpImage =    "arrow-up-white.png";
        data.arrowDownImage =  "arrow-down-white.png";

        data.expCurveColor1 =  "#1AC011";
        data.expCurveColor2 =  "#ECA188";

        data.eventColorMap = {
            indigo:            "#DFBFFF",
            green:             "#00DF00",
            blue:              "#5394EC",
            red:               "#FF8785",
            darkorange:        "#FF8C00",
            magenta:           "#FFBFFF",
            maroon:            "#BF7070",
            olive:             "#D6BF55",
            crimson:           "#FF6B68",
            purple:            "#DC56DF",
            teal:              "#BFFFFF",
            deeppink:          "#FFBFE2",
            dodgerblue:        "#B0C9EB",
            darkviolet:        "#C19DD1",
            gray:              "#AAAAAA",
            navy:              "#BFBFFF",
            slategray:         "#9BB6CF",
        };

        data.toolbarMap = {
            "tools-database":  "tools-database_bk"
        };

        data.isDarkMode = true;

        return data;
    }

    function createHighContrastBlackThemeData() {
        var data = {};
        
        data.window1 =         "#4b075f";
        data.window2 =         "#380631";
        data.outsideArea =     "#17091d";
        data.inactiveTab1 =    "#351b41";
        data.inactiveTab2 =    "#330d29";
        data.controlFrame =    "#22031b";
        data.toolBar1 =        data.window1;
        data.toolBar2 =        data.window2;
        data.scrollBar1 =      "#5f496e";
        data.scrollBar2 =      "#5d4b68";
        data.focusFrame =      "#a14e85";

        data.normalText =      "#ceabc9";
        data.normalBack1 =     "#170325";
        data.normalBack2 =     "#000000";
        data.selectedText =    "#d4b6d4";
        data.selectedBack =    "#af4b9e";
        data.selectedEdText =  data.normalText;
        data.selectedEdBack =  "#af4b99";
        data.disabledText =    "#775a70";
        data.disabledOpacity = 0.5;
        data.hyperLinkText =   "#ff00dd";

        data.button1 =         "#81428d";
        data.button2 =         "#661c75";
        data.buttonFrame =     data.controlFrame;
        data.pressedButton1 =  data.button2;
        data.pressedButton2 =  data.button1;
        data.pressedButtonText = data.normalText;
        data.hotButton1 =      "#9a74ac";
        data.hotButton2 =      "#814381";
        data.hotButtonText =   data.normalText;
        data.twinklingBtn1 =   "#70175a";
        data.twinklingBtn2 =   "#47083c";
        data.groupBox1 =       "#691483";
        data.groupBox2 =       "#570f4d";
        data.groupBoxFrame =   data.controlFrame;
        data.deluxeLabel1 =    "#461933";
        data.deluxeLabel2 =    "#3b0542";
        data.deluxeLabelText = "#fd5c9a";

        data.highlight =       "#80515557";
        data.workArea =        "#88227a";
        data.checkMark =       "#d3a2d4";
        data.dropTarget =      "#a64596";
        data.progressBar =     "#dd44d0";

        data.arrowLeftImage =  "arrow-left-white.png";
        data.arrowRightImage = "arrow-right-white.png";
        data.arrowUpImage =    "arrow-up-white.png";
        data.arrowDownImage =  "arrow-down-white.png";

        data.expCurveColor1 =  "#1AC011";
        data.expCurveColor2 =  "#ECA188";

        data.eventColorMap = {
            indigo:            "#DFBFFF",
            green:             "#00DF00",
            blue:              "#5394EC",
            red:               "#FF8785",
            darkorange:        "#FF8C00",
            magenta:           "#FFBFFF",
            maroon:            "#BF7070",
            olive:             "#D6BF55",
            crimson:           "#FF6B68",
            purple:            "#DC56DF",
            teal:              "#BFFFFF",
            deeppink:          "#FFBFE2",
            dodgerblue:        "#B0C9EB",
            darkviolet:        "#C19DD1",
            gray:              "#AAAAAA",
            navy:              "#BFBFFF",
            slategray:         "#9BB6CF",
        };

        /*
        data.window1 =         "#000000";
        data.window2 =         "#000000";
        data.outsideArea =     "#000000";
        data.inactiveTab1 =    "#000000";
        data.inactiveTab2 =    "#000000";
        data.controlFrame =    "#ffffff";
        data.toolBar1 =        data.window1;
        data.toolBar2 =        data.window2;
        data.scrollBar1 =      "#000000";
        data.scrollBar2 =      "#000000";
        data.focusFrame =      "#ffff00";

        data.normalText =      "#ffffff";
        data.normalBack1 =     "#000000";
        data.normalBack2 =     "#000000";
        data.selectedText =    "#000000";
        data.selectedBack =    "#1AEBFF";
        data.selectedEdText =  "#000000";
        data.selectedEdBack =  "#1AEBFF";
        data.disabledText =    "#00FF00";
        data.disabledOpacity = 1;
        data.hyperLinkText =   "#00ffff";

        data.button1 =         "#000000";
        data.button2 =         "#000000";
        data.buttonFrame =     data.controlFrame;
        data.pressedButton1 =  data.button2;
        data.pressedButton2 =  data.button1;
        data.pressedButtonText = "#000000";
        data.hotButton1 =      "#1AEBFF";
        data.hotButton2 =      "#1AEBFF";
        data.hotButtonText =   "#000000";
        data.twinklingBtn1 =   "#1AEBFF";
        data.twinklingBtn2 =   "#1AEBFF";
        data.groupBox1 =       "#000000";
        data.groupBox2 =       "#000000";
        data.groupBoxFrame =   "#ffffff";
        data.deluxeLabel1 =    "#000000";
        data.deluxeLabel2 =    "#000000";
        data.deluxeLabelText = "#ffffff";

        data.highlight =       "#80ffffff";
        data.workArea =        "#224488";
        data.checkMark =       "#FFFFFF";
        data.dropTarget =      "#1AEBFF";
        data.progressBar =     "#1AEBFF";

        data.arrowLeftImage =  "arrow-left-white.png";
        data.arrowRightImage = "arrow-right-white.png";
        data.arrowUpImage =    "arrow-up-white.png";
        data.arrowDownImage =  "arrow-down-white.png";

        data.expCurveColor1 =  "#00FF00";
        data.expCurveColor2 =  "#FF8000";

        data.eventColorMap = {
            indigo:            "#FF58FF",
            green:             "#00FF00",
            blue:              "#00CFFF",
            red:               "#FF8080",
            darkorange:        "#FF8000",
            magenta:           "#FF58FF",
            maroon:            "#FF8080",
            olive:             "#FFFF00",
            crimson:           "#E78386",
            purple:            "#FF58FF",
            teal:              "#00FFFF",
            deeppink:          "#FF80C0",
            dodgerblue:        "#00FFFF",
            darkviolet:        "#D935FF",
            gray:              "#AAAAAA",
            navy:              "#00FFFF",
            slategray:         "#FFFFFF",
        };
        */

        data.toolbarMap = {
            "tools-database":  "tools-database_bk"
        };

        data.isDarkMode = true;

        return data;
    }

    function createHighContrastWhiteThemeData() {
        var data = {};

        data.window1 =         "#FFFFFF";
        data.window2 =         "#FFFFFF";
        data.outsideArea =     "#FFFFFF";
        data.inactiveTab1 =    "#FFFFFF";
        data.inactiveTab2 =    "#FFFFFF";
        data.controlFrame =    "#000000";
        data.toolBar1 =        data.window1;
        data.toolBar2 =        data.window2;
        data.scrollBar1 =      "#FFFFFF";
        data.scrollBar2 =      "#FFFFFF";
        data.focusFrame =      "#00009F";

        data.normalText =      "#000000";
        data.normalBack1 =     "#FFFFFF";
        data.normalBack2 =     "#FFFFFF";
        data.selectedText =    "#FFFFFF";
        data.selectedBack =    "#37006E";
        data.selectedEdText =  "#FFFFFF";
        data.selectedEdBack =  "#37006E";
        data.disabledText =    "#800000";
        data.disabledOpacity = 1;
        data.hyperLinkText =   "#0000ff";

        data.button1 =         "#FFFFFF";
        data.button2 =         "#FFFFFF";
        data.buttonFrame =     data.controlFrame;
        data.pressedButton1 =  data.button2;
        data.pressedButton2 =  data.button1;
        data.pressedButtonText = "#FFFFFF";
        data.hotButton1 =      "#37006E";
        data.hotButton2 =      "#37006E";
        data.hotButtonText =   "#FFFFFF";
        data.twinklingBtn1 =   "#37006E";
        data.twinklingBtn2 =   "#37006E";
        data.groupBox1 =       "#FFFFFF";
        data.groupBox2 =       "#FFFFFF";
        data.groupBoxFrame =   "#000000";
        data.deluxeLabel1 =    "#FFFFFF";
        data.deluxeLabel2 =    "#FFFFFF";
        data.deluxeLabelText = "#000000";

        data.highlight =       "#80000000";
        data.workArea =        "#224488";
        data.checkMark =       "#000000";
        data.dropTarget =      "#37006E";
        data.progressBar =     "#37006E";

        data.arrowLeftImage =  "arrow-left.png";
        data.arrowRightImage = "arrow-right.png";
        data.arrowUpImage =    "arrow-up.png";
        data.arrowDownImage =  "arrow-down.png";

        data.expCurveColor1 =  "#13920D";
        data.expCurveColor2 =  "#DE5C2F";

        data.eventColorMap = {
            indigo:            "indigo",
            green:             "green",
            blue:              "blue",
            red:               "red",
            darkorange:        "darkorange",
            magenta:           "magenta",
            maroon:            "maroon",
            olive:             "olive",
            crimson:           "crimson",
            purple:            "purple",
            teal:              "teal",
            deeppink:          "deeppink",
            dodgerblue:        "dodgerblue",
            darkviolet:        "darkviolet",
            gray:              "gray",
            navy:              "navy",
            slategray:         "slategray",
        };

        data.toolbarMap = {};

        data.isDarkMode = false;

        return data;
    }

    function setTheme(name) {
        switch (name) {
        case "dark":
            currentTheme = createDarkThemeData();
            break;
        case "highContrastWhite":
            currentTheme = createHighContrastWhiteThemeData();
            break;
        case "highContrastBlack":
            currentTheme = createHighContrastBlackThemeData();
            break;
        default:
            currentTheme = createDefaultThemeData();
            break;
        }
    }
}
