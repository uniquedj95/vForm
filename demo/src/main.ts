import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import App from './App.vue';

// Import VForm from the installed npm package
import VForm from '@uniquedj95/vform';
import '@uniquedj95/vform/vform.css';

import BasicDemo from './components/BasicDemo.vue';
import AdvancedDemo from './components/AdvancedDemo.vue';
import ValidationDemo from './components/ValidationDemo.vue';
import DependentFieldsDemo from './components/DependentFieldsDemo.vue';
import CustomStylesDemo from './components/CustomStylesDemo.vue';

const routes = [
  { path: '/', redirect: '/basic' },
  { path: '/basic', component: BasicDemo, meta: { title: 'Basic Form' } },
  { path: '/advanced', component: AdvancedDemo, meta: { title: 'Advanced Features' } },
  { path: '/validation', component: ValidationDemo, meta: { title: 'Validation Examples' } },
  { path: '/dependent', component: DependentFieldsDemo, meta: { title: 'Dependent Fields' } },
  { path: '/styles', component: CustomStylesDemo, meta: { title: 'Custom Styles' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

app.use(IonicVue);
app.use(router);
app.use(VForm);

router.isReady().then(() => {
  app.mount('#app');
});
