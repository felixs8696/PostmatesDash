angular
.module('dash.categories')
.controller('CategoriesCtrl', CategoriesCtrl);

CategoriesCtrl.$inject = ["$scope", "$state", "$stateParams", "CategoriesModel", "$log"];

function CategoriesCtrl($scope, $state, $stateParams, CategoriesModel, $log) {
  var vm = this;

  $scope.state = $state;
  vm.categories = [];
  vm.loadCategories = loadCategories;
  vm.addCategoryToFirebase = addCategoryToFirebase;
  vm.addCategory = addCategory;
  vm.getCategoryPicture = getCategoryPicture;
  //vm.remove_item = remove_item;
  //vm.cancelOrder = cancelOrder;
  //vm.returnOrder = returnOrder;
  //vm.purchase = purchase;
  //vm.item_fee = $stateParams.fee;
  //vm.item_id = $stateParams.id;
  //vm.delivery_time = $stateParams.dtime;
  //vm.status = $stateParams.status;
  //vm.courier_img = $stateParams.cimage;
  //vm.courier_name = $stateParams.cname;
  //vm.courier_phone = $stateParams.cphone;

  function addCategory() {
    $state.go('app.add_category');
  }

  function addCategoryToFirebase(input) {
    getCategoryPicture(input.name, input)
      .then(function (imageURL) {
        input.image = imageURL;
        CategoriesModel.pushCategoryToFirebase(input);
        loadCategories()
          .then(function () {
            // TODO: make this a modal
            $state.go("app.categories", {}, {reload: true});
          });
      });
  }

  function loadCategories() {
    return CategoriesModel.getCategoriesFromFirebase()
      .then(function (categories) {
        categories.forEach(function(category) {
          if('image' in category.val()) {
            vm.categories.push({id: category.key(), name: category.val()['name'], src: category.val()['image']});
          } else {
            vm.categories.push({id: category.key(), name: category.val()['name'], src: "http://placehold.it/50x50"});
          }
        });
      });
  }


  //function quote(item_id) {
  //  CategoriesModel.requestQuote(item_id)
  //    .then(function (data) {
  //      $state.go("app.purchase_item", {id: item_id, fee: data.fee, dtime: data.duration}, {reload: true});
  //    }, function(err) {
  //      console.log(err);
  //    });
  //}

  //function purchase(item_id) {
  //  CategoriesModel.makePurchase(item_id)
  //    .then(function(data) {
  //      console.log(data);
  //      var t = setInterval(function() {
  //        if(data.complete == true) {
  //          clearInterval(t);
  //          $state.go("app.categories", {}, {reload: true});
  //        } else {
  //          $state.go("app.categories", {}, {reload: true});
  //        }
  //        CategoriesModel.getDelivery(data.id).then(function(data2) {
  //          data = data2;
  //        }, function(error) {
  //          console.log(error);
  //        });
  //        console.log(data);
  //        if (data.courier !== null) {
  //          $state.go("app.purchased", {id: data.id, fee: data.fee, status: data.status, dtime: data.dropoff_eta, cname: data.courier.name, cphone: data.courier.phone, cimage: data.courier.img_href}, {reload: true});
  //        } else {
  //          $state.go("app.purchased", {id: data.id, fee: data.fee, status: data.status, dtime: data.dropoff_eta}, {reload: true});
  //        }
  //      }, 1000);
  //    }, function(error) {
  //      console.log(error);
  //    });
  //}

  //function remove_item(item_id) {
  //  CategoriesModel.removeItemFromFirebase(item_id)
  //    .then(function() {
  //      console.log("Item " + item_id + ' removed');
  //      $state.go("app.categories", {}, {reload: true});
  //    }, function(error) {
  //      console.log(error);
  //    });
  //}

  //function cancelOrder(item_id) {
  //  CategoriesModel.cancelDelivery(item_id)
  //    .then(function() {
  //      console.log("Item " + item_id + ' cancelled');
  //      $state.go("app.categories", {}, {reload: true});
  //    }, function(error) {
  //      console.log(error);
  //    });
  //}

  //function returnOrder(item_id) {
  //  CategoriesModel.returnDelivery(item_id)
  //    .then(function() {
  //      console.log("Item " + item_id + ' returned');
  //      $state.go("app.categories", {}, {reload: true});
  //    }, function(error) {
  //      console.log(error);
  //    });
  //}

  function getCategoryPicture(categoryName, categoryObject) {
    if (!categoryObject.src) {
      var searchCategoryName = categoryName.replace(/\s+/g, '+').toLowerCase();
      return CategoriesModel.googleSearchCategoryImage(searchCategoryName);
    } else {
      $log.context('ItemsModel.getItemPicture()').debug('item picture url already defined');
    }
  }
}
