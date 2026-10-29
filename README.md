# my-userscripts
Scipts to modify boring websites

To install:
1. Add the Tampermonkey extension to [Chrome](https://chromewebstore.google.com/detail/dhdgffkkebhmkfjojejmpbldmpobfkfo) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/  ).
2. Open Tampermonkey’s dashboard, click + for a new script, and replace everything in it with the contents of `custom_script.js` and Save.
3. Open or refresh page.


NOTE:
These are AI generated scripts use at your own risk.

## IITM Placement Portal — Clean Dashboard

`iitm-placement-enhancer.js` is the userscript (install it in Tampermonkey as above).
The same script is also packaged as a Chromium MV3 extension in `extension/`:
load it via `chrome://extensions` → Developer mode → **Load unpacked** → pick the `extension` folder.

`extension/content.js` is generated — after editing the userscript, run `extension/build.sh`
and bump `@version` in the userscript and `version` in `extension/manifest.json` together.
