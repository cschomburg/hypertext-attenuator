import { Feed, Post, Scrape } from "../model.ts";
import { deserializeFeed, JsonFeedItem } from "../deps.ts";

function itemToPost(item: JsonFeedItem): Post {
  const post: Post = {
    id: item.id,
    title: item.title || "",
    createdAt: (item.date_published || item.date_modified || new Date())
      .toISOString(),
    url: item.url || item.external_url || "",
    text: item.summary || item.content_text || item.content_html || "",
    // raw: item,
  };

  return post;
}

export default {
  getId(): string {
    return "rss";
  },

  async scrapeFeed(feed: Feed): Promise<Scrape> {
    const res = await fetch(feed.url);
    const xml = await res.text();
    const result = await deserializeFeed(xml, { outputJsonFeed: true });

    const posts = result.feed.items.map(itemToPost);

    const scrape: Scrape = {
      feed,
      scrapedAt: (new Date()).toISOString(),
      posts,
    };

    return scrape;
  },

  async scrapePost(feed: Feed, id: string): Promise<Post> {
    throw new Error("Not implemented yet.");
  },
};
