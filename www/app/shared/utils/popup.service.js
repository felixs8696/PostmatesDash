angular
    .module('dash.utils')
    .factory('Popup', Popup);

Popup.$inject = ['$ionicPopup', '$ionicLoading', '$log', 'TimeoutService'];

function Popup($ionicPopup, $ionicLoading, $log, TimeoutService) {
    var factory = {
        showWithError: showWithError,
        showWithLog: showWithLog,
        timeoutPopup: timeoutPopup,
        cancelTimeoutPopup: cancelTimeoutPopup,
        withFunc: withFunc
    };

    function showWithError(title, template, errormessage, error) {
        TimeoutService.cancelAllTimeouts();
        try{
            cordova.plugins.Keyboard.close();
        } catch (error) {
            $log.context('Popup.showWithError').warn("Cordova is unavailable on this platform.");
        }
        $ionicLoading.hide();
        $ionicPopup.alert({
            title: title,
            template: template
        }).then(function() {
            $log.context('Popup.showWithError').error(errormessage, error);
        });
    }

    function showWithLog(title, template, message) {
        TimeoutService.cancelAllTimeouts();
        try{
            cordova.plugins.Keyboard.close();
        } catch (error) {
            $log.context('Popup.showWithLog').warn("Cordova is unavailable on this platform.");
        }
        $ionicLoading.hide();
        $ionicPopup.alert({
            title: title,
            template: template
        }).then(function() {
            $log.context('Popup.showWithLog').log(message);
        });
    }

    function timeoutPopup(template, message) {
        return TimeoutService.createTimeout('PopupService.timeoutPopup',
          function() {
              showWithError('Error Loading', template, message, '- backend error');
          }, 5000);
    }

    function cancelTimeoutPopup(promise) {
        TimeoutService.cancelTimeoutByRef(promise);
    }

    function withFunc(title, template, message, func) {
        TimeoutService.cancelAllTimeouts();
        try{
            cordova.plugins.Keyboard.close();
        } catch (error) {
            $log.context('Popup.showWithLog').warn("Cordova is unavailable on this platform.");
        }
        $ionicLoading.hide();
        $ionicPopup.confirm({
            okText: 'Continue',
            cancelText: 'Cancel',
            title: title,
            template: template
        }).then(function(cont) {
            if (cont) {
                func();
            }
            $log.context('Popup.withFunc').log(message);
        });
    }

    return factory;
}
