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
import Comment from '@/components/Comment.vue';
import FeedItem from '@/components/FeedItem.vue';
import { Post } from '@/model';

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
      const feedId = route.params.feed as string;
      const postId = route.params.post as string;
      post.value = await store.getters.api.getPost(feedId, postId);
    });

    return { feed, post };
  },
});
</script>
