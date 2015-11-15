var app=angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives','angularGeoFire'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
