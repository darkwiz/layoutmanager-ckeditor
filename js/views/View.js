// View.js
define(["jquery", "underscore","backbone", "handlebars", "templates/templates", "views/ControlView", "views/ScriptView", "collections/Collection"],

    function($, _, Backbone, Handlebars, templates, ControlView, ScriptView){
        "use strict";
        Backbone.View.prototype.close = function(){ //remove zombie views
            console.log("removed view");
            this.remove();
            this.unbind();
            if (this.onClose){
                this.onClose();
            }
        };

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

               // this._editor = CKEDITOR.instances.mycanvas;
                this._editor = options._editor;
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
                //funziona!
                /*this._editor.on("changeElement",
                    function( eventProperties ) {
                        this.collection.add({}, eventProperties.data);
                    }, this);*/

                this.listenTo(this._editor, "changeElement", function(data) {
                    this.collection.add({}, data);
                });
            },
            addOne: function(control){
                var editor = this._editor;
               // var selection = this.getEditorInstanceName();
                this.$el = $(this.getEditorInstanceName().$).closest('div');
                // console.log(this.getEditorInstanceName().$);
                var view = new ControlView({model: control});
                this._viewPointers[control.cid] = view;
                //Jquery wrapped el
                this.$el.html(view.render().el); // view.render returns this, so this.el refers to the div-container appended

                if(control.has("childModels")){
                   // this.$scripts = $(".cke_contents"); //.cke_contents
                    this.addAllChildModels(control)
                }
                //this.setElement(this.getEditorInstanceName());
            },
            removeOne: function(control) {
                this._viewPointers[control.cid].close();

                if(control.has("childModels")){
                    var scripts = control.get("childModels");
                    scripts.each( _.bind( this.removeSubModel, this ));
                }
            },
            updateOne: function(control) {
                console.log('view updated', this._viewPointers[control.cid]);
                var view = this._viewPointers[control.cid];
                //control.trigger('update');
                //view.render();
            },
            addAllChildModels: function (control) {
                var child = control.get("childModels");
                child.each( _.bind( this.addOneSub, this ));
            },
            addOneSub: function (script) {
                var scriptview = new ScriptView({ model: script });
                this._viewPointers[script.cid] = scriptview;
                this.$scripts.append(scriptview.render().el);
            },
            removeSubModel: function (script) {
                this._viewPointers[script.cid].close();
            },
            getEditorInstanceName: function() {
                var element = this._editor.getSelection().getStartElement();
                return this._editor.getSelection().getStartElement();
               /* this._editor.focus();
                var element = this._editor.document.getBody().getLast(),
                    element2 = this._editor.getSelection().getStartElement(),
                    selection = this._editor.getSelection();

                selection.selectElement(element);
                //selection.scrollIntoView();

                return selection;*/
                //return CKEDITOR.currentInstance.getSelection().getStartElement();
            }
            /*  onClose: function( event ){
                console.log("close")
                this.collection.off("add", this.addOne);
                this.collection.off('remove',  this.removeOne);
                this.collection.off('change', this.updateOne);
            },


            onOpen: function( event ){
                this.collection.on("add", this.addOne, this);
                this.collection.on('remove',  this.removeOne, this);
                this.collection.on('change', this.updateOne, this);
            },
            remove: function(){
               return Backbone.View.prototype.remove.apply(this, arguments);
            }*/
        });

        // Returns the View class
        return View;

    }

);
