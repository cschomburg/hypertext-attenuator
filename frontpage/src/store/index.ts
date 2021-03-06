import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import { Config } from '../model';
import type { FeedState, Feed } from '../model';
import ApiClient from '../api';

export interface State {
  feeds: FeedState[];
  config: Config;
}

export const key: InjectionKey<Store<State>> = Symbol('store');

export const store = createStore<State>({
  state: {
    feeds: [],
    config: new Config(),
  },

  getters: {
    getFeedStateById: (state) => (id: string) => state.feeds.find((f) => f.feed.id === id),
    api: (state) => new ApiClient(state.config),
  },

  mutations: {
    setFeeds(state, feeds: FeedState[]) {
      state.feeds = feeds;
    },

    loadConfig(state) {
      const value = window.localStorage.getItem('config') as string|undefined;
      if (value) {
        const configData = JSON.parse(value) as Partial<Config>;
        state.config = new Config(configData);
      }
    },

    saveConfig(state, config: Config) {
      state.config = config;
      window.localStorage.setItem('config', JSON.stringify(config));
    },
  },

  actions: {
    async fetchFeeds({ getters, commit }) {
      const feeds = await getters.api.getFeeds();
      commit('setFeeds', feeds);
    },

    async refreshFeed({ getters, dispatch }, feed: Feed) {
      await getters.api.refreshFeed(feed);
      return dispatch('fetchFeeds');
    },
  },
});

export function useStore() {
  return baseUseStore(key);
}
