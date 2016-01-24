/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-route.d.ts" />
/// <reference path="../../typings/angular-material/angular-material.d.ts" />

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
  title: string;
  menus: Menu[];
  isNavBarOpen: Function;
  toggleNavBar: Function;
}

class UiCtrl {
  constructor(private $scope: IMainScope, private $mdSidenav: ng.material.ISidenavService, private $rootScope: ng.IRootScopeService) {
    $scope.menus = [
      new Menu("CPU Usage", "#/cpu"),
      new Menu("Memory Usage", "#/memory"),
      new Menu("About", "#/about")
    ];
    $scope.isNavBarOpen = function(): boolean {
      return $mdSidenav("left").isLockedOpen() || $mdSidenav("left").isOpen();
    };
    $scope.toggleNavBar = function(): void {
      $mdSidenav("left").toggle();
    };
    $rootScope.$on("$routeChangeSuccess", function (event: ng.IAngularEvent, current: any, previous: any): void {
        $scope.title = current.$$route.name;
    });
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
        name: "CPU Usage",
        resolve: {
          $cpuNumber: ($http: ng.IHttpService): ng.IPromise<number> => $http
              .get("/api/cpuNumber")
              .then((response: ng.IHttpPromiseCallbackArg<Number>) => response.data)
        }
      })
      .when("/memory", {
        templateUrl: "views/memory.html",
        controller: "MemoryCtrl",
        name: "Memory Usage"
      })
      .when("/about", {
        templateUrl: "views/about.html",
        controller: "AboutCtrl",
        name: "About Go-top"
      })
      .otherwise({
        redirectTo: "/cpu"
      });
  }).service("$socket", (socketFactory: any) => {
    return socketFactory();
  }).controller("uiCtrl", ["$scope", "$mdSidenav", "$rootScope", UiCtrl]);
