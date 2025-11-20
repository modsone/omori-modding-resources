/*:
 * @plugindesc Instashow Text
 * @author RPH
 *
 * @help
 * Makes text appear instantly instead of animating in
 *
 *
 */

(function() { Object.defineProperty(Window_Message.prototype, "_lineShowFast", { get: function _lineShowFast() { return true; } }); })();