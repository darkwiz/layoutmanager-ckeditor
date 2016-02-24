define(["jquery","underscore", "backbone", "appconfig"], function ($, _,  Backbone, config) {
  return Backbone.Model.extend({ //TODO: se due pin hanno lo stesso nome l'algoritmo non funziona bene
      defaults: {
       name:{},
       description:{},
       FTL:{}
      },
      initialize: function(attrs, options){
        this.options = options;
      },
      url: function(){
          return "test/" + this.options.data_path;
      },
      parse: function (response) {
        var outputs = this.flattenArray(response.settings.outputs, 'out');
        var inputs = this.flattenArray(response.settings.inputs, 'in');

        var result = this.intersectionObjects(inputs, outputs, function(item1, item2) {
            return item1.value === item2.value;
        });

        result = this.flattenArray(result, 'inout').concat(inputs, outputs);
        config.rte.ckeditor.customValues.pins = result;

        return response.settings.props;
      },
      flattenArray: function(collection, type) {
        return _.filter(collection, function(value, key) {
            //se type è in o out assegna chiave come nome, altrimenti combina con type
            value.name = (_.isString(key)) ? key : value.name + "_" + type;
            value.pintype = type;
            return (!value.hidden) ? value : null ;
        });
      },
      intersectionObjects2: function (a, b, areEqualFunction) {
        var results = [];

        for(var i = 0; i < a.length; i++) {
            var aElement = a[i];
            var bIndex= 0;
            var existsInB = _.find(b, function(bElement, index) { //_.some
              bIndex = index;
              return areEqualFunction(bElement, aElement); });
              //console.log("Match:", existsInB);

            if(existsInB) {
                a.splice(i, 1);
                b.splice(bIndex, 1);
                results.push(existsInB);
            }
        }

        return results;
      },
       intersectionObjects: function() {
          var results = arguments[0];
          var lastArgument = arguments[arguments.length - 1];
          var arrayCount = arguments.length;
          var areEqualFunction = _.isEqual;

          if(typeof lastArgument === "function") {
              areEqualFunction = lastArgument;
              arrayCount--;
          }

          for(var i = 1; i < arrayCount ; i++) {
              var array = arguments[i];
              results = this.intersectionObjects2(results, array, areEqualFunction);
              if(results.length === 0) break;
          }

          return results;
      }
      });
});
