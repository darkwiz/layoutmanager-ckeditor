CKEDITOR.dialog.add( 'pinedit', function( editor ) {

    return { //dialog definition
        title: editor.lang.rceditor.pinedit.title,
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
            require(['utils'], function(utils){
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
                        //qui i "sottotipi" potrebbero essere presi dinamicamente
                        // da valutare la soluzione
                        optionVal = new Array("other");
                        break;
                    case 'soggetto':
                        optionNames = new Array("<Scegli un controllo>", "Soggetto", "Soggetto/PersonaFisica", "Soggetto/PersonaGiuridica", "Soggetto/Amministrazione");
                        optionVal = new Array("none", "soggetto", "soggettopf", "soggettopg", "soggettoam");

                        break;
                    case 'object':
                        optionNames = new Array("<Scegli un controllo>","Object/ACL");
                        optionVal = new Array("<none>","objectacl");
                        var objCollection = CollectionManager.getCollection('obj');

                        break;
                    case 'actor':
                        optionNames = new Array("<Scegli un controllo>","Lista", "Autocomplete");
                        optionVal = new Array("none", "list", "autocomplete");

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
                        optionNames = new Array("<none>");
                        optionVal = new Array("");
                }

                self.setupContent();
                utils.removeAllOptions( values );

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
                isInsertMode = !element;


            // if ( isInsertMode ) {
            //    element = editor.document.createElement( 'span' );

            require(["vent"], function(vent) {
                vent.trigger("detach"); //on dialog ok detach previous views
            });

            // }
            // element: element ,
            var data = { element: element };

            // if ( isInsertMode ){
            //     editor.insertElement(data.element);
            //     }
           // if (editor._model)

                this.commitContent( data );
            
           // else
              //  alert( 'Nessun controllo è stato scelto');

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
                                setup: function( ) {
                                    //Risolvere il Problema con i tipi complessi:
                                    //edita tutte le label!!
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
                                    require(["utils", "vent"], function(utils, vent) {
                                        var selected = self.getValue(),
                                            dialog = self.getDialog(),
                                            editor = dialog.getParentEditor(),
                                            wselect = dialog.getContentElement("tab-basic", "colselect"),
                                            config = editor.config.customValues,
                                            selectedPin = config.picked ? config.picked : config.pin;

                                        //console.log("Selected PIN: " + selectedPin.name );
                                        vent.trigger('changeElement',{
                                            type: selected,
                                            PIN: selectedPin
                                        });

                                        utils.toggleField(wselect, selected);

                                        //TODO: Risolvere il problema del toggle delle schede in casi tipi complessi
                                        utils.toggleTabs.call(dialog, 'tab-' + selected);

                                    });
                                },
                                commit: function( data ) {
                                    var head = CKEDITOR.document.getHead(),
                                        dialog = this.getDialog(),
                                        editor = dialog.getParentEditor();


                                }
                            },{
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
                                    var url = this.getValue(),
                                        dialog = this.getDialog(),
                                        selectValue = dialog.getContentElement('tab-lookup', 'sourceVal');

                                    
                                    if(selectValue.isVisible() && selectValue.getValue() == "url" ){
                                        require(["vent"], function(vent) {
                                            vent.trigger('setUrl', {url: url});
                                        });
                                    }

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
                                    require(["utils", "vent"], function(utils, vent) {
                                        var dialog = self.getDialog(),
                                            editor = dialog.getParentEditor(),
                                            optValue = dialog.getContentElement('tab-lookup', 'txtOptValue'),
                                            values = dialog.getContentElement('tab-lookup', 'cmbValue');
                                        utils.addOption(values, optValue.getValue(), optValue.getValue(), editor.document);

                                        vent.trigger('addOption', {option: optValue.getValue()});

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
                                        require(["utils", "vent"], function(utils, vent) {
                                            var dialog = self.getDialog(),
                                                optValue = dialog.getContentElement('tab-lookup', 'txtOptValue'),
                                                values = dialog.getContentElement('tab-lookup', 'cmbValue'),
                                                iIndex = utils.getSelectedIndex(values);

                                            if (iIndex >= 0) {
                                                
                                                vent.trigger('removeOption', {option: iIndex});
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
                                    require(["utils", "vent"], function(utils, vent) {
                                        var dialog = self.getDialog(),
                                            editor = dialog.getParentEditor(),
                                            optValue = dialog.getContentElement('tab-list', 'txtOptValue'),
                                            values = dialog.getContentElement('tab-list', 'cmbValue');
                                        utils.addOption(values, optValue.getValue(), optValue.getValue(), editor.document);

                                        //console.log(optValue.getValue());
                                        vent.trigger('addOption', {option: optValue.getValue()});
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
                                        require(["utils", "vent"], function(utils, vent) {
                                            var dialog = self.getDialog(),
                                                optValue = dialog.getContentElement('tab-list', 'txtOptValue'),
                                                values = dialog.getContentElement('tab-list', 'cmbValue');

                                            iIndex = utils.getSelectedIndex(values);

                                            if (iIndex >= 0) {
                                                

                                                vent.trigger('removeOption', {option: iIndex});

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
                    {   type:'hbox',
                        padding:5,
                        widths: [ '66%', '33%' ],
                        children: [ {
                            id: 'urlTitolario',
                            type: 'text',
                            label: 'URL Titolario',
                            'default': 'https://kdm-test-ws.herokuapp.com/'
                            /* validate: function ()git status {
                             if (!this.getValue()) {
                             alert("pippo")
                             return false;
                             }
                             },*/

                        }, {
                            type: 'vbox',
                            padding: 5,
                            children:[
                                {
                                    type: 'button',
                                    id: 'btnFascicoli',
                                    label: "Ottieni Fascicoli sotto titolario",
                                    title: "Ottieni Fascicoli sotto titolario",
                                    style: 'width:100%;',
                                    onClick: function () {
                                        //Delete selected option.
                                        var self = this;
                                        require(["utils", "vent"], function (utils, vent) {
                                            var dialog = self.getDialog(),
                                                editor = dialog.getParentEditor(),
                                                urlTitolario = dialog.getContentElement('tab-fascicolo', 'urlTitolario'),
                                                cmbTitolari = dialog.getContentElement('tab-fascicolo', 'cmbTitolari'),
                                                cmbFascicoli = dialog.getContentElement('tab-fascicolo', 'cmbFascicoli');

                                            var args = {urlTitolario: urlTitolario.getValue(), promise: undefined}
                                            vent.trigger("loadFascicoli", args);

                                            args.promise.done(function( data ) {
                                                

                                                for (var i in data.titolario) {
                                                    utils.addOption(cmbTitolari, data.titolario[i], data.titolario[i], editor.document);
                                                }
                                                for (var i in data.fascicolo_padre){
                                                    utils.addOption(cmbFascicoli, data.fascicolo_padre[i], data.fascicolo_padre[i], editor.document);
                                                }

                                            });

                                        });
                                    }
                                },
                                {
                                    type: 'button',
                                    id: 'btnDelete',
                                    label: "Reset",
                                    title: "Reset",
                                    style: 'width:100%;',
                                    onClick: function () {
                                        // Delete option.
                                        var self = this;
                                        require(["utils"], function (utils) {
                                            var dialog = self.getDialog(),
                                                urlTitolario = dialog.getContentElement('tab-fascicolo', 'urlTitolario'),
                                                cmbTitolari = dialog.getContentElement('tab-fascicolo', 'cmbTitolari'),
                                                cmbFascicoli = dialog.getContentElement('tab-fascicolo', 'cmbFascicoli');

                                            utils.removeAllOptions(cmbFascicoli);
                                            utils.removeAllOptions(cmbTitolari);
                                            urlTitolario.setValue('');

                                        });
                                    }
                                }
                            ]
                        }
                        ]
                    },
                    {
                        type:'hbox',
                        padding:5,
                        widths: [ '50%', '50%' ],
                        children: [
                            {
                                id: 'cmbTitolari',
                                type: 'select',
                                label: "Titolari",
                                style: 'width:275px;height:75px',
                                size: 5,
                                items: []
                            },
                            {
                                id: 'cmbFascicoli',
                                type: 'select',
                                label: "Fascicoli Padre",
                                style: 'width:275px;height:75px',
                                size: 5,
                                items: []
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
                    //var control = editor._collection.remove(editor._model);
                    //console.log(control.toJSON());
                    // alert( 'Clicked: ' + this.id );
                }
            } ]
    }

});

