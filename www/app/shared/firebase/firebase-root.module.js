(function() {
  angular
    .module('dash.firebase-root', ['firebase'])
    .constant('FirebaseRoot', new Firebase('https://postmatesdash.firebaseio.com/'));
}());
