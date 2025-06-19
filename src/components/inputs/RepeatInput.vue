<template>
  <div v-for="(child, index) of childrens" class="repeat-input-wrapper" :key="index">
    <div class="ion-margin-end" style="flex-grow: 1">
      <ion-row>
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
            />
          </IonCol>
        </template>
      </ion-row>
    </div>
    <div style="display: flex; justify-content: flex-end">
      <ion-button @click="addSet" color="primary" v-if="index === childrens.length - 1">
        <ion-icon slot="icon-only" :icon="add"></ion-icon>
      </ion-button>
      <ion-button @click="removeSet(index)" color="warning" v-if="childrens.length > 1">
        <ion-icon slot="icon-only" :icon="remove"></ion-icon>
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ComputedData, FormData, FormField, FormSchema, Option } from '@/types';
import { IonRow, IonCol, IonButton, IonIcon } from '@ionic/vue';
import { canRenderField, deepClone } from '@/utils';
import { useFormValidation } from '@/composables/useFormValidation';
import { computed, onMounted, PropType, ref, watch } from 'vue';
import { add, remove } from 'ionicons/icons';

interface PropsI {
  schema?: FormSchema;
  data: FormData;
  computedData: ComputedData;
}

defineProps<PropsI>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const childrens = ref<FormSchema[]>([]);

// Use form validation composable
const { dynamicRefs, resetForm, getFormErrors, updateFormValues } = useFormValidation();

const inputValue = computed<Array<Option>>(() => {
  return childrens.value.map((child, index) => ({
    label: `Set ${index + 1}`,
    value: index,
    other: Object.entries(child).reduce(
      (acc, [id, field]) => {
        acc[id] = field.value;
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
  resetForm();
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
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
</style>
