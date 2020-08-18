<template>
  <h1 :style="{ fontSize }">{{ text }}</h1>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "@vue/composition-api";
const VFit = defineComponent({
  props: {
    text: String,
    width: Number,
  },
  setup(props) {
    const fontSize = computed(() => {
      const width = (props.width || 100) * 1.3;
      const characters = props.text?.length || 1;
      const size: number = Math.min(Math.max(width / characters, 8), 22);
      return `${size}vw`;
    });

    return { fontSize };
  },
});

export default VFit;
</script>
