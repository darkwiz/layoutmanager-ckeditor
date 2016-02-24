//Soggetto.js
define(['models/Base','models/Input','models/Span', 'models/Lookup'],
    function (Base, Input, Span, Lookup) {
        "use strict";

        var Input = Input.Input;
        var Scripts = Backbone.Collection.extend({
            model: Lookup
        });
        var Soggetto = Base.extend({
            defaults: {
                elem: 'soggetto',
                type: 'soggetto',
                name: _.extend({}, Input.prototype.defaults),
                IndirizzoTelematico: _.extend({}, Input.prototype.defaults) //TODO:This should be an email
            },
            initialize: function(attrs, options) {
                this.name = _.clone(this.get("name"));
                this.name.pinValue =  options.PIN.value + ".name" ;
                this.name.labelValue =  "Nome Soggetto:";
                this.set("name", this.name);

                this.email = _.clone(this.get("IndirizzoTelematico"));
                this.email.pinValue =  options.PIN.value + ".IndirizzoTelematico" ;
                this.email.labelValue = "IndirizzoTelematico:";
                this.set("IndirizzoTelematico", this.email);

            }
        });

        var SoggettoReadOnly = Soggetto.extend({
            defaults: {
                name: _.extend({}, Span.prototype.defaults),
                IndirizzoTelematico: _.extend({}, Span.prototype.defaults)
            },
            initialize: function(attrs, options){
                //Super call
                Soggetto.prototype.initialize.call(this, attrs, options);
            }
        });


        var SoggettoLookup = Soggetto.extend({
            defaults: {
                childModels: new Scripts()
            },
            initialize: function (attrs, options) {

                Soggetto.prototype.initialize.call(this, attrs, options);
                var childModels = this.get("childModels");
                this.childModel = childModels.add({elementId: options.PIN.value}); //lookup classifica

                this.name.labelValue = options.PIN.label;
                this.name.elementId = options.PIN.value;
                this.name.childModel = true;
                this.set("name", this.name);

            },
            addOption: function(value) {
                Lookup.prototype.addOption.call(this.childModel, value);
            },
            setUrl: function(url){
                Lookup.prototype.setUrl.call(this.childModel, url);
            }
        });


        // Uses _.defaults to allow the overriding of default values in subclass
        _.defaultsDeep(SoggettoReadOnly.prototype.defaults, Soggetto.prototype.defaults);
        _.defaultsDeep(SoggettoLookup.prototype.defaults, Soggetto.prototype.defaults);


        return {
            Soggetto: Soggetto,
            SoggettoReadOnly: SoggettoReadOnly,
            SoggettoLookup:SoggettoLookup
        }
    });