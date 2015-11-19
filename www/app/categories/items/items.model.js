angular
  .module('dash.categories')
  .factory('ItemsModel', ItemsModel);

ItemsModel.$inject = ["$http", "$log", "FirebaseRoot", "$q", "UserStorage", "Popup"];

function ItemsModel($http, $log, FirebaseRoot, $q, UserStorage, Popup) {
  var factory = {
    googleSearchSquareImage: googleSearchSquareImage,
    pushItemToFirebase: pushItemToFirebase,
    getItemsFromFirebase: getItemsFromFirebase,
    //requestQuote: requestQuote,
    //makePurchase: makePurchase,
    removeItemFromFirebase: removeItemFromFirebase,
    checkIfItemPurchased: checkIfItemPurchased,
    setItemAsPickedUp: setItemAsPickedUp
    //cancelDelivery: cancelDelivery,
    //returnDelivery: returnDelivery,
    //getDelivery: getDelivery
  };

  function googleSearchSquareImage(itemDesc) {
    return $http({
      method: 'GET',
      url: 'https://www.googleapis.com/customsearch/v1?key=AIzaSyCmOmS0RNGakVeA3fa-3XPMc-U41BpsNNc&cx=009746443321135300122:kmew9iwfork&searchType=image&q=' + itemDesc
    }).then(function successCallback(response) {
      console.log("RESPONSE: ", response);
      var item = response.data.items[0];
      $log.context('ItemsModel.getItemPicture').log("thumbnail link: ", item.image.thumbnailLink);
      return item.image.thumbnailLink;
    }, function errorCallback(err) {
      $log.context('ItemsModel.getItemPicture').error(err);
    });
  }

  function pushItemToFirebase(item, categoryId) {
    console.log(categoryId);
    FirebaseRoot.child("users").child(UserStorage.getUser().id).child('categories').child(categoryId).child('items').push(item);
  }

  function getItemsFromFirebase(categoryId) {
    return $q(function (resolve, reject) {
      FirebaseRoot.child("users").child(UserStorage.getUser().id).child("categories").child(categoryId).child('items').once('value', function(snapshot) {
        $log.context("ItemsModel.getItemsFromFirebase()").log(snapshot.val());
        resolve(snapshot);
      }, function(err) {
        $log.context("ItemsModel.getItemsFromFirebase()").error(err);
        reject(err);
      });
    });
  }

  function removeItemFromFirebase(item_id) {
    return $q(function (resolve, reject) {
      FirebaseRoot.child("users").child(FirebaseRoot.getAuth().uid).child("items").child(item_id).remove(function(error) {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  function checkIfItemPurchased(category, item_id) {
    return $q(function(resolve, reject) {
      FirebaseRoot.child("users").child(UserStorage.getUser().id).child('categories').child(category).child('items').child(item_id).child('purchased')
        .once('value', function(snapshot) {
          resolve(snapshot.val());
        }, function(err) {
          $log.context("ItemsModel.checkIfItemPurchased()").error(err);
          reject(err);
        })
      })
    }

  function setItemAsPickedUp(category, item_id) {
    FirebaseRoot.child("users").child(UserStorage.getUser().id).child('categories').child(category).child('items').child(item_id).child('purchased').child('pickedUp').set(true);
  }

  return factory;
}
