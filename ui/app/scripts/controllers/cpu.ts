/// <reference path="../app.ts" />
/// <reference path="../shared.ts" />
/// <reference path="../../../typings/index.d.ts" />

"use strict";

module uiApp {
  "use strict";

  class CpuStatMessage {
    Time: string;
    CPULoad: number[];
  }

  export class Proc {
    id: number;
    load: number;
    color: string;
  }

  export interface ICpuScope extends ng.IScope {
    procs: Array<Proc>;
    realtimeLine: Serie[];
    realtimeLineFeed: Point[];
  }

  export class CpuCtrl {

    constructor(private $scope: ICpuScope, private $socket: SocketIOClient.Socket, private $cpuNumber: number) {
      $socket.emit("statRequired", "cpu");
      let colors: string[] = d3.scale.category10().range();
      $scope.procs = [];
      $scope.realtimeLine = [];
      $scope.realtimeLineFeed = [];
      let now: moment.Moment = moment();
      for (let i: number = 0; i < $cpuNumber; i++) {
        let point: Point = new Point(now, 0);
        $scope.realtimeLine[i] = {
          label: "Core " + i,
          values: [point]
        };
        $scope.realtimeLineFeed[i] = point;
      }

      $socket.on("cpuStatMessage", function(msg: CpuStatMessage): void {
        $scope.procs = [];
        $scope.realtimeLineFeed = [];
        for (let n: number = 0; n < msg.CPULoad.length; n++) {
          let proc: Proc = { id: n, load: msg.CPULoad[n], color: colors[n] };
          $scope.procs.push(proc);
          $scope.realtimeLineFeed.push(new Point(moment(msg.Time), msg.CPULoad[n]));
        }
      });
    }
  }
}

angular.module("uiApp")
  .controller("CpuCtrl", ["$scope", "$socket", "$cpuNumber", uiApp.CpuCtrl]);
