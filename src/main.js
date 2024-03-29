import { createApp } from 'vue'

/**
 * Packages
 */
import axios from 'axios';
import { Toaster } from '@meforma/vue-toaster'
import { vMaska } from "maska"

import App from './App.vue'


/**
 * Tools
 */
import router from './router'
import store from './store'

/**
 * Styles
 */
import './assets/main.css'
import 'bulma/css/bulma.min.css'
import '@creativebulma/bulma-tooltip/dist/bulma-tooltip.min.css'
import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import '@fortawesome/fontawesome-free/css/solid.min.css'
import '@fortawesome/fontawesome-free/css/brands.min.css'


const app = createApp(App)

const apiBaseUrl = import.meta.env.VITE_APP_API_BASE_URL
const serverBaseUrl = import.meta.env.VITE_APP_SERVER_URL

axios.defaults.baseURL = apiBaseUrl
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.withCredentials = true;

// Interceptor do status 401
axios.interceptors.response.use(
    response => response,
    error => {
        if(error.response && error.response.status === 401) {
            sessionStorage.removeItem('token')
            router.push({ name: 'login' })
        }

        return Promise.reject(error)
    }
)

app.config.globalProperties.$axios = axios
app.config.globalProperties.$serverUrl = serverBaseUrl

app.directive('maska', vMaska)
app.use(router)
app.use(store)
app.use(Toaster, {
    position: 'top-right',
    timeout: 900,
    pauseOnHover: true
})

app.mount('#app')
