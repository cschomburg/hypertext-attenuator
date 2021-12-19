import { html, useState, useEffect } from '../deps.js';
import { useFeeds } from '../actions.js';
import FeedDetail from '../components/FeedDetail.js';

function FeedLink({ state, onSelect, onRefresh, active }) {
    return html`
        <div class="feed-link p-5 ${active ? 'active' : ''}">
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
        fetchFeeds();
        setSelectedFeedId(feed.id);
    }

    const selectedFeed = getFeedStateById(selectedFeedId);

    return html`
        <div class="container mt-5">
            <div class="flex">
                ${feeds.map((state) => html`
                    <${FeedLink}
                        state=${state}
                        active=${state.feed.id === selectedFeedId}
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
