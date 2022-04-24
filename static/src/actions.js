import { useStore } from "./store.js";
import ApiClient from "./api.js";

export function useFeeds() {
  const [relayUrl] = useStore.config.relayUrl();
  const [feeds, setFeeds] = useStore.feeds();

  const api = new ApiClient({ relayUrl });

  const fetchFeeds = async () => {
    const feeds = await api.getFeeds();
    setFeeds(feeds);
  };

  const refreshFeed = async (feed) => {
    await api.refreshFeed(feed);
    fetchFeeds();
  };

  const getVisitUrl = (feed, post) => {
    return api.getVisitUrl(feed, post);
  };

  const getFeedStateById = (feedId) => {
    return feeds.find((state) => state.feed.id === feedId);
  };

  return {
    api,
    feeds,
    fetchFeeds,
    refreshFeed,
    getVisitUrl,
    getFeedStateById,
  };
}
