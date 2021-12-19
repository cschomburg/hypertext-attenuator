import { html } from '../deps.js';
import { formatAgo, sortByCreated } from '../utils.js';
import FeedItem from './FeedItem.js';

export default function FeedDetail({ state }) {
    const lastScraped = formatAgo(state.lastScrape?.scrapedAt);

    let recentPosts = [];
    if (state.lastScrape) {
        recentPosts = sortByCreated(state.lastScrape.posts);
    }

    return html`
        <div class="feed-detail mt-5">
            ${state.status === 'available' && html`
                <div class="text-sm muted mb-5">
                    Last scraped: ${lastScraped}
                </div>

                ${recentPosts.map((post, i) => html`
                    <${FeedItem} feed=${state.feed} post=${post} i=${i} />
                `)}
            `}

            ${state.status === 'pending' && html`
                ETA: ${ formatAgo(state.resultEta) }
            `}
        </div>
    `;
}
