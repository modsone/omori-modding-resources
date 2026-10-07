import QtQuick 2.3
import QtQuick.Controls 1.2
import "../BasicControls"
import "../BasicLayouts"
import "../Singletons"

LabeledComboBox {
    id: root

    property var object: dataObject

    property bool includePlayer: true
    property bool includeThisEvent: true

    //property var FollowerBase: 500

    readonly property var currentItem: model.get(currentIndex)
    readonly property int currentId: currentItem ? currentItem.value : -1

    signal modified()

    fontFamily: pal.fixedFont

    Palette { id: pal }

    model: ListModel {
        id: listModel
    }

    DialogBoxHelper { id: helper }

    Component.onCompleted: {
        refresh();
    }

    function setCurrentId(id) {
        for (var i = 0; i < model.count; i++) {
            if (model.get(i).value === id) {
                currentIndex = i;
                return;
            }
        }
        currentIndex = 0;
    }

    function refresh() {
        listModel.clear();
        if (includePlayer) {
            listModel.append({ value: -1, text: Constants.playerName });
        }
        if (includeThisEvent) {
            listModel.append({ value: 0, text: Constants.thisEventName });
        }


        // 3 followers, change to anything if you want more.
        for (var i = 0; i < 3; i++) {
            
            listModel.append({ value: 500 + i, text: "Follower " + i});
        }




        appendMapEventCharacters();
    }

    function appendMapEventCharacters() {
        var map = DataManager.getCurrentMap();
        if (map) {
            for (var i = 0; i < map.events.length; i++) {
                var event = map.events[i];
                if (event) {
                    listModel.append({ value: i, text: event.name });
                }
            }
        }
    }
}
