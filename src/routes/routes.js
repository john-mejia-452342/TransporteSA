import Login from "../components/Login.vue"
import Menu from "../components/Menu.vue"


import {createRouter, createWebHashHistory} from 'vue-router'

const routes = [
    {path: "/",component: Login,},
    {path: "/menu",component: Menu,
    //   children: [
    //     { path: "", redirect: "/menu" },
    //     { path: "/infoEmpresa", component: infoEmpresa },
    //     { path: "/clientes", component: clientes },
    //     { path: "/conductores", component: conductores },
    //     {path : "/revision" , component : revision},
    //     {path : "/rutas" , component :rutas},
    //     {path : "/ticket" , name:"Ticket", component :ticket},
    //     {path : "/vehiculos" , component : vehiculos},
    //     {path : "/venta" , component : ventas}
    //   ],
    }
]

export const router = createRouter({
    history:createWebHashHistory(),
    routes
})