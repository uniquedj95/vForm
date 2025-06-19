<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Validation Examples</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Validation Examples</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="demo-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Form Validation Demo</ion-card-title>
            <ion-card-subtitle>Various validation rules and error handling</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <VForm
              :schema="formSchema"
              @submit="handleSubmit"
              submit-button-text="Validate & Submit"
            />
          </ion-card-content>
        </ion-card>

        <ion-card v-if="submittedData">
          <ion-card-header>
            <ion-card-title>Validation Results</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <div v-if="submittedData.success" class="success-message">
              ✅ All validations passed!
            </div>
            <pre>{{ JSON.stringify(submittedData, null, 2) }}</pre>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Validation Rules</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <ion-list>
              <ion-item>
                <ion-label>
                  <h3>Username</h3>
                  <p>3-20 characters, alphanumeric only</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <h3>Email</h3>
                  <p>Valid email format with async domain check</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <h3>Password</h3>
                  <p>Min 8 chars, 1 uppercase, 1 lowercase, 1 number</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <h3>Age</h3>
                  <p>Must be between 18 and 120</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <h3>Website</h3>
                  <p>Valid URL format (optional)</p>
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
import type { FormData, ComputedData, FormSchema, FormValidator } from '../../../src/types';

const submittedData = ref<any>(null);

// Custom validators
const usernameValidator: FormValidator = value => {
  const username = String(value || '');
  const errors: string[] = [];

  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (username.length > 20) {
    errors.push('Username cannot exceed 20 characters');
  }

  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    errors.push('Username can only contain letters and numbers');
  }

  return errors.length > 0 ? errors : null;
};

const emailValidator: FormValidator = async value => {
  const email = String(value || '');
  const errors: string[] = [];

  if (!email) {
    errors.push('Email is required');
    return errors;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email address');
    return errors;
  }

  // Simulate async domain validation
  await new Promise(resolve => setTimeout(resolve, 500));

  const blockedDomains = ['spam.com', 'fake.com', 'blocked.com'];
  const domain = email.split('@')[1];
  if (blockedDomains.includes(domain)) {
    errors.push('This email domain is not allowed');
  }

  return errors.length > 0 ? errors : null;
};

const passwordValidator: FormValidator = value => {
  const password = String(value || '');
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return errors.length > 0 ? errors : null;
};

const ageValidator: FormValidator = value => {
  const age = Number(value);
  const errors: string[] = [];

  if (isNaN(age) || age < 18) {
    errors.push('You must be at least 18 years old');
  }

  if (age > 120) {
    errors.push('Please enter a valid age');
  }

  return errors.length > 0 ? errors : null;
};

const urlValidator: FormValidator = value => {
  if (!value) return null; // Optional field

  const url = String(value);
  try {
    new URL(url);
    return null;
  } catch {
    return ['Please enter a valid URL (e.g., https://example.com)'];
  }
};

const formSchema: FormSchema = {
  username: {
    type: 'TextInput',
    label: 'Username',
    value: '',
    placeholder: 'Enter username (3-20 chars)',
    required: true,
    validation: usernameValidator,
    grid: { xs: '12', md: '6' },
  },
  email: {
    type: 'EmailInput',
    label: 'Email Address',
    value: '',
    placeholder: 'your.email@example.com',
    required: true,
    validation: emailValidator,
    grid: { xs: '12', md: '6' },
  },
  password: {
    type: 'PasswordInput',
    label: 'Password',
    value: '',
    placeholder: 'Strong password',
    required: true,
    validation: passwordValidator,
    grid: { xs: '12' },
  },
  age: {
    type: 'NumberInput',
    label: 'Age',
    placeholder: 'Your age',
    required: true,
    validation: ageValidator,
    grid: { xs: '12', md: '6' },
  },
  website: {
    type: 'TextInput',
    label: 'Website (Optional)',
    value: '',
    placeholder: 'https://yourwebsite.com',
    validation: urlValidator,
    grid: { xs: '12', md: '6' },
  },
  terms: {
    type: 'CheckboxInput',
    label: 'I agree to the terms and conditions',
    value: false,
    required: true,
    validation: value => {
      return value ? null : ['You must agree to the terms and conditions'];
    },
    grid: { xs: '12' },
  },
  newsletter: {
    type: 'CheckboxInput',
    label: 'Subscribe to newsletter',
    value: false,
    grid: { xs: '12' },
  },
};

function handleSubmit(formData: FormData, computedData: ComputedData) {
  console.log('Validation form submitted:', formData, computedData);
  submittedData.value = {
    success: true,
    formData,
    computedData,
    message: 'All validations passed successfully!',
  };
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

.success-message {
  color: var(--ion-color-success);
  font-weight: bold;
  margin-bottom: 16px;
  padding: 12px;
  background: var(--ion-color-success-tint);
  border-radius: 8px;
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
