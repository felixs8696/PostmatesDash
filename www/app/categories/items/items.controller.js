angular
  .module('dash.categories')
  .controller('ItemsCtrl', ItemsCtrl);

ItemsCtrl.$inject = ["$state", "ItemsModel", "$log", "$stateParams", "PaymentModel", "IntervalService"];

function ItemsCtrl($state, ItemsModel, $log, $stateParams, PaymentModel, IntervalService) {
  var vm = this;

  vm.images = [];
  vm.loadImages = loadImages;
  vm.addItemToFirebase = addItemToFirebase;
  vm.getItemPicture = getItemPicture;
  vm.getQuote = getQuote;
  vm.purchase = purchase;
  vm.remove_item = remove_item;
  vm.cancelOrder = cancelOrder;
  vm.returnOrder = returnOrder;
  vm.item_fee = $stateParams.fee;
  vm.item_id = $stateParams.id;
  vm.delivery_time = $stateParams.dtime;
  vm.status = $stateParams.status;
  vm.courier_img = $stateParams.cimage;
  vm.courier_name = $stateParams.cname;
  vm.courier_phone = $stateParams.cphone;
  vm.checkItemStatus = checkItemStatus;
  vm.backToItems = backToItems;
  vm.confirmOrder = confirmOrder;

  function add_item() {
    $state.go("app.add_item", {category: $stateParams.category});
  }

  function addItemToFirebase(input) {
    getItemPicture(input.description, input)
      .then(function (imageURL) {
        input.image = imageURL;
        ItemsModel.pushItemToFirebase(input, $stateParams.category);
        loadImages()
          .then(function () {
            $state.go("app.items", {}, {reload: true});
          });
      });
  }

  function loadImages() {
    return ItemsModel.getItemsFromFirebase($stateParams.category)
      .then(function (items) {
        items.forEach(function(item) {
          if('image' in item.val()) {
            vm.images.push({id: item.key(), name: item.val()['name'], action: checkOrder, src: item.val()['image']});
          } else {
            vm.images.push({id: item.key(), name: item.val()['name'], action: checkOrder, src: "http://placehold.it/50x50"});
          }
        });
        vm.images.push({id: 0, name: 'Add Item', action: add_item, src: "http://youthvoices.net/sites/default/files/image/27101/apr/16909.png"});
      })
  }

  function getQuote(item_id) {
    PaymentModel.requestQuote("20 McAllister St, San Francisco, CA", "101 Market St, San Francisco, CA")
      .then(function (data) {
        vm.item = data;
        vm.item_fee = data.fee;
        console.log(vm.item_fee);
        $state.go("app.purchase_item", {category: $stateParams.category, id: item_id, fee: data.fee}, {reload: true});
        vm.item_fee = 32134;
      }, function(err) {
        console.log(err);
      });
    console.log("hi" + item_id);
  }

  function getItemPicture(itemDesc, itemObject) {
    // Can add in brand name if have time
    if (!itemObject.src) {
      var searchItemName = itemDesc.replace(/\s+/g, '+').toLowerCase();
      return ItemsModel.googleSearchSquareImage(searchItemName, itemObject);
    } else {
      $log.context('ItemsModel.getItemPicture()').debug('item picture url already defined');
    }
    console.log(vm.images);
  }

  function purchase(item_id) {
    PaymentModel.makePurchase(item_id, $stateParams.category)
      .then(function(data) {
        console.log(data);
        $state.go("app.purchased", {item_id: item_id, id: data.id, fee: data.fee, status: data.status, dtime: data.dropoff_eta}, {reload: true});
        IntervalService.createInterval('purchaseInterval', function() {
          if(data.complete == true) {
            IntervalService.cancelIntervalByKey('purchaseInterval');
            $state.go("app.categories", {}, {reload: true});
          }
          //else {
          //  $state.go("app.categories", {}, {reload: true});
          //}
          PaymentModel.getDelivery(data.id, $stateParams.category).then(function(data2) {
            data = data2;
          }, function(error) {
            console.log(error);
          });
          console.log(data);
          if (data.courier !== null) {
            $state.go("app.purchased", {item_id: item_id, id: data.id, fee: data.fee, status: data.status, dtime: data.dropoff_eta, cname: data.courier.name, cphone: data.courier.phone, cimage: data.courier.img_href}, {reload: true});
          } else {
            $state.go("app.purchased", {item_id: item_id, id: data.id, fee: data.fee, status: data.status, dtime: data.dropoff_eta}, {reload: true});
          }
        }, 5000);
      }, function(error) {
        console.log(error);
      });
  }

  function checkItemStatus(data) {
    IntervalService.createInterval('checkStatus', function() {
      PaymentModel.getDelivery(data.id, $stateParams.category).then(function (data2) {
        data = data2;
        console.log(data);
        if(data.complete == true) {
          IntervalService.cancelIntervalByKey('checkStatus');
          $state.go("app.categories", {}, {reload: true});
        }
        if (data.courier) {
          $state.go("app.purchased", {
            item_id: $stateParams.id,
            id: data.id,
            fee: data.fee,
            status: data.status,
            dtime: data.dropoff_eta,
            cname: data.courier.name,
            cphone: data.courier.phone,
            cimage: data.courier.img_href
          }, {reload: true});
        } else {
          $state.go("app.purchased", {
            item_id: $stateParams.id,
            id: data.id,
            fee: data.fee,
            status: data.status,
            dtime: data.dropoff_eta
          }, {reload: true});
        }
      }, function (error) {
        console.log(error);
      });
    }, 5000);
  }

  function checkOrder(item_id) {
    ItemsModel.checkIfItemPurchased($stateParams.category, item_id)
      .then(function (purchaseVal) {
        console.log("ITEM PURCHASE? ", purchaseVal);
        if (!purchaseVal) {
          return getQuote(item_id);
        } else if (!purchaseVal.pickedUp) {
          if(purchaseVal.complete == true) {
            $state.go("app.categories", {}, {reload: true});
          }
          if (purchaseVal.courier) {
            $state.go("app.purchased", {
              item_id: $stateParams.id,
              id: purchaseVal.id,
              fee: purchaseVal.fee,
              status: purchaseVal.status,
              dtime: purchaseVal.dropoff_eta,
              cname: purchaseVal.courier.name,
              cphone: purchaseVal.courier.phone,
              cimage: purchaseVal.courier.img_href
            });
          } else {
            $state.go("app.purchased", {
              item_id: $stateParams.id,
              id: purchaseVal.id,
              fee: purchaseVal.fee,
              status: purchaseVal.status,
              dtime: purchaseVal.dropoff_eta
            });
          }
          //return checkItemStatus(purchaseVal);
        }
      });
  }

  function remove_item(item_id) {
    ItemsModel.removeItemFromFirebase(item_id)
      .then(function() {
        console.log("Item " + item_id + ' removed');
        $state.go("app.items", {category: $stateParams.category}, {reload: true});
      }, function(error) {
        console.log(error);
      });
  }

  function cancelOrder(item_id) {
    PaymentModel.cancelDelivery(item_id)
      .then(function() {
        console.log("Item " + item_id + ' cancelled');
        $state.go("app.categories", {}, {reload: true});
      }, function(error) {
        console.log(error);
      });
    IntervalService.cancelAllIntervals();
  }

  function returnOrder(item_id) {
    PaymentModel.returnDelivery(item_id)
      .then(function() {
        console.log("Item " + item_id + ' returned');
        $state.go("app.categories", {}, {reload: true});
      }, function(error) {
        console.log(error);
      });
    IntervalService.cancelAllIntervals();
  }

  function backToItems() {
    IntervalService.cancelAllIntervals();
    $state.go('app.categories');
  }

  function confirmOrder(item_id) {
    console.log(item_id);
    console.log($stateParams.category);
    ItemsModel.setItemAsPickedUp($stateParams.category, item_id);
    $state.reload();
  }
}
