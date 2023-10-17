import Buses from "../components/Buses.vue"
import Main from "../components/Main.vue"


import {createRouter, createWebHashHistory} from 'vue-router'

const routes = [
    {path: "/", component:Main},
    {path: "/buses", component:Buses}
]

export const router = createRouter({
    history:createWebHashHistory(),
    routes
})