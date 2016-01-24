'use strict';

describe('Go-Top main page', function() {

  beforeEach(function() {
    var width = 1600;
    var height = 1000;
    browser.driver.manage().window().setSize(width, height);
    browser.get('/');
  });

  it('should have Go-Top title', function() {
    expect(browser.getTitle()).toEqual('Go-Top');
  });

  it('should have /cpu has the home page', function() {
    expect(browser.getLocationAbsUrl()).toEqual('/cpu');
  });

  it('should have some menus', function() {
    var menus = element.all(by.repeater('menu in menus'));
    expect(menus.count()).toBeGreaterThan(2);
    expect(menus.first().getText()).toEqual('CPU USAGE');
    expect(menus.last().getText()).toEqual('ABOUT');
  });

  it('should show the CPU page when clicking on the first menu', function() {
    element.all(by.repeater('menu in menus')).first().element(by.tagName('a')).click();
    expect(browser.getLocationAbsUrl()).toEqual('/cpu');
  });

  it('should navigate to the About page when clicking on the last menu', function() {
    element.all(by.repeater('menu in menus')).last().element(by.tagName('a')).click();
    expect(browser.getLocationAbsUrl()).toEqual('/about');
  });
});
