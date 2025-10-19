# Omori Modding Resources

Welcome to the mods.one OMORI modding resources repository. The purpose of this repository is to be a single place for as many useful resources for modding OMORI as possible.

## Structure:

Each resource lives in a directory denoting it's category, then a directory for itself, together with a short readme. General summary of each category:

### ESSENTIAL plugins
Basic plugins that pretty much are auto-include in any mod 99% of the time.
### Battle System Plugins
Plugins related to creation of enemies, battles, skills, gameplay mechanics, etc. Status menu and related UI are also included.
- Battle System: Changes how the battles works itself
- Enemy AIs: Changes related to how enemy AI behaves, such as targeting or priority.
- Items: Changes in Items and Equipment functionalities
- Menu and UI: Changes in UI, both in battle and status menu. Also include any changes in UI related to communicating any stat related information.
- Skills: Changes in Skill functionalities, including damage formulas
- States: Changes in behavior of the state
### Event Plugins
Plugins related to Events in RPG MAKER maps, such as Event note tags, visual events, and modification to basic events such as camera or movement events.
- Informational: Related to giving some form of info to the player, such as time or item data
- Technical: Mostly internal changes, such as conditionals or variable support for plugin command
- Visual: Purely visual changes to the game, such as camera works and weather effects
### Gameplay Plugins
Plugins that affect general gameplay. May add extra features, such as new menus or an overhaul.
- Badges: Badge functionality, mimicking the one used in Console versions
### Data Organization
Plugins related to un-hardcoding certain things to be stored in files, such using YAML. This may include some functionalities, but the main intention is that requires less tampering with base game.
### UI Plugins
Plugins dedicated to changing how the game looks in terms of UI, such as messages or title screen
- Load and Title Screen: Changes related to loading, splash screens, and title screens
- Message System: Changes related to message functionality, usually contains some change in message macros
- Windows Skins or Layout: Changes in window skins or how the screen are arranged
### OneLoader Plugins
Plugins that execute functions related to the modloader.
### Utility Plugin
General plugins that are helpful with development features, such as simplifying commands or console.
- Dev Tools: Useful for development, usually only used while development and disabled in final product
- File Management: Plugins related to manipulating files, such as adding or copying files.
- Plugin Commands: Plugins that add extra functionality to Plugin Command feature in RPGMV. Usually for simplification and not dedicated new feature.
- Windows Functionality: Plugin that interacts with the windows functionality itself, such as error popups. Useful for "meta" mods.
### Mod Compatability Plugins
Plugins that allows support for other mods, or is a "Core" plugin to other plugins, usually due to common shared functions.

## Useful Links
### OMORI Modding Info
- [OneMaker MV](https://github.com/FoGsesipod/OneMaker-MV) \- Modifies the RPGMaker MV Editor with useful tweaks for modding Omori.
- [FruitDragon & TomatoRadio OMORI Modding Guide](https://docs.google.com/document/d/1t59hzeERvwok2ZsQVs6AgFj5WVZdeAPwiWYFgkDGLiE)
- [Beginner Guide to make OMORI Mods](https://youtu.be/ASFFJUf8t0w?si=oPs2yH3SU_qpN2Zy)

### OMORI Modding Tools
- [Omori Save Files](https://docs.google.com/document/d/1qYsW_uXsBD0wMtmQG06UxIMfbGYuTgeu-AHzzdjCw-s)
- [Omori Yaml Portrait Viewer](https://github.com/StahlReyn/omoriyamlportraitviewer) \- VSCode extension to view face portrait files in yaml messages.

### Other General Knowledge
- [RMMV Plugin Making](https://youtube.com/playlist?list=PL3Fv4Z54bWaGjcORlYg6TKsnoQDf2no3d&si=MvZqxdLBM4Nbqw8O) \- Beginner plugin making guide
- [JavaScript Beginner Tutorial](https://youtu.be/vDJpGenyHaA?si=lZdvPuZUSgr7FG1D) \- Crash course on ES5 and a little ES6 
- [Enable PixiJS Devtools in RMMV](https://www.youtube.com/watch?v=c9HzIcw78As)
- [Dither Tool](https://ditherit.com/) \- Tool for applying the dither omori battle backgrounds use