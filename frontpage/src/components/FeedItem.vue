<template>
  <div class="p-2 flex">
    <div class="flex-initial px-2 text-gray-600">{{ i + 1}}.</div>

    <div class="flex-1">
      <a target="_blank" :href="visitUrl" class="cursor-pointer font-medium">{{ post.title }}</a>

      <span v-if="domain" class="text-sm text-gray-600">
        ({{ domain }})
      </span>

      <div class="text-sm text-gray-600">
        {{ post.points }} points |
        {{ createdAgo }} |
        <router-link :to="commentsLink">{{ post.numComments }} comments</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { Feed, Post } from '@/model';
import { useStore } from '@/store';
import { formatAgo } from '@/utils';

export default defineComponent({
  name: 'FeedItem',

  props: {
    feed: {
      type: Object as PropType<Feed>,
      required: true,
    },
    post: {
      type: Object as PropType<Post>,
      required: true,
    },
    i: {
      type: Number,
      required: true,
    },
  },

  setup(props) {
    const store = useStore();

    const domain = computed(() => {
      const { post } = props;
      if (!post.url) {
        return '';
      }
      const url = new URL(post.url);

      return url.hostname;
    });

    const createdAgo = computed(() => {
      const { post } = props;

      return formatAgo(post);
    });

    const visitUrl = computed(() => {
      const { feed, post } = props;
      return store.getters.api.getVisitUrl(feed, post);
    });

    const commentsLink = computed(() => {
      const { feed, post } = props;
      return `/feed/${feed.id}/${post.id}`;
    });

    return {
      commentsLink, domain, createdAgo, visitUrl,
    };
  },
});
</script>
