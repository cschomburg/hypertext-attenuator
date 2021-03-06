import ky from 'ky';
import { parseISO } from 'date-fns';
import { Feed, FeedState, Post } from './model';

type JsonObject = Record<string, unknown>;

function mapPost(item: JsonObject): Post {
  const post = { ...item };
  post.createdAt = parseISO(item.createdAt as string);

  if (post.children) {
    const children = post.children as JsonObject[];
    post.children = children.map(mapPost);
  }

  return post as unknown as Post;
}

function mapFeedState(item: JsonObject): FeedState {
  const feed = { ...item };
  if (feed.lastScrape) {
    const scrape = feed.lastScrape as JsonObject;
    scrape.posts = (scrape.posts as JsonObject[]).map(mapPost);
    scrape.scrapedAt = parseISO(scrape.scrapedAt as string);
    feed.lastScrape = scrape;
  }
  if (feed.resultEta) {
    feed.resultEta = parseISO(feed.resultEta as string);
  }

  return feed as unknown as FeedState;
}

export class Api {
  #baseUrl = 'http://localhost:8000/v1';

  #http: typeof ky;

  constructor() {
    this.#http = ky.create({
      prefixUrl: this.#baseUrl,
    });
  }

  async getFeeds(): Promise<FeedState[]> {
    const res = await this.#http('feeds').json() as JsonObject[];
    return res.map(mapFeedState);
  }

  async getPost(feedId: string, postId: string): Promise<Post> {
    const res = await this.#http(`feed/${feedId}/${postId}`).json() as JsonObject;
    return mapPost(res.post as JsonObject);
  }

  async refreshFeed(feed: Feed): Promise<FeedState> {
    const res = await this.#http.post(`feed/${feed.id}`).json() as JsonObject;
    return mapFeedState(res);
  }

  getVisitUrl(feed: Feed, post: Post): string {
    return `${this.#baseUrl}/visit/${feed.id}/${post.id}`;
  }
}

export default new Api();
