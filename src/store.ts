import { Config } from "./config.ts";
import { Feed, Post, Scrape } from "./model.ts";
import scrapers from "./scrapers/index.ts";

export enum FeedStatus {
  New = "new",
  Pending = "pending",
  Available = "available",
  Failed = "failed",
}

export class FeedState {
  feed: Feed;
  status: FeedStatus;
  resultEta: string | null = null;

  lastScrape: Scrape | null = null;
  posts: Record<string, Post> = {};

  constructor(feed: Feed) {
    this.feed = feed;
    this.status = FeedStatus.New;
  }
}

export class Store {
  config?: Config;
  feedStates: Record<string, FeedState> = {};

  init(config: Config) {
    this.config = config;
  }

  getConfig(): Config {
    if (this.config === undefined) {
      throw new Error("Store not initialized");
    }

    return this.config;
  }

  getFeeds(): FeedState[] {
    const feeds = this.getConfig().feeds;
    const state = feeds.map((feed) => this.getFeedState(feed));

    return state;
  }

  getFeed(id: string): Feed {
    const feeds = this.getConfig().feeds;
    const feed = feeds.find((f) => f.id === id);
    if (!feed) {
      throw new Error(`Feed with ID ${id} not found`);
    }

    return feed;
  }

  getFeedState(feed: Feed): FeedState {
    let state = this.feedStates[feed.id];
    if (state == null) {
      state = new FeedState(feed);
      this.feedStates[feed.id] = state;
    }

    return state;
  }

  putScrape(scrape: Scrape): void {
    const state = this.getFeedState(scrape.feed);
    state.lastScrape = scrape;
    state.status = FeedStatus.Available;
  }

  putPost(feed: Feed, post: Post): void {
    this.getFeedState(feed).posts[post.id] = post;
  }

  getPost(feed: Feed, id: string): Post {
    const scrape = this.getFeedState(feed).lastScrape;
    if (!scrape) {
      throw new Error("feed not scraped");
    }

    const post = scrape.posts.find((p) => p.id === id);
    if (!post) {
      throw new Error(`post '${id}' not found`);
    }

    return post;
  }

  async queueScrape(feed: Feed): Promise<FeedState> {
    const state = this.getFeedState(feed);
    state.status = FeedStatus.Pending;

    if (!feed.delay) {
      await this.scrapeFeed(feed);
      return state;
    }

    const delay = feed.delay + Math.random() * (feed.delayJitter || 0);
    const eta = new Date();
    eta.setSeconds(eta.getSeconds() + delay);
    state.resultEta = eta.toISOString();

    console.log("delaying feed", feed.id, "until at least", eta);

    window.setTimeout(() => {
      if (feed.failureRate && Math.random() <= feed.failureRate) {
        console.log(`the universe determined that scrape ${feed.id} failed`);
        state.status = FeedStatus.Failed;
        return;
      }

      try {
        this.scrapeFeed(feed);
      } catch (e) {
        console.error("scraping feed ${feed.id} failed:", e);
      }
    }, delay * 1000);

    return state;
  }

  async scrapeFeed(feed: Feed): Promise<Scrape> {
    console.log("scraping feed", feed.id);
    const scraper = scrapers.get(feed.scraper);
    const scrape = await scraper.scrapeFeed(feed);

    console.log(`feed ${feed.id} scraped, ${scrape.posts.length} posts`);

    this.putScrape(scrape);

    return scrape;
  }

  async scrapePost(feed: Feed, id: string): Promise<Post> {
    const scraper = scrapers.get(feed.scraper);
    const post = await scraper.scrapePost(feed, id);

    return post;
  }
}

export default new Store();
