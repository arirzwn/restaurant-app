import UrlParser from '../routes/url-parser';
import { displayRestaurants } from '../index';

class App {
  constructor({ content }) {
    this._content = content;
  }

  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();
    const page =
      (await import(/* webpackChunkName: "routes" */ '../routes/routes'))[
        url
      ] || null;
    if (!page) {
      displayRestaurants();
      return;
    }
    this._content.innerHTML = await page.render();
    await page.afterRender();
  }
}

export default App;
