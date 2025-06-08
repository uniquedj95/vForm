import { FormField, FormSchema } from 'types';
import { PropType, ref, defineProps, defineModel } from 'vue';
import BaseInput from '../components/inputs/BaseInput.vue';

/**
 * Composable for common input component logic
 */
export function useInputComponent() {
  const props = defineProps<{ schema?: FormSchema }>();
  const model = defineModel({ type: Object as PropType<FormField>, default: {} });
  const inputRef = ref<typeof BaseInput | null>(null);

  const exposedMethods = {
    onReset: () => inputRef.value?.onReset(),
    onValueUpdate: () => inputRef.value?.onValueUpdate(),
    getErrors: () => inputRef.value?.getErrors(),
  };

  return {
    props,
    model,
    inputRef,
    exposedMethods,
  };
}
