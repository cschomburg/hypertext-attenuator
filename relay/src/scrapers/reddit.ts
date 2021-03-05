import { Feed, Scrape, Post } from '../model.ts';

interface Listing {
  kind: "Listing";
  data: ListingData;
}

interface ListingData {
  children: Link[];
}

interface Link {
  kind: "t3";
  data: LinkData;
}

interface LinkData {
  id: string;
  selftext: string;
  title: string;
  score: number;
  link_flair_text: string;
  created_utc: number;
  selftext_html: string;
  num_comments: number;
  url: string;
}

function linkToPost(link: Link): Post {
  const post: Post = {
    id: link.data.id,
    title: link.data.title,
    createdAt: (new Date(link.data.created_utc * 1000)).toISOString(),
    url: link.data.url,
    text: link.data.selftext_html,
    points: link.data.score,
    numComments: link.data.num_comments,

    // raw: link,
  };

  return post;
}

export default {
  getId(): string {
    return 'reddit';
  },

  async scrapeFeed(feed: Feed): Promise<Scrape> {
    const res = await fetch(feed.url);
    const result = await res.json() as Listing;

    const posts = result.data.children.map(linkToPost);

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
