/// <reference path="../app.ts" />

'use strict';

module uiApp {
    export interface IMainScope extends ng.IScope {
    }

    export class MainCtrl {

        constructor(private $scope: IMainScope) {
        }
    }
}

angular.module('uiApp')
    .controller('MainCtrl', uiApp.MainCtrl);
