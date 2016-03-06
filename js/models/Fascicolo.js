//Fascicolo.js
define([
        'jquery',
        'underscore',
        'backbone',
        'models/Base',
        'models/Input',
        'models/Lookup',
        'models/Span',
        "models/Year"],
    function ($, _, Backbone, Base, Input, Lookup, Span, Year) {
        "use strict"
        var Input = Input.Input;

        var Scripts = Backbone.Collection.extend({

            model: Lookup

        });

        var FascicoloReadOnly = Base.extend({
            defaults: {
               // type: 'fascicolo',
                elem: 'fascicolo',
                //collection: true,
                classifica: _.extend({}, Span.prototype.defaults),
                des_fascicolo: _.extend({}, Span.prototype.defaults),
                progr_fascicolo: _.extend({}, Span.prototype.defaults),
                parent_progr_fascicolo: _.extend({}, Span.prototype.defaults),
                anno_fascicolo:_.extend({}, Span.prototype.defaults)
            },
            initialize: function(attrs, options) {

                Base.prototype.initialize.call(this, attrs, options);

                this.classifica = _.clone(this.get("classifica"));
                this.classifica.labelValue =  "Classifica:";
                this.classifica.pinValue = Base.prototype.getPinValue.call(null,options.PIN.value + ".CLASSIFICA", options.PIN.pintype);
                this.set("classifica", this.classifica);

                this.des_fascicolo = _.clone(this.get("des_fascicolo"));
                this.des_fascicolo.labelValue =  "Descrizione Fascicolo:";
                this.des_fascicolo.pinValue =  Base.prototype.getPinValue.call(null,options.PIN.value + ".DES_FASCICOLO", options.PIN.pintype);
                this.set("des_fascicolo", this.des_fascicolo);

                if(this.progr_fascicolo) {
                    this.progr_fascicolo = _.clone(this.get("progr_fascicolo"));
                    this.progr_fascicolo.labelValue = "Progessivo Fascicolo:";
                    this.progr_fascicolo.pinValue = Base.prototype.getPinValue.call(null,options.PIN.value + ".PROGR_FASCICOLO", options.PIN.pintype);
                    this.set("progr_fascicolo", this.progr_fascicolo);
                }

                this.anno_fascicolo = _.clone(this.get("anno_fascicolo"));
                this.anno_fascicolo.labelValue =  "Anno Fascicolo:";
                this.anno_fascicolo.pinValue = Base.prototype.getPinValue.call(null, options.PIN.value + ".ANNO_FASCICOLO", options.PIN.pintype) ;
                this.set("anno_fascicolo", this.anno_fascicolo);

                this.parent_progr_fascicolo = _.clone(this.get("parent_progr_fascicolo"));
                this.parent_progr_fascicolo.labelValue =  "Progressivo Fascicolo Padre:";
                this.parent_progr_fascicolo.pinValue =  Base.prototype.getPinValue.call(null,options.PIN.value + ".PARENT_PROGR_FASCICOLO", options.PIN.pintype) ;
                this.set("parent_progr_fascicolo", this.parent_progr_fascicolo);
            }

        });

        var Fascicolo = FascicoloReadOnly.extend({
            defaults: {
                childModels: new Scripts(),
                classifica: _.extend({}, Input.prototype.defaults), //lookup
                parent_progr_fascicolo: _.extend({}, Input.prototype.defaults), //lookup
                des_fascicolo: _.extend({}, Input.prototype.defaults),
                anno_fascicolo: _.extend({}, Year.prototype.defaults),
                progr_fascicolo: false //disabilito la modifica del prog_fascicolo
            },
            initialize: function(attrs, options){
                //Super call

                FascicoloReadOnly.prototype.initialize.call(this, attrs, options);
                var childModels = this.get("childModels");
                this.listaClassifica = childModels.add({elementId: options.PIN.value + "_classifica"});//lookup classifica
                this.listaFascicoli = childModels.add({elementId: options.PIN.value + "_parent_progr_fascicolo"});//lookup parent

                this.classifica.elementId = options.PIN.value + "_classifica";
                this.classifica.childModel = true;
                this.set("classifica", this.classifica);

                this.parent_progr_fascicolo.elementId = options.PIN.value + "_parent_progr_fascicolo";
                this.parent_progr_fascicolo.childModel = true;
                this.set("parent_progr_fascicolo", this.parent_progr_fascicolo);

                var year = new Year(this.get("anno_fascicolo"));
                this.set("anno_fascicolo", year.attributes);

                this.set("des_fascicolo", this.des_fascicolo);

            },
           /* includeChild: function (child) { //forse si può eliminare dato che gli update essendo una collection si propagano
                child.bind('change', this.onChildChange, this);
            },
            onChildChange: function (child) {
                child.trigger("change", this);
            },*/
            popolaTitolario: function( list ) {
                Lookup.prototype.setSource.call(this.listaClassifica, list)
            },
            popolaFascicoli: function( list ) {
                Lookup.prototype.setSource.call(this.listaFascicoli, list)
            },
            loadFascicoli: function(url){

                var dfd = new $.Deferred();
                var self = this;
                $.ajax({
                    url: url,
                    jsonp: "callback",
                    dataType: "jsonp",
                    success: function (data) {
                        // resolve with compiled template
                        var items = {
                            titolario: [],
                            fascicolo_padre: []
                        };
                        //$.when(dfd).done(
                            $.each( data.content, function( key, val ) {
                                    items.titolario.push(val["titolario"]);
                             })
                            $.each( data.content, function( key, val ) {
                                items.fascicolo_padre.push(val["fascicolo_padre"]);
                            })

                            items.titolario = _.uniq(items.titolario);
                            self.popolaTitolario(items.titolario);
                            self.popolaFascicoli(items.fascicolo_padre);
                        //)
                         dfd.resolve( items );
                    },
                    fail: function() {
                        // failed to load source dynamically, probably not there

                        dfd.reject( );
                    }
                });

                return dfd.promise();


            }


        });


        _.defaultsDeep(Fascicolo.prototype.defaults, FascicoloReadOnly.prototype.defaults);

        return {
            FascicoloReadOnly: FascicoloReadOnly,
            Fascicolo: Fascicolo
        }


    });
