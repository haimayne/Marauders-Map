angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading) {
  $scope.mapCreated = function(map) {
    $scope.map = map;
     console.log("Centering");
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

});
