define(["backbone",
	"models/Null",
	"../javascripts/models/Base",
	"../javascripts/models/Radio",
	"../javascripts/models/Input",
	"../javascripts/models/Year",
	"../javascripts/models/Date",
	"../javascripts/models/Textarea",
	"../javascripts/models/Span",
	"../javascripts/models/Object",
	"../javascripts/models/Soggetto",
	"../javascripts/models/List",
	"../javascripts/models/Actor",
	"../javascripts/models/Document",
	"../javascripts/models/Classifica",
	"../javascripts/models/Fascicolo",
    "../javascripts/models/Cartella"], function(Backbone,
												Null,
												Base,
												Radio,
												Input,
												Year,
												Date,
												Textarea,
												Span,
												Object,
												Soggetto,
												List,
												Actor,
												Document,
												Classifica,
												Fascicolo,
												Cartella) {


	/*Control Factory singleton */

	var existingControls = {};

	var constructors = {
		'none': {
			in: Null,
			out: Null,
			inout: Null
		},
		'text': {
			in: Span,
			out: Input.Input,
			inout: Input.Input
		},
		'boolean': {
			in: Input.ReadOnlyCheckboxInput,
			out: Input.CheckboxInput,
			inout:Input.CheckboxInput
		},
		'tp': {
			in: Radio.ReadOnlyTpRadio,
			out: Radio.TpRadio,
			inout: Radio.TpRadio
		},
		'acl':{
			in: Radio.ReadOnlyAclRadio,
			out: Radio.AclRadio,
			inout: Radio.AclRadio
		},
		'cf': {
			in: Span,
			out: Input.Input,
			inout: Input.Input
		},
		'email': {
			in: Span,
			out: Input.Input,
			inout: Input.Input
		},
		'list': {
			out: List,
			inout: List
		},
		'actor':{
			out: Actor.Actor
		},
		'year': {
			in: Year.ReadOnlyDate,
			out:Year,
			inout:Year
		},
		'date': {
			out:Date.Date,
			in: Date.ReadOnlyDate,
			inout: Date.Date
		},
		'calendar':{
			out:Date.DateCalendar,
			in: Date.DateCalendar,
			inout: Date.DateCalendar
		},
		'calendartime':{
			out:Date.DateTimeCalendar,
			in:Date.DateTimeCalendar,
			inout:Date.DateTimeCalendar
		},
		'textarea': {
			in: Textarea.ReadOnlyTextarea,
			out: Textarea.EditableTextarea,
			inout: Textarea.EditableTextarea
		},
		'objectacl': {
			in: Object.ObjectAclReadOnly,
			out: Object.ObjectAcl,
			inout: Object.ObjectAcl
		},
		'soggetto': {
			in: Soggetto.SoggettoReadOnly,
			out: Soggetto.Soggetto,
			inout: Soggetto.Soggetto
		},
		'soggettoautocomplete': {
			out: Soggetto.SoggettoLookup,
			inout: Soggetto.SoggettoLookup
		},
		'document': {
			in: Document.DocumentReadOnly
		},
		'classifica': {
			in: Classifica.ClassificaReadOnly,
			out: Classifica.Classifica
		},
		'fascicolo': {
			in: Fascicolo.FascicoloReadOnly,
			out: Fascicolo.Fascicolo,
			inout: Fascicolo.Fascicolo
		},
		'cartella':{
			in: Cartella.CartellaReadOnly,
			out: Cartella.Cartella,
			inout: Cartella.Cartella
		}
	};

	return {

		createControl: function(attrs, options){

			/*Find out if a particular obj has been created before*/
			if (options.PIN) {
				var existingControl = existingControls[options.PIN.name + "_" + options.type];
				if (existingControl) {
					return existingControl;
				} else {
					//[text/bool...][in/out]
					var control = constructors[options.type][options.PIN.pintype]
					//new constructors[options.type][options.PIN.pintype](attrs, options);

					existingControls[options.PIN.name + "_" + options.type] = control;

					return control;

				}
			}
			else {
				return Null;
			}
		}

	};


});
