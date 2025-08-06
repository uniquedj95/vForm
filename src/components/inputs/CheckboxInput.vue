<template>
  <ion-checkbox
    v-model="input"
    ref="inputRef"
    justify="start"
    :class="model.className"
    :required="model.required"
    :error-text="model.error"
    :disabled="model.disabled"
    @ionFocus="onFocus"
    @ionChange="onValueUpdate"
    @ion-blur="onValueUpdate"
    style="width: 100%"
  >
    {{ labelTextWithAsterisk }}
  </ion-checkbox>
</template>

<script lang="ts" setup>
import { IonCheckbox } from '@ionic/vue';
import { FormField, FormSchema } from '@/types';
import { ComponentPublicInstance, PropType, ref, watch, computed } from 'vue';
import { useInputValidation } from '@/composables/useInputValidation';
import { getLabelText } from '@/utils';

const props = defineProps<{ schema?: FormSchema }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<ComponentPublicInstance | null>(null);
const input = ref(model.value.value as boolean);
const schema = computed(() => props.schema);

// Use checkbox label text composable
const labelTextWithAsterisk = computed(() => getLabelText(model.value));

// Use input validation composable with custom default value for checkbox
const { onValueUpdate, onFocus, getErrors } = useInputValidation(inputRef, model, input, schema);

// Custom onReset for checkbox (default to false)
function onReset() {
  input.value = false;
  model.value.error = '';
  model.value.value = false;
}

watch(
  () => model.value.value,
  v => (input.value = v as boolean)
);

defineExpose({
  onValueUpdate,
  onReset,
  getErrors,
});
</script>
