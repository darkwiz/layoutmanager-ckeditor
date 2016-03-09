// View.js
define(["jquery", "underscore","backbone", "handlebars", "templates/templates",
    "views/ControlView", "views/ScriptView", "collections/Collection", "vent"],

    function($, _, Backbone, Handlebars, templates, ControlView, ScriptView, Collection, vent){
        "use strict";

        var View = Backbone.View.extend({

            // The DOM Element associated with this view
            //el: '.cke_widget_editable_focused',
            //'div.editor',
            //model: new Model, or passed dynamically

            // template: Handlebars.compile(template),
            _viewPointers: null,

            // View Event Handlers
            events:{

            //    "blur .form-group": "onClose", //se usiamo una vista sigleton non possiamo dethachare gli eventi
            //    "focus .form-group": "onOpen"
            },


            // View constructor
            initialize: function(options) {
                //Set el dinamically getting
                _.bindAll(this);// every function that uses 'this' as the current object should be in here

                //this.$el = (this.getEditorInstanceName().$);
                //console.log(CKEDITOR.instances.mycanvas);
                this._editor = CKEDITOR.instances.mycanvas;

                //this._editor = CKEDITOR.instances.mycanvas;
                //this.setElement(this.getEditorInstanceName().$);
                //this._editor.focus();
                //this.setElement(this.getEditorInstanceName().$);
                // This will be called when an item is added. pushed or unshift
                this.collection.on('add', this.addOne, this);
                // This will be called when an item is removed, popped or shifted
                this.collection.on('remove',  this.removeOne, this);
                // This will be called when an item is updated
                // var self = this;
                this.collection.on('change', this.updateOne, this);
                //chiamato una volta on init
                this._viewPointers = {};
                 //TODO: cambia da CKEDITOR.currentINstance a this._editor
                this.$scripts = $(this._editor.getSelection().document.$.body);// essendo la view singleton per ogni area viene invocata l'initialize

                /*this._editor.on("changeElement",
                    function( eventProperties ) {
                        this.collection.add({}, eventProperties.data);
                    }, this);*/

                this.listenTo(vent, "changeElement", this.addModelToCollection);
                this.listenTo(vent, 'detach', this.detach);
                this.listenTo(vent, 'attach', this.attach);
            },
            addModelToCollection: function(evdata) {
                var model = this.collection.get(evdata.PIN.name);
                if (model){
                    this.collection.remove(model)
                }
                this.collection.add({_id: evdata.PIN.name},  evdata );
            },
            addOne: function(control){
                this._editor = CKEDITOR.instances.mycanvas;
               // var selection = this.getEditorInstanceName();
                this.$el = $(this.getEditorInstanceName().$).closest('div');

                // console.log(this.getEditorInstanceName().$);
                var view = new ControlView({model: control});
                this._viewPointers[control.id] = view;
                //Jquery wrapped el
                this.$el.html(view.render().el); // view.render returns this, so this.el refers to the div-container appended

                if(control.has("childModels")){
                   // this.$scripts = $(".cke_contents"); //.cke_contents
                    this.addAllChildModels(control)
                }
                //this.setElement(this.getEditorInstanceName());
            },
            removeOne: function(control) {
                this._viewPointers[control.id].close();

                if(control.has("childModels")){
                    var scripts = control.get("childModels");
                    scripts.each( _.bind( this.removeSubModel, this ));
                }
            },
            updateOne: function(control) {
                //console.log('view updated', this._viewPointers[control.id]);
                var view = this._viewPointers[control.id];
                //control.trigger('update');
                //view.render();
            },
            addAllChildModels: function (control) {
                var child = control.get("childModels");
                child.each( _.bind( this.addOneSub, this ));
            },
            addOneSub: function (script) {
                var scriptview = new ScriptView({ model: script });
                this._viewPointers[script.id] = scriptview;
                this.$scripts.append(scriptview.render().el);
            },
            removeSubModel: function (script) {
                this._viewPointers[script.id].close();
            },
            getEditorInstanceName: function() {
                return this._editor.getSelection().getStartElement();
            },
            onClose: function( ){
                for(var view in this._viewPointers) {
                    this._viewPointers[view].close();
                }
            },
            attach: function (data){
                this._viewPointers[data.id].delegateEvents();
                //trovare un modo per effettuare il bind fra la model e la view riguardo ai vari listen to
            },
            detach: function () {

                for(var view in this._viewPointers) {
                    this._viewPointers[view].stopListening();
                    this._viewPointers[view].onClose();
                }
                //this._viewPointers[data.id].undelegateEvents();

            }

        });

        // Returns the View class
        return View;

    }

);
