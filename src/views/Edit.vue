<template>
  <the-editor
    v-if="category"
    :category="category"
    :originalEncodedCategory="originalEncodedCategory"
    @save="handleSave"
    @delete="handleDelete"
  />
</template>

<script lang="ts">
import Vue from "vue";
import {
  decodeCategory,
  encodeCategory,
  Category,
  compareCategory,
  updateCategory,
  removeCategory,
} from "../category";
import { decode } from "punycode";

interface WordListItem {
  key: number;
  word: string;
  focus?: boolean;
}

export default Vue.extend({
  components: {
    TheEditor: () => import("../components/TheEditor.vue"),
  },
  data() {
    const { encodedCategory } = this.$route.params;
    return {
      category: null,
      originalEncodedCategory: encodedCategory,
      existing: false,
    };
  },
  async created() {
    const { encodedCategory } = this.$route.params;
    let decodedCategory: Category;
    let existing: boolean;
    if (encodedCategory) {
      try {
        decodedCategory = await decodeCategory(
          this.$route.params.encodedCategory
        );
        existing = true;
      } catch (e) {
        this.$router.push({ name: "home" });
      }
    } else {
      decodedCategory = {
        title: "",
        words: [],
      };
      existing = false;
    }

    this.category = decodedCategory;
    this.existing = existing;
  },
  methods: {
    async handleSave(updatedCategory: Category) {
      // Logic:
      // If editing a default category, save it as new.
      // If it's a new category, save it as new.
      //   If there's a name conflict, resolve it automatically.
      // If editing a custom category, see if there are any changes
      //   If there are any changes, overwrite the old one
      //   If there are no changes, do nothing

      let treatAsNew = false;

      const { originalEncodedCategory = "" } = this;
      await updateCategory(originalEncodedCategory, updatedCategory);

      this.$router.push({
        name: "game",
        params: { encodedCategory: await encodeCategory(updatedCategory) },
      });
    },

    async handleDelete(encodedCategory: string) {
      await removeCategory(encodedCategory);
      this.$router.push({ name: "home" });
    },
  },
});
</script>
