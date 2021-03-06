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
  comments?: LobsterComment[];
}

interface LobsterComment {
  short_id: string;
  created_at: string;
  short_id_url: string;
  score: number;
  indent_level: number;
  comment: string;
  comments?: LobsterComment[];
}

function listToTree(items: LobsterComment[]): LobsterComment[] {
  const roots: LobsterComment[] = [];
  let stack: LobsterComment[] = [];

  items.forEach((item) => {
    const level = item.indent_level;
    if (level === 1) {
      roots.push(item);
    } else {
      const parent = stack[level - 2];
      parent.comments = [...(parent.comments || []), item];
    }
    stack[level - 1] = item;
  });

  return roots;
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

  if (item.comments) {
    post.children = listToTree(item.comments).map(commentToPost);
  }

  return post;
}

function commentToPost(item: LobsterComment): Post {
  const post: Post = {
    id: item.short_id,
    title: '',
    createdAt: item.created_at,
    url: item.short_id_url,
    text: item.comment,
    points: item.score,

    // raw: item,
  };

  if (item.comments) {
    post.children = item.comments.map(commentToPost);
  }

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

  async scrapePost(feed: Feed, id: string): Promise<Post> {
    const res = await fetch(`https://lobste.rs/s/${id}.json`);
    const result = await res.json() as LobsterPost;

    return lobsterToPost(result);
  },
}
