/*:
 * @plugindesc Enhances the equipment status window with dynamic stat comparisons, 
 * fake stat bonuses, and customizable indicators.
 *
 * @author KoffinKrypt
 *
 * @help
 * ============================================================================
 * Overview:
 * ============================================================================
 *
 * This plugin extends the OMORI Menu Equip Status by allowing you to preview fake
 * stat bonuses from equipment and display stat differences with customizable
 * symbols, colors, and text.
 * (Useful for CHARMS that doesn't change stats directly
 *
 * Stat changes are shown on the status window:
 *   - Increases are normally shown in green (default: ↑)
 *   - Decreases are shown in red (default: ↓)
 * The number of symbols (or custom icons) corresponds to the magnitude of the change.
 *
 * Features include:
 *   • Fake stat bonuses via notetags (both flat and percentage-based).
 *   • Custom symbols for increases (<Increase: SYMBOL>) and decreases (<Decrease: SYMBOL>).
 *   • Custom colors for increases (<IncreaseColor: #00ff00>) and decreases (<DecreaseColor: #ff0000>).
 *   • Separate extra text for increases (<StatIncreaseText: ...>) and decreases (<StatDecreaseText: ...>).
 *   • A notetag (<NoSymbols>) to disable any symbol display.
 *
 * ============================================================================
 * Fake Stat Bonuses:
 * ============================================================================
 *
 * Use these notetags in equipment (weapon/armor) notes to preview stat changes:
 *
 *   • Heart:    <Heart:+25%>  or  <Heart:+25>
 *   • Juice:    <Juice:+15%>  or  <Juice:+15>
 *   • Attack:    <Attack:+15%> or  <Attack:+15>
 *   • Defense:   <Defense:+5%> or  <Defense:+5>
 *   • Speed:     <Speed:+10%>  or  <Speed:+10>
 *   • Luck:      <Luck:+5%>    or  <Luck:+5>
 *   • HitRate:   <HitRate:+20%> or  <HitRate:+20>
 *   • Evasion:   <Evasion:+10%> or  <Evasion:+10>
 *
 * Multiple notetags for the same stat are summed.
 *
 * ============================================================================
 * Custom Symbols & Colors:
 * ============================================================================
 *
 * Override the default symbols by using:
 *
 *   <Increase: SYMBOL>    - e.g., <Increase: !>
 *   <Decrease: SYMBOL>    - e.g., <Decrease: ?>
 *
 * And set custom colors:
 *
 *   <IncreaseColor: #00ff00>
 *   <DecreaseColor: #ff0000>
 *
 * ============================================================================
 * Custom Extra Text:
 * ============================================================================
 *
 * To add extra text next to stat changes, use separate notetags for increases and decreases:
 *
 *   • For increases:
 *       <HeartIncreaseText: When empowered>
 *       <AttackIncreaseText: On a rampage>
 *   • For decreases:
 *       <HeartecreaseText: When weakened>
 *       <AttackDecreaseText: In despair>
 *
 * These are supported for Heart, Juice, Attack, Defense, Speed, Luck, HitRate, and Evasion.
 *
 * ============================================================================
 * Disable Symbols:
 * ============================================================================
 *
 * To prevent any symbols from appearing, simply include:
 *
 *   <NoSymbols>
 *
 * in the equipment’s note.
 *
 *
 * ============================================================================
 * Increasing Window Width:
 * ============================================================================
 * If you need more space for text, increase this number in the plugin's code.
 *
 * Window_OmoMenuEquipStatus.prototype.windowWidth = function () { return 237; };
 *
 * And the "100" in line 273 of the code.
 *
 * this.drawText(displayText, 188, -5 + i * rowSpacing, 100);
 *
 * ============================================================================
 * How to Use:
 * ============================================================================
 *
 * 1. Place this plugin at the bottom. (may vary depending on other plugins)
 * 2. In your equipment (weapon/armor) database, add any of the notetags above in
 *    the item's note field to preview fake stat changes.
 * 3. The equipment status window will automatically update when previewing
 *    equipment changes.
 *
 * No plugin commands are required.
 *
 * ============================================================================
 * Terms of Use:
 * ============================================================================
 *
 * Free to use and modify in your projects, with credit. (stop stealing my shit)
 *
 * @version 1.0
 */
 
//=============================================================================
// * Settings
//=============================================================================
Window_OmoMenuEquipStatus.prototype.isUsingCustomCursorRectSprite = function() { return true; };
Window_OmoMenuEquipStatus.prototype.standardOpennessType = function() { return 2;};
Window_OmoMenuEquipStatus.prototype.standardPadding = function() { return 4; }
Window_OmoMenuEquipStatus.prototype.windowWidth = function () { return 237; };
Window_OmoMenuEquipStatus.prototype.windowHeight = function() { return 168; }

//=============================================================================
// * Get Actor Parameter Value from id
//=============================================================================
Window_OmoMenuEquipStatus.prototype.actorParamValue = function(actor, param) {
  var base;
  if (param >= 200) {
    base = actor.sparam(param - 200);
  } else if (param >= 100 && param < 200) {
    base = Math.round(actor.xparam(param - 100) * 100);
  } else {
    base = actor.param(param);
  }
  if (actor._fakeStatBonuses) {
    switch (param) {
      case 0: // Attack
        base += actor._fakeStatBonuses.hp || 0;
        break;
      case 1: // Attack
        base += actor._fakeStatBonuses.mp || 0;
        break;
      case 2: // Attack
        base += actor._fakeStatBonuses.atk || 0;
        break;
      case 3: // Defense
        base += actor._fakeStatBonuses.def || 0;
        break;
      case 6: // Speed
        base += actor._fakeStatBonuses.spd || 0;
        break;
      case 7: // Luck
        base += actor._fakeStatBonuses.luk || 0;
        break;
      case 100: // HitRate (xparam via [100,8])
        base += actor._fakeStatBonuses.hit || 0;
        break;
      case 101: // Evasion (xparam via [101,9])
        base += actor._fakeStatBonuses.eva || 0;
        break;
    }
  }
  return base;
};
//=============================================================================
// * Refresh
//=============================================================================
Window_OmoMenuEquipStatus.prototype.refresh = function() {
  // Get Actor
  var actor = this._actor;
  
  // Determine current evasion using both base actor and temp actor if available.
  let evasion = 0;
  if (actor) {
    evasion = Math.round(actor.xparam(1) * 100);
  }
  if (this._tempActor) {
    evasion = Math.max(evasion, Math.round(this._tempActor.xparam(1) * 100));
  }
  
  // Update _params based on current evasion value.
  if (actor) {
    this._params = [0, 1, 2, 3, 6, 7, [100, 8]];
    if (evasion > 0) {
      this._params.push([101, 9]);
    }
    var rowSpacing = evasion > 0 ? 18 : 21;
  }
  
  // Clear Contents
  this.contents.clear();
  
  // If actor exists, draw each stat row.
  if (actor) {
    var bitmap = ImageManager.loadSystem('equip_arrow');
    var stats = this._params;
    // Retrieve custom symbols, colors, and stat texts (or use defaults).
    var customInc = (this._tempActor && this._tempActor._customIncreaseSymbol) ? this._tempActor._customIncreaseSymbol : null;
    var customDec = (this._tempActor && this._tempActor._customDecreaseSymbol) ? this._tempActor._customDecreaseSymbol : null;
    var customIncColor = (this._tempActor && this._tempActor._customIncreaseColor) ? this._tempActor._customIncreaseColor : "#69ff90";
    var customDecColor = (this._tempActor && this._tempActor._customDecreaseColor) ? this._tempActor._customDecreaseColor : "#ff2b2b";
    
    for (var i = 0; i < stats.length; i++) {
      var paramIndex = stats[i];
      var paramSub = Array.isArray(paramIndex) ? paramIndex[1] : null;
      if (paramSub) { paramIndex = paramIndex[0]; }
      
      var value1 = this.actorParamValue(actor, paramIndex);
      var paramName = TextManager.param(paramSub ? paramSub : paramIndex);
      if (paramName.toLowerCase() === "max hp") { paramName = "HEART"; }
      if (paramName.toLowerCase() === "max mp") { paramName = "JUICE"; }
      
      this.contents.fontSize = 20;
      this.drawText(paramName.toUpperCase() + ':', 8, -5 + i * rowSpacing, 100);
      this.drawText(value1, 132, -5 + i * rowSpacing, 100);
      this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 173, 13 + i * rowSpacing);
      
      // Handle the temp actor's value with symbol, color, and extra text.
      if (this._tempActor) {
        var value2 = this.actorParamValue(this._tempActor, paramIndex);
        var diff = value2 - value1;
        var symbol = "";
        if (diff > 0) {
          var absDiff = diff;
          var symbolCount;
          if (paramName.toUpperCase() === "HEART" || paramName.toUpperCase() === "JUICE") {
            symbolCount = absDiff < 100 ? 1 : (absDiff < 1000 ? 2 : 3);
          } else {
            symbolCount = absDiff < 10 ? 1 : (absDiff < 100 ? 2 : 3);
          }
          symbol = customInc ? customInc.repeat(symbolCount) : "↑".repeat(symbolCount);
          this.resetTextColor();
          this.contents.textColor = customIncColor;
        } else if (diff < 0) {
          var absDiff = Math.abs(diff);
          var symbolCount;
          if (paramName.toUpperCase() === "HEART" || paramName.toUpperCase() === "JUICE") {
            symbolCount = absDiff < 100 ? 1 : (absDiff < 1000 ? 2 : 3);
          } else {
            symbolCount = absDiff < 10 ? 1 : (absDiff < 100 ? 2 : 3);
          }
          symbol = customDec ? customDec.repeat(symbolCount) : "↓".repeat(symbolCount);
          this.resetTextColor();
          this.contents.textColor = customDecColor;
        }
        // If the no symbols notetag was used, force symbol to be empty.
        if (this._tempActor._noSymbols) {
          symbol = "";
        }
        // Retrieve custom stat text for this stat based on increase or decrease.
        var customText = "";
        if (this._tempActor && this._tempActor._customStatTexts) {
          var statKey = "";
          if (paramIndex === 0) statKey = "hp";
          else if (paramIndex === 1) statKey = "mp";
          else if (paramIndex === 2) statKey = "atk";
          else if (paramIndex === 3) statKey = "def";
          else if (paramIndex === 6) statKey = "spd";
          else if (paramIndex === 7) statKey = "luk";
          else if (paramIndex === 100) statKey = "hit";
          else if (paramIndex === 101) statKey = "eva";
          if (statKey && this._tempActor._customStatTexts[statKey]) {
            customText = diff > 0 ? this._tempActor._customStatTexts[statKey].increase : 
                         diff < 0 ? this._tempActor._customStatTexts[statKey].decrease : "";
          }
        }
        var extraText = customText ? " " + customText : "";
        var displayText = value2 + (symbol ? " " + symbol : "") + extraText;
        this.drawText(displayText, 188, -5 + i * rowSpacing, 100);
      } else {
        this.drawText('---', 188, -5 + i * rowSpacing, 150);
      }
      this.resetTextColor();
    }
  }
};

//=============================================================================
// * Update Help
//=============================================================================
Window_OmoMenuActorEquipItem.prototype.updateHelp = function() {
  Window_ItemList.prototype.updateHelp.call(this);
  if (this._actor && this._statusWindow) {
    var actor = JsonEx.makeDeepCopy(this._actor);
    actor.forceChangeEquip(this._slotId, this.item());
    actor.refresh();
    // Parse notetags for fake stat bonuses.
    if (this.item() && this.item().note) {
      var note = this.item().note;
      actor._fakeStatBonuses = {}; // reset fake bonuses
      var statMap = {
        "HEART":   { key: "hp", type: "param", index: 0 },
        "JUICE":   { key: "mp", type: "param", index: 1 },
        "ATTACK":  { key: "atk", type: "param", index: 2 },
        "DEFENSE": { key: "def", type: "param", index: 3 },
        "SPEED":   { key: "spd", type: "param", index: 6 },
        "LUCK":    { key: "luk", type: "param", index: 7 },
        "HITRATE": { key: "hit", type: "xparam", index: 8 },
        "EVASION": { key: "eva", type: "xparam", index: 9 }
      };
      for (var stat in statMap) {
        // Supports notetags like <Attack:+25%> or <Attack:+25> (and negatives),
        // summing multiple matches.
        var re = new RegExp("<" + stat + ":\\s*([+-]\\d+)(%?)>", "gi");
        var bonus = 0;
        var match;
        while ((match = re.exec(note)) !== null) {
          var value = Number(match[1]);
          if (match[2] === "%") { // Percentage bonus
            if (statMap[stat].type === "param") {
              var base = actor.param(statMap[stat].index);
              bonus += Math.floor(base * (value / 100));
            } else if (statMap[stat].type === "xparam") {
              var base = Math.round(actor.xparam(statMap[stat].index - 100) * 100);
              bonus += Math.floor(base * (value / 100));
            }
          } else { // Flat bonus
            bonus += value;
          }
        }
        if (bonus !== 0) {
          actor._fakeStatBonuses[statMap[stat].key] = bonus;
        }
      }
      // Parse custom increase/decrease symbols.
      var incMatch = note.match(/<Increase:\s*(.+?)>/i);
      var decMatch = note.match(/<Decrease:\s*(.+?)>/i);
      actor._customIncreaseSymbol = incMatch ? String(incMatch[1]).trim() : null;
      actor._customDecreaseSymbol = decMatch ? String(decMatch[1]).trim() : null;
      
      // Parse custom colors.
      var incColorMatch = note.match(/<IncreaseColor:\s*(.+?)>/i);
      var decColorMatch = note.match(/<DecreaseColor:\s*(.+?)>/i);
      actor._customIncreaseColor = incColorMatch ? String(incColorMatch[1]).trim() : null;
      actor._customDecreaseColor = decColorMatch ? String(decColorMatch[1]).trim() : null;
      
      // Parse custom stat text for increases and decreases.
      actor._customStatTexts = {};
      for (var stat in statMap) {
         var incTextMatch = note.match(new RegExp("<" + stat + "IncreaseText:\\s*(.+?)>", "i"));
         var decTextMatch = note.match(new RegExp("<" + stat + "DecreaseText:\\s*(.+?)>", "i"));
         if (incTextMatch || decTextMatch) {
           actor._customStatTexts[statMap[stat].key] = {
             increase: incTextMatch ? String(incTextMatch[1]).trim() : "",
             decrease: decTextMatch ? String(decTextMatch[1]).trim() : ""
           };
         }
      }
      
      // Parse notetag to prevent symbols from appearing.
      actor._noSymbols = !!note.match(/<NoSymbols>/i);
    }
    this._statusWindow.setTempActor(actor);
  }
};
