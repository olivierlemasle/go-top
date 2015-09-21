// An example configuration file.
exports.config = {
  // directConnect: true,

  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  // Capabilities to be passed to the webdriver instance.
  multiCapabilities: [{
    'browserName': 'firefox',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER
  }, {
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
  }],

  // Framework to use. Jasmine 2 is recommended.
  framework: 'jasmine2',

  baseUrl: 'http://localhost:9001',

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['*.spec.js'],

  // Options to be passed to Jasmine.
  jasmineNodeOpts: {
    defaultTimeoutInterval: 60000
  }
};
