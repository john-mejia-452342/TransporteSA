import Login from "../components/Login.vue"
import Menu from "../components/Menu.vue"
import Vendedor from "../components/Vendedor.vue"
import Bus from "../components/Bus.vue"
import Cliente from "../components/Cliente.vue"
import Horario from "../components/Horario.vue"
import Conductores from "../components/Conductores.vue"

import {createRouter, createWebHashHistory} from 'vue-router'

const routes = [
    {path: "/",component: Login,},
    {path: "/menu",component: Menu, 
      children: [
        { path: "/vendedor", component: Vendedor,},
        { path: "/bus", component: Bus,},
        { path: "/cliente", component: Cliente,},
        { path: "/horario", component: Horario,},
        {path: "/conductores", component: Conductores}

      ],
    }
]

export const router = createRouter({
    history:createWebHashHistory(),
    routes
})