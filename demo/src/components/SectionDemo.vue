<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Section Demo</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Section Demo</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="demo-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Employee Registration Form</ion-card-title>
            <ion-card-subtitle>Demonstrates form sections with titles</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <VForm
              :schema="formSchema"
              @submit="handleSubmit"
              @clear="handleClear"
              @cancel="handleCancel"
              :show-labels="true"
              submit-button-text="Register Employee"
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
  // Personal Information Section
  personalInfoSection: {
    type: 'FormSection',
    title: 'Personal Information',
    subtitle: 'Basic employee details',
  },
  firstName: {
    type: 'TextInput',
    label: 'First Name',
    value: '',
    placeholder: 'Enter first name',
    required: true,
    grid: { xs: '12', md: '6' },
  },
  lastName: {
    type: 'TextInput',
    label: 'Last Name',
    value: '',
    placeholder: 'Enter last name',
    required: true,
    grid: { xs: '12', md: '6' },
  },
  email: {
    type: 'EmailInput',
    label: 'Email Address',
    value: '',
    placeholder: 'employee@company.com',
    required: true,
    grid: { xs: '12', md: '6' },
  },
  phone: {
    type: 'TextInput',
    label: 'Phone Number',
    value: '',
    placeholder: '+1 (555) 123-4567',
    grid: { xs: '12', md: '6' },
  },
  birthDate: {
    type: 'DateInput',
    label: 'Date of Birth',
    value: '',
    required: true,
    grid: { xs: '12', md: '6' },
  },

  // Employment Details Section
  employmentSection: {
    type: 'FormSection',
    title: 'Employment Details',
    subtitle: 'Job-related information',
  },
  jobTitle: {
    type: 'TextInput',
    label: 'Job Title',
    value: '',
    placeholder: 'Software Engineer',
    required: true,
    grid: { xs: '12', md: '6' },
  },
  department: {
    type: 'SelectInput',
    label: 'Department',
    value: '',
    required: true,
    options: [
      { label: 'Engineering', value: 'engineering' },
      { label: 'Marketing', value: 'marketing' },
      { label: 'Sales', value: 'sales' },
      { label: 'Human Resources', value: 'hr' },
      { label: 'Finance', value: 'finance' },
    ],
    grid: { xs: '12', md: '6' },
  },
  startDate: {
    type: 'DateInput',
    label: 'Start Date',
    value: '',
    required: true,
    grid: { xs: '12', md: '6' },
  },
  salary: {
    type: 'NumberInput',
    label: 'Annual Salary',
    value: '',
    placeholder: '50000',
    min: 20000,
    grid: { xs: '12', md: '6' },
  },
  employmentType: {
    type: 'RadioInput',
    label: 'Employment Type',
    value: 'full-time',
    options: [
      { label: 'Full-time', value: 'full-time' },
      { label: 'Part-time', value: 'part-time' },
      { label: 'Contract', value: 'contract' },
      { label: 'Intern', value: 'intern' },
    ],
    grid: { xs: '12' },
  },

  // Address Information Section
  addressSection: {
    type: 'FormSection',
    title: 'Address Information',
    subtitle: 'Residential address details',
  },
  streetAddress: {
    type: 'TextInput',
    label: 'Street Address',
    value: '',
    placeholder: '123 Main St',
    required: true,
    grid: { xs: '12' },
  },
  city: {
    type: 'TextInput',
    label: 'City',
    value: '',
    placeholder: 'New York',
    required: true,
    grid: { xs: '12', md: '4' },
  },
  state: {
    type: 'SelectInput',
    label: 'State',
    value: '',
    required: true,
    options: [
      { label: 'California', value: 'CA' },
      { label: 'New York', value: 'NY' },
      { label: 'Texas', value: 'TX' },
      { label: 'Florida', value: 'FL' },
      { label: 'Illinois', value: 'IL' },
    ],
    grid: { xs: '12', md: '4' },
  },
  zipCode: {
    type: 'TextInput',
    label: 'ZIP Code',
    value: '',
    placeholder: '10001',
    required: true,
    grid: { xs: '12', md: '4' },
  },

  // Additional Information Section
  additionalSection: {
    type: 'FormSection',
    title: 'Additional Information',
    subtitle: 'Optional details about the employee',
  },
  bio: {
    type: 'TextAreaInput',
    label: 'Biography',
    value: '',
    placeholder: 'Tell us about yourself...',
    rows: 4,
    grid: { xs: '12' },
  },
  skills: {
    type: 'SelectInput',
    label: 'Skills',
    multiple: true,
    options: [
      { label: 'JavaScript', value: 'javascript' },
      { label: 'Python', value: 'python' },
      { label: 'React', value: 'react' },
      { label: 'Vue.js', value: 'vue' },
      { label: 'Node.js', value: 'nodejs' },
      { label: 'SQL', value: 'sql' },
      { label: 'Project Management', value: 'project-management' },
    ],
    grid: { xs: '12', md: '6' },
  },
  emergencyContact: {
    type: 'TextInput',
    label: 'Emergency Contact',
    value: '',
    placeholder: 'John Doe (+1 555-999-8888)',
    grid: { xs: '12', md: '6' },
  },
};

function handleSubmit(formData: FormData, computedData: ComputedData) {
  console.log('Form submitted:', { formData, computedData });
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
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

ion-card {
  margin: 1rem 0;
}

pre {
  background: var(--ion-color-light);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.875rem;
}
</style>
