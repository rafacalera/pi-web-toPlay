import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import Lara from '@primevue/themes/lara';
import App from './App.vue'
import './style.css'

const app = createApp(App);
app.use(PrimeVue, {
    theme: {
        preset: Lara,
        options: {
            darkModeSelector: 'false',
            cssLayer: false
        }
    }
});
app.mount('#app');