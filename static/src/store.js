import { createStore } from "./deps.js";

export const { useStore, getStore, withStore } = createStore({
  feeds: [],

  config: {
    relayUrl: window.location.origin,
  },
});
