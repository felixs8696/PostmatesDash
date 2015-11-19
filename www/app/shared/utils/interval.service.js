(function() {
  angular
    .module('dash.utils')
    .factory('IntervalService', IntervalService);

  IntervalService.$inject = ['$interval'];

  function IntervalService($interval) {
    var intervals = {};
    var factory = {
      createInterval: createInterval,
      cancelIntervalByRef: cancelIntervalByRef,
      cancelIntervalByKey: cancelIntervalByKey,
      cancelAllIntervals: cancelAllIntervals
    };
    return factory;

    function addInterval(intervalKey, intervalVal) {
      intervals[intervalKey] = intervalVal;
    }

    function createInterval(intervalKey, fn, delay) {
      var intervalVal = setInterval(fn, delay);
      addInterval(intervalKey, intervalVal);
      return intervalVal;
    }

    function cancelIntervalByRef(ref) {
      clearInterval(ref);
    }

    function cancelIntervalByKey(intervalKey) {
      clearInterval(intervals[intervalKey]);
    }

    function cancelAllIntervals() {
      var intervalDict = intervals;
      for (var intervalKey in intervalDict) {
        if (intervalDict.hasOwnProperty(intervalKey)) {
          clearInterval(intervalDict[intervalKey]);
        }
      }
    }
  }
}());
