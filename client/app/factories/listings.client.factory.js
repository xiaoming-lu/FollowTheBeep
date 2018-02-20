angular.module('listings').factory('Listings', ['$http', 
  function($http) {


    var methods = {
      getAll: function() {
          var host =  process.env.HOST || 'http://localhost:8080';
        return $http.get(host+'/api/listings');
      },

      create: function(listing) {
          var host =  process.env.HOST || 'http://localhost:8080';
        return $http.post(host+'/api/listings', listing);
      }, 

      read: function(id) {
          var host =  process.env.HOST || 'http://localhost:8080';
        return $http.get(host+'/api/listings/' + id);
      }, 

      update: function(id, listing) {
          var host =  process.env.HOST || 'http://localhost:8080';
        return $http.put(host+'/api/listings/' + id, listing);
      }, 

      delete: function(id) {
          var host =  process.env.HOST || 'http://localhost:8080';
        return $http.delete(host+'/api/listings/' + id);
      }
    };

    return methods;
  }
]);