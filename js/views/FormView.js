// PinoutView.js
//Cannot add Router to modules invoke..circular deps
define(["jquery", "underscore","backbone", "handlebars", "text!templates/form.html", "appconfig"],

    function($, _, Backbone, Handlebars, template, config){

        "use strict";

        var FormView = Backbone.View.extend({

            el: "#tallModal",

            template: Handlebars.compile(template),

              events: {
                "click .close": "dispose"
              },

            // View constructor
            initialize: function() {
                _.bindAll(this); // every function that uses 'this' as the current object should be in here
                this.model.on('change', this.render, this);

                this.model.fetch();

            },

            // Renders the view's template to the UI
            render: function() {

                this.$el.find('#mycanvas').html(this.template(this.model.toJSON()));
                //$(config.canvas).attr( 'contenteditable', 'true' );
                //CKEDITOR.replace( 'mycanvas' );
                var editor = CKEDITOR.instances.mycanvas;
                    if (editor) {
                        console.log('instance exists');
                        editor.destroy(true);
                        console.log('destroyed');
                    }
                CKEDITOR.replace( 'mycanvas', config.rte.ckeditor );
                //$(config.canvas).ckeditor(config.rte.ckeditor);
                this.$el.modal({backdrop: 'static', keyboard: false});
                $(".modal-wide").on("show.bs.modal", function() {
                    var height = $(window).height() - 200;
                    $(this).find(".modal-body").css("max-height", height);
                  });

                return this;

            },
            dispose: function(event){
              this.$el.modal('hide');
            }

    });

        // Returns the View class
        return FormView;

    }

);
