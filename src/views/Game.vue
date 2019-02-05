<template>
  <the-game :encodedCategory="encodedCategory" :category="category" :is-editable="isEditable"/>
</template>

<script lang="ts">
import Vue from "vue";
import {
  decodeCategory,
  defaultCategoriesByTitle,
  Category
} from "../category";
import TheGame from "../components/TheGame.vue";

export default Vue.extend({
  components: {
    TheGame
  },
  data() {
    const { encodedCategory, builtInCategoryTitle } = this.$route.params;
    let category: Category;
    let isEditable = false;
    try {
      if (encodedCategory) {
        category = decodeCategory(encodedCategory);
        isEditable = true;
      } else if (builtInCategoryTitle) {
        category = defaultCategoriesByTitle.get(builtInCategoryTitle)
      }
    } catch (e) {
      this.$router.replace({ name: "home" });

      category = {
        title: "",
        words: []
      };
    }

    return {
      category,
      encodedCategory,
      isEditable
    };
  }
});
</script>
