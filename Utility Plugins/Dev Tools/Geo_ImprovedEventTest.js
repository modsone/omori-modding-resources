//=============================================================================
 /*:
 * @plugindesc
 * Hopefully improvises the event test feature.
 *
 * @author Geo
 *
 * @help
 * There's a very obscure feature in RPG Maker MV that allows you to
 * be able to test event code without starting a playtest. To activate
 * this, you need to select a command/several commands from an event's
 * page, then right click and then click "Test" OR simply press ctrl + r.
 *
 * However, the base feature in itself is VERY rudimentary, in which, it
 * doesn't let you test the event on the map it's in and "This event" movement
 * routes doesn't work. This plugin fixes that and hopefully improves it
 * to an extent.
 *
 *                            -- !! IMPORTANT !! --
 * This does NOT work by itself, it needs a modified version of the maker program
 * to work.
 */
//=============================================================================

// Load _testEventExtra.json, thank you fog for this
var beesList_oldLodaDatabase = DataManager.loadDatabase;
DataManager.loadDatabase = function() {
  // Run Original Function
  beesList_oldLodaDatabase.call(this);
  const _mapLoader = DataManager._mapLoader;
  DataManager._mapLoader = (function() { /* prevents error message */ });
  if (DataManager.isEventTest()) {
    DataManager.loadDataFile('$testEventExtra', 'Test_EventExtra.json');
  };
  DataManager._mapLoader = _mapLoader;
};

Game_Map.prototype.setupTestEvent = function() {
    if ($testEvent) {
        if (window['$testEventExtra']) {
            this._interpreter.setup($testEvent, window['$testEventExtra'].EventId);
		} else {
			this._interpreter.setup($testEvent, 0);
		}
        $testEvent = null;
        return true;
    }
    return false;
};

DataManager.setupEventTest = function() {
	// Skip omori title screen
	if (window.Galv && Galv.ASPLASH) {
	    Galv.ASPLASH.splashed = true;
	};
	// Fetch extra event detail
	var extra = window['$testEventExtra'];
    this.createGameObjects();
    this.selectSavefileForNewGame();
    $gameParty.setupStartingMembers();
	if (extra) {
        $gamePlayer.reserveTransfer(extra.MapId, extra.X, extra.Y);
	} else {
		$gamePlayer.reserveTransfer(window['$dataSystem'].editMapId, 8, 6);
	}
    $gamePlayer.setTransparent(false);
	$gamePlayer.setThrough(true);
	Window_TitleCommand.initCommandPosition();
};
