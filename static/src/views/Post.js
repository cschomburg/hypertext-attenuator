import { html, useEffect, useState } from "../deps.js";
import { useFeeds } from "../actions.js";
import FeedItem from "../components/FeedItem.js";
import Comment from "../components/Comment.js";

export default function Post({ feedId, postId }) {
  const [post, setPost] = useState(null);
  const { api, getFeedStateById } = useFeeds();

  const feed = getFeedStateById(feedId).feed;

  useEffect(() => {
    const fetchPost = async () => {
      setPost(await api.getPost(feedId, postId));
    };

    fetchPost();
  }, []);

  if (!feed || !post) {
    return html`
            <div class="container mt-5">
                Loading ...
            </div>
        `;
  }

  return html`
        <div class="container mt-5">
            <${FeedItem} feed=${feed} post=${post} i=0 />

            <div class="divide"></div>

            <div class="comments">
                ${
    post.children.map((comment) =>
      html`
                    <${Comment} key=${comment.id} comment=${comment} />
                `
    )
  }
            </div>
        </div>
    `;
}
