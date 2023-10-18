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
            <q-btn id="btnmenu"><i class="fa-solid fa-house-user"></i> <router-link to="/menu">Menu</router-link></q-btn>
            <q-btn id="btnmenu"><i class="fa-solid fa-wallet"></i> <router-link
                    to="/vendedor">Vendedor</router-link></q-btn>
            <q-btn id="btnmenu"><i class="fa-solid fa-bus"></i><router-link to="/bus">Bus</router-link></q-btn>
            <q-btn id="btnmenu"><i class="fa-regular fa-id-card"></i><router-link
                    to="/bus">Conductores</router-link></q-btn>
            <q-btn id="btnmenu"><i class="fa-solid fa-user"></i><router-link to="/cliente">Clientes</router-link></q-btn>
            <q-btn id="btnmenu"><i class="fa-solid fa-clock"></i><router-link to="/horario">Horarios</router-link></q-btn>
        </q-drawer>
        <q-page-container class="contenedor2">
            <button class="btn2"><router-link to="/vendedor">Vendedor</router-link> <img
                    src="https://i.pinimg.com/originals/4b/7e/25/4b7e2507375f65d1ca84654fa2db6e80.png"
                    alt="" class="img"></button>
            <button class="btn2"><router-link to="/bus">Bus</router-link> <img
                    src="https://images.vexels.com/media/users/3/255197/isolated/preview/119b177c176fa0b55322a748c77159eb-escuela-escuelabus-handcutsimpleshapes-papercut-cr-8.png"
                    alt="" class="img"></button>
            <button class="btn2"><router-link to="/cliente">Cliente</router-link> <img
                    src="https://cdn-icons-png.flaticon.com/512/1138/1138021.png"
                    alt="" class="img"></button>
            <button class="btn2"><router-link to="/horario">Horario</router-link> <img
                    src="https://cdn-icons-png.flaticon.com/512/3094/3094927.png"
                    alt="" class="img"></button>
            <button class="btn2"><router-link to="/conductores">Conductor</router-link> <img
                    src="https://cdn-icons-png.flaticon.com/512/2481/2481723.png"
                    alt="" class="img"></button>
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
    gap: 50px;
    padding: 25px;
}

#btnmenu {
    background-color: rgba(0, 153, 255, 0.527);
    font-size: 5mm;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    width: 150px;
    border-radius: 10px;
    color: black;
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

.contenedor2 {
    display: flex;
    gap: 30px;
    text-align: center;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

}

.contenedor2 a {
    text-decoration: none;
    width: 250px;
    height: 250px;
    color: rgb(0, 0, 0);
    gap: 30px;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-size: 2em;
    border-radius: 50px;


}

.btn2 {
    display: flex;
    margin-top: 100px;
    flex-direction: column;
    height: 300px;
    display: grid;
    justify-items: center;
    border-radius: 30px;
    background-color: rgb(0, 140, 255);
border: none;
}


.img{
    position: relative;
    top: -190px;
    height: 200px;
    width: 200px;
}
</style>
