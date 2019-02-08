<template>
  <div class="root">
    <header>
      <div class="pull-left">
        <font-awesome-icon class="expand-button" icon="expand" @click="requestFullscreen" />
        <font-awesome-icon class="compress-button" icon="compress" @click="exitFullscreen" />
      </div>
      <h3>Sharades</h3>
    </header>
    <main>
      <div class="scrollable">
        <div class="info">
          <div class="label">Choose a category:</div>
          <p v-for="categoryTitle in categoryTitles" :key="categoryTitle">
            <button @click="openCategory(categoryTitle)">{{categoryTitle}}</button>
          </p>
          <hr>
          <p v-for="(item, index) in storedCategories" :key="index">
            <button @click="openStoredCategory(index)">{{item.title}}</button>
          </p>
          <p><button id="create" @click="createNewCategory">Create new category</button></p>
          <hr>
          <p><button id="random" @click="random">Random</button></p>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  encodeCategory,
  getAvailableCategoryTitles,
  listStoredCategories,
  Category
} from "../category";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faExpand, faCompress } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faExpand, faCompress);

interface HomeData {
  categoryTitles: string[];
  storedCategories: Category[];
}
interface ComputedCategoryLink {
  title: string;
  encodedCategory: string;
}

export default Vue.extend({
  components: {
    FontAwesomeIcon
  },
  data(): HomeData {
    return {
      categoryTitles: [],
      storedCategories: []
    };
  },
  async created() {
    const storedCategories = await listStoredCategories();
    this.storedCategories = storedCategories;
  },
  methods: {
    async openCategory(categoryTitle: string) {
      try {
        await this.requestFullscreen();
      } finally {
        this.$router.push({
          name: "game-built-in",
          params: {
            builtInCategoryTitle: categoryTitle
          }
        });
      }
    },

    async openStoredCategory(index: number) {
      const encodedCategory = encodeCategory(this.storedCategories[index]);
      this.$router.push({
        name: "game",
        params: { encodedCategory }
      });
    },

    createNewCategory() {
      this.$router.push({
        name: "edit-new"
      });
    },

    async requestFullscreen() {
      return document.body.requestFullscreen();
    },

    async exitFullscreen() {
      return document.exitFullscreen();
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

<style lang="scss">
:fullscreen .expand-button {
  display: none;
}
body:not(:fullscreen) .compress-button {
  display: none;
}
</style>
