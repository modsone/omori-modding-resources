// SPDX-License-Identifier: Apache-2.0
// Author: Rph (github.com/rphsoftware)
!function() {
    const MIN_MAJOR = 1;
    const MIN_MINOR = 4;
    const MIN_PATCH = 3;
    const THISMOD = "NAME OF YOUR MOD HERE";
    const ONELOADER_UPDATE = "https://github.com/rphsoftware/oneloader/releases/latest";

    const TRANSLATABLE = {
        "FirstLine": "You are currently running OneLoader %version%",
        "SecondLine": "%thismod% requires at least OneLoader %version%",
        "BeforeUpdateOneLoader": "Please ",
        "UpdateOneLoader": "UPDATE ONELOADER",
        "AfterUpdateOneLoader": " before you continue playing."
    }

    if (!window.$modLoader) {
        console.log("Skipping OneLoader version check, we don't seem to be in a retail environment");
        return;
    }

    const oneloaderVersion = $modLoader.knownMods.get("oneloader").json.version;

    const splitOneloaderVersion = oneloaderVersion.split(".").map(n => parseInt(n) || 0);

    // Oh god people might still be running Preview versions.......
    const oneloaderMajor = splitOneloaderVersion[0] || 0;
    const oneloaderMinor = splitOneloaderVersion[1] || 0;
    const oneloaderPatch = splitOneloaderVersion[2] || 0;

    let good = false;
    if (oneloaderMajor > MIN_MAJOR) {
        good = true;
    }
    if (oneloaderMajor == MIN_MAJOR) {
        if (oneloaderMinor > MIN_MINOR) {
            good = true;
        }
        if (oneloaderMinor == MIN_MINOR) {
            if (oneloaderPatch >= MIN_PATCH) {
                good = true;
            }
        }
    }

    if (!good) {
        let banner = document.createElement("div");
        
        banner.innerHTML = `${
            TRANSLATABLE.FirstLine.replace("%version%", oneloaderVersion)
        }<br>${TRANSLATABLE.SecondLine.replace("%thismod%", THISMOD).replace("%version%", `${MIN_MAJOR}.${MIN_MINOR}.${MIN_PATCH}`)}<br>${TRANSLATABLE.BeforeUpdateOneLoader}`;
        
        let link = document.createElement("a");
        link.addEventListener("click", function() {
            require('child_process').execSync(`start ${ONELOADER_UPDATE}`);
        });
        link.style = "text-decoration: underline; cursor: pointer;";
        link.innerText = TRANSLATABLE.UpdateOneLoader;

        let tn = document.createTextNode(TRANSLATABLE.AfterUpdateOneLoader);
        banner.appendChild(link);
        banner.appendChild(tn);

        setTimeout(() => {
            let fs = "32px";
            if (window.innerWidth > 1000) {
                fs = "64px";
            }
            if (window.innerWidth > 1500) {
                fs = "96px";
            }
            banner.style = "text-align: center; position: fixed; top: 0; left: 0; right: 0; z-index: 999999; background: red; color: white; font-family: OMORI_GAME2; font-size: " + fs + ";";
            document.body.appendChild(banner);
        }, 5000);
    }
}();