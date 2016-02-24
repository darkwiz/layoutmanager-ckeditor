CKEDITOR.plugins.add( 'rceditor',
    {
        lang: 'en,it',

        init : function( editor )
        {
            var config = editor.config,
                lang = editor.lang.format;

            var addCommand = function( commandName, dialogFile ) {
                var def = {};
                //dialog addCommand( "name of dialog to open", [additional command definition properties] )
                editor.addCommand( commandName, new CKEDITOR.dialogCommand( commandName, def ) );
                CKEDITOR.dialog.add( commandName, dialogFile );
            };

            var dialogPath = this.path + 'dialogs/';
            addCommand( 'pinin', dialogPath + 'pinin.js' );
            addCommand( 'pinout', dialogPath + 'pinout.js' );
            addCommand( 'pinedit', dialogPath + 'pinedit.js' );


            editor.ui.addRichCombo( 'rceditorCmb',
                {
                    label : "Insert PIN",
                    title :"Insert PIN",
                    voiceLabel : "Insert PIN",
                    multiSelect : false,
                    //className : 'cke_combopanel',

                    panel: {
                        css: [ CKEDITOR.skin.getPath( 'editor' ) ].concat( config.contentsCss )
                        //attributes: { 'aria-label': lang.panelTitle }
                    },


                    init : function()
                    {
                        this.startGroup( "PIN" );
                        var self = this,
                            pins =  editor.config.customValues.pins;
                        //console.log(pins);
                        for (var i in pins) {
                            //From richcombo source: add(value, html, text) -but!- if(text) item = text
                            self.add( pins[i].name , pins[i].label + " ["+ pins[i].type +"] [" + pins[i].pintype + "]" , pins[i]);
                        }
                    },

                    onClick : function( value )
                    {
                        //Risolto il problema value=""?
                        $.each( this._.items , function(index, el){
                            if ( value == el.name ){
                                if ( el.pintype == "in") {
                                    config.customValues.pin = el;
                                    editor.execCommand('pinin');
                                    return true;
                                }
                                else if( el.pintype == "out" ){
                                    config.customValues.pin = el;
                                    editor.execCommand('pinout');
                                    return true;
                                }
                                else {
                                    config.customValues.pin = el;
                                    editor.execCommand('pinedit');
                                }
                            }
                        });

                        return false;

                    }

                });
        }
    });

// Constructor (methods can be overrided in dialogs/ via prototype)
//We could write one of this for every pintype, but we want DRY!
var HTMLControl = function( def, pin, elem ){
    this.def = def; //definizioni dei vari tipi
    this.pin = pin; //dati sul pin scelto
    this.elem = elem; //container dell'elemento di input in costruzione

    this.content = "<label><input type=\""+ this.def.type +"\" name=\""+ this.pin.name +"\" value=\"\" class=\""+ this.def.class.elem+"\" id=\""+this.elem.id+"\"  >"+this.elem.desc+"</label>";
}

HTMLControl.prototype.setDomElem = function () {
    //può fare cose diverse a seconda del tipo di controllo, ridefinibile
    this.elem.addClass( this.def.class.container );
};

HTMLControl.prototype.getDomElem = function () {
    return CKEDITOR.dom.element.createFromHtml( this.content );
};

// Util method, useful to add properties to a node after contruction
HTMLControl.prototype.getInnerElem = function() {
    var innernode;
    this.elem.forEach( function( node ) {
        if(node.getChildCount() == 0)
            innernode = node;
    } );
    return innernode;
}

function DateTimeControl ( def, pin, elem ) {
    HTMLControl.call(this, def, pin, elem);
}

// Create a DateTimeControl.prototype object that inherits from HTMLControl.prototype.

DateTimeControl.prototype = Object.create(HTMLControl.prototype);

// Set the "constructor" property to refer to DateTimeControl
DateTimeControl.prototype.constructor = DateTimeControl;

DateTimeControl.prototype.getJS = function () {
    var script = "<script type=\"text/javascript\">"+ this.def.js +"</script>";
    return CKEDITOR.dom.element.createFromHtml( script );
};

function TextAreaControl ( def, pin, elem ) {
    HTMLControl.call(this, def, pin, elem);

    this.content = "<textarea rows=\""+ this.def.rows +"\" name=\""+ this.pin.name +"\" value=\"\" class=\""+ this.def.class.elem+"\" id=\""+this.elem.id+"\">";
}
//inheritance
TextAreaControl.prototype = Object.create(HTMLControl.prototype);

//to call the generic implementation ("super")
// TextAreaControl.prototype.getDomElem = function () {

//   this.content = "rewrite content";
//   return HTMLControl.prototype.getDomElem.call(this);
//   };

// Set the "constructor" property to refer to TextAreaControl
TextAreaControl.prototype.constructor = TextAreaControl;


function SpanControl ( def, pin, elem ) {
    HTMLControl.call(this, def, pin, elem);

    this.content = "<span id=\""+this.elem.id+"\"><strong>${"+this.pin.name+".value}</strong></span>";
}

SpanControl.prototype = Object.create(HTMLControl.prototype);


// requirejs(["shirt"], function(shirt){
//   console.log(shirt.size);
// });


