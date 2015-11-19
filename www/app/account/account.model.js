angular
  .module('dash.account')
  .factory('AccountModel', AccountModel);

AccountModel.$inject = ["FirebaseRoot", "UserStorage", "$log", "$q", "$state"];

function AccountModel(FirebaseRoot, UserStorage, $log, $q, $state) {
  var factory = {
    getUserInfoFromDatabase: getUserInfoFromDatabase,
    setNote: setNote,
    getProPic: getProPic,
    getCoverPhoto: getCoverPhoto,
    updatePhotosInFirebase: updatePhotosInFirebase
  };

  function getUserInfoFromDatabase() {
    var userId = UserStorage.getUser().id;
    var currentUserRef = FirebaseRoot.child('users').child(userId);
    return $q(function(resolve, reject) {
      currentUserRef.once('value', function (dataSnapshot) {
        // code to handle new value
        resolve(dataSnapshot.val());
      }, function (err) {
        $log.context("AccountModel.getUserInfoFromDatabase()").error(err);
        reject(err);
      });
    });
  }

  function setNote(noteText) {
    var userId = UserStorage.getUser().id;
    FirebaseRoot.child('users').child(userId).child('note').set(noteText);
    return true;
  }

  function getProPic() {
    var userId = UserStorage.getUser().id;
    var proPicRef = FirebaseRoot.child('users').child(userId).child('profile');
    return $q(function (resolve, reject) {
      proPicRef.once('value', function (dataSnapshot) {
        resolve(dataSnapshot.val());
      }, function (err) {
        $log.context("AccountModel.getUserInfoFromDatabase()").error(err);
        reject(err);
      });
    })
  }

  function getCoverPhoto() {
    var userId = UserStorage.getUser().id;
    var coverRef = FirebaseRoot.child('users').child(userId).child('cover');
    return $q(function (resolve, reject) {
      coverRef.once('value', function (dataSnapshot) {
        resolve(dataSnapshot.val());
      }, function (err) {
        $log.context("AccountModel.getUserInfoFromDatabase()").error(err);
        reject(err);
      });
    })
  }

  function setProPic(profileUrl) {
    var userId = UserStorage.getUser().id;
    FirebaseRoot.child('users').child(userId).child('profile').set(profileUrl);
  }

  function setCoverPhoto(coverUrl) {
    var userId = UserStorage.getUser().id;
    FirebaseRoot.child('users').child(userId).child('cover').set(coverUrl);
  }

  function updatePhotosInFirebase(inputUpdates) {
    if (inputUpdates.profileUpdate) {
      setProPic(inputUpdates.profileUpdate)
    }
    if (inputUpdates.coverUpdate) {
      setCoverPhoto(inputUpdates.coverUpdate);
    }
    $state.reload();
  }

  return factory;
}
