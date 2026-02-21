// ===========================================================
// Move Picture EX - By TomatoRadio (Version 1.0)
// Import Filename: EventCommand232.qml
// Import Directory: Event/EventCommands/
// Adds UI for the MovePictureEX Plugin Command.
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

// Move Picture
EventCommandBase {
    id: root
    width: 565
    height: 548
    ObjCheckBox {
        id: exCheck
        text: qsTr("Use Move Picture EX Parameters?")
        hint: qsTr("Switches the UI to the parameters used by the MovePictureEX plugin command.")
    }
    ControlsRow {
    visible: !exCheck.checked
        GroupBoxColumn {
            Group_Picture {
                id: picture
                imageBoxVisible: false
                hint: qsTr("Picture to move or change properties.")
            }

            GroupBoxRow {
                id: pictureProperties
                Group_PicturePosition {
                    id: picturePosition
                    height: column.height
                }
                GroupBoxColumn {
                    id: column
                    Group_PictureZoom {
                        id: pictureZoom
                    }
                    Group_PictureBlend {
                        id: pictureBlend
                    }
                }
            }

            Group_Duration {
                id: durationGroup
                waitVisible: true
                width: pictureProperties.width
            }
        }
    }
    ControlsRow {
    visible: exCheck.checked
        GroupBoxColumn {
            ControlsRow {
                Group_Picture {
                    id: picture2
                    imageBoxVisible: false
                    hint: qsTr("Picture to move or change properties.")
                }
                Group_Duration {
                    id: durationGroup2
                    waitVisible: true
                    height: picture2.height
                    width: 438
                }
            }
            ControlsRow {
                GroupBox {
                    id: xBox
                    title: qsTr("X Position")
                    ControlsColumn {
                        ExclusiveGroup { id: xGroup }
                        ControlsRow {
                            RadioButton {
                                id: xRadio1
                                exclusiveGroup: xGroup
                                checked: true
                                y: this.height+5
                            }
                            ObjSpinBox {
                                id: xControls1
                                title: qsTr("Absolute")
                                hint: qsTr("Specify the absolute X position to move to.")
                                itemWidth: 128
                                minimumValue: 0
                                maximumValue: 99999
                                enabled: xRadio1.checked
                            }
                        }
                        ControlsRow {
                            RadioButton {
                                id: xRadio2
                                exclusiveGroup: xGroup
                                y: this.height+5
                            }
                            ObjSpinBox {
                                id: xControls2
                                title: qsTr("Relative")
                                hint: qsTr("Specify the relative X position to move to.")
                                itemWidth: 128
                                minimumValue: -99999
                                maximumValue: 99999
                                enabled: xRadio2.checked
                            }
                        }
                        ControlsRow {
                            RadioButton {
                                id: xRadio3
                                exclusiveGroup: xGroup
                                y: this.height+5
                            }
                            GameVariableBox {
                                id: xControls3
                                title: qsTr("Variable")
                                hint: qsTr("Specify the X position with a Variable")
                                itemWidth: 128
                                enabled: xRadio3.checked
                            }
                        }
                        ControlsRow {
                            RadioButton {
                                id: xRadio4
                                exclusiveGroup: xGroup
                            }
                            Label {
                                id: xControls4
                                text: qsTr("Don't Change")
                                hint: qsTr("Keep the original X position")
                                enabled: xRadio4.checked
                            }
                        }
                    }
                }
                GroupBox {
                    id: yBox
                    title: qsTr("Y Position")
                    ControlsColumn {
                        ExclusiveGroup { id: yGroup }
                        ControlsRow {
                            RadioButton {
                                id: yRadio1
                                exclusiveGroup: yGroup
                                checked: true
                                y: this.height+5
                            }
                            ObjSpinBox {
                                id: yControls1
                                title: qsTr("Absolute")
                                hint: qsTr("Specify the absolute Y position to move to.")
                                itemWidth: 128
                                minimumValue: 0
                                maximumValue: 99999
                                enabled: yRadio1.checked
                            }
                        }
                        ControlsRow {
                            RadioButton {
                                id: yRadio2
                                exclusiveGroup: yGroup
                                y: this.height+5
                            }
                            ObjSpinBox {
                                id: yControls2
                                title: qsTr("Relative")
                                hint: qsTr("Specify the relative Y position to move to.")
                                itemWidth: 128
                                minimumValue: -99999
                                maximumValue: 99999
                                enabled: yRadio2.checked
                            }
                        }
                        ControlsRow {
                            RadioButton {
                                id: yRadio3
                                exclusiveGroup: yGroup
                                y: this.height+5
                            }
                            GameVariableBox {
                                id: yControls3
                                title: qsTr("Variable")
                                hint: qsTr("Specify the Y position with a Variable")
                                itemWidth: 128
                                enabled: yRadio3.checked
                            }
                        }
                        ControlsRow {
                            RadioButton {
                                id: yRadio4
                                exclusiveGroup: yGroup
                            }
                            Label {
                                id: yControls4
                                text: qsTr("Don't Change")
                                hint: qsTr("Keep the original Y position")
                                enabled: yRadio4.checked
                            }
                        }
                    }
                }
                ControlsColumn {
                    GroupBox {
                        title: qsTr("Misc Options")
                        width: xBox.width
                        height: xBox.height
                        ControlsColumn {
                            ControlsRow {
                                LabeledComboBox {
                                    id: origin
                                    title: qsTr("Origin")
                                    hint: qsTr("The origin point of the picture")
                                    model: [qsTr("Upper Left"),qsTr("Center")]
                                    enabled: originCheck.checked
                                    itemWidth: 110
                                }
                                ObjCheckBox {
                                    id: originCheck
                                    text: qsTr("")
                                    hint: qsTr("")
                                    y: 22
                                    x: 110
                                }
                            }
                            ControlsRow {
                                LabeledComboBox {
                                    id: blendMode
                                    title: qsTr("Blend Mode")
                                    hint: qsTr("The blend mode of the Picture")
                                    model: [qsTr("Normal"),qsTr("Add"),qsTr("Multiply"),qsTr("Screen")]
                                    enabled: blendCheck.checked
                                    itemWidth: 110
                                }
                                ObjCheckBox {
                                    id: blendCheck
                                    text: qsTr("")
                                    hint: qsTr("")
                                    y: 22
                                    x: 110
                                }
                            }
                            ControlsRow {
                                LabeledComboBox {
                                    id: easingMode
                                    title: qsTr("Easing Curve")
                                    hint: qsTr("The easing of the Picture")
                                    model: [qsTr("QuadIn"),qsTr("QuadOut"),qsTr("QuadInOut"),qsTr("CubicIn"),qsTr("CubicOut"),qsTr("CubicInOut"),qsTr("QuartIn"),qsTr("QuartOut"),qsTr("QuartInOut"),qsTr("QuintIn"),qsTr("QuintOut"),qsTr("QuintInOut"),qsTr("SineIn"),qsTr("SineOut"),qsTr("SineInOut"),qsTr("ExpoIn"),qsTr("ExpoOut"),qsTr("ExpoInOut"),qsTr("CircIn"),qsTr("CircOut"),qsTr("CircInOut"),qsTr("ElasticIn"),qsTr("ElasticOut"),qsTr("ElasticInOut"),qsTr("BackIn"),qsTr("BackOut"),qsTr("BackInOut"),qsTr("BounceIn"),qsTr("BounceOut"),qsTr("BounceInOut")]
                                    itemWidth: 110
                                    enabled: easingCheck.checked
                                }
                                ObjCheckBox {
                                    id: easingCheck
                                    text: qsTr("")
                                    hint: qsTr("")
                                    y: 22
                                    x: 110
                                }
                            }
                        }
                    }
                }
            }
            ControlsRow {
                GroupBox {
                    title: qsTr("Width")
                    ControlsColumn {
                        ExclusiveGroup { id: widthGroup }
                        ControlsRow {
                            RadioButton {
                                id: widthRadio1
                                exclusiveGroup: widthGroup
                                checked: true
                                y: this.height+5
                            }
                            ObjSpinBox {
                                id: widthControls1
                                title: qsTr("Absolute")
                                hint: qsTr("Specify the absolute width to scale to.")
                                itemWidth: 128
                                minimumValue: -99999
                                maximumValue: 99999
                                enabled: widthRadio1.checked
                            }
                        }
                        ControlsRow {
                            RadioButton {
                                id: widthRadio2
                                exclusiveGroup: widthGroup
                                y: this.height+5
                            }
                            ObjSpinBox {
                                id: widthControls2
                                title: qsTr("Relative")
                                hint: qsTr("Specify the relative width to scale to.")
                                itemWidth: 128
                                minimumValue: -99999
                                maximumValue: 99999
                                enabled: widthRadio2.checked
                            }
                        }
                        ControlsRow {
                            RadioButton {
                                id: widthRadio3
                                exclusiveGroup: widthGroup
                                y: this.height+5
                            }
                            GameVariableBox {
                                id: widthControls3
                                title: qsTr("Variable")
                                hint: qsTr("Specify the width with a Variable")
                                itemWidth: 128
                                enabled: widthRadio3.checked
                            }
                        }
                        ControlsRow {
                            RadioButton {
                                id: widthRadio4
                                exclusiveGroup: widthGroup
                            }
                            Label {
                                id: widthControls4
                                text: qsTr("Don't Change")
                                hint: qsTr("Keep the original width")
                                enabled: widthRadio4.checked
                            }
                        }
                    }
                }
                GroupBox {
                    title: qsTr("Height")
                    ControlsColumn {
                        ExclusiveGroup { id: heightGroup }
                        ControlsRow {
                            RadioButton {
                                id: heightRadio1
                                exclusiveGroup: heightGroup
                                checked: true
                                y: this.height+5
                            }
                            ObjSpinBox {
                                id: heightControls1
                                title: qsTr("Absolute")
                                hint: qsTr("Specify the absolute height to scale to.")
                                itemWidth: 128
                                minimumValue: -99999
                                maximumValue: 99999
                                enabled: heightRadio1.checked
                            }
                        }
                        ControlsRow {
                            RadioButton {
                                id: heightRadio2
                                exclusiveGroup: heightGroup
                                y: this.height+5
                            }
                            ObjSpinBox {
                                id: heightControls2
                                title: qsTr("Relative")
                                hint: qsTr("Specify the relative height to scale to.")
                                itemWidth: 128
                                minimumValue: -99999
                                maximumValue: 99999
                                enabled: heightRadio2.checked
                            }
                        }
                        ControlsRow {
                            RadioButton {
                                id: heightRadio3
                                exclusiveGroup: heightGroup
                                y: this.height+5
                            }
                            GameVariableBox {
                                id: heightControls3
                                title: qsTr("Variable")
                                hint: qsTr("Specify the height with a Variable")
                                itemWidth: 128
                                enabled: heightRadio3.checked
                            }
                        }
                        ControlsRow {
                            RadioButton {
                                id: heightRadio4
                                exclusiveGroup: heightGroup
                            }
                            Label {
                                id: heightControls4
                                text: qsTr("Don't Change")
                                hint: qsTr("Keep the original height")
                                enabled: heightRadio4.checked
                            }
                        }
                    }
                }
                GroupBox {
                    title: qsTr("Opacity")
                    ControlsColumn {
                        ExclusiveGroup { id: opacityGroup }
                        ControlsRow {
                            RadioButton {
                                id: opacityRadio1
                                exclusiveGroup: opacityGroup
                                checked: true
                                y: this.height+5
                            }
                            ObjSpinBox {
                                id: opacityControls1
                                title: qsTr("Absolute")
                                hint: qsTr("Specify the absolute opacity to scale to.")
                                itemWidth: 128
                                minimumValue: 0
                                maximumValue: 255
                                enabled: opacityRadio1.checked
                            }
                        }
                        ControlsRow {
                            RadioButton {
                                id: opacityRadio2
                                exclusiveGroup: opacityGroup
                                y: this.height+5
                            }
                            ObjSpinBox {
                                id: opacityControls2
                                title: qsTr("Relative")
                                hint: qsTr("Specify the relative opacity to scale to.")
                                itemWidth: 128
                                minimumValue: -255
                                maximumValue: 255
                                enabled: opacityRadio2.checked
                            }
                        }
                        ControlsRow {
                            RadioButton {
                                id: opacityRadio3
                                exclusiveGroup: opacityGroup
                                y: this.height+5
                            }
                            GameVariableBox {
                                id: opacityControls3
                                title: qsTr("Variable")
                                hint: qsTr("Specify the opacity with a Variable")
                                itemWidth: 128
                                enabled: opacityRadio3.checked
                            }
                        }
                        ControlsRow {
                            RadioButton {
                                id: opacityRadio4
                                exclusiveGroup: opacityGroup
                            }
                            Label {
                                id: opacityControls4
                                text: qsTr("Don't Change")
                                hint: qsTr("Keep the original opacity")
                                enabled: opacityRadio4.checked
                            }
                        }
                    }
                }
            }
        }
    }
    onLoad: {
        if (eventData) {
            var params = eventData[0].parameters;
            picture.number = params[0];
            picturePosition.setup(params[2], params[3], params[4], params[5]);
            pictureZoom.zoomX = params[6];
            pictureZoom.zoomY = params[7];
            pictureBlend.opacityValue = params[8];
            pictureBlend.blendMode = params[9];
            durationGroup.value = params[10];
            durationGroup.waitChecked = params[11];
        }
    }

    onSave: {
        if (exCheck.checked) {
            eventData = [];
            var id;var x;var y;var w;var h;var op;var or;var b;var c;var d;var wt;
            //Set ID
            id = " "+picture2.number;
            //Set X
            if (xRadio4.checked) {
                x = "";
            } else if (xRadio3.checked) {
                x = " x:v"+xControls3.variableId;
            } else if (xRadio2.checked) {
                if (xControls2.value < 0) {
                    x = " x:"+xControls2.value;
                } else {
                    x = " x:+"+xControls2.value;
                };
            } else {
                x = " x:"+xControls1.value;
            };
            //Set Y
            if (yRadio4.checked) {
                y = "";
            } else if (yRadio3.checked) {
                y = " y:v"+yControls3.variableId;
            } else if (yRadio2.checked) {
                if (yControls2.value < 0) {
                    y = " y:"+yControls2.value;
                } else {
                    y = " y:+"+yControls2.value;
                };
            } else {
                y = " y:"+yControls1.value;
            };
            //Set Width
            if (widthRadio4.checked) {
                w = "";
            } else if (widthRadio3.checked) {
                w = " w:v"+widthControls3.variableId;
            } else if (widthRadio2.checked) {
                if (widthControls2.value < 0) {
                    w = " w:"+widthControls2.value;
                } else {
                    w = " w:+"+widthControls2.value;
                };
            } else {
                w = " w:"+widthControls1.value;
            };
            //Set Height
            if (heightRadio4.checked) {
                h = "";
            } else if (heightRadio3.checked) {
                h = " h:v"+heightControls3.variableId;
            } else if (heightRadio2.checked) {
                if (heightControls2.value < 0) {
                    h = " h:"+heightControls2.value;
                } else {
                    h = " h:+"+heightControls2.value;
                };
            } else {
                h = " h:"+heightControls1.value;
            };
            //Set Opacity
            if (opacityRadio4.checked) {
                op = "";
            } else if (opacityRadio3.checked) {
                op = " op:v"+opacityControls3.variableId;
            } else if (opacityRadio2.checked) {
                if (opacityControls2.value < 0) {
                    op = " op:"+opacityControls2.value;
                } else {
                    op = " op:+"+opacityControls2.value;
                };
            } else {
                op = " op:"+opacityControls1.value;
            };
            //Set Origin
            if (originCheck.checked) {
                if (origin.currentIndex === 0) {
                    or = " or:top_left";
                } else {
                    or = " or:center";
                };
            } else {
                or = "";
            };
            //Set Blend
            if (blendCheck.checked) {
                switch (blendMode.currentIndex) {
                    case 0:
                        b = " b:normal";break;
                    case 1:
                        b = " b:additive";break;
                    case 2:
                        b = " b:multiply";break;
                    case 3:
                        b = " b:screen";break;
                    default:
                        b = ""
                };
            } else {
                b = "";
            };
            //Set Curve
            if (easingCheck.checked) {
                c = " c:"+easingMode.currentText.toLowerCase();
            } else {
                c = "";
            };
            //Set Duration
            d = " d:"+durationGroup2.value;
            if (durationGroup2.waitChecked) {
                wt = " wait";
            } else {
                wt = "";
            };
            var joinedText = id+or+x+y+w+h+b+op+c+d+wt;
            eventData.push( makeCommand(356, 0, ["MovePicture"+joinedText]) );
        } else {
            if (!eventData) {
                makeSimpleEventData();
            }
            var params = eventData[0].parameters;
            params[0] = picture.number;
            params[1] = 0;
            params[2] = picturePosition.origin;
            params[3] = picturePosition.type;
            params[4] = picturePosition.value1;
            params[5] = picturePosition.value2;
            params[6] = pictureZoom.zoomX;
            params[7] = pictureZoom.zoomY;
            params[8] = pictureBlend.opacityValue;
            params[9] = pictureBlend.blendMode;
            params[10] = durationGroup.value;
            params[11] = durationGroup.waitChecked;
        }
    }
}
