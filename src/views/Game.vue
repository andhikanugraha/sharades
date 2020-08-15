<template>
  <the-game
    v-if="category"
    :encodedCategory="encodedCategory"
    :category="category"
    :is-editable="isEditable"
  />
</template>

<script lang="ts">
import Vue from "vue";
import {
  decodeCategory,
  Category,
  getDefaultCategoryByTitle,
} from "../category";

export default Vue.extend({
  components: {
    TheGame: () => import("../components/TheGame.vue"),
  },
  data() {
    const { encodedCategory, builtInCategoryTitle } = this.$route.params;
    let category: Category;
    let isEditable = false;

    return {
      category,
      encodedCategory,
      isEditable,
    };
  },
  async created() {
    const { encodedCategory, builtInCategoryTitle } = this.$route.params;
    let category: Category;
    let isEditable = false;
    try {
      if (encodedCategory) {
        category = await decodeCategory(encodedCategory);
        isEditable = true;
      } else if (builtInCategoryTitle) {
        category = await getDefaultCategoryByTitle(builtInCategoryTitle);
      }
    } catch (e) {
      this.$router.replace({ name: "home" });

      category = {
        title: "",
        words: [],
      };
    }

    this.category = category;
    this.isEditable = isEditable;
  },
});
</script>
