// Span.js
// --------
define(["models/Base"], function (Base) {
  return Base.extend({
   // general state and behavior for all pinin controls elements
    defaults: _.extend({
        type:"text",
        elem:"span",
        elementType:"text",
        elementValues: [""],
        elementCss:"form-control"
}, Base.prototype.defaults)
    })
});