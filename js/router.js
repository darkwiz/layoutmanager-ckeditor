define(["jquery", "backbone", "models/Form" ,"views/FormView"],

    function($, Backbone, Form,  FormView) {

        var Router = Backbone.Router.extend({

            // constructor: function (options) {
            //     this.on("all", this.storeRoute);
            //     this.history = [];

            //     Backbone.Router.prototype.constructor.call(this, options);
            // },

            // storeRoute: function(){
            //   this.history.push(Backbone.history.fragment);
            // },

            // previous: function() {
            //   if (this.history.length > 1) {
            //     this.navigate(this.history[this.history.length - 2], true);
            //   }
            // },

            initialize: function( options ) {
                // Tells Backbone to start watching for hashchange events
                if (!Backbone.History.started)
                  Backbone.history.start();

            },

            // All of your Backbone Routes (add more)
            routes: {
                //"editor": "showEditor",
                "test/*datasource": "test",
                // When there is no hash on the url, the home method is called
                 "": "index",

            },

          showEditor: function() {
               var form = new Form();
               this.view = new FormView({model: form});

          },
          test: function(datasource) {
               var form = new Form({},{data_path: datasource});
               this.view = new FormView({model: form});

          },
          index: function(){
              if (this.view)
                this.view.dispose();
           }

        });

        // Returns the DesktopRouter class
        return Router;

    }

);

