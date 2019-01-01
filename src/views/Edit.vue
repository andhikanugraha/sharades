<template>
  <the-editor :category="category" @save="handleSave"/>
</template>

<script lang="ts">
import Vue from "vue";
import TheEditor from "../components/TheEditor.vue";
import {
  decodeCategory,
  encodeCategory,
  Category,
  defaultCategoriesByTitle,
  compareCategory
} from "../category";
import { decode } from "punycode";

interface WordListItem {
  key: number;
  word: string;
  focus?: boolean;
}

export default Vue.extend({
  components: {
    TheEditor
  },
  data() {
    let decodedCategory: Category;
    let existing: boolean;
    if (this.$route.params.encodedCategory) {
      try {
        decodedCategory = decodeCategory(this.$route.params.encodedCategory);
        existing = true;
      } catch (e) {
        this.$router.push({ name: "home" });
      }
    } else {
      decodedCategory = {
        title: "",
        words: []
      };
      existing = false;
    }

    return {
      category: decodedCategory,
      existing
    };
  },
  methods: {
    handleSave(updatedCategory: Category) {
      // Logic:
      // If editing a default category, save it as new.
      // If it's a new category, save it as new.
      //   If there's a name conflict, resolve it automatically.
      // If editing a custom category, see if there are any changes
      //   If there are any changes, overwrite the old one
      //   If there are no changes, do nothing

      let treatAsNew = false;

      // Check if the category before editing was a default category
      let wasDefaultCategory = true;
      if (defaultCategoriesByTitle.get(this.category.title)) {
        wasDefaultCategory = true;
      }

      this.$router.push({
        name: "game",
        params: { encodedCategory: encodeCategory(updatedCategory) }
      });
    }
  }
});
</script>
