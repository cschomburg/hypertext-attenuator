import { render, html, Router, Link } from './deps.js';
import Home from './views/Home.js';
import Post from './views/Post.js';
import Settings from './views/Settings.js';

function App() {

    return html`
        <nav class="container">
            <${Link} activeClassName=active href="/">Home<//>${" | "}
            <${Link} activeClassName=active href="/settings">Settings<//>
        </nav>

        <${Router}>
            <${Home} default />
            <${Post} path="/feed/:feedId/:postId" />
            <${Settings} path="/settings" />
        <//>
    `
}

render(html`<${App} />`, document.getElementById('main'))
