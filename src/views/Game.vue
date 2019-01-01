<template>
  <the-game :timeLimit="5" :encodedCategory="encodedCategory" :category="category"/>
</template>

<script lang="ts">
import Vue from "vue";
import { decodeCategory, Category } from "../category";
import TheGame from "../components/TheGame.vue";

export default Vue.extend({
  components: {
    TheGame
  },
  data() {
    const encodedCategory = this.$route.params.encodedCategory;
    let category: Category;
    try {
      category = decodeCategory(encodedCategory);
    } catch (e) {
      this.$router.replace({ name: "home" });

      category = {
        title: "",
        words: []
      };
    }

    return {
      category,
      encodedCategory
    };
  }
});
</script>
