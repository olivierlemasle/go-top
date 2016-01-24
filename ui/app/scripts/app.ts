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
  "ngSanitize",
  "ngAnimate",
  "ngMaterial",
  "btford.socket-io",
  "ng.epoch"
])
  .config(($routeProvider: ng.route.IRouteProvider) => {
    $routeProvider
      .when("/cpu", {
        templateUrl: "views/cpu.html",
        controller: "CpuCtrl",
        resolve: {
          $cpuNumber: ($http: ng.IHttpService): ng.IPromise<number> => $http
              .get("/api/cpuNumber")
              .then((response: ng.IHttpPromiseCallbackArg<Number>) => response.data)
        }
      })
      .when("/memory", {
        templateUrl: "views/memory.html",
        controller: "MemoryCtrl",
      })
      .when("/about", {
        templateUrl: "views/about.html",
        controller: "AboutCtrl",
      })
      .otherwise({
        redirectTo: "/cpu"
      });
  }).service("$socket", (socketFactory: any) => {
    return socketFactory();
  }).controller("uiCtrl", ["$scope", UiCtrl]);
