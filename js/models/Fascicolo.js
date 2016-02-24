//Fascicolo.js
define([
        'jquery', 'underscore','backbone','models/Radio',
        'models/Base',
        'models/Input',
        'models/Lookup',
        'models/Span',
        "models/Classifica"],
    function ($, _, Backbone, Radio, Base, Input, Lookup, Span, Classifica) {
        "use strict"
        var Input = Input.Input;

        var Scripts = Backbone.Collection.extend({

            model: Lookup

        });

        var FascicoloReadOnly = Base.extend({
            defaults: {
                type: 'fascicolo',
                elem: 'fascicolo',
                //collection: true,
                classifica: _.extend({}, Span.prototype.defaults),
                des_fascicolo: _.extend({}, Span.prototype.defaults),
                progr_fascicolo: _.extend({}, Span.prototype.defaults),
                anno_fascicolo:_.extend({}, Span.prototype.defaults)
            },
            initialize: function(attrs, options) {

                Base.prototype.initialize.call(this, attrs, options);

                this.classifica = _.clone(this.get("classifica"));
                this.classifica.labelValue =  "Classifica:";
                this.classifica.pinValue = options.PIN.value + ".CLASSIFICA";
                this.set("classifica", this.classifica);

                this.des_fascicolo = _.clone(this.get("des_fascicolo"));
                this.des_fascicolo.labelValue =  "Descrizione Fascicolo:";
                this.des_fascicolo.pinValue =  options.PIN.value + ".DES_FASCICOLO";
                this.set("des_fascicolo", this.des_fascicolo);

                if(this.progr_fascicolo) {
                    this.progr_fascicolo = _.clone(this.get("progr_fascicolo"));
                    this.progr_fascicolo.labelValue = "Progessivo Fascicolo:";
                    this.progr_fascicolo.pinValue = options.PIN.value + ".PROGR_FASCICOLO";
                    this.set("progr_fascicolo", this.progr_fascicolo);
                }

                this.anno_fascicolo = _.clone(this.get("anno_fascicolo"));
                this.anno_fascicolo.labelValue =  "Anno Fascicolo:";
                this.anno_fascicolo.pinValue =  options.PIN.value + ".ANNO_FASCICOLO" ;
                this.set("anno_fascicolo", this.anno_fascicolo);

                this.parent_progr_fascicolo = _.clone(this.get("parent_progr_fascicolo"));
                this.parent_progr_fascicolo.labelValue =  "Progressivo Fascicolo Padre:";
                this.parent_progr_fascicolo.pinValue =  options.PIN.value + ".PARENT_PROGR_FASCICOLO" ;
                this.set("parent_progr_fascicolo", this.parent_progr_fascicolo);
            }

        });

        var Fascicolo = FascicoloReadOnly.extend({
            defaults: {
                childModels: new Scripts(),
                classifica: _.extend({}, Input.prototype.defaults), //lookup
                parent_progr_fascicolo: _.extend({}, Input.prototype.defaults), //lookup
                progr_fascicolo: false //disabilito la modifica del prog_fascicolo
            },
            initialize: function(attrs, options){
                //Super call

                FascicoloReadOnly.prototype.initialize.call(this, attrs, options);
                var childModels = this.get("childModels");
                childModels.add({elementId: options.PIN.value + "classifica"});//lookup classifica
                childModels.add({elementId: options.PIN.value + "parent_progr_fascicolo"});//lookup parent


                this.classifica.elementId = options.PIN.value + "classifica";
                this.classifica.childModel = true;
                this.set("classifica", this.classifica);

                this.parent_progr_fascicolo.elementId = options.PIN.value + "parent_progr_fascicolo";
                this.parent_progr_fascicolo.childModel = true;
                this.set("parent_progr_fascicolo", this.parent_progr_fascicolo);

            },
            includeChild: function (child) {
                child.bind('change', this.onChildChange, this);
            },
            onChildChange: function (child) {
                child.trigger("change", this);
            },
            addOption: function(value) {
                Lookup.prototype.addOption.call(this.childModel, value);
            },
            setUrl: function(url){
                Lookup.prototype.setUrl.call(this.childModel, url);
            }


        });


        _.defaultsDeep(Fascicolo.prototype.defaults, FascicoloReadOnly.prototype.defaults);

        return {
            FascicoloReadOnly: FascicoloReadOnly,
            Fascicolo: Fascicolo
        }


    });
