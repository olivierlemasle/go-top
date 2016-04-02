'use strict';

describe('App ontrollers', function() {

  describe('AboutCtrl', function(){
    var scope, httpBackend, ctrl;

    beforeEach(module('uiApp'));

    beforeEach(inject(function ($controller, $httpBackend, $http) {
      scope = {};
      httpBackend = $httpBackend;

      // Default route
      $httpBackend.whenGET('views/cpu.html').respond('');
      $httpBackend.whenGET('/api/cpuNumber').respond('');

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

  describe('MemoryCtrl', function() {
    var scope, ctrl;

    beforeEach(module('uiApp'));

    beforeEach(inject(function($controller){
      scope = {};
      ctrl = $controller('MemoryCtrl', { $scope: scope });
    }));

    it('should convert kilobytes to the proper unit', function() {
      var kb = 64;
      expect(ctrl.createByteString(kb)).toBe('64 KB');

      kb = 2048;
      expect(ctrl.createByteString(kb)).toBe('2 MB');

      kb = 5 * 1024 * 1024;
      expect(ctrl.createByteString(kb)).toBe('5 GB');

      kb = 525.4526845 * 1024;
      expect(ctrl.createByteString(kb)).toBe('525.45 MB');

      kb = 13.426 * 1024 * 1024;
      expect(ctrl.createByteString(kb)).toBe('13.43 GB');
    });

  });
});
