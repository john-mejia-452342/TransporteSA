<template>
    <div>
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
            <button class="btn2"><router-link to="/conductor">
                Conductor
                <img src="https://cdn-icons-png.flaticon.com/512/2481/2481723.png" alt="" class="img1">
            </router-link> 
            </button>
        </q-page-container>
    </div>
   

</template>

<style>


.contenedor2 {
    display: flex;
    gap: 30px;
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

.img1{

    height: 200px;
    width: 200px;
}

</style>