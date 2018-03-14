angular.module('listings').controller('ListingsController', ['$scope', '$location', '$stateParams', '$state', 'Listings',
  function($scope, $location, $stateParams, $state, Listings){
      $scope.alpha = 0;
      $scope.dest =null;
      $scope.source = null;
      $scope.directionAngle = null;
      $scope.resolvedDirection ="Undefined";
      $scope.listing = null;

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



      //initialize the room

      audioCtx = window.AudioContext || window.webkitAudioContext;

      audioContext = new audioCtx();
      // Create a (1st-order Ambisonic) ResonanceAudio scene.
      scene = new ResonanceAudio(audioContext);
      // Send scene's rendered binaural output to stereo out.
      scene.output.connect(audioContext.destination);
      // Set room acoustics properties.
      dimensions = {
          width: 10,
          height: 10,
          depth: 10,
      };
      // curtain-heavy material has better sound effect
      materials = {
          left: 'transparent',
          right: 'transparent',
          front: 'transparent',
          back: 'transparent',
          down: 'transparent',
          up: 'transparent',
      };
      scene.setRoomProperties(dimensions, materials);

      audioElement = document.createElement('audio');

      audioElement.src = '/../../audio/beep_sound.wav';
      audioElement.load();
      //audioElement = document.getElementById('audio');
      //audioElement.src = '/../../audio/beep_sound.wav';

      audioElementSource = audioContext.createMediaElementSource(audioElement);
      // Create a Source, connect desired audio input to it.
      source = scene.createSource();
      audioElementSource.connect(source.input);


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

        if ('ondeviceorientationabsolute' in window) {
            // Chrome 50+ specific
            window.addEventListener('deviceorientationabsolute', handleOrientation);
        } else if ('ondeviceorientation' in window) {
            window.addEventListener('deviceorientation', handleOrientation);
        }


        function handleOrientation(event) {
            var alpha;
            if (event.absolute) {
                alpha = event.alpha;
            } else if (event.hasOwnProperty('webkitCompassHeading')) {
                // get absolute orientation for Safari/iOS
                alpha = 360 - event.webkitCompassHeading; // conversion taken from a comment on Google Documentation, not tested
            } else {
                console.log('Could not retrieve absolute orientation');
            }
            $scope.alpha = alpha;

        }

        if (window.DeviceOrientationEvent) {
            // Listen for the deviceorientation event and handle the raw data
            window.addEventListener('deviceorientation', function(eventData) {
                var compassdir;

                if(event.webkitCompassHeading) {
                    // Apple works only with this, alpha doesn't work
                    compassdir = event.webkitCompassHeading;
                }
                else {
                    compassdir = event.alpha;
                }
                $scope.alpha = compassdir;
            });
        }

      $scope.loading = true;


   /* if($scope.soundLoaded == false) {
        Listings.readSound().then(function (response) {
            $scope.soundLoaded = true;
            $scope.sound = response.data;
        }, function (error) {
            $scope.error = 'Unable to read sound file' + error;
            $scope.soundLoaded = false;
        });
    }
*/
      var id = $stateParams.listingId;

      Listings.read(id)
              .then(function(response) {
                $scope.listing = response.data;
                $scope.loading = false;
                calculateLocation();
              }, function(error) {
                $scope.error = 'Unable to retrieve listing with id "' + id + '"\n' + error;
                $scope.loading = false;
              });

      // setting the time out, function will call itself every 10 seconds

    };

    function calculateLocation(){

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                $scope.location = pos;
                $scope.source = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                $scope.dest = new google.maps.LatLng($scope.listing.coordinates.latitude,$scope.listing.coordinates.longitude);
                calculateRotation();
            }, function() {
            });
        } else {
            // Browser doesn't support Geolocation
        }

    };

    function calculateRotation(){

        $scope.directionAngle = google.maps.geometry.spherical.computeHeading($scope.source,$scope.dest);
        $scope.distance = google.maps.geometry.spherical.computeDistanceBetween($scope.source,$scope.dest);


        if( $scope.distance >= 50)
               $scope.distance = 50;

        if($scope.directionAngle<0)
            $scope.directionAngle += 360;

        $scope.resolvedAngle = ($scope.directionAngle+$scope.alpha)% 360;

        if($scope.resolvedAngle > 22.5 && $scope.resolvedAngle<67.5) {
            $scope.resolvedDirection = "1.5 o'clock"+$scope.distance * Math.cos(45/180*Math.PI);
            source.setPosition($scope.distance * Math.cos(45/180*Math.PI),$scope.distance * Math.sin(45/180*Math.PI), 0);
        }
        else if($scope.resolvedAngle>= 67.5 && $scope.resolvedAngle <112.5){
            $scope.resolvedDirection = "3 o'clock"+$scope.distance * Math.cos(0/180*Math.PI)
            source.setPosition($scope.distance * Math.cos(0/180*Math.PI),$scope.distance * Math.sin(0/180*Math.PI), 0);
        }
        else if ($scope.resolvedAngle>=112.5 && $scope.resolvedAngle< 157.5){
            $scope.resolvedDirection = "4.5 o'clock"+$scope.distance * Math.cos(315/180*Math.PI);
            source.setPosition($scope.distance * Math.cos(315/180*Math.PI),$scope.distance * Math.sin(315/180*Math.PI), 0);
        }
        else if($scope.resolvedAngle>=157.5 && $scope.resolvedAngle<202.5) {
            $scope.resolvedDirection = "6 o'clock"+$scope.distance * Math.cos(270/180*Math.PI);
            source.setPosition($scope.distance * Math.cos(270/180*Math.PI),$scope.distance * Math.sin(270/180*Math.PI), 0);
        }
        else if($scope.resolvedAngle>=202.5 && $scope.resolvedAngle<247.5) {
            $scope.resolvedDirection = "7.5 o'clock"+$scope.distance * Math.cos(225/180*Math.PI);
            source.setPosition($scope.distance * Math.cos(225/180*Math.PI),$scope.distance * Math.sin(225/180*Math.PI), 0);
        }
        else if($scope.resolvedAngle>=247.5 && $scope.resolvedAngle<292.5) {
            $scope.resolvedDirection = "9 o'clock"+$scope.distance * Math.cos(180/180*Math.PI);
            source.setPosition($scope.distance * Math.cos(180/180*Math.PI),$scope.distance * Math.sin(180/180*Math.PI), 0);
        }
        else if($scope.resolvedAngle>=292.5 && $scope.resolvedAngle<337.5) {
            $scope.resolvedDirection = "10.5 o'clock"+$scope.distance * Math.cos(135/180*Math.PI);
            source.setPosition($scope.distance * Math.cos(135/180*Math.PI),$scope.distance * Math.sin(135/180*Math.PI), 0);
        }
        else if($scope.resolvedAngle>=337.5 || $scope.resolvedAngle<=22.5) {
            $scope.resolvedDirection = "12 o'clock"+$scope.distance * Math.cos(90/180*Math.PI);
            source.setPosition($scope.distance * Math.cos(90/180*Math.PI),$scope.distance * Math.sin(90/180*Math.PI), 0);
        }
        else{
            $scope.resolvedDirection = "Undefined";
            source.setPosition(35.3363636, 37.5666366, 10.36336);
        }
        wavesurfer.play();

        //document.getElementById("alpha").innerHTML = $scope.alpha;
        document.getElementById("resolvedAngle").innerHTML = $scope.resolvedDirection +  $scope.worked;
        //document.getElementById("test").play();
        // The source position is relative to the origin
        // (center of the room).
        // if you want manually test the 3d Sound in the computer, uncomment below code, and set the position to whatever number you want.
        // all other properties are presetted, no need to change them.

        // source.setPosition(0, 0, 0);
        // x , y , z
        // +x is right side,  +y is front
       // source.setPosition(-20,0,0);
       // source.setPosition(35.22323, 37.366, 10.636);


        audioElement.play();


        setTimeout(calculateLocation, 3000);
    }

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
        address: $scope.address,
        direction: $scope.direction
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
