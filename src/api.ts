import ky from 'ky';
import { parseISO } from 'date-fns';
import { Feed, FeedState, Post } from './model';

type JsonObject = Record<string, unknown>;

function mapPost(item: JsonObject): Post {
  const post = { ...item };
  post.createdAt = parseISO(item.createdAt as string);

  return post as unknown as Post;
}

function mapFeedState(item: JsonObject): FeedState {
  const feed = { ...item };
  if (feed.lastScrape) {
    const scrape = feed.lastScrape as JsonObject;
    scrape.posts = (scrape.posts as JsonObject[]).map(mapPost);
    feed.lastScrape = scrape;
  }
  if (feed.resultEta) {
    feed.resultEta = parseISO(feed.resultEta as string);
  }

  return feed as unknown as FeedState;
}

export class Api {
  #http: typeof ky;

  constructor() {
    this.#http = ky.create({
      prefixUrl: 'http://localhost:8000/v1',
    });
  }

  async getFeeds(): Promise<FeedState[]> {
    const res = await this.#http('feeds').json() as JsonObject[];
    return res.map(mapFeedState);
  }

  async refreshFeed(feed: Feed): Promise<FeedState> {
    const res = await this.#http.post(`feed/${feed.id}`).json() as JsonObject;
    return mapFeedState(res);
  }
}

export default new Api();
