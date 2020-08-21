<template>
  <h1 :style="{ fontSize }">{{ text }}</h1>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'VFit',
  props: {
    text: String,
    width: Number,
  },
  setup(props) {
    const fontSize = computed(() => {
      const zoom = 1.1;
      const width = (props.width || 100);
      const characters = props.text?.length || 1;
      const size: number = Math.min(Math.max(width / characters, 8), 22) * zoom;
      return `${size}vw`;
    });

    return { fontSize };
  },
});
</script>
