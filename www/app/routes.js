angular
  .module('dash')
  .config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'app/menu/menu.html',
      controller: 'MenuCtrl as vm'
    })
    .state('app.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'app/auth/login.html',
          controller: 'LoginCtrl as vm'
        }
      },
      data: {
        userRestricted: false
      }
    })
    .state('app.register', {
      url: '/register',
      views: {
        'menuContent': {
          templateUrl: 'app/register/register.html',
          controller: 'RegisterCtrl as vm'
        }
      },
      data: {
        userRestricted: false
      }
    })
    .state('app.account', {
      url: '/account',
      views: {
        'menuContent': {
          templateUrl: 'app/account/account.html',
          controller: 'AccountCtrl as vm'
        }
      },
      data: {
        userRestricted: true
      },
      cache: false
    })
    .state('app.categories', {
      url: '/categories',
      views: {
        'menuContent': {
          templateUrl: 'app/categories/categories.html',
          controller: 'CategoriesCtrl as vm'
        }
      },
      data: {
        userRestricted: true
      },
      cache: false
    })
    .state('app.items', {
      url: '/categories/:category',
      views: {
        'menuContent': {
          templateUrl: 'app/categories/items/items.html',
          controller: 'ItemsCtrl as vm'
        }
      },
      data: {
        userRestricted: true
      },
      cache: false
    })
    .state('app.add_category', {
      url: '/categories/add_category',
      views: {
        'menuContent': {
          templateUrl: 'app/categories/add_category.html',
          controller: 'CategoriesCtrl as vm'
        }
      },
      data: {
        userRestricted: true
      }
    })
    .state('app.purchase_item', {
      url: '/categories/purchase_item?category&id&fee&dtime',
      params: {
        fee: null
      },
      views: {
        'menuContent': {
          templateUrl: 'app/categories/purchase_item.html',
          controller: 'ItemsCtrl as vm'
        }
      },
      data: {
        userRestricted: true
      }
    })
    .state('app.add_item', {
      url: '/categories/:category',
      views: {
        'menuContent': {
          templateUrl: 'app/categories/items/add_item.html',
          controller: 'ItemsCtrl as vm'
        }
      },
      data: {
        userRestricted: true
      }
    })
    .state('app.purchased', {
      url: '/categories/purchased_item?item_id&id&fee&status&dtime&cname&cphone&cimage',
      params: {
        fee: null
      },
      views: {
        'menuContent': {
          templateUrl: 'app/categories/item_progress.html',
          controller: 'ItemsCtrl as vm'
        }
      },
      data: {
        userRestricted: true
      }
    });
  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/app/playlists');
});
