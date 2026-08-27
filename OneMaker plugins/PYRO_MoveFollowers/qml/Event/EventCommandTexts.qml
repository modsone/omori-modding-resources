import QtQuick 2.3
import QtQuick.Controls 1.2
import Tkool.rpg 1.0
import "../Singletons"
import "../_OneMakerMV" 
import "../Singletons"

QtObject {
    id: root

    property int troopId: 0

    readonly property string diamond: "\u25c6";     // BLACK DIAMOND
    readonly property string colon: "\uff1a";       // FULLWIDTH COLON
    readonly property string comma: ", ";
    readonly property string wait: qsTr("Wait");

    property var folder;
    property var atlasData: { 
        //"00_intro": {}
        "": {}
    }

    

    property QtObject moveCommandTexts: MovementCommandTexts {
        id: moveCommandTexts
    }

    function make(data) {
        return indentText(data) + symbolText(data) + commandText(data);
    }

    function indentText(data) {
        var text = "";
        for (var i = 0; i < data.indent; i++) {
            text += "  ";
        }
        return text;
    }

    function symbolText(data) {
        return data.code < 400 || data.code > 1000 ? diamond : colon; // [OneMaker MV] - Change to use diamond if code is over 1000
    }

    function commandText(data) {
        var color = EventCommands.color(data.code);
        var flag = EventCommands.flag(data.code);
        var name = EventCommands.shortName(data.code);
        var text;
        if (flag === 2) {
            text = colorChangeText("transparent");
        } else {
            text = colorChangeText(color);
        }
        text += name;
        if (flag === 2) {
            text += colorChangeText(color);
        }
        if (flag > 0) {
            if (name.length) {
                text += colon;
            }
            try {
                text += commandParamText(data);
            } catch (e) {
                console.warn(e);
            }
        }
        return text;
    }

    function commandParamText(data) {
        var func = this["commandParamText" + data.code];
        return func ? func(data.parameters) : "";
    }

    function colorChangeText(color) {
        return "\t" + color + "\t";
    }

    function rangeText(id1, id2, name1) {
        var idText1 = DataManager.makeIdText(id1, 4);
        var idText2 = DataManager.makeIdText(id2, 4);
        if (id1 === id2) {
            if (name1.length) {
                return "#" + idText1 + " " + name1;
            } else {
                return "#" + idText1;
            }
        } else {
            return "#" + idText1 + ".." + idText2;
        }
    }

    function switchRange(id1, id2) {
        return rangeText(id1, id2, DataManager.switchName(id1));
    }

    function variableRange(id1, id2) {
        return rangeText(id1, id2, DataManager.variableName(id1));
    }

    // [OneMaker MV] - altRangeText Added
    function altRangeText(id1, id2, name1) {
        var idText1 = DataManager.makeIdText(id1, 1);
        var idText2 = DataManager.makeIdText(id2, 1);
        if (idText1 === idText2) {
            if (name1.length) {
                return "#" + idText1 + " " + name1;
            } else {
                return "#" + idText1;
            }
        } else {
            return "#" + idText1 + ".." + idText2;
        }
    }

    // [OneMaker MV] - selfVariableRange Added
    function selfVariableRange(id1, id2) {
        return altRangeText(id1, id2, OneMakerMVSettings.getSetting("selfVariableNaming", "namingScheme")[id1]);
    }

    function optionText(text) {
        return " " + colorChangeText("gray") + Constants.parentheses(text);
    }

    function characterName(id) {
        if (id < 0) {
            return Constants.playerName;
        } else if (id === 0) {
            return Constants.thisEventName;
        } else {
            return eventName(id);
        }
    }

    function eventName(id) {
        var map = DataManager.getCurrentMap();
        var event = map ? map.events[id] : null;
        return event ? event.name : "#" + DataManager.makeIdText(id, 3);
    }

    function variableParam(param) {
        return "{" + DataManager.variableNameOrId(param) + "}";
    }

    function constOrVariableParam(param1, param2) {
        return param1 === 0 ? param2 : variableParam(param2);
    }

    function actorNameEx(param1, param2) {
        if (param1 === 0) {
            if (param2 === 0) {
                return qsTr("Entire Party");
            } else {
                return DataManager.actorNameOrId(param2);
            }
        } else {
            return variableParam(param2);
        }
    }

    function troopMemberNameEx(index) {
        if (index < 0) {
            return qsTr("Entire Troop");
        } else {
            var number = "#" + (index + 1);
            var name = troopId ? DataManager.troopMemberName(troopId, index) : "";
            if (name !== Constants.invalidDataName && name.length) {
                return number + " " + name;
            } else {
                return number;
            }
        }
    }

    function timerText(seconds) {
        var min = Math.floor(seconds / 60);
        var sec = Math.floor(seconds % 60);
        return qsTr("%1 min %2 sec").arg(min).arg(sec);
    }

    function gameDataOperand(type, param1, param2) {
        var numberOf = qsTr("The number of %1");
        var a_of_b = qsTr("%1 of %2");
        var text = "";
        var tmp;
        switch (type) {
        case 0:     // Item
            text += numberOf.arg(DataManager.itemNameOrId(param1));
            break;
        case 1:     // Weapon
            text += numberOf.arg(DataManager.weaponNameOrId(param1));
            break;
        case 2:     // Armor
            text += numberOf.arg(DataManager.armorNameOrId(param1));
            break;
        case 3:     // Actor
            tmp = Constants.variableActorStatusDataArray[param2];
            text += a_of_b.arg(tmp).arg(DataManager.actorNameOrId(param1));
            break;
        case 4:     // Enemy
            tmp = Constants.variableEnemyStatusDataArray[param2];
            text += a_of_b.arg(tmp).arg(troopMemberNameEx(param1));
            break;
        case 5:     // Character
            tmp = Constants.variableCharacterDataArray[param2];
            text += a_of_b.arg(tmp).arg(characterName(param1));
            break;
        case 6:     // Party
            tmp = qsTr("the party member #%1").arg(param1 + 1);
            text += a_of_b.arg(qsTr("Actor ID")).arg(tmp);
            break;
        case 7:     // Other
            text += Constants.variableOtherDataArray[param1];
            break;
        }
        return text;
    }

    function plusMinus(param) {
        return param === 0 ? "+" : "-";
    }

    function disableOrEnable(param) {
        return param === 0 ? qsTr("Disable") : qsTr("Enable");
    }

    function pictureNumberText(number) {
        return "#" + number;
    }

    function pictureCommonParamText(params) {
        var text = "";
        var x = constOrVariableParam(params[3], params[4]);
        var y = constOrVariableParam(params[3], params[5]);
        text += Constants.pictureOriginTypeArray[params[2]];
        text += " (%1,%2)".arg(x).arg(y);
        text += comma + "(%1%,%2%)".arg(params[6]).arg(params[7]);
        text += comma + params[8];
        text += comma + Constants.blendModeArray[params[9]];
        return text;
    }

    //-------------------------------------------------------------------------

    // Show Text
    function commandParamText101(params) {
        var text = colorChangeText("gray");
        text += Constants.imageText(params[0], params[1]);
        text += comma + Constants.messageBackgroundArray[params[2]];
        text += comma + Constants.messagePositionTypeArray[params[3]];
        return text;
    }

    // Show Text (Data)
    function commandParamText401(params) {
        return returnYamlIfExists(params[0])
    }

    // Show Choices
    function commandParamText102(params) {
        var text = colorChangeText("navy");
        var choices = params[0];
        var cancelType = params[1];
        var defaultType = params.length > 2 ? params[2] : 0;
        var positionType = params.length > 3 ? params[3] : 2;
        var background = params.length > 4 ? params[4] : 0;
        text += returnYamlIfExists(choices[0]);
        for (var i = 1; i < choices.length; i++) {
            text += comma + returnYamlIfExists(choices[i]);
        }
        var options = Constants.messageBackgroundArray[background];
        options += comma + Constants.choicesPositionTypeArray[positionType];
        options += comma;
        if (defaultType >= 0 && defaultType < choices.length) {
            options += "#" + (defaultType + 1);
        } else {
            options += "-";
        }
        options += comma;
        if (cancelType >= 0 && cancelType < choices.length) {
            options += "#" + (cancelType + 1);
        } else {
            options += "-";
        }
        text += optionText(options);
        return text;
    }

    // When **
    function commandParamText402(params) {
        var text = "";
        var text1 = qsTr("When ", "When ** (before the text)");
        var text2 = qsTr(" ", "When ** (after the text)");
        if (text1 !== " ") {
            text += text1;
        }
        text += colorChangeText("navy");
        text += returnYamlIfExists(params[1])
        text += colorChangeText("indigo");
        text += text2;
        return text;
    }

    // Input Number
    function commandParamText103(params) {
        var text = DataManager.variableNameOrId(params[0]);
        text += comma + params[1];
        text += params[1] > 1 ? qsTr(" digits") : qsTr(" digit")
        return text;
    }

    // Select Item
    function commandParamText104(params) {
        var text = DataManager.variableNameOrId(params[0]);
        var itype = params[1] ? params[1] : 2;
        text += comma + Constants.itemTypeArray[itype - 1];
        return text;
    }

    // Show Scrolling Text
    function commandParamText105(params) {
        var text = colorChangeText("gray");
        text += qsTr("Speed") + " " + params[0];
        if (params[1]) {
            text += comma + qsTr("No Fast Forward");
        }
        return text;
    }

    // Show Scrolling Text (Data)
    function commandParamText405(params) {
        return colorChangeText("navy") + params[0];
    }

    // Comment
    function commandParamText108(params) {
        return params[0];
    }

    // Comment (Line 2~)
    function commandParamText408(params) {
        return params[0];
    }

    // Conditional Branch
    function commandParamText111(params) {
        var text = "";
        var tmp = "";
        switch (params[0]) {
        case 0:
            tmp = DataManager.switchNameOrId(params[1]);
            text += qsTr("%1 is %2").arg(tmp).arg(Constants.flagOnOff(params[2]));
            break;
        case 1:
            text += DataManager.variableNameOrId(params[1]);
            text += " " + Constants.variableConditionOperator(params[4]) + " ";
            if (params[2] === 0) {
                text += params[3];
            } else {
                text += DataManager.variableNameOrId(params[3]);
            }
            break;
        case 2:
            tmp += qsTr("Self Switch") + " " + params[1];
            text += qsTr("%1 is %2").arg(tmp).arg(Constants.flagOnOff(params[2]));
            break;
        case 3:
            text += qsTr("Timer");
            text += " " + Constants.timerConditionOperator(params[2]) + " ";
            text += timerText(params[1]);
            break;
        case 4:
            var actor = DataManager.actorNameOrId(params[1]);
            switch (params[2]) {
            case 0:
                text += qsTr("%1 is in the party").arg(actor);
                break;
            case 1:
                text += qsTr("Name of %1 is %2").arg(actor).arg(params[3]);
                break;
            case 2:
                tmp = DataManager.classNameOrId(params[3]);
                text += qsTr("Class of %1 is %2").arg(actor).arg(tmp);
                break;
            case 3:
                tmp = DataManager.skillNameOrId(params[3]);
                text += qsTr("%1 has learned %2").arg(actor).arg(tmp);
                break;
            case 4:
                tmp = DataManager.weaponNameOrId(params[3]);
                text += qsTr("%1 has equipped %2").arg(actor).arg(tmp);
                break;
            case 5:
                tmp = DataManager.armorNameOrId(params[3]);
                text += qsTr("%1 has equipped %2").arg(actor).arg(tmp);
                break;
            case 6:
                tmp = DataManager.stateNameOrId(params[3]);
                text += qsTr("%1 is affected by %2").arg(actor).arg(tmp);
                break;
            }
            break;
        case 5:
            var enemy = troopMemberNameEx(params[1]);
            switch (params[2]) {
            case 0:
                text += qsTr("%1 is appeared").arg(enemy);
                break;
            case 1:
                tmp = DataManager.stateNameOrId(params[3]);
                text += qsTr("%1 is affected by %2").arg(enemy).arg(tmp);
                break;
            }
            break;
        case 6:
            tmp = Constants.directionName(params[2]);
            text += qsTr("%1 is facing %2").arg(characterName(params[1])).arg(tmp);
            break;
        case 7:
            text += qsTr("Gold");
            text += " " + Constants.goldConditionOperator(params[2]) + " ";
            text += params[1];
            break;
        case 8:
            text += qsTr("Party has %1").arg(DataManager.itemNameOrId(params[1]));
            break;
        case 9:
            text += qsTr("Party has %1").arg(DataManager.weaponNameOrId(params[1]));
            if (params[2]) {
                text += optionText(Constants.includeEquipmentText);
            }
            break;
        case 10:
            text += qsTr("Party has %1").arg(DataManager.armorNameOrId(params[1]));
            if (params[2]) {
                text += optionText(Constants.includeEquipmentText);
            }
            break;
        case 11:
            tmp = Constants.buttonNameText(params[1]);
            text += qsTr("Button [%1] is pressed down").arg(tmp);
            break;
        case 12:
            text += qsTr("Script") + colon + params[1];
            break;
        case 13:
            text += qsTr("%1 is driven", "Vehicle").arg(Constants.vehicleName(params[1]));
            break;
        // [OneMaker MV] - Case 14 Added, Self Variables
        case 14:
            text += qsTr("Self Variable") + " #" + params[1] + " " + OneMakerMVSettings.getSetting("selfVariableNaming", "namingScheme")[params[1]] + " ";
            text += Constants.variableConditionOperator(params[4]) + " ";
            if (params[2] === 0) {
                text += params[3]
            }
            // [OneMaker MV] - Removed because there is code for checking if a Self Variable is the same as another Self Variable in rpg_objects.js but for consistency with condition variables I'm going to disallow that.
            //else if (params[2] === 1) {
            //    text += qsTr("Self Variable") + " " + params[3];
            //}
            else {
                text += DataManager.variableNameOrId(params[3]);
            }
            break;
        }
        return text;
    }

    // [OneMaker MV] - Switch Statement
    function commandParamText358(params) {
        var text = "";
        switch (params[1]) {
            case 0: // Variable
                text += "Value of variable: " + DataManager.variableNameOrId(params[2]);
                break;
            case 1: // Self Variable
                text += "Value of self variable: " + OneMakerMVSettings.getSetting("selfVariableNaming", "namingScheme")[params[2]];
                break;
            case 2: // Inventory
                switch (params[2]) {
                    case 0: // Items
                        text += "Amount of " + DataManager.itemNameOrId(params[3])
                        break;
                    case 1: // Weapons
                        text += "Amount of " + DataManager.weaponNameOrId(params[3])
                        break;
                    case 2: // Armors
                        text += "Amount of " + DataManager.armorNameOrId(params[3])
                        break;
                }
                break;
            case 3: // Character Direction
                text += "Direction of " + characterName(params[2])
                break;
            case 4: // Script
                text += params[2];
                break;
        }
        return text;
    }

    // [OneMaker MV] - Case
    function commandParamText658(params) {
        var text = "";
        var text1 = qsTr("Case ", "Case ** (before the text)");
        var text2 = qsTr(" ", "Case ** (after the text)");
        if (typeof params[1] === "undefined") {
            text += "Default";
        }
        else if (text1 !== " ") {
            text += text1;
            text += params[1];
        }
        text += text2;

        return text;
    }

    // Common Event
    function commandParamText117(params) {
        return DataManager.commonEventNameOrId(params[0]);
    }

    // Label
    function commandParamText118(params) {
        return params[0];
    }

    // Jump to Label
    function commandParamText119(params) {
        return params[0];
    }

    // Control Switches
    function commandParamText121(params) {
        var text = switchRange(params[0], params[1]);
        text += " = " + Constants.flagOnOff(params[2]);
        return text;
    }

    // Control Variables
    function commandParamText122(params) {
        var text = variableRange(params[0], params[1]);
        text += [" = ", " += ", " -= ", " *= ", " /= ", " %= "][params[2]];
        switch (params[3]) {
        case 0:
            text += params[4];
            break;
        case 1:
            text += DataManager.variableNameOrId(params[4]);
            break;
        case 2:
            text += qsTr("Random", "Random Number") + " ";
            text += params[4] + ".." + params[5];
            break;
        case 3:
            text += gameDataOperand(params[4], params[5], params[6]);
            break;
        case 4:     // Script
            text += params[4];
            break;
        // [OneMaker MV] - Self Variables Added
        case 5:
            text += "#" + params[4] + " " + OneMakerMVSettings.getSetting("selfVariableNaming", "namingScheme")[params[4]]
        }
        return text;
    }

    // Control Self Switches
    function commandParamText123(params) {
        var text = params[0];
        var target = "";
        var id = params[2];

        if(id < 1)
        {
            target = "SELF";
        }
        else
        {
            target = id.toString();
        }
        text += " = " + Constants.flagOnOff(params[1]) + ": " + target;
        return text;
    }

    // [OneMaker MV] - Control Self Variables Added
    function commandParamText357(params) {
        var text = selfVariableRange(params[0], params[1])
        text += [" = ", " += ", " -= ", " *= ", " /= ", " %= "][params[2]];
        switch (params[3]) {
        case 0: // Constant
            text += params[4];
            break;
        case 1: // Variable
            text += DataManager.variableNameOrId(params[4]);
            break;
        case 2: // Random
            text += qsTr("Random", "Random Number") + " ";
            text += params[4] + ".." + params[5];
            break;
        case 3: // Game Data
            text += gameDataOperand(params[4], params[5], params[6]);
            break;
        case 4: // Script
            text += params[4];
            break;
        case 5: // Self Variable
            text += "#" + params[4] + " " + OneMakerMVSettings.getSetting("selfVariableNaming", "namingScheme")[params[4]];
            break;
        }
        return text;
    }

    // Control Timer
    function commandParamText124(params) {
        var text = "";
        if (params[0] === 0) {
            text += qsTr("Start", "Timer") + comma + timerText(params[1]);
        } else {
            text += qsTr("Stop", "Timer");
        }
        return text;
    }

    // Change Gold
    function commandParamText125(params) {
        var text = "";
        text += plusMinus(params[0]) + " ";
        text += constOrVariableParam(params[1], params[2]);
        return text;
    }

    // Change Items
    function commandParamText126(params) {
        var text = "";
        text += DataManager.itemNameOrId(params[0]) + " ";
        text += plusMinus(params[1]) + " ";
        text += constOrVariableParam(params[2], params[3]);
        return text;
    }

    // Change Weapons
    function commandParamText127(params) {
        var text = "";
        text += DataManager.weaponNameOrId(params[0]) + " ";
        text += plusMinus(params[1]) + " ";
        text += constOrVariableParam(params[2], params[3]);
        if (params[1] === 1 && params[4]) {
            text += optionText(Constants.includeEquipmentText);
        }
        return text;
    }

    // Change Armors
    function commandParamText128(params) {
        var text = "";
        text += DataManager.armorNameOrId(params[0]) + " ";
        text += plusMinus(params[1]) + " ";
        text += constOrVariableParam(params[2], params[3]);
        if (params[1] === 1 && params[4]) {
            text += optionText(Constants.includeEquipmentText);
        }
        return text;
    }

    // Change Party Member
    function commandParamText129(params) {
        var text = "";
        var actor = DataManager.actorNameOrId(params[0]);
        if (params[1] === 0) {
            text += qsTr("Add %1", "Add to the party").arg(actor);
            if (params[2]) {
                text += optionText(qsTr("Initialize"));
            }
        } else {
            text += qsTr("Remove %1", "Remove from the party").arg(actor);
        }
        return text;
    }

    // Change Battle BGM
    function commandParamText132(params) {
        return Constants.audioText(params[0]);
    }

    // Change Victory ME
    function commandParamText133(params) {
        return Constants.audioText(params[0]);
    }

    // Change Save Access
    function commandParamText134(params) {
        return disableOrEnable(params[0]);
    }

    // Change Menu Access
    function commandParamText135(params) {
        return disableOrEnable(params[0]);
    }

    // Change Encounter
    function commandParamText136(params) {
        return disableOrEnable(params[0]);
    }

    // Change Formation Access
    function commandParamText137(params) {
        return disableOrEnable(params[0]);
    }

    // Change Window Color
    function commandParamText138(params) {
        var color = params[0];
        return "(%1,%2,%3)".arg(color[0]).arg(color[1]).arg(color[2]);
    }

    // Change Defeat ME
    function commandParamText139(params) {
        return Constants.audioText(params[0]);
    }

    // Change Vehicle BGM
    function commandParamText140(params) {
        var text = Constants.vehicleName(params[0]);
        text += comma + Constants.audioText(params[1]);
        return text;
    }

    // Transfer Player
    function commandParamText201(params) {
        var text = "";
        var fmt = "%1 (%2,%3)";
        if (params[0] === 0) {
            text += fmt.arg(DataManager.mapNameOrId(params[1])).arg(params[2]).arg(params[3]);
        } else {
            text += fmt.arg(variableParam(params[1])).arg(
                        variableParam(params[2])).arg(variableParam(params[3]));
        }
        var flags = "";
        if (params[4] > 0) {
            flags += flags.length ? comma : "";
            flags += qsTr("Direction") + ": " + Constants.directionName(params[4]);
        }
        if (params[5] > 0) {
            flags += flags.length ? comma : "";
            flags += qsTr("Fade") + ": " + Constants.fadeTypeArray[params[5]];
        }
        if (flags.length) {
            text += optionText(flags);
        }
        return text;
    }

    // Set Vehicle Location
    function commandParamText202(params) {
        var text = Constants.vehicleName(params[0]) + comma;
        var fmt = "%1 (%2,%3)";
        if (params[1] === 0) {
            text += fmt.arg(DataManager.mapNameOrId(params[2])).arg(params[3]).arg(params[4]);
        } else {
            text += fmt.arg(variableParam(params[2])).arg(
                        variableParam(params[3])).arg(variableParam(params[4]));
        }
        return text;
    }

    // Set Event Location
    function commandParamText203(params) {
        var text = characterName(params[0]) + comma;
        var fmt = "(%1,%2)";
        if (params[1] === 0) {
            text += fmt.arg(params[2]).arg(params[3]);
        } else if (params[1] === 1) {
            text += fmt.arg(variableParam(params[2])).arg(variableParam(params[3]));
        } else if (params[1] === 2) {
            text += qsTr("Exchange with %1").arg(characterName(params[2]));
        }
        if (params[4] > 0) {
            text += optionText(qsTr("Direction") + ": " + Constants.directionName(params[4]));
        }
        return text;
    }

    // Scroll Map
    function commandParamText204(params) {
        var text = Constants.directionName(params[0]);
        text += comma + params[1];
        text += comma + params[2];
        return text;
    }

    // Set Movement Route
    function commandParamText205(params) {
        var text = "";
        if(params[0] >= 500)
            text = "Follower " + (params[0] - 500);
        else
            text = characterName(params[0]);
        var flags = "";
        if (params[1].repeat) {
            flags += flags.length ? comma : "";
            flags += qsTr("Repeat", "Movement Route");
        }
        if (params[1].skippable) {
            flags += flags.length ? comma : "";
            flags += qsTr("Skip", "Movement Route");
        }
        if (params[1].wait) {
            flags += flags.length ? comma : "";
            flags += wait;
        }
        if (flags.length) {
            text += optionText(flags);
        }
        return text;
    }

    // Set Movement Route (Data)
    function commandParamText505(params) {
        return moveCommandTexts.make(params[0]);
    }

    // Change Transparency
    function commandParamText211(params) {
        return Constants.flagOnOff(params[0]);
    }

    // Change Player Followers
    function commandParamText216(params) {
        return Constants.flagOnOff(params[0]);
    }

    // Show Animation
    function commandParamText212(params) {
        var text = characterName(params[0]);
        text += comma + DataManager.animationNameOrId(params[1]);
        text += params[2] ? optionText(wait) : "";
        return text;
    }

    // Show Balloon Icon
    function commandParamText213(params) {
        var text = characterName(params[0]);
        text += comma + Constants.balloonTypeArray[params[1] - 1];
        text += params[2] ? optionText(wait) : "";
        return text;
    }

    // Tint Screen
    function commandParamText223(params) {
        var text = "";
        var c = params[0];
        text += "(%1,%2,%3,%4)".arg(c[0]).arg(c[1]).arg(c[2]).arg(c[3]);
        text += comma + Constants.framesText(params[1]);
        text += params[2] ? optionText(wait) : "";
        return text;
    }

    // Flash Screen
    function commandParamText224(params) {
        var text = "";
        var c = params[0];
        text += "(%1,%2,%3,%4)".arg(c[0]).arg(c[1]).arg(c[2]).arg(c[3]);
        text += comma + Constants.framesText(params[1]);
        text += params[2] ? optionText(wait) : "";
        return text;
    }

    // Shake Screen
    function commandParamText225(params) {
        var text = "";
        text += "%1, %2".arg(params[0]).arg(params[1]);
        text += comma + Constants.framesText(params[2]);
        text += params[3] ? optionText(wait) : "";
        return text;
    }

    // Wait
    function commandParamText230(params) {
        var text = "";
        text += Constants.framesText(params[0]);
        return text;
    }

    // Show Picture
    function commandParamText231(params) {
        var text = "";
        text += pictureNumberText(params[0]);
        text += comma + Constants.imageText(params[1]);
        text += comma + pictureCommonParamText(params);
        return text;
    }

    // Move Picture
    function commandParamText232(params) {
        var text = "";
        text += pictureNumberText(params[0]);
        text += comma + pictureCommonParamText(params);
        text += comma + Constants.framesText(params[10]);
        text += params[11] ? optionText(wait) : "";
        return text;
    }

    // Rotate Picture
    function commandParamText233(params) {
        var text = "";
        text += pictureNumberText(params[0]);
        text += comma + params[1];
        return text;
    }

    // Tint Picture
    function commandParamText234(params) {
        var text = "";
        var c = params[1];
        text += pictureNumberText(params[0]);
        text += comma;
        text += "(%1,%2,%3,%4)".arg(c[0]).arg(c[1]).arg(c[2]).arg(c[3]);
        text += comma + Constants.framesText(params[2]);
        text += params[3] ? optionText(wait) : "";
        return text;
    }

    // Erase Picture
    function commandParamText235(params) {
        return pictureNumberText(params[0]);
    }

    // Set Weather Effect
    function commandParamText236(params) {
        var text = Constants.weatherNameText(params[0]);
        text += params[0] !== "none" ? (comma + params[1]) : "";
        text += comma + Constants.framesText(params[2]);
        text += params[3] ? optionText(wait) : "";
        return text;
    }

    // Play BGM
    function commandParamText241(params) {
        return Constants.audioText(params[0]);
    }

    // Fadeout BGM
    function commandParamText242(params) {
        return Constants.secondsText(params[0]);
    }

    // Play BGS
    function commandParamText245(params) {
        return Constants.audioText(params[0]);
    }

    // Fadeout BGS
    function commandParamText246(params) {
        return Constants.secondsText(params[0]);
    }

    // Play ME
    function commandParamText249(params) {
        return Constants.audioText(params[0]);
    }

    // Play SE
    function commandParamText250(params) {
        return Constants.audioText(params[0]);
    }

    // Play Movie
    function commandParamText261(params) {
        return Constants.movieText(params[0]);
    }

    // Change Map Name Display
    function commandParamText281(params) {
        return Constants.flagOnOff(params[0]);
    }

    // Change Tileset
    function commandParamText282(params) {
        return DataManager.tilesetNameOrId(params[0]);
    }

    // Change Battle Back
    function commandParamText283(params) {
        return Constants.dualImageText(params[0], params[1]);
    }

    // Change Parallax
    function commandParamText284(params) {
        var text = Constants.imageText(params[0]);
        var flags = "";
        if (params[1]) {
            flags += flags.length ? comma : "";
            flags += Constants.loopHorizontally;
        }
        if (params[2]) {
            flags += flags.length ? comma : "";
            flags += Constants.loopVertically;
        }
        if (flags.length) {
            text += optionText(flags);
        }
        return text;
    }

    // Get Location Info
    function commandParamText285(params) {
        var x = constOrVariableParam(params[2], params[3]);
        var y = constOrVariableParam(params[2], params[4]);
        var text = DataManager.variableNameOrId(params[0]);
        text += comma + Constants.locationInfoTypeArray[params[1]];
        text += comma + "(%1,%2)".arg(x).arg(y);
        return text;
    }

    // Battle Processing
    function commandParamText301(params) {
        var text = "";
        switch (params[0]) {
        case 0:
            text += DataManager.troopNameOrId(params[1]);
            break;
        case 1:
            text += variableParam(params[1]);
            break;
        case 2:
            text += qsTr("Same as Random Encounter");
            break;
        }
        return text;
    }

    // Shop Processing
    function commandParamText302(params) {
        return commandParamText605(params);
    }

    // Shop Processing (Line 2~)
    function commandParamText605(params) {
        var text = "";
        switch (params[0]) {
        case 0:
            text += DataManager.itemNameOrId(params[1]);
            break;
        case 1:
            text += DataManager.weaponNameOrId(params[1]);
            break;
        case 2:
            text += DataManager.armorNameOrId(params[1]);
            break;
        }
        return text;
    }

    // Name Input Processing
    function commandParamText303(params) {
        var text = DataManager.actorNameOrId(params[0]);
        text += comma + params[1];
        text += (params[1] > 1 ? qsTr(" characters", "Text string count")
                               : qsTr(" character", "Text string count"))
        return text;
    }

    // Change HP
    function commandParamText311(params) {
        var text = actorNameEx(params[0], params[1]);
        text += comma + plusMinus(params[2]) + " ";
        text += constOrVariableParam(params[3], params[4]);
        if (params[2] === 1 && params[5]) {
            text += optionText(Constants.allowKnockoutText);
        }
        return text;
    }

    // Change MP
    function commandParamText312(params) {
        var text = actorNameEx(params[0], params[1]);
        text += comma + plusMinus(params[2]) + " ";
        text += constOrVariableParam(params[3], params[4]);
        return text;
    }

    // Change TP
    function commandParamText326(params) {
        var text = actorNameEx(params[0], params[1]);
        text += comma + plusMinus(params[2]) + " ";
        text += constOrVariableParam(params[3], params[4]);
        return text;
    }

    // Change State
    function commandParamText313(params) {
        var text = actorNameEx(params[0], params[1]);
        text += comma + plusMinus(params[2]) + " ";
        text += DataManager.stateNameOrId(params[3]);
        return text;
    }

    // Recover All
    function commandParamText314(params) {
        var text = actorNameEx(params[0], params[1]);
        return text;
    }

    // Change EXP
    function commandParamText315(params) {
        var text = actorNameEx(params[0], params[1]);
        text += comma + plusMinus(params[2]) + " ";
        text += constOrVariableParam(params[3], params[4]);
        if (params[2] === 0 && params[5]) {
            text += optionText(Constants.showLevelUpText);
        }
        return text;
    }

    // Change Level
    function commandParamText316(params) {
        var text = actorNameEx(params[0], params[1]);
        text += comma + plusMinus(params[2]) + " ";
        text += constOrVariableParam(params[3], params[4]);
        if (params[2] === 0 && params[5]) {
            text += optionText(Constants.showLevelUpText);
        }
        return text;
    }

    // Change Parameter
    function commandParamText317(params) {
        var text = actorNameEx(params[0], params[1]);
        text += comma + Constants.paramName(params[2]);
        text += " " + plusMinus(params[3]) + " ";
        text += constOrVariableParam(params[4], params[5]);
        return text;
    }

    // Change Skill
    function commandParamText318(params) {
        var text = actorNameEx(params[0], params[1]);
        text += comma + plusMinus(params[2]) + " ";
        text += DataManager.skillNameOrId(params[3]);
        return text;
    }

    // Change Equipment
    function commandParamText319(params) {
        var text = DataManager.actorNameOrId(params[0]);
        var dual = DataManager.isDualWield(params[0]);
        var etype = params[1];
        if (dual && etype === 2) {
            etype = 1;
        }
        text += comma + DataManager.equipTypeName(etype);
        text += " = ";
        if (params[2] === 0) {
            text += qsTr("None");
        } else if (etype <= 1) {
            text += DataManager.weaponNameOrId(params[2]);
        } else {
            text += DataManager.armorNameOrId(params[2]);
        }
        return text;
    }

    // Change Name
    function commandParamText320(params) {
        var text = DataManager.actorNameOrId(params[0]);
        text += comma + params[1];
        return text;
    }

    // Change Class
    function commandParamText321(params) {
        var text = DataManager.actorNameOrId(params[0]);
        text += comma + DataManager.classNameOrId(params[1]);
        text += comma + params[2];
        return text;
    }

    // Change Nickname
    function commandParamText324(params) {
        var text = DataManager.actorNameOrId(params[0]);
        text += comma + params[1];
        return text;
    }

    // Change Profile
    function commandParamText325(params) {
        var text = DataManager.actorNameOrId(params[0]);
        text += comma + params[1].replace(/\n/, ' ');
        return text;
    }

    // Change Actor Images
    function commandParamText322(params) {
        var text = DataManager.actorNameOrId(params[0]);
        text += comma + Constants.imageText(params[3], params[4]);
        text += comma + Constants.imageText(params[1], params[2]);
        text += comma + Constants.imageText(params[5]);
        return text;
    }

    // Change Vehicle Image
    function commandParamText323(params) {
        var text = Constants.vehicleName(params[0]);
        text += comma + Constants.imageText(params[1], params[2]);
        return text;
    }

    // Change Enemy HP
    function commandParamText331(params) {
        var text = troopMemberNameEx(params[0]);
        text += comma + plusMinus(params[1]) + " ";
        text += constOrVariableParam(params[2], params[3]);
        if (params[1] === 1 && params[4]) {
            text += optionText(Constants.allowKnockoutText);
        }
        return text;
    }

    // Change Enemy MP
    function commandParamText332(params) {
        var text = troopMemberNameEx(params[0]);
        text += comma + plusMinus(params[1]) + " ";
        text += constOrVariableParam(params[2], params[3]);
        return text;
    }

    // Change Enemy TP
    function commandParamText342(params) {
        var text = troopMemberNameEx(params[0]);
        text += comma + plusMinus(params[1]) + " ";
        text += constOrVariableParam(params[2], params[3]);
        return text;
    }

    // Change Enemy State
    function commandParamText333(params) {
        var text = troopMemberNameEx(params[0]);
        text += comma + plusMinus(params[1]) + " ";
        text += DataManager.stateNameOrId(params[2]);
        return text;
    }

    // Enemy Recover All
    function commandParamText334(params) {
        var text = troopMemberNameEx(params[0]);
        return text;
    }

    // Enemy Appear
    function commandParamText335(params) {
        var text = troopMemberNameEx(params[0]);
        return text;
    }

    // Enemy Transform
    function commandParamText336(params) {
        var text = troopMemberNameEx(params[0]);
        text += comma + DataManager.enemyNameOrId(params[1]);
        return text;
    }

    // Show Battle Animation
    function commandParamText337(params) {
        var text = troopMemberNameEx(params[0]);
        if (!!params[2])
            text = qsTr("Entire Troop");
        text += comma + DataManager.animationNameOrId(params[1]);
        return text;
    }

    // Force Action
    function commandParamText339(params) {
        var text = "";
        if (params[0] === 0) {
            text += troopMemberNameEx(params[1]);
        } else {
            text += DataManager.actorNameOrId(params[1]);
        }
        text += comma + DataManager.skillNameOrId(params[2]);
        text += comma + Constants.actionTargetName(params[3]);
        return text;
    }

    // Script
    function commandParamText355(params) {
        return colorChangeText("slategray") + params[0];
    }

    // Script (Line 2~)
    function commandParamText655(params) {
        return colorChangeText("slategray") + params[0];
    }

    // Plugin Command
    function commandParamText356(params) {
        return returnYamlIfExists(params[0])
    }

    function extractAtlasNames(fileName, key) {
        var tempData = {};

        
        var fileContent = TkoolAPI.readFile(DataManager.projectUrl + "languages/en" + "/" + fileName + ".yaml");

        

        var lines = fileContent.split("\n")
                        .map(function(ln) { return ln.trim() })
                        .filter(function(ln) { return ln.length > 0 && !isExcluded(ln) })

        
        var currentAtlas = "";
        var accumulatingText = "";

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            var shouldIgnoreLine = false;
            
            if (currentAtlas !== "" && line.indexOf("text:") === 0) {
                var textValue = line.substring(line.indexOf(":") + 1).trim();
                accumulatingText += textValue;
                tempData[currentAtlas] = textValue;
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
            }

            if (line.length == 0) {
                currentAtlas = "";
            }
        }

        return tempData; //= tempData;

        //return atlasData[fileName][key];
    }

    function isExcluded(thing) {
        if (thing.indexOf('#') === 0) {
            return true
        }
        return YamlIdentifiers.ignoreIdentifiers.some(function(id) {
            return thing.indexOf(id) === 0
        })
    }

    function returnYamlIfExists(text) {
        var split = text.split(" ");
        if(split[0] == "ShowMessage")
        {
            
            var fileName = split[1].split(".")[0]

            if(atlasData[fileName] == undefined)
            {
                atlasData[fileName] = DataManager.parse(fileName);
            }

            var key = split[1].split(".")[1]

            var text = "";
            if(atlasData[fileName][key]["text"])
                text = atlasData[fileName][key]["text"];
            else
                text =  atlasData[fileName][key];
            if(text) {
                return colorChangeText("dodgerblue") + text;
            }
            else {
                return colorChangeText("navy") + text + "FAILED TO LOAD";
            }
        } else
        {
            return colorChangeText("navy") + text;
        }
    }

    // [OneMaker MV] - Sound Manager
    function commandParamText1002(params) {
        var text;
        switch (params[0]) {
            // Bgm
            case 0:
                text = "BGM - ";
                switch (params[1]) {
                    // Stop Sound
                    case 0:
                        text += "Stop Sound";
                        break;
                    // Save Bgm
                    case 1:
                        text += "Save to slot: " + params[2];
                        break;
                    // Replay Bgm
                    case 2:
                        text += "Replay from slot: " + params[2];
                        break;
                    // Fade Out Bgm
                    case 3:
                        text += "Fade Out over " + params[2] + " seconds";
                        break;
                    // Play Bgm
                    case 4:
                        var endText = "";
                        if (!params[3]) {
                            text += "Play ";
                        }
                        // Fade Out
                        else {
                            text += "Fade In ";
                            endText = " over " + params[3] + " seconds";
                        }
                        text += Constants.audioText(params[2]) + endText;
                        break;
                }
                break;
            // Bgs
            case 1:
                text = "BGS - ";
                switch (params[1]) {
                    // Stop Sound
                    case 0:
                        text += "Stop Sound";
                        break;
                    // Save Bgs
                    case 1:
                        text += "Save to slot: " + params[2];
                        break;
                    // Replay Bgs
                    case 2:
                        text += "Replay from slot: " + params[2];
                        break;
                    // Fade Out Bgs
                    case 3:
                        text += "Fade Out over " + params[2] + " seconds";
                        break;
                    // Play Bgs
                    case 4:
                        var endText = "";
                        if (!params[3]) {
                            text += "Play ";
                        }
                        // Fade Out
                        else {
                            text += "Fade In ";
                            endText = " over " + params[3] + " seconds";
                        }
                        text += Constants.audioText(params[2]) + endText;
                        break;
                }
                break;
            // Me
            case 2:
                text = "ME - ";
                switch (params[1]) {
                    // Stop Sound
                    case 0:
                        text += "Stop Sound";
                        break;
                    // Play Me
                    case 1:
                        text += "Play " + Constants.audioText(params[2]);
                        break;
                }
                break;
            // Se
            case 3:
                text = "SE - ";
                switch (params[1]) {
                    // Stop Sound
                    case 0:
                        text += "Stop Sound";
                        break;
                    // Play Se
                    case 1:
                        text += "Play " + Constants.audioText(params[2]);
                        break;
                }
                break;
        }

        return text;
    }

    // [OneMaker MV] - Transfer Player Script
    function commandParamText1003(params) {
        
    }


    function commandParamText1005(params) {
        return colorChangeText("navy") + "Followers to Events";
    }

    function commandParamText1006(params) {
        return colorChangeText("navy") + "Events to Followers";
    }

}

    // YAML STUFF
    
