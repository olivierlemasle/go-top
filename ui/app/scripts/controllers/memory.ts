/// <reference path="../app.ts" />
/// <reference path="../../../typings/socket.io-client/socket.io-client.d.ts" />
/// <reference path="../../../typings/moment/moment.d.ts" />
/// <reference path="../../../typings/d3/d3.d.ts" />

"use strict";

module uiApp {
  "use strict";

  export interface IMemoryScope extends ng.IScope {
    used: string;
  }

  export class MemoryCtrl {

    createByteString(kb: number): string {
      if (kb < 1024) {
        return kb + " KB";
      }
      let mb: number = Math.round(kb / 1.024) / 1000;
      if (mb < 1024) {
        return mb + " MB";
      }
      let gb: number = Math.round(mb / 1.024) / 1000;
      return gb + " GB";
    }

    constructor(private $scope: IMemoryScope, private $http: ng.IHttpService) {
      $http.get("/api/usedmem").success((data: number) => {
        $scope.used = this.createByteString(data);
      });
    }
  }
}

angular.module("uiApp")
  .controller("MemoryCtrl", ["$scope", "$http", uiApp.MemoryCtrl]);
