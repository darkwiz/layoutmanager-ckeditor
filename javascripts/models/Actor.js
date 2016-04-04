//Actor.js
define(['models/Lookup',
        'models/Input'],
    function (Lookup, Input) {
        "use strict";

        var Input = Input.Input;
        var Scripts = Backbone.Collection.extend({
            model: Lookup
        });

        var Actor = Input.extend({
            defaults: {
                childModels: new Scripts()
            },
            initialize: function (attrs, options) {
                Input.prototype.initialize.call(this, attrs, options);
                var childModels = this.get("childModels");
                this.childModel = childModels.add({elementId: options.PIN.value}); //lookup classifica

                this.set("labelValue", options.PIN.label);
                this.set("elementId", options.PIN.value);
                this.set("childModel", true);

            },
            addOption: function(value) {
                Lookup.prototype.addOption.call(this.childModel, value);
            },
            setUrl: function(url){
                Lookup.prototype.setUrl.call(this.childModel, url);
            }
        });

        _.defaults(Actor.prototype.defaults, Input.prototype.defaults);

        return {
            Actor: Actor
        }


    });