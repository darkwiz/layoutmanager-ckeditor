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