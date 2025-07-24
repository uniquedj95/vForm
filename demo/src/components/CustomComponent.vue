<!-- ANCHistoryComponent.vue -->
<template>
  <div class="anc-history-component">
    <ion-card>
      <ion-card-header>
        <ion-card-title>Previous ANC Visits</ion-card-title>
        <ion-card-subtitle>{{ patientName }}'s visit history</ion-card-subtitle>
      </ion-card-header>

      <ion-card-content>
        <ion-list>
          <ion-item v-if="loading">
            <ion-spinner name="dots"></ion-spinner>
            <ion-label class="ion-padding-start">Loading visit history...</ion-label>
          </ion-item>

          <template v-else>
            <!-- No data message -->
            <ion-item v-if="visits.length === 0" lines="none">
              <ion-label class="ion-text-center">No previous visits recorded</ion-label>
            </ion-item>

            <!-- Visits data -->
            <ion-item v-for="visit in visits" :key="visit.id" button @click="selectVisit(visit)">
              <ion-label>
                <h2>{{ formatDate(visit.date) }}</h2>
                <p>Week: {{ visit.week }}</p>
                <p>BP: {{ visit.bloodPressure }}</p>
                <p>Weight: {{ visit.weight }}kg</p>
              </ion-label>
              <ion-note slot="end" :color="visit.id === selectedVisit?.id ? 'primary' : ''">
                {{ visit.id === selectedVisit?.id ? 'Selected' : 'Tap to select' }}
              </ion-note>
            </ion-item>
          </template>
        </ion-list>
      </ion-card-content>
    </ion-card>

    <!-- Selected Visit Details -->
    <ion-card v-if="selectedVisit">
      <ion-card-header>
        <ion-card-title>Visit Details</ion-card-title>
        <ion-card-subtitle>{{ formatDate(selectedVisit.date) }}</ion-card-subtitle>
      </ion-card-header>

      <ion-card-content>
        <ion-list>
          <ion-item>
            <ion-label>
              <h3>Gestational Age:</h3>
              <p>{{ selectedVisit.week }} weeks</p>
            </ion-label>
          </ion-item>

          <ion-item>
            <ion-label>
              <h3>Blood Pressure:</h3>
              <p>{{ selectedVisit.bloodPressure }}</p>
            </ion-label>
          </ion-item>

          <ion-item>
            <ion-label>
              <h3>Weight:</h3>
              <p>{{ selectedVisit.weight }}kg</p>
            </ion-label>
          </ion-item>

          <ion-item>
            <ion-label>
              <h3>Fetal Heart Rate:</h3>
              <p>{{ selectedVisit.fetalHeartRate }} bpm</p>
            </ion-label>
          </ion-item>

          <ion-item lines="none">
            <ion-label>
              <h3>Notes:</h3>
              <p>{{ selectedVisit.notes || 'No notes recorded' }}</p>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-card-content>
    </ion-card>

    <!-- Action Buttons -->
    <div class="ion-padding ion-text-end">
      <ion-button fill="outline" @click="refreshData">
        <ion-icon slot="start" :icon="refreshOutline"></ion-icon>
        Refresh Data
      </ion-button>

      <ion-button @click="continueToNextStep" :disabled="!selectedVisit && requireSelection">
        Continue
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits, defineExpose } from 'vue';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonSpinner,
  IonButton,
  IonIcon,
} from '@ionic/vue';
import { refreshOutline } from 'ionicons/icons';

// Define props
const props = defineProps({
  patientId: {
    type: String,
    required: true,
  },
  patientName: {
    type: String,
    default: 'Patient',
  },
  requireSelection: {
    type: Boolean,
    default: true,
  },
});

// Define emits
const emit = defineEmits(['update:data']);

// Component state
const loading = ref(true);
const visits = ref<any[]>([]);
const selectedVisit = ref<any>(null);

// Mock data - in a real app you would fetch this from an API
const mockVisits = [
  {
    id: 'v1',
    date: new Date(2025, 5, 10),
    week: 12,
    bloodPressure: '120/80',
    weight: 65,
    fetalHeartRate: 140,
    notes: 'First trimester checkup, everything normal.',
  },
  {
    id: 'v2',
    date: new Date(2025, 6, 8),
    week: 16,
    bloodPressure: '118/76',
    weight: 67.5,
    fetalHeartRate: 145,
    notes: 'Patient reported mild nausea in the mornings.',
  },
  {
    id: 'v3',
    date: new Date(2025, 7, 5),
    week: 20,
    bloodPressure: '122/82',
    weight: 69.8,
    fetalHeartRate: 150,
    notes: 'Ultrasound performed, fetal development on track.',
  },
];

// Format date helper
function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Load data
function loadData() {
  loading.value = true;

  // Simulate API call
  setTimeout(() => {
    visits.value = [...mockVisits];
    loading.value = false;
  }, 1000);
}

// Select a visit
function selectVisit(visit: any) {
  selectedVisit.value = visit;

  // Emit data update to parent form
  emit('update:data', {
    selectedVisitId: visit.id,
    visitDate: visit.date,
    visitWeek: visit.week,
    previousData: {
      bloodPressure: visit.bloodPressure,
      weight: visit.weight,
      fetalHeartRate: visit.fetalHeartRate,
    },
  });
}

// Refresh the data
function refreshData() {
  loadData();
  selectedVisit.value = null;
}

// Continue to next step
function continueToNextStep() {
  // If selection is required but nothing selected
  if (props.requireSelection && !selectedVisit.value) {
    alert('Please select a visit to continue.');
    return;
  }

  // If no selection required, emit null data
  if (!selectedVisit.value) {
    emit('update:data', {
      selectedVisitId: null,
      newPatient: true,
    });
  }
}

// Validate method for the form integration
function validate() {
  if (props.requireSelection && !selectedVisit.value) {
    alert('Please select a visit before proceeding.');
    return false;
  }
  return true;
}

// Load data on component mount
onMounted(() => {
  loadData();
});

// Expose methods to parent
defineExpose({
  validate,
  refreshData,
});
</script>

<style scoped>
.anc-history-component {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}
</style>
