angular
  .module('dash.account')
  .controller('AccountCtrl', AccountCtrl);

AccountCtrl.$inject = ["AccountModel", "Popup", "UserStorage"];

function AccountCtrl(AccountModel, Popup, UserStorage) {
  var vm = this;

  //Temporarily hard coded
  vm.user = UserStorage.getUser().name;
  vm.user_firstname = vm.user.substring(0,vm.user.indexOf(' '));
  //vm.pro_pic = '././img/blank_avatar.png';
  //vm.pro_background = '././img/blank_cover.jpg';
  vm.createAcctInfoObj = createAcctInfoObj;
  vm.acctInfoObj = {};
  vm.acctInfoObj[0] = {section: 'Username', info: 'username'};
  vm.acctInfoObj[1] = {section: 'Business Name', info: 'None'};
  vm.acctInfoObj[2] = {section: 'Email', info: 'email@domain.com'};
  vm.acctInfoObj[3] = {section: 'Phone Number', info: '(###) ###-####'};
  vm.acctInfoObj[4] = {section: 'Address', info: 'Full Address'};
  vm.acctInfoObj[5] = {section: 'Current Delivery Note', info: 'None'};
  vm.updateNote = updateNote;
  vm.setProPic = setProPic;
  vm.setCoverPhoto = setCoverPhoto;
  //vm.updateProPic = AccountModel.setProPic;
  //vm.updateCoverPhoto = AccountModel.setCoverPhoto;
  vm.updatePhotos = AccountModel.updatePhotosInFirebase;

  function createAcctInfoObj() {
    AccountModel.getUserInfoFromDatabase()
      .then(function (userInfoJSON) {
        vm.acctInfoObj[4].info = userInfoJSON.address;
        vm.acctInfoObj[2].info = userInfoJSON.email;
        vm.acctInfoObj[5].info = userInfoJSON.note;
        vm.acctInfoObj[3].info = userInfoJSON.phone;
        vm.acctInfoObj[1].info = userInfoJSON.business;
        vm.acctInfoObj[0].info = userInfoJSON.username;
      });
  }

  function updateNote(noteText) {
    AccountModel.setNote(noteText);
    Popup.showWithLog("Success", "Delivery note updated", "delivery note sent to firebase");
  }

  function setProPic() {
    AccountModel.getProPic()
      .then(function (proPicUrl) {
        vm.pro_pic = proPicUrl
      });
  }

  function setCoverPhoto() {
    AccountModel.getCoverPhoto()
      .then(function (proPicUrl) {
        vm.pro_background = proPicUrl
      });
  }

}
