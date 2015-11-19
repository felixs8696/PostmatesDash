(function() {
  angular
    .module('dash.utils')
    .directive('squareGrid', squareGrid);

  squareGrid.$inject = [];

  function squareGrid() {
    return {
      restrict: 'AE',
      scope: {
        itemList: '='
      },
      templateUrl: "app/shared/utils/square-grid.html"
    }
  }
}());
