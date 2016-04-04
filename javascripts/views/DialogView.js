// DialogView.js
define(["jquery", "underscore","backbone", "handlebars", "text!templates/dialog.html"],

    function($, _, Backbone, Handlebars, template){

        "use strict";

        Backbone.View.prototype.close = function(){ //remove zombie views
            console.log("removed dialog");
            this.remove();
            this.unbind();
            if (this.onClose){
                this.onClose();
            }
        };

        var DialogView = Backbone.View.extend({

            //tagName:"div",
            //className:"form-container",

            template: Handlebars.compile(template),


            // View constructor
            initialize: function(options) {
                _.bindAll(this); // every function that uses 'this' as the current object should be in here

                //this.model.on('change', this.render, this);

            },
            // Renders the view's template to the UI
            render: function() {

               // this.$el.html(this.template(this.model.toJSON()));
                //$("#"+ this.model.get("uniqueId")).attr( 'contenteditable', 'true' );
                //$("#mycanvas").attr( 'contenteditable', 'true' );
                $('#tallModal').modal({ backdrop: 'static', keyboard: false}); // dont show modal on instantiation

                $(".modal-wide").on("show.bs.modal", function() {
                    var height = $(window).height() - 200;
                    $(this).find(".modal-body").css("max-height", height);
                });

                return this;

            },
            onClose: function(){
                this.model.unbind("change", this.render);
            }


        });

        // Returns the View class
        return DialogView;

    }

);
