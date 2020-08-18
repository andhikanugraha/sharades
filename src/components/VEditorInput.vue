<template>
  <span>
    <input
      type="text"
      ref="input"
      v-model.trim.lazy="value"
      @blur="blur"
      @focus="focus"
      @keyup="keyup"
    />
  </span>
</template>

<script lang="ts">
import { defineComponent, watch, ref, onMounted } from "@vue/composition-api";

const VEditorInput = defineComponent({
  props: {
    modelValue: String,
    index: Number,
  },
  setup(props, { emit }) {
    const value = ref(props.modelValue);
    const input = ref<HTMLInputElement>();
    const blur = () => emit("blur");
    const focus = () => emit("focus");
    const keyup = () => emit("keyup");

    onMounted(() => input.value?.focus());
    watch(value, (v) => emit("update:modelValue", v));

    return {
      value,
      input,
      blur,
      focus,
      keyup,
    };
  },
});

export default VEditorInput;
</script>
