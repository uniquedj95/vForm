<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Multi-Step Form Demo</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Multi-Step Form Demo</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="demo-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>User Registration - Multi-Step</ion-card-title>
            <ion-card-subtitle
              >A comprehensive registration form with multiple steps</ion-card-subtitle
            >
          </ion-card-header>

          <ion-card-content>
            <div class="demo-controls">
              <ion-segment v-model="stepPosition" @ion-change="handleSegmentChange">
                <ion-segment-button value="top">
                  <ion-label>Top</ion-label>
                </ion-segment-button>
                <ion-segment-button value="bottom">
                  <ion-label>Bottom</ion-label>
                </ion-segment-button>
                <ion-segment-button value="left">
                  <ion-label>Left</ion-label>
                </ion-segment-button>
                <ion-segment-button value="right">
                  <ion-label>Right</ion-label>
                </ion-segment-button>
              </ion-segment>

              <div class="demo-options">
                <ion-checkbox v-model="showProgress" @ionChange="handleOptionsChange">
                  <ion-label>Show Progress</ion-label>
                </ion-checkbox>
                <ion-checkbox v-model="allowNavigation" @ionChange="handleOptionsChange">
                  <ion-label>Allow Step Navigation</ion-label>
                </ion-checkbox>
              </div>
            </div>

            <VForm
              :multi-step-config="multiStepConfig"
              @multi-step-submit="handleMultiStepSubmit"
              @step-change="handleStepChange"
              @clear="handleClear"
              @cancel="handleCancel"
              :show-labels="true"
              submit-button-text="Complete Registration"
              previous-button-text="Back"
              next-button-text="Continue"
              button-placement="end"
            />
          </ion-card-content>
        </ion-card>

        <ion-card v-if="submittedData">
          <ion-card-header>
            <ion-card-title>Multi-Step Form Submission Result</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <ion-accordion-group>
              <ion-accordion value="combined-form-data">
                <ion-item slot="header">
                  <ion-label>Form Data</ion-label>
                </ion-item>
                <div slot="content" class="accordion-content">
                  <pre>{{ JSON.stringify(submittedData.formData, null, 2) }}</pre>
                </div>
              </ion-accordion>
              <ion-accordion value="combined-computed-data">
                <ion-item slot="header">
                  <ion-label>Computed Data</ion-label>
                </ion-item>
                <div slot="content" class="accordion-content">
                  <pre>{{ JSON.stringify(submittedData.computedData, null, 2) }}</pre>
                </div>
              </ion-accordion>
            </ion-accordion-group>
          </ion-card-content>
        </ion-card>

        <ion-card v-if="currentStepInfo">
          <ion-card-header>
            <ion-card-title>Current Step Info</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>
              <strong>Step:</strong> {{ currentStepInfo.index + 1 }} of
              {{ multiStepConfig.steps.length }}
            </p>
            <p><strong>Step ID:</strong> {{ currentStepInfo.id }}</p>
            <p><strong>Step Title:</strong> {{ currentStepInfo.title }}</p>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButtons,
  IonMenuButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCheckbox,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
} from '@ionic/vue';
import type { MultiStepConfig, MultiStepFormData, StepPosition } from '@uniquedj95/vform';

const submittedData = ref<any>(null);
const currentStepInfo = ref<{ index: number; id: string; title: string } | null>(null);

// Demo configuration
const stepPosition = ref<StepPosition>('top');
const showProgress = ref(true);
const allowNavigation = ref(false);

const multiStepConfig = reactive<MultiStepConfig>({
  steps: [
    {
      id: 'personal-info',
      title: 'Personal Information',
      subtitle: 'Tell us about yourself',
      schema: {
        firstName: {
          type: 'TextInput',
          label: 'First Name',
          required: true,
          placeholder: 'Enter your first name',
          grid: { xs: '12', md: '6' },
        },
        lastName: {
          type: 'TextInput',
          label: 'Last Name',
          required: true,
          placeholder: 'Enter your last name',
          grid: { xs: '12', md: '6' },
        },
        email: {
          type: 'EmailInput',
          label: 'Email Address',
          required: true,
          placeholder: 'Enter your email',
          grid: { xs: '12' },
        },
        dateOfBirth: {
          type: 'DateInput',
          label: 'Date of Birth',
          required: true,
          grid: { xs: '12', md: '6' },
        },
        phone: {
          type: 'TextInput',
          label: 'Phone Number',
          placeholder: 'Enter your phone number',
          grid: { xs: '12', md: '6' },
        },
      },
    },
    {
      id: 'address-info',
      title: 'Address Details',
      subtitle: 'Where can we reach you?',
      schema: {
        street: {
          type: 'TextInput',
          label: 'Street Address',
          required: true,
          placeholder: 'Enter your street address',
          grid: { xs: '12' },
        },
        city: {
          type: 'TextInput',
          label: 'City',
          required: true,
          placeholder: 'Enter your city',
          grid: { xs: '12', md: '6' },
        },
        state: {
          type: 'SelectInput',
          label: 'State/Province',
          required: true,
          options: [
            { label: 'California', value: 'CA' },
            { label: 'New York', value: 'NY' },
            { label: 'Texas', value: 'TX' },
            { label: 'Florida', value: 'FL' },
            { label: 'Illinois', value: 'IL' },
          ],
          grid: { xs: '12', md: '6' },
        },
        zipCode: {
          type: 'TextInput',
          label: 'ZIP/Postal Code',
          required: true,
          placeholder: 'Enter ZIP code',
          grid: { xs: '12', md: '4' },
        },
        country: {
          type: 'SelectInput',
          label: 'Country',
          required: true,
          disabled: true,
          options: [
            { label: 'United States', value: 'US' },
            { label: 'Canada', value: 'CA' },
            { label: 'United Kingdom', value: 'UK' },
            { label: 'Australia', value: 'AU' },
            { label: 'Malawi', value: 'MW' },
          ],
          value: 'MW',
          grid: { xs: '12', md: '8' },
        },
      },
    },
    {
      id: 'preferences',
      title: 'Preferences',
      subtitle: 'Customize your experience',
      schema: {
        interests: {
          type: 'CheckboxInput',
          label: 'Areas of Interest',
          multiple: true,
          options: [
            { label: 'Technology', value: 'tech' },
            { label: 'Sports', value: 'sports' },
            { label: 'Music', value: 'music' },
            { label: 'Travel', value: 'travel' },
            { label: 'Food', value: 'food' },
          ],
          grid: { xs: '12', md: '6' },
        },
        newsletter: {
          type: 'RadioInput',
          label: 'Newsletter Frequency',
          options: [
            { label: 'Daily', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
            { label: 'Never', value: 'never' },
          ],
          value: 'weekly',
          grid: { xs: '12', md: '6' },
        },
        bio: {
          type: 'TextAreaInput',
          label: 'Tell us about yourself',
          placeholder: 'Share a bit about your background and interests...',
          rows: 4,
          maxLength: 500,
          counter: true,
          grid: { xs: '12' },
        },
      },
    },
    {
      id: 'review',
      title: 'Review & Confirm',
      subtitle: 'Please review your information',
      schema: {
        terms: {
          type: 'CheckboxInput',
          label: 'Agreement',
          required: true,
          options: [
            { label: 'I agree to the Terms of Service and Privacy Policy', value: 'agreed' },
          ],
          grid: { xs: '12' },
        },
        marketing: {
          type: 'CheckboxInput',
          label: 'Marketing Communications',
          options: [
            { label: 'I would like to receive marketing communications', value: 'marketing' },
          ],
          grid: { xs: '12' },
        },
      },
    },
  ],
  stepPosition: stepPosition.value,
  showProgress: showProgress.value,
  allowStepNavigation: allowNavigation.value,
});

function handleSegmentChange(event: any) {
  stepPosition.value = event.detail.value;
  multiStepConfig.stepPosition = stepPosition.value;
}

function handleOptionsChange() {
  multiStepConfig.showProgress = showProgress.value;
  multiStepConfig.allowStepNavigation = allowNavigation.value;
}

function handleMultiStepSubmit(data: MultiStepFormData) {
  submittedData.value = data;
  console.log('Multi-step form submitted:', data);
}

function handleStepChange(stepIndex: number, stepId: string) {
  const step = multiStepConfig.steps[stepIndex];
  currentStepInfo.value = {
    index: stepIndex,
    id: stepId,
    title: step.title,
  };
  console.log('Step changed:', { stepIndex, stepId });
}

function handleClear() {
  submittedData.value = null;
  currentStepInfo.value = null;
  console.log('Form cleared');
}

function handleCancel() {
  submittedData.value = null;
  currentStepInfo.value = null;
  console.log('Form cancelled');
}
</script>

<style scoped>
.demo-container {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-controls {
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--ion-color-light);
  border-radius: 8px;
}

.demo-options {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.demo-options ion-checkbox,
.demo-options ion-select {
  min-width: fit-content;
}

.accordion-content {
  padding: 1rem;
  background: var(--ion-color-light);
}

.accordion-content pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  margin: 0;
}

.accordion-content h4 {
  margin: 1rem 0 0.5rem 0;
  color: var(--ion-color-primary);
  font-weight: 600;
}

.accordion-content h4:first-child {
  margin-top: 0;
}

@media (max-width: 768px) {
  .demo-container {
    padding: 0.5rem;
  }

  .demo-options {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
}
</style>
