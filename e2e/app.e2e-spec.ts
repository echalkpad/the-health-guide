import { TheHealthGuidePage } from './app.po';

describe('the-health-guide App', function() {
  let page: TheHealthGuidePage;

  beforeEach(() => {
    page = new TheHealthGuidePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
