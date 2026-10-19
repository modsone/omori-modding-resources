/*:
 * @plugindesc for omori mods, to create your own error message
 * @author kebab
 * 
 * 
 * @help use the plugin parameters
 * credits to red tinted gamerfox for the documentation
 * an example of custom text: 'DEEP SEA RUNE has encountered a bug. Please report it <a href="#" onclick="Graphics.openCustomErrorLink()" style="color:#ff00ff;">in the discord server</a><br>'
 * do NOT forget to add the onclick="Graphics.openCustomErrorLink()" in the "a href".
 * and an example of a link: https://steamcommunity.com/app/1150690/discussions/0/2995422276377408303/
 * 
 * 
 * @param HTML Text
 * @desc the custom text to add to the OMORI has encountered an error message using HTML
 * @type string
 * @default OMORI has encountered a bug. Please report it on <a href="#" onclick="Graphics.openCustomErrorLink()" style="color:green;">Steam</a><br>
 * 
 * @param Link
 * @desc the custom link to add in the error message, the link will be clickable for whatever you put in the "a href".
 * @type string
 * @default https://steamcommunity.com/app/1150690/discussions/0/2995422276377408303/
 * 
 * @param JS Styles
 * @desc lets you add CSS Styles to the error message with the javascript properties.
 * @type struct<style>[]
 * @default []
 * 
*/

/*~struct~style:
 * @param property
 * @text CSS property in js (Example: textShadow, fontSize, etc...)
 * @type text
 * 
 * @param value
 * @text Value of the property (Example: if they property is textShadow, you add: 1px 1px 2px black)
*/

var kebab = kebab || {};
kebab.errorMessage = kebab.errorMessage || {};
kebab.errorMessage.pluginParams = PluginManager.parameters('kebab_customOmoriErrorMessage');
kebab.errorMessage._updateableProperties = ['width', 'height', 'textAlign', 'textShadow', 'fontFamily', 'fontSize', 'zIndex', 'padding'];
// kebab.errorMessage._anyError = false;

Graphics.setCustomErrorMessageStyles = function() {
//  if (!kebab.errorMessage._anyError) return;
 var rawStyles = JSON.parse(kebab.errorMessage.pluginParams['JS Styles'] || '[]');
 var styles = rawStyles.map(s => JSON.parse(s));
 if (styles.length) {
  styles.forEach(s => {
   var prop = s.property;
   var val = s.value;
   if (prop && val) this._errorPrinter.style[s.property] = s.value;
  })
 }
}

Graphics.setCustomErrorMessageStylesUpdate = function() {
 var rawStyles = JSON.parse(kebab.errorMessage.pluginParams['JS Styles'] || '[]');
 var styles = rawStyles.map(s => JSON.parse(s));
 if (styles.length) {
  styles.forEach(s => {
   var prop = s.property;
   var val = s.value;
   if (kebab.errorMessage._updateableProperties.includes(prop) && prop && val) this._errorPrinter.style[s.property] = s.value;
  })
 }
}

kebab.errorMessage._oldGraphicsUpdateErrorPrinter = Graphics._updateErrorPrinter;
Graphics._updateErrorPrinter = function() {
 kebab.errorMessage._oldGraphicsUpdateErrorPrinter.call(this);
 this.setCustomErrorMessageStylesUpdate();
}

Graphics.openCustomErrorLink = function() {
 var link = kebab.errorMessage.pluginParams['Link'];
 window.nw.Shell.openExternal(link);
}

Graphics.processErrorStackMessage = function(stack) {
//  kebab.errorMessage._anyError = true;
 this.setCustomErrorMessageStyles();
 var text = kebab.errorMessage.pluginParams['HTML Text'];
 var data = stack.split(/(?:\r\n|\r|\n)/);
 data.unshift(text);
 for (var i = 1; i < data.length; ++i) {
  data[i] = data[i].replace(/[\(](.*[\/])/, '(');
 }
 return data;
}