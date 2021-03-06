<template>
  <div class="container mx-auto mt-5">
    <h1 class="text-xl font-bold text-mango-700 my-10">Settings</h1>

    <div>
      <label>
        Relay server URL
        <input class="border ml-5" type="text" v-model="config.relayUrl">
      </label>
    </div>

    <button
      class="bg-mango-700 active:bg-mango-900 text-mango-100 rounded-lg p-2 mt-5"
      @click="saveConfig">
      Save
    </button>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
} from 'vue';
import { useStore } from '@/store';
import { Config } from '@/model';

export default defineComponent({
  name: 'Settings',

  setup() {
    const store = useStore();

    const configValue = new Config(store.state.config);
    const config = ref(configValue);

    const saveConfig = () => {
      store.commit('saveConfig', config.value);
      store.dispatch('fetchFeeds');
    };

    return { config, saveConfig };
  },
});
</script>
