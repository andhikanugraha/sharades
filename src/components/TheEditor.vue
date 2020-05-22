<template>
  <div class="root">
    <header>
      <div class="close-button" @click="cancel">
        <font-awesome-icon icon="times" fixed-width />
      </div>
      <div class="pull-right">
        <font-awesome-icon
          icon="trash-alt"
          class="delete-button"
          @click="deleteCategory"
          v-if="!isNew"
        />
        <font-awesome-icon icon="save" @click="save" />
      </div>
      <h3 v-if="isNew">New Category</h3>
      <h3 v-else>Edit Category</h3>
    </header>
    <main>
      <div class="scrollable">
        <div class="info">
          <div class="label">Title:</div>
          <p>
            <input
              type="text"
              v-model.trim.lazy="title"
              @keyup.enter="addWord"
            />
          </p>
        </div>
        <div class="info">
          <div class="label">Words:</div>
          <p v-for="(item, i) in wordList" :key="item.key" class="item">
            <input
              type="text"
              v-model.trim.lazy="item.word"
              @blur="onBlur(i)"
              @focus="onFocus(i)"
              v-focus="item.focus"
              @keyup.enter="addWord"
            />
            <span class="item-delete" @click="deleteWordAtIndex(i)"
              ><font-awesome-icon icon="times-circle"
            /></span>
          </p>
          <p>
            <button @click="addWord"><font-awesome-icon icon="plus" /></button>
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { encodeCategory, Category } from "../category";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faSave,
  faPlus,
  faTimes,
  faTimesCircle,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

library.add(faSave, faPlus, faTimes, faTimesCircle, faTrashAlt);

interface WordListItem {
  key: number;
  word: string;
  focus?: boolean;
}

export default Vue.extend({
  props: ["category", "originalEncodedCategory"],
  components: {
    FontAwesomeIcon,
  },
  data() {
    const category: Category = this.category || {
      title: "",
      words: [],
    };
    return {
      title: category.title,
      wordList: category.words.map(
        (word, i): WordListItem => {
          return {
            key: i,
            word,
          };
        }
      ),
      maxKey: category.words.length,
      emptyIndices: new Set<number>(),
    };
  },
  computed: {
    isNew() {
      return !this.originalEncodedCategory;
    },
  },
  methods: {
    cancel() {
      if (this.originalEncodedCategory) {
        this.$router.push({
          name: "game",
          params: {
            encodedCategory: this.originalEncodedCategory,
          },
        });
      } else {
        this.$router.push({ name: "home" });
      }
    },
    addWord() {
      this.wordList.push({
        word: "",
        key: this.maxKey,
        focus: true,
      });

      this.maxKey = this.maxKey + 1;
    },
    save() {
      const updatedCategory: Category = {
        title: this.title,
        words: this.wordList.map((item) => item.word),
      };
      const encodedCategory = encodeCategory(updatedCategory);
      this.$emit("save", updatedCategory);
    },
    deleteCategory() {
      this.$emit("delete", this.originalEncodedCategory);
    },
    onBlur(idx: number) {
      if (this.wordList[idx].word.trim() === "") {
        this.emptyIndices.add(idx);
      }
    },
    onFocus(idx: number) {
      if (this.emptyIndices.size > 0) {
        for (let emptyIndex of this.emptyIndices) {
          this.deleteWordAtIndex(emptyIndex);
        }
        this.emptyIndices = new Set();
      }
    },
    deleteWordAtIndex(idx: number) {
      this.wordList.splice(idx, 1);
    },
  },
  directives: {
    focus: {
      inserted(el, binding) {
        if (binding.value) {
          el.focus();
        }
      },
    },
  },
});
</script>
