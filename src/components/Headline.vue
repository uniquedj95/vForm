<template>
  <h1 :style="{ color: $coloredText.textColor }">
    <slot></slot>
  </h1>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Headline"
})
</script>
