<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Basic Form Demo</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Basic Form Demo</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="demo-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>User Registration</ion-card-title>
            <ion-card-subtitle>Basic form with common input types</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <VForm
              :schema="formSchema"
              @submit="handleSubmit"
              @clear="handleClear"
              @cancel="handleCancel"
              :show-labels="true"
              submit-button-text="Register"
              clear-button-text="Reset Form"
            />
          </ion-card-content>
        </ion-card>

        <ion-card v-if="submittedData">
          <ion-card-header>
            <ion-card-title>Form Submission Result</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <pre>{{ JSON.stringify(submittedData, null, 2) }}</pre>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import type { FormData, ComputedData, FormSchema } from '@uniquedj95/vform';

const submittedData = ref<any>(null);

const formSchema: FormSchema = {
  firstName: {
    type: 'TextInput',
    label: 'First Name',
    value: '',
    placeholder: 'Enter your first name',
    required: true,
    grid: { xs: '12', md: '6' },
  },
  lastName: {
    type: 'TextInput',
    label: 'Last Name',
    value: '',
    placeholder: 'Enter your last name',
    required: true,
    grid: { xs: '12', md: '6' },
  },
  email: {
    type: 'EmailInput',
    label: 'Email Address',
    value: '',
    placeholder: 'your.email@example.com',
    required: true,
    grid: { xs: '12' },
  },
  password: {
    type: 'PasswordInput',
    label: 'Password',
    value: '',
    placeholder: 'Enter a secure password',
    required: true,
    grid: { xs: '12', md: '6' },
  },
  confirmPassword: {
    type: 'PasswordInput',
    label: 'Confirm Password',
    value: '',
    placeholder: 'Confirm your password',
    required: true,
    grid: { xs: '12', md: '6' },
  },
  birthDate: {
    type: 'DateInput',
    label: 'Date of Birth',
    value: new Date().toISOString().split('T')[0],
    required: true,
    grid: { xs: '12', md: '6' },
  },
  appointmentDateTime: {
    type: 'DateInput',
    label: 'Appointment Date & Time',
    value: new Date().toISOString().substring(0, 16), // Format: YYYY-MM-DDTHH:MM
    enableTime: true,
    required: true,
    disabled: true,
    grid: { xs: '12', md: '6' },
  },
  age: {
    type: 'NumberInput',
    label: 'Age',
    placeholder: 'Your age',
    min: 13,
    max: 120,
    grid: { xs: '12', md: '6' },
  },
  gender: {
    type: 'SelectInput',
    label: 'Gender',
    value: '',
    options: [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
      { label: 'Other', value: 'other' },
      { label: 'Prefer not to say', value: 'not_specified' },
    ],
    grid: { xs: '12', md: '6' },
  },
  preferences: {
    type: 'SelectInput',
    label: 'Preferences',
    multiple: true,
    options: [
      { label: 'Newsletters', value: 'newsletters' },
      { label: 'Product Updates', value: 'product_updates' },
      { label: 'Promotions', value: 'promotions' },
      { label: 'Beta Features', value: 'beta_features' },
      { label: 'Community Events', value: 'community_events' },
      { label: 'Surveys', value: 'surveys' },
      { label: 'No Preferences', value: 'none' },
    ],
    placeholder: 'Select your preference',
    grid: { xs: '12', md: '6' },
  },
  notifications: {
    type: 'CheckboxInput',
    label: 'Email Notifications',
    value: true,
    grid: { xs: '12', md: '6' },
  },
  bio: {
    type: 'TextAreaInput',
    label: 'Bio',
    value: '',
    placeholder: 'Tell us about yourself...',
    rows: 4,
    grid: { xs: '12' },
  },
};

function handleSubmit(formData: FormData, computedData: ComputedData) {
  console.log('Form submitted:', formData, computedData);
  submittedData.value = { formData, computedData };
}

function handleClear() {
  console.log('Form cleared');
  submittedData.value = null;
}

function handleCancel() {
  console.log('Form cancelled');
  submittedData.value = null;
}
</script>

<style scoped>
.demo-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

pre {
  background: var(--ion-color-light);
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.4;
}
</style>
