// View.js
define(["jquery", "underscore","backbone", "handlebars", "templates/templates",
    "views/ControlView", "views/ScriptView", "collections/Collection", "../vent", "templates/templates","logger"],

    function($, _, Backbone, Handlebars, templates, ControlView, ScriptView, Collection, vent, Templates, Logger){
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
                  "click .edit": "reBind"
            },

            getTemplate: function(model){
                var type = model.get('elem');
                return Templates.getTemplate(type);
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
                this.collection.on('add', this.addRow, this);
                // This will be called when an item is removed, popped or shifted
                this.collection.on('remove',  this.removeOne, this);
                // This will be called when an item is updated
                this.collection.on('change', this.updateOne, this);
                //chiamato una volta on init
                this._viewPointers = {};
                 //TODO: cambia da CKEDITOR.currentINstance a this._editor
                if(this._editor)
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
                console.log("Changed PIN:", evdata.PIN.name);
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
                this._viewPointers[control.id] = new ControlView({model: control});
                //Jquery wrapped el
                this.template = this.getTemplate(control);

                this.$el.html(this.template(control.toJSON()));
                //this.$el.html(view.render().el); view.render returns this, so this.el refers to the div-container appended

                this.assign(this._viewPointers[control.id], '.div-container');

                if(control.has("childModels")){
                   // this.$scripts = $(".cke_contents"); //.cke_contents
                    this.addAllChildModels(control)
                }
                //this.setElement(this.getEditorInstanceName());
                return this;
            },
            addRow: function(control){
                this._editor = $('#mycanvas').ckeditorGet();
                //this._editor = CKEDITOR.instances.mycanvas;
               // var index = this.collection.indexOf(control);

                var range = this._editor.createRange();

                if( !this._viewPointers[control.id] ){
                    this._viewPointers[control.id] = new ControlView({model: control});
                    //this.$el.append(this._viewPointers[control.id].render().el);
                    var container_tpl = Handlebars.compile('<div id="{{this}}" ></div>');
                    this.$el.append(container_tpl(control.id));
                }
                //this._viewPointers[control.id].$el.get(0)
                var container = this._editor.document.getById( control.id );

                //var container = this._editor.document.find( '.div-container' ).getItem(index - 1);
                range.selectNodeContents( container );
                this._editor.getSelection().selectRanges( [ range ] );

                var selection = this._editor.getSelection();
                var bookmarks = selection.createBookmarks2(true);
                this._editor.execCommand("12");
                selection.getRanges().moveToBookmarks( bookmarks );
                this.setEditableContent();

                this.template = this.getTemplate(control);

                this.$content.html(this.template(control.toJSON()));
                //Ri-effettuo il binding con la view qui  poiché è stato aggiunto il content
                this.assign(this._viewPointers[control.id], '#' + control.id);

                if(control.has("childModels")){
                    // this.$scripts = $(".cke_contents"); //.cke_contents
                    this.addAllChildModels(control)
                }
                //this.setElement(this.$content.closest('div'));
                return this;
            },
            assign : function (view, selector) {
                view.setElement(this.$(selector)).render();
            },
            setEditableContent: function () {
                if (this._editor.getSelection().getStartElement()){
                    var editable = this._editor.getSelection().getStartElement().find('p').getItem(0);
                    console.log(editable.getName()); //widget editable area name: (<p></p>)
                    this.$content = $(editable.$);
                } else {
                    console.log(this.$content);
                }
            },
            removeOne: function(control) {
                if (this._viewPointers.length > 0) {
                    this._viewPointers[control.id].close();

                    if(control.has("childModels")){
                        var scripts = control.get("childModels");
                        scripts.each( _.bind( this.removeSubModel, this ));
                    }
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
            reBind: function (event){
                var currentTarget = $(event.currentTarget);
                this._viewPointers[currentTarget.data("id")].delegateEvents();
                this._viewPointers[currentTarget.data("id")].onOpen();
                this._viewPointers[currentTarget.data("id")].onEdit(event);
            },
            detach: function () {
                for(var key in this._viewPointers) {
                    if (this._viewPointers.hasOwnProperty(key)) {
                        Logger.debug("Detached:", key + " -> " + this._viewPointers[key]);
                        this._viewPointers[key].onClose();
                        this._viewPointers[key].undelegateEvents();
                    }

                }
            }

        });

        // Returns the View class
        return View;

    }

);
