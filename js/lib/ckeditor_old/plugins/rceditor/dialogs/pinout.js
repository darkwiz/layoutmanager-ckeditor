CKEDITOR.dialog.add( 'pinout', function( editor ) {

    return { //dialog definition
        title: editor.lang.rceditor.pinout.title,
        minWidth: 400,
        minHeight: 200,
        onLoad: function() { //chiamata per ogni istanza dell'editor alla prima apertura della dialog
            var self = this;
            require(["utils",'collectionmanager','views/View'], function(utils) {
                var select = self.getContentElement('tab-basic', 'colselect'),
                    opts = utils.getColOpts();
                for (var i = 0; i < opts.length; i++) {
                    var oOption = utils.addOption(select, opts[i][0], opts[i][1], editor.document);
                    // select.add(opts[i][0], opts[i][1]);
                    if (i == 3) {
                        oOption.setAttribute('selected', 'selected');
                        oOption.selected = true;
                    }
                }
                self.getContentElement("tab-basic", "colselect").disable();
                self.getContentElement('tab-lookup', 'txtOptValue').disable();
                utils.hideTabs.call(self);
            });

        },
        onShow: function() {
            var self = this;
            require(['collectionmanager', 'views/View', 'utils', 'viewmanager'], function(CollectionManager, View, utils, ViewManager ){
                var values = self.getContentElement('tab-basic', 'typeselect'),
                    selectedPin = editor.config.customValues.pin;


                switch(selectedPin.type)
                {   case 'text':
                    case 'textRef':
                        optionNames = new Array("<Scegli un controllo>","Generico","Boolean","Tipo Protocollazione","ACL","Codice Fiscale", "Email", "TextArea", "Lista");
                        optionVal = new Array("none","text","boolean","tp","acl","cf","email","textarea","list");

                        break;
                    case 'datetimeRef':
                        optionNames = new Array("<Scegli un controllo>","Calendar","Select","Calendar Time");
                        optionVal = new Array("none","calendar","date","calendartime");

                        break;
                    case 'year':
                        optionNames = new Array("<Scegli un controllo>","Select");
                        optionVal = new Array("none","year");

                        break;
                    case 'document':
                        optionNames = new Array("Other");
                        optionVal = new Array("other");

                        break;
                    case 'soggetto':
                        optionNames = new Array("<Scegli un controllo>", "Form", "Autocomplete");
                        optionVal = new Array("none", "soggetto", "soggettoautocomplete");

                        break;
                    case 'object':
                        optionNames = new Array("<Scegli un controllo>","Object/ACL");
                        optionVal = new Array("<none>","objectacl");

                        break;
                    case 'classifica':
                        optionNames = new Array("<Scegli un controllo>","Autocomplete");
                        optionVal = new Array("none", "classifica");

                        break;
                    case 'actor':
                        optionNames = new Array("<Scegli un controllo>","Lista", "Autocomplete");
                        optionVal = new Array("none", "list", "actor");

                        break;
                    case 'fascicolo':
                        optionNames = new Array("<Scegli un controllo>","Autocomplete");
                        optionVal = new Array("none", "fascicolo");
                        break;
                    case 'cartella':
                        optionNames = new Array("<Scegli un controllo>","Autocomplete");
                        optionVal = new Array("none", "cartella");
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
            if (editor._model){
                this.commitContent( data );
            }
            else{
                alert( 'Nessun controllo è stato scelto');
                return false;
            }
            //this.setupContent( 'clear' ); //TODO: Aggiungere al plugin per ripulire la tab list
            // Element might be replaced by commitment.
            // if ( !isInsertMode )
            //     editor.getSelection().selectElement( data.element );

        },

        contents: [
            {
            id: 'tab-basic',
            label: 'Basic Settings',
            elements: [
                {
                    type: 'hbox',
                    widths: [ '50%', '50%' ],
                    children: [
                        {
                            id: 'label',
                            type: 'text',
                            label: 'Label',
                            'default': editor.config.customValues.pin.label,
                            commit: function(data) {
                                var label = data.label,
                                    self = this,
                                    dialog = this.getDialog(),
                                    editor = dialog.getParentEditor();
                                id = dialog.getContentElement("tab-adv", "id");

                                //data.type = this.getValue();
                                editor._model.setControlLabel(this.getValue());

                                // label.setText( this.getValue() + ": " );

                                // label.setAttribute('for',  id.getValue() );
                            }
                        } //put here other children
                    ]
                },
                { //ROW 2
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
                                        editor = dialog.getParentEditor()
                                    wselect = dialog.getContentElement("tab-basic", "colselect"),
                                        selectedPin = editor.config.customValues.pin;
                                    //pinvalue è usa
                                    editor._model = editor._collection.add({}, {
                                        type: selected,
                                        PIN: selectedPin
                                    });
                                    utils.toggleField(wselect, selected);

                                    //TODO: Risolvere il problema del toggle delle schede in casi tipi complessi
                                    utils.toggleTabs.call(dialog, 'tab-' + selected);
                                    // if( selected == 'boolean')
                                    //       {  toggleField(checkbox, selected); }
                                    //       else {
                                    //           toggleField(checkbox, false);
                                    //           checkbox.setValue('');
                                    //        }
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
                        },{
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
                        }   //Add here on same row
                    ]}
            ]},
            {
                id: 'tab-lookup',
                label: 'Lookup Settings',
                title: 'Modalità di inserimento sorgenti',
                elements: [
                    {   //URL
                        type: 'hbox',
                        widths: [ '30%', '70%' ],
                        padding: 5,
                        children:[
                            {
                                type: 'select',
                                id: 'sourceVal',
                                label: 'Sorgente dati',
                                items:  [[' URL ','url'],
                                    [' Entry ','entry']],
                                'default':'url',
                                onChange: function() {
                                    var self = this;
                                    require(["utils"], function(utils) {
                                        var selected = self.getValue(),
                                            dialog = self.getDialog(),
                                            urlValue = dialog.getContentElement('tab-lookup', 'UrlValue'),
                                            txtOptValue = dialog.getContentElement('tab-lookup', 'txtOptValue');
                                        //document.getElementById(this.getButton('ok').domId).style.display='none';
                                        //urlValue.getElement.hide() funziona!

                                        utils.toggleField(urlValue, (selected == "url"));
                                        utils.toggleField(txtOptValue, !(selected == "url"));



                                    });
                                },
                                setup: function( name ) {
                                    console.log("setup")
                                    if ( name == 'clear' )
                                        removeAllOptions( this );
                                },

                            }, {
                                id: 'UrlValue',
                                type: 'text',
                                label: "URL",
                                style: 'width:100%',
                                setup: function( name ) {
                                    if ( name == 'clear' )
                                        this.setValue( '' );
                                },
                                commit: function( data ){
                                    var label = data.label,
                                        dialog = this.getDialog(),
                                        editor = dialog.getParentEditor(),
                                        selectValue = dialog.getContentElement('tab-lookup', 'sourceVal');

                                    console.log(selectValue.isVisible());
                                    if(editor._model && selectValue.isVisible() && selectValue.getValue() == "url" )
                                        editor._model.setUrl(this.getValue());

                                }
                            }]
                    },
                    { //Entry
                        type: 'hbox',
                        widths: [ '66%', '33%' ],
                        children: [ {
                            type: 'vbox',
                            padding: 5,
                            children: [ {
                                id: 'txtOptValue',
                                type: 'text',
                                label: "Value",
                                style: 'width:100%',
                                setup: function( name ) {
                                    if ( name == 'clear' )
                                        this.setValue( '' );
                                }
                            },
                                {
                                    type: 'select',
                                    id: 'cmbValue',
                                    label: 'Inserisci i valori per la lookup',
                                    size: 5,
                                    style: 'width:200px;height:75px',
                                    items: [],
                                    onChange: function() {
                                        var dialog = this.getDialog(),
                                            optValue = dialog.getContentElement( 'tab-lookup', 'txtOptValue' );

                                        optValue.setValue( this.getValue() );

                                    },
                                    setup: function( name ) {
                                        if ( name == 'clear' )
                                            removeAllOptions( this );
                                    }
                                }]
                        }, {
                            type: 'vbox',
                            padding: 5,
                            children: [ {
                                type: 'button',
                                id: 'btnAdd',
                                label: "Aggiungi",
                                title: "Aggiungi",
                                style: 'width:100%;',
                                onClick: function() {
                                    //Add new option.
                                    var self = this;
                                    require(["utils"], function(utils) {
                                        var dialog = self.getDialog(),
                                            editor = dialog.getParentEditor(),
                                            optValue = dialog.getContentElement('tab-lookup', 'txtOptValue'),
                                            values = dialog.getContentElement('tab-lookup', 'cmbValue');
                                        if (editor._model) {
                                            utils.addOption(values, optValue.getValue(), optValue.getValue(), dialog.getParentEditor().document);

                                            console.log(optValue.getValue());
                                            editor._model.addOption(optValue.getValue());
                                            optValue.setValue('');
                                        }
                                    });

                                }
                            },
                                {
                                    type: 'button',
                                    id: 'btnDelete',
                                    label: "Rimuovi Selezionati",
                                    title: "Rimuovi Selezionati",
                                    style: 'width:100%;',
                                    onClick: function() {
                                        //Delete selected option.
                                        var self = this;
                                        require(["utils"], function(utils) {
                                            var dialog = self.getDialog(),
                                                optValue = dialog.getContentElement('tab-lookup', 'txtOptValue'),
                                                values = dialog.getContentElement('tab-lookup', 'cmbValue');
                                            if (editor._model) {
                                                iIndex = utils.getSelectedIndex(values);

                                                if (iIndex >= 0) {
                                                    console.log(iIndex);
                                                    editor._model.removeOption(iIndex);
                                                    utils.removeSelectedOptions(values);}
                                            }
                                        });
                                    }
                                }
                            ]}
                        ]
                    }
                ]
            },
            {
                id: 'tab-list',
                label: 'List Settings',
                elements: [
                    {
                        type: 'hbox',
                        widths: [ '66%', '33%' ],
                        children: [ {
                            type: 'vbox',
                            padding: 5,
                            children: [ {
                                id: 'txtOptValue',
                                type: 'text',
                                label: "Value",
                                style: 'width:100%',
                                setup: function( name ) {
                                    if ( name == 'clear' )
                                        this.setValue( '' );
                                }
                            },
                                {
                                    type: 'select',
                                    id: 'cmbValue',
                                    label: '',
                                    size: 5,
                                    style: 'width:200px;height:75px',
                                    items: [],
                                    onChange: function() {
                                        var dialog = this.getDialog(),
                                            optValue = dialog.getContentElement( 'tab-list', 'txtOptValue' );

                                        optValue.setValue( this.getValue() );

                                    },
                                    setup: function( name ) {
                                        if ( name == 'clear' )
                                            removeAllOptions( this );
                                    }
                                }]
                        }, {
                            type: 'vbox',
                            padding: 5,
                            children: [ {
                                type: 'button',
                                id: 'btnAdd',
                                label: "Aggiungi",
                                title: "Aggiungi",
                                style: 'width:100%;',
                                onClick: function() {
                                    //Add new option.
                                    var self = this;
                                    require(["utils"], function(utils) {
                                        var dialog = self.getDialog(),
                                            editor = dialog.getParentEditor(),
                                            optValue = dialog.getContentElement('tab-list', 'txtOptValue'),
                                            values = dialog.getContentElement('tab-list', 'cmbValue');

                                        utils.addOption(values, optValue.getValue(), optValue.getValue(), dialog.getParentEditor().document);

                                        console.log(optValue.getValue());
                                        editor._model.addOption(optValue.getValue());
                                        optValue.setValue('');
                                    });

                                }
                            },
                                {
                                    type: 'button',
                                    id: 'btnDelete',
                                    label: "Rimuovi Selezionati",
                                    title: "Rimuovi Selezionati",
                                    style: 'width:100%;',
                                    onClick: function() {
                                        //Delete selected option.
                                        var self = this;
                                        require(["utils"], function(utils) {
                                            var dialog = self.getDialog(),
                                                optValue = dialog.getContentElement('tab-list', 'txtOptValue'),
                                                values = dialog.getContentElement('tab-list', 'cmbValue');

                                            iIndex = utils.getSelectedIndex(values);

                                            if (iIndex >= 0) {
                                                console.log(iIndex);
                                                editor._model.removeOption(iIndex);
                                                utils.removeSelectedOptions(values);
                                            }
                                        });
                                    }
                                }
                            ]}
                        ]
                    }
                ]
            },
            {
                id: 'tab-fascicolo',
                label: 'Fascicolo Settings',
                elements: [
                    {   type:'vbox',
                        padding:5,
                        width: '100%',
                        children:[
                            {
                                type: 'text',
                                id: 'fascicolo-titolario',
                                label: 'Source Titolario',
                                'default': '',
                                validate: function () {
                                    var dialog = this.getDialog(),
                                        editor = dialog.getParentEditor(),
                                        urlTitolario = dialog.getContentElement('tab-fascicolo', 'fascicolo-titolario');
                                    console.log(urlTitolario.isVisible());
                                    if (urlTitolario.isVisible() && !urlTitolario.getValue()) {
                                        alert("Scegli un Url per il titolario!")
                                        return false;
                                    }
                                }
                            }]
                    }
                ]
            }
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
                    console.log(control.toJSON());
                    // alert( 'Clicked: ' + this.id );
                }
            } ]
    }

});

