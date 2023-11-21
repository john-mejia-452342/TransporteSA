<template>
  <q-layout view="hHh lpR lFf">

    <q-header reveal bordered class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          TransporteSA
        </q-toolbar-title>
        <router-link to="/"><q-btn dense flat round><i class="fa-solid fa-right-from-bracket" style="color: #ffffff;"></i></q-btn></router-link>
      </q-toolbar>
      
    </q-header>
    <q-drawer id="menulateral" v-model="leftDrawerOpen" side="left" overlay elevated>
      <img id="logo" src="https://static.vecteezy.com/system/resources/thumbnails/007/794/726/small/travel-bus-illustration-logo-on-light-background-free-vector.jpg" alt=""/>
      <router-link class="link" to="/main"><q-btn id="btnmenu"><i class="fa-solid fa-house-user"></i> Menu</q-btn></router-link>
      <router-link class="link" to="/vendedor"><q-btn id="btnmenu"><i class="fa-solid fa-wallet"></i> Vendedor</q-btn></router-link>
      <router-link class="link" to="/bus"><q-btn id="btnmenu"><i class="fa-solid fa-bus"></i> Bus</q-btn></router-link>
      <router-link class="link" to="/conductor"><q-btn id="btnmenu"><i class="fa-regular fa-id-card"></i> Conductores</q-btn></router-link>
      <router-link class="link" to="/cliente"><q-btn id="btnmenu"><i class="fa-solid fa-user"></i> Clientes</q-btn></router-link>
      <router-link class="link" to="/horario"><q-btn id="btnmenu"><i class="fa-solid fa-clock"></i> Horarios</q-btn></router-link>
      <router-link class="link" to="/ruta"><q-btn id="btnmenu"><i class="fa-solid fa-map-location-dot"></i> Rutas</q-btn></router-link>
      <router-link class="link" to="/venta"><q-btn id="btnmenu"><i class="fa-solid fa-money-bill"></i> Venta Ticket</q-btn></router-link>
      <router-link class="link" to="/ticket"><q-btn id="btnmenu"><i class="fa-solid fa-ticket"></i> Tickets</q-btn></router-link>
    </q-drawer>

    <q-page-container style="padding-top:50px;">
      <router-view />
    </q-page-container>

  </q-layout>
</template>
  
<script setup>
import { ref } from "vue";

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>


<style>
#menulateral {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 7px;
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
  width: 180px;
  height: 180px;
}

.link{
  text-decoration: none;
}

</style>
