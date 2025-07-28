<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Repeat Input Demo</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Repeat Input Demo</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="demo-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Inventory Items</ion-card-title>
            <ion-card-subtitle
              >Add multiple items with dynamically repeatable fields</ion-card-subtitle
            >
          </ion-card-header>

          <ion-card-content>
            <VForm
              :schema="formSchema"
              @submit="handleSubmit"
              submit-button-text="Save Items"
              clear-button-text="Clear All"
              :show-labels="true"
              button-placement="end"
            />
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Contact List</ion-card-title>
            <ion-card-subtitle>Complex repeatable fields with validation</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <VForm
              :schema="contactsSchema"
              @submit="handleContactsSubmit"
              submit-button-text="Save Contacts"
              clear-button-text="Clear List"
              :show-labels="true"
              button-placement="end"
            />
          </ion-card-content>
        </ion-card>

        <ion-card v-if="submittedData">
          <ion-card-header>
            <ion-card-title>Form Result</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <ion-segment v-model="activeTab">
              <ion-segment-button value="data">
                <ion-label>Submitted Data</ion-label>
              </ion-segment-button>
              <ion-segment-button value="computed">
                <ion-label>Computed Data</ion-label>
              </ion-segment-button>
            </ion-segment>

            <div class="segment-content">
              <div v-if="activeTab === 'data'">
                <h4>Form Data</h4>
                <pre>{{ JSON.stringify(submittedData, null, 2) }}</pre>
              </div>
              <div v-if="activeTab === 'computed'">
                <h4>Computed Data</h4>
                <pre>{{ JSON.stringify(computedDataValue, null, 2) }}</pre>
              </div>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
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
  IonCardContent,
  IonCardSubtitle,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/vue';
import { FormSchema, FormData, ComputedData } from '@uniquedj95/vform';

// Simple inventory items with repeatable fields
const formSchema = ref<FormSchema>({
  inventoryItems: {
    type: 'RepeatInput',
    label: 'Inventory Items',
    className: 'inventory-repeat',
    children: {
      itemName: {
        type: 'TextInput',
        label: 'Item Name',
        required: true,
        grid: { xs: '12', md: '6' },
      },
      quantity: {
        type: 'NumberInput',
        label: 'Quantity',
        required: true,
        min: 1,
        grid: { xs: '12', md: '3' },
      },
      unitPrice: {
        type: 'NumberInput',
        label: 'Unit Price ($)',
        required: true,
        min: 0,
        grid: { xs: '12', md: '3' },
      },
    },
  },
});

// Complex contacts list with nested fields and validation
const contactsSchema = ref<FormSchema>({
  contactList: {
    type: 'RepeatInput',
    label: 'Contact List',
    className: 'contacts-repeat',
    children: {
      contactSection: {
        type: 'FormSection',
        title: 'Contact Information',
      },
      name: {
        type: 'TextInput',
        label: 'Full Name',
        required: true,
        grid: { xs: '12', md: '6' },
      },
      email: {
        type: 'EmailInput',
        label: 'Email Address',
        required: true,
        grid: { xs: '12', md: '6' },
        validation: value => {
          if (!value || typeof value !== 'string') return ['Email is required'];
          if (!value.includes('@')) return ['Invalid email format'];
          return null;
        },
      },
      phoneType: {
        type: 'SelectInput',
        label: 'Phone Type',
        grid: { xs: '12', md: '4' },
        options: [
          { label: 'Mobile', value: 'mobile' },
          { label: 'Work', value: 'work' },
          { label: 'Home', value: 'home' },
        ],
      },
      phoneNumber: {
        type: 'TextInput',
        label: 'Phone Number',
        grid: { xs: '12', md: '8' },
        pattern: '\\(\\d{3}\\) \\d{3}-\\d{4}',
        placeholder: '(555) 555-5555',
      },
      addressSection: {
        type: 'FormSection',
        title: 'Address',
        subtitle: 'Optional',
      },
      street: {
        type: 'TextInput',
        label: 'Street Address',
        grid: { xs: '12' },
      },
      city: {
        type: 'TextInput',
        label: 'City',
        grid: { xs: '12', md: '4' },
      },
      state: {
        type: 'TextInput',
        label: 'State/Province',
        grid: { xs: '12', md: '4' },
      },
      zip: {
        type: 'TextInput',
        label: 'ZIP/Postal Code',
        grid: { xs: '12', md: '4' },
      },
      notes: {
        type: 'TextAreaInput',
        label: 'Notes',
        rows: 2,
        autoGrow: true,
        grid: { xs: '12' },
      },
    },
  },
});

const submittedData = ref<FormData | null>(null);
const computedDataValue = ref<ComputedData | null>(null);
const activeTab = ref('data');

const handleSubmit = (data: FormData, computedData: ComputedData) => {
  console.log('Inventory items submitted:', data, computedData);
  submittedData.value = data;
  computedDataValue.value = computedData;

  // Define inventory item type
  interface InventoryItemData {
    quantity: string | number;
    unitPrice: string | number;
    itemName?: string;
  }

  // Calculate total value
  let totalValue = 0;
  if (data.inventoryItems && Array.isArray(data.inventoryItems)) {
    data.inventoryItems.forEach(item => {
      // RepeatInput stores data in the 'other' property of each Option
      const itemData = item.other as InventoryItemData;
      if (itemData) {
        const quantity = Number(itemData.quantity) || 0;
        const price = Number(itemData.unitPrice) || 0;
        totalValue += quantity * price;
      }
    });
  }

  console.log('Total inventory value:', totalValue);
};

const handleContactsSubmit = (data: FormData, computedData: ComputedData) => {
  console.log('Contacts submitted:', data, computedData);
  submittedData.value = data;
  computedDataValue.value = computedData;
};
</script>

<style scoped>
.demo-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 0.85rem;
}

.segment-content {
  margin-top: 16px;
}

.segment-content h4 {
  margin-top: 0;
  color: var(--ion-color-primary);
  font-weight: 500;
}

/* Custom styling for the repeat groups */
:deep(.inventory-repeat) {
  --background: #f0f8ff;
  border-left: 4px solid #4d76ff;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 12px;
}

:deep(.contacts-repeat) {
  --background: #fafafa;
  border-left: 4px solid #45c289;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
}
</style>
