angular.module('listings').controller('ListingsController', ['$scope', '$location', '$stateParams', '$state', 'Listings',
  function($scope, $location, $stateParams, $state, Listings){

  //generate the sound wave
  var wavesurfer = WaveSurfer.create({
          container: '#waveform',
          waveColor: 'white',
          progressColor: 'aqua',
          scrollParent: true,
          fillParent:true
      });

  wavesurfer.load('/../../audio/beep_sound.wav');
  wavesurfer.setMute(true);

  $scope.soundLoaded = false;
  $scope.sound =[];


      $scope.find = function() {
      /* set loader*/
      $scope.loading = true;

      /* Get all the listings, then bind it to the scope */
      Listings.getAll().then(function(response) {
        $scope.loading = false; //remove loader
        $scope.listings = response.data;
      }, function(error) {
        $scope.loading = false;
        $scope.error = 'Unable to retrieve listings!\n' + error;
      });
    };

    $scope.findOne = function readOne() {
      $scope.loading = true;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          $scope.location = pos;
          console.log(pos);
        }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }
      if (window.DeviceOrientationEvent) {
  // Listen for the deviceorientation event and handle the raw data
  window.addEventListener('deviceorientation', function(eventData) {
    var compassdir;

    if(event.webkitCompassHeading) {
      // Apple works only with this, alpha doesn't work
      compassdir = event.webkitCompassHeading;
    }
    else compassdir = event.alpha;
    $scope.direction = compassdir;
  });
}
    if($scope.soundLoaded == false) {
        Listings.readSound().then(function (response) {
            $scope.soundLoaded = true;
            $scope.sound = response.data;
        }, function (error) {
            $scope.error = 'Unable to read sound file' + error;
            $scope.soundLoaded = false;
        });
    }
      var id = $stateParams.listingId;

      Listings.read(id)
              .then(function(response) {
                $scope.listing = response.data;
                $scope.loading = false;
                wavesurfer.play();
              }, function(error) {
                $scope.error = 'Unable to retrieve listing with id "' + id + '"\n' + error;
                $scope.loading = false;
              });

      // setting the time out, function will call itself every 10 seconds
       setTimeout(readOne, 3000);
    };

    $scope.create = function(isValid) {
      $scope.error = null;

      /*
        Check that the form is valid. (https://github.com/paulyoder/angular-bootstrap-show-errors)
       */
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      /* Create the listing object */
      var listing = {
        name: $scope.name,
        code: $scope.code,
        address: $scope.address,
        direction: $scope.direction
      };

      /* Save the article using the Listings factory */
      Listings.create(listing)
              .then(function(response) {
                //if the object is successfully saved redirect back to the list page
                $state.go('listings.list', { successMessage: 'Listing succesfully created!' });
              }, function(error) {
                //otherwise display the error
                $scope.error = 'Unable to save listing!\n' + error;
              });
    };

    $scope.update = function(isValid) {
      /*
        Fill in this function that should update a listing if the form is valid. Once the update has
        successfully finished, navigate back to the 'listing.list' state using $state.go(). If an error
        occurs, pass it to $scope.error.
       */

	    $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');
        return false;
      }

	  var id = $stateParams.listingId;

      /* update the listing object */
      var listing = {
        name: $scope.name,
        code: $scope.code,
        address: $scope.address
      };

      /* Save the article using the Listings factory */
      Listings.update(id, listing)
              .then(function(response) {
                //if the object is successfully saved redirect back to the list page
                $state.go('listings.list', { successMessage: 'Listing succesfully updated!' });
              }, function(error) {
                //otherwise display the error
                $scope.error = 'Unable to update listing!\n' + error;
              });
    };


    $scope.remove = function() {
      /*
        Implement the remove function. If the removal is successful, navigate back to 'listing.list'. Otherwise,
        display the error.
       */


	  var id = $stateParams.listingId;

	   Listings.delete(id)
              .then(function(response) {
                //if the object is successfully saved redirect back to the list page
                $state.go('listings.list', { successMessage: 'Listing succesfully updated!' });
              }, function(error) {
                //otherwise display the error
                $scope.error = 'Unable to delete listing!\n' + error;
              });

    };

    /* Bind the success message to the scope if it exists as part of the current state */
    if($stateParams.successMessage) {
      $scope.success = $stateParams.successMessage;
    }

    /* Map properties */
    $scope.map = {
      center: {
        latitude: 29.65163059999999,
        longitude: -82.3410518
      },
      zoom: 14
    }
  }
]);
