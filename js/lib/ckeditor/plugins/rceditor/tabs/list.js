define(function() {
    var editor,
        self;
    return [
        {
            setConfiguration: function(config) {
                self = config.self;
                editor = config.editor;
            }
        }, {
            type: 'hbox',
            widths: [ '115px', '115px', '100px' ],
            children: [ {
                id: 'txtOptValue',
                type: 'text',
                label: "Value",
                style: 'width:115px',
                setup: function( name ) {
                    if ( name == 'clear' )
                        self.setValue( '' );
                }
            },
                {
                    type: 'select',
                    id: 'cmbValue',
                    label: '',
                    size: 5,
                    style: 'width:115px;height:75px',
                    items: [],
                    onChange: function() {
                        var dialog = self.getDialog(),
                            optValue = dialog.getContentElement( 'tab-list', 'txtOptValue' );

                        optValue.setValue( self.getValue() );
                    },
                    setup: function( name ) {
                        if ( name == 'clear' )
                            removeAllOptions( self );
                    }
                },
                {
                    type: 'button',
                    id: 'btnAdd',
                    label: "Aggiungi",
                    title: "Aggiungi",
                    style: 'width:100%;',
                    onClick: function() {
                        //Add new option.
                        var dialog = self.getDialog(),
                            optValue = dialog.getContentElement( 'tab-list', 'txtOptValue' ),
                            values = dialog.getContentElement( 'tab-list', 'cmbValue' );

                        addOption( values, optValue.getValue(), optValue.getValue(), dialog.getParentEditor().document );

                        optValue.setValue( '' );
                    }
                }
            ]

    }]
});