/// <reference path="../app.ts" />
/// <reference path="../../../typings/socket.io-client/socket.io-client.d.ts" />
/// <reference path="../../../typings/moment/moment.d.ts" />
/// <reference path="../../../typings/d3/d3.d.ts" />

"use strict";

module uiApp {
  "use strict";

  export interface IMemoryScope extends ng.IScope {
  }

  export class MemoryCtrl {

    constructor(private $scope: IMemoryScope) {

    }
  }
}

angular.module("uiApp")
  .controller("MemoryCtrl", ["$scope", uiApp.MemoryCtrl]);
