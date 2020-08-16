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
          @click="deleteTopic"
          v-if="!isNew"
        />
        <font-awesome-icon icon="save" @click="save" />
      </div>
      <h3 v-if="isNew">New Topic</h3>
      <h3 v-else>Edit Topic</h3>
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
import { encodeTopic, Topic } from "../topic";
import {
  faSave,
  faPlus,
  faTimes,
  faTimesCircle,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

interface WordListItem {
  key: number;
  word: string;
  focus?: boolean;
}

export default Vue.extend({
  props: ["topic", "originalEncodedTopic"],
  components: {
    FontAwesomeIcon: async () =>
      (await import("@fortawesome/vue-fontawesome")).FontAwesomeIcon,
  },
  data() {
    const topic: Topic = this.topic || {
      title: "",
      words: [],
    };
    return {
      title: topic.title,
      wordList: topic.words.map(
        (word, i): WordListItem => {
          return {
            key: i,
            word,
          };
        }
      ),
      maxKey: topic.words.length,
      emptyIndices: new Set<number>(),
    };
  },
  async created() {
    const { library } = await import("@fortawesome/fontawesome-svg-core");
    library.add(faSave, faPlus, faTimes, faTimesCircle, faTrashAlt);
  },
  computed: {
    isNew() {
      return !this.originalEncodedTopic;
    },
  },
  methods: {
    cancel() {
      if (this.originalEncodedTopic) {
        this.$router.push({
          name: "game",
          params: {
            encodedTopic: this.originalEncodedTopic,
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
      const updatedTopic: Topic = {
        title: this.title,
        words: this.wordList.map((item) => item.word),
      };
      const encodedTopic = encodeTopic(updatedTopic);
      this.$emit("save", updatedTopic);
    },
    deleteTopic() {
      this.$emit("delete", this.originalEncodedTopic);
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
