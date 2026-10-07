// ===========================================================
// Actor Climbing Sprites - By TomatoRadio (Version 1.0)
// Import Filename: EventCommand1004.qml
// Import Directory: Event/EventCommands/
// Adds UI for setting the Climbing sprites of an actor along
// with their running and walking sprites.
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

// Actor Movement Animation
EventCommandBase {
    id: root

    ControlsColumn {
        ControlsRow {
            ControlsRow {
                ObjCheckBox {
                    id: checkBox1
                    text: qsTr("")
                    hint: qsTr("")
                    height: 28
                    y: 18
                }
                GameObjectBox {
                    id: actorSelectBox1
                    itemWidth: 321
                    title: qsTr("First Actor")
                    hint: qsTr("Actor to change the images.")
                    dataSetName: "actors"
                    enabled: checkBox1.checked
                    onCurrentIdChanged: root.refresh(1)
                }
            }
            ControlsRow {
                ObjCheckBox {
                    id: checkBox2
                    text: qsTr("")
                    hint: qsTr("")
                    height: 28
                    y: 18
                }
                GameObjectBox {
                    id: actorSelectBox2
                    itemWidth: 321
                    title: qsTr("Second Actor")
                    hint: qsTr("Actor to change the images.")
                    dataSetName: "actors"
                    enabled: checkBox2.checked
                    onCurrentIdChanged: root.refresh(2)
                }
            }
            ControlsRow {
                ObjCheckBox {
                    id: checkBox3
                    text: qsTr("")
                    hint: qsTr("")
                    height: 28
                    y: 18
                }
                GameObjectBox {
                    id: actorSelectBox3
                    itemWidth: 321
                    title: qsTr("Third Actor")
                    hint: qsTr("Actor to change the images.")
                    dataSetName: "actors"
                    enabled: checkBox3.checked
                    onCurrentIdChanged: root.refresh(3)
                }
            }
            ControlsRow {
                ObjCheckBox {
                    id: checkBox4
                    text: qsTr("")
                    hint: qsTr("")
                    height: 28
                    y: 18
                }
                GameObjectBox {
                    id: actorSelectBox4
                    itemWidth: 321
                    title: qsTr("Fourth Actor")
                    hint: qsTr("Actor to change the images.")
                    dataSetName: "actors"
                    enabled: checkBox4.checked
                    onCurrentIdChanged: root.refresh(4)
                }
            }
        }
        ControlsRow {
            ControlsRow {
                ObjCheckBox {
                    id: checkBox5
                    text: qsTr("")
                    hint: qsTr("")
                    height: 28
                    y: 18
                }
                GameObjectBox {
                    id: actorSelectBox5
                    itemWidth: 321
                    title: qsTr("Fifth Actor")
                    hint: qsTr("Actor to change the images.")
                    dataSetName: "actors"
                    enabled: checkBox5.checked
                    onCurrentIdChanged: root.refresh(5)
                }
            }
            ControlsRow {
                ObjCheckBox {
                    id: checkBox6
                    text: qsTr("")
                    hint: qsTr("")
                    height: 28
                    y: 18
                }
                GameObjectBox {
                    id: actorSelectBox6
                    itemWidth: 321
                    title: qsTr("Sixth Actor")
                    hint: qsTr("Actor to change the images.")
                    dataSetName: "actors"
                    enabled: checkBox6.checked
                    onCurrentIdChanged: root.refresh(6)
                }
            }
            ControlsRow {
                ObjCheckBox {
                    id: checkBox7
                    text: qsTr("")
                    hint: qsTr("")
                    height: 28
                    y: 18
                }
                GameObjectBox {
                    id: actorSelectBox7
                    itemWidth: 321
                    title: qsTr("Seventh Actor")
                    hint: qsTr("Actor to change the images.")
                    dataSetName: "actors"
                    enabled: checkBox7.checked
                    onCurrentIdChanged: root.refresh(7)
                }
            }
            ControlsRow {
                ObjCheckBox {
                    id: checkBox8
                    text: qsTr("")
                    hint: qsTr("")
                    height: 28
                    y: 18
                }
                GameObjectBox {
                    id: actorSelectBox8
                    itemWidth: 321
                    title: qsTr("Eighth Actor")
                    hint: qsTr("Actor to change the images.")
                    dataSetName: "actors"
                    enabled: checkBox8.checked
                    onCurrentIdChanged: root.refresh(8)
                }
            }
        }
    }
    
    ControlsColumn {
        ControlsRow {
            GroupBox {
                title: qsTr("First Actor")
                hint: qsTr("")

                ControlsRow {
                    enabled: checkBox1.checked
                    CharacterImageBox {
                        id: characterImageBox1
                        title: qsTr("Walking")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                    CharacterImageBox {
                        id: climb1
                        title: qsTr("Climbing")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                    CharacterImageBox {
                        id: characterImageBox2
                        title: qsTr("Running")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                }
            }
            GroupBox {
                title: qsTr("Second Actor")
                hint: qsTr("")

                ControlsRow {
                    enabled: checkBox2.checked
                    CharacterImageBox {
                        id: characterImageBox3
                        title: qsTr("Walking")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                    CharacterImageBox {
                        id: climb2
                        title: qsTr("Climbing")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                    CharacterImageBox {
                        id: characterImageBox4
                        title: qsTr("Running")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                }
            }
            GroupBox {
                title: qsTr("Third Actor")
                hint: qsTr("")
    
                ControlsRow {
                    enabled: checkBox3.checked
                    CharacterImageBox {
                        id: characterImageBox5
                        title: qsTr("Walking")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                    CharacterImageBox {
                        id: climb3
                        title: qsTr("Climbing")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                    CharacterImageBox {
                        id: characterImageBox6
                        title: qsTr("Running")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                }
            }
            GroupBox {
                title: qsTr("Fourth Actor")
                hint: qsTr("")
    
                ControlsRow {
                    enabled: checkBox4.checked
                    CharacterImageBox {
                        id: characterImageBox7
                        title: qsTr("Walking")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                    CharacterImageBox {
                        id: climb4
                        title: qsTr("Climbing")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                    CharacterImageBox {
                        id: characterImageBox8
                        title: qsTr("Running")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                }
            }
        }
        ControlsRow {
            GroupBox {
                title: qsTr("Fifth Actor")
                hint: qsTr("")
    
                ControlsRow {
                    enabled: checkBox5.checked
                    CharacterImageBox {
                        id: characterImageBox9
                        title: qsTr("Walking")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                    CharacterImageBox {
                        id: climb5
                        title: qsTr("Climbing")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                    CharacterImageBox {
                        id: characterImageBox10
                        title: qsTr("Running")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                }
            }
            GroupBox {
                title: qsTr("Sixth Actor")
                hint: qsTr("")
    
                ControlsRow {
                    enabled: checkBox6.checked
                    CharacterImageBox {
                        id: characterImageBox11
                        title: qsTr("Walking")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                    CharacterImageBox {
                        id: climb6
                        title: qsTr("Climbing")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                    CharacterImageBox {
                        id: characterImageBox12
                        title: qsTr("Running")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                }
            }
            GroupBox {
                title: qsTr("Seventh Actor")
                hint: qsTr("")
    
                ControlsRow {
                    enabled: checkBox7.checked
                    CharacterImageBox {
                        id: characterImageBox13
                        title: qsTr("Walking")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                    CharacterImageBox {
                        id: climb7
                        title: qsTr("Climbing")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                    CharacterImageBox {
                        id: characterImageBox14
                        title: qsTr("Running")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                }
            }
            GroupBox {
                title: qsTr("Eighth Actor")
                hint: qsTr("")
    
                ControlsRow {
                    enabled: checkBox8.checked
                    CharacterImageBox {
                        id: characterImageBox15
                        title: qsTr("Walking")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                    CharacterImageBox {
                        id: climb8
                        title: qsTr("Climbing")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                    CharacterImageBox {
                        id: characterImageBox16
                        title: qsTr("Running")
                        hint: qsTr("")
                        itemWidth: 104
                        itemHeight: 104
                    }
                }
            }
        }
    }

    function refresh(control) {
        switch (control) {
            case 1:
                var actor = DataManager.actors[actorSelectBox1.currentId];
                var characterBox = characterImageBox1;
                break;
            case 2:
                var actor = DataManager.actors[actorSelectBox2.currentId];
                var characterBox = characterImageBox3;
                break;
            case 3:
                var actor = DataManager.actors[actorSelectBox3.currentId];
                var characterBox = characterImageBox5;
                break;
            case 4:
                var actor = DataManager.actors[actorSelectBox4.currentId];
                var characterBox = characterImageBox7;
                break;
            case 5:
                var actor = DataManager.actors[actorSelectBox5.currentId];
                var characterBox = characterImageBox9;
                break;
            case 6:
                var actor = DataManager.actors[actorSelectBox6.currentId];
                var characterBox = characterImageBox11;
                break;
            case 7:
                var actor = DataManager.actors[actorSelectBox7.currentId];
                var characterBox = characterImageBox13;
                break;
            case 8:
                var actor = DataManager.actors[actorSelectBox8.currentId];
                var characterBox = characterImageBox15;
                break;
        }

        if (actor) {
            characterBox.imageName = actor.characterName;
            characterBox.imageIndex = actor.characterIndex;
        }
    }

    onSave: {
        var scriptCommandTextBeginning = "";
        var scriptCommandTextEnd = "";

        if (checkBox1.checked) {
            scriptCommandTextBeginning += "const WalkOne = { name: '" + characterImageBox1.imageName + "', index: " + characterImageBox1.imageIndex + " };\n" +
                                          "const RunOne = { name: '" + characterImageBox2.imageName + "', index: " + characterImageBox2.imageIndex + " };\n" +
                                          "const ClimbOne = { name: '" + climb1.imageName + "', index: " + climb1.imageIndex + " };\n";
            scriptCommandTextEnd += "$gameActors.actor(" + DataManager.actors[actorSelectBox1.currentId].id  + ").setMovementGraphics(WalkOne, WalkOne, RunOne);\n" + 
                                    "$gameActors.actor(" + DataManager.actors[actorSelectBox1.currentId].id  + ").setMovementGraphicData('climbing', ClimbOne);\n";
        }
        if (checkBox2.checked) {
            scriptCommandTextBeginning += "const WalkTwo = { name: '" + characterImageBox3.imageName + "', index: " + characterImageBox3.imageIndex + " };\n" +
                                          "const RunTwo = { name: '" + characterImageBox4.imageName + "', index: " + characterImageBox4.imageIndex + " };\n" +
                                          "const ClimbTwo = { name: '" + climb2.imageName + "', index: " + climb2.imageIndex + " };\n";
            scriptCommandTextEnd += "$gameActors.actor(" + DataManager.actors[actorSelectBox2.currentId].id  + ").setMovementGraphics(WalkTwo, WalkTwo, RunTwo);\n" + 
                                    "$gameActors.actor(" + DataManager.actors[actorSelectBox2.currentId].id  + ").setMovementGraphicData('climbing', ClimbTwo);\n";
        }
        if (checkBox3.checked) {
            scriptCommandTextBeginning += "const WalkThree = { name: '" + characterImageBox5.imageName + "', index: " + characterImageBox5.imageIndex + " };\n" +
                                          "const RunThree = { name: '" + characterImageBox6.imageName + "', index: " + characterImageBox6.imageIndex + " };\n" +
                                          "const ClimbThree = { name: '" + climb3.imageName + "', index: " + climb3.imageIndex + " };\n";
            scriptCommandTextEnd += "$gameActors.actor(" + DataManager.actors[actorSelectBox3.currentId].id  + ").setMovementGraphics(WalkThree, WalkThree, RunThree);\n" + 
                                    "$gameActors.actor(" + DataManager.actors[actorSelectBox3.currentId].id  + ").setMovementGraphicData('climbing', ClimbThree);\n";
        }
        if (checkBox4.checked) {
            scriptCommandTextBeginning += "const WalkFour = { name: '" + characterImageBox7.imageName + "', index: " + characterImageBox7.imageIndex + " };\n" +
                                          "const RunFour = { name: '" + characterImageBox8.imageName + "', index: " + characterImageBox8.imageIndex + " };\n" +
                                          "const ClimbFour = { name: '" + climb4.imageName + "', index: " + climb4.imageIndex + " };\n";
            scriptCommandTextEnd += "$gameActors.actor(" + DataManager.actors[actorSelectBox4.currentId].id  + ").setMovementGraphics(WalkFour, WalkFour, RunFour);\n" + 
                                    "$gameActors.actor(" + DataManager.actors[actorSelectBox4.currentId].id  + ").setMovementGraphicData('climbing', ClimbFour);\n";
        }
        if (checkBox5.checked) {
            scriptCommandTextBeginning += "const WalkFive = { name: '" + characterImageBox9.imageName + "', index: " + characterImageBox9.imageIndex + " };\n" +
                                          "const RunFive = { name: '" + characterImageBox10.imageName + "', index: " + characterImageBox10.imageIndex + " };\n" +
                                          "const ClimbFive = { name: '" + climb5.imageName + "', index: " + climb5.imageIndex + " };\n";
            scriptCommandTextEnd += "$gameActors.actor(" + DataManager.actors[actorSelectBox5.currentId].id  + ").setMovementGraphics(WalkFive, WalkFive, RunFive);\n" + 
                                    "$gameActors.actor(" + DataManager.actors[actorSelectBox5.currentId].id  + ").setMovementGraphicData('climbing', ClimbFive);\n";
        }
        if (checkBox6.checked) {
            scriptCommandTextBeginning += "const WalkSix = { name: '" + characterImageBox11.imageName + "', index: " + characterImageBox11.imageIndex + " };\n" +
                                          "const RunSix = { name: '" + characterImageBox12.imageName + "', index: " + characterImageBox12.imageIndex + " };\n" +
                                          "const ClimbSix = { name: '" + climb6.imageName + "', index: " + climb6.imageIndex + " };\n";
            scriptCommandTextEnd += "$gameActors.actor(" + DataManager.actors[actorSelectBox6.currentId].id  + ").setMovementGraphics(WalkSix, WalkSix, RunSix);\n" + 
                                    "$gameActors.actor(" + DataManager.actors[actorSelectBox6.currentId].id  + ").setMovementGraphicData('climbing', ClimbSix);\n";
        }
        if (checkBox7.checked) {
            scriptCommandTextBeginning += "const WalkSeven = { name: '" + characterImageBox13.imageName + "', index: " + characterImageBox13.imageIndex + " };\n" +
                                          "const RunSeven = { name: '" + characterImageBox14.imageName + "', index: " + characterImageBox14.imageIndex + " };\n" +
                                          "const ClimbSeven = { name: '" + climb7.imageName + "', index: " + climb7.imageIndex + " };\n";
            scriptCommandTextEnd += "$gameActors.actor(" + DataManager.actors[actorSelectBox5.currentId].id  + ").setMovementGraphics(WalkSeven, WalkSeven, RunSeven);\n" + 
                                    "$gameActors.actor(" + DataManager.actors[actorSelectBox6.currentId].id  + ").setMovementGraphicData('climbing', ClimbSeven);\n";
        }
        if (checkBox8.checked) {
            scriptCommandTextBeginning += "const WalkEight = { name: '" + characterImageBox15.imageName + "', index: " + characterImageBox15.imageIndex + " };\n" +
                                          "const RunEight = { name: '" + characterImageBox16.imageName + "', index: " + characterImageBox16.imageIndex + " };\n" +
                                          "const ClimbEight = { name: '" + climb8.imageName + "', index: " + climb8.imageIndex + " };\n";
            scriptCommandTextEnd += "$gameActors.actor(" + DataManager.actors[actorSelectBox6.currentId].id  + ").setMovementGraphics(WalkEight, WalkEight, RunEight);\n" + 
                                    "$gameActors.actor(" + DataManager.actors[actorSelectBox6.currentId].id  + ").setMovementGraphicData('climbing', ClimbEight);\n";
        }
        
        if (scriptCommandTextBeginning) {
            scriptCommandTextBeginning += "\n";
            var scriptCommandText = scriptCommandTextBeginning + scriptCommandTextEnd;

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