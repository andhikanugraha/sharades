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
              v-model.trim.lazy="_title"
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
            <span class="item-delete" @click="deleteWordAtIndex(i)">
              <font-awesome-icon icon="times-circle" />
            </span>
          </p>
          <p>
            <button @click="addWord">
              <font-awesome-icon icon="plus" />
            </button>
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  reactive,
  watch,
} from "@vue/composition-api";
import { Topic } from "../topic";
import {
  faSave,
  faPlus,
  faTimes,
  faTimesCircle,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import router from "../router";

interface WordListItem {
  key: number;
  word: string;
  focus?: boolean;
}

const TheEditor = defineComponent({
  props: {
    title: String,
    words: Array as { new (): string[] },
    id: String,
  },
  components: { FontAwesomeIcon },
  setup(props, { emit }) {
    const _title = ref(props.title || "");
    const wordList = reactive<WordListItem[]>(
      props.words?.map((word, key) => ({ key, word })) || []
    );
    const maxKey = ref<number>(props.words?.length || 0);
    const emptyIndices = reactive(new Set<number>());
    const _id = ref(props.id || "");
    const isNew = computed(() => !_id.value);

    watch(props, (props) => {
      const words = props.words || [];
      wordList.splice(0);
      wordList.splice(0, 0, ...words.map((word, key) => ({ key, word })));
      maxKey.value = words.length;
      _title.value = props.title || "";
    });

    const cancel = () => {
      if (_id.value) {
        router.push({
          name: "game-stored-topic",
          params: { id: _id.value },
        });
      } else {
        router.push({ name: "home" });
      }
    };
    const addWord = () => {
      wordList.push({
        word: "",
        key: maxKey.value,
        focus: true,
      });

      maxKey.value += 1;
    };
    const save = () => {
      const updatedTopic: Topic = {
        title: _title.value,
        words: wordList.map((item) => item.word),
      };
      emit("save", updatedTopic);
    };
    const deleteTopic = () => {
      emit("delete");
    };
    const onBlur = (idx: number) => {
      if (wordList[idx].word.trim() === "") {
        emptyIndices.add(idx);
      }
    };
    const onFocus = (idx: number) => {
      if (emptyIndices.size > 0) {
        for (let emptyIndex of emptyIndices) {
          deleteWordAtIndex(emptyIndex);
        }
        emptyIndices.clear();
      }
    };
    const deleteWordAtIndex = (idx: number) => {
      wordList.splice(idx, 1);
    };

    library.add(faSave, faPlus, faTimes, faTimesCircle, faTrashAlt);

    return {
      _title,
      wordList,
      maxKey,
      emptyIndices,
      isNew,
      cancel,
      addWord,
      save,
      deleteTopic,
      onBlur,
      onFocus,
      deleteWordAtIndex,
    };
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

export default TheEditor;
</script>
