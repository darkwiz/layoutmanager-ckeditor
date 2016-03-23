// ControlView.js
define(["jquery", "underscore","backbone", "handlebars", "templates/templates", "vent"],

    function($, _, Backbone, Handlebars, Templates, vent){

        "use strict";

        var ControlView = Backbone.View.extend({

            tagName:  "div",
            //className: "div-container",

            getTemplate: function(model){
                         var type = model.get('elem');
                         return Templates.getTemplate(type);
                    },
            // View Event Handlers
            events: {
                "click .edit": "onEdit",
                "click .remove": "onRemove"
            },


            // View constructor
            initialize: function(options) {
                _.bindAll(this); // every function that uses 'this' as the current object should be in here

                this._editor = CKEDITOR.instances.mycanvas;
                //this._editor = options._editor;
                this.model.on('update', this.update, this);
                this.model.on('change:elementValues', this.updateControl, this);
                this.model.on('change:labelValue', this.updateLabel, this);
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
                this.listenTo(vent, 'store', function( ) {
                    console.log("saved");
                    this.model.save();
                });

            },

            // Renders the view's template to the UI
            render: function() {
              /*  this.template = this.getTemplate(this.model);

                this.$el.html(this.template(this.model.toJSON()));*/

                this.$label = this.$('.control-label');
                this.$control = this.$('.control-container');
                return this;

            },
            update: function () {
                console.log("fired here here, Label", this.$label[0]);
                if(this.$label[0])
                    this.$label.removeClass(this.$label[0].className).addClass(this.model.get('labelCss'));
                if(this.$control[0])
                    this.$control.removeClass(this.$control[0].className).addClass(this.model.get('containerCss'));
            },
            onClose: function(){
                this.model.unbind("update", this.update);
                this.model.unbind("change:elementValues", this.updateControl);
                this.model.unbind('change:labelValue', this.updateLabel);
            },
            updateControl: function(model) {
                var partial = Handlebars.partials[this.model.get('elem')];
                this.$control.html(partial(model.toJSON()));
            },
            updateLabel: function(control) {
                console.log(this.$label[0])
                if(this.$label[0])
                    this.$label.html(control.get("labelValue"));
            },
            onEdit: function(event) {
                console.log("clicked");
                var currentTarget = $(event.currentTarget);
                var customValues = this._editor.config.customValues;

                //customValues.picked.id = currentTarget.data("id");
                customValues.picked = _.find(customValues.pins, {name: currentTarget.data("id")});
                customValues.picked.control = currentTarget.data("type");
                customValues.pin = customValues.picked;
                this._editor.config.customValues = customValues;

                vent.trigger("attach", {id: currentTarget.data("id")});
                if (currentTarget.data("pin") == "in"){
                    this._editor.openDialog( 'pinin' );
                }
                else if (currentTarget.data("pin") == "out"){
                    this._editor.openDialog( 'pinout' );
                }
                else {
                    this._editor.openDialog('pinedit');
                }

            },
            onRemove: function() {
                this.model.destroy();
        }




    });

        // Returns the View class
        return ControlView;

    }

);
