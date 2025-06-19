<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Custom Styles</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Custom Styles</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="demo-container">
        <ion-segment v-model="selectedTheme" @ionChange="handleThemeChange">
          <ion-segment-button value="default">
            <ion-label>Default</ion-label>
          </ion-segment-button>
          <ion-segment-button value="dark">
            <ion-label>Dark Theme</ion-label>
          </ion-segment-button>
          <ion-segment-button value="colorful">
            <ion-label>Colorful</ion-label>
          </ion-segment-button>
        </ion-segment>

        <ion-card :class="'theme-' + selectedTheme">
          <ion-card-header>
            <ion-card-title>Styled Form Demo</ion-card-title>
            <ion-card-subtitle>Custom styling and theming examples</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <VForm
              :schema="formSchema"
              @submit="handleSubmit"
              :button-placement="'end'"
              submit-button-text="Submit with Style"
              class="styled-form"
            />
          </ion-card-content>
        </ion-card>

        <ion-card v-if="submittedData">
          <ion-card-header>
            <ion-card-title>Styled Form Data</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <pre>{{ JSON.stringify(submittedData, null, 2) }}</pre>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Styling Features</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <ion-list>
              <ion-item>
                <ion-label>
                  <h3>Theme Support</h3>
                  <p>Switch between default, dark, and colorful themes</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <h3>CSS Custom Properties</h3>
                  <p>Easy customization with CSS variables</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <h3>Responsive Grid</h3>
                  <p>Built-in responsive grid system for different screen sizes</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <h3>Custom Animations</h3>
                  <p>Smooth transitions and hover effects</p>
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
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import type { FormData, ComputedData, FormSchema } from '@uniquedj95/vform';

const submittedData = ref<any>(null);
const selectedTheme = ref('default');

const formSchema: FormSchema = {
  title: {
    type: 'SelectInput',
    label: 'Title',
    value: '',
    options: [
      { label: 'Mr.', value: 'mr' },
      { label: 'Ms.', value: 'ms' },
      { label: 'Mrs.', value: 'mrs' },
      { label: 'Dr.', value: 'dr' },
    ],
    grid: { xs: '12', sm: '4', md: '3' },
  },
  firstName: {
    type: 'TextInput',
    label: 'First Name',
    value: '',
    placeholder: 'Enter first name',
    required: true,
    grid: { xs: '12', sm: '8', md: '9' },
  },
  lastName: {
    type: 'TextInput',
    label: 'Last Name',
    value: '',
    placeholder: 'Enter last name',
    required: true,
    grid: { xs: '12' },
  },
  email: {
    type: 'EmailInput',
    label: 'Email Address',
    value: '',
    placeholder: 'Enter email address',
    required: true,
    grid: { xs: '12', md: '6' },
  },
  phone: {
    type: 'TextInput',
    label: 'Phone Number',
    value: '',
    placeholder: '(000) 000-0000',
    mask: '(000) 000-0000',
    grid: { xs: '12', md: '6' },
  },
  birthDate: {
    type: 'DateInput',
    label: 'Date of Birth',
    value: '',
    grid: { xs: '12', md: '6' },
  },
  favoriteColor: {
    type: 'SelectInput',
    label: 'Favorite Color',
    value: '',
    options: [
      { label: 'Red', value: 'red' },
      { label: 'Blue', value: 'blue' },
      { label: 'Green', value: 'green' },
      { label: 'Purple', value: 'purple' },
      { label: 'Orange', value: 'orange' },
    ],
    grid: { xs: '12', md: '6' },
  },
  interests: {
    type: 'TextAreaInput',
    label: 'Interests & Hobbies',
    value: '',
    placeholder: 'Tell us about your interests...',
    rows: 4,
    grid: { xs: '12' },
  },
  newsletter: {
    type: 'CheckboxInput',
    label: 'Subscribe to our newsletter',
    value: false,
    grid: { xs: '12', md: '6' },
  },
  notifications: {
    type: 'CheckboxInput',
    label: 'Enable push notifications',
    value: true,
    grid: { xs: '12', md: '6' },
  },
  contactMethod: {
    type: 'RadioInput',
    label: 'Preferred Contact Method',
    value: 'email',
    options: [
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'phone' },
      { label: 'SMS', value: 'sms' },
    ],
    grid: { xs: '12' },
  },
};

function handleSubmit(formData: FormData, computedData: ComputedData) {
  console.log('Styled form submitted:', formData, computedData);
  submittedData.value = { formData, computedData };
}

function handleThemeChange(event: any) {
  selectedTheme.value = event.detail.value;
}
</script>

<style scoped>
.demo-container {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

ion-segment {
  margin-bottom: 20px;
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

/* Default Theme */
.theme-default {
  --background: #ffffff;
  --color: #333333;
}

/* Dark Theme */
.theme-dark {
  --background: #1a1a1a;
  --color: #ffffff;
  background: var(--background);
  color: var(--color);
}

.theme-dark ion-card-header {
  color: var(--ion-color-light);
}

.theme-dark ion-card-content {
  color: var(--ion-color-light);
}

/* Colorful Theme */
.theme-colorful {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  background: var(--background);
}

.theme-colorful ion-card-header {
  color: white;
}

.theme-colorful ion-card-content {
  color: white;
}

/* Styled Form */
.styled-form {
  transition: all 0.3s ease;
}

/* Custom animations and effects */
.styled-form :deep(ion-item) {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.styled-form :deep(ion-item:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.styled-form :deep(ion-button) {
  --border-radius: 25px;
  --padding-start: 24px;
  --padding-end: 24px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.styled-form :deep(ion-button:hover) {
  transform: translateY(-2px);
  --box-shadow: 0 6px 20px rgba(var(--ion-color-primary-rgb), 0.4);
}

.styled-form :deep(ion-input),
.styled-form :deep(ion-select),
.styled-form :deep(ion-textarea) {
  --border-radius: 12px;
  --padding-start: 16px;
  --padding-end: 16px;
}

.styled-form :deep(.input-label) {
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--ion-color-primary);
}
</style>
