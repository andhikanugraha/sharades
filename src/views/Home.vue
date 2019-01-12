<template>
  <div class="root">
    <header>
      <h3>Piramida</h3>
    </header>
    <main>
      <div class="scrollable">
        <div class="info">
          <div class="label">Choose a category:</div>
          <p v-for="categoryTitle in categoryTitles" :key="categoryTitle">
            <button @click="openCategory(categoryTitle)">{{categoryTitle}}</button>
          </p>
          <p><button id="random" @click="random">Random</button></p>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TheGame from "../components/TheGame.vue";
import {
  encodeCategory,
  getAvailableCategoryTitles,
  getStoredCategory
} from "../category";

interface HomeData {
  categoryTitles: string[];
}
interface ComputedCategoryLink {
  title: string;
  encodedCategory: string;
}

export default Vue.extend({
  components: {
    TheGame
  },
  data(): HomeData {
    return {
      categoryTitles: []
    };
  },
  methods: {
    async openCategory(categoryTitle: string) {
      const categoryObj = await getStoredCategory(categoryTitle);
      const encodedCategory = encodeCategory(categoryObj);
      this.$router.push({ name: "game", params: { encodedCategory } });
    },

    random() {
      const randomIndex = Math.round(
        Math.random() * (this.categoryTitles.length - 1)
      );
      this.openCategory(this.categoryTitles[randomIndex]);
    }
  },
  async mounted() {
    const categoryTitles = await getAvailableCategoryTitles();
    this.categoryTitles = categoryTitles;
  }
});
</script>
