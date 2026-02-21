// ===========================================================
// Self Switches Plus - By TomatoRadio (Version 1.0)
// Import Filename: EventCommand123.qml
// Import Directory: Event/EventCommands/
// Adds UI for setting Self Switches of other map events,
// and for setting Self Switches of arbitrary string names.
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
import "../../_OneMakerMV"

// Control Self Switches
EventCommandBase {
    id: root

    ControlsRow {
        GroupBox {
            id: selfSwitchGroup
            title: qsTr("Self Switch")
            hint: qsTr("Self switch to operate.")
            ExclusiveGroup { id: group }
            ControlsRow {
                RadioButton {
                    id: radio1
                    exclusiveGroup: group
                    checked: true
                    y: 5
                }
                SelfSwitchBox {
                    id: selfSwitchBox
                    title: selfSwitchGroup.title
                    hint: selfSwitchGroup.hint
                    labelVisible: false
                    enabled: radio1.checked
                }
                RadioButton {
                    id: radio2
                    exclusiveGroup: group
                    y: 5
                }
                LabeledTextField {
                    id: selfSwitchText
                    title: selfSwitchGroup.title
                    hint: selfSwitchGroup.hint
                    labelVisible: false
                    enabled: radio2.checked
                    itemWidth: selfSwitchBox.itemWidth
                }
            }
        }
    }
    ControlsRow {
        Group_Operation {
            width: selfSwitchGroup.width
            id: operationGroup
            hint: qsTr("Selects whether to turn the self switch ON or OFF.")
            text1: qsTr("ON")
            hint1: qsTr("Turns the specified self switch ON.")
            text2: qsTr("OFF")
            hint2: qsTr("Turns the specified self switch OFF.")
        }
    }
    ControlsRow {
        GroupBox {
            width: selfSwitchGroup.width
            title: qsTr("Other Events")
            hint: qsTr("Change the Self-Switches of other events on the map.")
            id: characterSelectGroup
            ControlsRow {
                CharacterSelectBox {
                    title: qsTr("Character")
                    enabled: characterCheckBox.checked
                    id: characterSelectBox
                }
                ObjCheckBox {
                    id: characterCheckBox
                    y: characterCheckBox.height+5
                }
            }
        }
    }

    onLoad: {
        if (eventData) {
            var params = eventData[0].parameters;
            selfSwitchBox.setCharacter(params[0]);
            operationGroup.setup(params[1]);
        }
    }

    onSave: {
        if (characterCheckBox.checked || radio2.checked) {
            var id; if (characterCheckBox.checked && characterSelectBox.currentId > 0) id = ""+characterSelectBox.currentId+""; else id = "this._eventId";
            var ss; if (radio2.checked) ss = ""+selfSwitchText.text+""; else ss = OneMakerMVSettings.getSetting("selfSwitchNaming","namingScheme")[selfSwitchBox.currentIndex];
            var op; if (operationGroup.operationType === 0) op = true; else op = false;
            var text = "$gameSelfSwitches.setValue([this._mapId,"+id+",'"+ss+"'"+"],"+op+");";
            eventData = [];
            eventData.push( makeCommand(355, 0, [text]) );
        } else {
            if (!eventData) {
                makeSimpleEventData();
            }
            var params = eventData[0].parameters;
            params[0] = selfSwitchBox.currentCharacter;
            params[1] = operationGroup.operationType;
        }
    }
}
