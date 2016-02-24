//Textarea.js
define(['models/Base'], function (Base) {
    var EditableTextarea = Base.extend({
        defaults: _.extend({
            type:"textarea",
            elem: "textarea",
            rows: 3,
            disabled: false,
            elementCss:"form-control"
        }, Base.prototype.defaults)
    });

    var ReadOnlyTextarea = EditableTextarea.extend({
        defaults: {
            disabled: true
        }
    });

    // Uses _.defaults to allow the overriding of default values in subclass
    _.defaults(ReadOnlyTextarea.prototype.defaults, EditableTextarea.prototype.defaults);

    return {
        ReadOnlyTextarea: ReadOnlyTextarea,
        EditableTextarea: EditableTextarea
    }
});
