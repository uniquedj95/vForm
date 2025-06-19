<template>
  <div
    class="step-indicator"
    :class="[`step-indicator--${position}`, { 'step-indicator--clickable': allowNavigation }]"
  >
    <div class="step-indicator__container">
      <div
        v-for="(step, index) in steps"
        :key="step.id"
        class="step-indicator__step"
        :class="{
          'step-indicator__step--active': index === activeStepIndex,
          'step-indicator__step--completed': index < activeStepIndex,
          'step-indicator__step--clickable': allowNavigation,
        }"
        @click="handleStepClick(index)"
      >
        <div class="step-indicator__step-content">
          <div class="step-indicator__step-marker">
            <span>{{ index + 1 }}</span>
          </div>
          <div class="step-indicator__step-info">
            <div class="step-indicator__step-title">{{ step.title }}</div>
            <div v-if="step.subtitle" class="step-indicator__step-subtitle">
              {{ step.subtitle }}
            </div>
          </div>
        </div>
        <div
          v-if="index < steps.length - 1"
          class="step-indicator__connector"
          :class="{ 'step-indicator__connector--completed': index < activeStepIndex }"
        ></div>
      </div>
    </div>

    <div
      v-if="showProgress && (position === 'top' || position === 'bottom')"
      class="step-indicator__progress"
    >
      <div class="step-indicator__progress-bar">
        <div
          class="step-indicator__progress-fill"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
      <div class="step-indicator__progress-text">
        Step {{ activeStepIndex + 1 }} of {{ steps.length }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { FormStep, StepPosition } from '@/types';

interface StepIndicatorProps {
  steps: FormStep[];
  activeStepIndex: number;
  position: StepPosition;
  showProgress?: boolean;
  allowNavigation?: boolean;
}

const props = withDefaults(defineProps<StepIndicatorProps>(), {
  showProgress: true,
  allowNavigation: false,
});

const emit = defineEmits<{
  (e: 'step-click', stepIndex: number): void;
}>();

const progressPercentage = computed(() => {
  if (props.steps.length === 0) return 0;
  return ((props.activeStepIndex + 1) / props.steps.length) * 100;
});

function handleStepClick(stepIndex: number) {
  if (props.allowNavigation) {
    emit('step-click', stepIndex);
  }
}
</script>

<style scoped>
.step-indicator {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step-indicator--top,
.step-indicator--bottom {
  flex-direction: column;
}

.step-indicator--left,
.step-indicator--right {
  flex-direction: row;
}

.step-indicator__container {
  display: flex;
  align-items: center;
  gap: 0;
}

.step-indicator--left .step-indicator__container,
.step-indicator--right .step-indicator__container {
  flex-direction: column;
  align-items: stretch;
}

.step-indicator__step {
  display: flex;
  align-items: center;
  position: relative;
  flex: 1;
}

.step-indicator--left .step-indicator__step,
.step-indicator--right .step-indicator__step {
  flex-direction: column;
  align-items: stretch;
  padding: 0.5rem 0;
}

.step-indicator--left .step-indicator__step {
  align-items: flex-start;
  padding: 1.5rem 0;
}

.step-indicator--right .step-indicator__step {
  align-items: flex-end;
  padding: 1.5rem 0;
}

.step-indicator__step--clickable {
  cursor: pointer;
}

.step-indicator__step--clickable:hover .step-indicator__step-marker {
  transform: scale(1.1);
}

.step-indicator__step-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 1;
}

.step-indicator--left .step-indicator__step-content {
  flex-direction: row;
  text-align: left;
  gap: 1.75rem;
}

.step-indicator--right .step-indicator__step-content {
  flex-direction: row-reverse;
  text-align: right;
  gap: 1.75rem;
}

.step-indicator__step-marker {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  background: var(--ion-color-light);
  border: 2px solid var(--ion-color-medium);
  color: var(--ion-color-light-contrast);
  position: relative;
}

.step-indicator__step--active .step-indicator__step-marker {
  background: var(--ion-color-primary);
  border-color: var(--ion-color-primary);
  color: var(--ion-color-primary-contrast);
}

.step-indicator__step--completed .step-indicator__step-marker {
  background: var(--ion-color-success);
  border-color: var(--ion-color-success);
  color: var(--ion-color-primary-contrast);
}

.step-indicator__check-icon {
  font-size: 1rem;
  font-weight: bold;
}

.step-indicator__step-info {
  flex: 1;
  min-width: 0;
}

.step-indicator--right .step-indicator__step-info {
  text-align: right;
}

.step-indicator__step-title {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--ion-color-dark);
  margin: 0;
}

.step-indicator__step--active .step-indicator__step-title {
  color: var(--ion-color-primary);
}

.step-indicator__step-subtitle {
  font-size: 0.75rem;
  color: var(--ion-color-medium);
  margin: 0;
  margin-top: 0.25rem;
}

.step-indicator__connector {
  height: 2px;
  background: var(--ion-color-light);
  flex: 1;
  margin: 0 1rem;
  transition: background-color 0.3s ease;
}

.step-indicator--left .step-indicator__connector,
.step-indicator--right .step-indicator__connector {
  height: 100%;
  width: 2px;
  margin: 0.5rem 0;
  position: absolute;
  top: 2.5rem;
  bottom: -0.5rem;
}

.step-indicator--left .step-indicator__connector {
  left: 1.25rem; /* Center of the marker */
  transform: translateX(-50%);
}

.step-indicator--right .step-indicator__connector {
  right: 1.25rem; /* Center of the marker from right */
  transform: translateX(50%);
}

.step-indicator__connector--completed {
  background: var(--ion-color-success);
}

.step-indicator__progress {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.step-indicator__progress-bar {
  height: 4px;
  background: var(--ion-color-light);
  border-radius: 2px;
  overflow: hidden;
}

.step-indicator__progress-fill {
  height: 100%;
  background: var(--ion-color-primary);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.step-indicator__progress-text {
  font-size: 0.75rem;
  color: var(--ion-color-medium);
  text-align: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .step-indicator__step-title {
    font-size: 0.75rem;
  }

  .step-indicator__step-subtitle {
    font-size: 0.625rem;
  }

  .step-indicator__step-marker {
    width: 2rem;
    height: 2rem;
    font-size: 0.75rem;
  }
}
</style>
