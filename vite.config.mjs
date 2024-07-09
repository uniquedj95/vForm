import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    vue(),
    dts(),
  ],
  build: {
    cssCodeSplit: true,
    lib: {
      entry: "src/index.ts",
      name: "FormBuilder",
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
        },
        exports: "named",
      }
    },
  }
})