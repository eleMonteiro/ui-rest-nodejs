import { createVuetify } from "vuetify";
import "@/assets/main.scss";
import "@mdi/font/css/materialdesignicons.css";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";

const myTheme = {
  dark: false,
  colors: {
    background: "#3c1518",
    surface: "#ffffff",
    primary: "#3c1518",
    secondary: "#69140e",
    accent: "#d58936",
    background: "#a44200",
    surface: "#f2f3ae",
    avatar: "#823b19",
    error: "#ffb3ba",
    info: "#d0efff",
    success: "#a8e6cf",
    warning: "#fff5ba",
    text: "#ffffff",
    "on-primary": "#ffffff",
    "on-secondary": "#ffffff",
    "on-surface": "#ffffff",
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
