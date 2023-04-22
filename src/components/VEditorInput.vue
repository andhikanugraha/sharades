<template>
  <input
    type="text"
    ref="input"
    v-model.trim.lazy="value"
  />
</template>

<script lang="ts" setup>
import {
  watch, ref, onMounted, watchEffect,
} from 'vue';

const props = defineProps({
  modelValue: String,
  autoFocus: Boolean,
});

const emit = defineEmits(['delete', 'update:modelValue']);

const value = ref(props.modelValue);
const input = ref<HTMLInputElement>();

onMounted(() => {
  if (props.autoFocus) input.value?.focus();
});
watchEffect(() => {
  value.value = props.modelValue;
});
watch(value, (v) => emit('update:modelValue', v));

</script>
