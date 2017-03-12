/// <reference path="../app.ts" />
/// <reference path="../../../typings/index.d.ts" />

"use strict";

module uiApp {
  "use strict";

  export class Release {
    url: string;
    tag: string;
    time: string;
  }

  export interface IAboutScope extends ng.IScope {
    website: string;
    version: string;
    latest: Release;
    readme: string;
    hasReadme: boolean;
    toggleInfo: Function;
  }

  export class AboutCtrl {
    private static repo: string = "olivierlemasle/go-top";

    constructor(private $scope: IAboutScope, private $http: ng.IHttpService, private $sanitize: ng.sanitize.ISanitizeService) {
      $scope.website = "https://github.com/" + AboutCtrl.repo;
      $scope.hasReadme = false;

      // get go-top version using API
      $http.get("/api/version").success((data: string) => {
        $scope.version = data;
      });

      // get go-top latest release using GitHub API
      $http.jsonp("https://api.github.com/repos/" + AboutCtrl.repo + "/releases/latest?callback=JSON_CALLBACK")
           .success((resp: any) => {
             let releaseTime: string = moment(resp.data.published_at).fromNow();
             $scope.latest = {url: resp.data.html_url, tag: resp.data.tag_name, time: releaseTime};
           });

      // display go-top README using GitHub API
      $scope.toggleInfo = function(): void {
        if ($scope.hasReadme) {
          $scope.hasReadme = false;
        } else {
          $http.get("https://api.github.com/repos/" + AboutCtrl.repo + "/readme", {
            headers: {"Accept": "application/vnd.github.VERSION.html"}
          }).success((resp: string) => {
            $scope.hasReadme = true;
            $scope.readme = $sanitize(resp);
          });
        }
      };
    }
  }
}


angular.module("uiApp")
  .controller("AboutCtrl", ["$scope", "$http", "$sanitize", uiApp.AboutCtrl]);
