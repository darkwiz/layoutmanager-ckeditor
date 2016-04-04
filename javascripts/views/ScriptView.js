// PinInOutView.js
define(["jquery", "underscore","backbone", "handlebars", "templates/scripts"],

    function($, _, Backbone, Handlebars, Scripts){

        "use strict";

        var ScriptView = Backbone.View.extend({

            tagName:"span",
            className:"dynamic-script",

            getTemplate: function(model){
                var type = model.get('elem');
                return Scripts.getTemplate(type);
            },
            // View Event Handlers
            events: {
                "click #resetButton": "popup"
            },


            // View constructor
            initialize: function() {
                _.bindAll(this); // every function that uses 'this' as the current object should be in here

                this.model.on("change", this.updateSource, this);
                //questo viene fatto in automatico
                //this.$el = $(this.el);

            },

            // Renders the view's template to the UI
            render: function() {

                //this.model.get("libraries").forEach(this.addOne, this);
                var script = document.createElement( 'script' );
                this.template = this.getTemplate(this.model);
                script.innerHTML = this.template(this.model.toJSON());
                //this.$el.html(this.template(this.model.toJSON()));
                this.$el.append(script);
                //funziona con view.render
                //this.$el.append(this.template(this.model.toJSON())); funziona ma esegue continuamente lo script
                //this.$el[0].appendChild(script);
                //this.$el.html($(this.template(this.model.toJSON())));

                return this;

            },
            addOne: function(library) {
                var script = document.createElement( 'script' );
                script.src = library;
                this.$el[0].appendChild(script);
            },
            onClose: function(){
                this.model.unbind("change", this.updateSource);
            },
            updateSource: function(model) {
                var script = document.createElement( 'script' );
                script.innerHTML = this.template(model.toJSON());
                this.$el.html(script);
            }

        });

        // Returns the View class
        return ScriptView;

    }

);
