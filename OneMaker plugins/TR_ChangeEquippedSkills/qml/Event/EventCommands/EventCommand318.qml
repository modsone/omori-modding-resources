// ===========================================================
// Change Equipped Skills - By TomatoRadio (Version 1.0)
// Import Filename: EventCommand318.qml
// Import Directory: Event/EventCommands/
// Adds Equipping and Unequipping Skills from Actors.
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

// Change Skill
EventCommandBase {
    id: root

    Group_TargetActor {
        id: targetActorGroup
    }

    GroupBoxRow {
        LabeledComboBox {
            id: operationGroup
            title: qsTr("Operation")
            hint: qsTr("Selects whether to learn or forget the skill.")
            model: [qsTr("Learn"),qsTr("Forget"),qsTr("Equip"),qsTr("Unequip")]
        }

        GameObjectBox {
            id: skillSelectBox
            title: qsTr("Skill")
            dataSetName: "skills"
            width: operationGroup.width
        }
    }

    GroupBoxRow {
        ObjCheckBox {
            id: checkSlot
            title: qsTr("Set Slot?")
            hint: qsTr("Set the slot that the skill will be equipped to? Turning off will equip to the first open slot.")
            y: 24
        }
        ObjSpinBox {
            id: slot
            title: qsTr("Slot")
            hint: qsTr("The slot to be equipped to. Slot 0 is the first slot. If no open slots exist, will overwrite first equip if allowed to.")
            minimumValue: 0
            maximumValue: 99
            enabled: checkSlot.checked
        }
        ObjCheckBox {
            id: checkKnow
            text: qsTr("Must know skill?")
            title: qsTr("Must know skill?")
            hint: qsTr("If checked, the Actor has to know the skill for it to be equipped.")
            y: 24
        }
        ObjCheckBox {
            id: checkReplace
            text: qsTr("Can replace skills?")
            title: qsTr("Can replace skills?")
            hint: qsTr("If checked, the skill may overwrite skills equipped by the actor.")
            y: 24
        }
        enabled: operationGroup.currentIndex === 2
    }

    onLoad: {
        if (eventData) {
            var params = eventData[0].parameters;
            targetActorGroup.setup(params[0], params[1]);
            operationGroup.setup(params[2]);
            skillSelectBox.setCurrentId(params[3]);
        }
    }

    onSave: {
        if (operationGroup.currentIndex > 1) {
            var scriptCommandText = "";
            if (targetActorGroup.operandType === 0) {
                scriptCommandText += "const actor = $gameActors.actor("+targetActorGroup.operandValue+"); const skill = "+skillSelectBox.currentId+";\n"
            } else {
                scriptCommandText += "const actor = $gameActors.actor($gameVariables.value("+targetActorGroup.operandValue+")); const skill = "+skillSelectBox.currentId+";\n"
            }
            if (operationGroup.currentIndex === 2) { //Equip
                scriptCommandText += "const skillList = actor.skills().map(s=>s && s.id);\n"
                scriptCommandText += "if (skillList.includes(skill)) return; //If the Actor already has the skill equipped, return.\n"
                if (checkKnow.checked) scriptCommandText += "if (!actor._skills.includes(skill)) return; //If the Actor doesn't know the skill, return.\n"
                if (checkSlot.checked) {scriptCommandText += "const slot = "+slot.value+";\n"}
                else {scriptCommandText += "const slot = skillList.findIndex(s=>!s);\n"}
                if (!checkReplace.checked) {
                    if (checkSlot.checked) {
                        scriptCommandText += "if (skillList[slot]) return; //If the skill slot is taken, return.\n"
                    } else {
                        scriptCommandText += "if (slot < 0) return; //If we didn't find an open slot, return.\n"
                    }
                }
                scriptCommandText += "actor.equipSkill(slot,skill);"                
            } else { //Unequip
                scriptCommandText += "const slot = actor.skills().findIndex(s=>s && s.id === skill)\n"
                scriptCommandText += "if (slot > -1) actor.unequipSkill(slot,0); return;"
            }

            var lines = scriptCommandText.split("\n");
            eventData = [];

            while (lines.length > 1 && lines[lines.length - 1].length === 0) {
                lines.pop();
            }
            for (var i = 0; i < lines.length; i++) {
                var code = (i === 0 ? 355 : 655);
                eventData.push( makeCommand(code, 0, [lines[i]]) );
            }
        } else {
            if (!eventData) {
                makeSimpleEventData();
            }
            var params = eventData[0].parameters;
            params[0] = targetActorGroup.operandType;
            params[1] = targetActorGroup.operandValue;
            params[2] = operationGroup.currentIndex;
            params[3] = skillSelectBox.currentId;
        }
    }
}
