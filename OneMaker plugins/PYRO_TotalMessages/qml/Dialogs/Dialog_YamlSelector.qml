import QtQuick 2.3
import QtQuick.Controls 1.2
import QtQuick.Layouts 1.1
import Tkool.rpg 1.0
import "../BasicControls"
import "../BasicLayouts"
import "../Controls"
import "../Layouts"
import "../ObjControls"
import "../Singletons"
import "../_OneMakerMV"

ModalWindow {
    id: root

    title: qsTr("Select a Message")

    property string fileName: ""
    property string messageName: ""
    property string messageText: ""

    property string folder: ""
    property var atlasData: {}

    property int totalMessages: 0

    property int viewWidth: 496
    property bool showIndexText: false

    property string indexTextTitle: ""
    property string indexTextHint: ""

    property bool hideMessageNames: false

    DialogBox {
        applyVisible: false

        onOk: {
            if (yamlListBox.currentIndex === 0) {
                root.messageName = "";
            } else {
                root.messageName = yamlListBox.currentItem.fileBaseName;
            }
        }

        ControlsRow {
            FileListBox {
                id: listBox

                width: 200 + OneMakerMVSettings.getWindowSetting("defaultWidthIncrease")
                height: 402 + OneMakerMVSettings.getWindowSetting("defaultHeightIncrease")

                folder: root.folder
                allowedSuffixes: ["yaml"]

                onCurrentBaseNameChanged: {
                    if (currentItem) {
                        root.fileName = currentItem.fileBaseName;
                        extractAtlasNames()
                    }
                }
                onUpdated: {
                    selectName(root.fileName);
                }
                onDoubleClicked: {
                    ok();
                }
            }

            YamlFileListBox {
                id: yamlListBox

                width: listBox.width
                height: listBox.height

                messageData: atlasData
                allowedSuffixes: listBox.allowedSuffixes

                onCurrentBaseNameChanged: {
                    if (currentItem) {
                        root.messageName = currentItem.fileBaseName;
                        getAtlasText(root.messageName);
                        textPreview.requestPaint()
                    }
                }
                onUpdated: {
                    selectName(root.messageName);
                }
                onDoubleClicked: {
                    ok();
                }
            }    
        }

        Label {
            id: label
            width: listBox.width * 2
            height: 8
            y: listBox.height + 8
            font.pixelSize: 14
            
            text: qsTr("Text Preview - This does not represent exactly how the message will display in-game")
        }

        ScrollView {
            id: scrollView
            width: listBox.width * 2 + 12
            height: textPreview.fixedHeight
            x: -2
            y: listBox.height + 25

            style: CustomScrollViewStyle {
                frame: Rectangle {
                    color: "#000000"
                    border.color: "#FFFFFF"
                    border.width: 1
                }
            }
            
            Item {
                anchors.fill: parent
                anchors.margins: 8
                clip: true

                YamlTextPreview {
                    id: textPreview
                    fixedHeight: 36 * 4.5

                    text: root.messageText ? displayAtlasText(root.messageText) : ""
                }
            }
        }

        Label {
            id: label2
            width: listBox.width * 2
            height: 8
            y: scrollView.height + 8 + scrollView.y
            font.pixelSize: 14

            text: totalMessages
        }
        
        Component.onCompleted: {
            if (hideMessageNames) {
                var controls = [yamlListBox, label, scrollView, textPreview];
                for (var key in controls) {
                    controls[key].visible = false;
                    controls[key].width = 0;
                    controls[key].height = 0;
                }
            }
        }
    }

    function isExcluded(thing) {
        if (thing.indexOf('#') === 0) {
            return true
        }
        return YamlIdentifiers.ignoreIdentifiers.some(function(id) {
            return thing.indexOf(id) === 0
        })
    }

    function extractAtlasNames() {
        var tempData = {};
        var fileContent = TkoolAPI.readFile(folder + "/" + fileName + ".yaml");
        var lines = fileContent.split("\n")
                       .map(function(ln) { return ln.trim() })
                       .filter(function(ln) { return ln.length > 0 && !isExcluded(ln) })
        var currentAtlas = "";
        var accumulatingText = "";

        totalMessages = 0

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            var shouldIgnoreLine = false;
            
            if (currentAtlas !== "" && line.indexOf("text:") === 0) {
                var textValue = line.substring(line.indexOf(":") + 1).trim();
                accumulatingText += textValue;
                tempData[currentAtlas] = textValue;
                totalMessages++;
            }
            else if (line.length > 0 && line.charAt(line.length - 1) === ":") {
                var atlasName = line.substring(0, line.length - 1).trim();
                currentAtlas = atlasName;
                tempData[currentAtlas] = "";
                accumulatingText = "";
            }
            else if (currentAtlas !== "" && accumulatingText !== null) {
                accumulatingText += line;
                tempData[currentAtlas] = accumulatingText;
                //totalMessages++;
            }

            if (line.length == 0) {
                currentAtlas = "";
            }
        }
        atlasData = tempData;
    }

    function getAtlasText(key) {
        if (atlasData.hasOwnProperty(key)) {
            messageText = atlasData[key]
        }
        else {
            messageText = "";
        }
    }

    function displayAtlasText(key) {
        if (messageText) {
            return messageText.replace(/<br>/g, "\n")
        }
    }
}
