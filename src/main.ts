import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// PWA doesn't work yet with rollup
// import './registerServiceWorker';

createApp(App).use(router).mount('body');
