<template>
  <div class="feed-detail">
    <div v-if="state.status === 'available'">
      <div class="text-sm text-gray-600 mb-5">
        Last scraped {{ lastScraped }}
      </div>

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
  name: 'FeedDetail',

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

    const lastScraped = computed(() => {
      const time = props.state.lastScrape?.scrapedAt;
      if (!time) {
        return '';
      }

      return formatAgo(time);
    });

    return {
      recentPosts,
      refreshFeed,
      resultEta,
      lastScraped,
    };
  },
});
</script>
