<template>
  <ion-label :slot="slotName" v-if="showLabel" class="input-label">
    {{ labelText }}
    <ion-text color="danger" v-if="showRequired">*</ion-text>
  </ion-label>
</template>

<script lang="ts" setup>
import { IonLabel, IonText } from '@ionic/vue';
import type { FormField } from '@/types';
import { useLabelTemplate } from '@/composables/useLabelTemplate';
import { toRef } from 'vue';

const props = defineProps<{
  model: FormField;
  slotName?: string;
}>();

const { showLabel, showRequired, labelText } = useLabelTemplate(toRef(props, 'model'));
</script>
