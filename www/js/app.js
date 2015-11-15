var app=angular.module('maraudersmap', ['ionic', 'starter.directives','angularGeoFire','firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('map', {
    url: '/map',
    templateUrl: 'templates/map.html',
  })
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
  })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/map');
});
