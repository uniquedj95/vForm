import { App, Plugin } from 'vue';
import Headline from './components/Headline.vue'
import { ColoredText } from "./types/ColoredText";
import { ColoredTextOptions } from './types/ColoredTextOptions';

// Used to create a new ColoredText. "options" will be whatever you add later to "app.use(ColoredTextPlugin, options);"
const createColoredText = (options: ColoredTextOptions): ColoredText => {
  return {
    textColor: options.color,
  }
}

// The Install function used by Vue to register the plugin
export const ColoredTextPlugin: Plugin = {
  install(app: App, options: ColoredTextOptions) {
    // makes ColoredText available in your Vue.js app as either "$this.coloredText" (in your Source) or "{{ $coloredText }}" in your templates
    app.config.globalProperties.$coloredText = createColoredText(options)
    // register Headline as a global component, so you can use it wherever you want in your app
    app.component('Headline', Headline)
  }
}