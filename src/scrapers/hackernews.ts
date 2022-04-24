import { Feed, Post, Scrape } from "../model.ts";

type AlgoliaItem = {
  id: string;
  created_at: string;
  title: string;
  url: string;
  text: string;
  points: number;
  children: AlgoliaItem[];
};

type AlgoliaHit = {
  created_at: string;
  title: string;
  url: string;
  author: string;
  points: number;
  num_comments: number;
  objectID: string;
};

type AlgoliaResult = {
  hits: AlgoliaHit[];
};

function hitToPost(item: AlgoliaHit): Post {
  const post: Post = {
    id: item.objectID,
    title: item.title,
    createdAt: item.created_at,
    url: item.url,
    text: "",
    points: item.points,
    numComments: item.num_comments,
    // raw: item,
  };

  return post;
}

function itemToPost(item: AlgoliaItem): Post {
  const post: Post = {
    id: item.id.toString(),
    title: item.title,
    createdAt: item.created_at,
    url: item.url ?? "https://news.ycombinator.com/item?id=" + item.id,
    text: item.text,
    points: item.points,
    children: item.children.map(itemToPost),
    // raw: item,
  };

  return post;
}

export default {
  getId(): string {
    return "hackernews";
  },

  async scrapeFeed(feed: Feed): Promise<Scrape> {
    const res = await fetch(
      "http://hn.algolia.com/api/v1/search?tags=front_page",
    );
    const result = await res.json() as AlgoliaResult;

    const posts = result.hits.map(hitToPost);

    const scrape: Scrape = {
      feed,
      scrapedAt: (new Date()).toISOString(),
      posts,
    };

    return scrape;
  },

  async scrapePost(feed: Feed, id: string): Promise<Post> {
    const res = await fetch("https://hn.algolia.com/api/v1/items/" + id);
    const result = await res.json() as AlgoliaItem;

    return itemToPost(result);
  },
};
