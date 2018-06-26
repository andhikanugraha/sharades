<template>
  <TheGame :timeLimit="10" :encodedCategory="$route.params.encodedCategory"/>
</template>

<script lang="ts">
import Vue from 'vue';
import TheGame from '../components/TheGame.vue';
export default Vue.extend({
  components: {
    TheGame,
  },
});
</script>
