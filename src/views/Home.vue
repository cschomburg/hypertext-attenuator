<template>
  <div class="container mx-auto">
    <Feed v-for="state in feeds" :key="state.feed.id" :state="state"></Feed>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useStore } from '@/store';
import Feed from '@/components/Feed.vue';

export default defineComponent({
  name: 'Home',

  components: {
    Feed,
  },

  setup() {
    const store = useStore();

    onMounted(() => {
      store.dispatch('fetchFeeds');
    });

    return {
      feeds: computed(() => store.state.feeds),
    };
  },
});
</script>
