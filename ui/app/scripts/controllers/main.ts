/// <reference path="../app.ts" />

'use strict';

module uiApp {
    class CpuStatMessage {
      Time;
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

        constructor(private $scope: IMainScope, private $socket) {
          $scope.procs = [];
          $socket.on('cpuStatMessage', function(msg: CpuStatMessage){
            console.log(msg);
            $scope.procs = [];
            for (var n = 0; n<msg.CPULoad.length; n++) {
              var proc = {"id": n, "load": msg.CPULoad[n]};
              $scope.procs.push(proc);
            }
          })
        }
    }
}

angular.module('uiApp')
    .controller('MainCtrl', ['$scope', '$socket', uiApp.MainCtrl]);
