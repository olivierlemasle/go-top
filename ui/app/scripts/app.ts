/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-route.d.ts" />

'use strict';

class Menu {
  title: string;
  link: string;

  constructor(title: string, link: string) {
    this.title = title;
    this.link = link;
  }
}

interface IMainScope extends ng.IScope {
  menus: Menu[];
}

class UiCtrl {
  constructor (private $scope: IMainScope, private $socket) {
    $scope.menus = [
      new Menu('About', '#/about'),
      new Menu('Help', '#/help')
    ]
    $socket.on('testMessage', function(msg){
      console.log(msg);
    });
  }
}

angular.module('uiApp', [
    'ngRoute',
    'ngMaterial',
    'btford.socket-io'
  ])
  .config(($routeProvider:ng.route.IRouteProvider) => {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .factory('$socket', function (socketFactory) {
    return socketFactory();
  }).controller("uiCtrl", ['$scope', '$socket', UiCtrl]);
