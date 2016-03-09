// ControlView.js
define(["jquery", "underscore","backbone", "handlebars", "templates/templates", "vent"],

    function($, _, Backbone, Handlebars, Templates, vent){

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
            initialize: function(options) {
                _.bindAll(this); // every function that uses 'this' as the current object should be in here

                this._editor = CKEDITOR.instances.mycanvas;
                //this._editor = options._editor;
                this.model.on('update', this.update, this);
                this.model.on('change:elementValues', this.updateControl, this);
                //questo viene fatto in automatico
                //this.$el = $(this.el);

                this.listenTo(vent, 'setContainerClass', function( event ) {
                    this.model.setContainerClass(event.selected);
                });
                this.listenTo(vent, 'setControlLabel', function(event) {
                    this.model.setControlLabel(event.label);
                });
                this.listenTo(vent,'loadFascicoli', function( event ) {
                    console.log("fired", event.urlTitolario);
                    console.log(this.model.toJSON());
                    event.promise = this.model.loadFascicoli(event.urlTitolario);
                });
                this.listenTo(vent, 'addOption', function( event ) {
                    console.log(this.model.toJSON());
                    this.model.addOption(event.option);
                });
                this.listenTo(vent, 'removeOption', function( event ) {
                    this.model.removeOption(event.option);
                });

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
                console.log("fired here here")
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
                var currentTarget = $(event.currentTarget);
                var customValues = this._editor.config.customValues;

                //customValues.picked.type = currentTarget.data("type");
                //customValues.picked.id = currentTarget.data("id");
                customValues.picked = _.find(customValues.pins, {name: currentTarget.data("id")});

                vent.trigger("attach", {id: currentTarget.data("id")});
                if (currentTarget.data("pin") == "in")
                    this._editor.openDialog( 'pinin' );
                else if (currentTarget.data("pin") == "out")
                    this._editor.openDialog( 'pinout' );
                else
                    this._editor.openDialog( 'pinedit' );
            }


    });

        // Returns the View class
        return ControlView;

    }

);
