angular
  .module('dash.payment')
  .factory('PaymentModel', PaymentModel);

PaymentModel.$inject = ["$http", "$log", "FirebaseRoot", "$q", "UserStorage", "Popup"];

function PaymentModel($http, $log, FirebaseRoot, $q, UserStorage, Popup) {
  var factory = {
    //pushItemToFirebase: pushItemToFirebase,
    //getItemsFromFirebase: getItemsFromFirebase,
    requestQuote: requestQuote,
    makePurchase: makePurchase,
    //removeItemFromFirebase: removeItemFromFirebase,
    cancelDelivery: cancelDelivery,
    returnDelivery: returnDelivery,
    getDelivery: getDelivery
  };

  //function pushItemToFirebase(item, categoryId) {
  //  console.log(categoryId);
  //  FirebaseRoot.child("users").child(UserStorage.getUser().id).child('categories').child(categoryId).child('items').push(item);
  //}

  //function getItemsFromFirebase(categoryId) {
  //  return $q(function (resolve, reject) {
  //    FirebaseRoot.child("users").child(UserStorage.getUser().id).child("categories").child(categoryId).child('items').once('value', function(snapshot) {
  //      $log.context("ItemsModel.getItemsFromFirebase()").log(snapshot.val());
  //      resolve(snapshot);
  //    }, function(err) {
  //      $log.context("ItemsModel.getItemsFromFirebase()").error(err);
  //      reject(err);
  //    });
  //  });
  //}

  function requestQuote(pickup_address, dropoff_address) {
    $http.defaults.headers.common['Authorization'] = 'Basic ZTgwNzYyOTctM2NlZi00YzkwLWE3YTMtNGNhZTBkY2I5ZjI2Og==:';
    return $q(function (resolve, reject) {
      $http({
        method: "POST",
        url: "/v1/customers/cus_KWX4ykBZhhjJYk/delivery_quotes",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: 'pickup_address=' + pickup_address + '&dropoff_address=' + dropoff_address
      }).then(function success(res) {
        resolve(res.data);
      }, function error(res) {
        console.log(res);
        reject(res.data);
      })
    })}

  function makePurchase(item_id, category) {
    $http.defaults.headers.common['Authorization'] = 'Basic ZTgwNzYyOTctM2NlZi00YzkwLWE3YTMtNGNhZTBkY2I5ZjI2Og==:';
    console.log(category);
    return $q(function (resolve, reject) {
      FirebaseRoot.child("users").child(UserStorage.getUser().id).child('categories').child(category).once('value', function(snapshot) {
        console.log(snapshot.val());
        var manifest = snapshot.val().items[item_id].description;
        var manifest_reference = snapshot.val().items[item_id].optional_description;
        var pickup_name = snapshot.val().items[item_id].pickup_name;
        var pickup_address = snapshot.val().items[item_id].pickup_address;
        var pickup_phone_number = snapshot.val().items[item_id].pickup_phone;
        var pickup_business_name = snapshot.val().items[item_id].pickup_business_name;
        var pickup_notes = snapshot.val().items[item_id].pickup_notes;
        FirebaseRoot.child("users").child(UserStorage.getUser().id).once('value', function(snapshot) {
          var dropoff_name = snapshot.val().name;
          var dropoff_address = snapshot.val().address;
          var dropoff_phone_number = snapshot.val().phone;
          var dropoff_business_name = snapshot.val().business;
          var dropoff_notes = snapshot.val().note;
          console.log("ADDRESS: ", dropoff_address);
          console.log("PICKUP: ", pickup_address);
          var xdata = 'manifest=' + manifest + '&manifest_reference=' + manifest_reference + '&pickup_name=' + pickup_name + '&pickup_address=' + pickup_address + '&pickup_phone_number=' + pickup_phone_number + '&pickup_business_name=' + pickup_business_name + '&pickup_notes=' + pickup_notes + '&dropoff_name=' + dropoff_name + '&dropoff_address=' + dropoff_address + '&dropoff_phone_number=' + dropoff_phone_number + '&business_name=' + dropoff_business_name + '&dropoff_notes=' + dropoff_notes;
          $http({
            method: "POST",
            url: "/v1/customers/cus_KWX4ykBZhhjJYk/deliveries",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: xdata
          }).then(function success(res) {
            FirebaseRoot.child("users").child(UserStorage.getUser().id).child('categories').child(category).child('items').child(item_id).child('purchased').set(res.data);
            resolve(res.data);
          }, function error(res) {
            console.log(res);
            Popup.showWithError("Error " + res.data.code, res.data.message, res);
            reject(res.data);
          });
        });
      }, function(err) {
        $log.context("CategoriesModel.getItemsFromFirebase()").error(err);
        reject(err);
      });
    });
  }

  function getDelivery(item_id, category) {
    $http.defaults.headers.common['Authorization'] = 'Basic ZTgwNzYyOTctM2NlZi00YzkwLWE3YTMtNGNhZTBkY2I5ZjI2Og==:';
    return $q(function (resolve, reject) {
      $http({
        method: "GET",
        url: "/v1/customers/cus_KWX4ykBZhhjJYk/deliveries/" + item_id
      })
        .then(function success(res) {
          FirebaseRoot.child("users").child(UserStorage.getUser().id).child('categories').child(category).child('items').child(item_id).child('purchased').set(res.data);
          resolve(res.data);
        }, function error(res) {
          console.log(res);
          Popup.showWithError("Error " + res.data.code, res.data.message, res);
          reject(res.data);
        });
    });
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

  function cancelDelivery(item_id) {
    $http.defaults.headers.common['Authorization'] = 'Basic ZTgwNzYyOTctM2NlZi00YzkwLWE3YTMtNGNhZTBkY2I5ZjI2Og==:';
    return $q(function (resolve, reject) {
      $http({
        method: "POST",
        url: "/v1/customers/cus_KWX4ykBZhhjJYk/deliveries/" + item_id + "/cancel"
      })
        .then(function success(res) {
          resolve(res.data);
        }, function error(res) {
          console.log(res);
          Popup.showWithError("Error " + res.data.code, res.data.message, res);
          reject(res.data);
        });
    });
  }

  function returnDelivery(item_id) {
    $http.defaults.headers.common['Authorization'] = 'Basic ZTgwNzYyOTctM2NlZi00YzkwLWE3YTMtNGNhZTBkY2I5ZjI2Og==:';
    return $q(function (resolve, reject) {
      $http({
        method: "POST",
        url: "/v1/customers/cus_KWX4ykBZhhjJYk/deliveries/" + item_id + "/return",
      })
        .then(function success(res) {
          resolve(res.data);
        }, function error(res) {
          console.log(res);
          Popup.showWithError("Error " + res.data.code, res.data.message, res);
          reject(res.data);
        });
    });
  }

  return factory;
}
