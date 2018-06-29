<template>
  <div class="root">
    <header>
      <h3><input type="text" v-model.trim.lazy="title"></h3>
    </header>
    <main>
      <div>
        <p v-for="(item, i) in wordList" :key="item.key">
          <input type="text" v-model.trim.lazy="item.word" @blur="onBlur(i)" @focus="onFocus(i)" v-focus="item.focus">
        </p>
      </div>
    </main>
    <nav>
      <p>
        <button @click="addWord">Add</button>
      </p>
      <p>
        <button @click="save">Save</button>
      </p>
    </nav>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { decodeCategory, encodeCategory, Category } from "../category";

interface WordListItem {
  key: number;
  word: string;
  focus?: boolean;
}

export default Vue.extend({
  data() {
    const decodedCategory = decodeCategory(this.$route.params.encodedCategory);
    return {
      title: decodedCategory.title,
      wordList: decodedCategory.words.map(
        (word, i): WordListItem => {
          return {
            key: i,
            word
          };
        }
      ),
      maxKey: decodedCategory.words.length,
      emptyIndices: new Set<number>()
    };
  },
  methods: {
    addWord() {
      this.wordList.push({
        word: "",
        key: this.maxKey,
        focus: true
      });

      this.maxKey = this.maxKey + 1;
    },
    save() {
      const updatedCategory: Category = {
        title: this.title,
        words: this.wordList.map(item => item.word)
      };
      const encodedCategory = encodeCategory(updatedCategory);
      this.$router.push({ name: "game", params: { encodedCategory } });
    },
    onBlur(idx: number) {
      if (this.wordList[idx].word.trim() === "") {
        this.emptyIndices.add(idx);
      }
    },
    onFocus(idx: number) {
      if (this.emptyIndices.size > 0) {
        for (let emptyIndex of this.emptyIndices) {
          this.wordList.splice(emptyIndex, 1);
        }
        this.emptyIndices = new Set();
      }
    }
  },
  directives: {
    focus: {
      inserted(el, binding) {
        if (binding.value) {
          el.focus();
        }
      }
    }
  }
});
</script>
