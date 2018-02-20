angular.module('listings').factory('Listings', ['$http', 
  function($http) {
      var host =  process.env.HOST || 'http://localhost:8080';
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