// Input.js
// --------
define(["models/Base"], function (Base) {
  var Input = Base.extend({
   // general state and behavior for all pinin controls elements
    defaults: _.extend({
        //type:"text",
        elem:"input",
        elementType:"text",
        elementCss:"form-control",
        //elementValues: [""],
      }, Base.prototype.defaults),
      initialize: function(attrs, options) {
          options = options || {};
          Base.prototype.initialize.call(this, attrs, options);
          var type = options.type;
          if(type == "email"){
              this.set("elementType", type);
          }
      }
  });

  var CheckboxInput = Input.extend({
    defaults: {
        type:"boolean",
        elem: "checkbox",
        elementType: "checkbox",
        elementCss : "",
        disabled: false
    }
  });

  var ReadOnlyCheckboxInput = Input.extend({
    defaults: {
        disabled: true
    }
  });

    // Uses _.defaults to allow the overriding of default values in subclass
    _.defaults(CheckboxInput.prototype.defaults, Input.prototype.defaults);
    _.defaults(ReadOnlyCheckboxInput.prototype.defaults, CheckboxInput.prototype.defaults);


  return {
    Input: Input,
    CheckboxInput : CheckboxInput,
    ReadOnlyCheckboxInput : ReadOnlyCheckboxInput
  }
});
