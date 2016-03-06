// List.js
// --------
define(["models/Base"], function (Base) {
    return Base.extend({
        // general state and behavior for all pinin controls elements
        defaults: _.extend({
            //type:"text",
            elem:"list",
            elementType:"text",
            elementCss:"form-control",
            elementValues: ["Lista vuota"]
        }, Base.prototype.defaults),
        initialize: function(attrs, options) {
            Base.prototype.initialize.call(this, attrs, options);
        },
        addOption: function(value){
            var options = _.clone(this.get("elementValues"));
            if(options[0] !== "Lista vuota")
            {
                options.push(value);
                }
            else
            {
                options.pop();
                options.push(value);
            }
            this.set("elementValues", options);
        },
        removeOption: function(index){
            var options = _.clone(this.get("elementValues"));
                options.splice(index, 1);
            this.set("elementValues", options);

        }
    });



});
