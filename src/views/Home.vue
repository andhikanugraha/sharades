<template>
  <div class="root">
    <header>
      <h3>Charades</h3>
    </header>
    <main>
      <div>
        <ol>
        <li v-for="cat in categoryLinks" :key="cat.title">
          <router-link tag="button" :to="{name: 'game', params: {encodedCategory: cat.encodedCategory}}">{{cat.title}}</router-link>
        </li>
        </ol>
      </div>
    </main>
    <nav>
      <p><button id="random" @click="random">Random</button></p>
    </nav>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import TheGame from '../components/TheGame.vue';
import { encodeCategory } from '../category';

// tslint:disable-next-line
const categories: any[] = require("../defaultCategories.json");

interface HomeData {
  categories: any[];
}
interface ComputedCategoryLink {
  title: string;
  encodedCategory: string;
}

export default Vue.extend({
  components: {
    TheGame,
  },
  data(): HomeData {
    return {
      categories,
    };
  },
  computed: {
    categoryLinks(): ComputedCategoryLink[] {
      return this.categories.map((cat) => {
        return {
          title: cat.title,
          encodedCategory: encodeCategory(cat),
        };
      });
    },
  },
  methods: {
    random() {
      const randomIndex = Math.round(
        Math.random() * (this.categories.length - 1),
      );
      const encodedCategory = this.categoryLinks[randomIndex].encodedCategory;
      this.$router.push({
        name: 'game',
        params: { encodedCategory },
      });
    },
  },
});
</script>
