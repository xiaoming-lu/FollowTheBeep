angular.module('listings').factory('Listings', ['$http', 
  function($http) {
      var host;
      if(location.hostname === "localhost")
          host = 'http://localhost:8080';
      else
          host = 'https://followthebeep.herokuapp.com'

    var methods = {
      getAll: function() {

        return $http.get(host+'/api/listings');
      },

      create: function(listing) {

        return $http.post(host+'/api/listings', listing);
      }, 

      read: function(id) {

        return $http.get(host+'/api/listings/' + id);
      }, 

      update: function(id, listing) {

        return $http.put(host+'/api/listings/' + id, listing);
      }, 

      delete: function(id) {

        return $http.delete(host+'/api/listings/' + id);
      }
    };

    return methods;
  }
]);