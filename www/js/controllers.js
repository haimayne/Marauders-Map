var main=app.controller('MapCtrl', function($scope, $ionicLoading,$firebaseArray,$firebaseObject,$geofire,FirebaseService) {


  $scope.mapCreated = function(map) {
    $scope.friendsInQuery = {};
    $scope.map = map;
     username=window.localStorage['username']
     $scope.$geo=$geofire(FirebaseService.get(username+"friends"));
     makeFriends(username);
    if (!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function (pos) {
      console.log('Got pos', pos);
      var latLng=new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      $scope.map.setCenter(latLng);
      $scope.loading.hide();
         var marker = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            position: latLng
        });
        var infoWindow = new google.maps.InfoWindow({
            content: "Here I am!"
        });

        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open($scope.map, marker);
        });
        var ref=FirebaseService.get("/users/"+username).child('l');
        ref.update({"0":pos.coords.latitude,"1":pos.coords.longitude})
        $scope.selfLoc=marker;
        drawCircle();
      }, function (error) {
        alert('Unable to get location: ' + error.message);
      });

      navigator.geolocation.watchPosition(function(pos){
        // addMarker([pos.coords.latitude,pos.coords.longitude],username)
        var ref=FirebaseService.get("/users/"+username).child('l');
        ref.update({"0":pos.coords.latitude,"1":pos.coords.longitude})
        $scope.selfLoc.animatedMoveTo([pos.coords.latitude,pos.coords.longitude]);
        makeFriends(username)
        console.log("self moved");
      }, function (error) {
        alert('Unable to get location: ' + error.message);
      })


  };
  function drawCircle(){
     var circle = new google.maps.Circle({
          strokeColor: "#6D3099",
          strokeOpacity: 0.7,
          strokeWeight: 1,
          fillColor: "#B650FF",
          fillOpacity: 0.1,
          map: $scope.map,
          center: new google.maps.LatLng(43.000263, -78.7911327),
          radius: ((1.3) * 1000),
        });
  }
  function addMarker(location,username){
    latLng=new google.maps.LatLng(location[0],location[1]);

      var marker = new google.maps.Marker({
            icon:{
              url:'https://maps.gstatic.com/mapfiles/ms2/micons/lightblue.png'
            },
            label:username[0],
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            position: latLng
        });
        var infoWindow = new google.maps.InfoWindow({
            content: username
        });

        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open($scope.map, marker);
        });
        var ref=FirebaseService.get("/users/"+username).child('l');
        ref.update({"0":location[0],"1":location[1]})
        return marker;
  };

  function makeFriends(username){
    var friendList=FirebaseService.get("/friends/"+username);
     friendList.once("value",function(snapshot){
      var arr=[];
      snapshot.forEach(function(childSnapshot){
        var friend=childSnapshot.key();
        var main= FirebaseService.get(username+"friends/"+friend);
        var ref=FirebaseService.get("/users/"+friend)
        ref.once("value",function(f){
          $scope.$geo.$set(f.key(),f.val().l)
        })
      });
     });

       // var ref = new Firebase("https://ubhackathonmap.firebaseio.com/friends/"+username);
      // console.log(friendList)
       // for (var i of friendList){
       //    console.log(i)
       // }
       // var $geo = $geofire(new Firebase('https://ubhackathonmap.firebaseio.com/'));
      // return [{u:'Melvin',long:'43.000213',lat:'-78.785751'}];
  };

  $scope.centerOnMe=function(){
      var locations = {
      "Capen": [43.000263, -78.7911327],
      };
      var radiusInKm = 1;

      var center = locations["Capen"];
      username=window.localStorage['username']

      var query = $scope.$geo.$query({
        center: center,
        radius: radiusInKm
      });

      // $scope.$geo.$get("n7").then(function(location){
      //   if (location === null) {
      //     console.log("Provided key is not in GeoFire");
      //   }
      //   else {
      //     console.log("Provided key has a location of " + location);
      //   }
      // })
      var geoQueryCallback = query.on("key_entered", "SEARCH:KEY_ENTERED");
      var geoQueryCallback1 = query.on("key_moved", "SEARCH:KEY_MOVED");
      var geoQueryCallback2 = query.on("key_exited", "SEARCH:KEY_EXITED");
      // var geoQueryCallback = query.on("key_entered", "SEARCH:KEY_ENTERED");
  }


  $scope.$on("SEARCH:KEY_ENTERED", function (event, key, location, distance) {
      // $scope.friendsInQuery[friendId]=true;
      // console.log(event)

      $scope.friendsInQuery[key]=true;
      var ref=FirebaseService.get("/users").child(key).once("value",function(snapshot){
        friend=snapshot.val()
        if (friend !== null && $scope.friendsInQuery[key] === true) {
        // Add the vehicle to the list of vehicles in the query
          $scope.friendsInQuery[key] = friend;

          // Create a new marker for the vehicle
          friend.marker = addMarker(location,key);
        }

      })
   });

  $scope.$on("SEARCH:KEY_MOVED", function (event, key, location, distance) {
      var friend = $scope.friendsInQuery[key];
      console.log("in moved")
      // Animate the vehicle's marker
      if (typeof friend !== "undefined" && typeof friend.marker !== "undefined") {
        friend.marker.animatedMoveTo(location);
      }
   });

  $scope.$on("SEARCH:KEY_EXITED", function (event, key, location, distance) {
    var friend = $scope.friendsInQuery[key];

    // If the vehicle's data has already been loaded from the Open Data Set, remove its marker from the map
    if (friend !== true) {
      friend.marker.setMap(null);
    }

    // Remove the vehicle from the list of vehicles in the query
    delete $scope.friendsInQuery[key];

  });
  function coordinatesAreEquivalent(coord1, coord2) {
    return (Math.abs(coord1 - coord2) < 0.000001);
  }

  /* Animates the Marker class (based on https://stackoverflow.com/a/10906464) */
  google.maps.Marker.prototype.animatedMoveTo = function(newLocation) {
    var toLat = newLocation[0];
    var toLng = newLocation[1];

    var fromLat = this.getPosition().lat();
    var fromLng = this.getPosition().lng();

    if (!coordinatesAreEquivalent(fromLat, toLat) || !coordinatesAreEquivalent(fromLng, toLng)) {
      var percent = 0;
      var latDistance = toLat - fromLat;
      var lngDistance = toLng - fromLng;
      var interval = window.setInterval(function () {
        percent += 0.01;
        var curLat = fromLat + (percent * latDistance);
        var curLng = fromLng + (percent * lngDistance);
        var pos = new google.maps.LatLng(curLat, curLng);
        this.setPosition(pos);
        if (percent >= 1) {
          window.clearInterval(interval);
        }
      }.bind(this), 50);
    }
  };
});
