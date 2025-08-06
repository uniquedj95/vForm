<template>
  <IonCol
    :size="section.grid?.xs ?? '12'"
    :size-sm="section.grid?.sm"
    :size-md="section.grid?.md"
    :size-lg="section.grid?.lg"
    :size-xl="section.grid?.xl"
    class="form-section-container"
    :class="section.className"
  >
    <div class="form-section-header">
      <h3 class="form-section-title">{{ section.title }}</h3>
      <p v-if="section.subtitle" class="form-section-subtitle">{{ section.subtitle }}</p>
    </div>
  </IonCol>
</template>

<script lang="ts" setup>
import { IonCol } from '@ionic/vue';
import type { FormField, FormSchema } from '@/types';

interface SectionTitleProps {
  // Standard form component props (even though we don't use modelValue)
  modelValue?: FormField;
  schema?: FormSchema;
  formId?: string;
  refKey?: string;
}

const props = defineProps<SectionTitleProps>();

// Extract the section data from modelValue (which contains the FormSection)
const section = props.modelValue!;
</script>

<style scoped>
.form-section-container {
  padding: 0 !important;
}

.form-section-header {
  margin: 1.5rem 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--ion-color-primary);
}

.form-section-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--ion-color-primary);
  line-height: 1.2;
}

.form-section-subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: var(--ion-color-medium);
  line-height: 1.3;
}

/* First section should have less top margin */
:first-child .form-section-header {
  margin-top: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .form-section-header {
    margin: 1rem 0 0.75rem 0;
  }

  .form-section-title {
    font-size: 1.125rem;
  }

  .form-section-subtitle {
    font-size: 0.8rem;
  }
}
</style>
