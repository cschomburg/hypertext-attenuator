import { html, useState, useEffect } from '../deps.js';
import { useFeeds } from '../actions.js';
import FeedDetail from '../components/FeedDetail.js';

function FeedLink({ state, onSelect, onRefresh }) {
    return html`
        <div class="feed-link p-5">
            <a class="link" onClick=${onSelect}>${ state.feed.id }</a>
            <a class="badge clickable" onClick=${onRefresh}>${ state.status }</a>
        </div>
    `;
}

export default function Home() {
    const { feeds, fetchFeeds, refreshFeed, getFeedStateById } = useFeeds();
    const [ selectedFeedId, setSelectedFeedId ] = useState('');

    useEffect(() => {
        fetchFeeds();
    }, []);

    const selectFeed = (feed) => {
        setSelectedFeedId(feed.id);
    }

    const selectedFeed = getFeedStateById(selectedFeedId);

    return html`
        <div class="container mt-5">
            <h1 class="text-xl font-bold text-mango-700 my-10">Home</h1>

            <div class="flex">
                ${feeds.map((state) => html`
                    <${FeedLink}
                        state=${state}
                        onSelect=${() => selectFeed(state.feed)}
                        onRefresh=${() => refreshFeed(state.feed)}
                    />
                `)}
            </div>

            ${selectedFeed && html`
                <${FeedDetail} state=${selectedFeed} />
            `}
        </div>
    `;
}
