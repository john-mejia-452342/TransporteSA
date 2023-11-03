<template>
    <div class="container" >
         <q-page-container class="contenedor2" v-for="(item, index) in content" :key="index">
            <router-link :to="item.ruta" >
                <div class="card">
                    <div class="tools">
                        <div class="circle">
                            <span class="blue box"></span>
                        </div>
                        <div class="circle">
                            <span class="blue box"></span>
                        </div>
                        <div class="circle">
                            <span class="blue box"></span>
                        </div>
                    </div>
                    <div class="card__content">
                        {{item.titulo}}
                        <img :src="item.img" alt="" class="img">
                    </div>
                </div>
            </router-link>
        </q-page-container>
    </div>
</template>

<script setup>

import { ref } from "vue"

let content = ref([
    {ruta: "/vendedor", titulo: "Vendedores", img: "https://i.pinimg.com/originals/4b/7e/25/4b7e2507375f65d1ca84654fa2db6e80.png"},
    {ruta: "/bus", titulo: "Buses", img: "https://cdn-icons-png.flaticon.com/128/416/416597.png"},
    {ruta: "/cliente", titulo: "Clientes", img: "https://cdn-icons-png.flaticon.com/512/1138/1138021.png"},
    {ruta: "/horario", titulo: "Horarios", img: "https://cdn-icons-png.flaticon.com/512/3094/3094927.png"},
    {ruta: "/conductor", titulo: "Conductores", img: "https://cdn-icons-png.flaticon.com/512/2481/2481723.png"},
    {ruta: "/ruta", titulo: "Rutas", img:"https://cdn-icons-png.flaticon.com/512/8136/8136650.png" },
    {ruta: "/venta", titulo: "Venta", img:"https://cdn-icons-png.flaticon.com/512/8993/8993131.png " },
    {ruta: "/ticket", titulo: "Tickets", img:"https://cdn-icons-png.flaticon.com/512/389/389801.png " },
])

</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap');

.container{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.contenedor2 {
    display: flex;
    gap: 30px;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    flex-direction: column;
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

.img{
    position: relative;
    height: 150px;
    width: 150px;
}

.card {
    width: 190px;
    height: 260px;
    margin: 0 auto;
    background-color: #F8FBFE;
    border-radius: 8px;
    z-index: 1;
}
   
.tools {
    display: flex;
    align-items: center;
    padding: 5px;
}
   
.circle {
    padding: 0 4px;
}
   
.box {
    display: inline-block;
    align-items: center;
    width: 10px;
    height: 10px;
    padding: 1px;
    border-radius: 50%;
}
   
.blue {
    background-color: #1920e6;
}
   
.card__content{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: 'Roboto Slab', serif;
}

</style>