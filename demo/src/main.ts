import { createApp, Plugin } from 'vue';
import { IonicVue } from '@ionic/vue';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import App from './App.vue';

// Import VForm from the built package
import VForm from '@uniquedj95/vform';
import '@uniquedj95/vform/vform.css';

import BasicDemo from './components/BasicDemo.vue';
import SectionDemo from './components/SectionDemo.vue';
import MultiStepDemo from './components/MultiStepDemo.vue';
import AdvancedDemo from './components/AdvancedDemo.vue';
import ValidationDemo from './components/ValidationDemo.vue';
import DependentFieldsDemo from './components/DependentFieldsDemo.vue';
import CustomStylesDemo from './components/CustomStylesDemo.vue';
import CustomComponentExample from './components/CustomComponentDemo.vue';
import ConditionalStepsDemo from './components/ConditionalStepsDemo.vue';
import RepeatInputDemo from './components/RepeatInputDemo.vue';

const routes = [
  { path: '/', redirect: '/basic' },
  { path: '/basic', component: BasicDemo, meta: { title: 'Basic Form' } },
  { path: '/sections', component: SectionDemo, meta: { title: 'Section Demo' } },
  { path: '/multi-step', component: MultiStepDemo, meta: { title: 'Multi-Step Form' } },
  { path: '/advanced', component: AdvancedDemo, meta: { title: 'Advanced Features' } },
  { path: '/validation', component: ValidationDemo, meta: { title: 'Validation Examples' } },
  { path: '/dependent', component: DependentFieldsDemo, meta: { title: 'Dependent Fields' } },
  { path: '/styles', component: CustomStylesDemo, meta: { title: 'Custom Styles' } },
  {
    path: '/custom-component',
    component: CustomComponentExample,
    meta: { title: 'Custom Component Demo' },
  },
  {
    path: '/conditional-steps',
    component: ConditionalStepsDemo,
    meta: { title: 'Conditional Steps Demo' },
  },
  {
    path: '/repeat-input',
    component: RepeatInputDemo,
    meta: { title: 'Repeat Input Demo' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

app.use(IonicVue);
app.use(router);
app.use(VForm as Plugin);

router.isReady().then(() => {
  app.mount('#app');
});
