"use strict";
(() => {
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });

  // src/handler.ts
  var CommandHandler = class {
    constructor() {
      this.active = false;
      this.commands = {};
      this.suggestions = {};
      this.history = [""];
      this.historyIndex = 0;
      this.currentSuggestions = [];
      this.currentSuggestionsIndex = -1;
      this.consoleElement = document.createElement("div");
      this.listElement = document.createElement("ul");
      this.actionElement = document.createElement("div");
      this.scrollableElement = document.createElement("div");
      this.actionInputPrefixElement = document.createElement("span");
      this.actionSuggestionElement = document.createElement("p");
      this.actionInputElement = document.createElement("input");
      Input._shouldPreventDefault = () => false;
      if (typeof KeyboardInput !== "undefined") {
        KeyboardInput._shouldPreventDefault = () => false;
      }
      this.actionInputPrefixElement.innerText = "/";
      this.consoleElement.classList.add("console");
      this.actionElement.classList.add("action");
      this.scrollableElement.classList.add("scrollable");
      this.actionInputElement.setAttribute("type", "text");
      this.actionInputElement.setAttribute("id", "console_input");
      this.actionInputElement.setAttribute("autocomplete", "off");
      this.actionInputElement.addEventListener(
        "keydown",
        (e) => {
          switch (e.code) {
            case "Enter":
              e.preventDefault();
              if (e.target.value.length > 0) {
                this.log(
                  `/${e.target.value}`,
                  "lightgray"
                );
                this.execute(e.target.value);
                this.history.splice(
                  this.history.length - 1,
                  0,
                  e.target.value
                );
                this.historyIndex = this.history.length - 1;
                e.target.value = "";
              }
              break;
            case "ArrowUp":
              e.preventDefault();
              if (this.historyIndex > 0) {
                this.historyIndex--;
                e.target.value = this.history[this.historyIndex];
                e.target.selectionStart = e.target.selectionEnd = e.target.value.length;
                this.onInputUpdate(e.target.value);
              }
              break;
            case "ArrowDown":
              e.preventDefault();
              if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                e.target.value = this.history[this.historyIndex];
                e.target.selectionStart = e.target.selectionEnd = e.target.value.length;
                this.onInputUpdate(e.target.value);
              }
              break;
            case "Tab":
              e.preventDefault();
              if (this.currentSuggestions.length === 0) {
                break;
              }
              const oldElement = this.actionSuggestionElement.children[this.currentSuggestionsIndex];
              if (oldElement) {
                oldElement.style.backgroundColor = "";
              }
              this.currentSuggestionsIndex++;
              if (this.currentSuggestionsIndex >= this.currentSuggestions.length) {
                this.currentSuggestionsIndex = 0;
              }
              const element = this.actionSuggestionElement.children[this.currentSuggestionsIndex];
              if (element) {
                element.style.backgroundColor = "blue";
              }
              const temp = this.parseArguments(
                this.actionInputElement.value,
                true
              );
              const tempValue = this.currentSuggestions[this.currentSuggestionsIndex];
              if (temp.length > 0) {
                temp[temp.length - 1] = tempValue;
                this.actionInputElement.value = temp.join(" ");
                break;
              }
              this.actionInputElement.value = tempValue;
              break;
          }
        }
      );
      this.actionInputElement.addEventListener(
        "input",
        (e) => this.onInputUpdate(e.target.value)
      );
      const cachedFont = localStorage.getItem("font") || "GameFont";
      const cachedFontSize = localStorage.getItem("fontSize") || "1.5rem";
      const styleElement = document.createElement("style");
      styleElement.innerText = `
        .console,
        .console input {
          font-family: ${cachedFont};
          font-size: ${cachedFontSize};
        }

        .console {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.8);
          z-index: 100;
          color: #fff;
          padding: 1rem;
          box-sizing: border-box;
          justify-content: flex-end;
          flex-direction: column;
          display: none;
          user-select: text;
        }

        .console .action {
          display: flex;
          padding: 0.25em 0.5em;
          box-sizing: border-box;
          background-color: rgba(0, 0, 0, 0.2);
          align-items: center;
          min-height: 3rem;
        }

        .console ul {
          list-style-type: none;
          padding-left: 0;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          word-break: break-word;
        }

        .console .scrollable {
          overflow-y: auto;
          margin-bottom: 0.5rem;
        }

        .console li {
          margin-bottom: 0.25rem;
          white-space: pre-wrap;
        }

        .console #console_input {
          width: 100%;
          border: none;
          color: #fff;
          outline: none;
          background-color: transparent;
        }

        .show {
          display: flex;
        }

        .console p {
          color: lightblue;
          margin: 0 0 12px 0;
        }

        .console p span {
            margin-right: 10px;
            display: inline-block;
        }
        `;
      document.head.appendChild(styleElement);
      document.addEventListener("keydown", (e) => {
        if (e.code === "Escape" && this.active === true || e.code === "Slash" && this.active === false) {
          e.preventDefault();
          this.toggleConsole();
        }
      });
      this.scrollableElement.appendChild(this.listElement);
      this.scrollableElement.appendChild(
        this.actionSuggestionElement
      );
      this.actionElement.appendChild(this.actionInputPrefixElement);
      this.actionElement.appendChild(this.actionInputElement);
      this.consoleElement.appendChild(this.scrollableElement);
      this.consoleElement.appendChild(this.actionElement);
      document.body.appendChild(this.consoleElement);
      this.log(
        `Welcome to ${document.title} console! Press ESC to close it`
      );
    }
    updateSuggestions() {
      for (let i = 0; i < this.currentSuggestions.length; ++i) {
        const tempElement = document.createElement("span");
        tempElement.innerText = this.currentSuggestions[i];
        this.actionSuggestionElement.appendChild(tempElement);
      }
    }
    onInputUpdate(value) {
      while (this.actionSuggestionElement.lastElementChild) {
        this.actionSuggestionElement.removeChild(
          this.actionSuggestionElement.lastElementChild
        );
      }
      this.currentSuggestionsIndex = -1;
      this.currentSuggestions = [];
      const args = this.parseArguments(value);
      if (args.length > 1) {
        if (args[0] in this.suggestions) {
          this.currentSuggestions = this.filterSuggestions(
            args[args.length - 1],
            this.suggestions[args[0]](args)
          );
          this.updateSuggestions();
          this.scrollableElement.scrollTo(
            0,
            this.scrollableElement.scrollHeight
          );
        }
        return;
      }
      const commandNames = Object.keys(this.commands).sort();
      this.currentSuggestions = args.length === 1 ? this.filterSuggestions(args[0], commandNames) : commandNames;
      this.updateSuggestions();
      this.scrollableElement.scrollTo(
        0,
        this.scrollableElement.scrollHeight
      );
    }
    updateConsole() {
      if (this.active === true) {
        SceneManager.stop();
        this.onInputUpdate(this.actionInputElement.value);
        this.consoleElement.classList.add("show");
        this.actionInputElement.focus();
        return;
      }
      this.consoleElement.classList.remove("show");
      SceneManager.resume();
    }
    toggleConsole() {
      this.active = !this.active;
      this.updateConsole();
    }
    setConsole(active) {
      this.active = active;
      this.updateConsole();
    }
    log(value, color = "#fff") {
      const tempElement = document.createElement("li");
      tempElement.innerText = value;
      if (color !== "#fff") {
        tempElement.style.color = color;
      }
      this.listElement.appendChild(tempElement);
      this.scrollableElement.scrollTo(
        0,
        this.scrollableElement.scrollHeight
      );
    }
    add(name, callback, suggestions = null) {
      if (name in this.commands) {
        return false;
      }
      this.commands[name] = callback;
      if (suggestions !== null) {
        this.suggestions[name] = suggestions;
      }
      return true;
    }
    parseArguments(input, needsQuotes = false) {
      const args = [];
      const regex = new RegExp('((?<prefix>\\d+):)?("(?<longValue>.*?)("|$)|(?<value>[^ ]+))', "g");
      let match;
      while ((match = regex.exec(input)) !== null) {
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        if (match.groups) {
          let value = "";
          if (match.groups.prefix) {
            value += match.groups.prefix + ":";
          }
          if (match.groups.longValue) {
            value += needsQuotes ? `"${match.groups.longValue}"` : match.groups.longValue;
          } else if (match.groups.value) {
            value += match.groups.value;
          }
          args.push(value);
        }
      }
      if (input.charAt(input.length - 1) === " ") {
        args.push("");
      }
      return args;
    }
    execute(command) {
      if (command.indexOf("js") === 0) {
        if (!("js" in this.commands)) {
          this.log("Command not found.", "red");
          return;
        }
        this.commands["js"](this, command.split(" "));
        return;
      }
      const args = this.parseArguments(command);
      if (args.length === 0 || !(args[0] in this.commands)) {
        this.log("Command not found.", "red");
        return;
      }
      this.commands[args[0]](this, args);
      this.actionSuggestionElement.innerText = "";
      this.currentSuggestions = [];
      this.currentSuggestionsIndex = -1;
      this.onInputUpdate("");
    }
    filterSuggestions(query, values) {
      const result = [];
      query = query.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
      const regex = new RegExp(query, "i");
      for (let i = 0; i < values.length; ++i) {
        if (values[i].search(regex) > -1) {
          result.push(values[i]);
        }
      }
      return result.sort();
    }
  };

  // src/utils.ts
  var findFromVariable = (dest, value, name = "name", id = "id") => {
    const parsedValue = parseInt(value);
    const numeric = isValidInteger(parsedValue);
    for (let i = 0; i < dest.length; ++i) {
      if (dest[i] !== null && (numeric && parsedValue === dest[i][id] || dest[i][name] === value)) {
        return dest[i];
      }
    }
    return null;
  };
  var isValidInteger = (value) => {
    return !isNaN(value) && isFinite(value);
  };
  var addQuotes = (name) => {
    return name.indexOf(" ") > -1 ? `"${name}"` : name;
  };
  var mergeIDAndName = (id, name) => {
    return `${id}:${addQuotes(name)}`;
  };

  // src/commands/actor/utils.ts
  var actors = null;
  var getActorsByName = () => {
    if (actors !== null) {
      return actors;
    }
    actors = [];
    for (let i = 1; i < $dataActors.length; ++i) {
      if ($dataActors[i].characterName.length > 0) {
        actors.push(
          mergeIDAndName(i, $dataActors[i].characterName)
        );
      }
    }
    return actors;
  };
  var findActiveActor = (name) => {
    return findFromVariable(
      $gameParty.allMembers(),
      name,
      "_characterName",
      "_actorId"
    );
  };
  var getActiveActorsByName = () => {
    const result = [];
    const activeMembers = $gameParty ? $gameParty.allMembers() : [];
    for (let i = 0; i < activeMembers.length; ++i) {
      result.push(
        mergeIDAndName(
          activeMembers[i]._actorId,
          activeMembers[i]._characterName
        )
      );
    }
    return result;
  };
  var onSuggestion = (args) => {
    if (args.length === 2) {
      return getActorsByName();
    }
    return [];
  };
  var onSuggestionActive = (args) => {
    if (args.length === 2) {
      return getActiveActorsByName();
    }
    return [];
  };
  var onSuggestionValue = (args) => {
    if (args.length === 3) {
      return ["max"];
    }
    return onSuggestionActive(args);
  };
  var getActiveSkillsByName = (name) => {
    const result = [];
    const actor = findActiveActor(name);
    if (!actor) {
      return result;
    }
    for (let i = 0; i < actor._equippedSkills.length; ++i) {
      const id = actor._equippedSkills[i];
      if (id > 0) {
        result.push(
          mergeIDAndName(
            id,
            $dataSkills[id] ? $dataSkills[id].name : "Unknown"
          )
        );
      }
    }
    return result;
  };

  // src/commands/actor/addparty.ts
  var onCommand = (handler, args) => {
    if (args.length < 2) {
      handler.log("Usage: /addparty [name]");
      return;
    }
    const actor = findFromVariable(
      $dataActors,
      args[1],
      "characterName"
    );
    if (actor === null) {
      handler.log(`Actor ${args[1]} not found`, "red");
      return;
    }
    if ($gameParty.allMembers().length >= 4) {
      handler.log(
        "Could not have more than 4 party members.",
        "red"
      );
      return;
    }
    $gameParty.addActor(actor.id);
    handler.log(`${actor.characterName} joined the party!`);
  };
  var onSuggestion2 = (args) => {
    const array1 = onSuggestion(args);
    const array2 = onSuggestionActive(args);
    const unique1 = array1.filter(
      (value) => array2.indexOf(value) === -1
    );
    const unique2 = array2.filter(
      (value) => array1.indexOf(value) === -1
    );
    return unique1.concat(unique2);
  };
  var addparty_default = { onCommand, onSuggestion: onSuggestion2 };

  // src/commands/actor/removeparty.ts
  var onCommand2 = (handler, args) => {
    if (args.length < 2) {
      handler.log("Usage: /removeparty [name]");
      return;
    }
    const actor = findFromVariable(
      $dataActors,
      args[1],
      "characterName"
    );
    if (actor === null) {
      handler.log(`Actor ${args[1]} not found`, "red");
      return;
    }
    if ($gameParty.allMembers().length < 2) {
      handler.log("Could not remove the last party member.", "red");
      return;
    }
    $gameParty.removeActor(actor.id);
    handler.log(`${actor.characterName} removed from the party!`);
  };
  var removeparty_default = { onCommand: onCommand2, onSuggestion: onSuggestionActive };

  // src/commands/actor/heal.ts
  var onCommand3 = (handler, args) => {
    if (args.length < 2) {
      handler.log("Usage: /heal [name]");
      return;
    }
    const actor = findActiveActor(args[1]);
    if (actor === null) {
      handler.log(`Actor "${args[1]}" not found`, "red");
      return;
    }
    actor.setHp(actor.mhp);
    actor.setMp(actor.mmp);
    handler.log(`${actor._characterName} has been healed!`);
  };
  var heal_default = { onCommand: onCommand3, onSuggestion: onSuggestionActive };

  // src/commands/actor/hp.ts
  var onCommand4 = (handler, args) => {
    if (args.length < 3) {
      handler.log("Usage: /hp [name] [value]");
      return;
    }
    const actor = findActiveActor(args[1]);
    if (actor === null) {
      handler.log(`Actor ${args[1]} not found`, "red");
      return;
    }
    const value = args[2] === "max" ? actor.mhp : parseInt(args[2]);
    if (isValidInteger(value)) {
      actor.setHp(value);
      handler.log(`Set ${actor._characterName}'s HP to ${value}`);
      return;
    }
    handler.log(`${value} is not a valid integer`, "red");
  };
  var hp_default = { onCommand: onCommand4, onSuggestion: onSuggestionValue };

  // src/commands/actor/mp.ts
  var onCommand5 = (handler, args) => {
    if (args.length < 3) {
      handler.log("Usage: /mp [name] [value]");
      return;
    }
    const actor = findActiveActor(args[1]);
    if (actor === null) {
      handler.log(`Actor ${args[1]} not found`, "red");
      return;
    }
    const value = args[2] === "max" ? actor.mmp : parseInt(args[2]);
    if (isValidInteger(value)) {
      actor.setMp(value);
      handler.log(`Set ${actor._characterName}'s MP to ${value}`);
      return;
    }
    handler.log(`${value} is not a valid integer`, "red");
  };
  var mp_default = { onCommand: onCommand5, onSuggestion: onSuggestionValue };

  // src/commands/actor/addskill.ts
  var namedSkills = null;
  var getSkillsByName = () => {
    if (namedSkills !== null) {
      return namedSkills;
    }
    namedSkills = [];
    for (let i = 1; i < $dataSkills.length; ++i) {
      namedSkills.push(mergeIDAndName(i, $dataSkills[i].name));
    }
    return namedSkills;
  };
  var onCommand6 = (handler, args) => {
    if (args.length < 3) {
      handler.log("Usage: /addskill [actor] [name]");
      return;
    }
    const actor = findActiveActor(args[1]);
    if (actor === null) {
      handler.log(`Actor ${args[1]} not found`, "red");
      return;
    }
    const skill = findFromVariable(
      $dataSkills,
      args[2],
      "name"
    );
    if (skill === null) {
      handler.log(`Skill "${args[2]}" not found`, "red");
      return;
    }
    if (!actor._skills.includes(skill.id)) {
      actor._equippedSkills.push(skill.id);
      handler.log(
        `Added Skill "${skill.name}" for ${actor._characterName}`
      );
      return;
    }
    handler.log(`Skill "${skill.name}" is already added.`, "red");
  };
  var onSuggestion3 = (args) => {
    if (args.length === 2) {
      return onSuggestionActive(args);
    }
    if (args.length === 3) {
      return getSkillsByName();
    }
    return [];
  };
  var addskill_default = { onCommand: onCommand6, onSuggestion: onSuggestion3 };

  // src/commands/actor/removeskill.ts
  var onCommand7 = (handler, args) => {
    if (args.length < 3) {
      handler.log("Usage: /removeskill [actor] [name]");
      return;
    }
    const actor = findActiveActor(args[1]);
    if (actor === null) {
      handler.log(`Actor ${args[1]} not found`, "red");
      return;
    }
    const skill = findFromVariable(
      $dataSkills,
      args[2],
      "name"
    );
    if (skill === null) {
      handler.log(`Skill "${args[2]}" not found`, "red");
      return;
    }
    const index = actor._equippedSkills.indexOf(skill.id);
    if (index > -1) {
      actor._equippedSkills.splice(index, 1);
      handler.log(
        `Removed Skill ${skill.name} from ${actor._characterName}`
      );
    }
  };
  var onSuggestion4 = (args) => {
    if (args.length === 2) {
      return onSuggestionActive(args);
    }
    if (args.length === 3) {
      return getActiveSkillsByName(args[1]);
    }
    return [];
  };
  var removeskill_default = { onCommand: onCommand7, onSuggestion: onSuggestion4 };

  // src/commands/actor/healall.ts
  var healall_default = {
    onCommand: (handler) => {
      const actors2 = $gameParty.allMembers();
      for (let i = 0; i < actors2.length; ++i) {
        actors2[i].setHp(actors2[i].mhp);
        actors2[i].setMp(actors2[i].mmp);
      }
      handler.log(`Everyone has been healed!`);
    },
    onSuggestion: null
  };

  // src/commands/battle.ts
  var namedTroops = null;
  var getTroopsByName = () => {
    const result = [];
    for (let i = 1; i < $dataTroops.length; ++i) {
      if ($dataTroops[i].members.length > 0) {
        result.push(addQuotes($dataTroops[i].name));
      }
    }
    return result;
  };
  Game_Troop.prototype.addTroopReinforcementsWithRelativePosition = function(troopId, x, y) {
    const troop = $dataTroops[troopId];
    for (let i = 0; i < troop.members.length; ++i) {
      const member = troop.members[i];
      if ($dataEnemies[member.enemyId]) {
        const newX = member.x + x;
        const newY = member.y + y;
        const enemyId = member.enemyId;
        const enemy = new Game_Enemy(enemyId, newX, newY);
        enemy.setTroopId(troopId);
        enemy.setTroopMemberId(i);
        if (member.hidden) {
          enemy.hide();
        }
        this._enemies.push(enemy);
        this._newEnemies.push(enemy);
      }
    }
    this.makeUniqueNames();
    BattleManager.refreshEnemyReinforcements();
  };
  var onCommand8 = (handler, args) => {
    if (args.length < 2) {
      handler.log("Usage: /battle [id | name] [x = 0] [y = 0]");
      return;
    }
    const battle = findFromVariable($dataTroops, args[1]);
    if (battle === null) {
      handler.log(`Battle "${args[1]}" not found`, "red");
      return;
    }
    if ($gameParty.inBattle()) {
      const x = parseInt(args[2] || "0");
      const y = parseInt(args[3] || "0");
      $gameTroop.addTroopReinforcementsWithRelativePosition(
        battle.id,
        x,
        y
      );
      handler.log(`${battle.name} joined the battle!`);
      return;
    }
    if (!SceneManager._scene._mapLoaded) {
      handler.log("Player must be in map", "red");
      return;
    }
    handler.log(`Starting a battle with "${battle.name}"`);
    handler.setConsole(false);
    SoundManager.playBattleStart();
    BattleManager.setup(battle.id, true, true);
    BattleManager.setEventCallback(() => {
      $gameScreen.clear();
    });
    $gamePlayer.makeEncounterCount();
    SceneManager.push(Scene_Battle);
  };
  var onSuggestion5 = (args) => {
    if (args.length === 2) {
      if (namedTroops === null) {
        namedTroops = getTroopsByName();
      }
      return namedTroops;
    }
    return [];
  };
  var battle_default = { onCommand: onCommand8, onSuggestion: onSuggestion5 };

  // src/commands/endbattle.ts
  var endbattle_default = {
    onCommand: (handler) => {
      if (!$gameParty.inBattle()) {
        handler.log("Player must be in battle.", "red");
        return;
      }
      handler.toggleConsole();
      BattleManager.endBattle(0);
    },
    onSuggestion: null
  };

  // src/commands/reload.ts
  var reload_default = {
    onCommand: () => {
      chrome.runtime.reload();
    },
    onSuggestion: null
  };

  // src/commands/clear.ts
  var clear_default = {
    onCommand: (handler) => {
      while (handler.listElement.lastElementChild) {
        handler.listElement.removeChild(
          handler.listElement.lastElementChild
        );
      }
    },
    onSuggestion: null
  };

  // src/commands/font.ts
  var supportedFonts = ["monospace", "sans-serif", "GameFont"];
  var onCommand9 = (handler, args) => {
    if (args.length < 2) {
      handler.log("Usage: /font [font]");
      return;
    }
    if (!supportedFonts.includes(args[1])) {
      handler.log(`Unknown font ${args[1]}`, "red");
      return;
    }
    handler.consoleElement.style.fontFamily = args[1];
    handler.actionInputElement.style.fontFamily = args[1];
    const fontSize = args[1] !== "GameFont" ? "1.125rem" : "1.5rem";
    handler.consoleElement.style.fontSize = fontSize;
    handler.actionInputElement.style.fontSize = fontSize;
    localStorage.setItem("font", args[1]);
    localStorage.setItem("fontSize", fontSize);
  };
  var onSuggestion6 = (args) => {
    if (args.length === 2) {
      return supportedFonts;
    }
    return [];
  };
  var font_default = { onCommand: onCommand9, onSuggestion: onSuggestion6 };

  // src/commands/event.ts
  var namedEvents = null;
  var getEventsByName = () => {
    if (namedEvents !== null) {
      return namedEvents;
    }
    namedEvents = [];
    for (let i = 1; i < $dataCommonEvents.length; ++i) {
      if ($dataCommonEvents[i].name.length > 0) {
        namedEvents.push(
          mergeIDAndName(
            $dataCommonEvents[i].id,
            $dataCommonEvents[i].name
          )
        );
      }
    }
    return namedEvents;
  };
  var onCommand10 = (handler, args) => {
    if (args.length < 2) {
      handler.log("/event [name]");
      return;
    }
    const event = findFromVariable(
      $dataCommonEvents,
      args[1],
      "name"
    );
    if (event === null) {
      handler.log(`Event "${args[1]}" not found.`);
      return;
    }
    if (!(SceneManager._scene instanceof Scene_Map || SceneManager._scene instanceof Scene_Battle)) {
      SceneManager.push(Scene_Map);
    }
    $gameTemp.reserveCommonEvent(event.id);
    handler.setConsole(false);
  };
  var onSuggestion7 = (args) => {
    if (args.length === 2) {
      return getEventsByName();
    }
    return [];
  };
  var event_default = { onCommand: onCommand10, onSuggestion: onSuggestion7 };

  // src/commands/switch.ts
  var namedSwitches = null;
  var onCommand11 = (handler, args) => {
    if (args.length < 2) {
      handler.log("/switch [name] [on | off]");
      return;
    }
    const id = $dataSystem.switches.indexOf(args[1]);
    if (id === -1) {
      handler.log(`Switch "${args[2]}" not found`, "red");
      return;
    }
    if (args.length === 2) {
      handler.log(
        `"${args[1]}" = ${$gameSwitches._data[id] === true ? "on" : "off"}`
      );
      return;
    }
    if (!["on", "off"].contains(args[2])) {
      handler.log(`Expected on or off got ${args[2]}`, "red");
      return;
    }
    $gameSwitches.setValue(id, args[2] === "on");
    handler.log(`"${args[1]}" is set to ${args[2]}`);
  };
  var getSwitchesByName = () => {
    if (namedSwitches !== null) {
      return namedSwitches;
    }
    namedSwitches = [];
    for (let i = 0; i < $dataSystem.switches.length; ++i) {
      if ($dataSystem.switches[i].length > 0) {
        namedSwitches.push(addQuotes($dataSystem.switches[i]));
      }
    }
    return namedSwitches;
  };
  var onSuggestion8 = (args) => {
    if (args.length === 2) {
      return getSwitchesByName();
    }
    if (args.length === 3) {
      return ["on", "off"];
    }
    return [];
  };
  var switch_default = { onCommand: onCommand11, onSuggestion: onSuggestion8 };

  // src/commands/variable.ts
  var namedVariables = null;
  var getVariablesByName = () => {
    if (namedVariables !== null) {
      return namedVariables;
    }
    namedVariables = [];
    for (let i = 0; i < $dataSystem.variables.length; ++i) {
      if ($dataSystem.variables[i].length > 0) {
        namedVariables.push(addQuotes($dataSystem.variables[i]));
      }
    }
    return namedVariables;
  };
  var onCommand12 = (handler, args) => {
    if (args.length < 2) {
      handler.log("/variable [name] [value]");
      return;
    }
    const variable = $dataSystem.variables.indexOf(args[1]);
    if (variable === -1) {
      handler.log(`"${args[1]}" not found.`);
      return;
    }
    if (args.length === 2) {
      handler.log(
        `"${args[1]}" = ${$gameVariables.value(variable)}`
      );
      return;
    }
    $gameVariables.setValue(variable, args[2]);
    handler.log(
      `"${args[1]}" is set to ${$gameVariables.value(variable)}`
    );
  };
  var onSuggestion9 = (args) => {
    if (args.length === 2) {
      return getVariablesByName();
    }
    return [];
  };
  var variable_default = { onCommand: onCommand12, onSuggestion: onSuggestion9 };

  // src/commands/item.ts
  var namedItems = null;
  var getItemsByName = () => {
    if (namedItems !== null) {
      return namedItems;
    }
    namedItems = [];
    for (let i = 1; i < $dataItems.length; ++i) {
      if ($dataItems[i].name.length > 0) {
        const temp = $dataItems[i].name.replace('"', "'");
        namedItems.push(addQuotes(temp));
      }
    }
    return namedItems;
  };
  var onCommand13 = (handler, args) => {
    if (args.length < 2) {
      handler.log("/item [name] [quantity | max]");
      return;
    }
    const item = findFromVariable(
      $dataItems,
      args[1]
    );
    if (item === null) {
      handler.log(`Item ${args[1]} not found.`);
      return;
    }
    const value = args[2] === "max" ? $gameParty.maxItems(item) : parseInt(args[2]);
    if (isValidInteger(value)) {
      $gameParty.gainItem(item, value, false);
      handler.log(`Quantity of ${args[1]} is set to ${value}`);
      return;
    }
    handler.log(`Value ${value} is not valid`);
  };
  var onSuggestion10 = (args) => {
    if (args.length === 2) {
      return getItemsByName();
    }
    if (args.length === 3) {
      return ["max"];
    }
    return [];
  };
  var item_default = { onCommand: onCommand13, onSuggestion: onSuggestion10 };

  // src/commands/bgm.ts
  var fs = __require("fs");
  var path = __require("path");
  var namedBGM = null;
  var base = path.dirname(
    process.mainModule ? process.mainModule.filename : "."
  );
  var getBGMByName = () => {
    if (namedBGM !== null) {
      return namedBGM;
    }
    namedBGM = [];
    fs.readdirSync(`${base}/audio/bgm`).forEach((file) => {
      namedBGM == null ? void 0 : namedBGM.push(
        addQuotes(file.substring(0, file.indexOf(".")))
      );
    });
    return namedBGM;
  };
  var onCommand14 = (handler, args) => {
    if (args.length < 2) {
      handler.log(
        "Usage: /bgm [name] [volume = 100] [pitch = 100]"
      );
      return;
    }
    let volume = parseInt(args[2]);
    let pitch = parseInt(args[3]);
    if (!isValidInteger(volume)) {
      volume = 100;
    }
    if (!isValidInteger(pitch)) {
      pitch = 100;
    }
    const bgmExension = Utils.isOptionValid("test") ? "ogg" : "rpgmvo";
    if (!fs.existsSync(`${base}/audio/bgm/${args[1]}.${bgmExension}`)) {
      handler.log(`BGM ${args[1]} not found.`, "red");
      return;
    }
    handler.log(
      `Playing "${args[1]}" with volume ${volume} and pitch ${pitch}`
    );
    AudioManager.stopAll();
    AudioManager.playBgm(
      {
        name: args[1],
        volume,
        pitch,
        pan: 0,
        pos: 0
      },
      0
    );
  };
  var onSuggestion11 = (args) => {
    if (args.length === 2) {
      return getBGMByName();
    }
    if (args.length === 3 || args.length === 4) {
      return ["100"];
    }
    return [];
  };
  var bgm_default = { onCommand: onCommand14, onSuggestion: onSuggestion11 };

  // src/commands/js.ts
  var js_default = {
    onCommand: (handler, args) => {
      args.splice(0, 1);
      try {
        handler.log((0, eval)(args.join(" ")));
      } catch (e) {
        handler.log(e, "red");
      }
    },
    onSuggestion: null
  };

  // src/commands/restartbattle.ts
  var restartbattle_default = {
    onCommand: (handler) => {
      if (!$gameParty.inBattle()) {
        handler.log("Player must be in battle.", "red");
        return;
      }
      BattleManager.processRetry();
      handler.setConsole(false);
    },
    onSuggestion: null
  };

  // src/commands/save.ts
  var onCommand15 = (handler, args) => {
    const id = args.length < 2 ? DataManager._lastAccessedId : parseInt(args[1]);
    if (isNaN(id)) {
      handler.log("Expected a number", "red");
      return;
    }
    if (id < 1 || id > 6) {
      handler.log("Invalid Save ID", "red");
      return;
    }
    if (!DataManager.saveGame(id)) {
      handler.log(`Failed to Save on id ${id}`, "red");
      return;
    }
    SoundManager.playSave();
    handler.log(`Saved on id ${id}`);
  };
  var onSuggestion12 = null;
  var save_default = { onCommand: onCommand15, onSuggestion: onSuggestion12 };

  // src/commands/load.ts
  var onCommand16 = (handler, args) => {
    if (args.length < 2) {
      handler.log("/load [saveid]");
      return;
    }
    const id = parseInt(args[1]);
    if (!isValidInteger(id)) {
      handler.log("Expected a number", "red");
      return;
    }
    if (!Galv.ASPLASH.splashed) {
      handler.log(
        "Can not load a save file during splash screen.",
        "red"
      );
      return;
    }
    if (DataManager.loadGame(id)) {
      handler.setConsole(false);
      SceneManager.goto(Scene_Base);
      SoundManager.playLoad();
      handler.log(`Loaded save file ${id}`);
      setTimeout(() => {
        if (DataManager.loadGame(id)) {
          ConfigManager.save();
          if ($gameSystem.versionId() !== $dataSystem.versionId) {
            $gamePlayer.reserveTransfer(
              $gameMap.mapId(),
              $gamePlayer.x,
              $gamePlayer.y,
              0,
              0
            );
            $gamePlayer.requestMapReload();
          }
          try {
            $gameSystem.onAfterLoad();
          } catch (e) {
            handler.log(
              `Warning: $gameSystem.onAfterLoad throwed an error:
${e.stack}`,
              "yellow"
            );
          }
          SceneManager.push(Scene_Map);
        }
      }, 100);
      return;
    }
    handler.log(`Failed to load gamefile ${id}`, "red");
  };
  var onSuggestion13 = null;
  var load_default = { onCommand: onCommand16, onSuggestion: onSuggestion13 };

  // src/commands/sfx.ts
  var fs2 = __require("fs");
  var path2 = __require("path");
  var namedBGM2 = null;
  var base2 = path2.dirname(
    process.mainModule ? process.mainModule.filename : "."
  );
  var getSEByName = () => {
    if (namedBGM2 !== null) {
      return namedBGM2;
    }
    namedBGM2 = [];
    fs2.readdirSync(`${base2}/audio/se`).forEach((file) => {
      namedBGM2 == null ? void 0 : namedBGM2.push(
        addQuotes(file.substring(0, file.indexOf(".")))
      );
    });
    return namedBGM2;
  };
  var onCommand17 = (handler, args) => {
    if (args.length < 2) {
      handler.log(
        "Usage: /sfx [name] [volume = 100] [pitch = 100]"
      );
      return;
    }
    let volume = parseInt(args[2]);
    let pitch = parseInt(args[3]);
    if (!isValidInteger(volume)) {
      volume = 100;
    }
    if (!isValidInteger(pitch)) {
      pitch = 100;
    }
    const bgmExension = Utils.isOptionValid("test") ? "ogg" : "rpgmvo";
    if (!fs2.existsSync(`${base2}/audio/se/${args[1]}.${bgmExension}`)) {
      handler.log(`BGM ${args[1]} not found.`, "red");
      return;
    }
    handler.log(
      `Playing "${args[1]}" with volume ${volume} and pitch ${pitch}`
    );
    AudioManager.stopAll();
    AudioManager.playSe({
      name: args[1],
      volume,
      pitch,
      pan: 0
    });
  };
  var onSuggestion14 = (args) => {
    if (args.length === 2) {
      return getSEByName();
    }
    if (args.length === 3 || args.length === 4) {
      return ["100"];
    }
    return [];
  };
  var sfx_default = { onCommand: onCommand17, onSuggestion: onSuggestion14 };

  // src/commands/noclip.ts
  var noclip_default = {
    onCommand: (handler, args) => {
      $gamePlayer._through = args.length > 1 ? args[1] === "on" : !$gamePlayer._through;
      handler.log(
        `Noclip is set to ${$gamePlayer._through ? "on" : "off"}`
      );
    },
    onSuggestion: (args) => {
      if (args.length === 2) {
        return ["on", "off"];
      }
      return [];
    }
  };

  // src/commands/speed.ts
  var speed_default = {
    onCommand: (handler, args) => {
      let speed = 4;
      if (args.length > 1) {
        const value = parseInt(args[1]);
        if (isValidInteger(value))
          speed = value;
      }
      $gamePlayer._moveSpeed = speed;
      handler.log(`Setting player's speed to ${speed}`);
    },
    onSuggestion: null
  };

  // src/commands/eventinfo.ts
  var onCommand18 = (handler, args) => {
    if (args.length < 2) {
      handler.log("/eventinfo [id | name]");
      return;
    }
    const parsedValue = parseInt(args[1]);
    if (!isValidInteger(parsedValue)) {
      handler.log("Expected an integer", "red");
      return;
    }
    const event = $gameMap._events[parsedValue];
    if (event === void 0) {
      handler.log(`Event ${args[1]} not found.`, "red");
      return;
    }
    const inner = event.event();
    handler.log(`Event: ${inner.name}`);
    handler.log(`Note: ${inner.note}`);
    handler.log(`X: ${event.x}`);
    handler.log(`Y: ${event.y}`);
    handler.log(`Erased: ${event._erased}`);
  };
  var onSuggestion15 = (args) => {
    if (args.length === 2) {
      const values = [];
      for (let i = 1; i < $gameMap._events.length; ++i)
        if ($gameMap._events[i]) {
          const inner = $gameMap._events[i].event();
          values.push(mergeIDAndName(i, inner.name));
        }
      return values;
    }
    return [];
  };
  var eventinfo_default = { onCommand: onCommand18, onSuggestion: onSuggestion15 };

  // src/commands/map.ts
  var path3 = __require("path");
  var fs3 = __require("fs");
  var namedMaps = null;
  var tempSceneBaseInitialize = Scene_Base.prototype.initialize;
  Scene_Base.prototype.initialize = function() {
    tempSceneBaseInitialize.call(this);
    this._isTeleporting = false;
  };
  var tempSceneMapUpdateMain = Scene_Map.prototype.updateMain;
  Scene_Map.prototype.updateMain = function() {
    if (this._isTeleporting) {
      $gameScreen.update();
      return;
    }
    tempSceneMapUpdateMain.call(this);
  };
  function getMapsbyName() {
    if (namedMaps !== null) {
      return namedMaps;
    }
    namedMaps = [];
    for (let i = 1; i < $dataMapInfos.length; ++i) {
      if ($dataMapInfos[i] !== null) {
        namedMaps.push(addQuotes($dataMapInfos[i].name));
      }
    }
    return namedMaps;
  }
  var TeleportScene = class extends Scene_Map {
    createDisplayObjects() {
      super.createDisplayObjects();
      this._isTeleporting = true;
      $gamePlayer.locate(
        Math.floor($dataMap.width / 2),
        Math.floor($dataMap.height / 2)
      );
    }
    update() {
      super.update();
      if (Input.isRepeated("up")) {
        this.movePlayer(0, -1);
        return;
      }
      if (Input.isRepeated("down")) {
        this.movePlayer(0, 1);
        return;
      }
      if (Input.isRepeated("left")) {
        this.movePlayer(-1, 0);
        return;
      }
      if (Input.isRepeated("right")) {
        this.movePlayer(1, 0);
        return;
      }
      if (Input.isTriggered("ok")) {
        SoundManager.playOk();
        SceneManager.push(Scene_Map);
        this._isTeleporting = false;
        return;
      }
      if (Input.isTriggered("cancel")) {
        SoundManager.playCancel();
        const x = $gameTemp._previousTeleportX;
        const y = $gameTemp._previousTeleportY;
        const mapId = $gameTemp._previousTeleportMap;
        $gamePlayer.reserveTransfer(mapId, x, y, 2, 0);
        SceneManager.push(Scene_Map);
        this._isTeleporting = false;
      }
    }
    movePlayer(x, y) {
      SoundManager.playCursor();
      const dx = ($gamePlayer.x + x).clamp(0, $dataMap.width - 1);
      const dy = ($gamePlayer.y + y).clamp(0, $dataMap.height - 1);
      $gamePlayer.locate(dx, dy);
    }
  };
  var onCommand19 = (handler, args) => {
    if (args.length < 2) {
      const currentMap = $dataMapInfos[$gameMap == null ? void 0 : $gameMap._mapId];
      if (!currentMap) {
        handler.log("Unknown map", "red");
        return;
      }
      handler.log(`Id: ${currentMap.id} Name: ${currentMap.name}`);
      return;
    }
    if (!SceneManager._scene._mapLoaded) {
      handler.log("Player must be in map", "red");
      return;
    }
    const map = findFromVariable($dataMapInfos, args[1]);
    if (map === null) {
      handler.log(`Map "${args[1]}" not found`, "red");
      return;
    }
    if (!Utils.isOptionValid("test")) {
      if (process.mainModule) {
        const base3 = path3.dirname(process.mainModule.filename);
        if (!fs3.existsSync(`${base3}/maps/map${map.id}.AUBREY`)) {
          handler.log(
            `Could not teleport to "${map.name}", because ${base3}/maps/map${map.id}.AUBREY is missing.`,
            "red"
          );
          return;
        }
      }
    } else if (!fs3.existsSync(`./maps/Map${map.id}.json`)) {
      handler.log(
        `Could not teleport to "${map.name}", because ./maps/Map${map.id}.json is missing.`,
        "red"
      );
      return;
    }
    handler.log(`Teleporting to "${map.name}"`);
    $gameTemp._previousTeleportX = $gamePlayer.x;
    $gameTemp._previousTeleportY = $gamePlayer.y;
    $gameTemp._previousTeleportMap = $gameMap.mapId();
    SceneManager.push(TeleportScene);
    $gamePlayer.reserveTransfer(map.id, 0, 0, 2, 0);
    $gamePlayer.requestMapReload();
    handler.setConsole(false);
    $gameScreen.clear();
    AudioManager.stopAll();
    $gameMap._interpreter.clear();
    try {
      $gamePlayer.processRouteEnd();
    } catch (e) {
    }
    $gameMap.clearMapFogs();
    SceneManager._scene._messageWindow.terminateMessage();
  };
  var onSuggestion16 = (args) => {
    if (args.length === 2) {
      return getMapsbyName();
    }
    return [];
  };
  var map_default = { onCommand: onCommand19, onSuggestion: onSuggestion16 };

  // src/main.ts
  window.commands = window.commands || new CommandHandler();
  window.commands.add(
    "addparty",
    addparty_default.onCommand,
    addparty_default.onSuggestion
  );
  window.commands.add(
    "removeparty",
    removeparty_default.onCommand,
    removeparty_default.onSuggestion
  );
  window.commands.add("heal", heal_default.onCommand, heal_default.onSuggestion);
  window.commands.add("hp", hp_default.onCommand, hp_default.onSuggestion);
  window.commands.add("mp", mp_default.onCommand, mp_default.onSuggestion);
  window.commands.add("reload", reload_default.onCommand, reload_default.onSuggestion);
  window.commands.add("clear", clear_default.onCommand, clear_default.onSuggestion);
  window.commands.add("font", font_default.onCommand, font_default.onSuggestion);
  window.commands.add("battle", battle_default.onCommand, battle_default.onSuggestion);
  window.commands.add(
    "endbattle",
    endbattle_default.onCommand,
    endbattle_default.onSuggestion
  );
  window.commands.add("event", event_default.onCommand, event_default.onSuggestion);
  window.commands.add("switch", switch_default.onCommand, switch_default.onSuggestion);
  window.commands.add(
    "variable",
    variable_default.onCommand,
    variable_default.onSuggestion
  );
  window.commands.add("item", item_default.onCommand, item_default.onSuggestion);
  window.commands.add("bgm", bgm_default.onCommand, bgm_default.onSuggestion);
  window.commands.add(
    "addskill",
    addskill_default.onCommand,
    addskill_default.onSuggestion
  );
  window.commands.add(
    "removeskill",
    removeskill_default.onCommand,
    removeskill_default.onSuggestion
  );
  window.commands.add(
    "healall",
    healall_default.onCommand,
    healall_default.onSuggestion
  );
  window.commands.add("js", js_default.onCommand, js_default.onSuggestion);
  window.commands.add(
    "restartbattle",
    restartbattle_default.onCommand,
    restartbattle_default.onSuggestion
  );
  window.commands.add("save", save_default.onCommand, save_default.onSuggestion);
  window.commands.add("load", load_default.onCommand, load_default.onSuggestion);
  window.commands.add("sfx", sfx_default.onCommand, sfx_default.onSuggestion);
  window.commands.add("noclip", noclip_default.onCommand, noclip_default.onSuggestion);
  window.commands.add("speed", speed_default.onCommand, speed_default.onSuggestion);
  window.commands.add(
    "eventinfo",
    eventinfo_default.onCommand,
    eventinfo_default.onSuggestion
  );
  window.commands.add(
    "maptp",
    (handler, args) => {
      handler.log(
        'The "/maptp" command is deprecated in favor of "/map" and will be removed in the next release.',
        "yellow"
      );
      map_default.onCommand(handler, args);
    },
    map_default.onSuggestion
  );
  window.commands.add("map", map_default.onCommand, map_default.onSuggestion);
  Graphics.printFullError = function(name, message, stack) {
    window.commands.setConsole(true);
    window.commands.log(`${name} ${message}
${stack}`, "red");
    window.commands.log("if the game can't recover run /reload");
  };
})();
