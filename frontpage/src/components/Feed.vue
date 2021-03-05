<template>
  <div class="feed flex flex-col">
    <div class="p-5">
      <a class="link" @click="refreshFeed()">{{ state.feed.id }}</a>
      <span class="badge">{{ state.status }}</span>
    </div>

    <div v-if="state.status === 'available'">
      <FeedItem
        v-for="(post, i) in recentPosts"
        :key="post.id"
        :feed="state.feed"
        :post="post"
        :i="i">
      </FeedItem>
    </div>

    <div v-if="state.status === 'pending'">
      ETA: {{ resultEta }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { useStore } from '@/store';
import { FeedState } from '@/model';
import { formatAgo, sortByCreated } from '@/utils';
import FeedItem from './FeedItem.vue';

export default defineComponent({
  name: 'Feed',

  components: { FeedItem },

  props: {
    state: {
      type: Object as PropType<FeedState>,
      required: true,
    },
  },

  setup(props) {
    const store = useStore();

    const refreshFeed = async () => {
      store.dispatch('refreshFeed', props.state.feed);
    };

    const recentPosts = computed(() => {
      const scrape = props.state.lastScrape;
      if (!scrape) {
        return [];
      }

      const posts = [...scrape.posts];
      sortByCreated(posts);

      return posts;
    });

    const resultEta = computed(() => {
      const eta = props.state.resultEta;
      if (!eta) {
        return '';
      }

      return formatAgo(eta);
    });

    return {
      recentPosts,
      refreshFeed,
      resultEta,
    };
  },
});
</script>
