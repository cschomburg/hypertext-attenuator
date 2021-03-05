import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import type { FeedState, Feed } from '../model';
import api from '../api';

export interface State {
  feeds: FeedState[];
}

export const key: InjectionKey<Store<State>> = Symbol('store');

export const store = createStore<State>({
  state: {
    feeds: [],
  },

  getters: {
    getFeedStateById: (state) => (id: string) => state.feeds.find((f) => f.feed.id === id),
  },

  mutations: {
    setFeeds(state, feeds: FeedState[]) {
      state.feeds = feeds;
    },
  },

  actions: {
    async fetchFeeds({ commit }) {
      const feeds = await api.getFeeds();
      commit('setFeeds', feeds);
    },

    async refreshFeed({ commit }, feed: Feed) {
      await api.refreshFeed(feed);
      return this.dispatch('fetchFeeds');
    },
  },
});

export function useStore() {
  return baseUseStore(key);
}
