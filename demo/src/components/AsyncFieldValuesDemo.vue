<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button />
        </ion-buttons>
        <ion-title>Async Field Values Demo</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="demo-container">
        <!-- Form Section -->
        <v-form
          :schema="formSchema"
          @submit="handleSubmit"
          :custom-buttons="customButtons"
          submit-button-text="Submit Form"
        />

        <!-- Results Section -->
        <ion-card v-if="submittedData">
          <ion-card-header>
            <ion-card-title>Submitted Data</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <pre>{{ JSON.stringify(submittedData, null, 2) }}</pre>
          </ion-card-content>
        </ion-card>

        <!-- Documentation Section -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Async Field Values</ion-card-title>
            <ion-card-subtitle
              >Supporting functions and Promises for field values</ion-card-subtitle
            >
          </ion-card-header>

          <ion-card-content>
            <p>This demo showcases the new <code>FormFieldValue</code> type that supports:</p>

            <ion-list>
              <ion-item>
                <ion-label>
                  <h3>Direct Values</h3>
                  <p>Traditional static values like strings, numbers, booleans</p>
                </ion-label>
              </ion-item>

              <ion-item>
                <ion-label>
                  <h3>Function Values</h3>
                  <p>Functions that return values (computed synchronously)</p>
                </ion-label>
              </ion-item>

              <ion-item>
                <ion-label>
                  <h3>Async Function Values</h3>
                  <p>Functions that return Promises for async data loading</p>
                </ion-label>
              </ion-item>

              <ion-item>
                <ion-label>
                  <h3>Promise Values</h3>
                  <p>Direct Promise objects that resolve to values</p>
                </ion-label>
              </ion-item>
            </ion-list>

            <h4>Examples</h4>

            <h5>1. Direct Value</h5>
            <pre><code>firstName: {
  type: 'TextInput',
  label: 'First Name',
  value: 'John Doe', // Direct string value
}</code></pre>

            <h5>2. Function Value</h5>
            <pre><code>computedField: {
  type: 'TextInput',
  label: 'Computed Value',
  value: () => 'Generated: ' + new Date().toISOString(),
}</code></pre>

            <h5>3. Async Function Value</h5>
            <pre><code>asyncField: {
  type: 'TextInput',
  label: 'From API',
  value: async () => {
    const response = await fetch('/api/user');
    const data = await response.json();
    return data.name;
  },
}</code></pre>

            <h5>4. Promise Value</h5>
            <pre><code>promiseField: {
  type: 'TextInput',
  label: 'Promise Data',
  value: fetch('/api/data').then(r => r.json()).then(d => d.value),
}</code></pre>

            <p>
              <strong>Note:</strong> All async values are resolved when the form initializes, and
              the resolved values are used throughout the form lifecycle.
            </p>
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
  IonCardTitle,
  IonCardSubtitle,
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
import type { FormData, ComputedData, FormSchema } from '@uniquedj95/vform';

const submittedData = ref<any>(null);

// Mock API calls for demonstration
const mockApiCall = (data: string, delay: number = 2000): Promise<string> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`API Result: ${data} (loaded after ${delay}ms)`);
    }, delay);
  });
};

const fetchUserProfile = async (): Promise<string> => {
  // Simulate API call with longer delay to see loading spinner
  await new Promise(resolve => setTimeout(resolve, 2500));
  return 'John Doe (from API)';
};

const formSchema: FormSchema = {
  // Section header
  section1: {
    type: 'FormSection',
    title: 'Direct and Function Values',
    subtitle: 'Static and computed values',
  },

  // Direct value (traditional)
  directValue: {
    type: 'TextInput',
    label: 'Direct Value',
    value: 'Static value set directly',
    placeholder: 'This field has a direct value',
    grid: { xs: '12', md: '6' },
  },

  // Function value that computes synchronously
  functionValue: {
    type: 'TextInput',
    label: 'Function Value',
    value: () => `Generated at: ${new Date().toLocaleTimeString()}`,
    placeholder: 'This field uses a function',
    grid: { xs: '12', md: '6' },
  },

  // Section header
  section2: {
    type: 'FormSection',
    title: 'Async Values',
    subtitle: 'Values loaded asynchronously',
  },

  // Async function value
  asyncFunctionValue: {
    type: 'TextInput',
    label: 'Async Function Value',
    value: async () => {
      return await mockApiCall('User Data', 1500);
    },
    placeholder: 'Loading from async function...',
    grid: { xs: '12', md: '6' },
  },

  // Direct Promise value
  promiseValue: {
    type: 'TextInput',
    label: 'Promise Value',
    value: mockApiCall('Configuration', 1800),
    placeholder: 'Loading from promise...',
    grid: { xs: '12', md: '6' },
  },

  // Section header
  section3: {
    type: 'FormSection',
    title: 'Select Fields with Async Values',
    subtitle: 'Dropdown fields with async default values',
  },

  // Select field with async default value
  asyncSelectValue: {
    type: 'SelectInput',
    label: 'Async Select Value',
    multiple: true,
    value: async () => {
      // Simulate selecting a default option from API with longer delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      return 'option2'; // This will select "Option 2" by default
    },
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
    placeholder: 'Select an option',
    grid: { xs: '12', md: '6' },
  },

  // Complex async value for user profile
  userProfile: {
    type: 'TextInput',
    label: 'User Profile',
    value: fetchUserProfile,
    placeholder: 'Loading user profile...',
    grid: { xs: '12', md: '6' },
  },

  // Section header
  section4: {
    type: 'FormSection',
    title: 'Mixed Values',
    subtitle: 'Combination of different value types',
  },

  // Number field with function value
  computedNumber: {
    type: 'NumberInput',
    label: 'Computed Number',
    value: () => Math.floor(Math.random() * 100),
    grid: { xs: '12', md: '4' },
  },

  // Email field with async value
  asyncEmail: {
    type: 'EmailInput',
    label: 'Email from Settings',
    value: async () => {
      // Simulate fetching email from user settings
      await new Promise(resolve => setTimeout(resolve, 300));
      return 'user@example.com';
    },
    grid: { xs: '12', md: '4' },
  },

  // Regular field for comparison
  regularField: {
    type: 'TextInput',
    label: 'Regular Field',
    value: '',
    placeholder: 'Enter value manually',
    grid: { xs: '12', md: '4' },
  },
};

const customButtons = [
  {
    label: 'Reset Values',
    icon: 'refresh',
    fill: 'outline',
    color: 'warning',
    action: () => {
      // Reset form (this could trigger re-evaluation of function values)
      location.reload();
    },
  },
];

function handleSubmit(formData: FormData, computedData: ComputedData) {
  console.log('Async values form submitted:', formData, computedData);
  submittedData.value = { formData, computedData };
}
</script>

<style scoped>
.demo-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

pre {
  background: var(--ion-color-light);
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  white-space: pre-wrap;
}

code {
  background: var(--ion-color-light);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

h4,
h5 {
  margin-top: 20px;
  margin-bottom: 10px;
  color: var(--ion-color-primary);
}

ion-list {
  margin: 16px 0;
}
</style>
