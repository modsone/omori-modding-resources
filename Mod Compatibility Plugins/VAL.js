// Allows you to use val(value) and setval(value, valuechange) in place of $gameVariables.value(value) and $gameVariables.setValue(value, valuechange)
// Also does the same thing with switches for sis(value) and setsis(value, valuechange).

val = function(val) { return $gameVariables.value(val)}

setval = function(val, change) { return $gameVariables.setValue(val, change)}

sis = function(sis) { return $gameSwitches.value(sis)}

setsis = function(sis, targ) { return $gameSwitches.setValue(sis, targ)}