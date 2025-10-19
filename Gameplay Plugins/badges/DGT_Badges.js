// DGT_Badges.js
// Renaming this file is recommended, so that multiple modded badge scripts may be loaded at once

// Plugin Commands:
//
// for all purposes, modid is the part of the name of your yaml file after 'badgedata_'
// e.g. if you have a badge file called 'badgedata_coolmod', the mod id you would use in commands would be 'coolmod'
//
//// unlockbadge modid badgeid
// unlocks the badge under the modid and badgeid specified
//// unlockbadgesilent modid badgeid
// unlocks the badge under the modid and badgeid specified (no notification)
//// lockbadge modid badgeid
// locks the badge under the modid and badgeid specified

// JS Functions:
//
//// DGT.UnlockBadge(modId, badgeName)
//// DGT.UnlockBadgeSilent(modId, badgeName)
//// DGT.LockBadge(modId, badgeName)
// same functionality as plugin commands above, but will return true if 'sucessful'; if the user already has the badge and you call unlockbadge, it will return false; likewise, if the user does not have a badge and you call lockbadge, it returns false
//// DGT.isBadgeUnlocked(modId, badgeName)
// returns true if the badge is unlocked
//// DGT.totalUnlockedBadges(modId)
// returns the total number of unlocked badges, if modId is specified, returns the number for that mod only
//// DGT.totalUnlockedBadges(modId)
// returns the total number of locked AND unlocked badges, if modId is specified, returns the number for that mod only
//// DGT.badgeUnlockRatio(modId)
// returns a number between 0 and 1 representing the portion of currently unlocked badges, if modId is specified, returns the number for that mod only
// multiply by 100 for a percentage

//// Extra JS Functions:
//
//// DGT.registerBadgeHandler(modId, badgeName, func)
// will cause func to be called when the badge specified is interacted with in the badge menu
// func will be given one argument, which indicates whether or not the badge is unlocked
// warning: if your script uses this function, you must ensure that it loads after this script
//// DGT.startBadgeNotification(modId, badgeName)
// will show a badge notification WITHOUT granting a badge (you are evil)
//// DGT.makeBadgeToast(corner, border, img, offsetx, offsety)
// offers complete(ish) control over creating a notification
// corner: 'top-left', 'top-right', 'bottom-left' or 'bottom-right'
// border should be a 180 by 94 image in img/system
// img should be a 54 by 54 image (or anything that can be cleanly downscaled to 54 x 54)
// offsetx and offsety are used for positioning the image within the borders of the notification


// Version 1.0.0: initial release
// Version 1.1.0:
//  - Added special handling for vanilla achievements
//  - reworked image preloading to better support atlases
//  - added separate mod/overall progress indicators
// Version 1.1.7:
//  - fix a major bug that was also affecting battle tests
// Version 1.2.0:
//  - add badge notifications
//  - fix some major bugs related to the built in image decrypter
// Version 1.3.0:
//  - add registerBadgeHandler
// Version 1.3.1:
//  - fix badge image caching
// Version 1.3.1b
//  - add meta.full_progress_colorstop_1 and meta.full_progress_colorstop_2
// Version 1.3.2:
//  - improve language support (thanks aoisensei)
// Version 1.3.2b
//  - make custom color apply to top bar as well
// Version 1.3.3:
//  - remove debug thing (fog moment)
// Version 1.4.0:
//  - Unify splintered badge plugin version (oops)
//  - splintered features that werent previously included in mods.one release are indicated above with a 'b' next to version number
//  - add 'secret' badge functionality
//  - fix image loading (thanks Geo)
// Version 1.4.1:
//  - fix image reservation for default images
// Version 1.4.2:
//  - tweak badge counting for secret badges
// Version 1.4.3:
//  - add unlockbadgesilent plugin command and DGT.UnlockBadgeSilent
//  - added a notification queue so badge notifications dont overlap
// Version 1.4.3b:
//  - fix recursive function call error thing
{
    const BADGE_VERSION = '1.4.3b'

    window.DGT = window.DGT || {}
    window.DGT.Badges = window.DGT.Badges || {}

    {
        function main() {
            // Alias the create title commands function to add the additional button for opening the badges screen
            DGT.Badges.old_Scene_OmoriTitleScreen_createTitleCommands = Scene_OmoriTitleScreen.prototype.createTitleCommands
            Scene_OmoriTitleScreen.prototype.createTitleCommands = function () {
                // Original function call
                DGT.Badges.old_Scene_OmoriTitleScreen_createTitleCommands.call(this)

                let numCommands = this._titleCommands.length
                var centerX = Math.floor((Graphics.width - (156 * numCommands + 1)) / 1.8)

                for (let [index, win] of this._titleCommands.entries()) {
                    // Reposition all of the commands to fit
                    win.x = centerX + ((index - 0.5) * (130 + 39))
                    // console.log(win.x, win._text)
                };
                let badgeWin = new Window_OmoTitleScreenBox('BADGES')
                badgeWin.x = centerX + ((numCommands - 0.5) * (130 + 39))
                badgeWin.y = Graphics.height
                this._titleCommands.push(badgeWin)
                this.addChild(badgeWin)
            };

            // handle clicks on the new button
            DGT.Badges.old_Scene_OmoriTitleScreen_updateCommandInput = Scene_OmoriTitleScreen.prototype.updateCommandInput
            Scene_OmoriTitleScreen.prototype.updateCommandInput = function () {
                DGT.Badges.old_Scene_OmoriTitleScreen_updateCommandInput.call(this)
                if (Input.isTriggered('ok') && this._commandIndex == 3) {
                    AudioManager.playSe({ name: "SYS_select", pan: 0, pitch: 100, volume: 90 });
                    SceneManager.push(DGT.BadgeScene)
                    this._optionsActive = false;
                    this._commandActive = false;
                }
            };
            // Add a case to storagemanager's localfilepath function so that it can do the heavy lifting on persistent file data
            DGT.BadgeSymbol = Symbol('Badge Save File')
            DGT.Badges.old_StorageManager_localFilePath = StorageManager.localFilePath
            StorageManager.localFilePath = function (savefileId) {
                if (savefileId !== DGT.BadgeSymbol) { return DGT.Badges.old_StorageManager_localFilePath.call(this, savefileId) }
                return this.localFileDirectoryPath() + "badgedata.rpgsave"
            }
            function loadUserData() {
                let data = StorageManager.loadFromLocalFile(DGT.BadgeSymbol)
                if (data === "") {
                    DGT.Badges._userData = {}
                } else {
                    DGT.Badges._userData = JSON.parse(data)
                }
                DGT.Badges._userData.examplemod = {}
            }
            loadUserData()
            function saveUserData() {
                StorageManager.saveToLocalFile(DGT.BadgeSymbol, JSON.stringify(DGT.Badges._userData))
            }

            DGT.BadgeMeta = Symbol('Badge Metadata')
            // Look through all of the loaded yaml files and look for ones with a filename that starts with 'badgedata_', then load them into the DGT global for storage
            function registerBadgeData() {
                let lang = LanguageManager.defaultLanguage()
                let yamlData = LanguageManager._data[lang].text
                DGT.Badges._data = {}
                DGT.Badges._metadata = {}
                for (let [key, val] of Object.entries(yamlData)) {
                    let [dataString, ...modId] = key.split('_')
                    modId = modId.join('_')
                    if (dataString.toLowerCase() === 'badgedata') {
                        // ignore example mod badges when not in playtest mode
                        if (modId === 'examplemod' && !Utils.isOptionValid('test')) { continue }

                        dataClone = JSON.parse(JSON.stringify(val))
                        if (dataClone.meta) {
                            DGT.Badges._metadata[modId] = dataClone.meta
                            delete dataClone.meta
                        } else {
                            DGT.Badges._metadata[modId] = {}
                        }
                        if (modId === 'examplemod') {
                            for (let badgeId of Object.keys(dataClone)) {
                                if (badgeId === 'badge_1') { DGT.Badges._userData[modId][badgeId] = true; continue }
                                if (badgeId !== 'badge_2') { DGT.Badges._userData[modId][badgeId] = !!Math.round(Math.random()) }
                            }
                        }
                        DGT.Badges._data[modId] = dataClone
                    }
                }
            }
            registerBadgeData()

            DGT.Badges.old_SceneManager_initialize = SceneManager.initialize;
            SceneManager.initialize = function () {
                DGT.Badges.old_SceneManager_initialize.call(this)
                if (DGT.Badges._data['vanilla']) {
                    if (DGT.Badges._userData['vanilla']) { return }
                    DGT.Badges._userData['vanilla'] = {}
                    for (let badgeId of Object.keys(DGT.Badges._data['vanilla'])) {
                        Game_System.prototype.getAchievement.call(null, badgeId, (granted) => {
                            DGT.Badges._userData['vanilla'][badgeId] = granted
                            saveUserData()
                        }, console.error)
                    }
                }
            }

            DGT.Badges.old_Game_System_unlockAchievement = Game_System.prototype.unlockAchievement
            Game_System.prototype.unlockAchievement = function (...args) {
                if (DGT.Badges._data['vanilla']) {
                    DGT.UnlockBadge('vanilla', args[0])
                }
                return DGT.Badges.old_Game_System_unlockAchievement.apply(this, args)
            }

            DGT.UnlockBadge = function (modId, badgeName, doNotif = true) {
                let modData = DGT.Badges._data[modId]
                if (!modData || !modData[badgeName]) {
                    DGT.BadgeError(modId, badgeName)
                    return null
                }
                if (!DGT.Badges._userData[modId]) { DGT.Badges._userData[modId] = {} }
                let added = !DGT.Badges._userData[modId][badgeName]
                DGT.Badges._userData[modId][badgeName] = true
                saveUserData()
                if (added && doNotif) {
                    DGT.queueBadgeNotification(modId, badgeName)
                }
                return added // will be false if badge had already been unlocked, otherwise true if it was sucessfully added
            }
            DGT.UnlockBadgeSilent = function (modId, badgeName) {
                DGT.UnlockBadge(modId, badgeName, false)
            }
            DGT.LockBadge = function (modId, badgeName) {
                let modData = DGT.Badges._data[modId]
                if (!modData || !modData[badgeName]) {
                    DGT.BadgeError(modId, badgeName)
                    return null
                }
                if (!DGT.Badges._userData[modId]) { DGT.Badges._userData[modId] = {} }
                let removed = !!DGT.Badges._userData[modId][badgeName]
                DGT.Badges._userData[modId][badgeName] = false
                saveUserData()
                return removed // will be false if badge was already locked, otherwise true if it was sucessfully removed
            }
            DGT.isBadgeUnlocked = function (modId, badgeName) {
                let modData = DGT.Badges._userData[modId]
                return !!(modData && modData[badgeName])
            }
            DGT.badgeUnlockRatio = function (modId) {
                let total = DGT.totalBadges(modId)
                let unlocked = DGT.totalUnlockedBadges(modId)
                return unlocked / total
            }
            DGT.totalUnlockedBadges = function (modId) {
                let total = 0
                if (!modId) {
                    for (let id of Object.keys(DGT.Badges._data)) {
                        total += DGT.totalUnlockedBadges(id)
                    }
                } else {
                    for (let badgeId of Object.keys(DGT.Badges._data[modId])) {
                        total += DGT.isBadgeUnlocked(modId, badgeId)
                    }
                }
                return total
            }
            DGT.totalUnlockedSecretBadges = function (modId) {
                let total = 0
                if (!modId) {
                    for (let id of Object.keys(DGT.Badges._data)) {
                        total += DGT.totalUnlockedSecretBadges(id)
                    }
                } else {
                    for (let [badgeId, badgeData] of Object.entries(DGT.Badges._data[modId])) {
                        if (badgeData.secret) {
                            total += DGT.isBadgeUnlocked(modId, badgeId)
                        }
                    }
                }
                return total
            }
            DGT.totalBadges = function (modId) {
                let total = 0
                if (!modId) {
                    for (let id of Object.keys(DGT.Badges._data)) {
                        total += DGT.totalBadges(id)
                    }
                } else {
                    for (let [badgeId, badgeData] of Object.entries(DGT.Badges._data[modId])) {
                        if (!badgeData.secret) {
                            total++
                        }
                    }
                }
                return total
            }
            DGT.Badges.old_GameInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand
            Game_Interpreter.prototype.pluginCommand = function (command, args) {
                switch (command.toLowerCase()) {
                    case 'unlockbadge':
                        return DGT.UnlockBadge.apply(this, args)
                    case 'unlockbadgesilent':
                        return DGT.UnlockBadgeSilent.apply(this, args)
                    case 'lockbadge':
                        return DGT.LockBadge.apply(this, args)
                    default:
                        return DGT.Badges.old_GameInterpreter_pluginCommand.call(this, command, args)
                }
            }
            DGT._badgeNotifQueue = new Set()
            DGT.queueBadgeNotification = function (modId, badgeName) {
                DGT._badgeNotifQueue.add([modId, badgeName])
                if (DGT._badgeNotifQueue.size === 1) { DGT.doNextNotification() }
            }
            DGT.doNextNotification = function () {
                let nextNotif = DGT._badgeNotifQueue.keys().next().value
                if (!nextNotif) { return }
                let [modId, badgeName] = nextNotif
                DGT.startBadgeNotification(modId, badgeName, () => {
                    DGT._badgeNotifQueue.delete(nextNotif)
                    DGT.doNextNotification()
                })
            }
            DGT.startBadgeNotification = function (modId, badgeName, finishCb) {
                let meta = DGT.Badges._metadata[modId]
                let data = DGT.Badges._data[modId][badgeName]

                let border = meta.badge_toast_border || 'badge_toast_border'
                let img = data.img
                let corner = meta.badge_toast_corner || 'top-right'
                let ox = meta.badge_toast_image_offset_x || 113
                let oy = meta.badge_toast_image_offset_y || 14

                DGT.makeBadgeToast(corner, border, img, ox, oy, finishCb)
            }
            DGT.makeBadgeToast = function (corner, border, img, ox, oy, finishCb) {
                let newToast = new DGT.BadgeToast(corner, border, img, ox, oy, finishCb)
                let systemimg = ImageManager.loadSystem(img);
                systemimg.addLoadListener(() => SceneManager._scene.addChild(newToast))
            }
            DGT.BadgeError = function (modId, badgeName) {
                let error = new ReferenceError(`Could not find ${badgeName} of ${modId}`)
                if (Utils.isOptionValid('test')) { throw error }
                else { console.error(error) } // fail silently while not in playtest
            }
            // fix stupid issue with trying to decrypt unencrypted imganges
            DGT.Badges.old_Decrypter_checkImgIgnore = Decrypter.checkImgIgnore
            Decrypter.checkImgIgnore = function (url) {
                if (url.startsWith('data:image')) {
                    return true
                }
                return DGT.Badges.old_Decrypter_checkImgIgnore.call(this, url)
            }
            // storing image data in JS to avoid file conflicts
            DGT.LockedBadgeBitmap = function () {
                if (this._lockedBadgeBitmap) { return this._lockedBadgeBitmap }
                let bitmap = Bitmap.load('data:image/png;base64,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')
                this._lockedBadgeBitmap = bitmap
                return bitmap
            }
            DGT.LockedBadgeBitmap()
            DGT.BadgeGetBorderBitmap = function () {
                if (this._badgeGetBorderBitmap) { return this._badgeGetBorderBitmap }
                let bitmap = Bitmap.load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAABeCAYAAACKEj7WAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAR+SURBVHhe7dpNKG1dHMfxdZ+SGXlJzHSkJMpIyUsycCfeYiADZSSlFEYMlAlFZOIm6kaJJJQY3CIDbyUlUl47EwOR14me0HMe/3X3Ps49KA/11Pn7fmq111p7n7P3ye/897IxAAAAAAAAAAAAAIAQ8uOp+b5Ik8/6Lt+cLUKPz+v1Ol3dPB6PbN6V1b+cLaACgYYqLDlCl3/J4dyS1Qn6fO/KKoEOXcGB/m4Hevwi0F/La4Felo4CuU/tQ4FmDa3LP0/t7xBv8hk+jEDr89pz3FBqn0KgoQqBhioEGqoQaKhCoKEKgYYqBBqqEGioQqChCoGGKgQaqhBoqEKgoQqBhioEGqoQaKhCoKEKgYYqBBqqEGioQqChCoGGKgQaqhBoqEKgoQqBhioEGqoQaKhCoKEKgYYqBBqqEGioQqChCoGGKgQaqhBoqEKgoQqBhioEGqoQaKhCoKEKgYYqBBqqEGioQqChCoGGKgRaF/l5hod4+1QmvzlbhB6f1+u1HY/HI5vvdqDHr6DP966sEujQFRxodQj01+IPtHb/JdCsoaEKFTp0+Z6Yx8dHZ6hXWFiYbFhyKOcbHx93urpVVVXJhkArxxr6Fayhv6ienh6n96fZ2Vmn99Lu7q5ZXl52Rs9k7q33+78RaEUkWC0tLc7oObQ5OTmmtrbWtuHhYTu3urpqt8Hc/cHKy8vN3NycaWxsfBFqOefAwIANvEvOKa8JvB557+TkZP+1SP/09NQ/lhZ4/EcQaEWur6/NxMSE2dvbs+ODgwO7TU1NNYODg7bV1NTYOZcESpqQQMbGxtp+sKSkJJOWlmaurq5MYmKiM/v79Xl5eTbkIyMjzuzvc05PT5usrCwbXCHV/+joyH8tMg4PD7fndOc6OzvtsR9FoBWJjIw0o6Ojpq6uzj79cMO5sLBgq2XgssDdV11dbbKzs23/8vLSFBUV2X4gCfrU1JTZ2dkxZWVlpqGhwdzd3dl9Q0NDprCw0MTHx5ulpSU7F6ikpMRkZmaam5sbk5KSYufkCyfVfnFx0URHR9u7hXsX+SwCrcjt7a3dzszMmNLSUvPw8GDHGRkZtlo2Nzfbsau/v99WV1ku9Pb22uoZFRXl7H0mlbmiosK0trba4zo6Okx9fb3dJ8uI7u5uu0+q9/b2tjk5ObFfLldxcbHZ2NjwX49U88PDQ3NxcWG/JOnp6WZlZcVW6M8i0IpI1YuIiLBVr6CgwFZV8doyQsIkj/3a2tpshd3f37dBzc3NdY740/r6ullbWzObm5vm58+fdk7CW1lZaebn5+1rpdL29fXZP1m7lV7CK2GXc2xtbdlKLZW4qanJ5Ofnm/v7+zeXOR/BY7vQ9eKxnaxJ5RbvkuBI1Qu8lcfExNh1qiwjpPK6ZC18fHz8ZqClEssXRchjNHmt+0tg4PvInFxXV1eXOTs7s9VX7gQJCQl2nyyHRFxcnDk/PzeTk5NmbGzMv94X7e3t9ngX/8vxNfAc+hUsOaAKFTp08b8cUOXHU/N9kTb21AAAAAAAAAAAAADgVcb8C/Ccb/zLn3D3AAAAAElFTkSuQmCC')
                this._badgeGetBorderBitmap = bitmap
                return bitmap
            }
            DGT.BadgeGetBorderBitmap()

            DGT.Badges.old_ImageManager_loadSystem = ImageManager.loadSystem
            ImageManager.loadSystem = function (...args) {
                if (args[0] === 'locked_badge') { return DGT.LockedBadgeBitmap() }
                if (args[0] === 'badge_toast_border') { return DGT.BadgeGetBorderBitmap() }
                return DGT.Badges.old_ImageManager_loadSystem.apply(this, args)
            }

            class BadgeEntry extends Window_Base {
                constructor(index) { super(index); }
                initialize(index) {
                    this._index = index;
                    super.initialize(0, 0, this.windowWidth(), this.windowHeight());
                    this.opacity = 0

                    this.createCursorSprite();

                    //this.refresh();
                    this.deselect();
                }
                select() {
                    this._cursorSprite.visible = true;
                }
                deselect() {
                    this._cursorSprite.visible = false;
                }
                standardPadding() { return 0 }
                windowWidth() { return 108 }
                windowHeight() { return 108 }
                changeImage(image) {
                    if (!image) { this.contents.clear(); return; }
                    let badgeBitmap = ImageManager.loadSystem(image)
                    let { width: sw, height: sh } = badgeBitmap
                    this.contents.clear()
                    this.contents.blt(badgeBitmap, 0, 0, sw, sh, 0, 0, this.windowWidth(), this.windowHeight())
                }
                createCursorSprite() {
                    this._cursorSprite = new Sprite_WindowCustomCursor();
                    this._cursorSprite.x = -10
                    this._cursorSprite.y = 54;
                    this.addChild(this._cursorSprite);
                };
            }
            DGT.BadgeEntry = BadgeEntry

            class BadgeWindow extends Window_Base {
                constructor(data, parent) { super(data, parent); }
                initialize(data, parent) {
                    this._index = 0;
                    this._rowLength = 5
                    this._rowOffset = 0;
                    this._data = data
                    this._parent = parent
                    super.initialize(0, 0, this.windowWidth(), this.windowHeight());
                    this.createEntries()
                    this.refresh()
                }
                select(index) { this._index = index; this.refresh() }
                createEntries() {
                    this._badgeEntries = []
                    for (let i = 0; i < 10; i++) {
                        let newEntry = new DGT.BadgeEntry(i)
                        // 31, 37, x gap 120, y gap 117
                        newEntry.x = 31 + (120 * (i % this._rowLength))
                        newEntry.y = 37 + (120 * Math.floor(i / this._rowLength))
                        this._badgeEntries.push(newEntry)
                        newEntry.changeImage('toast2')
                        this.addChild(newEntry)
                    }
                }
                totalEntries() { return this._data.length }
                maxRows() { return Math.floor(this.totalEntries() / this._rowLength) + 1 }
                maxOffsetRows() { return Math.max(this.maxRows() - 2, 0) }
                refresh() {
                    if (this._data.length === 0) { return }
                    this._badgeEntries.forEach(x => x.deselect())
                    this._index = this._index.clamp(0, this.totalEntries() - 1)
                    if ((this._rowOffset * this._rowLength) > this._index) {
                        this._rowOffset = Math.max(this._rowOffset - 1, 0)
                    } else if (((this._rowOffset + 2) * this._rowLength) <= this._index) {
                        this._rowOffset = Math.min(this._rowOffset + 1, this.maxOffsetRows())
                    }
                    for (let win of this._badgeEntries) {
                        let index = (this._rowOffset * this._rowLength) + win._index
                        let data = this._data[index]
                        if (!data) { win.changeImage(null); continue }
                        let img = data.unlocked ? data.data.img : (data.data.locked_img || 'locked_badge')
                        win.changeImage(img)
                    }
                    let selIndex = this._index - (this._rowOffset * this._rowLength)
                    this._badgeEntries[selIndex].select()
                    this._parent.select(this._index)
                }
                standardPadding() { return 4 }
                windowWidth() { return Graphics.width }
                windowHeight() { return 320 }
            }
            DGT.BadgeWindow = BadgeWindow

            class BadgeImageWindow extends Window_Base {
                constructor() { super(); }
                initialize() { super.initialize(0, 0, this.windowWidth(), this.windowHeight()); }
                changeImage(image) {
                    if (!image) { this.contents.clear(); return; }
                    let badgeBitmap = ImageManager.loadSystem(image)
                    let { width: sw, height: sh } = badgeBitmap
                    this.contents.clear()
                    this.contents.blt(badgeBitmap, 0, 0, sw, sh, 22, 22, 108, 108)
                }
                standardPadding() { return 4 }
                windowWidth() { return 160 }
                windowHeight() { return 160 }
            }
            DGT.BadgeImageWindow = BadgeImageWindow

            class BadgeInfoWindow extends Window_Base {
                constructor() { super(); }
                initialize() { super.initialize(0, 0, this.windowWidth(), this.windowHeight()); }
                updateText(name, desc, mod, meta, secret) {
                    this.contents.clear()
                    this.contents.fontSize = 28
                    this.drawText(name, 13, -1)
                    let textParts = desc.split('\\n')
                    let offset = 0
                    for (let part of textParts) {
                        this.drawText(part, 13, 35 + (offset * 24))
                        offset++
                    }
                    if (mod) {
                        this.drawProgress(mod, meta)
                    }
                    if (secret) {
                        this.drawSecretText()
                    }
                }
                drawSecretText() {
                    let text = 'SECRET'
                    let color = '#C20000'
                    let textxw = this.contents.measureTextWidth(text)
                    this.contents.textColor = color
                    this.drawText(text, (this.windowWidth() - 23) - textxw, 14)
                    this.contents.textColor = '#FFFFFF'
                }
                drawProgress(mod, meta) {
                    let unlocked = DGT.totalUnlockedBadges()
                    let total = DGT.totalBadges()
                    let totalSecret = DGT.totalUnlockedSecretBadges()
                    let ratio = DGT.badgeUnlockRatio() || 0
                    let percent = Math.floor(ratio * 100)
                    this.contents.fontSize = 20
                    let totaltext = `BADGE COMPLETION: ${unlocked} of ${total} (%${percent})`
                    if (totalSecret > 0) {
                        totaltext = `BADGE COMPLETION: ${unlocked - totalSecret}+${totalSecret} of ${total} (%${percent})`
                    }
                    this.drawText(totaltext, 13, 87)
                    // width of bar: 446
                    // height: 12
                    let [bx, by] = [13, 117]
                    this.contents.fillRect(bx, by, 446, 12, '#AEAEAE')
                    this.contents.clearRect(bx + 1, by + 1, 444, 10)

                    let barWidth = Math.floor(ratio * 444).clamp(2, 442)
                    if (unlocked >= total && !(total === 0)) {
                        let stop1 = meta.full_progress_colorstop_1 || '#FFAEFF'
                        let stop2 = meta.full_progress_colorstop_2 || '#FFFF88'
                        this.contents.gradientFillRect(bx + 2, by + 2, barWidth, 4, stop1, stop2)
                    } else {
                        this.contents.fillRect(bx + 2, by + 2, barWidth, 4, '#AEAEAE')
                    }

                    let modunlocked = DGT.totalUnlockedBadges(mod)
                    let modtotal = DGT.totalBadges(mod)
                    let modTotalSecret = DGT.totalUnlockedSecretBadges(mod)
                    let modratio = DGT.badgeUnlockRatio(mod) || 0
                    let modpercent = Math.floor(modratio * 100)
                    let modtext = `MOD PROGRESS: ${modunlocked} of ${modtotal} (%${modpercent})`
                    if (modTotalSecret > 0) {
                        modtext = `MOD PROGRESS: ${modunlocked - modTotalSecret}+${modTotalSecret} of ${modtotal} (%${modpercent})`
                    }
                    let modtextxw = this.contents.measureTextWidth(modtext)

                    let modBarWidth = Math.floor(modratio * 444).clamp(2, 442)
                    if (modunlocked >= modtotal && !(modtotal === 0)) {
                        let stop1 = meta.full_progress_colorstop_1 || '#FFAEFF'
                        let stop2 = meta.full_progress_colorstop_2 || '#FFFF88'
                        this.contents.gradientFillRect(bx + 2, by + 6, modBarWidth, 4, stop1, stop2)
                    } else {
                        this.contents.fillRect(bx + 2, by + 6, modBarWidth, 4, '#AEAEAE')
                    }

                    this.drawText(modtext, (this.windowWidth() - 23) - modtextxw, 118)

                    let modnametext = meta.name || mod.toUpperCase()
                    let modnamecolor = meta.color || '#FFFFFF'
                    let modnametextxw = this.contents.measureTextWidth(modnametext)
                    this.contents.textColor = modnamecolor
                    this.drawText(modnametext, (this.windowWidth() - 23) - modnametextxw, -1)
                    this.contents.textColor = '#FFFFFF'
                }
                standardPadding() { return 4 }
                windowWidth() { return 480 }
                windowHeight() { return 160 }
            }
            DGT.BadgeInfoWindow = BadgeInfoWindow

            class BadgeScene extends Scene_Base {
                constructor() { super(); }

                initialize() {
                    this._imageReservationId = 'badgemod';
                    super.initialize()
                    this.flattenBadgeData()
                    this.createImageWindow()
                    this.createInfoWindow()
                    this.createBadgeWindow()
                    if (this._data.length === 0) {
                        this._badgeImageWindow.changeImage('locked_badge')
                        this._badgeInfoWindow.updateText('There are no badges loaded...', '')
                    }
                }
                loadReservedBitmaps() {
                    Scene_Base.prototype.loadReservedBitmaps.call(this)

                    for (let [modId, modData] of Object.entries(DGT.Badges._data)) {
                        for (let [badgeId, badgeData] of Object.entries(modData)) {
                            ImageManager.reserveSystem(badgeData.img, 0, this._imageReservationId)
                            if (badgeData.locked_img && badgeData.locked_img !== "locked_badge") {
                                ImageManager.reserveSystem(badgeData.locked_img, 0, this._imageReservationId)
                            }
                        }
                    }
                }
                flattenBadgeData() {
                    this._data = []
                    for (let [modId, modData] of Object.entries(DGT.Badges._data)) {
                        for (let [badgeId, badgeData] of Object.entries(modData)) {
                            let unlocked = DGT.isBadgeUnlocked(modId, badgeId)
                            if (badgeData.secret && !unlocked) { continue }
                            this._data.push({ id: badgeId, modId, data: badgeData, meta: DGT.Badges._metadata[modId], unlocked })
                        }
                    }
                }
                createBadgeWindow() {
                    this._badgeWindow = new DGT.BadgeWindow(this._data, this)
                    this.addChild(this._badgeWindow)
                }
                createImageWindow() {
                    this._badgeImageWindow = new DGT.BadgeImageWindow
                    this._badgeImageWindow.y = 320
                    this.addChild(this._badgeImageWindow)
                }
                createInfoWindow() {
                    this._badgeInfoWindow = new DGT.BadgeInfoWindow
                    this._badgeInfoWindow.y = 320
                    this._badgeInfoWindow.x = 160
                    this.addChild(this._badgeInfoWindow)
                }
                select(index) {
                    let data = this._data[index]
                    let img = data.unlocked ? data.data.img : (data.data.locked_img || 'locked_badge')
                    this._badgeImageWindow.changeImage(img)
                    let { name, description } = data.unlocked ? data.data : { name: '???', description: '???' }
                    if (!data.unlocked && data.data.locked_desc) {
                        description = data.data.locked_desc
                    }
                    this._badgeInfoWindow.updateText(name, description, data.modId, data.meta, data.data.secret)
                }
                update() {
                    super.update()
                    this.updateSelectInput()
                }
                updateSelectInput() {
                    if (Input.isTriggered('cancel')) {

                        SoundManager.playCancel();
                        SceneManager.pop()
                        return;
                    };

                    if (this._data.length === 0) { return }

                    let index = this._badgeWindow._index
                    let row = this._badgeWindow._rowLength

                    if (Input.isTriggered('ok')) {
                        let badgeData = this._data[index]
                        if (DGT.BadgeHandlers[badgeData.modId] && DGT.BadgeHandlers[badgeData.modId][badgeData.id]) {
                            DGT.BadgeHandlers[badgeData.modId][badgeData.id](badgeData.unlocked)
                        }
                        return
                    }
                    if (Input.isRepeated('up')) {
                        SoundManager.playCursor()
                        this._badgeWindow.select(index - row)
                        return;
                    };
                    if (Input.isRepeated('down')) {
                        SoundManager.playCursor();
                        this._badgeWindow.select(index + row)
                        return;
                    };
                    if (Input.isRepeated('left')) {
                        SoundManager.playCursor()
                        this._badgeWindow.select(index - 1)
                        return;
                    };
                    if (Input.isRepeated('right')) {
                        SoundManager.playCursor();
                        this._badgeWindow.select(index + 1)
                        return;
                    };

                };
            }
            DGT.BadgeScene = BadgeScene

            class BadgeToast extends Window_Base {
                constructor(corner, border, img, imgx, imgy, finishCb) { super(corner, border, img, imgx, imgy, finishCb); }
                initialize(corner, border, img, imgx, imgy, finishCb) {
                    super.initialize(0, 0, this.windowWidth(), this.windowHeight())
                    this.setParameters()
                    this._finishCb = finishCb

                    this.opacity = 0
                    this.createBadgeImage(img, imgx, imgy)
                    this.createBorderImage(border)
                    this.setPositionData(corner)
                    this.setInitialPosition()

                    this._currentPhaseFrames = 0
                    this._currentPhase = 'popup'
                }
                setParameters() {
                    this.timings = {
                        popup: { frames: 20, method: 'Linear' },
                        stay: { frames: 200 },
                        popdown: { frames: 20, method: 'Linear' },
                        done: { frames: 0 }
                    }
                }
                createBadgeImage(img, imgx, imgy) {
                    let badgeBitmap = ImageManager.loadSystem(img)
                    let { width: sw, height: sh } = badgeBitmap
                    this.contents.blt(badgeBitmap, 0, 0, sw, sh, imgx, imgy, 54, 54)
                }
                createBorderImage(border) {
                    let borderBitmap = ImageManager.loadSystem(border)
                    let { width: sw, height: sh } = borderBitmap
                    this.contents.blt(borderBitmap, 0, 0, sw, sh, 0, 0, this.windowWidth(), this.windowHeight())
                }
                setPositionData(corner) {
                    switch (corner) {
                        case 0:
                        case 'top-left':
                            this._startPos = { x: 0, y: 0 - this.windowHeight() }
                            this._endPos = { x: 0, y: 0 }
                            break
                        case 1:
                        case 'top-right':
                            this._startPos = { x: Graphics.width - this.windowWidth(), y: 0 - this.windowHeight() }
                            this._endPos = { x: Graphics.width - this.windowWidth(), y: 0 }
                            break
                        case 2:
                        case 'bottom-left':
                            this._startPos = { x: 0, y: Graphics.height }
                            this._endPos = { x: 0, y: Graphics.height - this.windowHeight() }
                            break
                        case 3:
                        case 'bottom-right':
                        default:
                            this._startPos = { x: Graphics.width - this.windowWidth(), y: Graphics.height }
                            this._endPos = { x: Graphics.width - this.windowWidth(), y: Graphics.height - this.windowHeight() }
                            break
                    }
                }
                setInitialPosition() {
                    this.x = this._startPos.x
                    this.y = this._startPos.y
                }
                nextPhase(phase) {
                    switch (phase) {
                        case 'popup': return 'stay'
                        case 'stay': return 'popdown'
                        case 'popdown': return 'done'
                    }
                    return 'done'
                }
                update() {
                    if (this._currentPhase === 'done') {
                        this._finishCb()
                        this.destroy()
                        return
                    }
                    if (this._currentPhaseFrames >= this.timings[this._currentPhase].frames) {
                        this._currentPhase = this.nextPhase(this._currentPhase)
                        this._currentPhaseFrames = 0;
                    }
                    let curves = TDDP_AnimationCurves.easingFunctions
                    let easingMode = this.timings[this._currentPhase].method || 'Linear'
                    let f = curves[easingMode]

                    switch (this._currentPhase) {
                        case 'popup':
                            this.x = f(this._currentPhaseFrames, this._startPos.x, this._endPos.x - this._startPos.x, this.timings[this._currentPhase].frames)
                            this.y = f(this._currentPhaseFrames, this._startPos.y, this._endPos.y - this._startPos.y, this.timings[this._currentPhase].frames)
                            break
                        case 'stay':
                            this.x = this._endPos.x
                            this.y = this._endPos.y
                            break
                        case 'popdown':
                            this.x = f(this._currentPhaseFrames, this._endPos.x, this._startPos.x - this._endPos.x, this.timings[this._currentPhase].frames)
                            this.y = f(this._currentPhaseFrames, this._endPos.y, this._startPos.y - this._endPos.y, this.timings[this._currentPhase].frames)
                            break
                    }

                    this._currentPhaseFrames += 1
                }

                standardPadding() { return 0 }
                windowWidth() { return 180 }
                windowHeight() { return 94 }
            }
            DGT.BadgeToast = BadgeToast
        }
    };
    loadReservedBitmaps = function () { //stupid
        DGT.__aaaaa = DGT.__aaaaa || []
        for (let [modId, modData] of Object.entries(DGT.Badges._data)) {
            let meta = DGT.Badges._metadata[modId]
            if (meta.badge_toast_border && meta.badge_toast_border !== 'badge_toast_border') {
                DGT.__aaaaa.push(ImageManager.loadSystem(meta.badge_toast_border, 0))
            }
            for (let [badgeId, badgeData] of Object.entries(modData)) {
                DGT.__aaaaa.push(ImageManager.loadSystem(badgeData.img, 0))
                if (badgeData.locked_img && badgeData.locked_img !== 'locked_badge') {
                    // reserve the custom locked image (if any) for badges that are locked
                    DGT.__aaaaa.push(ImageManager.reserveSystem(badgeData.locked_img, 0))
                }
            }
        }
    }
    DGT.BadgeHandlers = DGT.BadgeHandlers || {}
    DGT.registerBadgeHandler = function (modId, badgeName, func) {
        DGT.BadgeHandlers[modId] = DGT.BadgeHandlers[modId] || {}
        DGT.BadgeHandlers[modId][badgeName] = func
    }
    DGT.registerBadgeHandler('vanilla', 'XD', function (unlocked) {
        if (unlocked) {
            AudioManager.playSe({ name: 'SE_TaDa_Bad', pitch: 100, volume: 90 })
        }
    })
    // fix for the badge script being loaded multiple times, which can happen if database loading is delayed (whoops)
    if (window.DGT.BadgeLoadHack === undefined) {
        window.DGT.BadgeLoadHack = true
        let closure_BadgeFunction = window.DGT.BadgeFunction
        let closure_hasBeenCalled = false
        delete window.DGT.BadgeFunction
        Object.defineProperty(window.DGT, 'BadgeFunction', {
            get: function () {
                if (closure_BadgeFunction === undefined) {
                    return undefined
                }
                return function () {
                    if (closure_hasBeenCalled) { return }
                    closure_hasBeenCalled = true
                    return closure_BadgeFunction()
                }
            },
            set: function (value) {
                closure_BadgeFunction = value
            }
        })

    }
    // version of badge data script: used to allow for the prioritization of the newest version when multiple badge scripts are loaded
    if ((BADGE_VERSION > window.DGT.BadgeVersion) || window.DGT.BadgeVersion === undefined) {
        window.DGT.BadgeVersion = BADGE_VERSION
        // This function will be continuously replaced by newer versions, assuming multiple different versions of the badge script are loaded
        window.DGT.BadgeFunction = main
    }
    if (window.DGT.BadgeLoaded === undefined) {
        window.DGT.BadgeLoaded = true
        let old_idbl = DataManager.isDatabaseLoaded
        DataManager.isDatabaseLoaded = function () {
            let result = old_idbl.call(this)
            if (!result) { return false }
            // when the database is loaded, it can be safely assumed (hopefully) that all badge scripts have loaded
            window.DGT.BadgeFunction()
            loadReservedBitmaps()
            return true
        }
    }
}
