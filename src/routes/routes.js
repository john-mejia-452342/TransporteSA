import Login from "../components/Login.vue"
import Menu from "../components/Menu.vue"
import Vendedor from "../components/Vendedor.vue"


import {createRouter, createWebHashHistory} from 'vue-router'

const routes = [
    {path: "/",component: Login,},
    {path: "/menu",component: Menu,
      children: [
        { path: "", redirect: "/menu" },
        { path: "/vendedor", component: Vendedor },
      ],
    }
]

export const router = createRouter({
    history:createWebHashHistory(),
    routes
})