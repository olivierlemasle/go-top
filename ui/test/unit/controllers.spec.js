'use strict';

describe('App ontrollers', function() {

  describe('AboutCtrl', function(){
    var scope, httpBackend, ctrl;

    beforeEach(module('uiApp'));

    beforeEach(inject(function ($controller, $httpBackend, $http) {
      scope = {};
      httpBackend = $httpBackend;
      httpBackend.whenJSONP(/https:\/\/api\.github\.com\/*/).respond(function(method, url, data, headers, params) {
        return '';
      });
      ctrl = $controller('AboutCtrl', {$scope: scope, $http: $http});
    }));

    it('should display the go-top version', function () {
      var version = '0.0.3';
      httpBackend.when('GET', '/api/version').respond(version);
      httpBackend.flush();
      expect(scope.version).toBe(version);
    });

  });
});
