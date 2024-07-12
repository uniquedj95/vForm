<template>
  <base-input
    v-model="model"
    :type="inputType"
    :schema="props.schema"
  />
</template>

<script lang="ts" setup>
import { FormField, FormSchema, TextFieldTypes } from "types";
import { computed, PropType } from "vue";
import BaseInput from "./BaseInput.vue";

const props = defineProps<{ schema?: FormSchema }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {}});
const inputType = computed(() => model.value.type.split(/(?=[A-Z])/)[0].toLowerCase() as TextFieldTypes);
</script>