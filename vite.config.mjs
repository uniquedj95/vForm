import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue(),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "FormBuilder",
      fileName: (format) => `index.${format}.ts`,
    },
    rollupOptions: {
      external: [
        "vue",
        "@ionic/vue"
      ],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  }
})