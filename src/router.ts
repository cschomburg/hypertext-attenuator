import { Router, RouterContext } from "./deps.ts";
import store from "./store.ts";

const router = new Router();
router
  .get("/v1/feeds", async (context: RouterContext) => {
    const feeds = store.getFeeds();
    context.response.body = feeds;
  })
  .get("/v1/feed/:feedId", async (context: RouterContext) => {
    const feed = store.getFeed(context.params.feedId || "");
    const state = store.getFeedState(feed);
    context.response.body = state;
  })
  .get("/v1/feed/:feedId/:id", async (context: RouterContext) => {
    const feed = store.getFeed(context.params.feedId || "");
    const post = await store.scrapePost(feed, context.params.id || "");
    context.response.body = { feed, post };
  })
  .get("/v1/visit/:feedId/:postId", async (context: RouterContext) => {
    const feed = store.getFeed(context.params.feedId || "");
    const post = store.getPost(feed, context.params.postId || "");
    context.response.redirect(post.url);
  })
  .post("/v1/feed/:feedId", async (context: RouterContext) => {
    const feed = store.getFeed(context.params.feedId || "");
    const state = await store.queueScrape(feed);
    context.response.body = state;
  })
  .get("/v1/scrape/:feedId", async (context: RouterContext) => {
    const feed = store.getFeed(context.params.feedId || "");
    const scrape = await store.scrapeFeed(feed);
    context.response.body = scrape;
  })
  .get("/v1/scrape/:feedId/:id", async (context: RouterContext) => {
    const feed = store.getFeed(context.params.feedId || "");
    const post = await store.scrapePost(feed, context.params.id || "");
    context.response.body = post;
  });

export default router;
