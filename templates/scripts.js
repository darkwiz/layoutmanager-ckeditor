// templates.js
define(["handlebars",
    "text!templates/lookup.html",

], function(Handlebars, lookup){
    "use strict";

    Handlebars.registerHelper("getIdSelector", function (string) {
        return '"#'+ string +'"';
    });

    Handlebars.registerHelper("isEmpty", function (obj) {
        //console.log((obj.length === 0));
        return (obj.length === 0);
    });

    return {
        getTemplate: function(type){

            return ({
                "lookup": Handlebars.compile(lookup)
            }[type]);
        }
    }

});
