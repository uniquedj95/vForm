<template>
  <ion-app>
    <ion-split-pane content-id="main-content">
      <ion-menu content-id="main-content" type="overlay">
        <ion-content>
          <ion-list id="demo-list">
            <ion-list-header>VForm Demo</ion-list-header>
            <ion-note>Explore all features</ion-note>

            <ion-menu-toggle :auto-hide="false" v-for="(page, index) in pages" :key="index">
              <ion-item
                router-link-exact
                :router-link="page.url"
                lines="none"
                :detail="false"
                class="hydrated"
                :class="{ selected: selectedIndex === index }"
              >
                <ion-icon :icon="page.icon" slot="start"></ion-icon>
                <ion-label>{{ page.title }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>

          <div class="demo-info">
            <ion-note>
              <h4>About VForm</h4>
              <p>
                A simplified Ionic Vue form builder with validation, masking, and dependent fields
                support.
              </p>
            </ion-note>
          </div>
        </ion-content>
      </ion-menu>

      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-split-pane>
  </ion-app>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  IonApp,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRouterOutlet,
  IonSplitPane,
} from '@ionic/vue';
import {
  documentTextOutline,
  settingsOutline,
  checkboxOutline,
  linkOutline,
  colorPaletteOutline,
  layersOutline,
  listOutline,
  cubeOutline,
  eyeOutline,
  copyOutline,
} from 'ionicons/icons';

const selectedIndex = ref(0);
const route = useRoute();

const pages = [
  {
    title: 'Basic Form',
    url: '/basic',
    icon: documentTextOutline,
  },
  {
    title: 'Section Demo',
    url: '/sections',
    icon: listOutline,
  },
  {
    title: 'Multi-Step Form',
    url: '/multi-step',
    icon: layersOutline,
  },
  {
    title: 'Advanced Features',
    url: '/advanced',
    icon: settingsOutline,
  },
  {
    title: 'Validation Examples',
    url: '/validation',
    icon: checkboxOutline,
  },
  {
    title: 'Dependent Fields',
    url: '/dependent',
    icon: linkOutline,
  },
  {
    title: 'Custom Styles',
    url: '/styles',
    icon: colorPaletteOutline,
  },
  {
    title: 'Custom Components',
    url: '/custom-component',
    icon: cubeOutline,
  },
  {
    title: 'Conditional Steps',
    url: '/conditional-steps',
    icon: eyeOutline,
  },
  {
    title: 'Repeat Input Fields',
    url: '/repeat-input',
    icon: copyOutline,
  },
  {
    title: 'Async Field Values',
    url: '/async-field-values',
    icon: documentTextOutline,
  },
];

watch(
  () => route.path,
  newPath => {
    const index = pages.findIndex(page => page.url === newPath);
    selectedIndex.value = index !== -1 ? index : 0;
  },
  { immediate: true }
);
</script>

<style scoped>
ion-menu ion-content {
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

ion-menu.md ion-content {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu.md ion-list {
  padding: 20px 0;
}

ion-menu.md ion-note {
  margin-bottom: 30px;
}

ion-menu.md ion-list-header,
ion-menu.md ion-note {
  padding-left: 10px;
}

ion-menu.md ion-list#demo-list {
  border-bottom: 1px solid var(--ion-color-step-150, #d7d8da);
}

ion-menu.md ion-list#demo-list ion-list-header {
  font-size: 22px;
  font-weight: 600;
  min-height: 20px;
}

ion-menu.md ion-list#demo-list ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
}

ion-menu.md ion-list#demo-list ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-list#demo-list ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.md ion-list#demo-list ion-item ion-icon {
  color: #616e7e;
}

ion-menu.md ion-list#demo-list ion-item ion-label {
  font-weight: 500;
}

.demo-info {
  padding: 20px 10px;
  margin-top: 20px;
  border-top: 1px solid var(--ion-color-step-150, #d7d8da);
}

.demo-info h4 {
  margin: 0 0 10px 0;
  color: var(--ion-color-primary);
}

.demo-info p {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
}
</style>
