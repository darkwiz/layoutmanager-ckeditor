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
            });

        },
        onShow: function() {
            var self = this;
            require(['collectionmanager', 'views/View', 'utils', 'viewmanager'], function(CollectionManager, View, utils, ViewManager){
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
                    default:
                        optionNames = new Array("<none>"),
                            optionVal = new Array("");
                    //qui vanno tutti gli altri che non hanno sotto opzioni( classifica, cartella etc.)
                }


                editor._collection = CollectionManager.getCollection('collection');
                ViewManager.getView('simpleview', {collection: editor._collection});
                utils.removeAllOptions( values );

                if (editor._model){
                    var model = editor._collection.get(editor._model);
                }
                for ( var i = 0 ; i < optionNames.length ; i++){

                    var oOption = utils.addOption( values, optionNames[ i ], optionVal[ i ], self.getParentEditor().document);
                    //console.log("Opt val:", optionVal[ i ]);
                    //console.log("Model type:", model &&  model.get('type'));
                    if ( model && optionVal[ i ] == model.get('type') ) //TODO: check this assertion
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
                isInsertMode = !element;


            // if ( isInsertMode ) {
            //    element = editor.document.createElement( 'span' );


            // }
           // element: element ,
            var data = { element: element };

            // if ( isInsertMode ){
            //     editor.insertElement(data.element);
            //     }

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
                                commit: function(data) {
                                    var label = data.label,
                                        dialog = this.getDialog(),
                                        editor = dialog.getParentEditor(),
                                        id = dialog.getContentElement("tab-adv", "id");

                                    //data.type = this.getValue();
                                    editor._model.setControlLabel(this.getValue());

                                    // label.setText( this.getValue() + ": " );

                                    // label.setAttribute('for',  id.getValue() );
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
                                require(["utils"], function(utils) {
                                    var selected = self.getValue(),
                                        dialog = self.getDialog(),
                                        editor = dialog.getParentEditor(),
                                        wselect = dialog.getContentElement("tab-basic", "colselect"),
                                        selectedPin = editor.config.customValues.pin;
                                    editor._model = editor._collection.add({}, {
                                        type: selected,
                                        PIN: selectedPin
                                    });
                                    utils.toggleField(wselect, selected);

                                    //toggleTabs.call(dialog, 'tab-'+ selected);

                                });
                            },
                            setup: function( element ) {
                                this.setValue( element.getAttribute( 'value' ) );
                            },
                            commit: function( data ) {
                                    var head = CKEDITOR.document.getHead(),
                                        dialog = this.getDialog(),
                                        editor = dialog.getParentEditor();

                                     /* Riga da rivedere passiamo ancora l'editor e la model al commit finale... */
                                     // var control = getView({model: editor._model, el: editor.element.$});

                            }
                        },
                            {
                                id: 'colselect',
                                type: 'select',
                                label: "Larghezza Controllo",
                                'default': 'none',
                                items:  [['--- Select Field Width ---',0]],
                                onChange: function() {
                                    var selected = this.getValue(),
                                        dialog = this.getDialog(),
                                        editor = dialog.getParentEditor();
                                    editor._model.setcontainerClass(selected);

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
                        var control = editor._collection.remove(editor._model);
                        console.log(control);
                        // alert( 'Clicked: ' + this.id );
                         }
                    } ]
        }

    });

