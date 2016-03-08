//utils.js
define(['underscore'],  function( _ ) {
    var arr = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3];
    var tabs = ['tab-lookup', 'tab-list', 'tab-fascicolo'];
    var self = this;
    return {
        getColOpts: function() {
            var percentage = 10;
            return _.map(arr, function(n){
                var m = percentage * (n - 2);
                return ['Larghezza-' + m + "%", n ];
            });
        },
        removeAllOptions: function( combo ) {
            combo = this.getSelect( combo );
            while ( combo.getChild( 0 ) && combo.getChild( 0 ).remove() ) {

            }
        },
        getSelect: function ( obj ) {
            if ( obj && obj.domId && obj.getInputElement().$ ) // Dialog element.
                return obj.getInputElement();
            else if ( obj && obj.$ )
                return obj;
            return false;
        },

        // Add a new option to a SELECT object (combo or list).
        addOption: function ( combo, optionText, optionValue, documentObject, index ) {
            combo = this.getSelect( combo );
            var oOption;
            if ( documentObject )
                oOption = documentObject.createElement( 'OPTION' );
            else
                oOption = document.createElement( 'OPTION' );

            if ( combo && oOption && oOption.getName() == 'option' ) {
                if ( CKEDITOR.env.ie ) {
                    if ( !isNaN( parseInt( index, 10 ) ) )
                        combo.$.options.add( oOption.$, index );
                    else
                        combo.$.options.add( oOption.$ );

                    oOption.$.innerHTML = optionText.length > 0 ? optionText : '';
                    oOption.$.value = optionValue;
                } else {
                    if ( index !== null && index < combo.getChildCount() )
                        combo.getChild( index < 0 ? 0 : index ).insertBeforeMe( oOption );
                    else
                        combo.append( oOption );

                    oOption.setText( optionText.length > 0 ? optionText : '' );
                    oOption.setValue( optionValue );
                }
            } else {
                return false;
            }

            return oOption;
        },
        getSelectedIndex: function( combo ) {
            combo = this.getSelect( combo );
            return combo ? combo.$.selectedIndex : -1;
        },
        setSelectedIndex: function( combo, index ) {
            combo = this.getSelect( combo );
            if ( index < 0 )
                return null;
            var count = combo.getChildren().count();
            combo.$.selectedIndex = ( index >= count ) ? ( count - 1 ) : index;
            return combo;
        },
        // Remove all selected options from a SELECT object.
        removeSelectedOptions: function( combo ) {
            combo = this.getSelect( combo );

            // Save the selected index
            var iSelectedIndex = this.getSelectedIndex( combo );

            // Remove all selected options.
            for ( var i = combo.getChildren().count() - 1; i >= 0; i-- ) {
                if ( combo.getChild( i ).$.selected )
                    combo.getChild( i ).remove();
            }

            // Reset the selection based on the original selected index.
            this.setSelectedIndex( combo, iSelectedIndex );
        },
        toggleField: function ( field, check ) {
            field[ check ? 'enable' : 'disable' ]();
        },
        hideTabs: function () {
            for (i in tabs) {
                this.hidePage(tabs[i]);
            }
        },
        toggleTabs: function( id ) {

            var pages  = ({
                'tab-list' : ['tab-list'],
                'tab-classifica': ['tab-lookup'], //array per mostrare più schede(possibly)
                'tab-autocomplete': ['tab-lookup'],
                'tab-actor': ['tab-lookup'],
                'tab-fascicolo': ['tab-fascicolo'],
                'tab-cartella': ['tab-lookup']
            }[id]);
            for (var i in tabs) {
                this.hidePage( tabs[i] );
            }
            for (var j in pages) {
                this.showPage( pages[j] );
            }

        }

    }
} )
