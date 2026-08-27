import QtQuick 2.3
import QtQuick.Controls 1.2
import ".."
import "../../BasicControls"
import "../../BasicLayouts"
import "../../Controls"
import "../../Layouts"
import "../../ObjControls"
import "../../Singletons"

// Control Self Switches
EventCommandBase {
    id: root

    GroupBox {
        id: selfSwitchGroup
        title: qsTr("Self Switch & Character")
        hint: qsTr("Self switch to operate.")

        ControlsRow {
            SelfSwitchBox {
                id: selfSwitchBox
                title: selfSwitchGroup.title
                hint: selfSwitchGroup.hint
                labelVisible: false
            }

            CharacterSelectBox {
                id: characterSelectBox
                title: qsTr("Character")
                hint: qsTr("Character to be assigned the movement route.")
                labelVisible: false
                itemWidth: 100
                includePlayer: false
            }
        }
    }

    Group_Operation {
        id: operationGroup
        hint: qsTr("Selects whether to turn the self switch ON or OFF.")
        text1: qsTr("ON")
        hint1: qsTr("Turns the specified self switch ON.")
        text2: qsTr("OFF")
        hint2: qsTr("Turns the specified self switch OFF.")
    }

    // Params 0 = Char e.g 'A', 'B'
    // Params 1 = Bool
    onLoad: {
        if (eventData) {
            var params = eventData[0].parameters;
            selfSwitchBox.setCharacter(params[0]);
            operationGroup.setup(params[1]);
            characterSelectBox.setCurrentId(params[2]);
        }
    }

    onSave: {
        if (!eventData) {
            makeSimpleEventData();
        }
        var params = eventData[0].parameters;
        params[0] = selfSwitchBox.currentCharacter;
        params[1] = operationGroup.operationType;
        params[2] = characterSelectBox.currentId;
    }
}
