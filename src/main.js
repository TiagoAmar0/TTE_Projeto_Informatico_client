import { createApp } from 'vue'

/**
 * Packages
 */
import axios from 'axios';
import { Toaster } from '@meforma/vue-toaster';

import App from './App.vue'


/**
 * Tools
 */
import router from './router'
import store from './store';

/**
 * Styles
 */
import './assets/main.css'
import 'bulma/css/bulma.min.css'
import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import '@fortawesome/fontawesome-free/css/solid.min.css'
import '@fortawesome/fontawesome-free/css/brands.min.css'


const app = createApp(App)

axios.defaults.baseURL = 'http://localhost:8000/api'
axios.defaults.headers.common['Accept'] = 'application/json'

app.config.globalProperties.$axios = axios
app.config.globalProperties.$serverUrl = 'http://localhost:8000'

app.use(router)
app.use(store)
app.use(Toaster, {
    position: 'top-right',
    timeout: 900,
    pauseOnHover: true
})

app.mount('#app')
