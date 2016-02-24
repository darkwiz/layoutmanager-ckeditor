define(['jquery','underscore','backbone', 'modelfactory'], function ($, _, Backbone, Factory) {
    return Backbone.Collection.extend({
        initialize: function(attrs, options){
            console.log('init');
        },
        model: function(attrs, options) {
            return Factory.createControl(attrs, options);
        },
        idAttribute: 'pinValue'

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
