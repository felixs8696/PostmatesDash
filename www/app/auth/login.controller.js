angular
  .module('dash.auth')
  .controller('LoginCtrl',LoginCtrl);

LoginCtrl.$inject = ["AuthService", "$state", "$ionicSideMenuDelegate"];

function LoginCtrl(AuthService, $state, $ionicSideMenuDelegate) {
  var vm = this;
  vm.userLogin = userLogin;

  $ionicSideMenuDelegate.canDragContent(false);

  function userLogin(input) {
    AuthService.authenticateUser(input)
      .then(function() {
        $state.go("app.categories");
      });
  }
}
