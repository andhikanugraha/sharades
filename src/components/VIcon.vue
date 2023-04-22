<template>
  <svg
    aria-hidden="true"
    focusable="false"
    role="img"
    :data-prefix="prefix"
    :data-icon="iconName"
    :viewBox="viewBox"
    :class="combinedClass">
    <path fill="currentColor" :d="svgPathData" class="" />
  </svg>
</template>

<script lang="ts" setup>
import {
  PropType, ref, reactive, computed,
} from 'vue';
import type {
  IconDefinition, IconLookup,
} from '@fortawesome/free-solid-svg-icons';

type Icon = IconDefinition & IconLookup;

const props = defineProps({
  icon: {
    type: Object as PropType<Icon>,
    required: true,
  },
  class: String,
  fixedWidth: Boolean,
});

const icon = reactive(props.icon.icon);
const iconName = ref(props.icon.iconName);
const prefix = ref(props.icon.prefix);

const viewBox = computed(() => `0 0 ${icon[0]} ${icon[1]}`);
const svgPathData = computed(() => icon[4] as string);

const combinedClass = computed(() => `${props.class || ''} icon`.trim());
</script>

<style>
.icon {
  width: 1.25em;
  height: 1em;
  vertical-align: -0.125em;
}
</style>
