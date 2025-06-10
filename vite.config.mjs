import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [vue(), dts({ insertTypesEntry: true })],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  build: {
    cssCodeSplit: false,
    minify: true,
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      name: 'VForm',
      formats: ['es', 'umd', 'cjs'],
      fileName: format => `index.${format}.js`,
    },
    rollupOptions: {
      input: 'src/index.ts',
      external: ['vue', '@ionic/vue', 'vue-router', 'ionicons/icons', '@maskito/vue'],
      output: {
        globals: {
          vue: 'Vue',
          '@ionic/vue': 'IonicVue',
          'vue-router': 'VueRouter',
          'ionicons/icons': 'IoniconsIcons',
          '@maskito/vue': 'MaskitoVue',
        },
        exports: 'named',
        manualChunks: undefined, // Disable chunk splitting in library mode
      },
    },
  },
});
