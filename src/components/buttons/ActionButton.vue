<template>
  <IonButton
    :color="config?.buttons?.[type]?.color ?? 'primary'"
    :fill="config?.buttons?.[type]?.fill ?? 'solid'"
    :expand="config?.buttons?.[type]?.expand"
    :size="config?.buttons?.[type]?.size ?? 'default'"
  >
    {{ finalLabel }}
  </IonButton>
</template>

<script setup lang="ts">
import { IonButton } from '@ionic/vue';
import { ActionButtonType, GlobalConfig } from '@/types';
import { computed, inject } from 'vue';

const config: GlobalConfig | undefined = inject('globalConfig');

const props = defineProps({
  type: {
    type: String as () => ActionButtonType,
    default: 'submit',
  },
  label: {
    type: String,
    required: false,
  },
});

const finalLabel = computed(() => {
  return props.label ?? config?.buttons?.[props.type]?.label ?? props.type;
});
</script>
