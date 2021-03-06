<template>
  <div class="container mx-auto">
    <div class="flex mb-5">
      <Feed
        v-for="state in feeds"
        :key="state.feed.id"
        :state="state"
        :is-selected="state.feed.id === selectedFeed"
        @select-feed="selectFeed">
      </Feed>
    </div>

    <FeedDetail
        v-if="selectedFeedState"
        :state="selectedFeedState">
    </FeedDetail>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  onMounted,
  ref,
} from 'vue';
import { useStore } from '@/store';
import Feed from '@/components/Feed.vue';
import FeedDetail from '@/components/FeedDetail.vue';

export default defineComponent({
  name: 'Home',

  components: {
    Feed,
    FeedDetail,
  },

  setup() {
    const store = useStore();

    const selectedFeed = ref<string|undefined>();

    onMounted(() => {
      store.dispatch('fetchFeeds');
    });

    const selectFeed = ((feedId: string|undefined) => {
      store.dispatch('fetchFeeds');
      selectedFeed.value = feedId;
    });

    const selectedFeedState = computed(() => {
      return store.state.feeds.find((state) => state.feed.id === selectedFeed.value);
    });

    return {
      feeds: computed(() => store.state.feeds),
      selectedFeed,
      selectFeed,
      selectedFeedState,
    };
  },
});
</script>
