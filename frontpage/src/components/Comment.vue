<template>
  <div class="my-5">
      <div class="text-sm text-gray-600">
        <span v-if="comment.points">{{ comment.points }} points |</span>
        {{ createdAgo }}

        [<span class="cursor-pointer" @click="toggle()">{{ collapseText }}</span>]
      </div>

      <div v-show="!collapsed" class="border-l border-tomato-300 mt-2 px-5">
        <div class="comment-text" v-html="comment.text"></div>

        <div class="pl-10">
          <Comment
            v-for="comment in comment.children"
            :key="comment.id"
            :comment="comment">
          </Comment>
        </div>
      </div>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, ref, PropType,
} from 'vue';
import { Post } from '@/model';
import { formatAgo } from '@/utils';

export default defineComponent({
  name: 'Comment',

  props: {
    comment: {
      type: Object as PropType<Post>,
      required: true,
    },
  },

  setup(props) {
    const collapsed = ref(false);

    const createdAgo = computed(() => {
      const { comment } = props;
      return formatAgo(comment.createdAt);
    });

    const collapseText = computed(() => (collapsed.value ? '+' : '-'));

    const toggle = () => {
      collapsed.value = !collapsed.value;
    };

    return {
      collapseText,
      collapsed,
      createdAgo,
      toggle,
    };
  },
});
</script>
