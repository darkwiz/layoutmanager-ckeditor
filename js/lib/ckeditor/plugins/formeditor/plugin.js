CKEDITOR.plugins.add( 'formeditor', {

    requires: 'dialog',
    lang: 'it,en',
    icons: 'pinin,pinedit,pinout',

    init: function( editor ) {
        var lang = editor.lang,
        order = 0;

        /**
        * Funzione per l'aggiunta dei bottoni al menù
        *
        * @method addButtonCommand
        * @param {String} buttonName
        * @param {String} commandName comando che istanzierà il dialog
        * @param {String} dialogFile Nome del file che contiene il dialog
        */
        var addButtonCommand = function( buttonName, commandName, dialogFile ) {
                    var def = {};
                    //dialog addCommand( "name of dialog to open", [additional command definition properties] )
                    editor.addCommand( commandName, new CKEDITOR.dialogCommand( commandName, def ) );
                    editor.ui.addButton && editor.ui.addButton( buttonName, {
                        label: lang.formeditor.common[ buttonName.charAt( 0 ).toLowerCase() + buttonName.slice( 1 ) ],
                        command: commandName,
                        toolbar: 'kdm,' + ( order += 10 )
                    } );
                    CKEDITOR.dialog.add( commandName, dialogFile );
         };

         var dialogPath = this.path + 'dialogs/';
            addButtonCommand( 'Pinin', 'pinin', dialogPath + 'pinin.js' );
            addButtonCommand( 'Pinout', 'pinout', dialogPath + 'pinout.js' );
            addButtonCommand( 'Pinedit', 'pinedit', dialogPath + 'pinedit.js' );

            // If the "menu" plugin is loaded, register the menu items.
            if ( editor.addMenuItems ) {
                var items = {
                    pinin: {
                        label: lang.formeditor.pinin.title,
                        command: 'pinin',
                        group: 'pinin'
                    },

                    pinout: {
                        label: lang.formeditor.pinout.title,
                        command: 'pinout',
                        group: 'pinout'
                    },

                    pinedit: {
                        label: lang.formeditor.pinedit.title,
                        command: 'pinedit',
                        group: 'pinedit'
                    },
                }
                editor.addMenuItems( items );

            }

        }
});
