import UrlParser from '../routes/url-parser';
import { displayRestaurants } from '../index';

class App {
  constructor({ content }) {
    this._content = content;
  }

  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();
    const page = url ? (await import('../routes/routes')).default[url] : null;

    if (!page) {
      displayRestaurants();
      return;
    }

    this._content.innerHTML = await page.render();
    await page.afterRender();
  }
}

export default App;
