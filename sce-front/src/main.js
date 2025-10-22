import 'bootstrap/dist/css/bootstrap.css'
import { createApp } from 'vue'
import App from '@/App.vue'
import store from './store/index.js';
import routes from './routes/routes.js';
import i18n from './i18n/messages.js';
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.js'
import VueCookies from 'vue-cookies';

const app = createApp(App);
app.use(routes);
app.use(store);
app.use(i18n);
app.use(VueCookies);
app.mount('#app');

// pm2 to run a production server
// https://github.com/Unitech/pm2
// https://pm2.keymetrics.io/