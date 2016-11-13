import { TheHealthGuideWebPage } from './app.po';

describe('the-health-guide-web App', function() {
  let page: TheHealthGuideWebPage;

  beforeEach(() => {
    page = new TheHealthGuideWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
