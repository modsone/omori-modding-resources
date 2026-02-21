// ===========================================================
// Extra Followers - By TomatoRadio (Version 1.0)
// Import Filename: EventCommand129.qml
// Import Directory: Event/EventCommands/
// Adds UI for adding and removing Extra Followers,
// and can set the movement images of newly added Actors.
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

// Change Party Member
EventCommandBase {
    id: root

    width: characterBox.width + 20
    height: 400

    ObjCheckBox {
        id: mode
        text: qsTr("Change Followers?")
    }
    ControlsColumn {
        visible: !mode.checked
        ControlsRow {
            GameObjectBox {
                id: actorSelectBox
                title: qsTr("Actor")
                hint: qsTr("Actor to increase or decrease.")
                dataSetName: "actors"
            }
            CheckBox {
                id: checkBox
                text: qsTr("Initialize")
                hint: qsTr("When adding, reverts to the starting state as specified in the database.")
                enabled: operationGroup.operationType === 0
                y: 28
            }
        }

        Group_Operation {
            id: operationGroup
            hint: qsTr("Selects whether to add or remove the actor.")
            text1: qsTr("Add", "Add to the party")
            hint1: qsTr("Adds the actor to the party.")
            text2: qsTr("Remove", "Remove from the party")
            hint2: qsTr("Removes the actor from the party.")
        }

        GroupBox {
            title: qsTr("Movement Animations")
            hint: qsTr("")
            enabled: operationGroup.operationType === 0
            ControlsColumn {
                    CheckBox {
                    id: checkBox3
                    text: qsTr("Set Actor's Movement Animations?")
                    hint: qsTr("When adding, sets their movement frames akin to Graphics-Base.")
                    enabled: operationGroup.operationType === 0
                }
                ControlsRow {
                    enabled: checkBox3.checked
                    CharacterImageBox {
                        id: actorImageBox1
                        title: qsTr("Walking")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                    CharacterImageBox {
                        id: actorImageBox3
                        title: qsTr("Climbing")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                    CharacterImageBox {
                        id: actorImageBox2
                        title: qsTr("Running")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                }
            }
        }

    }
    ControlsRow {
        visible: mode.checked
        GroupBoxRow {
            GroupBoxColumn {
                GroupBox {
                    id: character
                    title: qsTr("Character Info")
                    hint: qsTr("")
                    width: characterBox.width
                    ControlsRow {
                        LabeledTextField {
                            id: charaId
                            title: qsTr("Character ID")
                            hint: qsTr("")
                            itemWidth: 128
                            enabled: operationGroup2.operationType === 0 || (!checkBox2.checked)
                        }
                        ObjCheckBox {
                            id: checkBox2
                            text: qsTr("")
                            hint: qsTr("")
                            y: 20
                            //itemHeight: 28
                        }
                        ObjSpinBox {
                            id: position
                            title: qsTr("Set Position")
                            hint: qsTr("Specify the exact position of the follower. Will default to the last open slot.")
                            itemWidth: 96
                            minimumValue: 0
                            maximumValue: 99
                            enabled: checkBox2.checked
                        }
                    }
                }
                GroupBox {
                    id: addRemoveBox
                    title: qsTr("Operation")
                    hint: qsTr("")
                    width: characterBox.width
                    ControlsRow {
                        Group_Operation {
                            id: operationGroup2
                            hint: qsTr("Selects whether to add or remove the follower.")
                            text1: qsTr("ADD")
                            hint1: qsTr("")
                            text2: qsTr("REMOVE")
                            hint2: qsTr("")
                        }
                    }
                }
                GroupBox {
                    enabled: operationGroup2.operationType === 0
                    id: characterBox
                    title: qsTr("Actor Images")
                    hint: qsTr("")
                    ControlsRow {
                        CharacterImageBox {
                            id: characterImageBox1
                            title: qsTr("Walking")
                            hint: qsTr("")
                            itemWidth: 104
                            itemHeight: 104
                        }
                        CharacterImageBox {
                            id: characterImageBox2
                            title: qsTr("Climbing")
                            hint: qsTr("")
                            itemWidth: 104
                            itemHeight: 104
                        }
                        CharacterImageBox {
                            id: characterImageBox3
                            title: qsTr("Running")
                            hint: qsTr("")
                            itemWidth: 104
                            itemHeight: 104
                        }
                    }
                }
            }
        }
    }

    onLoad: {
        if (eventData) {
            var params = eventData[0].parameters;
            actorSelectBox.setCurrentId(params[0]);
            operationGroup.setup(params[1]);
            checkBox.checked = params[2];
        }
    }

    onSave: {
        if (!mode.checked) {
            if (!eventData) {
                makeSimpleEventData();
            }
            var params = eventData[0].parameters;
            params[0] = actorSelectBox.currentId;
            params[1] = operationGroup.operationType;
            params[2] = checkBox.checked;
            if (checkBox3.checked) {
                // MAKE ALL OF THIS ALIGN WITH CMD1004 BUT FOR THE ADDED ACTOR.
                var scriptCommandText = "";
                scriptCommandText += "const Walking = { name: '" + actorImageBox1.imageName + "', index: " + actorImageBox1.imageIndex + " };\n" +
                                                "const Runing = { name: '" + actorImageBox2.imageName + "', index: " + actorImageBox2.imageIndex + " };\n" +
                                                "const Climbing = { name: '" + actorImageBox3.imageName + "', index: " + actorImageBox3.imageIndex + " };\n\n";
                scriptCommandText += "$gameActors.actor(" + DataManager.actors[actorSelectBox.currentId].id  + ").setMovementGraphics(Walking, Walking, Runing);\n" + 
                                        "$gameActors.actor(" + DataManager.actors[actorSelectBox.currentId].id  + ").setMovementGraphicData('climbing', Climbing);\n";
                var lines = scriptCommandText.split("\n");
                //eventData = [];

                while (lines.length > 1 && lines[lines.length - 1].length === 0) {
                    lines.pop();
                }
                for (var i = 0; i < lines.length; i++) {
                    var code = (i === 0 ? 355 : 655);
                    eventData.push( makeCommand(code, 0, [lines[i]]) );
                }
            }
        } else {
            var positionText;
            if (checkBox2.checked) positionText = ", "+position.value+""; else positionText = "";
            var followerRef;
            if (checkBox2.checked) followerRef = "$gamePlayer.followers().follower("+position.value+")"; else followerRef = "$gamePlayer.followers().follower($gamePlayer.followers().nextExtraFollowerSlot()-1)";
            var scriptCommandText = "const Walking = {name: '"+characterImageBox1.imageName+"', index: "+characterImageBox1.imageIndex+"}\n" +
                                    "const Climbing = {name: '"+characterImageBox2.imageName+"', index: "+characterImageBox2.imageIndex+"}\n" + 
                                    "const Running = {name: '"+characterImageBox3.imageName+"', index: "+characterImageBox3.imageIndex+"}\n\n" + 
                                    "this.addExtraFollower('"+charaId.text+"',Walking.name,Walking.index"+positionText+")\n" +
                                    "const follower = "+followerRef+";\n" +
                                    "follower.setMovementGraphics(Walking,Walking,Running);\n" +
                                    "follower.setMovementGraphicData('climbing', Climbing);\n"

            if (operationGroup2.operationType !== 0) {
                if (checkBox2.checked) {
                    scriptCommandText = "this.removeExtraFollower("+position.value+");";
                } else {
                    scriptCommandText = "this.removeExtraFollowerById('"+charaId.text+"');"
                }
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
        }
    }
}
