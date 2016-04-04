// Base.js
define(["jquery", "underscore","backbone"],
    function ($, _, Backbone) {
        return Backbone.Model.extend({
            defaults: {
                elem:"null"
            },
            initialize: function(attrs, options) {
                options = options || {};
                if (options.PIN){
                    this.set("pinValue", options.PIN.value);
                    this.set("pinName", options.PIN.name);
                }
            }
        });
    });