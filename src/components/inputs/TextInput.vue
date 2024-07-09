<template>
  <ion-label class="ion-padding-bottom bold" v-if="model.label">
    <span>{{ model.label }}</span>
    <span v-if="model.required" class="text-danger"> *</span>
    <span
      class="ion-float-right ion-margin-end checkbox-label"
      v-if="model.allowUnknown"
    >
      {{ model.label }} Unknown?
      <ion-checkbox v-model="isUnknown"></ion-checkbox>
    </span>
  </ion-label>
  <div
    class="ion-margin-top outer-input-wrapper"
    :class="model.error ? 'box-input-error' : 'box-input'"
  >
    <div v-if="model.prefix" class="pre-suffix-wrapper">
      <ion-label class="checkbox-label bold">{{ model.prefix }}</ion-label>
    </div>
    <div class="inner-input-wrapper">
      <ion-input
        class="ion-no-margin ion-no-padding"
        v-model="model.value"
        :placeholder="model.placeholder"
        :disabled="model.disabled || isUnknown"
        :autoFocus="model.autoFocus"
        @ionFocus="model.error = ''"
        @ionBlur="validate"
      />
    </div>
    <div v-if="model.suffix" class="pre-suffix-wrapper">
      <ion-label class="checkbox-label bold ion-float-right">
        {{ model.suffix }}
      </ion-label>
    </div>
  </div>
  <ion-note v-if="model.error" color="danger">{{ model.error }}</ion-note>
</template>

<script lang="ts" setup>
import { IonCheckbox, IonInput, IonLabel, IonNote } from "@ionic/vue";
import { FormField, FormSchema } from "types";
import { computed, onMounted, PropType, ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Object as PropType<FormField>,
    default: () => ({}),
  },
  schema: {
    type: Object as PropType<FormSchema>,
    default: () => ({}),
  },
});

const emit = defineEmits<{
  (e: "update:modelValue", value: FormField): void;
}>();

const isUnknown = ref(false);

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const validate = async () => {
  if (model.value.required && !model.value.value) {
    return (model.value.error = "This field is required");
  }
  if (
    (!model.value.allowUnknown && model.value.value === "Unknown") ||
    model.value.value === "N/A"
  ) {
    return (model.value.error = "Unknown is not allowed");
  }
  if (model.value.validation) {
    const errors = await model.value.validation(
      model.value.value!,
      props.schema
    );
    if (errors && errors.length) {
      return (model.value.error += errors.toString());
    }
  }
  return (model.value.error = "");
};

watch(isUnknown, (newValue) => {
  if (newValue) {
    model.value.value = "Unknown";
    model.value.error = "";
    model.value.disabled = true;
  } else {
    model.value.value = "";
    model.value.disabled = false;
  }
});

watch(props.modelValue, (newModel) => {
  if (newModel.value === "Unknown") {
    if (!isUnknown.value) {
      isUnknown.value = true;
    }
  } else {
    isUnknown.value = false;
  }
});

onMounted(() => {
  if (model.value.value === "Unknown" && !isUnknown.value) {
    isUnknown.value = true;
  }
});
</script>

<style>
.outer-input-wrapper {
  width: 100%;
  height: 2.5rem;
  display: flex;
  justify-content: space-between;
  justify-items: center;
}

.inner-input-wrapper {
  background: #ffffff;
  height: 100%;
  padding-top: 0 !important;
  flex-grow: 8;
}

.pre-suffix-wrapper {
  background: #f2f2f2;
  height: 100%;
  padding: 0.5rem;
  flex-grow: 1;
}
</style>
