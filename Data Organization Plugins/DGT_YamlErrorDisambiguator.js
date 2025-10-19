!function() {
  {
  let old_require = window.require
  let funkyFS = old_require.call(null, "fs")
  let old_readFileSync = funkyFS.readFileSync
  funkyFS.readFileSync = function(...args) {
    if (/^.*\.(yaml|yml|hero)$/i.test(args[0])) {
      window.__lastYAMLFile = args[0].replace(/(.*?\/)*([^.]+)(\..*)/, "$2.yaml")
          // temporarily log any yaml filenames to a global variable
          // to be used in the event of an error
    }
    //console.log("B")
    return old_readFileSync.call(this, ...args)
  }
  window.require = function(what) {
  	if (what === "fs") { // intercept fs script
      // thank you rph for bringing to light the fact that require can be overridden
      // bless up 😇😇
  		return funkyFS
  	} else {
  		return old_require.call(this, what);
  	}
  }
  }
  console.log("AAAAAAAAAA")
  AtlasManager = class extends AtlasManager {
    static hasAltasData(..._) {
      try {
        return super.hasAltasData(..._)
      } catch(e) {
        e = window.__lastYAMLError || e
        Graphics.printFullError(e.name, e.message, e.stack)
        SceneManager.stop()
        throw e
      }
    }
  }
  LanguageManager = class extends LanguageManager {
    static initialize() {
      let old_loadLang = this.loadAllLanguageFiles
      this.loadAllLanguageFiles = function(..._) {
        try {
          old_loadLang.call(this, ..._)
        } catch(e) {
          e.name = window.__lastYAMLFile || "YAML ERROR" // something behind... the hikiKO MORI????
          window.__lastYAMLError = e
          throw e
        }
      }
      super.initialize()
    }
  }
}();
