// Base.js
define(["jquery", "underscore","backbone"],
    function ($, _, Backbone) {
  return Backbone.Model.extend({
      defaults: {
          labelCss:"control-label col-sm-3",
          containerCss:"control-container col-sm-9"
      },
      initialize: function(attrs, options) {
          options = options || {};
          var pin = options.PIN;
          if (pin){
              this.set("pinValue", this.getPinValue(pin.value, pin.pintype));
              this.set("type", options.type); //per riselezionare il controllo nella dialog
              this.set("labelValue", pin.label);
              this.set("pinName", pin.value);
              this.set("pinType", pin.pintype);
          }
      },
      setContainerClass: function(width) {
          var part = 'col-sm-',
              container = this.get('containerCss'),
              label = this.get('labelCss');

          this.set('containerCss',"control-container" + " " +  part + width );
          width = 12 - width;
          this.set('labelCss', "control-label" + " " + part + width);

          this.trigger('update');

          return this;// rimuovere? serviva agli override vari..
      },
      setControlLabel: function (value) {
            value = value || this.get("labelValue");
            this.set("labelValue", value);
      },
      getPinValue: function(value, pintype) {
          if(pintype == "inout" || pintype == "in"){
              return "${" + value + "}";
          } else {
              return "";
          }
      }
});
});
