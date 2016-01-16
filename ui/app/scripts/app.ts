/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-route.d.ts" />

"use strict";

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
  constructor(private $scope: IMainScope) {
    $scope.menus = [
      new Menu("CPU Usage", "#/cpu"),
      new Menu("Memory Usage", "#/memory"),
      new Menu("About", "#/about")
    ];
  }
}

angular.module("uiApp", [
  "ngRoute",
  "ngMaterial",
  "btford.socket-io",
  "ng.epoch"
])
  .config(($routeProvider: ng.route.IRouteProvider) => {
    $routeProvider
      .when("/cpu", {
        templateUrl: "views/cpu.html",
        controller: "CpuCtrl",
        controllerAs: "cpu"
      })
      .when("/memory", {
        templateUrl: "views/memory.html",
        controller: "MemoryCtrl",
        controllerAs: "memory"
      })
      .when("/about", {
        templateUrl: "views/about.html",
        controller: "AboutCtrl",
        controllerAs: "about"
      })
      .otherwise({
        redirectTo: "/cpu"
      });
  })
  .factory("$socket", function(socketFactory: any): any {
    return socketFactory();
  }).controller("uiCtrl", ["$scope", UiCtrl]);
