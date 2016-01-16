'use strict';

describe('Go-Top main page', function() {

  beforeEach(function() {
    browser.get('/');
  });

  it('should have Go-Top title', function() {
    expect(browser.getTitle()).toEqual('Go-Top');
  });

  it('should have some menus', function() {
    var menus = element.all(by.repeater('menu in menus'));
    expect(menus.count()).toBeGreaterThan(1);
    expect(menus.first().getText()).toEqual('CPU USAGE');
  });

  it('should navigate to the /cpu page when clicking on the first menu', function() {
    element.all(by.repeater('menu in menus')).first().element(by.tagName('a')).click();
    expect(browser.getLocationAbsUrl()).toEqual('/cpu');
  });

  it('should stay on the About page when clicking on the last menu', function() {
    element.all(by.repeater('menu in menus')).last().element(by.tagName('a')).click();
    expect(browser.getLocationAbsUrl()).toEqual('/about');
  });
});
