<template>
  <div class="container">
    <h1>Custom Component in Multi-Step Form</h1>
    <p>
      This example demonstrates how to use custom components in a multi-step form for an ANC
      workflow.
    </p>

    <v-form
      :multi-step-config="multiStepConfig"
      @multi-step-submit="handleSubmit"
      @step-change="handleStepChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MultiStepConfig } from '@uniquedj95/vform';
import ANCHistoryComponent from './CustomComponent.vue';

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
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>
