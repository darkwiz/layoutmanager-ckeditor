//This  Manager is responsible for instantiating collections and fetching them
// Need to solve fetch sync problems :() -- see line 14,
define(["views/View"], function (View){

  var constructors = {
    'simpleview': View,
  };
  var views = {};

  return {
    getView: function(name, obj) {
      if(!views[name]) {
        var view = new constructors[name](obj);

        views[name] = view;
      }
      return views[name];
    }
  }

});
/*

define(['jquery', 'underscore', 'backbone',"views/View"], function($, _, Backbone, View) {
  var __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };


  var Singleton;
  Singleton = (function() {
    __extends(Singleton, View);
    function Singleton() {
      Singleton.__super__.constructor.apply(this, arguments);
    }
    Singleton.getInstance = function() {
      var _ref;
      return (_ref = this._instance) != null ? _ref : this._instance = new this;
    };
    return Singleton;
  })();
  return Singleton.getInstance();
});

*/