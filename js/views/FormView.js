// FormView.js
//Cannot add Router to modules invoke..circular deps
define(["jquery", "underscore","backbone", "handlebars", "text!templates/dialog.html", "appconfig","views/View",
    "views/DialogView","collectionmanager"],

    function($, _, Backbone, Handlebars, template, config, View, DialogView, CollectionManager){

        "use strict";
        Backbone.View.prototype.close = function(){ //remove zombie views
            console.log("removed view");
            this.remove();
            this.unbind();
            if (this.onClose){
                this.onClose();
            }
        };

        var FormView = Backbone.View.extend({

            //el: "#tallModal",
            el: "#container",
            //tagName:  "div",
            //className: "form-container",

            template: Handlebars.compile(template),

            /*  events: {
             "click .close": "dispose"
             },*/

            // View constructor
            initialize: function(options) {
                _.bindAll(this); // every function that uses 'this' as the current object should be in here
                this.model.on('change', this.render, this);

                //this.model.fetch();
                //this.ckeditor = {};



                this.deferred = this.model.fetch();

                 /*filtered.done(
                    function() {
                        self.render();
                        self.show()
                   });*/

            },

            // Renders the view's template to the UI
            render: function() {

                var filtered = this.deferred.then(
                    this._prepareDialog.bind(this)
                    );
                filtered.done(
                    function(){
                        this._prepareCkeditor.call(this)
                            .done( //then ok
                                console.log("dfd resolved"),
                                this._setEditorCollection
                            )
                    }.bind(this)

                );

                /*  this.$el.find('#mycanvas').html(this.template(this.model.toJSON()));
                 console.log(this.$el.find('#mycanvas'));*/
                //$(config.canvas).attr( 'contenteditable', 'true' );
                //CKEDITOR.replace( 'mycanvas' );
                /* var editor = CKEDITOR.instances.mycanvas;
                 if (editor) {
                 console.log('instance exists');
                 editor.destroy(true);
                 console.log('destroyed');
                 }
                 CKEDITOR.replace( 'mycanvas', config.rte.ckeditor );*/
                //$(config.canvas).ckeditor(config.rte.ckeditor);
                /* this.$el.modal({backdrop: 'static', keyboard: false});
                 $(".modal-wide").on("show.bs.modal", function() {
                 var height = $(window).height() - 200;
                 $(this).find(".modal-body").css("max-height", height);
                 });*/



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

                //this.appview.close();

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
                // this.$el.html(this.template(this.model.toJSON())); //find('#mycanvas')
                //$(this.view.render().el).appendTo('#container');
                this.$el.append(this.view.render().el);
                this.show();
             //   this.model.on('change', _setEditorValue.bind(this));
            },

            _setEditorCollection: function() {

                // = new View({collection: collection}); //, _editor: this.model.get("uniqueId")
                var collection = CollectionManager.getCollection('collection');
                //var collection = CollectionManager.getCollection('collection');
                this.appview = new View({collection: collection});
                //this.appview = ViewManager.getView('simpleview', {collection: collection});
            }
        });

        // Returns the View class
        return FormView;

    }

);
