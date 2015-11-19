angular
  .module('dash.categories')
  .factory('CategoriesModel', CategoriesModel);

CategoriesModel.$inject = ["$http", "$log", "FirebaseRoot", "$q", "Popup", "UserStorage"];

function CategoriesModel($http, $log, FirebaseRoot, $q, Popup, UserStorage) {
  var factory = {
    pushCategoryToFirebase: pushCategoryToFirebase,
    getCategoriesFromFirebase: getCategoriesFromFirebase,
    googleSearchCategoryImage: googleSearchCategoryImage,
    requestQuote: requestQuote
    //removeItemFromFirebase: removeItemFromFirebase,
    //makePurchase: makePurchase,
    //getDelivery: getDelivery,
    //returnDelivery: returnDelivery,
    //cancelDelivery: cancelDelivery
  };

  function pushCategoryToFirebase(categoryObj) {
    FirebaseRoot.child("users").child(UserStorage.getUser().id).child("categories").push(categoryObj);
  }

  //function removeItemFromFirebase(item_id) {
  //  return $q(function (resolve, reject) {
  //    FirebaseRoot.child("users").child(FirebaseRoot.getAuth().uid).child("items").child(item_id).remove(function(error) {
  //      if (error) {
  //        reject(error);
  //      } else {
  //        resolve();
  //      }
  //    });
  //  });
  //}

  function getCategoriesFromFirebase() {
    return $q(function (resolve, reject) {
      FirebaseRoot.child("users").child(FirebaseRoot.getAuth().uid).child("categories").once('value', function(snapshot) {
        $log.context("CategoriesModel.getItemsFromFirebase()").log(snapshot.val());
        resolve(snapshot);
      }, function(err) {
        $log.context("CategoriesModel.getItemsFromFirebase()").error(err);
        reject(err);
      });
    });
  }

  function requestQuote(item_id) {
    $http.defaults.headers.common['Authorization'] = 'Basic ZTgwNzYyOTctM2NlZi00YzkwLWE3YTMtNGNhZTBkY2I5ZjI2Og==:';
    return $q(function (resolve, reject) {
      FirebaseRoot.child("users").child(FirebaseRoot.getAuth().uid).once('value', function(snapshot) {
        var dropoff_address = snapshot.val().address;
        var pickup_address = snapshot.val().items[item_id].pickup_address;
        $http({
          method: "POST",
          url: "/v1/customers/cus_KWX4ykBZhhjJYk/delivery_quotes",
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: 'pickup_address=' + pickup_address + '&dropoff_address=' + dropoff_address
        }).then(function success(res) {
          resolve(res.data);
        }, function error(res) {
          console.log(res);
          Popup.showWithError("Error " + res.data.code, res.data.message, res);
          reject(res.data);
        });
      }, function(err) {
        $log.context("CategoriesModel.getItemsFromFirebase()").error(err);
        reject(err);
      });
    });
  }

  //function makePurchase(item_id) {
  //  $http.defaults.headers.common['Authorization'] = 'Basic ZTgwNzYyOTctM2NlZi00YzkwLWE3YTMtNGNhZTBkY2I5ZjI2Og==:';
  //  return $q(function (resolve, reject) {
  //    FirebaseRoot.child("users").child(FirebaseRoot.getAuth().uid).once('value', function(snapshot) {
  //      console.log(snapshot.val().items);
  //      var manifest = snapshot.val().items[item_id].description;
  //      var manifest_reference = snapshot.val().items[item_id].optional_description;
  //      var pickup_name = snapshot.val().items[item_id].pickup_name;
  //      var pickup_address = snapshot.val().items[item_id].pickup_address;
  //      var pickup_phone_number = snapshot.val().items[item_id].pickup_phone;
  //      var pickup_business_name = snapshot.val().items[item_id].pickup_business_name;
  //      var pickup_notes = snapshot.val().items[item_id].pickup_notes;
  //      var dropoff_name = snapshot.val().name;
  //      var dropoff_address = snapshot.val().address;
  //      var dropoff_phone_number = snapshot.val().phone;
  //      var dropoff_business_name = snapshot.val().business_name;
  //      var dropoff_notes = snapshot.val().note;
  //      var xdata = 'manifest=' + manifest + '&manifest_reference=' + manifest_reference + '&pickup_name=' + pickup_name + '&pickup_address=' + pickup_address + '&pickup_phone_number=' + pickup_phone_number + '&pickup_business_name=' + pickup_business_name + '&pickup_notes=' + pickup_notes + '&dropoff_name=' + dropoff_name + '&dropoff_address=' + dropoff_address + '&dropoff_phone_number=' + dropoff_phone_number + '&business_name=' + dropoff_business_name + '&dropoff_notes=' + dropoff_notes;
  //      $http({
  //        method: "POST",
  //        url: "/v1/customers/cus_KWX4ykBZhhjJYk/deliveries",
  //        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  //        data: xdata
  //      }).then(function success(res) {
  //        resolve(res.data);
  //      }, function error(res) {
  //        console.log(res);
  //        Popup.showWithError("Error " + res.data.code, res.data.message, res);
  //        reject(res.data);
  //      });
  //    }, function(err) {
  //      $log.context("CategoriesModel.getItemsFromFirebase()").error(err);
  //      reject(err);
  //    });
  //  });
  //}

  //function getDelivery(item_id) {
  //  $http.defaults.headers.common['Authorization'] = 'Basic ZTgwNzYyOTctM2NlZi00YzkwLWE3YTMtNGNhZTBkY2I5ZjI2Og==:';
  //  return $q(function (resolve, reject) {
  //    $http({
  //      method: "GET",
  //      url: "/v1/customers/cus_KWX4ykBZhhjJYk/deliveries/" + item_id,
  //    })
  //    .then(function success(res) {
  //      resolve(res.data);
  //    }, function error(res) {
  //      console.log(res);
  //      Popup.showWithError("Error " + res.data.code, res.data.message, res);
  //      reject(res.data);
  //    });
  //  });
  //}

  //function cancelDelivery(item_id) {
  //  $http.defaults.headers.common['Authorization'] = 'Basic ZTgwNzYyOTctM2NlZi00YzkwLWE3YTMtNGNhZTBkY2I5ZjI2Og==:';
  //  return $q(function (resolve, reject) {
  //    $http({
  //      method: "POST",
  //      url: "/v1/customers/cus_KWX4ykBZhhjJYk/deliveries/" + item_id + "/cancel",
  //    })
  //    .then(function success(res) {
  //      resolve(res.data);
  //    }, function error(res) {
  //      console.log(res);
  //      Popup.showWithError("Error " + res.data.code, res.data.message, res);
  //      reject(res.data);
  //    });
  //  });
  //}

  //function returnDelivery(item_id) {
  //  $http.defaults.headers.common['Authorization'] = 'Basic ZTgwNzYyOTctM2NlZi00YzkwLWE3YTMtNGNhZTBkY2I5ZjI2Og==:';
  //  return $q(function (resolve, reject) {
  //    $http({
  //      method: "POST",
  //      url: "/v1/customers/cus_KWX4ykBZhhjJYk/deliveries/" + item_id + "/return",
  //    })
  //    .then(function success(res) {
  //      resolve(res.data);
  //    }, function error(res) {
  //      console.log(res);
  //      Popup.showWithError("Error " + res.data.code, res.data.message, res);
  //      reject(res.data);
  //    });
  //  });
  //}
  function googleSearchCategoryImage(categoryName) {
    return $http({
      method: 'GET',
      url: 'https://www.googleapis.com/customsearch/v1?key=AIzaSyCmOmS0RNGakVeA3fa-3XPMc-U41BpsNNc&cx=009746443321135300122:kmew9iwfork&searchType=image&q=' + categoryName
    }).then(function successCallback(response) {
      //var item = response.data.items[0];
      //var result = item.image.thumbnailLink;
      var item = null;
      var result = null;
      for (var i = 0; i < response.data.items.length; i ++) {
        item = response.data.items[i];
        if (item.image.byteSize > 100000) {
          result = item.image.thumbnailLink;
          break;
        }
      }
      $log.context('CategoriesModel.googleSearchCategoryImage').log("thumbnail link: ", result);
      return result;
    }, function errorCallback(err) {
      $log.context('CategoriesModel.googleSearchCategoryImage').error(err);
    });
  }

  return factory;
}
