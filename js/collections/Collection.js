define(['jquery','underscore','backbone', 'modelfactory', "models/Base"], function ($, _, Backbone, Factory, Base) {
    return Backbone.Collection.extend({
        /*initialize: function(attrs, options){
            console.log('init');
        },*/
       /* model: function(attrs, options) {
            return Factory.createControl(attrs, options);
        }*/

        model: Base.extend({
            constructor: function (attrs, options) {
                var model = Factory.createControl(attrs, options);
                return new model(attrs, options);
                }
            }),
            idAttribute: '_id'
            /*
            var Collection = Backbone.Collection.extend({
                model: Backbone.Model.extend({
                    constructor: function (attrs, options) {
                        var model = attrs.foo ? MyFooModel : MyBarModel;
                        return new model(attrs, options);
                    },

                    idAttribute: '_id' // or whatever you need
                })
            });*/

        // add: function(models, options){

        //     var duplicates = this.filter(function(_models) {
        //         console.log("LabelID:", _models.get('pinValue'), "(== : !=) ", options.PIN.value);
        //         return _models.get('pinValue') == options.PIN.value;
        //     });

        //     if ( _(duplicates).size() > 0) {
        //         this.remove(duplicates);  //, {silent:true});  rimozione precedente duplicata
        //     }

        //     return Backbone.Collection.prototype.add.call(this, models, options);

        // }
        });
});
