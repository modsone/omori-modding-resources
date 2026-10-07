// ===========================================================
// Loop Messages As Plugin Commands - By TomatoRadio (Version 1.0)
// Import Filename: EventCommand1001.qml
// Import Directory: Event/EventCommands/
// Adds a checkbox to make the Loop Message feature of YAML Selector
// add the messages as individual Plugin Commands rather than a Script.
// ===========================================================

import QtQuick 2.3
import QtQuick.Controls 1.2
import ".."
import "../../BasicControls"
import "../../BasicLayouts"
import "../../Controls"
import "../../Layouts"
import "../../ObjControls"
import "../../Singletons"

// Yaml Message Selector
EventCommandBase {
    id: root
    
    property string savedFileName1: ""
    property string savedMessageName1: ""
    property bool add1: false
    property string savedFileName2: ""
    property string savedMessageName2: ""
    property bool add2: false
    property string savedFileName3: ""
    property string savedMessageName3: ""
    property bool add3: false
    property string savedFileName4: ""
    property string savedMessageName4: ""
    property bool add4: false
    property string savedFileName5: ""
    property string savedMessageName5: ""
    property bool add5: false

    ControlsRow {
        enabled: !checkBox11.checked
        ObjCheckBox {
            id: checkBox1
            text: qsTr("AddChoice?")
            hint: qsTr("");
            width: 110
            height: 28
            y: 18
        }
        ObjYamlEllipsisBox {
            id: yamlSelectionBox1
            title: qsTr("Yaml Message Selector")
            hint: qsTr("")
            subFolder: "languages/en"
            itemWidth: 440
            fileName: root.savedFileName1
            messageName: root.savedMessageName1

            onModified: {
                root.savedFileName2 = fileName;
                root.savedMessageName2 = messageName;
                root.add1 = true
            }
        }
        LabeledTextField {
            id: textField1
            title: qsTr("AddChoice Label")
            hint: qsTr("")
            width: 200
            y: 1
            enabled: checkBox1.checked
        }
    }
    
    ControlsRow {
        enabled: !checkBox11.checked
        ObjCheckBox {
            id: checkBox2
            text: qsTr("AddChoice?")
            hint: qsTr("");
            width: checkBox1.width
            height: checkBox1.height
            y: 18
        }
        ObjYamlEllipsisBox {
            id: yamlSelectionBox2
            title: qsTr("Yaml Message Selector")
            hint: qsTr("")
            subFolder: "languages/en"
            itemWidth: yamlSelectionBox1.itemWidth
            fileName: root.savedFileName2
            messageName: root.savedMessageName2

            onModified: {
                root.savedFileName3 = fileName;
                root.savedMessageName3 = messageName;
                root.add2 = true
            }
        }
        LabeledTextField {
            id: textField2
            title: qsTr("AddChoice Label")
            hint: qsTr("")
            width: textField1.width
            y: 1
            enabled: checkBox2.checked
        }
    }

    ControlsRow {
        enabled: !checkBox11.checked
        ObjCheckBox {
            id: checkBox3
            text: qsTr("AddChoice?")
            hint: qsTr("");
            width: checkBox1.width
            height: checkBox1.height
            y: 18
        }
        ObjYamlEllipsisBox {
            id: yamlSelectionBox3
            title: qsTr("Yaml Message Selector")
            hint: qsTr("")
            subFolder: "languages/en"
            itemWidth: yamlSelectionBox1.itemWidth
            fileName: root.savedFileName3
            messageName: root.savedMessageName3

            onModified: {
                root.savedFileName4 = fileName;
                root.savedMessageName4 = messageName;
                root.add3 = true
            }
        }
        LabeledTextField {
            id: textField3
            title: qsTr("AddChoice Label")
            hint: qsTr("")
            width: textField1.width
            y: 1
            enabled: checkBox3.checked
        }
    }

    ControlsRow {
        enabled: !checkBox11.checked
        ObjCheckBox {
            id: checkBox4
            text: qsTr("AddChoice?")
            hint: qsTr("");
            width: checkBox1.width
            height: checkBox1.height
            y: 18
        }
        ObjYamlEllipsisBox {
            id: yamlSelectionBox4
            title: qsTr("Yaml Message Selector")
            hint: qsTr("")
            subFolder: "languages/en"
            itemWidth: yamlSelectionBox1.itemWidth
            fileName: root.savedFileName4
            messageName: root.savedMessageName4

            onModified: {
                root.savedFileName5 = fileName;
                root.savedMessageName5 = messageName;
                root.add4 = true
            }
        }
        LabeledTextField {
            id: textField4
            title: qsTr("AddChoice Label")
            hint: qsTr("")
            width: textField1.width
            y: 1
            enabled: checkBox4.checked
        }
    }

    ControlsRow {
        enabled: !checkBox11.checked
        ObjCheckBox {
            id: checkBox5
            text: qsTr("AddChoice?")
            hint: qsTr("");
            width: checkBox1.width
            height: checkBox1.height
            y: 18
        }
        ObjYamlEllipsisBox {
            id: yamlSelectionBox5
            title: qsTr("Yaml Message Selector")
            hint: qsTr("")
            subFolder: "languages/en"
            itemWidth: yamlSelectionBox1.itemWidth
            fileName: root.savedFileName5
            messageName: root.savedMessageName5

            onModified: {
                root.add5 = true
            }
        }
        LabeledTextField {
            id: textField5
            title: qsTr("AddChoice Label")
            hint: qsTr("")
            width: textField1.width
            y: 1
            enabled: checkBox5.checked
        }
    }
    
    ControlsRow {
        enabled: !checkBox11.checked
        ObjCheckBox {
            id: checkBox10
            text: qsTr("ShowChoices")
            hint: qsTr("")
            width: checkBox1.width
            height: checkBox1.height
            y: 18
        }
        ObjComboBox {
            id: comboBox
            title: qsTr("Cancel Choice")
            hint: qsTr("")
            itemWidth: 75
            model: [ -1, 0, 1, 2, 3, 4 ]
            enabled: checkBox10.checked
        }
    }

    ControlsColumn {
        ControlsRow {
            ObjCheckBox {
                id: checkBox11
                text: qsTr("Loop Messages")
                hint: qsTr("")
                width: checkBox1.width
                height: checkBox1.height
            }
            ObjCheckBox {
                enabled: checkBox11.checked
                id: checkBox12
                text: qsTr("Add as Plugin Commands?")
                hint: qsTr("")
                width: 128
                height: 28
            }
        }
        ControlsRow {
            enabled: checkBox11.checked
            ObjYamlEllipsisBox {
                id: loopSelectionBox
                title: qsTr("Loop Start File Name")
                hint: qsTr("")
                subFolder: "languages/en"
                itemWidth: 240
                hideMessageNames: true
            }
            LabeledTextField {
                id: loopTextPrefix
                title: qsTr("Message Prefix")
                hint: qsTr("")
                text: qsTr("message_")
                width: 130
                itemWidth: 120
                y: 1
            }
            //enabled: checkBox11.checked
            LabeledTextField {
                id: loopTextStart
                title: qsTr("Start number")
                hint: qsTr("")
                width: loopTextPrefix.width
                itemWidth: 120
                y: 1
            }
            LabeledTextField {
                id: loopTextEnd
                title: qsTr("End Number")
                hint: qsTr("")
                width: loopTextPrefix.width
                itemWidth: 120
                y: 1
            }
        }
    }

    onSave: {
        var params
        var pluginCommandText
        var dataLength
        eventData = []

        if (checkBox11.checked) {
            if (checkBox12.checked) {
                for (var i = parseInt(loopTextStart.text); i<=parseInt(loopTextEnd.text);i++) {
                    eventData.push( makeCommand(356, 0, ["ShowMessage "+loopSelectionBox.fileName+"."+loopTextPrefix.text+i]) );
                }
            } else {
                var scriptCommandText = 
                    "let list = [];\n" +
                    "for (let i = " + loopTextStart.text + "; i <= " + loopTextEnd.text + "; i++) {\n" +
                    "  list.push({ code: 356, indent: 0, parameters: [`ShowMessage " + loopSelectionBox.fileName + "." + loopTextPrefix.text + "${i}`] });\n" +
                    "};\n" +
                    "this.setupChild(list, this._eventId);";
                var lines = scriptCommandText.split("\n");
                
                while (lines.length > 1 && lines[lines.length - 1].length === 0) {
                    lines.pop();
                }
                for (var i = 0; i < lines.length; i++) {
                    var code = (i === 0 ? 355 : 655);
                    eventData.push( makeCommand(code, 0, [lines[i]]) );
                }
            }
        }
        else {
            if (add1) {
                eventData.push( makeCommand(356, 0, []) );
                dataLength = eventData.length - 1;
                params = eventData[dataLength].parameters;
                if (!checkBox1.checked) {
                    pluginCommandText = "ShowMessage " + yamlSelectionBox1.fileName + "." + yamlSelectionBox1.messageName;
                }
                else {
                    pluginCommandText = "AddChoice " + yamlSelectionBox1.fileName + "." + yamlSelectionBox1.messageName + " " + textField1.text;
                }
                params[0] = pluginCommandText;
            }
            if (add2) {
                eventData.push( makeCommand(356, 0, []) );
                dataLength = eventData.length - 1;
                params = eventData[dataLength].parameters;
                if (!checkBox2.checked) {
                    pluginCommandText = "ShowMessage " + yamlSelectionBox2.fileName + "." + yamlSelectionBox2.messageName;
                }
                else {
                    pluginCommandText = "AddChoice " + yamlSelectionBox2.fileName + "." + yamlSelectionBox2.messageName + " " + textField2.text;
                }
                params[0] = pluginCommandText;
            }
            if (add3) {
                eventData.push( makeCommand(356, 0, []) );
                dataLength = eventData.length - 1;
                params = eventData[dataLength].parameters;
                if (!checkBox3.checked) {
                    pluginCommandText = "ShowMessage " + yamlSelectionBox3.fileName + "." + yamlSelectionBox3.messageName;
                }
                else {
                    pluginCommandText = "AddChoice " + yamlSelectionBox3.fileName + "." + yamlSelectionBox3.messageName + " " + textField3.text;
                }
                params[0] = pluginCommandText;
            }
            if (add4) {
                eventData.push( makeCommand(356, 0, []) );
                dataLength = eventData.length - 1;
                params = eventData[dataLength].parameters;
                if (!checkBox4.checked) {
                    pluginCommandText = "ShowMessage " + yamlSelectionBox4.fileName + "." + yamlSelectionBox4.messageName;
                }
                else {
                    pluginCommandText = "AddChoice " + yamlSelectionBox4.fileName + "." + yamlSelectionBox4.messageName + " " + textField4.text;
                }
                params[0] = pluginCommandText;
            }
            if (add5) {
                eventData.push( makeCommand(356, 0, []) );
                dataLength = eventData.length - 1;
                params = eventData[dataLength].parameters;
                if (!checkBox5.checked) {
                    pluginCommandText = "ShowMessage " + yamlSelectionBox5.fileName + "." + yamlSelectionBox5.messageName;
                }
                else {
                    pluginCommandText = "AddChoice " + yamlSelectionBox5.fileName + "." + yamlSelectionBox5.messageName + " " + textField5.text;
                }
                params[0] = pluginCommandText;
            }
            if (checkBox10.checked) {
                eventData.push( makeCommand(356, 0, []) );
                dataLength = eventData.length - 1;
                params = eventData[dataLength].parameters;
                pluginCommandText = "ShowChoices " + comboBox.currentText;
                params[0] = pluginCommandText;
            }
        }
    }
}