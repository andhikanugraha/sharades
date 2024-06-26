<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';

import {
  faCopy,
  faEdit,
  faShare,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';

import VIcon from './VIcon.vue';
import { exitFullscreen } from '../lib/fullscreen';

const props = defineProps<{
  title: string | undefined
  isEditable: boolean
}>();

const emit = defineEmits<{(e: 'close' | 'edit'): void}>();

const VueQrcode = defineAsyncComponent(() => import('@chenfengyuan/vue-qrcode'));

function getShareUrl() {
  return `https://sharades.app/${window.location.hash}`;
}

function doCopy() {
  try {
    navigator.clipboard.writeText(getShareUrl());
  } finally {
    // do nothing
  }
}

async function doShare() {
  try {
    await exitFullscreen(false);
    await navigator.share({
      title: `Sharades: ${props.title}`,
      text: `Play the topic ${props.title} on Sharades`,
      url: getShareUrl(),
    });
  } catch {
    doCopy();
  }
}
</script>

<template>
  <header>
    <div class="close-button" @click="emit('close')">
      <v-icon :icon="faArrowLeft" />
    </div>
    <div class="pull-right">
      <v-icon v-if="props.isEditable" @click="emit('close'); emit('edit')" :icon="faEdit" />
    </div>
    <h3>Sharades</h3>
  </header>
  <main class="share-dialog">
    <div class="qr-col">
      <div class="qr"><vue-qrcode :value="getShareUrl()" tag="svg" /></div>
    </div>
    <div class="btns">
      <p>Play this topic with friends</p>
      <h3 class="topic-title">{{ props.title }}</h3>
      <hr>
      <p>
        <button @click="doShare"><v-icon :icon="faShare" /> Share</button>
      </p>
      <p>
        <button @click="doCopy"><v-icon :icon="faCopy" /> Copy link</button>
      </p>
    </div>
  </main>
</template>

<style>
.share-dialog {
  display: flex;
  align-items: center;
}

@media (max-height: 500px) {
  .share-dialog {
    flex-direction: row;
  }
  .qr-col {
    flex: 0;
    display: flex;
    padding: 0 calc(var(--spacer) * 2)
  }
  .btns {
    flex: 1;
  }
}
@media (min-height: 501px) {
  .btns {
    padding: calc(var(--spacer) * 2)
  }
}

.qr {
  background: #fff;
  margin: var(--spacer);
  border: calc(var(--border-radius) / 2) solid #fff;
  border-radius: calc(var(--border-radius) / 2);
  width: 200px;
  height: 200px;
  box-sizing: content-box;
}
</style>
