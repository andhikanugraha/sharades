<template>
  <input
    type="text"
    ref="input"
    v-model.trim.lazy="value"
    @blur="blur"
    @focus="focus"
    @keyup="keyup($event)"
  />
</template>

<script lang="ts">
import {
  defineComponent, watch, ref, onMounted, watchEffect,
} from 'vue';

export default defineComponent({
  name: 'VEditorInput',
  props: {
    modelValue: String,
    autoFocus: Boolean,
  },
  setup(props, { emit }) {
    const value = ref(props.modelValue);
    const input = ref<HTMLInputElement>();
    const blur = () => emit('blur');
    const focus = () => emit('focus');
    const keyup = (e: KeyboardEvent) => emit('keyup', e);
    const doDelete = () => emit('delete');

    watchEffect(() => {
      value.value = props.modelValue;
      if (props.autoFocus) {
        onMounted(() => input.value?.focus());
      }
    });
    watch(value, (v) => emit('update:modelValue', v));

    return {
      value,
      input,
      blur,
      focus,
      keyup,
      doDelete,
    };
  },
});
</script>
