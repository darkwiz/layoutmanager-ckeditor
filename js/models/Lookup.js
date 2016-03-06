// Lookup.js
// --------
define(["models/Base"], function (Base) {
    return Base.extend({
        // general state and behavior for all pinin controls elements
        defaults: _.extend({
            labelCss:"control-label", //utilizzabili per lo script, inutili attualmente
            containerCss:"control-container col-sm-6",
            elem:"lookup",
            libraries: [
               // "https://code.jquery.com/jquery-2.2.0.min.js",
               // "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js",
               // "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js",
               // "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-tokenfield/0.12.0/bootstrap-tokenfield.min.js",
                ],
            fromUrl:false,
            source: [],
            sourceUrl: 'http://jsonplaceholder.typicode.com/users',
        }, Base.prototype.defaults),
        initialize: function(attrs, options) {
            //Base.prototype.initialize.call(this, attrs, options);
            this.on('invalid', function(model,error){
                alert(error);
            });
        },
        setSource: function(options) {
            this.set("fromUrl", false);
            this.set("source", options);
        },
        addOption: function(value){
            this.set("fromUrl", false);
            var options = _.clone(this.get("source"));
            options.push(value);
            this.set("source", options);
        },
        removeOption: function(index){
            var options = _.clone(this.get("source"));
            options.splice(index, 1);
            this.set("source", options);

        },
        setUrl: function(url) {
            url = url || this.get("sourceUrl");
            this.set("fromUrl", true);
            this.set("sourceUrl", url, {validate: true});
        },
        validate: function(attrs, options) {
            var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
            var regex = new RegExp(expression);
            var sourceURL = attrs.sourceUrl;
            if (!regex.test(sourceURL))
            {
                return "Inserire un url valido";
            }
        }
    });



});
