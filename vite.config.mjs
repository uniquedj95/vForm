import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue(), dts({ insertTypesEntry: true })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@/types': fileURLToPath(new URL('./src/types/index', import.meta.url)),
      '@/components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@/composables': fileURLToPath(new URL('./src/composables', import.meta.url)),
      '@/constants': fileURLToPath(new URL('./src/constants', import.meta.url)),
      '@/utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
    },
  },
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
