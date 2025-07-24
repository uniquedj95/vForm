<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Conditional Steps Demo</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="container ion-padding">
        <h1>Conditional Steps Demo</h1>
        <p>
          This example demonstrates how to conditionally show or hide steps in a multi-step form
          based on the values entered in previous steps.
        </p>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Demo Form</ion-card-title>
            <ion-card-subtitle
              >Try changing the form options to see steps appear/disappear</ion-card-subtitle
            >
          </ion-card-header>

          <ion-card-content>
            <v-form
              :multi-step-config="multiStepConfig"
              @multi-step-submit="handleSubmit"
              @step-change="handleStepChange"
            />
          </ion-card-content>
        </ion-card>

        <!-- Submit Results -->
        <ion-card v-if="submittedData">
          <ion-card-header>
            <ion-card-title>Form Submission Data</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <ion-accordion-group>
              <ion-accordion value="data">
                <ion-item slot="header">
                  <ion-label>View Submitted Data</ion-label>
                </ion-item>
                <div slot="content" class="accordion-content">
                  <pre>{{ JSON.stringify(submittedData, null, 2) }}</pre>
                </div>
              </ion-accordion>
            </ion-accordion-group>
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
  IonButtons,
  IonMenuButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
} from '@ionic/vue';
import type { MultiStepConfig, MultiStepFormData, Option } from '@uniquedj95/vform';

const submittedData = ref<MultiStepFormData | null>(null);

const multiStepConfig = reactive<MultiStepConfig>({
  steps: [
    // Step 1: Basic Information
    {
      id: 'basic-info',
      title: 'Basic Information',
      subtitle: 'Your personal details',
      schema: {
        fullName: {
          type: 'TextInput',
          label: 'Full Name',
          required: true,
        },
        email: {
          type: 'EmailInput',
          label: 'Email',
          required: true,
        },
        accountType: {
          type: 'SelectInput',
          label: 'Account Type',
          options: [
            { label: 'Personal', value: 'personal' },
            { label: 'Business', value: 'business' },
            { label: 'Educational', value: 'educational' },
          ],
          value: 'personal',
          required: true,
        },
      },
    },

    // Step 2: Business Information (Conditional - only show if account type is business)
    {
      id: 'business-info',
      title: 'Business Information',
      subtitle: 'Your business details',
      schema: {
        companyName: {
          type: 'TextInput',
          label: 'Company Name',
          required: true,
        },
        businessType: {
          type: 'SelectInput',
          label: 'Business Type',
          options: [
            { label: 'Sole Proprietorship', value: 'sole-prop' },
            { label: 'LLC', value: 'llc' },
            { label: 'Corporation', value: 'corp' },
            { label: 'Partnership', value: 'partnership' },
            { label: 'Non-Profit', value: 'non-profit' },
          ],
          required: true,
        },
        employeeCount: {
          type: 'NumberInput',
          label: 'Number of Employees',
          required: true,
        },
      },
      // Condition: Only show if accountType is 'business'
      condition: formData =>
        (formData['basic-info']?.accountType as Option)?.value === 'business',
    },
    // Step 3: Educational Information (Conditional - only show if account type is educational)
    {
      id: 'educational-info',
      title: 'Educational Information',
      subtitle: 'Your institution details',
      schema: {
        institutionName: {
          type: 'TextInput',
          label: 'Institution Name',
          required: true,
        },
        institutionType: {
          type: 'SelectInput',
          label: 'Institution Type',
          options: [
            { label: 'K-12 School', value: 'k12' },
            { label: 'University', value: 'university' },
            { label: 'Community College', value: 'community-college' },
            { label: 'Technical School', value: 'technical' },
            { label: 'Other', value: 'other' },
          ],
          required: true,
        },
        studentCount: {
          type: 'NumberInput',
          label: 'Number of Students',
          required: true,
        },
      },
      // Condition: Only show if accountType is 'educational'
      condition: formData =>
        /educational/i.test((formData['basic-info']?.accountType as Option)?.label || ''),
    },
    // Step 4: Preferences
    {
      id: 'preferences',
      title: 'Preferences',
      subtitle: 'Set your account preferences',
      schema: {
        theme: {
          type: 'SelectInput',
          label: 'Preferred Theme',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'System Default', value: 'system' },
          ],
          value: 'system',
        },
        notifications: {
          type: 'CheckboxInput',
          label: 'Notification Preferences',
          options: [
            { label: 'Email notifications', value: 'email' },
            { label: 'SMS notifications', value: 'sms' },
            { label: 'In-app notifications', value: 'app' },
          ],
        },
      },
    },

    // Step 5: Review & Confirm
    {
      id: 'review',
      title: 'Review & Confirm',
      subtitle: 'Confirm your information',
      schema: {
        terms: {
          type: 'CheckboxInput',
          label: 'Terms and Conditions',
          options: [
            { label: 'I agree to the Terms of Service and Privacy Policy', value: 'agreed' },
          ],
          required: true,
        },
      },
    },
  ],
  stepPosition: 'top',
  showProgress: true,
  allowStepNavigation: true,
});

function handleStepChange(stepIndex: number, stepId: string) {
  console.log(`Moving to step ${stepIndex + 1}: ${stepId}`);
}

function handleSubmit(data: MultiStepFormData) {
  submittedData.value = data;
  console.log('Form submitted with data:', data);
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.accordion-content {
  padding: 16px;
  background-color: var(--ion-color-light);
  border-radius: 0 0 8px 8px;
  overflow-x: auto;
}

pre {
  margin: 0;
  white-space: pre-wrap;
}
</style>
