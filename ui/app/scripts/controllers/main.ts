/// <reference path="../app.ts" />
/// <reference path="../../../typings/socket.io-client/socket.io-client.d.ts" />
/// <reference path="../../../typings/moment/moment.d.ts" />
/// <reference path="../../../typings/d3/d3.d.ts" />

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

  export interface IMainScope extends ng.IScope {
    procs: Array<Proc>;
    realtimeLine: Serie[];
    realtimeLineFeed: Point[];
  }

  export class Point {
    time: number;
    y: number;

    constructor(time: moment.Moment, y: number) {
      this.time = time.unix();
      this.y = y;
    }
  }

  export class Serie {
    label: string;
    values: Point[];
  }

  export class MainCtrl {

    constructor(private $scope: IMainScope, private $socket: SocketIOClient.Socket) {
      let colors: string[] = d3.scale.category10().range();
      $scope.procs = [];
      $scope.realtimeLine = [];
      $scope.realtimeLineFeed = [];
      let now: moment.Moment = moment();
      for (let i: number = 0; i < 8; i++) {
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
  .controller("MainCtrl", ["$scope", "$socket", uiApp.MainCtrl]);
