// FormView.js
//Cannot add Router to modules invoke..circular deps
define(["jquery", "underscore","backbone", "handlebars", "text!templates/dialog.html", "appconfig","views/View",
        "views/DialogView", "collections/Collection", "views/ControlView"],

    function($, _, Backbone, Handlebars, template, config, View, DialogView, Collection, ControlView){

        "use strict";

        var FormView = Backbone.View.extend({

            //el: "#tallModal",
            el: ".editor-container",
            //tagName:  "div",
            //className: "form-container",

            template: Handlebars.compile(template),


            events: {
                "click .load": "_setEditorCollection"
            },

            // View constructor
            initialize: function(options) {
                _.bindAll(this);
                this.model.on('change', this.render, this);
                this.listenTo(Collection, 'reset', this.load); //_.debounce(this.load, 0));

                this.dform = this.model.fetch();


            },
            load: function() {
                this.appview = new View({collection: Collection});
                this.appview.setElement(this._frame.find('#content'));
            },
            _createAppView: function() {
                //this._editor = this.ckeditor;
                this._frame = $(this._editor.window.getFrame().$).contents();
                Collection.fetch({reset: true});
            },
            _setEditorCollection: function(e) {
                e.preventDefault();
                //var editor = $('#mycanvas').ckeditorGet();
                //this._editor = CKEDITOR.instances.mycanvas;

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
                this._editor = $("#mycanvas").ckeditor($deferred.resolve, config.rte.ckeditor).editor;
                //CKEDITOR.on( 'instanceReady', $deferred.resolve );
                //$("#mycanvas").attr( 'contenteditable', 'true' );

                //CKEDITOR.replace( 'mycanvas', config.rte.ckeditor );

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
