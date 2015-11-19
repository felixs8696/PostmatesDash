(function() {
  angular
    .module('dash.utils')
    .factory('TimeoutService', TimeoutService);

  TimeoutService.$inject = ['$timeout'];

  function TimeoutService($timeout) {
    var timeouts = {};
    var factory = {
      createTimeout: createTimeout,
      cancelTimeoutByRef: cancelTimeoutByRef,
      cancelTimeoutByKey: cancelTimeoutByKey,
      cancelAllTimeouts: cancelAllTimeouts
    };
    return factory;

    function addTimeout(timeoutKey, timeoutVal) {
      timeouts[timeoutKey] = timeoutVal;
    }

    function createTimeout(timeoutKey, fn, delay, invokeApply, pass) {
      var timeoutVal = $timeout(fn, delay, invokeApply, pass);
      addTimeout(timeoutKey, timeoutVal);
      return timeoutVal;
    }

    function cancelTimeoutByRef(ref) {
      $timeout.cancel(ref);
    }

    function cancelTimeoutByKey(timeoutKey) {
      $timeout.cancel(timeouts[timeoutKey]);
    }

    function cancelAllTimeouts() {
      var timeoutDict = timeouts;
      for (var timeoutKey in timeoutDict) {
        if (timeoutDict.hasOwnProperty(timeoutKey)) {
          $timeout.cancel(timeoutDict[timeoutKey]);
        }
      }
    }
  }
}());
