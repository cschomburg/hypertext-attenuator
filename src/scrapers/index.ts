import type { Scraper } from '../model.ts';

import coingecko from './coingecko.ts';
import hackernews from './hackernews.ts';
import lobsters from './lobsters.ts';
import reddit from './reddit.ts';
import rss from './rss.ts';

export class ScraperCollection {
  #scrapers: Record<string, Scraper> = {};

  add(scraper: Scraper): void {
    this.#scrapers[scraper.getId()] = scraper;
  }

  get(id: string): Scraper {
    const scraper = this.#scrapers[id];
    if (scraper == null) {
      throw new Error(`Scraper with id '${id}' not found`);
    }

    return scraper;
  }
}

const collection = new ScraperCollection();
collection.add(coingecko);
collection.add(hackernews);
collection.add(lobsters);
collection.add(reddit);
collection.add(rss);

export default collection;
