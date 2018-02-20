angular.module('listings').factory('Listings', ['$http', 
  function($http) {


    var methods = {
      getAll: function() {
          var host;
          if(location.hostname === "localhost")
            host = 'http://localhost:8080';
          else
              host = 'https://followthebeep.herokuapp.com'
        return $http.get(host+'/api/listings');
      },

      create: function(listing) {
          var host;
          if(location.hostname === "localhost")
              host = 'http://localhost:8080';
          else
              host = 'https://followthebeep.herokuapp.com'
        return $http.post(host+'/api/listings', listing);
      }, 

      read: function(id) {
          var host;
          if(location.hostname === "localhost")
              host = 'http://localhost:8080';
          else
              host = 'https://followthebeep.herokuapp.com'
        return $http.get(host+'/api/listings/' + id);
      }, 

      update: function(id, listing) {
          var host;
          if(location.hostname === "localhost")
              host = 'http://localhost:8080';
          else
              host = 'https://followthebeep.herokuapp.com'
        return $http.put(host+'/api/listings/' + id, listing);
      }, 

      delete: function(id) {
          var host;
          if(location.hostname === "localhost")
              host = 'http://localhost:8080';
          else
              host = 'https://followthebeep.herokuapp.com'
        return $http.delete(host+'/api/listings/' + id);
      }
    };

    return methods;
  }
]);