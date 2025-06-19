<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Advanced Features</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Advanced Features</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="demo-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Advanced Form Features</ion-card-title>
            <ion-card-subtitle>Masking, computed values, and dynamic options</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <VForm
              :schema="formSchema"
              @submit="handleSubmit"
              :custom-buttons="customButtons"
              submit-button-text="Process Order"
            />
          </ion-card-content>
        </ion-card>

        <ion-card v-if="submittedData">
          <ion-card-header>
            <ion-card-title>Processed Data</ion-card-title>
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
  alertController,
} from '@ionic/vue';
import type { FormData, ComputedData, FormSchema, CustomButton } from '../../../src/types';

const submittedData = ref<any>(null);

const customButtons: CustomButton[] = [
  {
    label: 'Save Draft',
    color: 'secondary',
    action: async () => {
      const alert = await alertController.create({
        header: 'Draft Saved',
        message: 'Your form has been saved as a draft.',
        buttons: ['OK'],
      });
      await alert.present();
    },
    icon: '',
  },
];

const formSchema: FormSchema = {
  productName: {
    type: 'TextInput',
    label: 'Product Name',
    value: '',
    placeholder: 'Enter product name',
    required: true,
    grid: { xs: '12', md: '6' },
  },
  sku: {
    type: 'TextInput',
    label: 'SKU',
    value: '',
    placeholder: 'SKU-0000',
    pattern: 'SKU-0000',
    grid: { xs: '12', md: '6' },
  },
  price: {
    type: 'NumberInput',
    label: 'Unit Price ($)',
    placeholder: '0.00',
    min: 0,
    grid: { xs: '12', md: '4' },
  },
  quantity: {
    type: 'NumberInput',
    label: 'Quantity',
    value: 1,
    min: 1,
    max: 1000,
    grid: { xs: '12', md: '4' },
    computedValue: (_value, schema) => {
      const price = Number(schema.price?.value) || 0;
      const quantity = Number(schema.quantity?.value) || 1;
      schema.totalPrice.value = (price * quantity).toFixed(2);
      return quantity;
    },
  },
  totalPrice: {
    type: 'NumberInput',
    label: 'Total Price ($)',
    disabled: true,
    grid: { xs: '12', md: '4' },
  },
  category: {
    type: 'SelectInput',
    label: 'Category',
    value: '',
    options: [
      { label: 'Electronics', value: 'electronics' },
      { label: 'Clothing', value: 'clothing' },
      { label: 'Books', value: 'books' },
      { label: 'Home & Garden', value: 'home_garden' },
      { label: 'Sports', value: 'sports' },
    ],
    required: true,
    grid: { xs: '12', md: '6' },
  },
  tags: {
    type: 'TextAreaInput',
    label: 'Tags (comma separated)',
    value: '',
    placeholder: 'tag1, tag2, tag3',
    rows: 3,
    grid: { xs: '12', md: '6' },
  },
  phoneNumber: {
    type: 'TextInput',
    label: 'Contact Phone',
    value: '',
    placeholder: '(000) 000-0000',
    grid: { xs: '12', md: '6' },
  },
  urgent: {
    type: 'CheckboxInput',
    label: 'Urgent Processing',
    value: false,
    grid: { xs: '12', md: '6' },
  },
  priority: {
    type: 'RadioInput',
    label: 'Priority Level',
    value: 'normal',
    options: [
      { label: 'Low', value: 'low' },
      { label: 'Normal', value: 'normal' },
      { label: 'High', value: 'high' },
      { label: 'Critical', value: 'critical' },
    ],
    grid: { xs: '12' },
  },
  notes: {
    type: 'TextAreaInput',
    label: 'Additional Notes',
    value: '',
    placeholder: 'Any special instructions or notes...',
    rows: 4,
    grid: { xs: '12' },
  },
};

function handleSubmit(formData: FormData, computedData: ComputedData) {
  console.log('Advanced form submitted:', formData, computedData);
  submittedData.value = { formData, computedData };
}
</script>

<style scoped>
.demo-container {
  padding: 20px;
  max-width: 900px;
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
