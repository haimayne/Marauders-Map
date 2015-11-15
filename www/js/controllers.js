angular.module('starter.controllers', ['angularGeoFire','firebase'])

.controller('MapCtrl', function($scope, $ionicLoading,$firebaseArray,$firebaseObject,$geofire,FirebaseService) {
  $scope.mapCreated = function(map) {
    $scope.map = map;
     console.log("Centering");
     username="athigale"
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
      }, function (error) {
        alert('Unable to get location: ' + error.message);
      });
  };

  function addMarker(latitude,longitude,username){
    latLng=new google.maps.LatLng(latitude,longitude );

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
          main.set(f.val());
          console.log("sdfsdf");
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
      console.log("asd");
      var locations = {
      "Capen": [43.000263, -78.7911327],
      };
      var radiusInKm = 4;
      var friendsInQuery = {};
      var center = locations["Capen"];
      username="athigale"
      var $geo=$geofire(FirebaseService.get(username+"friends"));

      var query = $geo.$query({
        center: center,
        radius: radiusInKm
      });
      var geoQueryCallback = query.on("key_entered", "SEARCH:KEY_ENTERED");
  }

  $scope.$on("SEARCH:KEY_ENTERED", function (vehicleId,vehicleLocation) {
        // Do something interesting with object
        // $scope.searchResults.push({key: key, location: location, distance: distance});
        console.log("sdf");
        console.log(vehicleLocation)
        console.log(vehicleId)
        // Cancel the query if the distance is > 5 km
        // if(distance > 5) {
        //     geoQueryCallback.cancel();
        // }
    });
});
