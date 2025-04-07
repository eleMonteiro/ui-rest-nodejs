import { createVuetify } from "vuetify";
import "@/assets/main.css";
import "@mdi/font/css/materialdesignicons.css";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";

const myTheme = {
  colors: {
    background: "#3c1518",
    surface: "#ffffff",
    primary: "#3c1518",
    secondary: "#69140e",
    success: "#3c1518",
    info: "#f2f3ae",
    error: "#69140e",
    warning: "#d58936",

    blackBean: "#3c1518",
    bloodRed: "#69140e",
    brown: "#a44200",
    bronze: "#d58936",
    vanilla: "#f2f3ae",
    white: "#ffffff",
  },
};

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "myTheme",
    themes: {
      dark: myTheme,
      light: myTheme,
      myTheme: myTheme,
    },
  },
  icons: {
    defaultSet: "mdi",
    aliases: {
      ...aliases,
    },
    sets: {
      ...mdi,
    },
  },
});

export default vuetify;
