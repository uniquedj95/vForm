<template>
  <base-input
    v-model="model"
    type="email"
    :schema="props.schema"
  />
</template>

<script lang="ts" setup>
import { FormField, FormSchema } from "types";
import { PropType } from "vue";
import BaseInput from "./BaseInput.vue";

const props = defineProps<{ schema?: FormSchema }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {}});
</script>