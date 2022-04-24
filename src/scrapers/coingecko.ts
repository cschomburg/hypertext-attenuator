import { Feed, Post, Scrape } from "../model.ts";
import { numeral } from "../deps.ts";

type Market = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  last_updated: string;
};

function marketToPost(market: Market): Post {
  const price = "$" + numeral(market.current_price).format("0,0[.]00 $");

  const post: Post = {
    id: market.id,
    title: `${market.name} (${market.symbol.toUpperCase()}) at ${price}`,
    createdAt: market.last_updated,
    url: "https://www.coingecko.com/en/coins/" + market.id,
    text: price,
    points: market.market_cap,
    numComments: 0,
    // raw: market,
  };

  return post;
}

export default {
  getId(): string {
    return "coingecko";
  },

  async scrapeFeed(feed: Feed): Promise<Scrape> {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20",
    );
    const markets = await res.json() as Market[];
    const posts = markets.map(marketToPost);

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
