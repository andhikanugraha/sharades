<template>
  <header>
    <div class="close-button" @click="cancel">
      <v-icon :icon="faTimes" fixed-width />
    </div>
    <div class="pull-right">
      <v-icon :icon="faFileDownload" @click="handleExport" v-if="canSave" />
      <v-icon :icon="faCheck" @click="save" v-if="canSave" />
    </div>
    <h3 v-if="isNew">New Topic</h3>
    <h3 v-else>Edit Topic</h3>
  </header>
  <main class="editor">
    <div class="info">
      <div class="label">Title:</div>
      <p>
        <v-editor-input
          type="text"
          v-model="viewTitle"
          :auto-focus="isNew"
          @keyup.enter="handleEnter"
          @paste="handlePaste"
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
          @focus="onFocus"
          @keyup.enter="handleEnter"
          @paste="handlePaste"
        />
        <span class="item-delete" @click="deleteWordAtIndex(i)">
          <v-icon :icon="faTimesCircle" />
        </span>
      </p>
      <p>
        <button @click="addWord('')">
          <v-icon :icon="faPlus" />
          Add Word
        </button>
      </p>
      <hr>
      <p>
        <button @click="handleImport">
          <v-icon :icon="faFileUpload" />
          Import text file
        </button>
      </p>
      <p>
        <button @click="handleAddFromClipboard">
          <v-icon :icon="faPaste" />
          Paste from clipboard
        </button>
      </p>
      <hr>
      <template v-if="canSave">
        <p>
          <button @click="save">
            <v-icon :icon="faCheck" />
            Save
          </button>
        </p>
        <p>
          <button @click="handleExport">
            <v-icon :icon="faFileDownload" />
            Export text file
          </button>
        </p>
      </template>
      <p class="label" v-else>You need a title and at least 2 words</p>
      <template v-if="!isNew">
        <hr>
        <p v-if="!isNew">
          <button @click="deleteTopic" class="destructive">
            <v-icon :icon="faTrashAlt" />
            Delete topic
          </button>
        </p>
      </template>
    </div>
  </main>
</template>

<script lang="ts" setup>
import {
  ref,
  computed,
  reactive,
  watch,
  watchEffect,
} from 'vue';

import {
  faCheck,
  faPlus,
  faTimes,
  faTimesCircle,
  faTrashAlt,
  faPaste,
  faFileDownload,
  faFileUpload,
} from '@fortawesome/free-solid-svg-icons';

import VIcon from './VIcon.vue';
import VEditorInput from './VEditorInput.vue';
import { Topic } from '../lib/topic';

interface WordListItem {
  key: number;
  word: string;
  focus?: boolean;
}

const props = defineProps({
  title: String,
  words: Array as { new (): string[] },
  id: String,
});

const emit = defineEmits({
  save: (topic: Topic) => !!topic,
  delete: () => true,
  cancel: () => true,
});

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

function cancel() {
  emit('cancel');
}

function addWord(word = '') {
  wordList.push({
    word,
    key: maxKey.value,
    focus: true,
  });

  maxKey.value += 1;
}

function handleEnter() {
  addWord('');
}

function processBulkInput(multiLineInput: string) {
  const words = multiLineInput.split(/[\r\n]+/);
  words.forEach((word) => addWord(word));
}

function handlePaste(event: ClipboardEvent) {
  const copied = event.clipboardData?.getData('text/plain').trim();
  if (copied && copied.includes('\n')) {
    event.preventDefault();
    window.getSelection()?.deleteFromDocument();
    const words = copied?.split(/[\r\n]+/);
    words?.forEach((word) => addWord(word));
  }
}

async function handleAddFromClipboard() {
  try {
    const rawInput = await navigator.clipboard.readText();
    processBulkInput(rawInput);
  } catch (e) {
    console.log(e);
    // do nothing
  }
}

async function handleImport() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.onchange = async () => {
    if (fileInput.value && fileInput.files) {
      const selectedFile = fileInput.files[0];
      if (!viewTitle.value) {
        const filename = selectedFile.name;
        viewTitle.value = filename.substring(0, filename.length - 4);
      }
      const importedText = await selectedFile.text();
      processBulkInput(importedText);
    }
  };
  fileInput.click();
}

async function handleExport() {
  const text = wordList.map((w) => w.word).join('\n');
  const filename = `${viewTitle.value}.txt`;
  const file = new File([text], filename, { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();
}

const canSave = computed(() => viewTitle.value && wordList.length > 1);

function save() {
  if (!canSave.value) return;

  const updatedTopic: Topic = {
    title: viewTitle.value,
    words: wordList.map((item) => item.word),
  };
  emit('save', updatedTopic);
}

function deleteTopic() {
  // eslint-disable-next-line no-alert, no-restricted-globals
  if (confirm('Are you sure you want to delete this topic?')) {
    emit('delete');
  }
}

function deleteWordAtIndex(idx: number) {
  wordList.splice(idx, 1);
}

function onBlur(idx: number) {
  if (wordList[idx].word.trim() === '') {
    emptyIndices.add(idx);
  }
}

function onFocus() {
  if (emptyIndices.size > 0) {
    emptyIndices.forEach((emptyIndex) => deleteWordAtIndex(emptyIndex));
    emptyIndices.clear();
  }
}
</script>
