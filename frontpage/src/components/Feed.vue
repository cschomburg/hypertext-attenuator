<template>
  <div class="feed flex flex-col">
    <div class="p-5" :class="isSelected ? 'border-b-4 border-mango-700' : null">
      <a class="link" @click="selectFeed()">{{ state.feed.id }}</a>
      <a class="badge cursor-pointer" @click="refreshFeed()">{{ state.status }}</a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useStore } from '@/store';
import { FeedState } from '@/model';

export default defineComponent({
  name: 'Feed',

  props: {
    state: {
      type: Object as PropType<FeedState>,
      required: true,
    },
    isSelected: {
      type: Boolean,
      required: true,
    },
  },

  setup(props, { emit }) {
    const store = useStore();

    const refreshFeed = async () => {
      store.dispatch('refreshFeed', props.state.feed);
    };

    const selectFeed = () => {
      emit('select-feed', props.state.feed.id);
    };

    return {
      refreshFeed,
      selectFeed,
    };
  },
});
</script>
