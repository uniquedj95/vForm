import { defineComponent, ref, defineModel } from 'vue';
import { FormField, FormSchema } from 'types';
import BaseInput from '../components/inputs/BaseInput.vue';

/**
 * Factory function to create simple input components that wrap BaseInput
 * Reduces duplication for TextInput, EmailInput, PasswordInput, NumberInput
 */
export function createSimpleInputComponent(inputType: string) {
  return defineComponent({
    name: `${inputType}Input`,
    props: {
      schema: {
        type: Object as () => FormSchema,
        required: false,
      },
    },
    setup(props, { expose }) {
      const model = defineModel({
        type: Object as () => FormField,
        default: () => ({}),
      });
      const inputRef = ref<typeof BaseInput | null>(null);

      const exposedMethods = {
        onReset: () => inputRef.value?.onReset(),
        onValueUpdate: () => inputRef.value?.onValueUpdate(),
        getErrors: () => inputRef.value?.getErrors(),
      };

      expose(exposedMethods);

      return {
        model,
        inputRef,
        props,
      };
    },
    template: `
      <base-input
        v-model="model"
        :type="${inputType}"
        :schema="props.schema"
        ref="inputRef"
      />
    `,
    components: {
      BaseInput,
    },
  });
}
