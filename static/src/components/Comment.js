import { html, useState } from '../deps.js';
import { formatAgo } from '../utils.js';

export default function Comment({ comment }) {
    const [ collapsed, setCollapsed ] = useState(false);
    const collapseText = collapsed ? '+' : '-';
    const toggleCollapsed = () => setCollapsed(!collapsed);

    const createdAgo = formatAgo(comment.createdAt);

    return html`
        <div class="my-5">
            <div class="text-sm muted">
                ${ comment.points && html`<span>${ comment.points } points |</span>` }
                ${ createdAgo } ${' '}

                [<span class="clickable" onClick="${toggleCollapsed}">${ collapseText }</span>]
            </div>

            ${!collapsed && html`
                <div class="comment-body">
                    <div class="comment-text" dangerouslySetInnerHTML=${{ __html: comment.text }}></div>

                    <div class="pl-10">
                        ${comment.children && comment.children.map((comment) => html`
                            <${Comment} key=${comment.id} comment=${comment} />
                        `)}
                    </div>
                </div>
            `}
        </div>
    `;
}
