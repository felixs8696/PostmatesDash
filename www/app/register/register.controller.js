angular
  .module('dash.auth')
  .controller('RegisterCtrl',RegisterCtrl);

RegisterCtrl.$inject = ["AuthService", "$state", "$ionicSideMenuDelegate"];

function RegisterCtrl(AuthService, $state, $ionicSideMenuDelegate) {
  var vm = this;
  vm.registerUser = registerUser;

  $ionicSideMenuDelegate.canDragContent(false);

  function registerUser(input) {
    AuthService.createUser(input)
      .then(function() {
        $state.go("app.categories");
      });
  }
}
