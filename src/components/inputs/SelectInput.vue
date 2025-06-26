<template>
  <div class="autocomplete-container" @focusout="onValueUpdate" ref="containerRef">
    <ion-input
      ref="inputRef"
      v-model="filter"
      :fill="model.fill ?? 'solid'"
      :label-placement="model.labelPlacement ?? 'stacked'"
      :type="type ?? 'text'"
      :required="model.required"
      :error-text="model.error"
      :autofocus="model.autoFocus"
      :placeholder="placeholder"
      :disabled="model.disabled"
      :counter="model.counter"
      @ion-focus="onFocus"
      :debounce="300"
      @click="openInterface"
    >
      <InputLabel :model="model" />
      <ion-label v-if="model.multiple" style="width: fit-content" slot="start">
        <ion-chip v-for="(tag, index) of tags" :key="index">
          <ion-label>{{ tag.label }}</ion-label>
        </ion-chip>
      </ion-label>
      <ion-label slot="start" v-else class="ion-no-wrap">
        {{ tags[0]?.label ?? '' }}
      </ion-label>
      <ion-icon slot="end" :icon="chevronDown" />
      <ion-icon
        slot="end"
        :icon="close"
        v-if="tags.length > 0 || filter"
        @click="onReset"
        style="z-index: 999999"
      />
    </ion-input>

    <ion-list
      v-if="showOptions && options.length > 0 && interfaceType === 'popover'"
      class="suggestions-list"
      :class="popoverPosition"
    >
      <ion-item button v-for="option in options" :key="option.label" @click="onSelect(option)">
        <ion-checkbox slot="start" :checked="option.isChecked" v-if="model.multiple" />
        <ion-label>{{ option.label }}</ion-label>
      </ion-item>
    </ion-list>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, PropType, watch, ComponentPublicInstance, onMounted } from 'vue';
import { chevronDown, close } from 'ionicons/icons';
import { FormSchema, BaseFieldTypes, FormField, Option } from '@/types';
import {
  isEmpty,
  checkOption,
  getFilteredOptions,
  uncheckOption,
  deepEqual,
  uncheckAllOptions,
} from '@/utils';
import { useInputValidation } from '@/composables/useInputValidation';
import {
  IonInput,
  IonList,
  IonItem,
  IonLabel,
  IonChip,
  IonIcon,
  IonCheckbox,
  actionSheetController,
  alertController,
  AlertInput,
} from '@ionic/vue';
import InputLabel from '../shared/InputLabel.vue';

const props = defineProps({
  schema: Object as PropType<FormSchema>,
  type: String as PropType<BaseFieldTypes>,
  formId: String,
});
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<ComponentPublicInstance | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const showOptions = ref(false);
const options = ref<Option[]>([]);
const filter = ref('');
const page = ref(1);

const interfaceType = computed(() => {
  return model.value.interface ?? 'popover';
});

const popoverPosition = computed(() => {
  return model.value.optionsPlacement === 'top' ? 'top' : 'bottom';
});

const tags = computed<Option[]>(() => options.value.filter(o => !!o.isChecked));

const placeholder = computed(() => {
  return !filter.value && isEmpty(tags.value) && !showOptions.value
    ? (model.value.placeholder ?? 'Select an option')
    : '';
});

watch([filter, () => model.value.options], filterOptions, {
  immediate: true,
  deep: true,
});
watch(() => model.value.value, initialize, { immediate: true, deep: true });

// Watch for dependency value changes when this field has dependencies
// This ensures options are refreshed when dependency values change
watch(
  () => {
    if (!model.value.dependsOn || !props.schema) return null;

    // Convert dependsOn to array if it's a single value
    const dependsOn = Array.isArray(model.value.dependsOn)
      ? model.value.dependsOn
      : [model.value.dependsOn];

    // Return the current values of all dependency fields
    return dependsOn.map(depId => props.schema![depId]?.value);
  },
  async (newValues, oldValues) => {
    if (newValues && oldValues && !deepEqual(newValues, oldValues)) {
      onReset();
      options.value = [];
      await filterOptions();
    }
  },
  { deep: true }
);

function onReset() {
  model.value.error = '';
  filter.value = '';
  page.value = 1;
  model.value.value = model.value.multiple ? [] : '';
  uncheckAllOptions(options.value);
}

function onSelect(item: Option) {
  const index = options.value.findIndex(option => option.value === item.value && option.isChecked);
  if (index >= 0) {
    // Deselect the item
    const modelIndex = ((model.value.value as Option[]) ?? []).findIndex(
      o => o.value === item.value
    );
    (model.value.value as Option[]).splice(modelIndex, 1);
    options.value[index].isChecked = false;
  } else {
    if (!model.value.multiple) onReset();
    checkOption(item, options.value);
  }
  onValueUpdate();
  filter.value = '';
}

function openInterface() {
  switch (interfaceType.value) {
    case 'action-sheet':
      openActionSheet();
      break;
    case 'alert':
      openAlert();
      break;
    case 'popover':
    default:
      showOptions.value = true;
      break;
  }
}

async function openActionSheet() {
  await filterOptions();

  if (model.value.multiple) {
    // For multiple selection, open an a popover instead of action sheet
    showOptions.value = true;
    return;
  }

  // Standard action sheet for single selection
  const actionSheet = await actionSheetController.create({
    header: model.value.label || 'Select an option',
    buttons: [
      ...options.value.map(option => ({
        text: option.label,
        cssClass: option.isChecked ? 'selected-option' : '',
        handler: () => {
          onSelect(option);
          return false;
        },
      })),
      {
        text: 'Cancel',
        role: 'cancel',
      },
    ],
  });

  await actionSheet.present();
}

async function openAlert() {
  await filterOptions();

  const inputs: AlertInput[] = options.value.map(option => ({
    label: option.label,
    type: model.value.multiple ? 'checkbox' : 'radio',
    value: option,
    checked: option.isChecked,
  }));

  const alert = await alertController.create({
    header: model.value.label || 'Select an option',
    inputs,
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
      },
      {
        text: 'OK',
        handler: selectedOptions => {
          if (model.value.multiple) {
            // Reset all options first
            options.value.forEach(o => uncheckOption(o, options.value));

            // Then check selected options
            selectedOptions.forEach((selected: Option) => {
              const option = options.value.find(o => o.value === selected.value);
              if (option) checkOption(option, options.value);
            });
          } else {
            onReset();
            const option = options.value.find(o => o.value === selectedOptions.value);
            if (option) checkOption(option, options.value);
          }
          onValueUpdate();
        },
      },
    ],
  });

  await alert.present();
}

// Custom validation for SelectInput - handles both required and custom validation
async function customSelectValidation(): Promise<boolean | string> {
  // Check required validation
  if (model.value.required && isEmpty(tags.value)) {
    return 'This field is required';
  }

  // Run field-specific validation function if it exists
  if (model.value.validation) {
    const errors = await model.value.validation(tags.value, props?.schema);
    if (errors && errors.length) {
      return errors.join();
    }
  }

  return true;
}

// Use input validation composable with custom validation
const { onFocus: baseOnFocus, applyValidationState } = useInputValidation(
  inputRef,
  model,
  computed(() => (model.value.multiple ? tags.value : tags.value[0])),
  computed(() => props?.schema),
  customSelectValidation
);

function onFocus(evt: any) {
  if (evt.target !== inputRef.value?.$el) return;
  baseOnFocus();

  // Only show options immediately for popover interface
  if (interfaceType.value === 'popover') {
    showOptions.value = true;
  }
}

async function onValueUpdate(evt?: any) {
  if ((evt?.relatedTarget as HTMLElement)?.closest('.suggestions-list')) return;
  showOptions.value = false;

  // Validate using custom validation logic
  const validationResult = await customSelectValidation();

  if (validationResult === true) {
    model.value.error = '';
    model.value.value = model.value.multiple ? tags.value : tags.value[0];
  } else {
    model.value.error =
      typeof validationResult === 'string' ? validationResult : 'Validation failed';
  }

  await applyValidationState(validationResult === true);
}

async function filterOptions() {
  const filtered: Array<Option> = [];

  // Handle function-based options (including dependent options)
  if (typeof model.value.options === 'function') {
    // Get dependency values if this field has dependencies
    let dependencyValues: Record<string, any> = {};

    if (model.value.dependsOn && props.schema) {
      const dependsOn = Array.isArray(model.value.dependsOn)
        ? model.value.dependsOn
        : [model.value.dependsOn];

      dependencyValues = dependsOn.reduce(
        (acc, depId) => {
          acc[depId] = props.schema![depId]?.value;
          return acc;
        },
        {} as Record<string, any>
      );
    }

    // Call the options function with filter and dependency values
    const res = await model.value.options(filter.value, dependencyValues);
    filtered.push(...res.filter(o => !!o.label));
  }
  // Handle static array options
  else if (Array.isArray(model.value.options)) {
    filtered.push(...getFilteredOptions(model.value.options, filter.value));
  }

  tags.value.forEach(tag => checkOption(tag, filtered));
  options.value = filtered;
}

function initialize() {
  const defaultValue = model.value.value;
  if (defaultValue) {
    if (Array.isArray(defaultValue)) {
      defaultValue.forEach(opt => checkOption(opt, options.value));
    } else if (typeof defaultValue === 'object') {
      checkOption(defaultValue, options.value);
    } else {
      checkOption(
        {
          value: defaultValue as any,
          label: defaultValue as string,
        },
        options.value
      );
    }
  }
}

// On mount, ensure options are loaded initially
onMounted(() => {
  filterOptions();
});

defineExpose({
  onValueUpdate,
  onReset,
  getErrors: () => (model.value.error ? [model.value.error] : []),
});
</script>

<style scoped>
.autocomplete-container {
  position: relative;
}

.suggestions-list {
  position: absolute;
  left: 0;
  right: 0;
  background-color: white;
  border: none;
  z-index: 99000;
  max-height: 65vh;
  overflow-y: auto;
  transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.suggestions-list.bottom {
  top: 100%;
  margin-top: 4px;
  border-radius: 4px;
  box-shadow:
    0 2px 4px -1px rgba(0, 0, 0, 0.2),
    0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
}

.suggestions-list.top {
  bottom: 100%;
  margin-bottom: 4px;
  border-radius: 4px;
  box-shadow:
    0 -2px 4px -1px rgba(0, 0, 0, 0.2),
    0 -4px 5px 0 rgba(0, 0, 0, 0.14),
    0 -1px 10px 0 rgba(0, 0, 0, 0.12);
}

ion-list {
  margin: 0;
  padding: 0;
}

/* Add hover effect for items */
ion-item {
  --ripple-color: var(--ion-color-primary-tint, #4c8dff);
  transition: background-color 0.2s ease;
}

ion-item:hover {
  --background: rgba(var(--ion-color-primary-rgb, 56, 128, 255), 0.08);
}

:deep(.selected-option) {
  font-weight: bold;
  color: var(--ion-color-primary);
}
</style>
