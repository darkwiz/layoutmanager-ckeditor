// FormView.js
//Cannot add Router to modules invoke..circular deps
define(["jquery", "underscore","backbone", "handlebars", "text!templates/dialog.html", "appconfig", "views/View", "views/DialogView","collectionmanager"],

    function($, _, Backbone, Handlebars, template, config, View, DialogView,  CollectionManager){

        "use strict";

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
                    /*function() {
                        var view = new DialogView({model: this.model});
                        // this.$el.html(this.template(this.model.toJSON())); //find('#mycanvas')
                        $(view.render().el).appendTo('#container');
                        this.show();
                    }.bind(this)*/

                    );
                filtered.done(
                    function(){
                        this._prepareCkeditor.call(this)
                            .done( //then ok
                                /*   this._setEditorValue.bind(this),
                                 this._setEditorEventHandling.bind(this),
                                 */
                                // this._setModelEventHandling.bind(this),
                                //this._prepareDialog.bind(this),
                                this._setEditorCollection.bind(this)
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
                    this.appview.unbind();
                    for(var name in CKEDITOR.instances) {
                        CKEDITOR.instances[name].on( 'destroy', function( e ) {
                            console.log( 'The editor named ' + e.editor.name + ' destroyed' );
                            self.view.close();
                            //self.appview.unbind();
                        } );
                        CKEDITOR.instances[name].destroy(false);
                        //console.log('destroyed :' + name);
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
                var self = this;
                var id = this.model.get("uniqueId");
                this.ckeditor = $("#"+ this.model.get("uniqueId")).ckeditor(config.rte.ckeditor, $deferred.resolve).editor;
            },
            _prepareDialog: function() {
                this.view = new DialogView({model: this.model});
                // this.$el.html(this.template(this.model.toJSON())); //find('#mycanvas')
                //$(this.view.render().el).appendTo('#container');
                this.$el.append(this.view.render().el);
                this.show();
             //   this.model.on('change', _setEditorValue.bind(this));
            },
            /*  _setModelEventHandling: function() {
                 this.model.on('change:value', _setEditorValue.bind(this));
            },
              _setEditorValue: function() {
                 if(!_.isUndefined(this.model.get('value'))) {
                 this.ckeditor.setData(this.model.get('value'));
                }
             },
             _setEditorEventHandling: function() {
             this.ckeditor.on('change', this._setContentValue.bind(this));
             },


             _setContentValue: function() {
             this.model.set('value', this.ckeditor.getData());
             },*/
            _setEditorCollection: function() {
                var collection = CollectionManager.getCollection('collection');
                this.appview = new View({collection: collection, _editor: this.ckeditor});
            }
        });

        // Returns the View class
        return FormView;

    }

);
