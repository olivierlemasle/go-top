/// <reference path="../app.ts" />
/// <reference path="../../../typings/socket.io-client/socket.io-client.d.ts" />
/// <reference path="../../../typings/moment/moment.d.ts" />

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
  }

  export interface IMainScope extends ng.IScope {
    procs: Array<Proc>;
  }

  export class MainCtrl {

    constructor(private $scope: IMainScope, private $socket: SocketIOClient.Socket) {
      $scope.procs = [];
      $socket.on("cpuStatMessage", function(msg: CpuStatMessage): void {
        console.log(msg);
        $scope.procs = [];
        let time: string = moment(msg.Time).format("HH:mm:ss");
        console.log(time);
        for (let n: number = 0; n < msg.CPULoad.length; n++) {
          let proc: Proc = { "id": n, "load": msg.CPULoad[n] };
          $scope.procs.push(proc);
        }
      });
    }
  }
}

angular.module("uiApp")
  .controller("MainCtrl", ["$scope", "$socket", uiApp.MainCtrl]);
