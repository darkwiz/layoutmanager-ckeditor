CKEDITOR.dialog.add( 'pinin', function( editor ) {

    return { //dialog definition
        title: editor.lang.rceditor.pinin.title,
        minWidth: 400,
        minHeight: 200,
        onLoad: function() {
            var self = this;
            require(["utils"], function(utils){
                var select = self.getContentElement('tab-basic', 'colselect'),
                    opts = utils.getColOpts();
                for ( var i = 0 ; i < opts.length ; i++){
                    var oOption = utils.addOption( select, opts[i][0], opts[i][1], editor.document);
                    // select.add(opts[i][0], opts[i][1]);
                    if ( i == 3 )
                    {
                        oOption.setAttribute('selected', 'selected');
                        oOption.selected = true;
                    }
                }
                self.getContentElement("tab-basic", "colselect").disable();
                utils.hideTabs.call(self);
               // _.extend(editor, Backbone.Events);
            });

        },
        onShow: function() {
            var self = this;
            require(['utils'], function(utils){
                var values = self.getContentElement('tab-basic', 'typeselect'),
                    selectedPin = editor.config.customValues.pin;

                switch(selectedPin.type)
                {
                    case 'text':
                    case 'textRef':
                        optionNames = new Array("<Scegli un controllo>","Generico","Boolean","Tipo Protocollazione","ACL","Codice Fiscale", "Email", "TextArea");
                        optionVal = new Array("none","text","boolean","tp","acl","cf","email","textarea");

                        break;
                    case 'datetimeRef':
                        optionNames = new Array("<Scegli un controllo>","Generico","Calendar(ReadOnly)", "Calendar Time(ReadOnly)");
                        optionVal = new Array("none","date","calendar","calendartime");

                        break;
                    case 'year':
                        optionNames = new Array("<Scegli un controllo>","Select");
                        optionVal = new Array("none","year");

                        break;
                    case 'document':
                        optionNames = new Array("<Scegli un controllo>","Generico");
                        optionVal = new Array("none","document");

                        break;
                    case 'soggetto':
                        optionNames = new Array("<Scegli un controllo>", "Soggetto", "Soggetto/PersonaFisica", "Soggetto/PersonaGiuridica", "Soggetto/Amministrazione");
                        optionVal = new Array("none", "soggetto", "soggettopf", "soggettopg", "soggettoam");

                        break;
                    case 'object':
                        optionNames = new Array("<Scegli un controllo>","Object/ACL");
                        optionVal = new Array("none","objectacl");

                        break;
                    case 'actor':
                        optionNames = new Array("<Scegli un controllo>","Generico");
                        optionVal = new Array("none", "text");

                        break;
                    case 'classifica':
                        optionNames = new Array("<Scegli un controllo>","Generico");
                        optionVal = new Array("none", "classifica");


                        break;
                    case 'fascicolo':
                        optionNames = new Array("<Scegli un controllo>","Generico");
                        optionVal = new Array("none", "fascicolo");

                        break;
                    case 'cartella':
                        optionNames = new Array("<Scegli un controllo>","Generico");
                        optionVal = new Array("none", "cartella");
                        break;
                    default:
                        optionNames = new Array("<none>"),
                            optionVal = new Array("");
                    //qui vanno tutti gli altri che non hanno sotto opzioni( classifica, cartella etc.)
                }

                self.setupContent();//calls all setup functions
                utils.removeAllOptions( values );

               
               /* editor._collection = CollectionManager.getCollection('collection');
                ViewManager.getView('simpleview', {collection: editor._collection});*/

                for ( var i = 0 ; i < optionNames.length ; i++){

                    var oOption = utils.addOption( values, optionNames[ i ], optionVal[ i ], self.getParentEditor().document);

                    var picked = editor.config.customValues.picked;
                    if ( picked &&  optionVal[ i ] == picked.control )
                    {
                        oOption.setAttribute('selected', 'selected');
                        oOption.selected = true;
                    }
                }
            });
        },
        onOk: function() {
            var editor = this.getParentEditor(),
                element = this.element,
                isInsertMode = !element,
                selectedPin = editor.config.customValues.pin;


            // if ( isInsertMode ) {
            //    element = editor.document.createElement( 'span' );


            // }
           // element: element ,
            var data = { element: element };

            // if ( isInsertMode ){
            //     editor.insertElement(data.element);
            //     }

            require(["vent"], function(vent) {
                vent.trigger("detach"); //on dialog open detach previous views
            });


            this.commitContent( data );
            


            // Element might be replaced by commitment.
            // if ( !isInsertMode )
            //     editor.getSelection().selectElement( data.element );

        },

        contents: [{
                id: 'tab-basic',
                label: 'Basic Settings',
                elements: [
                    {
                        type: 'hbox',
                        widths: [ '50%', '50%' ],//field = dialog.getContentElement("tab-basic", "addlabel"),
                        children: [
                            {
                                id: 'label',
                                type: 'text',
                                label: 'Label',
                                'default': editor.config.customValues.pin.label,
                                setup: function( ) {
                                    var self = this;
                                    require(["jquery","vent"], function($,vent) {
                                        var domelem = document.getElementById(self.getDialog().getContentElement( 'tab-basic', 'label').domId);
                                        $label = $(domelem);
                                        $label.on('keyup',function(e){
                                            var labelval = $label.find('input').val();
                                            if(labelval) {
                                                vent.trigger("setControlLabel", {label: labelval});
                                            } else {
                                                vent.trigger("setControlLabel", {label: " "});
                                            }
                                        });

                                    });
                                },
                                commit: function(data) {
                                    //Problema con i tipi complessi:
                                    //edita tutte le label!!
                                    /* var label = this.getValue();

                                     require(["jquery","vent"], function($,vent) {
                                     vent.trigger("setControlLabel", {label: label});
                                     });*/

                                }
                            },
                            //put here other children
                        ]
                    },
                    {
                        type: 'hbox',
                        widths: [ '50%', '50%' ],
                        children: [
                        {
                            id: 'typeselect',
                            type: 'select',
                            label: "Tipo Controllo",
                            'default': 'none',
                            items: [ [ "<none>",    '' ] ],
                            onChange: function() {
                                var self = this;
                                require(["utils", "vent"], function(utils, vent) {
                                    var selected = self.getValue(),
                                        dialog = self.getDialog(),
                                        editor = dialog.getParentEditor(),
                                        wselect = dialog.getContentElement("tab-basic", "colselect"),
                                        config = editor.config.customValues,
                                        selectedPin = config.picked ? config.picked : config.pin;
                                    

                                    vent.trigger('changeElement',{
                                            type: selected,
                                            PIN: selectedPin
                                        });

                                    /* Old with ckeditor events
                                    editor.fire('changeElement',{
                                        type: selected,
                                        PIN: selectedPin
                                    });*/

                                    utils.toggleField(wselect, selected);

                                    //toggleTabs.call(dialog, 'tab-'+ selected);

                                });
                            },
                            commit: function( data ) {
                                    var head = CKEDITOR.document.getHead(),
                                        dialog = this.getDialog(),
                                        editor = dialog.getParentEditor();


                            }
                        },
                            {
                                id: 'colselect',
                                type: 'select',
                                label: "Larghezza Controllo",
                                'default': 'none',
                                items:  [['--- Select Field Width ---',0]],
                                onChange: function() {
                                    var selected = this.getValue();

                                    require(["vent"], function(vent) {
                                        vent.trigger('setContainerClass', {selected: selected});
                                    });

                                }
                            }
                    ]}
                 ]
                } //other tabs here
            ],
            buttons: [
            CKEDITOR.dialog.okButton,
            CKEDITOR.dialog.cancelButton,
                {
                 type: 'button',
                 id: 'resetButton',
                 label: 'Reset',
                 title: 'My title',
                  onClick: function() {
                    // this = CKEDITOR.ui.dialog.button
                    var dialog = this.getDialog(),
                        editor = dialog.getParentEditor();
                        //TODO: La remove va fatta cliccando sulla x dell'elemento che ha un riferimento
                        editor.fire('removeElement', {selected: selected});
                        //var control = editor._collection.remove(editor._model);
                        // alert( 'Clicked: ' + this.id );
                         }
                    } ]
        }

    });

