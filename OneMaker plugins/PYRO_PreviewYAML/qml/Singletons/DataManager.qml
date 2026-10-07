pragma Singleton
import QtQuick 2.3
import Tkool.rpg 1.0
import "."

QtObject {
    property bool projectOpened : false
    property string projectUrl : ""
    property string gameTitle   : ""

    readonly property var actors        : _database.actors
    readonly property var classes       : _database.classes
    readonly property var skills        : _database.skills
    readonly property var items         : _database.items
    readonly property var weapons       : _database.weapons
    readonly property var armors        : _database.armors
    readonly property var enemies       : _database.enemies
    readonly property var troops        : _database.troops
    readonly property var states        : _database.states
    readonly property var animations    : _database.animations
    readonly property var tilesets      : _database.tilesets
    readonly property var commonEvents  : _database.commonEvents
    readonly property var system        : _database.system
    readonly property var mapInfos      : _database.mapInfos

    readonly property bool sideView     : !!(system && system.optSideView)
    readonly property var enemiesFolder : sideView ? "sv_enemies" : "enemies"

    property var maps               : ({})
    property var mapModified        : ({})
    property var tileNameTexts      : ({})
    property int currentMapId       : 0
    property bool databaseModified  : false
    property string errorFileName   : ""

    property var plugins            : ([])
    property var pluginsBackup      : ([])
    property bool pluginsModified   : false
    property string lastPluginName  : ""

    property var databaseLastIndex  : ({})
    property var databaseLastScroll : ({})
    property int lastEventCode      : 101
    property int lastSwitchId       : 1
    property int lastVariableId     : 1
    property int lastIconSetId      : 0

    property var _database          : ({})
    property var _databaseBackup    : ({})

    property var _databaseFiles : [
        { name: "actors",       src: "Actors.json"       },
        { name: "classes",      src: "Classes.json"      },
        { name: "skills",       src: "Skills.json"       },
        { name: "items",        src: "Items.json"        },
        { name: "weapons",      src: "Weapons.json"      },
        { name: "armors",       src: "Armors.json"       },
        { name: "enemies",      src: "Enemies.json"      },
        { name: "troops",       src: "Troops.json"       },
        { name: "states",       src: "States.json"       },
        { name: "animations",   src: "Animations.json"   },
        { name: "tilesets",     src: "Tilesets.json"     },
        { name: "commonEvents", src: "CommonEvents.json" },
        { name: "system",       src: "System.json"       },
        { name: "mapInfos",     src: "MapInfos.json"     }
    ]

    property string _testPrefix     : "Test_"
    property string _testEventSrc   : _testPrefix + "Event.json"

    function loadDatabase() {
        clearAll();
        currentMapId = 0;
        for (var i = 0; i < _databaseFiles.length; i++) {
            var name = _databaseFiles[i].name;
            var src = _databaseFiles[i].src;
            var data = loadDataFile(src);
            if (!data) {
                return false;
            }
            _database[name] = data;
        }
        _database = _database;
        backupDatabase();
        return true;
    }

    function loadAllMaps() {
        for (var i = 0; i < mapInfos.length; i++) {
            if (mapInfos[i] && !maps[i]) {
                if (!loadMap(i)) {
                    return false;
                }
            }
        }
        return true
    }

    function loadMap(mapId) {
        var data = loadDataFile(makeMapFileName(mapId));
        maps[mapId] = data;
        mapModified[mapId] = false;
        return !!data;
    }

    function loadSampleMap(sampleMapId) {
        var name = "Map" + ("000" + sampleMapId).slice(-3) + ".json";
        var path = ":/maps/" + name;
        try {
            var json = TkoolAPI.readResource(path);
            if (json) {
                return JSON.parse(json);
            } else {
                return null;
            }
        } catch (e) {
            console.warn(e);
            return null;
        }
    }

    function loadPlugins() {
        var fileName = "plugins.js";
        var url = projectUrl + "js/" + fileName;
        try {
            var script = TkoolAPI.readFile(url);
            var lines = script.split(/\r\n|\r|\n/g)
            var json = "";
            for (var i = 0; i < lines.length; i++) {
                var s = lines[i];
                if (s === '];') {
                    s = ']';
                }
                if (!s.match(/^(\/\/|var)/)) {
                    json += s;
                }
            }
            if (json) {
                plugins = JSON.parse(json);
            } else {
                errorFileName = fileName;
                return false;
            }
        } catch (e) {
            console.warn(e);
            errorFileName = fileName;
            return false;
        }
        return true;
    }

    function loadTileNameTexts(tilesetNames) {
        for (var i = 0; i < tilesetNames.length; i++) {
            var name = tilesetNames[i];
            if (name && tileNameTexts[name] === undefined) {
                var url = projectUrl + "img/tilesets/" + name + ".txt";
                var contents = TkoolAPI.readFile(url);
                tileNameTexts[name] = contents.split(/\r\n|\r|\n/g);
            }
        }
    }

    function saveDatabase(test) {
        var prefix = test ? _testPrefix : "";
        for (var i = 0; i < _databaseFiles.length; i++) {
            var name = _databaseFiles[i].name;
            var src = _databaseFiles[i].src;
            var data = _database[name];
            if (!saveDataFile(prefix + src, data)) {
                return false;
            }
        }
        if (!test) {
            databaseModified = false;
            backupDatabase();
        }
        return true;
    }

    function saveTestData() {
        return saveDatabase(true);
    }

    function removeTestData() {
        for (var i = 0; i < _databaseFiles.length; i++) {
            removeDataFile(_testPrefix + _databaseFiles[i].src);
        }
    }

    function saveTestEvent(data) {
        saveDataFile(_testEventSrc, data);
    }

    function removeTestEvent() {
        removeDataFile(_testEventSrc);
    }

    function saveMap(mapId) {
        var fileName = makeMapFileName(mapId);
        var data = maps[mapId];
        if (data) {
            if (saveDataFile(fileName, data)) {
                mapModified[mapId] = false;
                return true;
            }
            return false;
        } else {
            removeDataFile(fileName);
            mapModified[mapId] = false;
            return true;
        }
    }

    function savePlugins() {
        var fileName = "plugins.js";
        var url = projectUrl + "js/" + fileName;
        try {
            var json = stringifyEx(plugins);
            var script = "";
            script += "// Generated by RPG Maker.\n"
            script += "// Do not edit this file directly.\n";
            script += "var $plugins =\n"
            script += json;
            script += ";\n";
            if (!TkoolAPI.writeFile(url, script)) {
                errorFileName = fileName;
                return false;
            }
        } catch (e) {
            console.warn(e);
            errorFileName = fileName;
            return false;
        }
        pluginsModified = false;
        return true;
    }

    function updateDatabaseSystemValueInstant(member, value) {
        var src = null;
        var data = null;
        for (var i = 0; i < _databaseFiles.length; i++) {
            if (_databaseFiles[i].name == "system") {
                src = _databaseFiles[i].src;
                data = loadDataFile(src);
                break;
            }
        }
        if (data == null) {
            return false;
        }
        if(!setObjectValue(data, member, value)){
            return false;
        }
        if (!setSystemValue(member, value)) {
            return false;
        }
        if (!saveDataFile(src, data)) {
            return false;
        }
        return true;
    }

    function isAnyModified() {
        if (databaseModified) {
            return true;
        }
        if (pluginsModified) {
            return true;
        }
        for (var mapId in mapModified) {
            if (mapModified[mapId]) {
                return true;
            }
        }
        return false;
    }

    function saveAll() {
        if (!saveDatabase(false)) {
            return false;
        }
        if (!savePlugins()) {
            return false;
        }
        for (var mapId in mapModified) {
            if (mapModified[mapId]) {
                if (!saveMap(mapId)) {
                    return false;
                }
            }
        }
        return true;
    }

    function clearAll() {
        maps = {};
        mapModified = {};
        tileNameTexts = {};
        currentMapId = 0;
        databaseModified = false;
        errorFileName = "";
        plugins = {};
        pluginsBackup = {};
        pluginsModified = false;
        databaseLastScroll = {};
        databaseLastIndex = {};
        lastSwitchId = 1;
        lastVariableId = 1;
        _database = {};
        _databaseBackup = {};
        _database = _database;
    }

    function createBlankDatabase() {
        for (var i = 0; i < _databaseFiles.length; i++) {
            var name = _databaseFiles[i].name;
            _database[name] = [null];
        }
        _database.system = {};
        _database.mapInfos = {};
        _database = _database;
    }

    function loadDataFile(fileName) {
        var url = makeDataFileUrl(fileName);
        try {
            var json = TkoolAPI.readFile(url);
            if (json) {
                return JSON.parse(json);
            } else {
                errorFileName = fileName;
                return null;
            }
        } catch (e) {
            console.warn(e);
            errorFileName = fileName;
            return null;
        }
    }

    function saveDataFile(fileName, data) {
        var url = makeDataFileUrl(fileName);
        try {
            var json = stringifyEx(data);
            if (!TkoolAPI.writeFile(url, json)) {
                errorFileName = fileName;
                return false;
            }
        } catch (e) {
            console.warn(e);
            errorFileName = fileName;
            return false;
        }
        return true;
    }

    function stringifyEx(data) {
        if (data instanceof Array) {
            return stringifyDatabase(data);
        } else if (data.data && data.events) {
            return stringifyMap(data);
        } else {
            return JSON.stringify(data);
        }
    }

    function stringifyDatabase(data) {
        var json = "[\n";
        for (var i = 0; i < data.length; i++) {
            if (data[i]) {
                if (data[i].id !== undefined) {
                    data[i].id = i;
                }
            } else {
                data[i] = null;
            }
            json += JSON.stringify(data[i]);
            if (i < data.length - 1) {
                json += ",";
            }
            json += "\n";
        }
        json += "]";
        return json;
    }

    function sortObjectKeys(data) {
        if (data) {
            var data2 = {};
            var keys = [];
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
            keys.sort();
            data2.id = data.id;
            for (var i = 0; i < keys.length; i++) {
                key = keys[i];
                data2[key] = data[key];
            }
            return data2;
        }
        return data;
    }

    function stringifyMap(data) {
        var json;
        var mapData = data.data;
        var events = data.events;
        delete data.data;
        delete data.events;
        json = JSON.stringify(data);
        data.data = mapData;
        data.events = events;
        if (json[0] !== "{") {
            throw new Error("stringifyMap: unexpected format");
        }
        json = "{\n" + json.slice(1, json.length - 1);
        json += ",\n";
        json += "\"data\":" + JSON.stringify(mapData);
        json += ",\n";
        json += "\"events\":" + stringifyDatabase(events);
        json += "\n}";
        return json;
    }

    function removeDataFile(fileName) {
        var url = makeDataFileUrl(fileName);
        return TkoolAPI.removeFile(url);
    }

    function makeMapFileName(mapId) {
        return "Map" + ("000" + mapId).slice(-3) + ".json";
    }

    function makeDataFileUrl(fileName) {
        return projectUrl + "data/" + fileName;
    }

    function getCurrentMap() {
        return maps[currentMapId];
    }

    function backupDatabase() {
        _databaseBackup = clone(_database);
    }

    function restoreDatabase() {
        var mapInfos = _database.mapInfos;
        var system   = _database.system;

        _database = clone(_databaseBackup);

        _database.mapInfos                  = mapInfos;
        _database.system.variables          = system.variables;
        _database.system.switches           = system.switches;
        _database.system.startMapId         = system.startMapId;
        _database.system.startX             = system.startX;
        _database.system.startY             = system.startY;
        _database.system.boat.startMapId    = system.boat.startMapId;
        _database.system.boat.startX        = system.boat.startX;
        _database.system.boat.startY        = system.boat.startY;
        _database.system.ship.startMapId    = system.ship.startMapId;
        _database.system.ship.startX        = system.ship.startX;
        _database.system.ship.startY        = system.ship.startY;
        _database.system.airship.startMapId = system.airship.startMapId;
        _database.system.airship.startX     = system.airship.startX;
        _database.system.airship.startY     = system.airship.startY;

        _database = _database;
    }

    function backupPlugins() {
        pluginsBackup = clone(plugins);
    }

    function restorePlugins() {
        plugins = clone(pluginsBackup);
    }

    function clone(data) {
        return data ? JSON.parse(JSON.stringify(data)) : data;
    }

    function getDataSet(dataSetName) {
        return _database[dataSetName];
    }

    function setDataSet(dataSetName, dataSet) {
        _database[dataSetName] = dataSet;
        _database = _database;
    }

    function clearDataSet(dataSetName) {
        setDataSet(dataSetName, []);
    }

    function getDataObject(dataSetName, id) {
        var dataSet = _database[dataSetName];
        return dataSet ? dataSet[id] : null;
    }

    function getObjectValue(object, member, defaultValue) {
        if (object && member.length) {
            var names = member.split(".");
            var temp = object;
            while (names.length > 1) {
                temp = temp[names.shift()];
            }
            if (temp && names.length > 0 && temp[names[0]] !== undefined) {
                return temp[names[0]];
            } else {
                return defaultValue;
            }
        } else {
            return defaultValue;
        }
    }

    function setObjectValue(object, member, value) {
        if (object && member.length) {
            var names = member.split(".");
            var temp = object;
            while (names.length > 1) {
                var name = names.shift();
                if (temp[name] === undefined) {
                    var nextName = names[0];
                    if (nextName.match(/[0-9]+/)) {
                        temp[name] = [];
                    } else {
                        temp[name] = {};
                    }
                }
                temp = temp[name];
            }
            if (temp && names.length > 0) {
                var lastName = names.shift();
                var oldValue = temp[lastName];
                temp[lastName] = value;
                return value !== oldValue;
            }
        }
        return false;
    }

    function getSystemValue(member, defaultValue) {
        return getObjectValue(system, member, defaultValue);
    }

    function setSystemValue(member, value) {
        return setObjectValue(system, member, value);
    }

    function updateGameTitle() {
        gameTitle = getSystemValue("gameTitle", "");
    }

    function updateSideViewFlag() {
        _database = _database;
    }

    function makeIdText(id, numDigits) {
        if (("" + id).length >= numDigits)
            return ("" + id);

        return ("0000" + id).slice(-numDigits);
    }

    function isString(text) {
        return typeof text === "string";
    }

    function actorName(id) {
        var object = actors[id];
        return object ? object.name : Constants.invalidDataName;
    }

    function className(id) {
        var object = classes[id];
        return object ? object.name : Constants.invalidDataName;
    }

    function skillName(id) {
        var object = skills[id];
        return object ? object.name : Constants.invalidDataName;
    }

    function itemName(id) {
        var object = items[id];
        return object ? object.name : Constants.invalidDataName;
    }

    function weaponName(id) {
        var object = weapons[id];
        return object ? object.name : Constants.invalidDataName;
    }

    function armorName(id) {
        var object = armors[id];
        return object ? object.name : Constants.invalidDataName;
    }

    function enemyName(id) {
        var object = enemies[id];
        return object ? object.name : Constants.invalidDataName;
    }

    function troopName(id) {
        var object = troops[id];
        return object ? object.name : Constants.invalidDataName;
    }

    function stateName(id) {
        var object = states[id];
        return object ? object.name : Constants.invalidDataName;
    }

    function animationName(id) {
        var object = animations[id];
        return object ? object.name : Constants.invalidDataName;
    }

    function tilesetName(id) {
        var object = tilesets[id];
        return object ? object.name : Constants.invalidDataName;
    }

    function commonEventName(id) {
        var object = commonEvents[id];
        return object ? object.name : Constants.invalidDataName;
    }

    function switchName(id) {
        var name = system && system.switches ? system.switches[id] : "";
        return isString(name) ? name : Constants.invalidDataName;
    }

    function variableName(id) {
        var name = system && system.variables ? system.variables[id] : "";
        return isString(name) ? name : Constants.invalidDataName;
    }

    function elementName(id) {
        var name = system && system.elements ? system.elements[id] : "";
        return isString(name) ? name : Constants.invalidDataName;
    }

    function skillTypeName(id) {
        var name = system && system.skillTypes ? system.skillTypes[id] : "";
        return isString(name) ? name : Constants.invalidDataName;
    }

    function weaponTypeName(id) {
        var name = system && system.weaponTypes ? system.weaponTypes[id] : "";
        return isString(name) ? name : Constants.invalidDataName;
    }

    function armorTypeName(id) {
        var name = system && system.armorTypes ? system.armorTypes[id] : "";
        return isString(name) ? name : Constants.invalidDataName;
    }

    function equipTypeName(id) {
        var name = system && system.equipTypes ? system.equipTypes[id] : "";
        return isString(name) ? name : Constants.invalidDataName;
    }

    function troopMemberName(id, index) {
        var object = troops ? troops[id] : null;
        var members = object ? object.members[index] : null;
        return members ? enemyName(members.enemyId) : Constants.invalidDataName;
    }

    function mapName(id) {
        var object = mapInfos ? mapInfos[id] : null;
        return object ? object.name : Constants.invalidDataName;
    }

    function nameOrId(name, id, numDigits) {
        if (name.length) {
            return name;
        } else {
            numDigits = numDigits || 4;
            return "#" + makeIdText(id, numDigits);
        }
    }

    function nameAndId(name, id, numDigits) {
        numDigits = numDigits || 4;
        if (name.length) {
            return makeIdText(id, numDigits) + " " + name;
        } else {
            return makeIdText(id, numDigits);
        }
    }

    function actorNameOrId(id) {
        return nameOrId(actorName(id), id);
    }

    function classNameOrId(id) {
        return nameOrId(className(id), id);
    }

    function skillNameOrId(id) {
        return nameOrId(skillName(id), id);
    }

    function itemNameOrId(id) {
        return nameOrId(itemName(id), id);
    }

    function weaponNameOrId(id) {
        return nameOrId(weaponName(id), id);
    }

    function armorNameOrId(id) {
        return nameOrId(armorName(id), id);
    }

    function enemyNameOrId(id) {
        return nameOrId(enemyName(id), id);
    }

    function troopNameOrId(id) {
        return nameOrId(troopName(id), id);
    }

    function stateNameOrId(id) {
        return nameOrId(stateName(id), id);
    }

    function animationNameOrId(id) {
        return nameOrId(animationName(id), id);
    }

    function tilesetNameOrId(id) {
        return nameOrId(tilesetName(id), id);
    }

    function commonEventNameOrId(id) {
        return nameOrId(commonEventName(id), id);
    }

    function switchNameOrId(id) {
        return nameOrId(switchName(id), id);
    }

    function variableNameOrId(id) {
        return nameOrId(variableName(id), id);
    }

    function mapNameOrId(id) {
        return nameOrId(mapName(id), id, 3);
    }

    function featureObjects(actorId) {
        var actor = actors ? actors[actorId] : null;
        return actor && classes ? [actor, classes[actor.classId]] : [];
    }

    function allTraits(actorId) {
        return featureObjects(actorId).reduce(function(r, obj) {
            return r.concat(obj ? obj.traits : []);
        }, []);
    }

    function traits(actorId, code) {
        return allTraits(actorId).filter(function(trait) {
            return trait.code === code;
        });
    }

    function traitsSet(actorId, code) {
        return traits(actorId, code).reduce(function(r, trait) {
            return r.concat(trait.dataId);
        }, []);
    }

    function isEquipWtypeOk(actorId, wtypeId) {
        return traitsSet(actorId, Constants._TRAIT_EQUIP_WTYPE).indexOf(wtypeId) >= 0;
    }

    function isEquipAtypeOk(actorId, atypeId) {
        return traitsSet(actorId, Constants._TRAIT_EQUIP_ATYPE).indexOf(atypeId) >= 0;
    }

    function isEquipTypeFixed(actorId, etypeId) {
        return traitsSet(actorId, Constants._TRAIT_EQUIP_FIX).indexOf(etypeId) >= 0;
    }

    function isEquipTypeSealed(actorId, etypeId) {
        return traitsSet(actorId, Constants._TRAIT_EQUIP_SEAL).indexOf(etypeId) >= 0;
    }

    function slotType(actorId) {
        var set = traitsSet(actorId, Constants._TRAIT_SLOT_TYPE);
        return set.length > 0 ? Math.max.apply(null, set) : 0;
    }

    function isDualWield(actorId) {
        return slotType(actorId) === 1;
    }

    function slotIdToEquipId(actorId, slotId) {
        return slotId === 1 && isDualWield(actorId) ? 1 : slotId + 1;
    }

    function isBigCharacter(imageName) {
        return imageName.match(/^\!*\$/);
    }

    function isObjectCharacter(imageName) {
        return imageName.match(/^\$*\!/);
    }

    function parse(fileName) {

        var text = TkoolAPI.readFile(projectUrl + "languages/en" + "/" + fileName + ".yaml");

        if (!text) return {};

        // Split by newline (handle both Windows and Unix)
        var lines = text.split(/\r?\n/);
        var result = {};
        var currentParent = null;

        // Standard for-loop for maximum compatibility
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];

            // Manual trim to support IE8 and below
            var trimmedLine = line.replace(/^\s+|\s+$/g, '');

            // 1. Skip empty lines or comments
            if (!trimmedLine || trimmedLine.indexOf('#') === 0) {
                continue;
            }

            // 2. Check for indentation (nested property)
            // Look for leading whitespace followed by key: value
            var indentMatch = line.match(/^(\s+)([a-zA-Z0-9_]+):\s*(.*)$/);
            if (indentMatch) {
                var key = indentMatch[2];
                var val = indentMatch[3].replace(/^\s+|\s+$/g, '');
                
                if (currentParent) {
                    result[currentParent][key] = val;
                }
                continue;
            }

            // 3. Check for top-level key
            var topLevelMatch = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
            if (topLevelMatch) {
                var key = topLevelMatch[1];
                var val = topLevelMatch[2].replace(/^\s+|\s+$/g, '');
                
                if (val === "") {
                    // It's a parent object
                    result[key] = {};
                    currentParent = key;
                } else {
                    // It's a simple key-value
                    result[key] = val;
                    currentParent = null;
                }
            }
        }

        return result;
    }
}
