(function () {
  angular
    .module('dash.firebase-refs')
    .factory('FirebaseRefs', FirebaseRefs);

  FirebaseRefs.$inject = ['FirebaseRoot', 'UserStorage'];

  function FirebaseRefs(FirebaseRoot, UserStorage) {
    var currentUserId = null;
    if (CurrentUser.getUser().id_email) {
      currentUserId = CurrentUser.User().id_email.id;
    }
  }
});
