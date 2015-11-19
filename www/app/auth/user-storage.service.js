(function() {
  angular
    .module('dash.auth')
    .factory('UserStorage', UserStorage);

  UserStorage.$inject = [];

  function UserStorage() {
    var factory = {
      getUser: getUser,
      storeUserAuthData: storeUserAuthData,
      storeUserInfo: storeUserInfo,
      removeUserDatafromLocalStorage: removeUserDatafromLocalStorage
    };

    function storeUserAuthData(userObject) {
      localStorage.setItem('UserData', JSON.stringify(userObject));
    }

    function storeUserInfo(userRef) {
      userRef.child('username').once('value', function(snapshot) {
        localStorage.setItem('UserName', JSON.stringify(snapshot.val()));
      });
      userRef.child('name').once('value', function(snapshot) {
        localStorage.setItem('UserFullName', JSON.stringify(snapshot.val()));
      });
    }

    function getUser() {
      var userData = JSON.parse(localStorage.getItem('UserData'));
      if (userData) {
        var user = {
          id: JSON.parse(localStorage.getItem('UserData')).id,
          email: JSON.parse(localStorage.getItem('UserData')).email,
          username: JSON.parse(localStorage.getItem('UserName')),
          name: JSON.parse(localStorage.getItem('UserFullName'))
        };
        if (!user.id) {
          return null;
        }
        return user;
      }
      return null;
    }

    function removeUserDatafromLocalStorage() {
      localStorage.removeItem('UserData');
      localStorage.removeItem('UserName');
      localStorage.removeItem('UserFullName');
    }

    return factory;
  }
}());
