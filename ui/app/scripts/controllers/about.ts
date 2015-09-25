/// <reference path="../app.ts" />

"use strict";

module uiApp {
  "use strict";

  export interface IAboutScope extends ng.IScope {
  }

  export class AboutCtrl {

    constructor(private $scope: IAboutScope) {
    }
  }
}


angular.module("uiApp")
  .controller("AboutCtrl", ["$scope", uiApp.AboutCtrl]);
