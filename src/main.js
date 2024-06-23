import { createApp } from "vue";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import Lara from "@primevue/themes/lara";
import App from "./App.vue";
import "primeicons/primeicons.css";
import "./style.css";

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: Lara,
    options: {
      darkModeSelector: "false",
      cssLayer: false,
    },
  },
});
app.use(ToastService);
app.use(ConfirmationService);
app.mount("#app");
