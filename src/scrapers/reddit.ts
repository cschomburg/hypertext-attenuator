import { Feed, Post, Scrape } from "../model.ts";

interface Item {
  kind: string;
  data: unknown;
}

interface Listing extends Item {
  kind: "Listing";
  data: ListingData;
}

interface ListingData {
  children: Item[];
}

interface Link extends Item {
  kind: "t3";
  data: PostData;
}

function isLink(item: Item): item is Link {
  return item.kind === "t3";
}

interface Comment extends Item {
  kind: "t1";
  data: PostData;
}

function isComment(item: Item): item is Comment {
  return item.kind === "t1";
}

interface PostData {
  id: string;
  selftext: string;
  title: string;
  score: number;
  link_flair_text: string;
  created_utc: number;
  selftext_html: string;
  body_html: string;
  num_comments: number;
  url: string;
  replies?: Listing;
}

function linkToPost(link: Link | Comment): Post {
  const post: Post = {
    id: link.data.id,
    title: link.data.title,
    createdAt: (new Date(link.data.created_utc * 1000)).toISOString(),
    url: link.data.url,
    text: link.data.selftext_html || link.data.body_html,
    points: link.data.score,
    numComments: link.data.num_comments,
    // raw: link,
  };

  if (link.data.replies) {
    post.children = link.data.replies.data.children.filter(isComment).map(
      linkToPost,
    );
  }

  return post;
}

function linkUrl(feed: Feed, id: string): string {
  const matches = feed.url.match(/\/r\/(\w+)/);
  if (!matches) {
    throw new Error("Could not parse subreddit from url: " + feed.url);
  }
  const subreddit = matches[1];

  return `https://www.reddit.com/r/${subreddit}/${id}.json?raw_json=1`;
}

export default {
  getId(): string {
    return "reddit";
  },

  async scrapeFeed(feed: Feed): Promise<Scrape> {
    const res = await fetch(feed.url);
    const result = await res.json() as Listing;

    const posts = result.data.children.filter(isLink).map(linkToPost);

    const scrape: Scrape = {
      feed,
      scrapedAt: (new Date()).toISOString(),
      posts,
    };

    return scrape;
  },

  async scrapePost(feed: Feed, id: string): Promise<Post> {
    const res = await fetch(linkUrl(feed, id));
    const result = await res.json() as Listing[];

    const post = linkToPost(result[0].data.children[0] as Link);
    post.children = result[1].data.children.filter(isComment).map(linkToPost);

    return post;
  },
};
