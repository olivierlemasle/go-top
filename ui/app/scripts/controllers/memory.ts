/// <reference path="../app.ts" />
/// <reference path="../shared.ts" />
/// <reference path="../../../typings/socket.io-client/socket.io-client.d.ts" />
/// <reference path="../../../typings/moment/moment.d.ts" />
/// <reference path="../../../typings/d3/d3.d.ts" />

"use strict";

module uiApp {
  "use strict";

  export interface IMemoryScope extends ng.IScope {
    used: string;
    percent: number;
    total: string;
    realtimeLine: Serie[];
    realtimeLineFeed: Point[];
  }

  class MemStatMessage {
    Time: string;
    UsedMemory: number;
    AvailableMemory: number;
  }

  export class MemoryCtrl {

    createByteString(kb: number): string {
      if (kb < 1024) {
        return kb + " KB";
      }
      let mb: number = Math.round(kb / 10.24) / 100;
      if (mb < 1024) {
        return mb + " MB";
      }
      let gb: number = Math.round(mb / 10.24) / 100;
      return gb + " GB";
    }

    constructor(private $scope: IMemoryScope, private $socket: SocketIOClient.Socket) {
      $socket.emit("statRequired", "mem");
      $scope.realtimeLine = [];
      $scope.realtimeLineFeed = [];
      let now: moment.Moment = moment();
      let point: Point = new Point(now, 0);
      $scope.realtimeLine = [{
        label: "Memory used",
        values: [point]
      }];
      $scope.realtimeLineFeed = [point];
      $socket.on("memStatMessage", (msg: MemStatMessage) => {
        $scope.used = this.createByteString(msg.UsedMemory);
        let total: number = msg.UsedMemory + msg.AvailableMemory;
        $scope.total = this.createByteString(total);
        let percentUse: number = Math.round(msg.UsedMemory / total * 100);
        $scope.percent = percentUse;
        $scope.realtimeLineFeed = [new Point(moment(msg.Time), percentUse)];
      });
    }
  }
}

angular.module("uiApp")
  .controller("MemoryCtrl", ["$scope", "$socket", uiApp.MemoryCtrl]);
