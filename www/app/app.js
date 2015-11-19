// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('dash', ['ionic',
                        'dash.menu',
                        'dash.account',
                        'dash.auth',
                        'dash.categories',
                        'dash.utils',
                        'dash.payment'])
  .config(['$logProvider', function($logProvider) {
    $logProvider.debugEnabled(true); // default is true
  }])
  .run(function($ionicPlatform, $log, EnhanceLogger, AuthService, UserStorage, $state, $rootScope, IntervalService) {
    //Enhance the angular logger using the debug-log service
    EnhanceLogger.setLog($log);

    //Ionic built in defaults
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });

    //Gets the user's data if he/she is currently logged into Firebase
    //If the user is logged in, stores his/her data in local storage
    var userAuthData = AuthService.userIsAuthenticated();
    if (userAuthData) {
      AuthService.saveUserDataInLocalStorage(userAuthData);
    }

    //If userData is not in local storage go to login page. Otherwise go to profile.
    if (!UserStorage.getUser()) {
      $state.go('app.login');
    } else {
      $state.go('app.categories');
    }

    //Redirect to login if not logged in
    $rootScope.$on('$stateChangeStart', function(event, toState){
      //IntervalService.cancelAllIntervals();
      var userAuthData = UserStorage.getUser();
      var userRestricted = toState.data.userRestricted;

      if (userRestricted && !userAuthData) {
        event.preventDefault();
        $log.context('toLogin').log('user auth needed to view page - return to login');
        $state.go('app.login');
      }
      if (toState.url === "/login" && userAuthData) {
        event.preventDefault();
        $log.context('toProfile').log('restricted access to login page - user is already authenticated');
        $state.go("app.categories");
      }
    });

  });
