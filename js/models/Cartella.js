//Fascicolo.js
define([
        'jquery',
        'underscore',
        'backbone',
        'models/Base',
        'models/Input',
        'models/Lookup',
        'models/Span'
        ],
    function ($, _, Backbone, Base, Input, Lookup, Span) {
        "use strict"
        var Input = Input.Input;

        var Scripts = Backbone.Collection.extend({

            model: Lookup

        });


        var CartellaReadOnly = Base.extend({
            defaults: {
                elem: 'cartella',
                horizontal: true,
                folder_name: _.extend({}, Span.prototype.defaults),
                des_folder: _.extend({}, Span.prototype.defaults),
                parent_folder_id: _.extend({}, Span.prototype.defaults)
            },
            initialize: function(attrs, options) {

                Base.prototype.initialize.call(this, attrs, options);

                if(this.get("horizontal")) {this.set("labelValue", "Percorso cartella:");}

                this.folder_name = _.clone(this.get("folder_name"));
                this.folder_name.pinValue = Base.prototype.getPinValue.call(null,options.PIN.value + ".FOLDER_NAME", options.PIN.pintype);
                this.set("folder_name", this.folder_name);

                this.des_folder = _.clone(this.get("des_folder"));
                this.des_folder.labelValue =  "Descrizione:";
                this.des_folder.pinValue =  Base.prototype.getPinValue.call(null,options.PIN.value + ".DES_CARTELLA",options.PIN.pintype);
                this.set("des_folder", this.des_folder);

                this.parent_folder_id = _.clone(this.get("parent_folder_id"));
                this.parent_folder_id.pinValue =  Base.prototype.getPinValue.call(null,options.PIN.value + ".PARENT_FOLDER_ID", options.PIN.pintype) ;
                this.set("parent_folder_id", this.parent_folder_id);
            }

        });


        var Cartella = CartellaReadOnly.extend({
            defaults: {
                elem: 'cartella',
                horizontal: false,
                childModels: new Scripts(),
                parent_folder_id: _.extend({}, Input.prototype.defaults),
                folder_name: _.extend({}, Input.prototype.defaults),
                des_folder: _.extend({}, Input.prototype.defaults)
            },
            initialize: function (attrs, options) {
                //Super call

                CartellaReadOnly.prototype.initialize.call(this, attrs, options);
                var childModels = this.get("childModels");
                this.childModel = childModels.add({elementId: options.PIN.value });

                this.folder_name.labelValue =  "Nome cartella:";
                this.set("folder_name", this.folder_name);

                this.parent_folder_id.elementId = options.PIN.value;
                this.parent_folder_id.childModel = true;
                this.parent_folder_id.labelValue =  "Cartella padre:";
                this.set("parent_folder_id", this.parent_folder_id);


            },
            addOption: function(value) {
                Lookup.prototype.addOption.call(this.childModel, value);
            },
            setUrl: function(url){
                Lookup.prototype.setUrl.call(this.childModel, url);
            }
        });




        _.defaultsDeep(Cartella.prototype.defaults, CartellaReadOnly.prototype.defaults);

        return {
            CartellaReadOnly: CartellaReadOnly,
            Cartella: Cartella
        }


    });
