<template>
  <div class="container mx-auto">
    <div v-if="post && feed">
      <FeedItem :feed="feed" :post="post" :i="0"></FeedItem>

      <div class="border-2 border-mango-700"></div>

      <div>
        <Comment v-for="comment in post.children" :key="comment.id" :comment="comment"></Comment>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
} from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from '@/store';
import api from '@/api';
import Comment from '@/components/Comment.vue';
import FeedItem from '@/components/FeedItem.vue';

export default defineComponent({
  name: 'Post',

  components: { Comment, FeedItem },

  setup() {
    const route = useRoute();
    const store = useStore();

    const feed = computed(() => {
      const feedId = route.params.feed;
      return store.getters.getFeedStateById(feedId).feed;
    });

    const post = ref<Post|undefined>();

    onMounted(async () => {
      const feedId = route.params.feed;
      const postId = route.params.post;
      post.value = await api.getPost(feedId, postId);
    });

    return { feed, post };
  },
});
</script>
