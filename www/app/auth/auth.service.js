angular
  .module('dash.auth')
  .factory('AuthService', AuthService);

AuthService.$inject = ["FirebaseRoot", "$log", "UserStorage", "$state", "$firebaseAuth"];

function AuthService(FirebaseRoot, $log, UserStorage, $state, $firebaseAuth){
  var factory = {
    authenticateUser: authenticateUser,
    createUser: createUser,
    getUserAuthStatus: getUserAuthStatus,
    setUserIdEmail: setUserIdEmail,
    saveUserDataInLocalStorage: saveUserDataInLocalStorage,
    userIsAuthenticated: userIsAuthenticated,
    unauthenticateUser: unauthenticateUser
  };

  var firebaseAuth = $firebaseAuth(FirebaseRoot);

  function authenticateUser(credentials) {
    return firebaseAuth.$authWithPassword({
      email    : credentials.email,
      password : credentials.password
    }).then(function(authData) {
      $log.context("LoginModel.authenticateUser()").debug("Authenticated successfully with payload:", authData);
      var userAuthData = setUserIdEmail(authData);
      saveUserDataInLocalStorage(userAuthData);
      return authData;
    }).catch(function(error) {
      $log.context("LoginModel.authenticateUser()").error("Login Failed!", error);
    });
  }

  function createUser(userInput) {
    var credentials = {
      email    : userInput.email,
      password : userInput.password
    };
    var userInfo = {
      address: userInput.address,
      business: userInput.business,
      cover: userInput.cover,
      email: userInput.email,
      name: userInput.name,
      phone: userInput.phone,
      profile: userInput.profile,
      username: userInput.username
    };
    return firebaseAuth.$createUser(
      credentials
    ).then(function(userData) {
      $log.context("LoginModel.userSignup()").debug("User created successfully with payload:", userData);
      return authenticateUser(credentials);
    }).then(function(authData) {
      logUserData(userInfo);
      console.log("Logged in as:", authData.uid);
    }).catch(function(error) {
      console.error("Error: ", error);
    });
  }

  function logUserData(userInfo) {
    var userId = UserStorage.getUser().id;
    var userData = {};
    for (var info in userInfo) {
      if (userInfo.hasOwnProperty(info) && userInfo[info]) {
        userData[info] = userInfo[info];
      }
    }
    FirebaseRoot.child('users').child(userId).set(userData);
    FirebaseRoot.child('usernames').child(userData.username).set(userId);
    return true;
  }

  function getUserAuthStatus(){
    var status = FirebaseRoot.getAuth();
    $log.context('AuthService.getCurrentAuthUser').debug("Auth status: ", status);
    return status;
  }

  function setUserIdEmail(authData) {
    if (authData) {
      return {
        id: authData.uid,
        email: authData.password.email
      };
    }
    return null;
  }

  function saveUserDataInLocalStorage(authData) {
    if (authData) {
      var userId = authData.id;
      var userRef = FirebaseRoot.child('users').child(userId);
      UserStorage.storeUserAuthData(authData);
      UserStorage.storeUserInfo(userRef);
    }
  }

  function userIsAuthenticated() {
    var userStatus = getUserAuthStatus();
    var userData = setUserIdEmail(userStatus);
    if (!userData) {
      UserStorage.removeUserDatafromLocalStorage();
    }
    return userData;
  }

  function unauthenticateUser() {
    UserStorage.removeUserDatafromLocalStorage();
    FirebaseRoot.unauth();
    $log.context('AuthService.unauthenticateUser()').log("User logged out");
    $state.go("app.login");
  }

  return factory;
}
