<template>
    <div class="container">
        <div class="login-card">
            <div class="card-header">
                <img id="fotol"
                    src="https://png.pngtree.com/png-vector/20220912/ourmid/pngtree-high-detailed-bus-vector-png-image_6172563.png"
                    alt="">
                <h1 id="Titulo">Ingresar</h1>
            </div>
            <div class="card-body">
                <form @submit="validar">
                    <div class="form-group">
                        <label for="username">Usuario</label>
                        <input v-model="username" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Contraseña</label>
                        <input v-model="password" name="password" required>
                    </div>
                    <div class="form-group">
                        <button type="button" class="login-button"><router-link to="/main" class="text-black">Ingresar</router-link></button>
                        <router-view></router-view>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";


</script>


  
<style scoped>
.container {
    margin: 0;
    padding: 0;
    display: flex;
    width: 100%;
    min-height: 100vh;
    justify-content: center;
    align-items: center;
    background-image: url(https://img.freepik.com/foto-gratis/pareja-tiro-completo-caminando-equipaje_23-2149322005.jpg?w=1380&t=st=1697576609~exp=1697577209~hmac=fc636cb17e087127ea07ec07ea0c32d79fe169fc4f35d6e01d883ab649381e56);
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
}

#fotol {
    width: 300px;
    height: 300px;
}

#Titulo {
    font-size: 3em;
    position: relative;
    top: -30px;
    margin: 0;
}

.login-card {
    background-color: #f8f8f8;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 20px;
    max-width: 700px;
    width: 500px;
    height: 750px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);

}


.card-header {
    text-align: center;

}

.card-header h1 {
    font-size: 2em;
    color: #333;
    text-shadow: 1px 1px #ddd;
}

.card-body {
    display: flex;
    align-content: stretch;
    justify-content: space-evenly;
    position: relative;
    top: -40px;
}

.form-group {
    margin-bottom: 10px;


}

.form-group label {
    display: block;
    font-size: 1.2em;
    color: #555;
    margin-bottom: 10px;
}

input[type="text"],
input[type="email"],
input[type="password"] {
    box-sizing: border-box;
    padding: 10px;
    border-radius: 5px;
    border: none;
    background-color: #f0f0f0;
    font-size: 1.2em;
    color: #555;
    box-shadow: inset 0px 2px 5px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus {
    box-shadow: inset 0px 2px 5px rgba(0, 0, 0, 0.3);
    outline: none;
}

input[type="submit"] {
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    font-size: 1.2em;
    padding: 10px;
    transition: background-color 0.3s ease;
}

input[type="submit"]:hover {
    background-color: #0069d9;
}

.login-button {
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    font-size: 1.2em;
    padding: 10px;
    width: 100%;
    margin-top: 30px;
    transition: background-color 0.3s ease;
    transition: 0.25s;
}

.login-button:hover {
    background-color: #0069d9e7;
    -webkit-box-shadow: 0px 0px 30px 0px rgba(0, 105, 217, 1);
    -moz-box-shadow: 0px 0px 30px 0px rgba(0, 105, 217, 1);
    box-shadow: 0px 0px 30px 0px rgba(0, 105, 217, 1);
}
</style>
  