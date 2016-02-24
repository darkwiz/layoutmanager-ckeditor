CKEDITOR.dialog.add( 'pinout', function( editor ) {
    return { //dialog definition
        title: editor.lang.formeditor.pinin.title,
        minWidth: 400,
        minHeight: 200,


        onShow: function() {
            //code executed when a dialog window is loaded
            // var selection = editor.getSelection();

            // var element = selection.getStartElement();

            // if(element)
            //     element = element.getAscendant('text', true );
            // if(!element || element.getName() != 'text') {
            //     element = editor.document.createElement();
            //     this.insertMode = true;
            // } else
            //     this.insertMode = false;

             console.log("PINS:", editor.config.customValues.pins);

            // this.element = element;
            // if ( !this.insertMode )
            //     this.setupContent( options,  element );

        },
        onOk: function() {
            var dialog = this;



        //     this.insertMode = true;


        //     var label = editor.document.createElement( 'label' );

        //     label.setAttribute( 'for', 'pin' );
        //     var value = dialog.getValueOf( 'tab-basic', 'label' );
        //     label.setHtml( value + ': ' );
        //     editor.insertElement( label );

        //     var text = editor.document.createElement( 'text' );
        //     var textvalue = dialog.getValueOf( 'tab-basic', 'pin' );
        //     text.setAttribute( 'value', textvalue );

        //     editor.insertElement( text );

        },

        contents: [
            {
                id: 'tab-basic',
                label: 'Basic Settings',
                elements: [
                    {
                        type: 'select',
                            id: 'pin-out',
                            label: 'Pin Out',
                            items: [['Select a PIN', 0]].concat(return_s_function(editor.config.customValues.pins, 'value')),
                                validate: CKEDITOR.dialog.validate.notEmpty( "Pin field cannot be empty." ),
                                setup: function( element ) {
                                    this.setValue( element.getAttribute( 'value') );

                            }
                    },
                    {
                        id: 'type',
                        type: 'select',
                        label: "Tipo Controllo",
                        'default': 'text',
                        items: [
                            [ "Email",    'email' ],
                            [ "ACL",     'acl' ],
                            [ "Codice Fiscale",   'cf' ],
                            [ "AutoComplete",      'search' ],
                            [ "Anno",      'year' ],
                            [ "Progr_fascicolo",      'url' ],
                            [ "Classifica",      'url' ],
                            [ "Folder_id",      'url' ]
                        ],
                       setup: function( element ) {
                            this.setValue( element.getAttribute( 'type' ) );
                        },
                        commit: function( data ) {


                        }
                    },
             ]},

        {
                id: 'tab-adv',
                label: 'Advanced Settings',
                elements: [
                    {
                        type: 'text',
                        id: 'id',
                        label: 'Id',
                        setup: function( element ) {
                            this.setValue( element.getAttribute('id'));
                        }
                    }
                ]},
    ]};

    // "private method"returns a particular field for every object in objarray
   function return_s_function( element, field ){
    var arr = [];
    if ( element[0] !== undefined ){
        return Object.keys(element).map(function(key){
            arr[0] = element[key][field];
            arr[1] = key;
            return arr;
        });
    } else
        return arr;

    };
});
