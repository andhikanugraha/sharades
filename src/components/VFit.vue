<template>
  <h1 :style="{fontSize}">{{text}}</h1>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: ["text", "width"],
  computed: {
    fontSize() {
      const width: number = (this.width || 100) * 1.3;
      const characters: number = this.text.length;
      const size: number = Math.min(Math.max(width / characters, 8), 22);
      return `${size}vw`;
    }
  }
});
</script>
