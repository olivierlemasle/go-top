/// <reference path="../app.ts" />

"use strict";

module uiApp {
  "use strict";

  export interface IAboutScope extends ng.IScope {
    version: string;
  }

  export class AboutCtrl {

    constructor(private $scope: IAboutScope, private $http: ng.IHttpService) {
      $http.get("/api/version").success((data: string) => {
        $scope.version = data;
      });
    }
  }
}


angular.module("uiApp")
  .controller("AboutCtrl", ["$scope", "$http", uiApp.AboutCtrl]);
