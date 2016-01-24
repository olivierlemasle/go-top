// Karma configuration
'use strict';

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-*/angular-*.js',
      'bower_components/angular-socket-io/socket.js',
      'bower_components/moment/moment.js',
      'bower_components/socket.io-client/socket.io.js',
      'bower_components/d3/d3.js',
      'bower_components/epoch/dist/js/epoch.js',
      'bower_components/ng-epoch/ng-epoch.js',
      '.tmp/scripts/**/*.js',
      'test/unit/*.spec.js'
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome',  'Firefox'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    sauceLabs: {
      testName: 'Karma'
    },
  });

  if (process.env.TRAVIS && process.env.SAUCE_USERNAME !== null && process.env.SAUCE_ACCESS_KEY !== null) {
    config.customLaunchers = {
      sauceLabsChrome: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Windows 7',
        version: '35'
      },
      sauceLabsFirefox: {
        base: 'SauceLabs',
        browserName: 'firefox',
        version: '30'
      }
    };
    config.browsers = Object.keys(config.customLaunchers);

    config.browserNoActivityTimeout = 120000;
    config.sauceLabs.startConnect = false;
    config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
  }
};
