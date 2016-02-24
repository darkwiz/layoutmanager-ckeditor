//Document.js
define(['models/Radio',
        'models/Base',
        'models/Textarea',
        'models/Span'],
    function (Radio, Base, Textarea, Span) {
        "use strict";

        var DocumentReadOnly = Base.extend({
            defaults: {
                type: 'document',
                elem: 'document',
                docnum: _.extend({}, Span.prototype.defaults),
                type_id: _.extend({}, Span.prototype.defaults),
                abstract: _.extend({}, Textarea.ReadOnlyTextarea.prototype.defaults),
                docname: _.extend({}, Span.prototype.defaults),
                tipo_protocollazione:_.extend({}, Radio.ReadOnlyTpRadio.prototype.defaults),
            },
            initialize: function(attrs, options) {

                Base.prototype.initialize.call(this, attrs, options);

                this.type_id = _.clone(this.get("type_id"));
                this.type_id.labelValue =  "Tipologia:";
                this.type_id.pinValue =  options.PIN.value + ".TYPE_ID" ;
                this.set("type_id", this.type_id);

                this.docname = _.clone(this.get("docname"));
                this.docname.pinValue =  options.PIN.value + ".DOCNAME" ;
                this.docname.labelValue =  "DOCNAME:";
                this.docname.containerCss = "control-container col-sm-7"
                this.set("docname", this.docname);

                this.docnum = _.clone(this.get("docnum"));
                this.docnum.pinValue =  options.PIN.value + ".DOCNUM" ;
                this.docnum.elem =  "span-link";
                this.docnum.containerCss = "control-container col-sm-2";
                this.set("docnum", this.docnum);

                this.tipo_protocollazione = _.clone(this.get("tipo_protocollazione"));
                this.tipo_protocollazione.pinValue =  options.PIN.value + ".TIPO_PROTOCOLLAZIONE" ;
                this.tipo_protocollazione.labelValue = "TIPO_PROTOCOLLAZIONE:";
                this.set("tipo_protocollazione",  this.tipo_protocollazione);

                this.abstract = _.clone(this.get("abstract"));
                this.abstract.pinValue =  options.PIN.value + ".ABSTRACT" ;
                this.abstract.labelValue = "Abstract:";
                this.set("abstract", this.abstract);

            }
        });



        return {
            DocumentReadOnly: DocumentReadOnly
        }
    });
