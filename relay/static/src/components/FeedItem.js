import { html, useMemo, Link } from '../deps.js';
import { formatAgo } from '../utils.js';
import { useFeeds } from '../actions.js';

export default function FeedItem({ feed, post, i }) {
    const { getVisitUrl } = useFeeds();
    const visitUrl = getVisitUrl(feed, post);

    const domain = useMemo(() => {
        if (!post.url) {
            return '';
        }

        const url = new URL(post.url);
        return url.hostname;
    }, [ post.url ]);

    const createdAgo = formatAgo(post.createdAt);

    const commentsLink = `/feed/${feed.id}/${post.id}`;

    return html`
        <div class="flex p-2">
            <div class="px-2 muted">${ i + 1}.</div>

            <div>
                <a class="feed-link" target="_blank" href="${visitUrl}">${ post.title }</a>${' '}

                ${domain && html`
                    <span class="text-sm muted">${ domain }</span>
                `}

                <div class="text-sm muted">
                    ${ post.points } points | ${' '}
                    ${ createdAgo } | ${' '}
                    <${Link} href="${commentsLink}" class="muted">comments<//>
                </div>
            </div>
        </div>
    `;
}
