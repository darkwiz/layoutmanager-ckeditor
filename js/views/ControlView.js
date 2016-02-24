// ControlView.js
define(["jquery", "underscore","backbone", "handlebars", "templates/templates"],

    function($, _, Backbone, Handlebars, Templates){

        "use strict";

        var ControlView = Backbone.View.extend({

            tagName:  "div",
            className: "div-container",

            getTemplate: function(model){
                         var type = model.get('elem');
                         return Templates.getTemplate(type);
                    },
            // View Event Handlers
            events: {
                "click #resetButton": "popup",
                "click .edit": "onEdit",
            },


            // View constructor
            initialize: function() {
                _.bindAll(this); // every function that uses 'this' as the current object should be in here

                this.model.on('update', this.update, this);
                this.model.on('change:elementValues', this.updateControl, this);
                //questo viene fatto in automatico
                //this.$el = $(this.el);
            },

            // Renders the view's template to the UI
            render: function() {
                this.template = this.getTemplate(this.model);

                this.$el.html(this.template(this.model.toJSON()));

                this.$label = this.$('.control-label');
                this.$control = this.$('.control-container');
                return this;

            },
            update: function () {
                if(this.$label[0])
                    this.$label.removeClass(this.$label[0].className).addClass(this.model.get('labelCss'));
                if(this.$control[0])
                    this.$control.removeClass(this.$control[0].className).addClass(this.model.get('containerCss'));
            },
            onClose: function(){
                this.model.unbind("update", this.update);
                this.model.unbind("change:elementValues", this.updateControl);
            },
            updateControl: function(model) {
                var partial = Handlebars.partials[this.model.get('elem')]
                this.$control.html(partial(model.toJSON()));
            },
            onEdit: function(event) {
                console.log("clicked");
                var pintype = $(event.currentTarget).data("pin");
                if (pintype == "in")
                    CKEDITOR.currentInstance.openDialog( 'pinin' );
                else if (pintype == "out")
                    CKEDITOR.currentInstance.openDialog( 'pinout' );
                else
                    CKEDITOR.currentInstance.openDialog( 'pinedit' );
            }
    });

        // Returns the View class
        return ControlView;

    }

);
