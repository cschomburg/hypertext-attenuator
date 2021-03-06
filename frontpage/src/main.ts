import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { store, key } from './store';

import './assets/styles/index.css';

store.commit('loadConfig');

createApp(App).use(store, key).use(router).mount('#app');
