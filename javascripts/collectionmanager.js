//This  Manager is responsible for instantiating collections and fetching them
// Need to solve fetch sync problems :() -- see line 14,
define(["collections/Collection", "collections/ObjectCollection"], function (Collection, ObjectCollection){

  var constructors = {
    'collection': Collection,
    'obj': ObjectCollection
  };
  var collections = {};

  return {
    getCollection: function(name) {
      if(!collections[name]) {
        var collection = new constructors[name]();
        //collection.fetch();
        collections[name] = collection;
      }
      return collections[name];
    }
  }

});
