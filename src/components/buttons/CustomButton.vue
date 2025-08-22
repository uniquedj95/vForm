<template>
  <IonButton
    @click="button.action"
    :color="button.color ?? 'primary'"
    :fill="button.fill ?? 'solid'"
    :size="button.size ?? 'default'"
    :expand="button.expand"
  >
    {{ button.label }}
  </IonButton>
</template>

<script setup lang="ts">
import { CustomButton } from '@/types';
import { IonButton } from '@ionic/vue';
import { PropType } from 'vue';

defineProps({
  button: {
    type: Object as PropType<CustomButton>,
    required: true,
  },
});
</script>
