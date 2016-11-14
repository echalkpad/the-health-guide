import { ThehealthguidedesktopPage } from './app.po';

describe('thehealthguidedesktop App', function() {
  let page: ThehealthguidedesktopPage;

  beforeEach(() => {
    page = new ThehealthguidedesktopPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
