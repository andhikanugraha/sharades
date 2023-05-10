<template>
  <router-view/>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import Font from 'fontfaceobserver-es';

export default defineComponent({
  setup() {
    onMounted(async () => {
      const font = new Font('Inter');
      await font.load();
      const app = document.getElementById('app');
      if (app) app.className = 'fonts-loaded';
    });
  },
});
</script>
