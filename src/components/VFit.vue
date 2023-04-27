<template>
  <h1 :style="{ fontSize }">{{ text }}</h1>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{ text: string }>();

const fontSize = computed(() => {
  const zoom = 1.1;
  const width = 100;
  const characters = props.text?.length || 1;
  const size: number = Math.min(Math.max(width / characters, 8), 22) * zoom;
  return `${size}vw`;
});
</script>
