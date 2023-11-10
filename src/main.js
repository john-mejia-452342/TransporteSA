import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {router} from "./routes/routes.js"
import { Quasar, Notify } from 'quasar'
import axios from 'axios'
import { createPinia} from 'pinia'

import '@quasar/extras/material-icons/material-icons.css'

import 'quasar/src/css/index.sass'

const pinia = createPinia()

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(Quasar, {
    plugins:{
        Notify
    },
})

axios.defaults.baseURL="https://transporte-czaa.onrender.com/api/"

app.mount('#app')
