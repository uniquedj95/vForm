import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    vue(),
    dts({ insertTypesEntry: true }),
  ],
  build: {
    cssCodeSplit: false,
    lib: {
      entry: "src/index.ts",
      name: "VForm",
      formats: ["es", "umd", "cjs"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      input: "src/index.ts",
      external: [
        "vue",
        "@ionic/vue"
      ],
      output: {
        globals: {
          vue: "Vue",
          '@ionic/vue': 'IonicVue',
        },
        exports: "named",
      }
    },
  }
})