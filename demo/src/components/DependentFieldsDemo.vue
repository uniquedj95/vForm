<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Dependent Fields</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Dependent Fields</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="demo-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Dynamic Field Dependencies</ion-card-title>
            <ion-card-subtitle
              >Fields that show/hide and update based on other field values</ion-card-subtitle
            >
          </ion-card-header>

          <ion-card-content>
            <VForm
              :schema="formSchema"
              @submit="handleSubmit"
              submit-button-text="Submit Application"
            />
          </ion-card-content>
        </ion-card>

        <ion-card v-if="submittedData">
          <ion-card-header>
            <ion-card-title>Application Data</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <pre>{{ JSON.stringify(submittedData, null, 2) }}</pre>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>How Dependencies Work</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <ion-list>
              <ion-item>
                <ion-label>
                  <h3>Country → States</h3>
                  <p>State options update based on selected country</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <h3>Employment Status → Company Details</h3>
                  <p>Company fields only show if "Employed" is selected</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <h3>Student Status → School Info</h3>
                  <p>School field appears when "Student" is checked</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <h3>Contact Method → Phone/Email</h3>
                  <p>Required contact field changes based on preference</p>
                </ion-label>
              </ion-item>
            </ion-list>
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
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import type { FormData, ComputedData, FormSchema, Option } from '../../../src/types';

const submittedData = ref<any>(null);

// Mock data for dependent options
const countryStates: Record<string, Option[]> = {
  us: [
    { label: 'California', value: 'ca' },
    { label: 'New York', value: 'ny' },
    { label: 'Texas', value: 'tx' },
    { label: 'Florida', value: 'fl' },
  ],
  ca: [
    { label: 'Ontario', value: 'on' },
    { label: 'Quebec', value: 'qc' },
    { label: 'British Columbia', value: 'bc' },
    { label: 'Alberta', value: 'ab' },
  ],
  uk: [
    { label: 'England', value: 'en' },
    { label: 'Scotland', value: 'sc' },
    { label: 'Wales', value: 'wa' },
    { label: 'Northern Ireland', value: 'ni' },
  ],
};

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
  country: {
    type: 'SelectInput',
    label: 'Country',
    value: '',
    options: [
      { label: 'United States', value: 'us' },
      { label: 'Canada', value: 'ca' },
      { label: 'United Kingdom', value: 'uk' },
    ],
    required: true,
    grid: { xs: '12', md: '6' },
  },
  state: {
    type: 'SelectInput',
    label: 'State/Province',
    value: '',
    options: (filter, dependencyValues) => {
      console.log(
        'State options computed with filter:',
        filter,
        'and dependency values:',
        dependencyValues
      );
      const country = dependencyValues?.country as string;
      return countryStates[country] || [];
    },
    dependsOn: 'country',
    condition: data => !!(data.country as Option)?.value,
    required: true,
    grid: { xs: '12', md: '6' },
  },
  employmentStatus: {
    type: 'SelectInput',
    label: 'Employment Status',
    value: '',
    options: [
      { label: 'Employed', value: 'employed' },
      { label: 'Unemployed', value: 'unemployed' },
      { label: 'Self-employed', value: 'self_employed' },
      { label: 'Retired', value: 'retired' },
    ],
    required: true,
    grid: { xs: '6' },
  },
  companyName: {
    type: 'TextInput',
    label: 'Company Name',
    value: '',
    placeholder: 'Enter your company name',
    condition: data => (data.employmentStatus as Option)?.value === 'employed',
    validation: async (value, schema) => {
      if ((schema?.employmentStatus as Option)?.value === 'employed' && !value) {
        return ['Company name is required for employed status'];
      }
      return null;
    },
    grid: { xs: '12', md: '6' },
  },
  jobTitle: {
    type: 'TextInput',
    label: 'Job Title',
    value: '',
    placeholder: 'Enter your job title',
    condition: schema => (schema.employmentStatus as Option)?.value === 'employed',
    validation: async (value, schema) => {
      if ((schema?.employmentStatus as Option)?.value === 'employed' && !value) {
        return ['Job title is required for employed status'];
      }
      return null;
    },
    grid: { xs: '12', md: '6' },
  },
  isStudent: {
    type: 'CheckboxInput',
    label: 'I am currently a student',
    value: false,
    grid: { xs: '12' },
  },
  schoolName: {
    type: 'TextInput',
    label: 'School/University Name',
    value: '',
    placeholder: 'Enter your school name',
    condition: schema => !!schema.isStudent,
    validation: async (value, schema) => {
      if (schema?.isStudent?.value && !value) {
        return ['School name is required if you are a student'];
      }
      return null;
    },
    grid: { xs: '12' },
  },
  preferredContact: {
    type: 'RadioInput',
    label: 'Preferred Contact Method',
    value: 'email',
    options: [
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'phone' },
    ],
    grid: { xs: '12' },
  },
  email: {
    type: 'EmailInput',
    label: 'Email Address',
    value: '',
    placeholder: 'your.email@example.com',
    grid: { xs: '12', md: '6' },
  },
  phone: {
    type: 'TextInput',
    label: 'Phone Number',
    value: '',
    placeholder: '(000) 000-0000',
    grid: { xs: '12', md: '6' },
  },
  additionalInfo: {
    type: 'TextAreaInput',
    label: 'Additional Information',
    value: '',
    placeholder: "Any additional details you'd like to share...",
    rows: 4,
    grid: { xs: '12' },
  },
};

function handleSubmit(formData: FormData, computedData: ComputedData) {
  console.log('Dependent fields form submitted:', formData, computedData);
  submittedData.value = { formData, computedData };
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

ion-list {
  background: transparent;
}

ion-item {
  --background: var(--ion-color-light);
  --border-radius: 8px;
  margin-bottom: 8px;
}
</style>
