//=============================================================================
// ★ FD_EasyTitleScreen ★                                        1.0.0
//=============================================================================
/*:
 * @plugindesc v1.0.0 An easy title screen for modders who dont wanna deal with JS.
 * @author FruitDragon
 * 
 * @help
 * ★ FD_EasyTitleScreen ★                                        1.0.0
 * --------------------------------------------------------------------------
 * This plugin completely overwrites the base Omori Title Screen plugin.
 * It is compatible with Badges and other plugins that edit the button placements.
 * This plugin does not alter those.
 * 
 * Use plugin parameters. Do not edit the plugin.
 * 
 * All images associated with background must go in the img/parallaxes folder.
 * All images associated with characters/title components must go in img/pictures.
 * 
 * Defaults are set to base OMORI title screens. You can change the switches that
 * are used for the title screen. You can also use the script to force write to file.
 * 
 * DataManager.forceWriteToFile(SWITCH NUM)
 * 
 * Order of priority for switches is the higher number screen overwrites the lower 
 * number screens. This means if the switch for Screens 5 and 6 are on, the switch 
 * for Screen 6 will overwrite the switch for Screen 5, making 6 the title screen
 * that will be used upon loading the game.
 * 
 * This plugin comes with a folder of images. This is the base game atlas cut up
 * into pieces. These pieces must be placed in the img/pictures folder.
 * 
 * If using the glitch function, the image must be the same dimensions and have
 * the same number of frames as the initial defined character. 
 * 
 * You can also choose to disable the character entirely, or disable parts or 
 * all of the title entirely.
 * 
 * For more questions, please reach out to FruitDragon. For requests for more 
 * customizability, why.
 * 
 * --------------------------------------------------------------------------
 * Changelog
 * --------------------------------------------------------------------------
 * v1.0.0
 * Initial release
 * 
 * 
 * @param Applied to All
 * @default
 * 
 * @param characteron
 * @text Omori Sprite On
 * @parent Applied to All
 * @type boolean
 * @default true
 * @desc Whether you use the OMORI sprite or not.
 * 
 * @param titleon
 * @text Title Toggle
 * @parent Applied to All
 * @type boolean
 * @default true
 * @desc Whether you use the OMORI title or not. Can also choose to enable only parts of it.
 * 
 * @param titlelightbulbon
 * @text Title Lightbulb Toggle
 * @parent titleon
 * @type boolean
 * @default true
 * @desc Whether you use the OMORI title text lightbulb or not.
 * 
 * @param titleglowon
 * @text Title Glow Toggle
 * @parent titleon
 * @type boolean
 * @default true
 * @desc Whether you use the OMORI title text lightbulb glow or not.
 * 
 * @param titletexton
 * @text Title Text Toggle
 * @parent titleon
 * @type boolean
 * @default true
 * @desc Whether you use the OMORI title text or not.
 * 
 * @param DEFAULT: New Game
 * @default
 * 
 * @param defaultbg
 * @text Background
 * @parent DEFAULT: New Game
 * @default
 * 
 * @param defaultobjects
 * @text Objects
 * @parent DEFAULT: New Game
 * @default
 * 
 * @param defaultaudio
 * @text Audio
 * @parent DEFAULT: New Game
 * @default
 * 
 * @param defaultcolorbg
 * @text Solid Color BG
 * @parent defaultbg
 * @type struct<RGB>
 * @default {"toggle":"true","red":"255","green":"255","blue":"255"}
 * 
 * @param defaultscrollingbg
 * @text Scrolling BG
 * @parent defaultbg
 * @type struct<ScrollingBG>
 * @default {"image":"","xspeed":"0","yspeed":"0"}
 * 
 * @param defaultstillbg
 * @text Still BG
 * @parent defaultbg
 * @type struct<StillBG>
 * @default {"image":""}
 * 
 * @param defaultanimatedbg
 * @text Animated BG
 * @parent defaultbg
 * @type struct<AnimatedBG>
 * @default {"image":"","framerate":"45","framecount":"3","pattern":"[\"0\",\"1\",\"2\"]"}
 * 
 * @param defaultcharacter
 * @text Character
 * @parent defaultobjects
 * @type struct<Object>
 * @default {"image":"OMO_WS","width":"918","height":"351","framecount":"3","framerate":"20","pattern":"[\"0\",\"1\",\"2\"]"}
 * 
 * @param defaultcharacterglitch
 * @text Glitch Character
 * @parent defaultobjects
 * @type struct<ObjectGlitch>
 * @default {"glitchtoggle":"false","image":"","frequency":""}
 * 
 * @param defaulttitle
 * @text Title Toggle
 * @parent defaultobjects
 * @type boolean
 * @default true
 * 
 * @param defaulttitlelightbulb
 * @text Title Lightbulb
 * @parent defaulttitle
 * @type struct<Title>
 * @default {"image":"OMO_BULB_WS"}
 * 
 * @param defaulttitleglow
 * @text Title Glow
 * @parent defaulttitle
 * @type struct<Object>
 * @default {"image":"OMO_BULB_WS_LINES","width":"204","height":"150","framecount":"3","framerate":"15","pattern":"[\"0\",\"1\",\"2\",\"1\"]"}
 * 
 * @param defaulttitletext
 * @text Title Text
 * @parent defaulttitle
 * @type struct<Title>
 * @default {"image":"OMO_TITLE_WS"}
 * 
 * @param defaultcustomtitle
 * @text Custom Title
 * @parent defaultobjects
 * @type struct<ObjectEX>
 * @default {"image":"","width":"","height":"","framecount":"","framerate":"","pattern":"[]","xpos":"","direction":"","ypos":""}
 * 
 * @param defaultbgm
 * @text BGM
 * @parent defaultaudio
 * @type struct<AudioBGM>
 * @default {"bgm":"user_title","volume":"100","pitch":"100"}
 * 
 * @param defaultbgs
 * @text BGS
 * @parent defaultaudio
 * @type struct<AudioBGS>
 * @default {"bgs":"","volume":"100","pitch":"100"}
 * 
 * @param SCREEN 1: Black Space
 * @default
 * 
 * @param screen444switch
 * @text Screen 1 Switch
 * @parent SCREEN 1: Black Space
 * @type number
 * @default 444
 * @desc The switch that, when enabled, switches to this title screen.
 * 
 * @param screen444bg
 * @text Background
 * @parent SCREEN 1: Black Space
 * @default
 * 
 * @param screen444objects
 * @text Objects
 * @parent SCREEN 1: Black Space
 * @default
 * 
 * @param screen444audio
 * @text Audio
 * @parent SCREEN 1: Black Space
 * @default
 * 
 * @param screen444colorbg
 * @text Solid Color BG
 * @parent screen444bg
 * @type struct<RGB>
 * @default {"toggle":"true","red":"0","green":"0","blue":"0"}
 * 
 * @param screen444scrollingbg
 * @text Scrolling BG
 * @parent screen444bg
 * @type struct<ScrollingBG>
 * @default {"image":"","xspeed":"0","yspeed":"0"}
 * 
 * @param screen444stillbg
 * @text Still BG
 * @parent screen444bg
 * @type struct<StillBG>
 * @default {"image":""}
 * 
 * @param screen444animatedbg
 * @text Animated BG
 * @parent screen444bg
 * @type struct<AnimatedBG>
 * @default {"image":"","framerate":"45","framecount":"3","pattern":"[\"0\",\"1\",\"2\"]"}
 * 
 * @param screen444character
 * @text Character
 * @parent screen444objects
 * @type struct<Object>
 * @default {"image":"OMO_BS","width":"918","height":"351","framecount":"3","framerate":"20","pattern":"[\"0\",\"1\",\"2\"]"}
 * 
 * @param screen444characterglitch
 * @text Glitch Character
 * @parent screen444objects
 * @type struct<ObjectGlitch>
 * @default {"glitchtoggle":"false","image":"","frequency":""}
 * 
 * @param screen444title
 * @text Title Toggle
 * @parent screen444objects
 * @type boolean
 * @default true
 * 
 * @param screen444titlelightbulb
 * @text Title Lightbulb
 * @parent screen444title
 * @type struct<Title>
 * @default {"image":"OMO_BULB_BS"}
 * 
 * @param screen444titleglow
 * @text Title Glow
 * @parent screen444title
 * @type struct<Object>
 * @default {"image":"OMO_BULB_BS_LINES","width":"204","height":"150","framecount":"3","framerate":"15","pattern":"[\"0\",\"1\",\"2\",\"1\"]"}
 * 
 * @param screen444titletext
 * @text Title Text
 * @parent screen444title
 * @type struct<Title>
 * @default {"image":"OMO_TITLE_BS"}
 * 
 * @param screen444customtitle
 * @text Custom Title
 * @parent screen444objects
 * @type struct<ObjectEX>
 * @default {"image":"","width":"","height":"","framecount":"","framerate":"","pattern":"[]","xpos":"","direction":"","ypos":""}
 * 
 * @param screen444bgm
 * @text BGM
 * @parent screen444audio
 * @type struct<AudioBGM>
 * @default {"bgm":"bs_listening","volume":"100","pitch":"100"}
 * 
 * @param screen444bgs
 * @text BGS
 * @parent screen444audio
 * @type struct<AudioBGS>
 * @default {"bgs":"","volume":"100","pitch":"100"}
 * 
 * 
 * @param SCREEN 2: Red Space
 * @default
 * 
 * @param screen445switch
 * @text Screen 2 Switch
 * @parent SCREEN 2: Red Space
 * @type number
 * @default 445
 * @desc The switch that, when enabled, switches to this title screen.
 * 
 * @param screen445bg
 * @text Background
 * @parent SCREEN 2: Red Space
 * @default
 * 
 * @param screen445objects
 * @text Objects
 * @parent SCREEN 2: Red Space
 * @default
 * 
 * @param screen445audio
 * @text Audio
 * @parent SCREEN 2: Red Space
 * @default
 * 
 * @param screen445colorbg
 * @text Solid Color BG
 * @parent screen445bg
 * @type struct<RGB>
 * @default {"toggle":"true","red":"0","green":"0","blue":"0"}
 * 
 * @param screen445scrollingbg
 * @text Scrolling BG
 * @parent screen445bg
 * @type struct<ScrollingBG>
 * @default {"image":"!parallax_black_space","xspeed":"0.5","yspeed":"-0.5"}
 * 
 * @param screen445stillbg
 * @text Still BG
 * @parent screen445bg
 * @type struct<StillBG>
 * @default {"image":""}
 * 
 * @param screen445animatedbg
 * @text Animated BG
 * @parent screen445bg
 * @type struct<AnimatedBG>
 * @default {"image":"","framerate":"45","framecount":"3","pattern":"[\"0\",\"1\",\"2\"]"}
 * 
 * @param screen445character
 * @text Character
 * @parent screen445objects
 * @type struct<Object>
 * @default {"image":"OMO_RS","width":"918","height":"351","framecount":"3","framerate":"20","pattern":"[\"0\",\"1\",\"2\"]"}
 * 
 * @param screen445characterglitch
 * @text Glitch Character
 * @parent screen445objects
 * @type struct<ObjectGlitch>
 * @default {"glitchtoggle":"true","image":"OMO_WS","frequency":"240"}
 * 
 * @param screen445title
 * @text Title Toggle
 * @parent screen445objects
 * @type boolean
 * @default true
 * 
 * @param screen445titlelightbulb
 * @text Title Lightbulb
 * @parent screen445title
 * @type struct<Title>
 * @default {"image":"OMO_BULB_BS"}
 * 
 * @param screen445titleglow
 * @text Title Glow
 * @parent screen445title
 * @type struct<Object>
 * @default {"image":"OMO_BULB_BS_LINES","width":"204","height":"150","framecount":"3","framerate":"15","pattern":"[\"0\",\"1\",\"2\",\"1\"]"}
 * 
 * @param screen445titletext
 * @text Title Text
 * @parent screen445title
 * @type struct<Title>
 * @default {"image":"OMO_TITLE_BS"}
 * 
 * @param screen445customtitle
 * @text Custom Title
 * @parent screen445objects
 * @type struct<ObjectEX>
 * @default {"image":"","width":"","height":"","framecount":"","framerate":"","pattern":"[]","xpos":"","direction":"","ypos":""}
 * 
 * @param screen445bgm
 * @text BGM
 * @parent screen445audio
 * @type struct<AudioBGM>
 * @default {"bgm":"bs_listening","volume":"100","pitch":"100"}
 * 
 * @param screen445bgs
 * @text BGS
 * @parent screen445audio
 * @type struct<AudioBGS>
 * @default {"bgs":"amb_kettle","volume":"90","pitch":"100"}
 * 
 * 
 * @param SCREEN 3: White Space
 * @default
 * 
 * @param screen446switch
 * @text Screen 3 Switch
 * @parent SCREEN 3: White Space
 * @type number
 * @default 446
 * @desc The switch that, when enabled, switches to this title screen.
 * 
 * @param screen446bg
 * @text Background
 * @parent SCREEN 3: White Space
 * @default
 * 
 * @param screen446objects
 * @text Objects
 * @parent SCREEN 3: White Space
 * @default
 * 
 * @param screen446audio
 * @text Audio
 * @parent SCREEN 3: White Space
 * @default
 * 
 * @param screen446colorbg
 * @text Solid Color BG
 * @parent screen446bg
 * @type struct<RGB>
 * @default {"toggle":"true","red":"255","green":"255","blue":"255"}
 * 
 * @param screen446scrollingbg
 * @text Scrolling BG
 * @parent screen446bg
 * @type struct<ScrollingBG>
 * @default {"image":"","xspeed":"0","yspeed":"0"}
 * 
 * @param screen446stillbg
 * @text Still BG
 * @parent screen446bg
 * @type struct<StillBG>
 * @default {"image":""}
 * 
 * @param screen446animatedbg
 * @text Animated BG
 * @parent screen446bg
 * @type struct<AnimatedBG>
 * @default {"image":"","framerate":"45","framecount":"3","pattern":"[\"0\",\"1\",\"2\"]"}
 * 
 * @param screen446character
 * @text Character
 * @parent screen446objects
 * @type struct<Object>
 * @default {"image":"OMO_WS","width":"918","height":"351","framecount":"3","framerate":"20","pattern":"[\"0\",\"1\",\"2\"]"}
 * 
 * @param screen446characterglitch
 * @text Glitch Character
 * @parent screen446objects
 * @type struct<ObjectGlitch>
 * @default {"glitchtoggle":"false","image":"","frequency":""}
 * 
 * @param screen446title
 * @text Title Toggle
 * @parent screen446objects
 * @type boolean
 * @default true
 * 
 * @param screen446titlelightbulb
 * @text Title Lightbulb
 * @parent screen446title
 * @type struct<Title>
 * @default {"image":"OMO_BULB_WS"}
 * 
 * @param screen446titleglow
 * @text Title Glow
 * @parent screen446title
 * @type struct<Object>
 * @default {"image":"OMO_BULB_WS_LINES","width":"204","height":"150","framecount":"3","framerate":"15","pattern":"[\"0\",\"1\",\"2\",\"1\"]"}
 * 
 * @param screen446titletext
 * @text Title Text
 * @parent screen446title
 * @type struct<Title>
 * @default {"image":"OMO_TITLE_WS"}
 * 
 * @param screen446customtitle
 * @text Custom Title
 * @parent screen446objects
 * @type struct<ObjectEX>
 * @default {"image":"","width":"","height":"","framecount":"","framerate":"","pattern":"[]","xpos":"","direction":"","ypos":""}
 * 
 * @param screen446bgm
 * @text BGM
 * @parent screen446audio
 * @type struct<AudioBGM>
 * @default {"bgm":"user_title","volume":"100","pitch":"100"}
 * 
 * @param screen446bgs
 * @text BGS
 * @parent screen446audio
 * @type struct<AudioBGS>
 * @default {"bgs":"","volume":"100","pitch":"100"}
 * 
 * @param SCREEN 4: Faraway
 * @default
 * 
 * @param screen447switch
 * @text Screen 4 Switch
 * @parent SCREEN 4: Faraway
 * @type number
 * @default 447
 * @desc The switch that, when enabled, switches to this title screen.
 * 
 * @param screen447bg
 * @text Background
 * @parent SCREEN 4: Faraway
 * @default
 * 
 * @param screen447objects
 * @text Objects
 * @parent SCREEN 4: Faraway
 * @default
 * 
 * @param screen447audio
 * @text Audio
 * @parent SCREEN 4: Faraway
 * @default
 * 
 * @param screen447colorbg
 * @text Solid Color BG
 * @parent screen447bg
 * @type struct<RGB>
 * @default {"toggle":"false","red":"0","green":"0","blue":"0"}
 * 
 * @param screen447scrollingbg
 * @text Scrolling BG
 * @parent screen447bg
 * @type struct<ScrollingBG>
 * @default {"image":"!polaroidBG_FA_day","xspeed":"0.5","yspeed":"-0.5"}
 * 
 * @param screen447stillbg
 * @text Still BG
 * @parent screen447bg
 * @type struct<StillBG>
 * @default {"image":""}
 * 
 * @param screen447animatedbg
 * @text Animated BG
 * @parent screen447bg
 * @type struct<AnimatedBG>
 * @default {"image":"","framerate":"45","framecount":"3","pattern":"[\"0\",\"1\",\"2\"]"}
 * 
 * @param screen447character
 * @text Character
 * @parent screen447objects
 * @type struct<Object>
 * @default {"image":"OMO_RS","width":"918","height":"351","framecount":"3","framerate":"20","pattern":"[\"0\",\"1\",\"2\"]"}
 * 
 * @param screen447characterglitch
 * @text Glitch Character
 * @parent screen447objects
 * @type struct<ObjectGlitch>
 * @default {"glitchtoggle":"false","image":"","frequency":""}
 * 
 * @param screen447title
 * @text Title Toggle
 * @parent screen447objects
 * @type boolean
 * @default true
 * 
 * @param screen447titlelightbulb
 * @text Title Lightbulb
 * @parent screen447title
 * @type struct<Title>
 * @default {"image":"OMO_BULB_WS"}
 * 
 * @param screen447titleglow
 * @text Title Glow
 * @parent screen447title
 * @type struct<Object>
 * @default {"image":"OMO_BULB_WS_LINES","width":"204","height":"150","framecount":"3","framerate":"15","pattern":"[\"0\",\"1\",\"2\",\"1\"]"}
 * 
 * @param screen447titletext
 * @text Title Text
 * @parent screen447title
 * @type struct<Title>
 * @default {"image":"OMO_TITLE_WS"}
 * 
 * @param screen447customtitle
 * @text Custom Title
 * @parent screen447objects
 * @type struct<ObjectEX>
 * @default {"image":"","width":"","height":"","framecount":"","framerate":"","pattern":"[]","xpos":"","direction":"","ypos":""}
 * 
 * @param screen447bgm
 * @text BGM
 * @parent screen447audio
 * @type struct<AudioBGM>
 * @default {"bgm":"duet_mari","volume":"100","pitch":"100"}
 * 
 * @param screen447bgs
 * @text BGS
 * @parent screen447audio
 * @type struct<AudioBGS>
 * @default {"bgs":"AMB_forest","volume":"50","pitch":"100"}
 * 
 * @param SCREEN 5: Bad End
 * @default
 * 
 * @param screen448switch
 * @text Screen 5 Switch
 * @parent SCREEN 5: Bad End
 * @type number
 * @default 448
 * @desc The switch that, when enabled, switches to this title screen.
 * 
 * @param screen448bg
 * @text Background
 * @parent SCREEN 5: Bad End
 * @default
 * 
 * @param screen448objects
 * @text Objects
 * @parent SCREEN 5: Bad End
 * @default
 * 
 * @param screen448audio
 * @text Audio
 * @parent SCREEN 5: Bad End
 * @default
 * 
 * @param screen448colorbg
 * @text Solid Color BG
 * @parent screen448bg
 * @type struct<RGB>
 * @default {"toggle":"false","red":"0","green":"0","blue":"0"}
 * 
 * @param screen448scrollingbg
 * @text Scrolling BG
 * @parent screen448bg
 * @type struct<ScrollingBG>
 * @default {"image":"!polaroidBG_FA_day","xspeed":"0.5","yspeed":"-0.5"}
 * 
 * @param screen448stillbg
 * @text Still BG
 * @parent screen448bg
 * @type struct<StillBG>
 * @default {"image":""}
 * 
 * @param screen448animatedbg
 * @text Animated BG
 * @parent screen448bg
 * @type struct<AnimatedBG>
 * @default {"image":"","framerate":"45","framecount":"3","pattern":"[\"0\",\"1\",\"2\"]"}
 * 
 * @param screen448character
 * @text Character
 * @parent screen448objects
 * @type struct<Object>
 * @default {"image":"","width":"918","height":"351","framecount":"3","framerate":"20","pattern":"[\"0\",\"1\",\"2\"]"}
 * 
 * @param screen448characterglitch
 * @text Glitch Character
 * @parent screen448objects
 * @type struct<ObjectGlitch>
 * @default {"glitchtoggle":"false","image":"","frequency":""}
 * 
 * @param screen448title
 * @text Title Toggle
 * @parent screen448objects
 * @type boolean
 * @default true
 * 
 * @param screen448titlelightbulb
 * @text Title Lightbulb
 * @parent screen448title
 * @type struct<Title>
 * @default {"image":"OMO_BULB_WS"}
 * 
 * @param screen448titleglow
 * @text Title Glow
 * @parent screen448title
 * @type struct<Object>
 * @default {"image":"OMO_BULB_WS_LINES","width":"204","height":"150","framecount":"3","framerate":"15","pattern":"[\"0\",\"1\",\"2\",\"1\"]"}
 * 
 * @param screen448titletext
 * @text Title Text
 * @parent screen448title
 * @type struct<Title>
 * @default {"image":"OMO_TITLE_WS"}
 * 
 * @param screen448customtitle
 * @text Custom Title
 * @parent screen448objects
 * @type struct<ObjectEX>
 * @default {"image":"","width":"","height":"","framecount":"","framerate":"","pattern":"[]","xpos":"","direction":"","ypos":""}
 * 
 * @param screen448bgm
 * @text BGM
 * @parent screen448audio
 * @type struct<AudioBGM>
 * @default {"bgm":"AMB_forest","volume":"100","pitch":"100"}
 * 
 * @param screen448bgs
 * @text BGS
 * @parent screen448audio
 * @type struct<AudioBGS>
 * @default {"bgs":"","volume":"100","pitch":"100"}
 * 
 * @param SCREEN 6: Good End
 * @default
 *
 * @param screen449switch
 * @text Screen 6 Switch
 * @parent SCREEN 6: Good End
 * @type number
 * @default 449
 * @desc The switch that, when enabled, switches to this title screen.
 * 
 * @param screen449bg
 * @text Background
 * @parent SCREEN 6: Good End
 * @default
 * 
 * @param screen449objects
 * @text Objects
 * @parent SCREEN 6: Good End
 * @default
 * 
 * @param screen449audio
 * @text Audio
 * @parent SCREEN 6: Good End
 * @default
 * 
 * @param screen449colorbg
 * @text Solid Color BG
 * @parent screen449bg
 * @type struct<RGB>
 * @default {"toggle":"false","red":"0","green":"0","blue":"0"}
 * 
 * @param screen449scrollingbg
 * @text Scrolling BG
 * @parent screen449bg
 * @type struct<ScrollingBG>
 * @default {"image":"!polaroidBG_FA_day","xspeed":"0.5","yspeed":"-0.5"}
 * 
 * @param screen449stillbg
 * @text Still BG
 * @parent screen449bg
 * @type struct<StillBG>
 * @default {"image":""}
 * 
 * @param screen449animatedbg
 * @text Animated BG
 * @parent screen449bg
 * @type struct<AnimatedBG>
 * @default {"image":"","framerate":"45","framecount":"3","pattern":"[\"0\",\"1\",\"2\"]"}
 * 
 * @param screen449character
 * @text Character
 * @parent screen449objects
 * @type struct<Object>
 * @default {"image":"OMO_RS","width":"918","height":"351","framecount":"3","framerate":"20","pattern":"[\"0\",\"1\",\"2\"]"}
 * 
 * @param screen449characterglitch
 * @text Glitch Character
 * @parent screen449objects
 * @type struct<ObjectGlitch>
 * @default {"glitchtoggle":"false","image":"","frequency":""}
 * 
 * @param screen449title
 * @text Title Toggle
 * @parent screen449objects
 * @type boolean
 * @default true
 * 
 * @param screen449titlelightbulb
 * @text Title Lightbulb
 * @parent screen449title
 * @type struct<Title>
 * @default {"image":"OMO_BULB_WS"}
 * 
 * @param screen449titleglow
 * @text Title Glow
 * @parent screen449title
 * @type struct<Object>
 * @default {"image":"OMO_BULB_WS_LINES","width":"204","height":"150","framecount":"3","framerate":"15","pattern":"[\"0\",\"1\",\"2\",\"1\"]"}
 * 
 * @param screen449titletext
 * @text Title Text
 * @parent screen449title
 * @type struct<Title>
 * @default {"image":"OMO_TITLE_WS"}
 * 
 * @param screen449customtitle
 * @text Custom Title
 * @parent screen449objects
 * @type struct<ObjectEX>
 * @default {"image":"","width":"","height":"","framecount":"","framerate":"","pattern":"[]","xpos":"","direction":"","ypos":""}
 * 
 * @param screen449bgm
 * @text BGM
 * @parent screen449audio
 * @type struct<AudioBGM>
 * @default {"bgm":"duet_mari","volume":"100","pitch":"100"}
 * 
 * @param screen449bgs
 * @text BGS
 * @parent screen449audio
 * @type struct<AudioBGS>
 * @default {"bgs":"AMB_forest","volume":"50","pitch":"100"}
 * 
 * 
 *
 */
/*~struct~RGB:
* @param toggle
* @type boolean
* @desc Whether the color background is turned on or not.
* 
* @param red
* @type number
* @min 0
* @max 255
* @desc Red value
*
* @param green
* @type number
* @min 0
* @max 255
* @desc Green value
* 
* @param blue
* @type number
* @min 0
* @max 255
* @desc Blue value
*
*/
/*~struct~AnimatedBG:
* @param image
* @type file
* @text Image
* @dir img/parallaxes/
* @desc Image file used for the background animation.
* Image goes in img/parallaxes. Dimensions 640x480 per frame.
* Frames are lined up horizontally.
* 
* @param framerate
* @text Framerate
* @type number
* @desc Number of in-game frames between each frame switch.
* 
* @param framecount
* @text Frame Count
* @type number
* @desc How many frames are in the image
* 
* @param pattern
* @text Frame pattern
* @type number[]
* @desc Order of frames (count from 0 to total number of frames - 1)
*
*/
/*~struct~ScrollingBG:
* @param image
* @type file
* @text Image
* @dir img/parallaxes/
* @desc Image file used for the scrolling background.
* Image goes in img/parallaxes. No specific dimensions.
* Leave this empty for no image.
* 
* @param xspeed
* @text Horizontal Speed
* @type number
* @desc Horizontal scroll speed for the scrolling parallax background.
* 
* @param yspeed
* @text Vertical Speed
* @type number
* @desc Vertical scroll speed for the scrolling parallax background.
*
*/
/*~struct~StillBG:
* @param image
* @type file
* @text Image
* @dir img/parallaxes/
* @desc Image file used for the still background.
* Image goes in img/parallaxes. Dimensions 640x480.
* Leave this empty for no image.
*
*/
/*~struct~Object:
* @param image
* @type file
* @text Image
* @dir img/pictures/
* @desc Image file used for the character.
* Image goes in img/pictures/. Dimensions under 640x480 per frame.
* Leave empty for no character. Animation frames arranged horizontally.
* 
* @param width
* @text Image File Width
* @type number
* @desc The width of the image file.
* 
* @param height
* @text Image File Height
* @type number
* @desc The height of the image file.
* 
* @param framecount
* @text Frame Count
* @type number
* @desc The number of frames in the character's image sheet.
* 
* @param framerate
* @text Framerate
* @type number
* @desc Number of in-game frames between each frame switch
* 
* @param pattern
* @text Frame pattern
* @type number[]
* @desc Order of frames (count from 0 to total number of frames - 1)
*
*/
/*~struct~ObjectEX:
* @param image
* @type file
* @text Image
* @dir img/pictures/
* @desc Image file used for the character.
* Image goes in img/pictures/. Dimensions under 640x480 per frame.
* Leave empty for no character. Animation frames arranged horizontally.
* 
* @param width
* @text Image File Width
* @type number
* @desc The width of the image file.
* 
* @param height
* @text Image File Height
* @type number
* @desc The height of the image file.
* 
* @param framecount
* @text Frame Count
* @type number
* @desc The number of frames in the character's image sheet.
* 
* @param framerate
* @text Framerate
* @type number
* @desc Number of in-game frames between each frame switch
* 
* @param pattern
* @text Frame pattern
* @type number[]
* @desc Order of frames (count from 0 to total number of frames - 1)
* 
* @param xpos
* @text Horizontal shift
* @type number
* @desc The horizontal offset in pixels from the center of the screen
* 
* @param direction
* @text Shift direction
* @type boolean
* @on LEFT
* @off RIGHT
* @desc The direction of the horizontal offset
* 
* @param ypos
* @text Vertical position
* @type number
* @min 0
* @max 440
* @desc Number of pixels from initial position that the title is shifted downward
*/
/*~struct~ObjectGlitch:
* @param glitchtoggle
* @text Glitch Animation Toggle
* @type boolean
* @desc Whether the character has the Red Space glitch animation.
* 
* @param image
* @type file
* @text Image
* @dir img/pictures/
* @desc Image file that the character glitches to. Image goes in img/pictures/. 
* Dimensions SAME AS THE CHARACTER IMAGE. CANNOT LEAVE EMPTY IF ENABLED. Uses same 
* pattern and amount of frames. Note: Can leave empty space for diff. sized chars.
* 
* @param frequency
* @text Frequency
* @type number
* @desc How many frames between each glitch.
*/
/*~struct~Title:
 * @param image
 * @type file
 * @text Image
 * @dir img/pictures/
 * @desc Image file used for the title object.
 * Image goes in img/pictures/. Dimensions under 640x480.
 * Leave blank for none.
 *
 */
/*~struct~AudioBGM:
* @param bgm
* @type file
* @text BGM
* @dir audio/bgm/
* @desc BGM that plays during the title screen.
* Audio goes in audio/bgm/. Leave empty for none.
* 
* @param volume
* @text Volume
* @type number
* @desc BGM volume.
* @default 100
* 
* @param pitch
* @text Pitch
* @type number
* @desc BGM pitch.
* @default 100
*/
/*~struct~AudioBGS:
* @param bgs
* @type file
* @text BGS
* @dir audio/bgs/
* @desc BGS that plays during the title screen.
* Audio goes in audio/bgs/. Leave empty for none.
* 
* @param volume
* @text Volume
* @type number
* @desc BGS volume.
* @default 100
* 
* @param pitch
* @text Pitch
* @type number
* @desc BGS pitch.
* @default 100
*/
//=============================================================================

var Imported = Imported || {};
Imported.FD_EasyTitleScreen = true;

var FD = FD || {};
FD.EasyTitleScreen = FD.EasyTitleScreen || {};
FD.EasyTitleScreen.Param = PluginManager.parameters('FD_EasyTitleScreen');

Title = FD.EasyTitleScreen;

FD.EasyTitleScreen.AppliedToAll = FD.EasyTitleScreen.AppliedToAll || {};
FD.EasyTitleScreen.Default = FD.EasyTitleScreen.Default || {};
FD.EasyTitleScreen.Screen1 = FD.EasyTitleScreen.Screen1 || {};
FD.EasyTitleScreen.Screen2 = FD.EasyTitleScreen.Screen2 || {};
FD.EasyTitleScreen.Screen3 = FD.EasyTitleScreen.Screen3 || {};
FD.EasyTitleScreen.Screen4 = FD.EasyTitleScreen.Screen4 || {};
FD.EasyTitleScreen.Screen5 = FD.EasyTitleScreen.Screen5 || {};
FD.EasyTitleScreen.Screen6 = FD.EasyTitleScreen.Screen6 || {};

// =============
// APPLIED TO ALL
// =============

Title.AppliedToAll.characterOn = eval(Title.Param["characteron"])
Title.AppliedToAll.titleOn = eval(Title.Param["titleon"])
Title.AppliedToAll.titleBulbOn = eval(Title.Param["titlelightbulbon"])
Title.AppliedToAll.titleGlowOn = eval(Title.Param["titleglowon"])
Title.AppliedToAll.titleTextOn = eval(Title.Param["titletexton"])

// =============
// DEFAULT
// =============

Title.Switches = [0]
Title.Default.Switch = 100000

Title.Default.ColorBG = JSON.parse(Title.Param["defaultcolorbg"])
Title.Default.ColorBG.toggle = eval(Title.Default.ColorBG["toggle"])
Title.Default.ColorBG.red = Number(Title.Default.ColorBG["red"])
Title.Default.ColorBG.green = Number(Title.Default.ColorBG["green"])
Title.Default.ColorBG.blue = Number(Title.Default.ColorBG["blue"])

Title.Default.ScrollingBG = JSON.parse(Title.Param["defaultscrollingbg"])
Title.Default.ScrollingBG.xspeed = Number(Title.Default.ScrollingBG["xspeed"])
Title.Default.ScrollingBG.yspeed = Number(Title.Default.ScrollingBG["yspeed"])

Title.Default.StillBG = JSON.parse(Title.Param["defaultstillbg"])

Title.Default.AnimatedBG = JSON.parse(Title.Param["defaultanimatedbg"])
Title.Default.AnimatedBG.framerate = Number(Title.Default.AnimatedBG.framerate)
Title.Default.AnimatedBG.framecount = Number(Title.Default.AnimatedBG.framecount)
Title.Default.AnimatedBG.pattern = JSON.parse(Title.Default.AnimatedBG.pattern).map(Number)

Title.Default.Character = JSON.parse(Title.Param["defaultcharacter"])
Title.Default.Character.width = Number(Title.Default.Character.width)
Title.Default.Character.height = Number(Title.Default.Character.height)
Title.Default.Character.framecount = Number(Title.Default.Character.framecount)
Title.Default.Character.framerate = Number(Title.Default.Character.framerate)
Title.Default.Character.pattern = JSON.parse(Title.Default.Character.pattern).map(Number)

Title.Default.CharacterGlitch = JSON.parse(Title.Param["defaultcharacterglitch"])
Title.Default.CharacterGlitch.glitchtoggle = eval(Title.Default.CharacterGlitch.glitchtoggle)
Title.Default.CharacterGlitch.frequency = Number(Title.Default.CharacterGlitch.frequency)

Title.Default.Title = Title.Default.Title || {};
Title.Default.Title.toggle = eval(Title.Param["defaulttitle"])
Title.Default.Title.lightbulb = JSON.parse(Title.Param["defaulttitlelightbulb"])
Title.Default.Title.glow = JSON.parse(Title.Param["defaulttitleglow"])
Title.Default.Title.glow.width = Number(Title.Default.Title.glow.width)
Title.Default.Title.glow.height = Number(Title.Default.Title.glow.height)
Title.Default.Title.glow.framecount = Number(Title.Default.Title.glow.framecount)
Title.Default.Title.glow.framerate = Number(Title.Default.Title.glow.framerate)
Title.Default.Title.glow.pattern = JSON.parse(Title.Default.Title.glow.pattern).map(Number)
Title.Default.Title.text = JSON.parse(Title.Param["defaulttitletext"])

Title.Default.CustomTitle = JSON.parse(Title.Param["defaultcustomtitle"])
Title.Default.CustomTitle.width = Number(Title.Default.CustomTitle.width)
Title.Default.CustomTitle.height = Number(Title.Default.CustomTitle.height)
Title.Default.CustomTitle.framecount = Number(Title.Default.CustomTitle.framecount)
Title.Default.CustomTitle.framerate = Number(Title.Default.CustomTitle.framerate)
Title.Default.CustomTitle.pattern = JSON.parse(Title.Default.CustomTitle.pattern).map(Number)
Title.Default.CustomTitle.direction = eval(Title.Default.CustomTitle.direction)
if (Title.Default.CustomTitle.direction) Title.Default.CustomTitle.direction = -1
Title.Default.CustomTitle.xpos = Number(Title.Default.CustomTitle.xpos) * Title.Default.CustomTitle.direction
Title.Default.CustomTitle.ypos = Number(Title.Default.CustomTitle.ypos)

Title.Default.BGM = JSON.parse(Title.Param["defaultbgm"])
Title.Default.BGM.volume = Number(Title.Default.BGM.volume)
Title.Default.BGM.pitch = Number(Title.Default.BGM.pitch)

Title.Default.BGS = JSON.parse(Title.Param["defaultbgs"])
Title.Default.BGS.volume = Number(Title.Default.BGS.volume)
Title.Default.BGS.pitch = Number(Title.Default.BGS.pitch)

// =============
// SCREEN 1
// =============

Title.Screen1.Switch = Number(Title.Param["screen444switch"])
Title.Switches.push(Title.Screen1.Switch)

Title.Screen1.ColorBG = JSON.parse(Title.Param["screen444colorbg"])
Title.Screen1.ColorBG.toggle = eval(Title.Screen1.ColorBG["toggle"])
Title.Screen1.ColorBG.red = Number(Title.Screen1.ColorBG["red"])
Title.Screen1.ColorBG.green = Number(Title.Screen1.ColorBG["green"])
Title.Screen1.ColorBG.blue = Number(Title.Screen1.ColorBG["blue"])

Title.Screen1.ScrollingBG = JSON.parse(Title.Param["screen444scrollingbg"])
Title.Screen1.ScrollingBG.xspeed = Number(Title.Screen1.ScrollingBG["xspeed"])
Title.Screen1.ScrollingBG.yspeed = Number(Title.Screen1.ScrollingBG["yspeed"])

Title.Screen1.StillBG = JSON.parse(Title.Param["screen444stillbg"])

Title.Screen1.AnimatedBG = JSON.parse(Title.Param["screen444animatedbg"])
Title.Screen1.AnimatedBG.framerate = Number(Title.Screen1.AnimatedBG.framerate)
Title.Screen1.AnimatedBG.framecount = Number(Title.Screen1.AnimatedBG.framecount)
Title.Screen1.AnimatedBG.pattern = JSON.parse(Title.Screen1.AnimatedBG.pattern).map(Number)

Title.Screen1.Character = JSON.parse(Title.Param["screen444character"])
Title.Screen1.Character.width = Number(Title.Screen1.Character.width)
Title.Screen1.Character.height = Number(Title.Screen1.Character.height)
Title.Screen1.Character.framecount = Number(Title.Screen1.Character.framecount)
Title.Screen1.Character.framerate = Number(Title.Screen1.Character.framerate)
Title.Screen1.Character.pattern = JSON.parse(Title.Screen1.Character.pattern).map(Number)

Title.Screen1.CharacterGlitch = JSON.parse(Title.Param["screen444characterglitch"])
Title.Screen1.CharacterGlitch.glitchtoggle = eval(Title.Screen1.CharacterGlitch.glitchtoggle)
Title.Screen1.CharacterGlitch.frequency = Number(Title.Screen1.CharacterGlitch.frequency)

Title.Screen1.Title = Title.Screen1.Title || {};
Title.Screen1.Title.toggle = eval(Title.Param["screen444title"])
Title.Screen1.Title.lightbulb = JSON.parse(Title.Param["screen444titlelightbulb"])
Title.Screen1.Title.glow = JSON.parse(Title.Param["screen444titleglow"])
Title.Screen1.Title.glow.width = Number(Title.Screen1.Title.glow.width)
Title.Screen1.Title.glow.height = Number(Title.Screen1.Title.glow.height)
Title.Screen1.Title.glow.framecount = Number(Title.Screen1.Title.glow.framecount)
Title.Screen1.Title.glow.framerate = Number(Title.Screen1.Title.glow.framerate)
Title.Screen1.Title.glow.pattern = JSON.parse(Title.Screen1.Title.glow.pattern).map(Number)
Title.Screen1.Title.text = JSON.parse(Title.Param["screen444titletext"])

Title.Screen1.CustomTitle = JSON.parse(Title.Param["screen444customtitle"])
Title.Screen1.CustomTitle.width = Number(Title.Screen1.CustomTitle.width)
Title.Screen1.CustomTitle.height = Number(Title.Screen1.CustomTitle.height)
Title.Screen1.CustomTitle.framecount = Number(Title.Screen1.CustomTitle.framecount)
Title.Screen1.CustomTitle.framerate = Number(Title.Screen1.CustomTitle.framerate)
Title.Screen1.CustomTitle.pattern = JSON.parse(Title.Screen1.CustomTitle.pattern).map(Number)
Title.Screen1.CustomTitle.direction = eval(Title.Screen1.CustomTitle.direction)
if (Title.Screen1.CustomTitle.direction) Title.Screen1.CustomTitle.direction = -1
Title.Screen1.CustomTitle.xpos = Number(Title.Screen1.CustomTitle.xpos) * Title.Screen1.CustomTitle.direction
Title.Default.CustomTitle.ypos = Number(Title.Screen1.CustomTitle.ypos)

Title.Screen1.BGM = JSON.parse(Title.Param["screen444bgm"])
Title.Screen1.BGM.volume = Number(Title.Screen1.BGM.volume)
Title.Screen1.BGM.pitch = Number(Title.Screen1.BGM.pitch)

Title.Screen1.BGS = JSON.parse(Title.Param["screen444bgs"])
Title.Screen1.BGS.volume = Number(Title.Screen1.BGS.volume)
Title.Screen1.BGS.pitch = Number(Title.Screen1.BGS.pitch)

// =============
// SCREEN 2
// =============

Title.Screen2.Switch = Number(Title.Param["screen445switch"])
Title.Switches.push(Title.Screen2.Switch)

Title.Screen2.ColorBG = JSON.parse(Title.Param["screen445colorbg"])
Title.Screen2.ColorBG.toggle = eval(Title.Screen2.ColorBG["toggle"])
Title.Screen2.ColorBG.red = Number(Title.Screen2.ColorBG["red"])
Title.Screen2.ColorBG.green = Number(Title.Screen2.ColorBG["green"])
Title.Screen2.ColorBG.blue = Number(Title.Screen2.ColorBG["blue"])

Title.Screen2.ScrollingBG = JSON.parse(Title.Param["screen445scrollingbg"])
Title.Screen2.ScrollingBG.xspeed = Number(Title.Screen2.ScrollingBG["xspeed"])
Title.Screen2.ScrollingBG.yspeed = Number(Title.Screen2.ScrollingBG["yspeed"])

Title.Screen2.StillBG = JSON.parse(Title.Param["screen445stillbg"])

Title.Screen2.AnimatedBG = JSON.parse(Title.Param["screen445animatedbg"])
Title.Screen2.AnimatedBG.framerate = Number(Title.Screen2.AnimatedBG.framerate)
Title.Screen2.AnimatedBG.framecount = Number(Title.Screen2.AnimatedBG.framecount)
Title.Screen2.AnimatedBG.pattern = JSON.parse(Title.Screen2.AnimatedBG.pattern).map(Number)

Title.Screen2.Character = JSON.parse(Title.Param["screen445character"])
Title.Screen2.Character.width = Number(Title.Screen2.Character.width)
Title.Screen2.Character.height = Number(Title.Screen2.Character.height)
Title.Screen2.Character.framecount = Number(Title.Screen2.Character.framecount)
Title.Screen2.Character.framerate = Number(Title.Screen2.Character.framerate)
Title.Screen2.Character.pattern = JSON.parse(Title.Screen2.Character.pattern).map(Number)

Title.Screen2.CharacterGlitch = JSON.parse(Title.Param["screen445characterglitch"])
Title.Screen2.CharacterGlitch.glitchtoggle = eval(Title.Screen2.CharacterGlitch.glitchtoggle)
Title.Screen2.CharacterGlitch.frequency = Number(Title.Screen2.CharacterGlitch.frequency)

Title.Screen2.Title = Title.Screen2.Title || {};
Title.Screen2.Title.toggle = eval(Title.Param["screen445title"])
Title.Screen2.Title.lightbulb = JSON.parse(Title.Param["screen445titlelightbulb"])
Title.Screen2.Title.glow = JSON.parse(Title.Param["screen445titleglow"])
Title.Screen2.Title.glow.width = Number(Title.Screen2.Title.glow.width)
Title.Screen2.Title.glow.height = Number(Title.Screen2.Title.glow.height)
Title.Screen2.Title.glow.framecount = Number(Title.Screen2.Title.glow.framecount)
Title.Screen2.Title.glow.framerate = Number(Title.Screen2.Title.glow.framerate)
Title.Screen2.Title.glow.pattern = JSON.parse(Title.Screen2.Title.glow.pattern).map(Number)
Title.Screen2.Title.text = JSON.parse(Title.Param["screen445titletext"])

Title.Screen2.CustomTitle = JSON.parse(Title.Param["screen445customtitle"])
Title.Screen2.CustomTitle.width = Number(Title.Screen2.CustomTitle.width)
Title.Screen2.CustomTitle.height = Number(Title.Screen2.CustomTitle.height)
Title.Screen2.CustomTitle.framecount = Number(Title.Screen2.CustomTitle.framecount)
Title.Screen2.CustomTitle.framerate = Number(Title.Screen2.CustomTitle.framerate)
Title.Screen2.CustomTitle.pattern = JSON.parse(Title.Screen2.CustomTitle.pattern).map(Number)
Title.Screen2.CustomTitle.direction = eval(Title.Screen2.CustomTitle.direction)
if (Title.Screen2.CustomTitle.direction) Title.Screen2.CustomTitle.direction = -1
Title.Screen2.CustomTitle.xpos = Number(Title.Screen2.CustomTitle.xpos) * Title.Screen2.CustomTitle.direction
Title.Screen2.CustomTitle.ypos = Number(Title.Screen2.CustomTitle.ypos)

Title.Screen2.BGM = JSON.parse(Title.Param["screen445bgm"])
Title.Screen2.BGM.volume = Number(Title.Screen2.BGM.volume)
Title.Screen2.BGM.pitch = Number(Title.Screen2.BGM.pitch)

Title.Screen2.BGS = JSON.parse(Title.Param["screen445bgs"])
Title.Screen2.BGS.volume = Number(Title.Screen2.BGS.volume)
Title.Screen2.BGS.pitch = Number(Title.Screen2.BGS.pitch)

// =============
// SCREEN 3
// =============

Title.Screen3.Switch = Number(Title.Param["screen446switch"])
Title.Switches.push(Title.Screen3.Switch)

Title.Screen3.ColorBG = JSON.parse(Title.Param["screen446colorbg"])
Title.Screen3.ColorBG.toggle = eval(Title.Screen3.ColorBG["toggle"])
Title.Screen3.ColorBG.red = Number(Title.Screen3.ColorBG["red"])
Title.Screen3.ColorBG.green = Number(Title.Screen3.ColorBG["green"])
Title.Screen3.ColorBG.blue = Number(Title.Screen3.ColorBG["blue"])

Title.Screen3.ScrollingBG = JSON.parse(Title.Param["screen446scrollingbg"])
Title.Screen3.ScrollingBG.xspeed = Number(Title.Screen3.ScrollingBG["xspeed"])
Title.Screen3.ScrollingBG.yspeed = Number(Title.Screen3.ScrollingBG["yspeed"])

Title.Screen3.StillBG = JSON.parse(Title.Param["screen446stillbg"])

Title.Screen3.AnimatedBG = JSON.parse(Title.Param["screen446animatedbg"])
Title.Screen3.AnimatedBG.framerate = Number(Title.Screen3.AnimatedBG.framerate)
Title.Screen3.AnimatedBG.framecount = Number(Title.Screen3.AnimatedBG.framecount)
Title.Screen3.AnimatedBG.pattern = JSON.parse(Title.Screen3.AnimatedBG.pattern).map(Number)

Title.Screen3.Character = JSON.parse(Title.Param["screen446character"])
Title.Screen3.Character.width = Number(Title.Screen3.Character.width)
Title.Screen3.Character.height = Number(Title.Screen3.Character.height)
Title.Screen3.Character.framecount = Number(Title.Screen3.Character.framecount)
Title.Screen3.Character.framerate = Number(Title.Screen3.Character.framerate)
Title.Screen3.Character.pattern = JSON.parse(Title.Screen3.Character.pattern).map(Number)

Title.Screen3.CharacterGlitch = JSON.parse(Title.Param["screen446characterglitch"])
Title.Screen3.CharacterGlitch.glitchtoggle = eval(Title.Screen3.CharacterGlitch.glitchtoggle)
Title.Screen3.CharacterGlitch.frequency = Number(Title.Screen3.CharacterGlitch.frequency)

Title.Screen3.Title = Title.Screen3.Title || {};
Title.Screen3.Title.toggle = eval(Title.Param["screen446title"])
Title.Screen3.Title.lightbulb = JSON.parse(Title.Param["screen446titlelightbulb"])
Title.Screen3.Title.glow = JSON.parse(Title.Param["screen446titleglow"])
Title.Screen3.Title.glow.width = Number(Title.Screen3.Title.glow.width)
Title.Screen3.Title.glow.height = Number(Title.Screen3.Title.glow.height)
Title.Screen3.Title.glow.framecount = Number(Title.Screen3.Title.glow.framecount)
Title.Screen3.Title.glow.framerate = Number(Title.Screen3.Title.glow.framerate)
Title.Screen3.Title.glow.pattern = JSON.parse(Title.Screen3.Title.glow.pattern).map(Number)
Title.Screen3.Title.text = JSON.parse(Title.Param["screen446titletext"])

Title.Screen3.CustomTitle = JSON.parse(Title.Param["screen446customtitle"])
Title.Screen3.CustomTitle.width = Number(Title.Screen3.CustomTitle.width)
Title.Screen3.CustomTitle.height = Number(Title.Screen3.CustomTitle.height)
Title.Screen3.CustomTitle.framecount = Number(Title.Screen3.CustomTitle.framecount)
Title.Screen3.CustomTitle.framerate = Number(Title.Screen3.CustomTitle.framerate)
Title.Screen3.CustomTitle.pattern = JSON.parse(Title.Screen3.CustomTitle.pattern).map(Number)
Title.Screen3.CustomTitle.direction = eval(Title.Screen3.CustomTitle.direction)
if (Title.Screen3.CustomTitle.direction) Title.Screen3.CustomTitle.direction = -1
Title.Screen3.CustomTitle.xpos = Number(Title.Screen3.CustomTitle.xpos) * Title.Screen3.CustomTitle.direction
Title.Screen3.CustomTitle.ypos = Number(Title.Screen3.CustomTitle.ypos)

Title.Screen3.BGM = JSON.parse(Title.Param["screen446bgm"])
Title.Screen3.BGM.volume = Number(Title.Screen3.BGM.volume)
Title.Screen3.BGM.pitch = Number(Title.Screen3.BGM.pitch)

Title.Screen3.BGS = JSON.parse(Title.Param["screen446bgs"])
Title.Screen3.BGS.volume = Number(Title.Screen3.BGS.volume)
Title.Screen3.BGS.pitch = Number(Title.Screen3.BGS.pitch)

// =============
// SCREEN 4
// =============

Title.Screen4.Switch = Number(Title.Param["screen447switch"])
Title.Switches.push(Title.Screen4.Switch)

Title.Screen4.ColorBG = JSON.parse(Title.Param["screen447colorbg"])
Title.Screen4.ColorBG.toggle = eval(Title.Screen4.ColorBG["toggle"])
Title.Screen4.ColorBG.red = Number(Title.Screen4.ColorBG["red"])
Title.Screen4.ColorBG.green = Number(Title.Screen4.ColorBG["green"])
Title.Screen4.ColorBG.blue = Number(Title.Screen4.ColorBG["blue"])

Title.Screen4.ScrollingBG = JSON.parse(Title.Param["screen447scrollingbg"])
Title.Screen4.ScrollingBG.xspeed = Number(Title.Screen4.ScrollingBG["xspeed"])
Title.Screen4.ScrollingBG.yspeed = Number(Title.Screen4.ScrollingBG["yspeed"])

Title.Screen4.StillBG = JSON.parse(Title.Param["screen447stillbg"])

Title.Screen4.AnimatedBG = JSON.parse(Title.Param["screen447animatedbg"])
Title.Screen4.AnimatedBG.framerate = Number(Title.Screen4.AnimatedBG.framerate)
Title.Screen4.AnimatedBG.framecount = Number(Title.Screen4.AnimatedBG.framecount)
Title.Screen4.AnimatedBG.pattern = JSON.parse(Title.Screen4.AnimatedBG.pattern).map(Number)

Title.Screen4.Character = JSON.parse(Title.Param["screen447character"])
Title.Screen4.Character.width = Number(Title.Screen4.Character.width)
Title.Screen4.Character.height = Number(Title.Screen4.Character.height)
Title.Screen4.Character.framecount = Number(Title.Screen4.Character.framecount)
Title.Screen4.Character.framerate = Number(Title.Screen4.Character.framerate)
Title.Screen4.Character.pattern = JSON.parse(Title.Screen4.Character.pattern).map(Number)

Title.Screen4.CharacterGlitch = JSON.parse(Title.Param["screen447characterglitch"])
Title.Screen4.CharacterGlitch.glitchtoggle = eval(Title.Screen4.CharacterGlitch.glitchtoggle)
Title.Screen4.CharacterGlitch.frequency = Number(Title.Screen4.CharacterGlitch.frequency)

Title.Screen4.Title = Title.Screen4.Title || {};
Title.Screen4.Title.toggle = eval(Title.Param["screen447title"])
Title.Screen4.Title.lightbulb = JSON.parse(Title.Param["screen447titlelightbulb"])
Title.Screen4.Title.glow = JSON.parse(Title.Param["screen447titleglow"])
Title.Screen4.Title.glow.width = Number(Title.Screen4.Title.glow.width)
Title.Screen4.Title.glow.height = Number(Title.Screen4.Title.glow.height)
Title.Screen4.Title.glow.framecount = Number(Title.Screen4.Title.glow.framecount)
Title.Screen4.Title.glow.framerate = Number(Title.Screen4.Title.glow.framerate)
Title.Screen4.Title.glow.pattern = JSON.parse(Title.Screen4.Title.glow.pattern).map(Number)
Title.Screen4.Title.text = JSON.parse(Title.Param["screen447titletext"])

Title.Screen4.CustomTitle = JSON.parse(Title.Param["screen447customtitle"])
Title.Screen4.CustomTitle.width = Number(Title.Screen4.CustomTitle.width)
Title.Screen4.CustomTitle.height = Number(Title.Screen4.CustomTitle.height)
Title.Screen4.CustomTitle.framecount = Number(Title.Screen4.CustomTitle.framecount)
Title.Screen4.CustomTitle.framerate = Number(Title.Screen4.CustomTitle.framerate)
Title.Screen4.CustomTitle.pattern = JSON.parse(Title.Screen4.CustomTitle.pattern).map(Number)
Title.Screen4.CustomTitle.direction = eval(Title.Screen4.CustomTitle.direction)
if (Title.Screen4.CustomTitle.direction) Title.Screen4.CustomTitle.direction = -1
Title.Screen4.CustomTitle.xpos = Number(Title.Screen4.CustomTitle.xpos) * Title.Screen4.CustomTitle.direction
Title.Screen4.CustomTitle.ypos = Number(Title.Screen4.CustomTitle.ypos)

Title.Screen4.BGM = JSON.parse(Title.Param["screen447bgm"])
Title.Screen4.BGM.volume = Number(Title.Screen4.BGM.volume)
Title.Screen4.BGM.pitch = Number(Title.Screen4.BGM.pitch)

Title.Screen4.BGS = JSON.parse(Title.Param["screen447bgs"])
Title.Screen4.BGS.volume = Number(Title.Screen4.BGS.volume)
Title.Screen4.BGS.pitch = Number(Title.Screen4.BGS.pitch)

// =============
// SCREEN 5
// =============

Title.Screen5.Switch = Number(Title.Param["screen448switch"])
Title.Switches.push(Title.Screen5.Switch)

Title.Screen5.ColorBG = JSON.parse(Title.Param["screen448colorbg"])
Title.Screen5.ColorBG.toggle = eval(Title.Screen5.ColorBG["toggle"])
Title.Screen5.ColorBG.red = Number(Title.Screen5.ColorBG["red"])
Title.Screen5.ColorBG.green = Number(Title.Screen5.ColorBG["green"])
Title.Screen5.ColorBG.blue = Number(Title.Screen5.ColorBG["blue"])

Title.Screen5.ScrollingBG = JSON.parse(Title.Param["screen448scrollingbg"])
Title.Screen5.ScrollingBG.xspeed = Number(Title.Screen5.ScrollingBG["xspeed"])
Title.Screen5.ScrollingBG.yspeed = Number(Title.Screen5.ScrollingBG["yspeed"])

Title.Screen5.StillBG = JSON.parse(Title.Param["screen448stillbg"])

Title.Screen5.AnimatedBG = JSON.parse(Title.Param["screen448animatedbg"])
Title.Screen5.AnimatedBG.framerate = Number(Title.Screen5.AnimatedBG.framerate)
Title.Screen5.AnimatedBG.framecount = Number(Title.Screen5.AnimatedBG.framecount)
Title.Screen5.AnimatedBG.pattern = JSON.parse(Title.Screen5.AnimatedBG.pattern).map(Number)

Title.Screen5.Character = JSON.parse(Title.Param["screen448character"])
Title.Screen5.Character.width = Number(Title.Screen5.Character.width)
Title.Screen5.Character.height = Number(Title.Screen5.Character.height)
Title.Screen5.Character.framecount = Number(Title.Screen5.Character.framecount)
Title.Screen5.Character.framerate = Number(Title.Screen5.Character.framerate)
Title.Screen5.Character.pattern = JSON.parse(Title.Screen5.Character.pattern).map(Number)

Title.Screen5.CharacterGlitch = JSON.parse(Title.Param["screen448characterglitch"])
Title.Screen5.CharacterGlitch.glitchtoggle = eval(Title.Screen5.CharacterGlitch.glitchtoggle)
Title.Screen5.CharacterGlitch.frequency = Number(Title.Screen5.CharacterGlitch.frequency)

Title.Screen5.Title = Title.Screen5.Title || {};
Title.Screen5.Title.toggle = eval(Title.Param["screen448title"])
Title.Screen5.Title.lightbulb = JSON.parse(Title.Param["screen448titlelightbulb"])
Title.Screen5.Title.glow = JSON.parse(Title.Param["screen448titleglow"])
Title.Screen5.Title.glow.width = Number(Title.Screen5.Title.glow.width)
Title.Screen5.Title.glow.height = Number(Title.Screen5.Title.glow.height)
Title.Screen5.Title.glow.framecount = Number(Title.Screen5.Title.glow.framecount)
Title.Screen5.Title.glow.framerate = Number(Title.Screen5.Title.glow.framerate)
Title.Screen5.Title.glow.pattern = JSON.parse(Title.Screen5.Title.glow.pattern).map(Number)
Title.Screen5.Title.text = JSON.parse(Title.Param["screen448titletext"])

Title.Screen5.CustomTitle = JSON.parse(Title.Param["screen448customtitle"])
Title.Screen5.CustomTitle.width = Number(Title.Screen5.CustomTitle.width)
Title.Screen5.CustomTitle.height = Number(Title.Screen5.CustomTitle.height)
Title.Screen5.CustomTitle.framecount = Number(Title.Screen5.CustomTitle.framecount)
Title.Screen5.CustomTitle.framerate = Number(Title.Screen5.CustomTitle.framerate)
Title.Screen5.CustomTitle.pattern = JSON.parse(Title.Screen5.CustomTitle.pattern).map(Number)
Title.Screen5.CustomTitle.direction = eval(Title.Screen5.CustomTitle.direction)
if (Title.Screen5.CustomTitle.direction) Title.Screen5.CustomTitle.direction = -1
Title.Screen5.CustomTitle.xpos = Number(Title.Screen5.CustomTitle.xpos) * Title.Screen5.CustomTitle.direction
Title.Screen5.CustomTitle.ypos = Number(Title.Screen5.CustomTitle.ypos)

Title.Screen5.BGM = JSON.parse(Title.Param["screen448bgm"])
Title.Screen5.BGM.volume = Number(Title.Screen5.BGM.volume)
Title.Screen5.BGM.pitch = Number(Title.Screen5.BGM.pitch)

Title.Screen5.BGS = JSON.parse(Title.Param["screen448bgs"])
Title.Screen5.BGS.volume = Number(Title.Screen5.BGS.volume)
Title.Screen5.BGS.pitch = Number(Title.Screen5.BGS.pitch)

// =============
// SCREEN 6
// =============

Title.Screen6.Switch = Number(Title.Param["screen449switch"])
Title.Switches.push(Title.Screen6.Switch)

Title.Screen6.ColorBG = JSON.parse(Title.Param["screen449colorbg"])
Title.Screen6.ColorBG.toggle = eval(Title.Screen6.ColorBG["toggle"])
Title.Screen6.ColorBG.red = Number(Title.Screen6.ColorBG["red"])
Title.Screen6.ColorBG.green = Number(Title.Screen6.ColorBG["green"])
Title.Screen6.ColorBG.blue = Number(Title.Screen6.ColorBG["blue"])

Title.Screen6.ScrollingBG = JSON.parse(Title.Param["screen449scrollingbg"])
Title.Screen6.ScrollingBG.xspeed = Number(Title.Screen6.ScrollingBG["xspeed"])
Title.Screen6.ScrollingBG.yspeed = Number(Title.Screen6.ScrollingBG["yspeed"])

Title.Screen6.StillBG = JSON.parse(Title.Param["screen449stillbg"])

Title.Screen6.AnimatedBG = JSON.parse(Title.Param["screen449animatedbg"])
Title.Screen6.AnimatedBG.framerate = Number(Title.Screen6.AnimatedBG.framerate)
Title.Screen6.AnimatedBG.framecount = Number(Title.Screen6.AnimatedBG.framecount)
Title.Screen6.AnimatedBG.pattern = JSON.parse(Title.Screen6.AnimatedBG.pattern).map(Number)

Title.Screen6.Character = JSON.parse(Title.Param["screen449character"])
Title.Screen6.Character.width = Number(Title.Screen6.Character.width)
Title.Screen6.Character.height = Number(Title.Screen6.Character.height)
Title.Screen6.Character.framecount = Number(Title.Screen6.Character.framecount)
Title.Screen6.Character.framerate = Number(Title.Screen6.Character.framerate)
Title.Screen6.Character.pattern = JSON.parse(Title.Screen6.Character.pattern).map(Number)

Title.Screen6.CharacterGlitch = JSON.parse(Title.Param["screen449characterglitch"])
Title.Screen6.CharacterGlitch.glitchtoggle = eval(Title.Screen6.CharacterGlitch.glitchtoggle)
Title.Screen6.CharacterGlitch.frequency = Number(Title.Screen6.CharacterGlitch.frequency)

Title.Screen6.Title = Title.Screen6.Title || {};
Title.Screen6.Title.toggle = eval(Title.Param["screen449title"])
Title.Screen6.Title.lightbulb = JSON.parse(Title.Param["screen449titlelightbulb"])
Title.Screen6.Title.glow = JSON.parse(Title.Param["screen449titleglow"])
Title.Screen6.Title.glow.width = Number(Title.Screen6.Title.glow.width)
Title.Screen6.Title.glow.height = Number(Title.Screen6.Title.glow.height)
Title.Screen6.Title.glow.framecount = Number(Title.Screen6.Title.glow.framecount)
Title.Screen6.Title.glow.framerate = Number(Title.Screen6.Title.glow.framerate)
Title.Screen6.Title.glow.pattern = JSON.parse(Title.Screen6.Title.glow.pattern).map(Number)
Title.Screen6.Title.text = JSON.parse(Title.Param["screen449titletext"])

Title.Screen6.CustomTitle = JSON.parse(Title.Param["screen449customtitle"])
Title.Screen6.CustomTitle.width = Number(Title.Screen6.CustomTitle.width)
Title.Screen6.CustomTitle.height = Number(Title.Screen6.CustomTitle.height)
Title.Screen6.CustomTitle.framecount = Number(Title.Screen6.CustomTitle.framecount)
Title.Screen6.CustomTitle.framerate = Number(Title.Screen6.CustomTitle.framerate)
Title.Screen6.CustomTitle.pattern = JSON.parse(Title.Screen6.CustomTitle.pattern).map(Number)
Title.Screen6.CustomTitle.direction = eval(Title.Screen6.CustomTitle.direction)
if (Title.Screen6.CustomTitle.direction) Title.Screen6.CustomTitle.direction = -1
Title.Screen6.CustomTitle.xpos = Number(Title.Screen6.CustomTitle.xpos) * Title.Screen6.CustomTitle.direction
Title.Screen6.CustomTitle.ypos = Number(Title.Screen6.CustomTitle.ypos)

Title.Screen6.BGM = JSON.parse(Title.Param["screen449bgm"])
Title.Screen6.BGM.volume = Number(Title.Screen6.BGM.volume)
Title.Screen6.BGM.pitch = Number(Title.Screen6.BGM.pitch)

Title.Screen6.BGS = JSON.parse(Title.Param["screen449bgs"])
Title.Screen6.BGS.volume = Number(Title.Screen6.BGS.volume)
Title.Screen6.BGS.pitch = Number(Title.Screen6.BGS.pitch)





// FINALLLY THERES CODE

//=============================================================================
// * Initialize Object
//=============================================================================
Scene_OmoriTitleScreen.prototype.initialize = function () {

    var Title = FD.EasyTitleScreen

    // Set Image reservation Id
    this._imageReservationId = 'title';
    // Super Call
    Scene_BaseEX.prototype.initialize.call(this);
    // Get Atlas Bitmap
    //this._atlasBitmap = ImageManager.loadAtlas('Omori_TitleScreen');

    // World Type 0: Normal, 1: Dark space, 2: Red Space
    // Reads data of title screen images
    let tryFile = DataManager.readFromFile("File");
    let tryTitleData = DataManager.readFromFile("TITLEDATA");

    // gets current world type if one exists, otherwise sets it to 0
    if (!!tryTitleData) {
        this._worldType = parseInt(tryTitleData);
    }
    else if (!!tryFile) {
        this._worldType = parseInt(tryFile);
    }
    if (typeof this._worldType === "undefined") {
        this._worldType = 0;
    }
    // where the possible world types are declared
    // this is where new switches would be added 
    /* current declarations:
    *  0: default, 
        444: black space
        445: redspace (canon)
        446: whitespace (canon)
        447: faraway; good ending
        448: bad ending
        449: good ending
    */
    if (!Title.Switches.contains(this._worldType)) { this._worldType = 0; }
    // Set Command Active Flag
    this._commandActive = false;
    // Options Active Flag
    this._optionsActive = false;
    // Set Command Index Flag
    this._commandIndex = 0;
    // Instant Intro Flag
    this._instantIntro = false;
    // Determine if can continue
    this._canContinue = false;
    // Check if Save files exist
    for (var i = 1; i < 7; i++) {
        if (StorageManager.exists(i)) {
            this._canContinue = true;
            break;
        }
    };
    this._instantIntro = true;
};

Scene_OmoriTitleScreen.prototype.create = function () {
    // Super Call
    Scene_BaseEX.prototype.create.call(this);

    this.createFilters();

    this.createColorLayer();
    this.createScrollingLayer();
    this.createStillLayer();
    this.createAnimatedLayer();
    // Create Background
    //this.createBackground();
    // Create Omori Sprite
    this.createOmoriSprite();
    // Create Title Sprites
    this.createTitleSprites();
    this.createCustomTitle();
    // Create Title Commands
    this.createTitleCommands();
    // Create Command Hints
    this.createCommandHints();
    // Create Version Text
    this.createVersionText();
    // Create Options Windows
    this.createOptionWindowsContainer();
    this.createHelpWindow();
    this.createGeneralOptionsWindow();
    this.createAudioOptionsWindow();
    this.createControllerOptionsWindow();
    this.createSystemOptionsWindow();
    this.createExitPromptWindow();
    this.createOptionCategoriesWindow();

    // Update world bitmaps
    this.updateWorldBitmaps();
    this.playBgm();
    this.playBgs();
    // this._backgroundSprite.filters = [this._glitchFilter]
};

Scene_OmoriTitleScreen.prototype.getWorldTypeObject = function() {
    if (this._worldType === FD.EasyTitleScreen.Screen1.Switch){
        return FD.EasyTitleScreen.Screen1
    } else if (this._worldType === FD.EasyTitleScreen.Screen2.Switch){
        return FD.EasyTitleScreen.Screen2
    } else if (this._worldType === FD.EasyTitleScreen.Screen3.Switch){
        return FD.EasyTitleScreen.Screen3
    } else if (this._worldType === FD.EasyTitleScreen.Screen4.Switch){
        return FD.EasyTitleScreen.Screen4
    } else if (this._worldType === FD.EasyTitleScreen.Screen5.Switch){
        return FD.EasyTitleScreen.Screen5
    } else if (this._worldType === FD.EasyTitleScreen.Screen6.Switch){
        return FD.EasyTitleScreen.Screen6
    } else {
        return FD.EasyTitleScreen.Default
    }
}

Scene_OmoriTitleScreen.prototype.playBgm = function () {
    
    var Title = this.getWorldTypeObject()
    // Declares variable
    var name = Title.BGM.bgm
    if (name === "") {
        name = null
    }
    var volume = Title.BGM.volume; 
    var pitch = Title.BGM.pitch;
    
    // Looks at conditions where the title music might change and changes accordingly

    if (name) {
        AudioManager.playBgm({name: name, volume: volume, pitch: pitch});
    }

};

Scene_OmoriTitleScreen.prototype.playBgs = function () {
    
    var Title = this.getWorldTypeObject()
    // Declares variable
    var name = Title.BGS.bgs
    if (name === "") {
        name = null
    }
    var volume = Title.BGS.volume; 
    var pitch = Title.BGS.pitch;
    
    // Looks at conditions where the title music might change and changes accordingly

    if (name) {
        AudioManager.playBgs({name: name, volume: volume, pitch: pitch});
    }

};

Scene_OmoriTitleScreen.prototype.createColorLayer = function() {
    // Create Color Layer
    this._colorlayer = new TilingSprite();
    this._colorlayer.move(0, 0, Graphics.width, Graphics.height);
    this.addChild(this._colorlayer);

    var Title = this.getWorldTypeObject()

    var toggle = Title.ColorBG.toggle
    var red = Title.ColorBG.red
    var green = Title.ColorBG.green
    var blue = Title.ColorBG.blue

    if (toggle) {
        var bitmap = new Bitmap(Graphics.width, Graphics.height);
        bitmap.fillAll(`rgba(${red}, ${green}, ${blue}, 1)`)
        this._colorlayer.bitmap = bitmap; 
    }

    return;
};

Scene_OmoriTitleScreen.prototype.createScrollingLayer = function() {
    // Create Scrolling Layer
    this._scrollinglayer = new TilingSprite();
    this._scrollinglayer.move(0, 0, Graphics.width, Graphics.height);
    this.addChild(this._scrollinglayer);

    var Title = this.getWorldTypeObject()
    var image = Title.ScrollingBG.image

    this._scrollx = Title.ScrollingBG.xspeed
    this._scrolly = Title.ScrollingBG.yspeed

    if (image === ""){
        return;
    }

    this._scrollinglayer.bitmap = ImageManager.loadParallax(image);


    return;
};

Scene_OmoriTitleScreen.prototype.createStillLayer = function() {
    // Create Still Layer
    this._stilllayer = new TilingSprite();
    this._stilllayer.move(0, 0, Graphics.width, Graphics.height);
    this.addChild(this._stilllayer);

    var Title = this.getWorldTypeObject()
    var image = Title.StillBG.image

    if (image === ""){
        return;
    }

    this._stilllayer.bitmap = ImageManager.loadParallax(image);


    return;
};

Scene_OmoriTitleScreen.prototype.createAnimatedLayer = function() {
    // Create Animated Layer

    var Title = this.getWorldTypeObject()
    var image = Title.AnimatedBG.image

    if (image === ""){
        return;
    }

    this._animatedlayer = new Sprite(ImageManager.loadParallax(image));

    this._animatedlayer._framerate = Title.AnimatedBG.framerate
    this._animatedlayer._framecount = Title.AnimatedBG.framecount
    this._animatedlayer._pattern = Title.AnimatedBG.pattern

    this._animatedlayer.bitmap = ImageManager.loadParallax(image);
    this._animatedlayer.x = 0;
    this._animatedlayer.y = 0;
    this._animatedlayer.opacity = 255;
    this._animatedlayer.setFrame(0, 0, 0, 0);
    this._animatedlayer.visible = (image !== "")
    this.addChild(this._animatedlayer);

    return;
};

Scene_OmoriTitleScreen.prototype.createTitleSprites = function() {

    // Initializing and defining sprite dimensions and etc

    var Title = this.getWorldTypeObject()


    // Create Title Text Container Sprite (the sprite which contains everything included below)
    this._titleTextContainerSprite = new Sprite()
    this._titleTextContainerSprite.x = 167;
    this._titleTextContainerSprite.y = 130;
    this._titleTextContainerSprite.opacity = 0
    this.addChild(this._titleTextContainerSprite);


    if (!FD.EasyTitleScreen.AppliedToAll.titleOn || !Title.Title.toggle) {
        return;
    }
  
    // Select image of Lightbulb Sprite

    if (FD.EasyTitleScreen.AppliedToAll.titleBulbOn) {

        if (Title.Title.lightbulb.image === "") {
            
            this._lightBulbSprite = null;
        
        } else {

            this._lightBulbSprite = new Sprite(ImageManager.loadPicture(Title.Title.lightbulb.image))

            // Create Lightbulb Sprite
            this._lightBulbSprite.x = 120;
            this._lightBulbSprite.y = -2;
            this._titleTextContainerSprite.addChild(this._lightBulbSprite); // adds to Title Text Container
        }

    }

    // Pick the version of Lightbulb Lines sprite

    if (FD.EasyTitleScreen.AppliedToAll.titleGlowOn) {
        if (Title.Title.glow.image === "") {
            this._lightBulbLinesSprite = null;
        } else {
            this._lightBulbLinesSprite = new Sprite(ImageManager.loadPicture(Title.Title.glow.image))
            

            // Create the lines of the Lightbulb Sprite
            this._lightBulbLinesSprite._width = Title.Title.glow.width
            this._lightBulbLinesSprite._height = Title.Title.glow.height
            this._lightBulbLinesSprite._framecount = Title.Title.glow.framecount
            this._lightBulbLinesSprite._framerate = Title.Title.glow.framerate
            this._lightBulbLinesSprite._pattern = Title.Title.glow.pattern
            this._lightBulbLinesSprite.x = 120;
            this._lightBulbLinesSprite.y = 0;
            this._lightBulbLinesSprite.opacity = 0;
            this._lightBulbLinesSprite.setFrame(0, 0, 68, 150)
            this._titleTextContainerSprite.addChild(this._lightBulbLinesSprite); // adds to Title Text Container
        }
    }
  
    // Create Title Text Sprite

    if (FD.EasyTitleScreen.AppliedToAll.titleTextOn) {
        if (Title.Title.text.image === "" ){
            this._titleTextSprite = null
        } else {
            this._titleTextSprite = new Sprite(ImageManager.loadPicture(Title.Title.text.image))
            // Settings of title text
            this._titleTextSprite.opacity = 0;
            this._titleTextContainerSprite.addChild(this._titleTextSprite) // Adds to Title Text Container
        }
    }
    
};

Scene_OmoriTitleScreen.prototype.createCustomTitle = function() {
    // Create custom title Sprite

    var Title = this.getWorldTypeObject()
    var image = Title.CustomTitle.image

    if (image === ""){
        this._customTitle = null;
        return;
    }

    this._customTitle = new Sprite(ImageManager.loadPicture(image));

    // if the omori sprite doesnt exist (aka not assigned OR equal to null), it doesnt load it

    this._customTitle.anchor.set(0.5, 0)
    this._customTitle.x = (Graphics.width / 2) + Title.CustomTitle.xpos;
    this._customTitle.y = Title.CustomTitle.ypos;

    this._customTitle._width = Title.CustomTitle.width
    this._customTitle._height = Title.CustomTitle.height
    this._customTitle._pattern = Title.CustomTitle.pattern
    this._customTitle._framecount = Title.CustomTitle.framecount
    this._customTitle._framerate = Title.CustomTitle.framerate
    
    this._customTitle.opacity = 0;
    this._customTitle.setFrame(0, 0, 0, 0);

    this._customTitle.visible = true;
    this._customTitle.filterArea = new PIXI.Rectangle(0, 0, Graphics.width, Graphics.height + Math.floor(Graphics.height / 6));
    this.addChild(this._customTitle);

};

Scene_OmoriTitleScreen.prototype.createOmoriSprite = function() {
    // Create Omori Sprite

    var Title = this.getWorldTypeObject()
    var image = Title.Character.image

    if (image === "" || !FD.EasyTitleScreen.AppliedToAll.characterOn){
        this._omoriSprite = null;
        return;
    }

    this._omoriSprite = new Sprite(ImageManager.loadPicture(image));

    // if the omori sprite doesnt exist (aka not assigned OR equal to null), it doesnt load it

    this._omoriSprite.anchor.set(0.5, 1)
    this._omoriSprite.x = Graphics.width / 2;
    this._omoriSprite.y = Graphics.height;

    this._omoriSprite._width = Title.Character.width
    this._omoriSprite._height = Title.Character.height
    this._omoriSprite._pattern = Title.Character.pattern
    this._omoriSprite._framecount = Title.Character.framecount
    this._omoriSprite._framerate = Title.Character.framerate
    
    this._omoriSprite.opacity = 0;
    this._omoriSprite.setFrame(0, 0, 0, 0);
    this._omoriSprite.filters = [this._glitchFilter];

    this._omoriSprite.visible = this._worldType !== 4;
    this._omoriSprite.filterArea = new PIXI.Rectangle(0, 0, Graphics.width, Graphics.height + Math.floor(Graphics.height / 6));
    this.addChild(this._omoriSprite);

};

Scene_OmoriTitleScreen.prototype.update = function() {
  Scene_BaseEX.prototype.update.call(this);
  // Update Frame Animations
  this.updateFrameAnimations();
  // Update Command Input
  this.updateCommandInput();
  // Update Effects
  this.updateEffects();
  // Move Bkacground Sprite
  this._scrollinglayer.origin.x += this._scrollx;
  this._scrollinglayer.origin.y += this._scrolly;
};

Scene_OmoriTitleScreen.prototype.initFrameAnimations = function() {
    // Initialize Frame Animations
    this._frameAnimations = []
    if (this._lightBulbLinesSprite) this._lightBulbLinesSprite._index = 0
    var index = 0
    if (this._omoriSprite) {
        this._frameAnimations.push({sprite: this._omoriSprite, rect: new Rectangle(0, 0, this._omoriSprite._width/this._omoriSprite._framecount, this._omoriSprite._height), frames: this._omoriSprite._pattern, frameIndex: 0, delayCount:  0, delay: this._omoriSprite._framerate, active: true})
        this._omoriSprite._index = index
        index += 1
    }
    if (this._customTitle) {
        this._frameAnimations.push({sprite: this._customTitle, rect: new Rectangle(0, 0, this._customTitle._width/this._customTitle._framecount, this._customTitle._height), frames: this._customTitle._pattern, frameIndex: 0, delayCount:  0, delay: this._customTitle._framerate, active: true})
        this._customTitle._index = index
        index += 1
    }
    if (this._lightBulbLinesSprite) {
        this._frameAnimations.push({sprite: this._lightBulbLinesSprite, rect: new Rectangle(0, 0, this._lightBulbLinesSprite._width/this._lightBulbLinesSprite._framecount, this._lightBulbLinesSprite._height), frames: this._lightBulbLinesSprite._pattern, frameIndex: 0, delayCount: 0, delay: this._lightBulbLinesSprite._framerate, active: true})
        this._lightBulbLinesSprite._index = index
        index += 1
    }
    if (this._animatedlayer) {
        this._frameAnimations.push({sprite: this._animatedlayer, rect: new Rectangle(0, 0, 640, 480), frames: this._animatedlayer._pattern, frameIndex: 0, delayCount: 0, delay: this._animatedlayer._framerate, active: true})
        this._animatedlayer._index = index
        index += 1
    }
    // Update Frame animations
    this.updateFrameAnimations();
};

Scene_OmoriTitleScreen.prototype.start = function() {
  // Super Call
  Scene_BaseEX.prototype.start.call(this);
  // Initialize Frame Animations

  var Title = this.getWorldTypeObject()


  this.initFrameAnimations();
  // If Instant Intro Flag is true
  if (this._instantIntro) {
    if (this._titleTextContainerSprite) this._titleTextContainerSprite.opacity = 255;
    if (this._titleTextContainerSprite) this._titleTextContainerSprite.y = -30;
    if (this._titleTextSprite) this._titleTextSprite.opacity = 255;
    if (this._omoriSprite) this._omoriSprite.opacity = 255;
    if (this._customTitle) this._customTitle.opacity = 255;
    if (this._lightBulbLinesSprite) this._lightBulbLinesSprite.opacity = 255;
    for (var i = 0; i < this._titleCommands.length; i++) {
      var win = this._titleCommands[i];
      win.y = (Graphics.height - win.height) - 15;
      win.opacity = 255;
      win.contentsOpacity = 255;
    };
    // Activate Commands
    this._commandActive = true;
	// Activate Bulb Light animation
	if (this._lightBulbLinesSprite) this._frameAnimations[this._lightBulbLinesSprite._index].active = true;
    // Activate Glitch
  //  this._glitchSettings.active = this._worldType === 3;
  this._glitchSettings.active = Title.CharacterGlitch.glitchtoggle
    return;
  };

  this.queue(function() {
    // Set Duration
    var duration = 60;
    var obj = this._titleTextContainerSprite;
    var data = { obj: obj, properties: ['opacity'], from: {opacity: obj.opacity}, to: {opacity: 255}, durations: {opacity: duration}}
    data.easing = Object_Movement.linearTween;
    this.move.startMove(data);
    if (this._lightBulbLinesSprite) this._frameAnimations[this._lightBulbLinesSprite._index].active = true;
  }.bind(this))

  // Wait
  this.queue('setWaitMode', 'movement');
  // Wait
  this.queue('wait', 15);

  // Wait
  this.queue('setWaitMode', 'movement');
  // Wait
  this.queue('wait', 30);

  this.queue(function() {
    // Set Duration
    var duration = 60;
    var obj = this._titleTextContainerSprite;
    var data = { obj: obj, properties: ['y'], from: {y: obj.y}, to: {y: -30}, durations: {y: duration}}
    data.easing = Object_Movement.linearTween;
    this.move.startMove(data);
  }.bind(this))

  // Wait
  this.queue('setWaitMode', 'movement');
  // Wait
  this.queue('wait', 30);
	if (this._omoriSprite) {
		this.queue(function() {
			// Set Duration
			var duration = 60;
			var obj = this._omoriSprite;
			var data = { obj: obj, properties: ['opacity'], from: {opacity: obj.opacity}, to: {opacity: 255}, durations: {opacity: duration}}
			data.easing = Object_Movement.linearTween;
			this.move.startMove(data);
		}.bind(this))

		// Wait
		this.queue('wait', 30);
	}


  for (var i = 0; i < this._titleCommands.length; i++) {
    // console.log(i)
    this.queue(function(index) {
      // Set Duration
      var duration = 30;
      var obj = this._titleCommands[index];
      obj.select(-1)
      var data = { obj: obj, properties: ['y', 'opacity', 'contentsOpacity'], from: {y: obj.y, opacity: obj.opacity, contentsOpacity: obj.contentsOpacity}, to: {y: (Graphics.height - obj.height) - 22, opacity: 255, contentsOpacity: 255}, durations: {y: duration, opacity: duration, contentsOpacity: duration}}
      data.easing = Object_Movement.easeOutCirc;
      this.move.startMove(data);
    }.bind(this, i))
    // Wait
    this.queue('wait', 15);
  };

};

Scene_OmoriTitleScreen.prototype.updateWorldBitmaps = function(world = this._worldType, temp = false) {
  // Set Title Bitmap
  var titleTextBitmap = FD.EasyTitleScreen.Default.Title.text.image;
  var lightbulbBitmap = FD.EasyTitleScreen.Default.Title.lightbulb.image;
  var omoriBitmap = FD.EasyTitleScreen.Default.Character.image;
  var linesBitmap = FD.EasyTitleScreen.Default.Title.glow.image;
  // Set World
  switch (world) {
	case 100000: // White space
		break;
    case -100000:// white spade
        omoriBitmap = FD.EasyTitleScreen.Default.CharacterGlitch.image;
        break;
	case FD.EasyTitleScreen.Screen1.Switch: // Black space
		omoriBitmap = FD.EasyTitleScreen.Screen1.Character.image
		titleTextBitmap = FD.EasyTitleScreen.Screen1.Title.text.image;
		lightbulbBitmap = FD.EasyTitleScreen.Screen1.Title.lightbulb.image;
		linesBitmap = FD.EasyTitleScreen.Screen1.Title.glow.image
		break;
    case -FD.EasyTitleScreen.Screen1.Switch: // Black space
		omoriBitmap = FD.EasyTitleScreen.Screen1.CharacterGlitch.image
		titleTextBitmap = FD.EasyTitleScreen.Screen1.Title.text.image;
		lightbulbBitmap = FD.EasyTitleScreen.Screen1.Title.lightbulb.image;
		linesBitmap = FD.EasyTitleScreen.Screen1.Title.glow.image
		break;
	case FD.EasyTitleScreen.Screen2.Switch: // Red space
		omoriBitmap = FD.EasyTitleScreen.Screen2.Character.image;
		titleTextBitmap = FD.EasyTitleScreen.Screen2.Title.text.image;
		lightbulbBitmap = FD.EasyTitleScreen.Screen2.Title.lightbulb.image;
		linesBitmap = FD.EasyTitleScreen.Screen2.Title.glow.image
        break;
    case -FD.EasyTitleScreen.Screen2.Switch: // Red space
		omoriBitmap = FD.EasyTitleScreen.Screen2.CharacterGlitch.image;
		titleTextBitmap = FD.EasyTitleScreen.Screen2.Title.text.image;
		lightbulbBitmap = FD.EasyTitleScreen.Screen2.Title.lightbulb.image;
		linesBitmap = FD.EasyTitleScreen.Screen2.Title.glow.image
        break;
    case FD.EasyTitleScreen.Screen3.Switch: 
        omoriBitmap = FD.EasyTitleScreen.Screen3.Character.image;
		titleTextBitmap = FD.EasyTitleScreen.Screen3.Title.text.image;
		lightbulbBitmap = FD.EasyTitleScreen.Screen3.Title.lightbulb.image;
		linesBitmap = FD.EasyTitleScreen.Screen3.Title.glow.image
        break;
    case -FD.EasyTitleScreen.Screen3.Switch: 
        omoriBitmap = FD.EasyTitleScreen.Screen3.CharacterGlitch.image;
		titleTextBitmap = FD.EasyTitleScreen.Screen3.Title.text.image;
		lightbulbBitmap = FD.EasyTitleScreen.Screen3.Title.lightbulb.image;
		linesBitmap = FD.EasyTitleScreen.Screen3.Title.glow.image
        break;
	case FD.EasyTitleScreen.Screen4.Switch: // Ending Good
		omoriBitmap = FD.EasyTitleScreen.Screen4.Character.image;
		titleTextBitmap = FD.EasyTitleScreen.Screen4.Title.text.image;
		lightbulbBitmap = FD.EasyTitleScreen.Screen4.Title.lightbulb.image;
		linesBitmap = FD.EasyTitleScreen.Screen4.Title.glow.image;
		break;
	case -FD.EasyTitleScreen.Screen4.Switch: // Ending Good
		omoriBitmap = FD.EasyTitleScreen.Screen4.CharacterGlitch.image;
		titleTextBitmap = FD.EasyTitleScreen.Screen4.Title.text.image;
		lightbulbBitmap = FD.EasyTitleScreen.Screen4.Title.lightbulb.image;
		linesBitmap = FD.EasyTitleScreen.Screen4.Title.glow.image;
		break;
	case FD.EasyTitleScreen.Screen5.Switch: // Ending Bad
        omoriBitmap = FD.EasyTitleScreen.Screen5.Character.image;
		titleTextBitmap = FD.EasyTitleScreen.Screen5.Title.text.image;
		lightbulbBitmap = FD.EasyTitleScreen.Screen5.Title.lightbulb.image;
		linesBitmap = FD.EasyTitleScreen.Screen5.Title.glow.image;
		break;
	case -FD.EasyTitleScreen.Screen5.Switch: // Ending Bad
        omoriBitmap = FD.EasyTitleScreen.Screen5.CharacterGlitch.image;
		titleTextBitmap = FD.EasyTitleScreen.Screen5.Title.text.image;
		lightbulbBitmap = FD.EasyTitleScreen.Screen5.Title.lightbulb.image;
		linesBitmap = FD.EasyTitleScreen.Screen5.Title.glow.image;
		break;
    case FD.EasyTitleScreen.Screen6.Switch:
        omoriBitmap = FD.EasyTitleScreen.Screen6.Character.image;
		titleTextBitmap = FD.EasyTitleScreen.Screen6.Title.text.image;
		lightbulbBitmap = FD.EasyTitleScreen.Screen6.Title.lightbulb.image;
		linesBitmap = FD.EasyTitleScreen.Screen6.Title.glow.image;
		break;
    case -FD.EasyTitleScreen.Screen6.Switch:
        omoriBitmap = FD.EasyTitleScreen.Screen6.CharacterGlitch.image;
		titleTextBitmap = FD.EasyTitleScreen.Screen6.Title.text.image;
		lightbulbBitmap = FD.EasyTitleScreen.Screen6.Title.lightbulb.image;
		linesBitmap = FD.EasyTitleScreen.Screen6.Title.glow.image;
		break;
	};

  if (this._omoriSprite) this._omoriSprite.bitmap = ImageManager.loadPicture(omoriBitmap)
  if (this._titleTextSprite) this._titleTextSprite.bitmap = ImageManager.loadPicture(titleTextBitmap)
  if (this._lightBulbSprite) this._lightBulbSprite.bitmap = ImageManager.loadPicture(lightbulbBitmap);
  if (this._lightBulbLinesSprite) this._lightBulbLinesSprite.bitmap = ImageManager.loadPicture(linesBitmap);
  // Set Omori Sprite Width & Height
  if (this._omoriSprite) this._omoriSprite.width = 306;
  if (this._omoriSprite) this._omoriSprite.height = 350;
  // Let Lines Width & Height
  if (this._lightBulbLinesSprite) this._lightBulbLinesSprite.width = 68;
  if (this._lightBulbLinesSprite) this._lightBulbLinesSprite.height =  150;
  // Get String Bitmap
  
  // Create Cable Bitmap
  //CABLE BITMAPS ARE USELESS 

};

Scene_OmoriTitleScreen.prototype.createFilters = function() {

    var Title = this.getWorldTypeObject()

    // Create GLitch Filter
    this._glitchFilter = new PIXI.filters.GlitchFilter();
    this._glitchFilter.fillMode = 2;
    this._glitchFilter.slices = 0;
    this._glitchFilter.seed = 0
    // Initialize Glitch Settings
    this._glitchSettings = {timer: 0, timing: Title.CharacterGlitch.frequency || 240, maxTiming: Title.CharacterGlitch.frequency || 240, times: 5, world: Title.Switch, active: false}
    //console.log(this._glitchSettings)
};

Scene_OmoriTitleScreen.prototype.updateEffects = function() {
  // Get Glitch Data
  var glitch = this._glitchSettings;
  var Title = this.getWorldTypeObject()
  // If glitch is active
  if (glitch.active) {
    // Reduce Glitch Timing
    glitch.timing--;
    // If glitch timing is 0 or less
    if (glitch.timing <= 0) {
      // Reduce glitch timer
      glitch.timer--
      // If glitch timer is 0 or less
      if (glitch.timer <= 0) {
        // Reset Glitch Timer
        glitch.timer = 3;
        if (glitch.times % 2 == 0) {
          this._glitchFilter.seed = 0;
          this._glitchFilter.slices = 0
          this._glitchFilter.direction = 0
        } else {
          this._glitchFilter.seed = Math.randomInt(100);
          this._glitchFilter.slices = 10 + Math.randomInt(10)
          this._glitchFilter.direction = Math.randomInt(10) * Math.sin(Graphics.frameCount);
        };
        // Reduce Amount of times to glitch
        glitch.times--;
        // If glitch times is 0 or less
        if (glitch.times <= 0) {
          // Set Glitch world
          glitch.world = glitch.world === -Title.Switch ? Title.Switch : -Title.Switch;
          //console.log(glitch.world)
          // Update world bitmaps
          this.updateWorldBitmaps(glitch.world, true)
          // Reset Filter
          this._glitchFilter.seed = 0;
          this._glitchFilter.slices = 0
          this._glitchFilter.direction = 0
          // Reset Glitch Time and timing
          glitch.times = 5;
          glitch.timing = glitch.maxTiming;
        };
      };
    };
  };

return

};

Scene_OmoriFile.prototype.saveGame = function() {
    // On Before Save
    $gameSystem.onBeforeSave();
    // Get Save File ID
    var saveFileid = this.savefileId();
    // Get File Window
    var fileWindow = this._fileWindows[this._saveIndex];
    // Save Game
    this._promptWindow.deactivate();
    this._promptWindow.close();
    this._waitingWindow.show(); // Show Waiting Window;
    if (DataManager.saveGame(saveFileid)) {
    SoundManager.playSave();
    StorageManager.cleanBackup(saveFileid);
    var world;
    var Title = FD.EasyTitleScreen

    if ($gameSwitches.value(Title.Screen6.Switch)) {
        world = Title.Screen6.Switch
    } else if ($gameSwitches.value(Title.Screen5.Switch)) {
        world = Title.Screen5.Switch
    } else if ($gameSwitches.value(Title.Screen4.Switch)) {
        world = Title.Screen4.Switch
    } else if ($gameSwitches.value(Title.Screen3.Switch)) {
        world = Title.Screen3.Switch
    } else if ($gameSwitches.value(Title.Screen2.Switch)) {
        world = Title.Screen2.Switch
    } else if ($gameSwitches.value(Title.Screen1.Switch)) {
        world = Title.Screen1.Switch
    } else {
        world = 0
    }

    DataManager.writeToFileAsync(world, "TITLEDATA", () => {
        this.backupSaveFile(() => {
            fileWindow.refresh();
            // Deactivate Prompt Window
            this._waitingWindow.clear();
            // Set Can select Flag to false
            this._canSelect = true;
            // Update Save Index Cursor
            this.updateSaveIndexCursor();
        })
    });
    //   console.log(world); 
    } else {
    SoundManager.playBuzzer();
    // Deactivate Prompt Window
    this._promptWindow.deactivate();
    this._promptWindow.close();
    // Set Can select Flag to false
    this._canSelect = true;
    // Update Save Index Cursor
    this.updateSaveIndexCursor();
    };
};