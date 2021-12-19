import { ky, parseISO } from './deps.js';

function mapPost(post) {
    post.createdAt = parseISO(post.createdAt);

    if (post.children) {
        post.children = post.children.map(mapPost);
    }

    return post;
}

function mapFeedState(feed) {
    if (feed.lastScrape) {
        feed.lastScrape.posts = feed.lastScrape.posts.map(mapPost);
        feed.lastScrape.scrapedAt = parseISO(feed.lastScrape.scrapedAt);
    }
    if (feed.resultEta) {
        feed.resultEta = parseISO(feed.resultEta);
    }

    return feed;
}

export default class ApiClient {
    #baseUrl;
    #http;

    constructor(config) {
        this.#baseUrl = `${config.relayUrl}/v1`;
        this.#http = ky.create({
            prefixUrl: this.#baseUrl,
        });
    }

    async getFeeds() {
        const res = await this.#http('feeds').json();
        return res.map(mapFeedState);
    }

    async getPost(feedId, postId) {
        const res = await this.#http(`feed/${feedId}/${postId}`).json();
        return mapPost(res.post);
    }

    async refreshFeed(feed) {
        const res = await this.#http.post(`feed/${feed.id}`).json();
        return mapFeedState(res);
    }

    getVisitUrl(feed, post) {
        return `${this.#baseUrl}/visit/${feed.id}/${post.id}`;
    }
}
