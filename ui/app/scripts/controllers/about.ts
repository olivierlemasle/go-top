/// <reference path="../app.ts" />

'use strict';

module uiApp {
  export interface IAboutScope extends ng.IScope {
  }

  export class AboutCtrl {

    constructor (private $scope: IAboutScope) {
    }
  }
}


angular.module('uiApp')
  .controller('AboutCtrl', uiApp.AboutCtrl);
