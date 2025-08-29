<template>
  <div
    v-for="(child, index) of childrens"
    class="repeat-input-wrapper"
    :class="model.className"
    :key="index"
  >
    <ion-row class="repeat-row">
      <ion-col size="11" class="form-fields-column">
        <ion-row class="fields-row">
          <template v-for="formId of Object.keys(child)">
            <IonCol
              :key="`${index}-${formId}`"
              :size="child[formId].grid?.xs ?? '12'"
              :size-sm="child[formId].grid?.sm"
              :size-md="child[formId].grid?.md"
              :size-lg="child[formId].grid?.lg"
              :size-xl="child[formId].grid?.xl"
              class="ion-margin-bottom"
              v-if="canRenderField(child[formId], data, computedData)"
            >
              <component
                :is="child[formId].type"
                v-model="child[formId]"
                :schema="child"
                :ref-key="`${index}-${formId}`"
                ref="dynamicRefs"
                style="width: 100%"
              />
            </IonCol>
          </template>
        </ion-row>
      </ion-col>
      <ion-col size="1" class="button-column">
        <div class="button-container">
          <ion-button
            @click="addSet"
            color="primary"
            size="small"
            v-if="index === childrens.length - 1"
          >
            <ion-icon slot="icon-only" :icon="add"></ion-icon>
          </ion-button>
          <ion-button
            @click="removeSet(index)"
            color="warning"
            size="small"
            v-if="childrens.length > 1"
          >
            <ion-icon slot="icon-only" :icon="remove"></ion-icon>
          </ion-button>
        </div>
      </ion-col>
    </ion-row>
  </div>
</template>

<script setup lang="ts">
import { ComputedData, FormData, FormField, FormSchema, Option } from '@/types';
import { IonRow, IonCol, IonButton, IonIcon } from '@ionic/vue';
import { canRenderField, deepClone, isFormField, resetFormInputsWithCustomResolver } from '@/utils';
import { useFormValidation } from '@/composables/useFormValidation';
import { computed, onMounted, PropType, ref, watch } from 'vue';
import { add, remove } from 'ionicons/icons';

interface PropsI {
  schema?: FormSchema;
  data: FormData;
  computedData: ComputedData;
}

const props = defineProps<PropsI>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const childrens = ref<FormSchema[]>([]);

// Use form validation composable
const { dynamicRefs, getFormErrors, updateFormValues } = useFormValidation();

const inputValue = computed<Array<Option>>(() => {
  return childrens.value.map((child, index) => ({
    label: `Set ${index + 1}`,
    value: index,
    other: Object.entries(child).reduce(
      (acc, [id, field]) => {
        // Only process FormField items, not FormSection items
        if (isFormField(field)) {
          acc[id] = field.value;
        }
        return acc;
      },
      {} as Record<string, any>
    ),
  }));
});

watch(
  inputValue,
  value => {
    model.value.value = value;
  },
  { deep: true, immediate: true }
);

onMounted(addSet);

function addSet() {
  if (model.value.children) {
    childrens.value.push(deepClone<FormSchema>(model.value.children));
  }
}

function removeSet(index: number) {
  childrens.value.splice(index, 1);
}

function onReset() {
  // Create a resolver function for the RepeatInput's nested schema structure
  const getFieldFromRefKey = (refKey: string) => {
    // Parse the ref-key format: "${index}-${formId}"
    const [indexStr, formId] = refKey.split('-');
    const index = parseInt(indexStr, 10);

    if (!isNaN(index) && formId && childrens.value[index] && childrens.value[index][formId]) {
      return childrens.value[index][formId];
    }

    return null;
  };

  // Use the utility function with our custom resolver
  resetFormInputsWithCustomResolver(
    dynamicRefs.value,
    props.data,
    props.computedData,
    getFieldFromRefKey
  );
}

function getErrors() {
  return getFormErrors();
}

async function onValueUpdate() {
  await updateFormValues();
}

defineExpose({
  onValueUpdate,
  onReset,
  getErrors,
});
</script>

<style scoped>
.repeat-input-wrapper {
  margin-bottom: var(--form-margin-bottom, 10px);
}

.repeat-row {
  width: 100%;
  margin: 0;
  align-items: center; /* Aligns children vertically center */
}

.form-fields-column {
  padding-right: 0;
  display: flex; /* Enable flexbox */
  align-items: center; /* Center vertically */
}

.fields-row {
  width: 100%;
  margin-top: 0;
}

.button-column {
  padding: 0 var(--form-button-padding, 10px);
  display: flex;
  align-items: center; /* Changed from flex-start to center for better vertical alignment */
}

.action-button {
  margin: 0;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  padding-top: 10px; /* Added padding to align with form content */
}
</style>
