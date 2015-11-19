(function() {
  angular
    .module('dash.utils')
    .factory('LoadingService', LoadingService);

  LoadingService.$inject = ["$ionicLoading", "$log"];

  function LoadingService($ionicLoading, $log) {
    var factory = {
      showSpinner: showSpinner,
      hideSpinner: hideSpinner
    };

    function showSpinner() {
      try{
        cordova.plugins.Keyboard.close();
      } catch (error) {
        $log.context('LoadingService.showSpinner').warn('Cordova is unavailable on this platform.');
      }
      $ionicLoading.show();
    }

    function hideSpinner() {
      $ionicLoading.hide();
    }
    return factory;
  }
}());
