import { Feed, Scrape, Post } from '../model.ts';

interface LobsterPost {
  short_id: string;
  created_at: string;
  title: string;
  url: string;
  comments_url: string;
  score: number;
  comment_count: number;
  description: string;
  tags: string[];
}

function lobsterToPost(item: LobsterPost): Post {
  const post: Post = {
    id: item.short_id,
    title: item.title,
    createdAt: item.created_at,
    url: item.url || item.comments_url,
    text: item.description,
    points: item.score,
    numComments: item.comment_count,

    // raw: item,
  };

  return post;
}

export default {
  getId(): string {
    return 'lobsters';
  },

  async scrapeFeed(feed: Feed): Promise<Scrape> {
    const res = await fetch('https://lobste.rs/hottest.json');
    const result = await res.json() as LobsterPost[];

    const posts = result.map(lobsterToPost);

    const scrape: Scrape = {
      feed,
      scrapedAt: (new Date()).toISOString(),
      posts,
    };

    return scrape;
  },

  async scrapePost(id: string): Promise<Post> {
    throw new Error('Not implemented yet.');
  },
}
