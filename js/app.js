define([
  'jquery',
  'underscore',
  'backbone',
  "handlebars",
   "text!templates/dialog.html",
   "router",
   "appconfig"
],function($, _, Backbone, Handlebars, dialog, Router, config){


return {

    init : function() {
       //$.extend(config, conf);
       //INSERT ROUTER??
        $(config.dialogId).html(dialog);
        // $("#myBtn").click(function(){
        //           $("#tallModal").modal()
        // });
        // $(".modal-wide").on("show.bs.modal", function() {
        //   var height = $(window).height() - 200;
        //   $(this).find(".modal-body").css("max-height", height);
        // });
        var router = new Router();

        // $(config.wrapper).find('button').
        //     click(function() {

        //          $(config.dialogId).dialog(config.uiOptions);
        //     });

        //this.buildGrid();
        this.clearEditor(); //don't work well...
        //this.getProcessSettings(this.handleDesignerResponse);

        //var buttons = document.getElementsByClassName('btn btn-primary');
        //for(var i = 0; i < buttons.length; i++) {
        //    (function(buttons, i) {
        //        var path = buttons[i].getAttribute("data-url")
        //        $.ajax({
        //            url: path,
        //            success: appendData
        //        });
        //        function appendData(data) {
        //            console.log(i)
        //            var inp = JSON.stringify(data.settings.inputs, undefined, 12);
        //            buttons[i].appendChild(document.createElement('pre')).innerHTML = inp;
        //        }
        //    })(buttons, i);}






    },

    buildGrid: function() {
       $(config.canvas).gridmanager(config.rte);
    },

    getProcessSettings: function(successCallBack) {
      $.ajax({
        url: config.url,
        type: 'GET',
        contentType: 'application/json',
        dataTBackbonype: 'json'
      })
      .done(function(response) {
       if( response !== null ){
           successCallBack(response);
         } else {
          console.log("Unable to get a response from the server.");
         }
       })
      .fail(function() {
          console.log("Experiencing problems connecting to the server.");
       })
      .always(function() {
          console.log("complete");
       });
      },

    handleDesignerResponse: function(response) {
      config.helper.inputs = response.settings.inputs;
      config.helper.outputs = response.settings.outputs;
      config.helper.props = response.settings.props;

      var i = 1;

      $.each(config.helper.inputs, function(ind, elem) {
        var val = elem.value;
        if( !elem.hidden || elem.hidden === undefined ){
         $.each(config.helper.outputs, function(index, el) {
          if( !el.hidden || el.hidden === undefined ){
            // console.log("Labelinputs:" + elem.label + "; hidden:", !elem.hidden , "; value:",  elem.value == "");
            // console.log("Labeloutputs:" + el.label + "; hidden:",  !el.hidden , "; value:",  el.value == "");

             if( val.value !== "" && el.value !== "" && val === el.value ){
                //creo un nuovo oggetto per i pin in/out
                el.label = "pininout" + i;
                el.pintype = "inout";
                el.name = index; //per non perdere il nome del pin
                config.rte.ckeditor.customValues.pins.push(el);

                //elimino i singoli pin di in e out fusi in uno inout
                delete config.helper.outputs[index];
                delete config.helper.inputs[ind];

                i++;
                return false;
              }
            }
            });
         //Aggiungo il pin in se al termine della scansione non trovo corrispondenza su value, non posso aggiungere elem perchè non sarebbe aggiornato

       if ( config.helper.inputs[ind] !== undefined ){
         config.helper.inputs[ind].pintype = "in";
         config.helper.inputs[ind].name = ind;
         config.rte.ckeditor.customValues.pins.push(config.helper.inputs[ind]);
        }
       }
      });
      //se è rimasto almeno un pin in out li aggiungo eventualmente
      $.each(config.helper.outputs, function(index, el) {
         if ( config.helper.outputs[index] !== undefined ){
          if( !el.hidden || el.hidden === undefined ){
            config.helper.outputs[index].pintype = "out";
            el.name = index;
            config.rte.ckeditor.customValues.pins.push(el);

          }
          }
        });
    },
    //clear divs right after initializing editor
    //add data-* attibute to get the right instance id
      clearEditor: function () {
        //JQuery wrapper version
        CKEDITOR.on( 'instanceReady', function( evt ) {
          var editorname = evt.editor.name;
           evt.editor.element.on('click', function(ev) {
                  var target = ev.data.getTarget();
                  var ascElement = target && target.getAscendant('div', true);
                  ascElement.setAttribute( 'id', editorname );
                  ascElement.data('instance-elem', '#'+ editorname);
                  if ( target.is('p') ){

                      target.remove();

                     }
                   ev.removeListener();

          });
            //detach eventi..con la view singleton probabilmente  perde importanza
          evt.editor.element.on( 'focusout', function( e ){  //TODO:Si può eliminare se non si hanno più problemi di binding alle instanze
                //trigger blur(editor) event
                var leaving = e.data.getTarget(),
                    editbutton = leaving.find('span.edit');
                  //  formgroup = leaving.find('div.div-container'); //TODO:Check focusin on form-group! too many editor instances
                //  if formgroup exist and focusout -> trigger blur on formgroup(bubble)

             /* if (formgroup.$.length > 0)
                    $(formgroup.$).trigger('blur');*/
            /*  if (editbutton.$.length > 0){
                  console.log("focusout");
                  $(editbutton.$).addClass("edit-hidden");
              }*/
            });

          evt.editor.element.on( 'focusin', function( e ){
                //trigger focus(editor) event
                var entering = e.data.getTarget(),
                    editbutton = entering.find('span.edit');
                   // formgroup = entering.find('div.div-container');
                   // if formgroup exist and focusout -> trigger focus on formgroup(bubble)
                   /*  if (formgroup.$.length > 0){
                    $(formgroup.$).trigger('focusin');
                    console.log("focusin");
                  }*/
             /* if (editbutton.$.length > 0){
                  console.log("focusin");
                  $(editbutton.$).removeClass("edit-hidden");

              }*/
            });

          });
    }
};
});



