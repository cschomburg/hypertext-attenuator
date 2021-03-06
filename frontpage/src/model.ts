export class Config {
  relayUrl = 'http://localhost:8000';

  constructor(config: Partial<Config> = {}) {
    Object.assign(this, config);
  }
}

export enum FeedStatus {
  New = 'new',
  Pending = 'pending',
  Available = 'available',
  Failed = 'failed',
}

export interface Feed {
  id: string;
  scraper: string;

  delay?: number;
  delayJitter?: number;
  failureRate?: number;
}

export interface Scrape {
  feed: Feed;
  scrapedAt: Date;
  posts: Post[];
}

export interface Post {
  id: string;
  title: string;
  createdAt: Date;
  url: string;
  text: string;
  tags?: string[];

  points?: number;
  numComments?: number;
  children?: Post[];
}

export interface FeedState {
  feed: Feed;
  status: FeedStatus;
  resultEta: Date|null;

  lastScrape: Scrape|null;
  posts: Record<string, Post>;
}
