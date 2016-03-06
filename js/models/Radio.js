// Radio.js
define(['models/Base'], function (Base) {
    var Radio = Base.extend({
      defaults: _.extend({
        labelCss:"control-label col-sm-3", //TODO: label css useful??
        elem: "radio",
        elementType: "radio",
        elementCss : "",
        containerCss: "col-sm-9",
        elementValues: {
          a:""
        }
      }, Base.prototype.defaults)
    });


  var AclRadio = Radio.extend({
    defaults: {
        //type:"acl",
        elem: "radio",
        elementValues: {
          NORMAL: "NORMAL",
          EDIT: "EDIT",
          FULL: "FULL"
        },
        disabled: false,
    }
  });

  var ReadOnlyAclRadio = AclRadio.extend({
    defaults: {
        disabled: true,
    }
  });

    var TpRadio = Radio.extend({
    defaults: {
        //type:"tp",
        elem: "radio",
        elementValues: {
          E: "Esterno",
          I: "Interno",
          U: "Uscita"
        },
        disabled: false,
    }
  });

  var ReadOnlyTpRadio = TpRadio.extend({
    defaults: {
        disabled: true,
    }
  });

    // Uses _.defaults to allow the overriding of default values in subclass
    _.defaultsDeep(AclRadio.prototype.defaults, Radio.prototype.defaults);
    _.defaultsDeep(ReadOnlyAclRadio.prototype.defaults, AclRadio.prototype.defaults);

    _.defaultsDeep(TpRadio.prototype.defaults, Radio.prototype.defaults);
    _.defaultsDeep(ReadOnlyTpRadio.prototype.defaults, TpRadio.prototype.defaults);

  return {
    Radio: Radio,
    AclRadio : AclRadio,
    ReadOnlyAclRadio : ReadOnlyAclRadio,
    TpRadio: TpRadio,
    ReadOnlyTpRadio: ReadOnlyTpRadio
  }
  });
