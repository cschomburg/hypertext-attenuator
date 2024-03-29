export interface Feed {
  id: string;
  scraper: string;
  url: string;

  delay?: number;
  delayJitter?: number;
  failureRate?: number;
}

export interface Scrape {
  feed: Feed;
  scrapedAt: string;
  posts: Post[];
}

export interface Scraper {
  getId(): string;
  scrapeFeed(feed: Feed): Promise<Scrape>;
  scrapePost(feed: Feed, id: string): Promise<Post>;
}

export interface Post {
  id: string;
  title: string;
  createdAt: string;
  url: string;
  text: string;
  tags?: string[];

  points?: number;
  numComments?: number;
  children?: Post[];

  raw?: any;
}

export function isFeed(feed: unknown): feed is Feed {
  if (feed === null || typeof feed !== "object") {
    return false;
  }

  return "id" in feed &&
    "scraper" in feed &&
    "url" in feed;
}
