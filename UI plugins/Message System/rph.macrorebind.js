/*:
 * @plugindesc Macro Rebind
 * @author RPH
 *
 * @help
 * ALlows you to edit text macros (For instance to edit actor names)
 * Plugin meant for inclusion in other mods
 * Conflict-free if named in a unique way
 * Put rules below example rules in the code of the plugin
 *
 *
 */



/* DO NOT CHANGE THIS LINE */ if(!window.rebindRules){window.rebindRules=new Set();} /* DO NOT CHANGE THIS LINE */ 
//// PUT RULES BELOW THIS LINE
/// NOTE THAT FOR EACH BACK SLASH YOU NEED TWO
/// USE RULE IDENTIFIERS
/// format: [macro, newText, predicate?, priority?]
/// note that priority is MANDATORY when predicate is provided.
// Example rules: 
// rebindRules.add(["kel", "\\n<DW KEL>"]);
// rebindRules.add(["kel", "\\n<FA KEL>", () => $gameVariables.value(22)===2, 1]);

/// DO NOT CHANGE ANYTHING BELOW THIS LINE
if (!window.rebindInstalled) {
(function() {
    let rules = {};
    let lastRefreshSize = 0;

    let og = {
        MsgMacro: Yanfly.MsgMacro,
        MsgMacroRef: Yanfly.MsgMacroRef
    }

    let lut = {};

    window.rebindRefresh = function() {
        if (lastRefreshSize === window.rebindRules.size) return;
        
        rules = {};
        lut = {};
        for (let i in og.MsgMacroRef) {
            lut[og.MsgMacroRef[i]] = i;
            rules[i] = {
                base: og.MsgMacro[og.MsgMacroRef[i]],
                predicate: []
            }
        }

        window.rebindRules.forEach(function(value) {
            if (value.length === 2) { // BASE RULE
                rules[value[0].toUpperCase()].base = value[1];
            } else {
                rules[value[0].toUpperCase()].predicate.push({
                    priority: value[3]||0,
                    value: value[1],
                    predicate: value[2]
                });
            }
        });

        console.log(rules, lut);
    }

    Yanfly.MsgMacro = new Proxy(Yanfly.MsgMacro, {
        get(target, symbol) {
            if(rules[lut[symbol]]) {
                let predicateRules = rules[lut[symbol]].predicate;
                let predicateResults = [];
                for (let rule of predicateRules) {
                    predicateResults.push([
                        rule.predicate(),
                        rule.priority,
                        rule.value
                    ]);
                }

                predicateResults = predicateResults.filter(value => value[0]);
                predicateResults.sort((a,b) => a[1] - b[1]);
                
                if (predicateResults.length > 0) {
                    return predicateResults[predicateResults.length - 1][2];
                } else {
                    return rules[lut[symbol]].base;
                }
            } else {
                return Reflect.get(...arguments);
            }
        }
    })

    window.rebindInstalled = true;
})();
}
window.rebindRefresh();
