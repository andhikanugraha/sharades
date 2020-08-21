<template>
  <header>
    <div class="close-button" @click="cancel">
      <v-icon :icon="faTimes" fixed-width />
    </div>
    <div class="pull-right">
      <v-icon
        :icon="faTrashAlt"
        class="delete-button"
        @click="deleteTopic"
        v-if="!isNew"
      />
      <v-icon :icon="faSave" @click="save" />
    </div>
    <h3 v-if="isNew">New Topic</h3>
    <h3 v-else>Edit Topic</h3>
  </header>
  <main>
    <div class="scrollable">
      <div class="info">
        <div class="label">Title:</div>
        <p>
          <v-editor-input
            type="text"
            v-model="viewTitle"
            :auto-focus="isNew"
            @keyup.enter="addWord"
          />
        </p>
      </div>
      <div class="info">
        <div class="label">Words:</div>
        <p v-for="(item, i) in wordList" :key="item.key" class="item">
          <v-editor-input
            v-model="item.word"
            :auto-focus="item.focus"
            @blur="onBlur(i)"
            @focus="onFocus(i)"
            @keyup.enter="addWord"
          />
          <span class="item-delete" @click="deleteWordAtIndex(i)">
            <v-icon :icon="faTimesCircle" />
          </span>
        </p>
        <p>
          <button @click="addWord">
            <v-icon :icon="faPlus" />
          </button>
        </p>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  reactive,
  watch,
  watchEffect,
} from 'vue';

import {
  faSave,
  faPlus,
  faTimes,
  faTimesCircle,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';

import VIcon from './VIcon.vue';
import VEditorInput from './VEditorInput.vue';
import { Topic } from '../lib/topic';

interface WordListItem {
  key: number;
  word: string;
  focus?: boolean;
}

export default defineComponent({
  name: 'TheEditor',
  props: {
    title: String,
    words: Array as { new (): string[] },
    id: String,
  },
  emits: {
    save: (topic: Topic) => !!topic,
    delete: () => true,
    cancel: () => true,
  },
  components: { VIcon, VEditorInput },
  setup(props, { emit }) {
    const viewTitle = ref(props.title || '');
    const wordList = reactive<WordListItem[]>(
      props.words?.map((word, key) => ({ key, word })) || [],
    );
    const maxKey = ref<number>(props.words?.length || 0);
    const emptyIndices = reactive(new Set<number>());
    const viewId = ref(props.id || '');
    const isNew = computed(() => !viewId.value);

    watchEffect(() => {
      viewTitle.value = props.title || '';
    });
    watch(props, (p) => {
      const words = p.words || [];
      wordList.splice(0);
      wordList.splice(0, 0, ...words.map((word, key) => ({ key, word })));
      maxKey.value = words.length;
    });

    const cancel = () => emit('cancel');
    const addWord = () => {
      wordList.push({
        word: '',
        key: maxKey.value,
        focus: true,
      });

      maxKey.value += 1;
    };
    const save = () => {
      const updatedTopic: Topic = {
        title: viewTitle.value,
        words: wordList.map((item) => item.word),
      };
      emit('save', updatedTopic);
    };
    const deleteTopic = () => {
      emit('delete');
    };
    const deleteWordAtIndex = (idx: number) => {
      wordList.splice(idx, 1);
    };
    const onBlur = (idx: number) => {
      if (wordList[idx].word.trim() === '') {
        emptyIndices.add(idx);
      }
    };
    const onFocus = () => {
      if (emptyIndices.size > 0) {
        emptyIndices.forEach((emptyIndex) => deleteWordAtIndex(emptyIndex));
        emptyIndices.clear();
      }
    };

    return {
      viewTitle,
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
      // icons
      faSave,
      faPlus,
      faTimes,
      faTimesCircle,
      faTrashAlt,
    };
  },
});
</script>
