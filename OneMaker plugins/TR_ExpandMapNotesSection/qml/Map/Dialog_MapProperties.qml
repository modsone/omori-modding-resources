// ===========================================================
// Expand Map Notes Section - By TomatoRadio (Version 1.0)
// Import Filename: Dialog_MapProperties.qml
// Import Directory: Map/
// Moves the Notes section of the Map properties window to
// where the Encounters section normally is.
// Note that Encounters by proxy are also removed.
// ===========================================================

import QtQuick 2.3
import QtQuick.Controls 1.2
import "../BasicControls"
import "../BasicLayouts"
import "../Controls"
import "../Layouts"
import "../ObjControls"
import "../Database"
import "../Singletons"

ModalWindow {
    id: root

    title: "ID:" + DataManager.makeIdText(mapId, 3) + " - " + qsTr("Map Properties")

    property var dataObject
    property int mapId
    property string name

    DialogBox {
        applyVisible: false

        onInit: {
            nameEdit.text = root.name;
        }

        onOk: {
            root.name = nameEdit.text;
        }

        GroupBoxRow {
            GroupBoxColumn {
                GroupBox {
                    id: generalSettings
                    title: qsTr("General Settings")
                    hint: qsTr("Basic map settings.")
                    ControlsColumn {
                        ControlsRow {
                            LabeledTextField {
                                id: nameEdit
                                title: qsTr("Name")
                                hint: qsTr("Name of the map.")
                            }
                            ObjTextField {
                                member: "displayName"
                                title: qsTr("Display Name")
                                hint: qsTr("Name displayed on the upper left part of the screen when moving to the map. Not displayed if left blank.")
                            }
                        }
                        ControlsRow {
                            GameObjectBox {
                                member: "tilesetId"
                                title: qsTr("Tileset")
                                hint: qsTr("Tileset used for the map.")
                                dataSetName: "tilesets"
                            }
                            ObjSpinBox {
                                member: "width"
                                title: qsTr("Width")
                                hint: qsTr("Horizontal size of the map.")
                                minimumValue: 0
                                maximumValue: 256
                            }
                            ObjSpinBox {
                                member: "height"
                                title: qsTr("Height")
                                hint: qsTr("Vertical size of the map.")
                                minimumValue: 0
                                maximumValue: 256
                            }
                        }
                        ControlsRow {
                            ObjComboBox {
                                member: "scrollType"
                                title: qsTr("Scroll Type")
                                hint: qsTr("Whether to wrap around from one side to the other.")
                                model: [qsTr("No Loop"), qsTr("Loop Vertically"), qsTr("Loop Horizontally"), qsTr("Loop Both")]
                            }
                            ObjSpinBox {
                                member: "encounterStep"
                                title: qsTr("Enc. Steps", "Encounter Steps")
                                hint: qsTr("Average number of steps between random encounters.")
                                minimumValue: 1
                                maximumValue: 999
                            }
                        }
                        DialogSeparator {
                            height: 16
                        }
                        ControlsRow {
                            ObjCheckLabeler {
                                id: autoplayBgm
                                member: "autoplayBgm"
                                title: qsTr("Autoplay BGM")
                                hint: qsTr("Makes the BGM change automatically when moving to the map.")
                                ObjAudioBox {
                                    member: "bgm"
                                    title: autoplayBgm.title
                                    hint: autoplayBgm.hint
                                    subFolder: "bgm"
                                    labelVisible: false
                                }
                            }
                            ObjCheckLabeler {
                                id: autoplayBgs
                                member: "autoplayBgs"
                                title: qsTr("Autoplay BGS")
                                hint: qsTr("Makes the BGS change automatically when moving to the map.")
                                ObjAudioBox {
                                    member: "bgs"
                                    title: autoplayBgs.title
                                    hint: autoplayBgs.hint
                                    subFolder: "bgs"
                                    labelVisible: false
                                }
                            }
                        }
                        ControlsRow {
                            ObjCheckLabeler {
                                id: specifyBattleback
                                member: "specifyBattleback"
                                title: qsTr("Specify Battleback")
                                hint: qsTr("Displays the specified background when a battle occurs on this map. When not specified, a background conforming to the terrain is automatically selected for world maps, and for other maps, a processed image of the map screen will be used as a background.")
                                ObjImageEllipsisBox {
                                    memberForName: "battleback1Name"
                                    memberForName2: "battleback2Name"
                                    title: specifyBattleback.title
                                    hint: specifyBattleback.hint
                                    subFolder: "battlebacks1"
                                    subFolder2: "battlebacks2"
                                    imageScale: 0.36
                                    itemWidth: 240
                                    labelVisible: false
                                }
                            }
                            ObjCheckBox {
                                member: "disableDashing"
                                text: qsTr("Disable Dashing")
                                hint: qsTr("Makes it impossible to perform a dash on the map.")
                                anchors.verticalCenter: parent.verticalCenter
                            }
                        }
                    }
                }
                GroupBoxRow {
                    GroupBox {
                        title: qsTr("Parallax Background")
                        hint: qsTr("Distant view image displayed in the transparent area of the map.")
                        ControlsColumn {
                            Layout_ParallaxBack {
                                id: parallax
                                dataObject: root.dataObject
                            }
                            DialogSeparator {
                                height: 16
                            }
                            ObjCheckBox {
                                member: "parallaxShow"
                                text: qsTr("Show Tiled Maps") // [OneMaker MV] - Changed to account for tiled map viewing.
                                hint: qsTr("Displays map images located in the playtest/render/ folder.\nFollowing a mapX.png format, where X is the id of the map you are viewing.") // [OneMaker MV] - Changed to account for tiled map viewing.
                            }
                        }
                        height: 243
                        id: parallaxBox
                    }/*
                    Group_Encounters {
                        width: parallaxBox.width
                        height: 243
                        itemHeight: 200
                    }*/
                }
            }
            Group_Note {
                width: parseInt(generalSettings.width * 0.75)
                height: generalSettings.height + 243 + 10
                itemWidth: parseInt(generalSettings.width*0.75)-20
                itemHeight: generalSettings.height + 200
                    }
        }
    }
}
