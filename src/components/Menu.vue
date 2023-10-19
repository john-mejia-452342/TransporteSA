<template>
    <q-layout view="hHh lpR fFf">

        <q-header reveal elevated class="bg-primary text-white">
            <q-toolbar>
                <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

                <q-toolbar-title>
                    <q-avatar>
                        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
                    </q-avatar>
                    Terminal de buses
                </q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-drawer id="menulateral" v-model="leftDrawerOpen" side="left" overlay elevated>
            <img id="logo"
                src="https://static.vecteezy.com/system/resources/thumbnails/007/794/726/small/travel-bus-illustration-logo-on-light-background-free-vector.jpg"
                alt="">
            <q-btn id="btnmenu"><i class="fa-solid fa-house-user"></i> <router-link to="/main">Menu</router-link></q-btn>
            <q-btn id="btnmenu"><i class="fa-solid fa-wallet"></i> <router-link
                    to="/vendedor">Vendedor</router-link></q-btn>
            <q-btn id="btnmenu"><i class="fa-solid fa-bus"></i><router-link to="/bus">Bus</router-link></q-btn>
            <q-btn id="btnmenu"><i class="fa-regular fa-id-card"></i><router-link
                    to="/conductores">Conductores</router-link></q-btn>
            <q-btn id="btnmenu"><i class="fa-solid fa-user"></i><router-link to="/cliente">Clientes</router-link></q-btn>
            <q-btn id="btnmenu"><i class="fa-solid fa-clock"></i><router-link to="/horario">Horarios</router-link></q-btn>
        </q-drawer>
        <q-page-container class="contenedor2">
            
            <router-view />
        </q-page-container>

        <q-footer elevated class="bg-grey-8 text-white">
            <q-toolbar>
                <q-toolbar-title>
                    <q-avatar>
                        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
                    </q-avatar>
                    <div>Title</div>
                </q-toolbar-title>
            </q-toolbar>
        </q-footer>

    </q-layout>
</template>
  
<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value
}




</script>


<style>
#menulateral {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 7px;
    padding: 25px;
}
#btnmenu {
    background-color: rgba(0, 153, 255, 0.527);
    font-size: 5mm;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    width: 250px;
    border-radius: 10px;
    color: black;
    display: flex;
    align-items: flex-start;
}

#btnmenu i {
    margin: 10px;
}

#btnmenu a {
    text-decoration: none;
    color: rgb(0, 0, 0);
}

#logo {
    border-radius: 30px;
    width: 250px;
    height: 250px;
}
</style>
