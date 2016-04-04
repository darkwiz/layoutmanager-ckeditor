//Classifica.js
define(['models/Base',
        'models/Span',
        'models/Lookup',
        'models/Input'],
    function (Base, Span, Lookup, Input) {
        "use strict";

        var Scripts = Backbone.Collection.extend({
            model: Lookup
        });

        var Input = Input.Input;
        var ClassificaReadOnly = Base.extend({
            defaults: {
               // type:"classifica",
                elem:"classifica",
                classifica: _.extend({}, Span.prototype.defaults), //per out e in/out tipo lookup
                des_titolario: _.extend({}, Span.prototype.defaults),
                parent_classifica: _.extend({}, Span.prototype.defaults)
            },
            initialize: function(attrs, options) {

                Base.prototype.initialize.call(this, attrs, options);

                this.classifica = _.clone(this.get("classifica"));
                this.classifica.labelValue =  "CLASSIFICA:";
                this.classifica.pinValue =  Base.prototype.getPinValue.call(null, options.PIN.value + ".CLASSIFICA", options.PIN.pintype);
                this.set("classifica", this.classifica);

                this.des_titolario = _.clone(this.get("des_titolario"));
                this.des_titolario.labelValue = "DES_TITOLARIO:";
                this.des_titolario.pinValue =  Base.prototype.getPinValue.call(null, options.PIN.value + ".DES_TITOLARIO" , options.PIN.pintype) ;
                this.set("des_titolario", this.des_titolario);

                this.parent_classifica = _.clone(this.get("parent_classifica"));
                this.parent_classifica.labelValue = "PARENT_CLASSIFICA:";
                this.parent_classifica.pinValue =  Base.prototype.getPinValue.call(null, options.PIN.value + ".PARENT_CLASSIFICA", options.PIN.pintype) ;
                this.set("parent_classifica", this.parent_classifica);

            }

        });
        var Classifica = ClassificaReadOnly.extend({
            defaults: {
                childModels: new Scripts(),
                classifica: _.extend({}, Input.prototype.defaults),
                des_titolario: _.extend({}, Input.prototype.defaults),
                parent_classifica: _.extend({}, Input.prototype.defaults)
            },
            initialize: function(attrs, options){

                ClassificaReadOnly.prototype.initialize.call(this, attrs, options);

                var childModels = this.get("childModels");
                this.childModel = childModels.add({elementId: options.PIN.value}); //lookup classifica

                this.classifica.labelValue =  options.PIN.label;
                this.classifica.elementId = options.PIN.value;
                this.classifica.childModel = true;
                this.set("classifica", this.classifica);

                this.des_titolario.labelValue = "";
                this.des_titolario.elementType = "hidden";
                this.set("des_titolario", this.des_titolario);

                this.parent_classifica.labelValue = "";
                this.parent_classifica.elementType = "hidden";
                this.set("parent_classifica", this.parent_classifica);

            },
            /*includeChild: function (child) {
                child.bind('change', this.onChildChange, this);
            },
            onChildChange: function (child) {
                child.trigger("change", this);
            },*/
            addOption: function(value) {
                Lookup.prototype.addOption.call(this.childModel, value);
            },
            setUrl: function(url){
                Lookup.prototype.setUrl.call(this.childModel, url);
            }

        });

        // Uses _.defaults to allow the overriding of default values in subclass
        _.defaultsDeep(Classifica.prototype.defaults, ClassificaReadOnly.prototype.defaults);


        return {
            ClassificaReadOnly: ClassificaReadOnly,
            Classifica: Classifica
        }


    });