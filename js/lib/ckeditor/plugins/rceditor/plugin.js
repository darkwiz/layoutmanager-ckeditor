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

                       /*  Styling combo
                        setTimeout(function(){
                            resizeComboPanel(editor.name);
                        }, 10);

                        $('.cke_combo_button').click(function(){
                            setTimeout(function(){
                                resizeComboPanel(editor.name);
                            }, 10);
                        });

                        var resizeComboPanel = function(target){
                            console.log(target)
                            var li_height = $("#" + target).closest("li").height();
                            var drop_down_height = li_height - 50;
                            if(drop_down_height > 170){
                                drop_down_height = 170;
                            }
                            $("#cke_" + target + " > .cke_combopanel").css('height', drop_down_height + 'px');
                        }*/
                    },

                    onClick : function( value )
                    {
                        //Risolto il problema value=""?
                        $.each( this._.items , function(index, el){
                            if ( value == el.name ){
                                if ( el.pintype == "in") {
                                    config.customValues.pin = el;
                                    config.customValues.picked = null; //per la funzione di edit
                                    editor.execCommand('pinin');
                                    return true;
                                }
                                else if( el.pintype == "out" ){
                                    config.customValues.pin = el;
                                    config.customValues.picked = null;
                                    editor.execCommand('pinout');
                                    return true;
                                }
                                else {
                                    config.customValues.pin = el;
                                    config.customValues.picked = null;
                                    editor.execCommand('pinedit');
                                }
                            }
                        });

                        return false;

                    }

                });
        }
    });
