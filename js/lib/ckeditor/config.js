/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For complete reference see:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// The toolbar groups arrangement, optimized for two toolbar rows.
	config.toolbarGroups = [
		{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
		{ name: 'links' },
		{ name: 'insert' },
		//{ name: 'forms' },
        { name: 'kdm'},
        { name: 'LayoutManager'},
		{ name: 'tools' },
		{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'others' },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
		{ name: 'styles' },
		{ name: 'colors' },
		{ name: 'about' }
	];

	config.extraPlugins = 'lineutils,widget,rceditor,basewidget,layoutmanager,autogrow,sourcedialog,preview';
	config.removePlugins = 'devtools,forms,image,sourcearea';
	//config.autoParagraph = false;
	//config.enterMode = CKEDITOR.ENTER_DIV;  inserts `<div></div>` instead of p
	config.allowedContent = true;
	config.contentsCss = [ CKEDITOR.basePath + 'contents.css', 'css/app.css'];
	config.layoutmanager_loadbootstrap = true;
	config.autoGrow_onStartup = true;
	config.autoGrow_bottomSpace = 50;
	//, 'lib/ckeditor/bootstrap.min.css']
	//evita che l'editor rimuova i tag "i" vuoti, ma può valere per tutti CKEDITOR.dtd.$removeEmpty['i'] = false
	CKEDITOR.dtd.$removeEmpty['i'] = false;
	CKEDITOR.dtd.$removeEmpty.span = 0;
	CKEDITOR.dtd.$removeEmpty.head = 0;
	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.
	config.removeButtons = 'Underline,Subscript,Superscript';

	// Set the most common block elements.
	config.format_tags = 'p;h1;h2;h3;pre';

	// Simplify the dialog windows.
	config.removeDialogTabs = 'image:advanced;link:advanced';
};
