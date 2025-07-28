<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Custom Component Demo</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Custom Component Demo</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="demo-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Custom Component in Multi-Step Form</ion-card-title>
            <ion-card-subtitle
              >Using custom components in a multi-step form for an ANC workflow</ion-card-subtitle
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
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MultiStepConfig } from '@uniquedj95/vform';
import ANCHistoryComponent from './CustomComponent.vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
} from '@ionic/vue';

const patientId = ref('P12345');
const patientName = ref('Jane Doe');

// Define the multi-step form configuration
const multiStepConfig: MultiStepConfig = {
  steps: [
    // Step 1: Patient Information (Schema-based)
    {
      id: 'patient-info',
      title: 'Patient Information',
      subtitle: 'Basic patient details',
      schema: {
        patientId: {
          type: 'TextInput',
          label: 'Patient ID',
          value: patientId.value,
          required: true,
          disabled: true,
        },
        fullName: {
          type: 'TextInput',
          label: 'Full Name',
          value: patientName.value,
          required: true,
        },
        dob: {
          type: 'DateInput',
          label: 'Date of Birth',
          required: true,
        },
      },
    },

    // Step 2: Previous ANC Visits (Custom Component)
    {
      id: 'previous-visits',
      title: 'Previous Visits',
      subtitle: 'Review previous ANC visits',
      // Use the custom component
      component: ANCHistoryComponent,
      // Pass props to the component
      componentProps: {
        patientId: patientId.value,
        patientName: patientName.value,
        requireSelection: true,
      },
    },

    // Step 3: New ANC Visit Form (Schema-based)
    {
      id: 'new-visit',
      title: 'New ANC Visit',
      subtitle: 'Record new visit details',
      schema: {
        visitDate: {
          type: 'DateInput',
          label: 'Visit Date',
          value: new Date().toDateString(),
          required: true,
        },
        gestationalAge: {
          type: 'NumberInput',
          label: 'Gestational Age (weeks)',
          required: true,
        },
        bloodPressure: {
          type: 'TextInput',
          label: 'Blood Pressure',
          placeholder: 'e.g. 120/80',
          required: true,
        },
        weight: {
          type: 'NumberInput',
          label: 'Weight (kg)',
          required: true,
        },
      },
    },
  ],
  stepPosition: 'top',
  showProgress: true,
  allowStepNavigation: false, // Require step-by-step progression
};

// Handle step changes
function handleStepChange(stepIndex: number, stepId: string) {
  console.log(`Moving to step ${stepIndex + 1}: ${stepId}`);
}

// Handle form submission
function handleSubmit(allData: any) {
  console.log('Form submitted with data:', allData);

  alert('ANC form submitted successfully!');
}
</script>

<style scoped>
.demo-container {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

ion-card {
  margin-bottom: 20px;
}
</style>
