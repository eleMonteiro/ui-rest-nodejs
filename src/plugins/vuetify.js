import { createVuetify } from "vuetify";
import "@/assets/main.css";
import "@mdi/font/css/materialdesignicons.css";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  ssr: true,
  components,
  directives,
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#3c1518",
          secondary: "#69140e",
          blackBean: "#3c1518",
          bloodRed: "#69140e",
          brown: "#a44200",
          bronze: "#d58936",
          vanilla: "#f2f3ae",
          white: "#ffffff",
          success: "#3c1518",
          info: "#f2f3ae",
          error: "#69140e",
          warning: "#d58936",
        },
      },
    },
    aliases: {
      primary: "primary",
      secondary: "secondary",
      blackBean: "blackBean",
      bloodRed: "bloodRed",
      brown: "brown",
      bronze: "bronze",
      vanilla: "vanilla",
      white: "white",
    },
  },
  icons: {
    iconfont: "mdi",
  },
});

export default vuetify;
