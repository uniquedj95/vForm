<template>
  <div class="autocomplete-container" @focusout="onValueUpdate">
    <ion-input
      ref="inputRef"
      v-model="filter"
      :fill="model.fill ?? 'outline'"
      :label-placement="model.labelPlacement ?? 'stacked'"
      :type="type ?? 'text'"
      :required="model.required"
      :error-text="model.error"
      :auto-focus="model.autoFocus"
      :placeholder="placeholder"
      :disabled="model.disabled"
      :counter="model.counter"
      @ion-focus="onFocus"
      :debounce="300"
    >
      <ion-label slot="label" v-if="model.label">
        {{ model.label }}
        <ion-text color="danger" v-if="model.required">*</ion-text>
      </ion-label>
      <ion-label v-if="model.multiple" style="width: fit-content" slot="start">
        <ion-chip v-for="(tag, index) of tags" :key="index">
          <ion-label>{{ tag.label }}</ion-label>
        </ion-chip>
      </ion-label>
      <ion-label slot="start" v-else class="ion-no-wrap">
        {{ tags[0]?.label ?? "" }}
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

    <ion-list v-if="showOptions && options.length > 0" class="suggestions-list ion-content-scroll-host">
      <ion-item
        button
        v-for="option in options"
        :key="option.label"
        @click="onSelect(option)"
      >
        <ion-checkbox
          slot="start"
          :checked="option.isChecked"
          v-if="model.multiple"
        />
        <ion-label>{{ option.label }}</ion-label>
      </ion-item>

      <ion-infinite-scroll
        @ionInfinite="loadData"
        threshold="100px"
        position="bottom"
        v-if="enableInfiniteScroll"
        :disabled="disableInfiniteScroll"
      >
        <ion-infinite-scroll-content
          loading-spinner="bubbles"
          loading-text="Loading more data..."
        ></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-list>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, PropType, watch } from "vue";
import { chevronDown, close } from "ionicons/icons";
import { FormSchema, BaseFieldTypes, FormField, Option } from "types";
import {
  isEmpty,
  checkOption,
  getFilteredOptions,
  uncheckOption,
} from "../../utils";
import {
  IonInput,
  IonList,
  IonItem,
  IonLabel,
  IonChip,
  IonText,
  IonIcon,
  IonCheckbox,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
} from "@ionic/vue";

const props = defineProps<{ schema?: FormSchema; type?: BaseFieldTypes }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<typeof IonInput | null>(null);
const showOptions = ref(false);
const enableInfiniteScroll = computed(
  () => typeof model.value.options === "function"
);
const disableInfiniteScroll = ref(false);
const options = ref<Option[]>([]);
const filter = ref("");
const page = ref(1);

const tags = computed<Option[]>(() =>
  options.value.filter((o) => !!o.isChecked)
);

const placeholder = computed(() => {
  return !filter.value && isEmpty(tags.value) && !showOptions.value
    ? model.value.placeholder ?? "Select an option"
    : "";
});

watch([filter, () => model.value.options], filterOptions, {
  immediate: true,
  deep: true,
});
watch(() => model.value.value, initialize, { immediate: true, deep: true });

function onReset() {
  options.value.forEach((o) => uncheckOption(o, options.value));
  model.value.error = "";
  filter.value = "";
  page.value = 1;
  model.value.value = model.value.multiple ? [] : "";
}

function onSelect(item: Option) {
  if (item.isChecked) return uncheckOption(item, options.value);
  if (model.value.multiple) {
    checkOption(item, options.value);
  } else {
    onReset();
    checkOption(item, options.value);
    onValueUpdate();
  }
  filter.value = "";
}

function onFocus(evt: any) {
  if (evt.target !== inputRef.value?.$el) return;
  inputRef.value?.$el.classList.remove("ion-touched");
  inputRef.value?.$el.classList.remove("ion-invalid");
  model.value.error = "";
  showOptions.value = true;
}

async function isValid() {
  if (model.value.required && isEmpty(tags.value)) {
    model.value.error = "This field is required";
    return false;
  }
  if (model.value.validation) {
    const errors = await model.value.validation(tags.value, props?.schema);
    if (errors && errors.length) {
      model.value.error = errors.join();
      return false;
    }
  }
  return true;
}

async function onValueUpdate(evt?: any) {
  if ((evt?.relatedTarget as HTMLElement)?.closest(".suggestions-list")) return;
  showOptions.value = false;
  inputRef.value?.$el.classList.remove("ion-invalid");
  inputRef.value?.$el.classList.remove("ion-valid");

  if (await isValid()) {
    model.value.error = "";
    model.value.value = model.value.multiple ? tags.value : tags.value[0];
    inputRef.value?.$el.classList.add("ion-valid");
  } else {
    inputRef.value?.$el.classList.add("ion-invalid");
  }

  inputRef.value?.$el.classList.add("ion-touched");
}

async function filterOptions() {
  const filtered: Array<Option> = [];

  if(typeof model.value.options === "function") {
    const res = await model.value.options(filter.value, 1)
    filtered.push(...res.options.filter((o) => !!o.label));
  } else {
    filtered.push(...getFilteredOptions(model.value.options ?? [], filter.value));
  }

  tags.value.forEach((tag) => checkOption(tag, filtered));
  options.value = filtered
  disableInfiniteScroll.value = !enableInfiniteScroll.value
}

async function loadData(evt: InfiniteScrollCustomEvent) {
  if (typeof model.value.options === "function") {
    page.value++;
    const res = await model.value.options(filter.value, page.value);
    options.value.push(...res.options.filter((o) => !!o.label));
    disableInfiniteScroll.value = res.options.length === 0 || res.total === options.value.length;
  }
  evt.target.complete();
}

function initialize() {
  const defaultValue = model.value.value;
  if (defaultValue) {
    if (Array.isArray(defaultValue)) {
      defaultValue.forEach((opt) => checkOption(opt, options.value));
    } else if (typeof defaultValue === "object") {
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

defineExpose({
  onValueUpdate,
  onReset,
  getErrors: () => model.value.error,
});
</script>

<style scoped>
.autocomplete-container {
  position: relative;
}

.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  z-index: 99000;
  max-height: 65vh;
  overflow-y: auto;
  border-radius: 0 0 5px 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

ion-list {
  margin: 0;
  padding: 0;
}

ion-infinite-scroll {
  margin: 0;
}
</style>
