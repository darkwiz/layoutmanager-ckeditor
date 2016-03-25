// FormView.js
//Cannot add Router to modules invoke..circular deps
define(["jquery", "underscore","backbone", "handlebars", "text!templates/dialog.html", "appconfig","views/View",
    "views/DialogView", "collections/Collection"],

    function($, _, Backbone, Handlebars, template, config, View, DialogView, Collection){

        "use strict";

        var FormView = Backbone.View.extend({

            //el: "#tallModal",
            el: "#container",
            //tagName:  "div",
            //className: "form-container",

            template: Handlebars.compile(template),


             events: {
              "click .load": "load"
             },

            // View constructor
            initialize: function(options) {
                _.bindAll(this);
                this.model.on('change', this.render, this);
                this.listenTo(Collection, 'reset', _.debounce(this._setEditorCollection, 0));


                this.dform = this.model.fetch();



            },
            load: function(e) {
                e.preventDefault();
                Collection.fetch({reset: true});
            },
            _createAppView: function() {
                this.appview = new View({collection: Collection});
                this.assign(this.appview, '.app-container');
            },
            _setEditorCollection: function() {

                this._editor = CKEDITOR.instances.mycanvas;
                var range = this._editor.createRange();
                range.selectNodeContents( this._editor.document.getById( 'content' ) );

                this._editor.getSelection().selectRanges( [ range ] );
                    Collection.each(function(value) {
                        this.appview.addRow.call(this.appview, value);
                    }.bind(this));



            },

            render: function() {
                var filtered = this.dform.then(
                    this._prepareDialog.bind(this)
                );
                filtered.done(
                    function(){
                        this._prepareCkeditor.call(this)
                            .done( //then ok
                                this._createAppView.bind(this)
                            )
                    }.bind(this)

                );

                return this;

            },

            show: function() {
                $('#tallModal').modal('show');
            },

            dispose: function(options){
                $('#tallModal').on('hidden.bs.modal', function () {
                    var self = this;
                    CKEDITOR.on( 'instanceDestroyed', function () {
                        self.view.close();
                        self.appview.close();
                    } );
                    var editor = CKEDITOR.instances.mycanvas;
                    if (editor) {
                        console.log('instance exists');
                        editor.destroy(true);
                        console.log('destroyed');

                        //this.appview._editor = null;
                        //this.appview.remove();
                    }

                }.bind(this)).modal(options);



            },
            _prepareCkeditor: function () {
                var $deferred = new $.Deferred();

                require(["ckeditor.jquery"], this._startEditor.bind(this, $deferred));

                return $deferred.promise();
            },
            _startEditor: function ($deferred) {
               /* var self = this;
                var id = this.model.get("uniqueId");
                this.ckeditor = $("#"+ this.model.get("uniqueId")).ckeditor($deferred.resolve, config.rte.ckeditor).editor;*/
                CKEDITOR.on( 'instanceReady', $deferred.resolve );
                $("#mycanvas").attr( 'contenteditable', 'true' );

                CKEDITOR.replace( 'mycanvas', config.rte.ckeditor );

            },
            _prepareDialog: function() {
                this.view = new DialogView({model: this.model});
                this.$el.html(this.template(this.model.toJSON()));
                //this.$el.html(view.render().el); view.render returns this, so this.el refers to the div-container appended

                this.assign(this.view, '.form-container');
                // this.$el.html(this.template(this.model.toJSON())); //find('#mycanvas')
                //$(this.view.render().el).appendTo('#container');
                //this.$el.append(this.view.render().el);
                this.show();
             //   this.model.on('change', _setEditorValue.bind(this));
                return this;
            },
            assign : function (view, selector) {
                view.setElement(this.$(selector)).render();
            },
/*
            _setEditorCollection: function() {
                // = new View({collection: collection}); //, _editor: this.model.get("uniqueId")
               // var collection = CollectionManager.getCollection('collection');

                this.dfd.done(
                    function(){
                        this._createAppView.

                    }.bind(this)
                )

                //this.appview = ViewManager.getView('simpleview', {collection: collection});
            },*/
        });

        // Returns the View class
        return FormView;

    }

);
